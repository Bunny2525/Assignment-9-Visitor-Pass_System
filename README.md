# Visitor Pass Management System (MERN)

## 📌 Project Objective
A full-stack, production-ready Visitor Pass Management System built using the MERN stack (MongoDB, Express, React, Node.js). This application digitizes and secures the visitor lifecycle, allowing organizations to securely request visits, capture live photos, issue dynamic QR-code passes, and maintain strict, auditable check-in/check-out logs via an integrated webcam scanner.

## 🚀 Features Implemented
* **Strict Role-Based Access Control (RBAC):** JWT-based authentication enforcing the Principle of Least Privilege across four distinct roles: System Admin, Security, Employee, and Visitor.
* **Relational Database Architecture:** Segregated data models linking `Users` (Hosts/Security), `Appointments` (Visitor Requests), and `CheckLogs` (Audit Trails) via MongoDB ObjectIds.
* **Real-Time Notifications:** Integrated real-world APIs to dispatch automated alerts. Uses **Nodemailer** for email updates and **Twilio** for SMS notifications when passes are approved or visitors arrive.
* **Dynamic QR Codes & Live Webcam Scanner:** Automatically generates unique QR codes for approved passes. Security personnel can use the integrated frontend camera to scan QR codes, which instantly writes to an immutable Audit Log.
* **Advanced Dashboard Filtering:** Procedural, state-driven multi-filtering allowing users to query visitor records by Name, Host, Status (Pending/Approved/Checked-In), and Date (Today/This Week).
* **CSV & PDF Export:** Role-restricted (Admin-only) one-click export of dashboard data to a CSV spreadsheet, alongside downloadable PDF visitor badges generated via canvas rendering.

## 💻 Tech Stack
* **Frontend:** React 18, React Router v6, Axios, jsPDF, html2canvas, @zxing/library (QR Scanner)
* **Backend:** Node.js, Express.js, Mongoose, qrcode, Nodemailer, Twilio, Multer
* **Database:** MongoDB Atlas
* **Security:** bcryptjs, JSON Web Tokens (JWT), strict root `.gitignore` policies

---

## 🚧 Architectural Challenges & Solutions

To ensure a highly optimized and secure application, several architectural challenges were addressed during development:

1. **Enforcing Relational Data & Audit Trails:**
   * **Challenge:** Storing all visitor data in a single, flat document created data redundancy and lacked accountability for security scans.
   * **Solution:** Overhauled the database into a relational structure (`User`, `Appointment`, `CheckLog`). Now, visitors are tied to Employee `hostIds`, and every QR scan generates a distinct `CheckLog` entry, ensuring a 100% accurate security audit trail.

2. **Transitioning from Mock Data to Real-World APIs:**
   * **Challenge:** Relying on `console.log` for notifications does not reflect production environment standards.
   * **Solution:** Integrated the `nodemailer` and `twilio` SDKs. Built dedicated utility modules to securely handle third-party API keys and dispatch physical SMS messages and emails during state changes (e.g., Host Approval).

3. **Global Git & Credential Security:**
   * **Challenge:** Managing nested `.gitignore` files in a monorepo increases the risk of accidentally pushing sensitive `.env` files to version control.
   * **Solution:** Implemented a unified, root-level `.gitignore` configuration. Cleared the Git cache to untrack previously cached files, guaranteeing that production database URIs and Twilio secrets remain strictly local, while preserving a safe `.env.example` blueprint for deployment.

4. **Hardware Cleanup & Payload Constraints:**
   * **Challenge:** Multer photo uploads and the React webcam component caused memory leaks if not unmounted properly.
   * **Solution:** Configured Express to safely parse form-data and static uploads, and utilized React `useEffect` cleanup functions (`codeReader.reset()`) to sever hardware camera connections immediately upon component unmount.

---

## 📁 Project Structure


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
│   │   ├── favicon.ico
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── AddVisitor.js
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── QRScanner.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── .gitignore               # Root-level unified gitignore
└── README.md


🛠️ Installation & Setup Guide

1. Prerequisites
Node.js installed on your machine.

A MongoDB Atlas account and cluster URI.

(Optional) Twilio Account SID/Auth Token and a Gmail App Password for live notifications.

2. Backend Setup
Open a terminal and navigate to the backend directory:

Bash
cd backend
npm install
Create a .env file in the backend folder using .env.example as a template:

Code snippet
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

Bash
npm start
3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
npm install
npm start
🧪 Running the Demo (Seed Data)
To make testing seamless for reviewers, this project includes a database seeding script that automatically generates test users for all four RBAC roles, along with sample appointments and audit logs.

Ensure your backend server is stopped temporarily. In the backend terminal, run:

Bash
node seed.js
Once you see the success message, restart your backend server (npm start). You can now log into the frontend using the generated credentials:

Admin: admin@visitorpass.com | password123

Security: security@visitorpass.com | password123

Employee (Host): bruce@wayneenterprises.com | password123

Visitor: clark@dailyplanet.com | password123

🌐 Deployment Repository: https://github.com/Bunny2525/Assignment-9-Visitor-Pass_System.git