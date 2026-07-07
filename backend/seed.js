const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const qrcode = require('qrcode');
const User = require('./models/User');
const Appointment = require('./models/Appointment');
const CheckLog = require('./models/CheckLog');
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    await User.deleteMany(); 
    await Appointment.deleteMany();
    await CheckLog.deleteMany();

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const admin = await User.create({
      name: 'System Admin',
      email: 'admin@visitorpass.com',
      password: hashedPassword,
      role: 'Admin'
    });

    const security = await User.create({
      name: 'Front Desk Security',
      email: 'security@visitorpass.com',
      password: hashedPassword,
      role: 'Security'
    });

    const employee = await User.create({
      name: 'Bruce Wayne',
      email: 'bruce@wayneenterprises.com',
      password: hashedPassword,
      role: 'Employee'
    });

    const visitor = await User.create({
      name: 'Clark Kent',
      email: 'clark@dailyplanet.com',
      password: hashedPassword,
      role: 'Visitor'
    });

    const appointmentId = new mongoose.Types.ObjectId();
    const generatedQrCodeUrl = await qrcode.toDataURL(appointmentId.toString());

    const today = new Date();
    const appointment = await Appointment.create({
      _id: appointmentId,
      visitorId: visitor._id,
      hostId: employee._id,
      dateOfVisit: today.toISOString().split('T')[0],
      purposeOfVisit: 'Interview',
      status: 'Checked-In',
      qrCodeUrl: generatedQrCodeUrl 
    });

    await CheckLog.create({
      appointmentId: appointment._id,
      scannedBySecurityId: security._id,
      actionType: 'Check-In',
      timestamp: new Date()
    });

    process.exit();
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();