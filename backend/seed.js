const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./models/User'); // Adjust path if needed
require('dotenv').config();

const seedDatabase = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB. Wiping old data...");
    
    await User.deleteMany(); // Clear out the old mess

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('password123', salt);

    const users = [
      {
        name: 'System Admin',
        email: 'admin@visitorpass.com',
        password: hashedPassword,
        role: 'Admin'
      },
      {
        name: 'Front Desk Security',
        email: 'security@visitorpass.com',
        password: hashedPassword,
        role: 'Security'
      },
      {
        name: 'Bruce Wayne',
        email: 'bruce@wayneenterprises.com',
        password: hashedPassword,
        role: 'Employee'
      },
      {
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        password: hashedPassword,
        role: 'Visitor'
      }
    ];

    await User.insertMany(users);
    console.log("Success! Admin, Security, Employee, and Visitor seeded.");
    process.exit();
  } catch (error) {
    console.error("Seeding failed:", error);
    process.exit(1);
  }
};

seedDatabase();