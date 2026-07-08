const Appointment = require('../models/Appointment');
const CheckLog = require('../models/CheckLog');
const User = require('../models/User');
const sendEmail = require('../utils/sendEmail');
const sendSMS = require('../utils/sendSMS');
const QRCode = require('qrcode');

const getVisitors = async (req, res) => {
  try {
    const appointments = await Appointment.find()
      .populate('visitorId', 'name email phone photo qrCodeUrl')
      .populate('hostId', 'name');

    const formattedData = await Promise.all(appointments.map(async (appt) => {
      let qr = appt.qrCodeUrl || (appt.visitorId ? appt.visitorId.qrCodeUrl : null);

      if (!qr) {
        // Updated self-healing loop to use the new JSON format
        qr = await QRCode.toDataURL(JSON.stringify({ appointmentId: appt._id.toString() }));
      }


      return {
        _id: appt._id,
        name: appt.visitorId ? appt.visitorId.name : 'Unknown Visitor',
        email: appt.visitorId ? appt.visitorId.email : '',
        phone: appt.visitorId ? appt.visitorId.phone : '',
        photo: appt.visitorId ? appt.visitorId.photo : null,
        qrCodeUrl: qr,
        hostName: appt.hostId ? appt.hostId.name : 'Unknown Host',
        purposeOfVisit: appt.purposeOfVisit,
        status: appt.status,
        createdAt: appt.createdAt
      };
    }));

    res.status(200).json(formattedData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error fetching visitors' });
  }
};

const requestVisit = async (req, res) => {
  try {
    const { hostId, dateOfVisit, purposeOfVisit } = req.body;

    if (!hostId || !dateOfVisit || !purposeOfVisit) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const newAppointment = new Appointment({
      visitorId: req.user.userId,
      hostId,
      dateOfVisit,
      purposeOfVisit,
      status: 'Pending'
    });

    // Creating a structured JSON object for the QR code instead of raw text
    const qrPayload = JSON.stringify({ appointmentId: newAppointment._id.toString() });
    const qrCodeData = await QRCode.toDataURL(qrPayload);
    newAppointment.qrCodeUrl = qrCodeData;

    await newAppointment.save();

    if (req.file) {
      await User.findByIdAndUpdate(req.user.userId, { photo: req.file.path });
    }

    res.status(201).json({
      message: 'Visit requested successfully',
      appointment: newAppointment
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error creating request' });
  }
};

const updateAppointmentStatus = async (req, res) => {
  try {
    const { newStatus } = req.body;
    const appointment = await Appointment.findById(req.params.id);

    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    const allowedStatuses = ['Approved', 'Rejected', 'Checked-In', 'Checked-Out'];
    if (!allowedStatuses.includes(newStatus)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    appointment.status = newStatus;
    await appointment.save();

    let notificationAlert = "No contact info found";

    const visitor = await User.findById(appointment.visitorId);
    if (visitor) {
      const subject = `Visitor Pass Status: ${newStatus}`;
      const message = `Hello ${visitor.name},\n\nYour visit on ${appointment.dateOfVisit} is now ${newStatus}.\n\nPurpose: ${appointment.purposeOfVisit}`;

      try {
        await sendEmail(visitor.email, subject, message);
        if (visitor.phone) {
          await sendSMS(visitor.phone, `Visitor System: Your pass is ${newStatus}.`);
        }
        notificationAlert = "Notifications sent successfully";
      } catch (notifyErr) {
        console.error('email/sms crashed:', notifyErr);
        notificationAlert = "Status updated, but notifications failed";
      }
    }

    res.status(200).json({ 
      message: `Status updated to ${newStatus}`, 
      alert: notificationAlert,
      appointment 
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error updating status' });
  }
};
const handleQRScan = async (req, res) => {
  try {
    const { appointmentId } = req.body;

    if (!appointmentId) {
      return res.status(400).json({ message: 'Appointment ID required' });
    }

    const appointment = await Appointment.findById(appointmentId);
    if (!appointment) {
      return res.status(404).json({ message: 'Appointment not found' });
    }

    let newAction = '';
    if (appointment.status === 'Approved' || appointment.status === 'Pending') {
      appointment.status = 'Checked-In';
      newAction = 'Check-In';
    } else if (appointment.status === 'Checked-In') {
      appointment.status = 'Checked-Out';
      newAction = 'Check-Out';
    } else {
      return res.status(400).json({ message: `Invalid scan state: ${appointment.status}` });
    }

    await appointment.save();

    try {
      await CheckLog.create({
        appointmentId: appointment._id,
        scannedBySecurityId: req.user ? req.user.userId : null,
        actionType: newAction,
        timestamp: new Date()
      });
    } catch (logErr) {
      console.error('Audit log creation failed');
    }

    res.status(200).json({
      message: `Successfully recorded ${newAction}`,
      currentStatus: appointment.status
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error during scan' });
  }
};

module.exports = {
  getVisitors,
  requestVisit,
  updateAppointmentStatus,
  handleQRScan
};