const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllComplaints,
  getComplaintsByStatus,
  getStudentComplaints,
  getComplaintById,
  createComplaint,
  updateComplaintStatus,
  addComment,
  getComplaintStats,
  deleteComplaint
} = require('../controllers/complaintController');

// Protect all routes
router.use(protect);

// Get all complaints - Admin and Staff only
router.get('/', authorize('admin', 'staff'), getAllComplaints);

// Get complaints by status - Admin and Staff only
router.get('/status/:status', authorize('admin', 'staff'), getComplaintsByStatus);

// Get complaint statistics - Admin and Staff only
router.get('/stats', authorize('admin', 'staff'), getComplaintStats);

// Get student's complaints - Student only
router.get('/student', authorize('student'), getStudentComplaints);

// Get complaint by ID - All roles (with access control in controller)
router.get('/:id', getComplaintById);

// Create new complaint - Student only
router.post(
  '/',
  authorize('student'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('category', 'Category is required').not().isEmpty(),
    check('roomId', 'Room ID is required').not().isEmpty()
  ],
  createComplaint
);

// Update complaint status - Admin and Staff only
router.put(
  '/:id/status',
  authorize('admin', 'staff'),
  [
    check('status', 'Status is required').not().isEmpty()
  ],
  updateComplaintStatus
);

// Add comments to a complaint - All roles (with access control in controller)
router.post(
  '/:id/comments',
  [
    check('comment', 'Comment is required').not().isEmpty()
  ],
  addComment
);

// Delete a complaint - Admin and Owner only (with access control in controller)
router.delete('/:id', deleteComplaint);

module.exports = router;