const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');

// 1. Fetch all visitors for the Dashboard
const getVisitors = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('visitorId', 'name email phone photo qrCodeUrl')
      .populate('hostId', 'name');

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

// 2. Create a new visit request
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

// 3. Approve, Reject, or Check-In a visit
const updateAppointmentStatus = async (req, res) => {
  try {
    const appointmentId = req.params.id;
    const { newStatus } = req.body; 

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    // FIX 1: Allow Checked-In and Checked-Out to pass the guard
    const allowedStatuses = ['Approved', 'Rejected', 'Checked-In', 'Checked-Out'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status update.' });
    }

    appointment.status = newStatus;
    await appointment.save();

    const visitor = await User.findById(appointment.visitorId);

    if (visitor) {
      const subject = `Visitor Pass Status: ${newStatus}`;
      const message = `Hello ${visitor.name},\n\nYour request to visit on ${appointment.dateOfVisit} has been ${newStatus} by the host.\n\nPurpose: ${appointment.purposeOfVisit}`;
      
      // FIX 2: Wrap notifications in a try/catch so fake API keys don't crash the server
      try {
        await sendEmail(visitor.email, subject, message);
        if (visitor.phone) {
          await sendSMS(visitor.phone, `Visitor System: Your pass has been ${newStatus}.`);
        }
      } catch (apiError) {
        console.log(`Notification skipped for ${newStatus} (Check .env keys)`);
      }
    }

    return res.status(200).json({ 
      message: `Appointment updated to ${newStatus}.`,
      appointment: appointment
    });

  } catch (error) {
    console.log("Error in updateAppointmentStatus:", error.message);
    return res.status(500).json({ message: 'Server error while updating status.' });
  }
};

// 4. Scan QR Code at Front Desk
const handleQRScan = async (req, res) => {
  try {
    console.log("--- QR SCAN INITIATED ---");
    console.log("Request Body:", req.body);
    console.log("User from Token:", req.user);

    const { appointmentId } = req.body;

    if (!appointmentId) {
      console.log("FAILED: No appointmentId in req.body");
      return res.status(400).json({ message: 'No appointment ID provided.' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      console.log("FAILED: Appointment not found in DB");
      return res.status(404).json({ message: 'Appointment not found.' });
    }

    let newAction = '';
    
    // TEMPORARY FIX FOR DEMO: Allow Pending to go straight to Checked-In if the frontend button sends it that way.
    if (appointment.status === 'Approved' || appointment.status === 'Pending') {
      appointment.status = 'Checked-In';
      newAction = 'Check-In';
    } else if (appointment.status === 'Checked-In') {
      appointment.status = 'Checked-Out';
      newAction = 'Check-Out';
    } else {
      console.log("FAILED: Status is already", appointment.status);
      return res.status(400).json({ 
        message: `Cannot scan. Current appointment status is: ${appointment.status}` 
      });
    }

    await appointment.save();
    console.log("Success: Appointment status changed to Checked-In");

    // Wrap the log creation so it doesn't crash the whole request if it fails
    try {
        const newLog = new CheckLog({
          appointmentId: appointment._id,
          scannedBySecurityId: req.user ? req.user.userId : null, // Handle missing token gracefully
          actionType: newAction,
          timestamp: new Date()
        });
        await newLog.save();
        console.log("Success: Audit log created.");
    } catch (logError) {
        console.log("WARNING: Failed to save CheckLog.", logError.message);
    }

    return res.status(200).json({
      message: `Successfully recorded ${newAction}.`,
      currentStatus: appointment.status
    });

  } catch (error) {
    console.log("FATAL Error in handleQRScan:", error.message);
    return res.status(500).json({ message: 'Server error during scan.' });
  }
};
module.exports = {
  getVisitors,
  requestVisit,
  updateAppointmentStatus,
  handleQRScan
};