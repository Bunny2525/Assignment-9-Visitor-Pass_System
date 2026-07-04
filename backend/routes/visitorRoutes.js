const express = require('express');
const { createVisitor, getVisitors, updateVisitorStatus } = require('../controllers/visitorController');
const { protect } = require('../middleware/authMiddleware'); 

const router = express.Router();

// Protected visitor routes
router.post('/register', protect, createVisitor);
router.get('/', protect, getVisitors);
router.put('/:id/status', protect, updateVisitorStatus);

module.exports = router;