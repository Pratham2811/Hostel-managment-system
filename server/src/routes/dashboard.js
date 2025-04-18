const express = require('express');
const router = express.Router();
const { protect, authorize } = require('../middleware/auth');
const {
  getDashboardStats,
  getStudentDashboardStats,
  getHostelStats
} = require('../controllers/dashboardController');

// Protect all routes
router.use(protect);

// Get admin dashboard statistics
router.get('/stats', authorize('admin'), getDashboardStats);

// Get student dashboard statistics
router.get('/student-stats', authorize('student'), getStudentDashboardStats);

// Get hostel statistics by block
router.get('/hostel-stats', authorize('admin', 'staff'), getHostelStats);

module.exports = router;