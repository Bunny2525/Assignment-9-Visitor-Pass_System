# Visitor Pass Management System (MERN)

## 📌 Project Objective
A full-stack Visitor Pass Management System built using the MERN stack (MongoDB, Express, React, Node.js). This application digitizes the visitor management process, allowing organizations to securely register visitors, capture live photos, issue QR-code passes, and seamlessly track check-in/check-out logs via webcam integration.

## 🚀 Features Implemented
* **Secure Authentication (RBAC):** JWT-based login system with Role-Based Access Control for Admins and Security personnel.
* **Visitor Pre-Registration & Photo Capture:** Digital forms to register visitors, including Base64 image upload for security photos.
* **Dynamic QR Codes:** Automatically generates a unique, encoded QR code pass for every registered visitor.
* **Live Webcam QR Scanner:** Integrated frontend camera support to scan visitor QR codes and instantly update their status.
* **Check-In/Check-Out System:** Real-time status tracking (Pending -> Checked-In -> Checked-Out) directly from the dashboard.
* **Search & Filter:** Dynamic search bar to instantly find specific visitors by name.
* **CSV Data Export:** Role-restricted (Admin-only) one-click export of all dashboard data to a spreadsheet.
* **PDF Badge Generation:** Converts a visitor's card (including their photo and QR code) into a downloadable PDF badge.

## 💻 Tech Stack
* **Frontend:** React.js, React Router, Axios, jsPDF, html2canvas, @zxing/library (QR Scanner)
* **Backend:** Node.js, Express.js, qrcode
* **Database:** MongoDB Atlas (Mongoose)
* **Authentication:** bcryptjs, JSON Web Tokens (JWT)

---

## 🚧 Challenges Faced & Technical Solutions

To ensure a highly optimized and secure application, several architectural challenges were addressed during development:

1. **Eliminating Framework Boilerplate for Custom Architecture:**
   * **Challenge:** Initializing the React and Node environments generated significant boilerplate (e.g., Create React App defaults) which obscured the custom architecture of the Visitor Pass system. 
   * **Solution:** I manually stripped out all default configurations and unused assets (such as `reportWebVitals`, default SVGs, and placeholder CSS), and explicitly tailored the entry points (`index.js` and `server.js`) to maintain a strict, clean, and hand-crafted execution flow.

2. **Handling Large Image Payloads (Base64):**
   * **Challenge:** When attempting to send the visitor's captured photo to the backend, the server crashed with a `PayloadTooLargeError` because default Express setups restrict incoming data sizes.
   * **Solution:** Instead of relying on generic error handling, I explicitly configured the backend middleware using `app.use(express.json({ limit: '50mb' }))` to safely and reliably accommodate Base64 image strings.

3. **Webcam State Management & Hardware Cleanup:**
   * **Challenge:** The webcam scanner component would occasionally remain active in the background even after the modal was closed, causing memory leaks and locking the camera hardware.
   * **Solution:** I implemented a strict React `useEffect` cleanup function within the `QRScanner` component (`return () => codeReader.reset();`). This ensures the camera hardware fully disconnects the moment the component unmounts from the DOM.

4. **Securing Environment Variables:**
   * **Challenge:** Ensuring the MongoDB connection URI and JWT secret keys were completely protected in both development and version control.
   * **Solution:** I implemented a strict `.env` and `.gitignore` strategy across both the frontend and backend directories, ensuring no sensitive credentials were ever leaked to the repository. I provided a safe `.env.example` file for environment replication.

---

## 📁 Project Structure


visitor-pass-system/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── visitorController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Visitor.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── visitorRoutes.js
│   ├── .env.example        
│   ├── .gitignore          
│   ├── package.json
│   ├── seed.js             
│   └── server.js           
│
└── frontend/
    ├── public/
    │   ├── favicon.ico
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── AddVisitor.js
    │   │   ├── Dashboard.js
    │   │   ├── Login.js
    │   │   └── QRScanner.js
    │   ├── App.css
    │   ├── App.js
    │   ├── index.css
    │   └── index.js
    ├── .gitignore          
    └── package.json


## 🛠️ Installation & Setup Guide

1. Prerequisites
Node.js installed on your machine.

A MongoDB Atlas account and cluster URI.

2. Backend Setup
Open a terminal and navigate to the backend directory:

Bash
cd backend
Install the required dependencies:

Bash
npm install
Create a .env file in the backend folder using the provided .env.example as a template:

Code snippet
MONGO_URI=your_mongodb_connection_string
PORT=5000
JWT_SECRET=your_jwt_secret_key
Start the backend server:

Bash
npm start
3. Frontend Setup
Open a new terminal window and navigate to the frontend directory:

Bash
cd frontend
Install the required dependencies:

Bash
npm install
Start the React development server:

Bash
npm start
🧪 Running the Demo (Seed Data)
To make testing seamless for reviewers, this project includes a database seeding script that automatically generates Admin/Security accounts and pre-populates dummy visitors.

Ensure your backend server is stopped temporarily.

In the backend terminal, run:

Bash
node seed.js
Once you see the success message, restart your backend server (npm start).

You can now log into the frontend using the generated Admin credentials:

Email: admin@visitorpass.com

Password: password123