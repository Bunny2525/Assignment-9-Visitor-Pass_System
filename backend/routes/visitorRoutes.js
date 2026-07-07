const express = require('express');
const multer = require('multer');
const { 
  getVisitors, 
  requestVisit, 
  updateAppointmentStatus, 
  handleQRScan 
} = require('../controllers/visitorController');
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});

const upload = multer({ storage });

router.get('/', protect, authorizeRoles('Admin', 'Security', 'Employee', 'Visitor'), getVisitors);
router.post('/request', protect, authorizeRoles('Visitor', 'Admin', 'Employee'), upload.single('photo'), requestVisit);
router.put('/:id/status', protect, authorizeRoles('Employee', 'Admin'), updateAppointmentStatus);
router.post('/scan', protect, authorizeRoles('Security', 'Admin'), handleQRScan);

module.exports = router;