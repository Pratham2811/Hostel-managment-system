const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getReviews,
  getReviewById,
  createReview,
  updateReview,
  deleteReview,
  getHostelReviews
} = require('../controllers/reviewController');

// Protect all routes
router.use(protect);

// Get all reviews - Admin only
router.get('/', authorize('admin'), getReviews);

// Get reviews for a specific hostel - Public
router.get('/hostel/:hostelId', getHostelReviews);

// Get review by ID - Public
router.get('/:id', getReviewById);

// Create new review - Student only
router.post(
  '/',
  authorize('student'),
  [
    check('hostelId', 'Hostel ID is required').not().isEmpty(),
    check('rating', 'Rating is required').isNumeric().isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').not().isEmpty()
  ],
  createReview
);

// Update review - Owner only (handled in controller)
router.put(
  '/:id',
  authorize('student'),
  [
    check('rating', 'Rating must be between 1 and 5').optional().isNumeric().isFloat({ min: 1, max: 5 }),
    check('comment', 'Comment is required').optional().not().isEmpty()
  ],
  updateReview
);

// Delete review - Admin and Owner only (handled in controller)
router.delete('/:id', deleteReview);

module.exports = router;