const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
const User = require('../models/user');
const { validationResult } = require('express-validator');

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private (Admin)
exports.getReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate({
        path: 'student',
        select: 'name email'
      })
      .populate({
        path: 'hostel',
        select: 'name location'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get reviews for a specific hostel
// @route   GET /api/reviews/hostel/:hostelId
// @access  Private
exports.getHostelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hostel: req.params.hostelId })
      .populate({
        path: 'student',
        select: 'name'
      })
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Private
exports.getReviewById = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id)
      .populate({
        path: 'student',
        select: 'name email'
      })
      .populate({
        path: 'hostel',
        select: 'name location'
      });

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create new review
// @route   POST /api/reviews
// @access  Private (Student)
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    const { hostelId, rating, comment } = req.body;

    // Check if hostel exists
    const hostel = await Hostel.findById(hostelId);
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }

    // Check if student has already reviewed this hostel
    const existingReview = await Review.findOne({
      student: req.user.id,
      hostel: hostelId
    });

    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this hostel'
      });
    }

    // Create review
    const review = new Review({
      student: req.user.id,
      hostel: hostelId,
      rating,
      comment
    });

    await review.save();

    // Update hostel rating
    await updateHostelRating(hostelId);

    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private (Student - Owner only)
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }

  try {
    let review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure review belongs to user
    if (review.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }

    const { rating, comment } = req.body;

    if (rating) review.rating = rating;
    if (comment) review.comment = comment;

    await review.save();

    // Update hostel rating
    await updateHostelRating(review.hostel);

    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private (Admin and Owner)
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);

    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }

    // Make sure review belongs to user or user is admin
    if (review.student.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }

    const hostelId = review.hostel;

    await review.remove();

    // Update hostel rating
    await updateHostelRating(hostelId);

    res.status(200).json({
      success: true,
      message: 'Review deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// Helper function to update hostel rating
async function updateHostelRating(hostelId) {
  const reviews = await Review.find({ hostel: hostelId });
  
  if (reviews.length === 0) {
    await Hostel.findByIdAndUpdate(hostelId, {
      rating: 0,
      numReviews: 0
    });
    return;
  }
  
  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;
  
  await Hostel.findByIdAndUpdate(hostelId, {
    rating: averageRating.toFixed(1),
    numReviews: reviews.length
  });
}