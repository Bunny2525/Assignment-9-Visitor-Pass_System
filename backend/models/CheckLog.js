const mongoose = require('mongoose');

// Schema to keep a secure audit trail of all front desk QR scans
const checkLogSchema = new mongoose.Schema({
  appointmentId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Appointment', // which specific visit was scanned
    required: true
  },
  scannedBySecurityId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // which security guard performed the scan
    required: true
  },
  actionType: {
    type: String,
    enum: ['Check-In', 'Check-Out'],
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now // records the exact moment the QR code was scanned
  }
});

module.exports = mongoose.model('CheckLog', checkLogSchema);