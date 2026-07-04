const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Visitor = require('./models/Visitor');
const User = require('./models/User');

dotenv.config();

const seedDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected!');

    const adminUser = await User.findOne();

    if (!adminUser) {
      console.error('No users found. Please register at least one user before seeding.');
      process.exit(1);
    }

    console.log('Clearing old visitors...');
    await Visitor.deleteMany();

    const dummyVisitors = [
      {
        name: 'Clark Kent',
        email: 'clark@dailyplanet.com',
        phone: '555-0101',
        hostName: 'Bruce Wayne',
        purposeOfVisit: 'Interview',
        status: 'Pending',
        createdBy: adminUser._id
      },
      {
        name: 'Lois Lane',
        email: 'lois@dailyplanet.com',
        phone: '555-0102',
        hostName: 'Diana Prince',
        purposeOfVisit: 'Press Conference',
        status: 'Checked-In',
        createdBy: adminUser._id
      },
      {
        name: 'Barry Allen',
        email: 'barry@starlabs.com',
        phone: '555-0103',
        hostName: 'Bruce Wayne',
        purposeOfVisit: 'IT Support',
        status: 'Checked-Out',
        createdBy: adminUser._id
      }
    ];

    console.log('Inserting dummy data...');
    await Visitor.insertMany(dummyVisitors);
    
    console.log('Database successfully seeded!');
    process.exit(0);

  } catch (error) {
    console.error('Error seeding data:', error.message);
    process.exit(1);
  }
};

seedDatabase();