const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllComplaints,
  getComplaintsByStatus,
  getMyComplaints, // Changed from getStudentComplaints
  getComplaintById,
  createComplaint,
  updateComplaint, // Changed from updateComplaintStatus
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

// Get student's complaints - Student only (fixed function name)
router.get('/student', authorize('student'), getMyComplaints);

// Get complaint by ID - All roles
router.get('/:id', getComplaintById);

// Create new complaint - Student only
router.post(
  '/',
  authorize('student'),
  [
    check('title', 'Title is required').not().isEmpty(),
    check('description', 'Description is required').not().isEmpty(),
    check('type', 'Type is required').not().isEmpty(), // Changed from category
    check('priority', 'Priority is required').optional()
  ],
  createComplaint
);

// Update complaint - Admin and Staff only (fixed function name)
router.put(
  '/:id',
  authorize('admin', 'staff'),
  [
    check('status', 'Status is required').optional(),
    check('staffRemarks', 'Remarks must be a string').optional().isString()
  ],
  updateComplaint
);

// Add comments to a complaint - All roles (fixed validation field)
router.post(
  '/:id/comments',
  [
    check('text', 'Comment text is required').not().isEmpty() // Changed from 'comment'
  ],
  addComment
);

// Delete a complaint - Admin and Owner only
router.delete('/:id', deleteComplaint);

module.exports = router;