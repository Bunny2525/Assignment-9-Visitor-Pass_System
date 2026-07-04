const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  purposeOfVisit: { type: String, required: true },
  hostName: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['Pending', 'Approved', 'Checked-In', 'Checked-Out'], 
    default: 'Pending' 
  },
  qrCodeUrl: { type: String, default: '' },
  photo: { type: String, default: '' }, // Base64 string
  createdBy: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User',
    required: true
  }
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Visitor', visitorSchema);