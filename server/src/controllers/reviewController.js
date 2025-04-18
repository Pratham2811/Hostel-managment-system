const Review = require('../models/Review');
const Hostel = require('../models/Hostel');
const Booking = require('../models/Booking');

// @desc    Create a new review
// @route   POST /api/hostels/:hostelId/reviews
// @access  Private (Guest only)
exports.createReview = async (req, res) => {
  try {
    req.body.hostel = req.params.hostelId;
    req.body.user = req.user._id;
    
    // Check if hostel exists
    const hostel = await Hostel.findById(req.params.hostelId);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Check if user has booked this hostel before
    const room = await Room.find({ hostel: req.params.hostelId }).select('_id');
    const roomIds = room.map(r => r._id);
    
    const userBooking = await Booking.findOne({
      user: req.user._id,
      room: { $in: roomIds },
      status: 'completed'
    });
    
    if (!userBooking && req.user.role !== 'admin') {
      return res.status(400).json({
        success: false,
        message: 'You can only review hostels you have stayed in'
      });
    }
    
    // Check if user has already reviewed this hostel
    const existingReview = await Review.findOne({
      hostel: req.params.hostelId,
      user: req.user._id
    });
    
    if (existingReview) {
      return res.status(400).json({
        success: false,
        message: 'You have already reviewed this hostel'
      });
    }
    
    const review = await Review.create(req.body);
    
    res.status(201).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for a hostel
// @route   GET /api/hostels/:hostelId/reviews
// @access  Public
exports.getHostelReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ hostel: req.params.hostelId })
      .populate({
        path: 'user',
        select: 'name'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all reviews
// @route   GET /api/reviews
// @access  Private (Admin only)
exports.getReviews = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all reviews'
      });
    }
    
    const reviews = await Review.find()
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'hostel',
        select: 'name city'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user's reviews
// @route   GET /api/reviews/me
// @access  Private
exports.getUserReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.user._id })
      .populate({
        path: 'hostel',
        select: 'name city'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get reviews for owner's hostels
// @route   GET /api/reviews/owner
// @access  Private (Owner only)
exports.getOwnerHostelReviews = async (req, res) => {
  try {
    // Get all hostels owned by the user
    const hostels = await Hostel.find({ owner: req.user._id });
    const hostelIds = hostels.map(hostel => hostel._id);
    
    // Get all reviews for these hostels
    const reviews = await Review.find({ hostel: { $in: hostelIds } })
      .populate({
        path: 'user',
        select: 'name'
      })
      .populate({
        path: 'hostel',
        select: 'name city'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: reviews.length,
      data: reviews
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update review
// @route   PUT /api/reviews/:id
// @access  Private
exports.updateReview = async (req, res) => {
  try {
    let review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this review'
      });
    }
    
    review = await Review.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: review
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete review
// @route   DELETE /api/reviews/:id
// @access  Private
exports.deleteReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    
    if (!review) {
      return res.status(404).json({
        success: false,
        message: 'Review not found'
      });
    }
    
    // Make sure user is review owner or admin
    if (review.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this review'
      });
    }
    
    await review.remove();
    
    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};