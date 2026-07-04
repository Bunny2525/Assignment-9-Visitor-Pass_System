const Visitor = require('../models/Visitor');
const QRCode = require('qrcode');

// Register a new visitor and generate a QR code pass
const createVisitor = async (req, res, next) => {
  try {
    const { name, email, phone, purposeOfVisit, hostName, photo } = req.body;

    const visitor = new Visitor({
      name,
      email,
      phone,
      purposeOfVisit,
      hostName,
      photo,
      createdBy: req.user.userId 
    });

    // Encode visitor ID and name into the QR code
    const qrData = JSON.stringify({ 
      visitorId: visitor._id, 
      name: visitor.name 
    });
    
    const qrCodeImage = await QRCode.toDataURL(qrData);
    visitor.qrCodeUrl = qrCodeImage;

    await visitor.save();

    // Simulate email notification
    console.log(`\n=========================================`);
    console.log(`[EMAIL SYSTEM] ✉️ Simulated Email Sent!`);
    console.log(`To: ${visitor.email}`);
    console.log(`Subject: Visitor Pass Confirmed`);
    console.log(`Message: Hello ${visitor.name}, your pass is ready!`);
    console.log(`=========================================\n`);

    // Simulate SMS notification
    console.log(`[SMS SYSTEM] 📱 Text message sent to ${visitor.phone}: "Your visitor pass for ${visitor.hostName} is ready!"\n`);

    res.status(201).json({ message: 'Visitor registered successfully!', visitor });
  } catch (error) {
    next(error);
  }
};

// Retrieve all visitors, sorted by newest first
const getVisitors = async (req, res, next) => {
  try {
    const visitors = await Visitor.find().sort({ createdAt: -1 });
    res.status(200).json(visitors);
  } catch (error) {
    next(error);
  }
};

// Update visitor status (e.g., Pending -> Checked-In -> Checked-Out)
const updateVisitorStatus = async (req, res, next) => {
  try {
    const visitorId = req.params.id;
    const newStatus = req.body.status;

    const updatedVisitor = await Visitor.findByIdAndUpdate(
      visitorId,
      { status: newStatus },
      { new: true } 
    );

    res.status(200).json(updatedVisitor);
  } catch (error) {
    next(error);
  }
};

module.exports = { createVisitor, getVisitors, updateVisitorStatus };