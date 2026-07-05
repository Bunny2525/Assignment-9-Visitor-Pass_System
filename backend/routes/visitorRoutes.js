const express = require('express');
const { 
  getVisitors, 
  requestVisit, 
  updateAppointmentStatus, 
  handleQRScan 
} = require('../controllers/visitorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

const router = express.Router();

// 1. Dashboard Data: Everyone logged in can see their relevant data
router.get(
  '/', 
  protect, 
  authorizeRoles('Admin', 'Security', 'Employee', 'Visitor'), 
  getVisitors
);

// 2. Request an Appointment: Visitors (and Admins) can request visits
router.post(
  '/request', 
  protect, 
  authorizeRoles('Visitor', 'Admin', 'Employee'), 
  requestVisit
);

// 3. Approve/Reject Appointment: Only Employees and Admins can approve passes (Req 1)
router.put(
  '/:id/status', 
  protect, 
  authorizeRoles('Employee', 'Admin'), 
  updateAppointmentStatus
);

// 4. Scan QR Code: ONLY Security guards and Admins can scan badges (Req 1 & 7)
router.post(
  '/scan', 
  protect, 
  authorizeRoles('Security', 'Admin'), 
  handleQRScan
);

module.exports = router;