const mongoose = require('mongoose');

// Schema for tracking visit requests
const appointmentSchema = new mongoose.Schema({
  visitorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link to the visitor's user account
    required: true
  },
  hostId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // link to the employee acting as the host
    required: true
  },
  dateOfVisit: {
    type: Date,
    required: true
  },
  purposeOfVisit: {
    type: String,
    required: true
  },
  status: {
    type: String,
    // The visit starts as Pending.
    // An employee will update it to Approved or Rejected.
    // Later, the front desk security will update it to Checked-In or Checked-Out.
    enum: ['Pending', 'Approved', 'Rejected', 'Checked-In', 'Checked-Out'],
    default: 'Pending'
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt dates
});

module.exports = mongoose.model('Appointment', appointmentSchema);