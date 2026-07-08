# Visitor Pass Management System

A full-stack application built to track visitors, generate QR codes, and manage check-ins using the MERN stack.

## 🛠️ Installation

### 1. Prerequisites
* Node.js installed on your machine.
* A MongoDB Atlas account and cluster URI.

### 2. Backend Setup
Open a terminal and navigate to the backend directory:

cd backend
npm install

Create a .env file in the backend folder using .env.example as a template:

MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key

# External APIs
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
TWILIO_ACCOUNT_SID=your_twilio_sid
TWILIO_AUTH_TOKEN=your_twilio_token
TWILIO_PHONE_NUMBER=your_twilio_number

Start the backend server:

npm start

3. Frontend Setup

Open a new terminal window and navigate to the frontend directory:

cd frontend
npm install
npm start

🧪 Running the Demo (Seed Data)

To make testing seamless, this project includes a database seeding script that automatically generates test users for all four roles, along with sample appointments and audit logs.

Ensure your backend server is stopped temporarily. In the backend terminal, run:

node seed.js
Once you see the success message, restart your backend server (npm start). You can now log into the frontend using the generated credentials:

Admin: admin@visitorpass.com | password123

Security: security@visitorpass.com | password123

Employee (Host): bruce@wayneenterprises.com | password123

Visitor: clark@dailyplanet.com | password123

📁 Project Structure

VISITOR-PASS-SYSTEM/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── visitorController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── Appointment.js
│   │   ├── CheckLog.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── visitorRoutes.js
│   ├── utils/
│   │   ├── sendEmail.js
│   │   └── sendSMS.js
│   ├── uploads/               # Local storage for Multer images (Git Ignored)
│   ├── .env                   # Ignored by Git
│   ├── .env.example           # Tracked template
│   ├── package.json
│   ├── seed.js            
│   └── server.js          
│
├── frontend/
│   ├── public/
│   │   ├── favicon.icon
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddVisitor.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── QRScanner.js
│   │   ├── App.js
|   |   ├── config.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore               # Root-level unified gitignore
└── README.md

## 🚧 Challenges and Learnings

The hardest part of fixing this project was rewriting the authController.js file from scratch so I could understand how the login logic actually works. I also had to update the QR scanner so it accepted JSON instead of raw text, which stopped the app from crashing. Through this resubmission, I learned that if I rely too much on AI, the code looks too perfect, and I end up skipping the actual learning process. Doing this manually helped me finally understand how the whole app connects.

🌐 Deployment Repository:

https://github.com/Bunny2525/Assignment-9-Visitor-Pass_System.git