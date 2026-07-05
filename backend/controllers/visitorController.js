const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS'); // CRITICAL: Added SMS utility

// 1. Fetch all visitors for the Dashboard (Required for frontend to work)
const getVisitors = async (req, res) => {
  try {
    // Populate the ObjectIds to get the actual names of the Visitor and the Host
    const appointments = await Appointment.find()
      .populate('visitorId', 'name email phone photo qrCodeUrl')
      .populate('hostId', 'name');

    // Format the data so your React frontend Dashboard can read it easily
    const formattedData = appointments.map(appt => ({
      _id: appt._id,
      name: appt.visitorId ? appt.visitorId.name : 'Unknown Visitor',
      email: appt.visitorId ? appt.visitorId.email : '',
      phone: appt.visitorId ? appt.visitorId.phone : '',
      photo: appt.visitorId ? appt.visitorId.photo : null,
      qrCodeUrl: appt.visitorId ? appt.visitorId.qrCodeUrl : null,
      hostName: appt.hostId ? appt.hostId.name : 'Unknown Host',
      purposeOfVisit: appt.purposeOfVisit,
      status: appt.status,
      createdAt: appt.createdAt
    }));

    return res.status(200).json(formattedData);
  } catch (error) {
    console.log("Error in getVisitors:", error.message);
    return res.status(500).json({ message: 'Server error while fetching visitors.' });
  }
};

// 2. Create a new visit request (Used by Visitors)
const requestVisit = async (req, res) => {
  try {
    const { hostId, dateOfVisit, purposeOfVisit } = req.body;

    if (!hostId || !dateOfVisit || !purposeOfVisit) {
      return res.status(400).json({ message: 'Please provide all required fields.' });
    }

    const newAppointment = new Appointment({
      visitorId: req.user.userId,
      hostId: hostId,
      dateOfVisit: dateOfVisit,
      purposeOfVisit: purposeOfVisit,
      status: 'Pending'
    });

    await newAppointment.save();

    return res.status(201).json({
      message: 'Visit request created successfully. Waiting for host approval.',
      appointment: newAppointment
    });

  } catch (error) {
    console.log("Error in requestVisit:", error.message);
    return res.status(500).json({ message: 'Server error while creating request.' });
  }
};


// 3. Approve or Reject a visit (Req 4 & 5: Email and SMS Notifications)
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { newStatus } = req.body; 

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    if (newStatus !== 'Approved' && newStatus !== 'Rejected') {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    appointment.status = newStatus;
    await appointment.save();

    const visitor = await User.findById(appointment.visitorId);

    if (visitor) {
      const subject = `Visitor Pass Status: ${newStatus}`;
      const message = `Hello ${visitor.name},\n\nYour request to visit on ${appointment.dateOfVisit} has been ${newStatus} by the host.\n\nPurpose: ${appointment.purposeOfVisit}`;
      
      // Req 4: Trigger the real Nodemailer utility function
      await sendEmail(visitor.email, subject, message);
      
      // Req 5: Trigger the real SMS Twilio utility function (if they have a phone number)
      if (visitor.phone) {
        await sendSMS(visitor.phone, `Visitor System: Your pass has been ${newStatus}. Check email for details.`);
      }
    }

    return res.status(200).json({ 
      message: `Appointment updated to ${newStatus}. Notifications sent.`,
      appointment: appointment
    });

  } catch (error) {
    console.log("Error in updateAppointmentStatus:", error.message);
    return res.status(500).json({ message: 'Server error while updating status.' });
  }
};


// 4. Scan QR Code at Front Desk (Req 7: Audit Trails)
const handleQRScan = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'No appointment ID provided.' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    let newAction = '';
    
    if (appointment.status === 'Approved') {
      appointment.status = 'Checked-In';
      newAction = 'Check-In';
    } else if (appointment.status === 'Checked-In') {
      appointment.status = 'Checked-Out';
      newAction = 'Check-Out';
    } else {
      return res.status(400).json({ 
        message: `Cannot scan. Current appointment status is: ${appointment.status}` 
      });
    }

    await appointment.save();

    // Create the secure audit log for Requirement 7
    const newLog = new CheckLog({
      appointmentId: appointment._id,
      scannedBySecurityId: req.user.userId,
      actionType: newAction,
      timestamp: new Date()
    });

    await newLog.save();

    return res.status(200).json({
      message: `Successfully recorded ${newAction}.`,
      currentStatus: appointment.status
    });

  } catch (error) {
    console.log("Error in handleQRScan:", error.message);
    return res.status(500).json({ message: 'Server error during scan.' });
  }
};

module.exports = {
  getVisitors, // CRITICAL: Exported for the dashboard
  requestVisit,
  updateAppointmentStatus,
  handleQRScan
};