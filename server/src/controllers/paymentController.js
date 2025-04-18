const Payment = require('../models/Payment');
const Booking = require('../models/Booking');
const Room = require('../models/Room');

// @desc    Create a new payment
// @route   POST /api/payments
// @access  Private (Guest only)
exports.createPayment = async (req, res) => {
  try {
    // Check if booking exists
    const booking = await Booking.findById(req.body.booking).populate({
      path: 'room',
      select: 'price'
    });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Check if user owns the booking
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to make payment for this booking'
      });
    }
    
    // Check if payment has already been made
    const existingPayment = await Payment.findOne({ booking: req.body.booking });
    
    if (existingPayment) {
      return res.status(400).json({
        success: false,
        message: 'Payment already exists for this booking'
      });
    }
    
    // Calculate number of days for the booking
    const checkInDate = new Date(booking.checkInDate);
    const checkOutDate = new Date(booking.checkOutDate);
    const days = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    
    // Calculate total amount
    const totalAmount = days * booking.room.price;
    
    // Create payment
    // In a real application, you would integrate with a payment gateway here
    // For now, we're just creating a payment record
    const payment = await Payment.create({
      booking: req.body.booking,
      amount: totalAmount,
      transactionId: 'TRANS_' + Math.random().toString(36).substring(2, 15),
      paymentMethod: req.body.paymentMethod,
      status: 'completed'  // Assuming payment is successful for now
    });
    
    // Update booking status to confirmed
    booking.status = 'confirmed';
    await booking.save();
    
    res.status(201).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all payments
// @route   GET /api/payments
// @access  Private (Admin only)
exports.getPayments = async (req, res) => {
  try {
    let query;
    
    // If user is admin, get all payments
    if (req.user.role === 'admin') {
      query = Payment.find().populate({
        path: 'booking',
        populate: [
          {
            path: 'user',
            select: 'name email'
          },
          {
            path: 'room',
            select: 'roomNumber roomType',
            populate: {
              path: 'hostel',
              select: 'name city'
            }
          }
        ]
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all payments'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Payment.countDocuments();
    
    query = query.skip(startIndex).limit(limit).sort('-createdAt');
    
    // Executing query
    const payments = await query;
    
    // Pagination result
    const pagination = {};
    
    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit
      };
    }
    
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit
      };
    }
    
    res.status(200).json({
      success: true,
      count: payments.length,
      pagination,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user payments
// @route   GET /api/payments/me
// @access  Private
exports.getUserPayments = async (req, res) => {
  try {
    // Get user's bookings
    const bookings = await Booking.find({ user: req.user._id });
    const bookingIds = bookings.map(booking => booking._id);
    
    // Get payments for these bookings
    const payments = await Payment.find({ booking: { $in: bookingIds } })
      .populate({
        path: 'booking',
        populate: {
          path: 'room',
          select: 'roomNumber roomType',
          populate: {
            path: 'hostel',
            select: 'name city'
          }
        }
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get owner payments
// @route   GET /api/payments/owner
// @access  Private (Owner only)
exports.getOwnerPayments = async (req, res) => {
  try {
    // Get hostel IDs owned by user
    const hostels = await Hostel.find({ owner: req.user._id });
    const hostelIds = hostels.map(hostel => hostel._id);
    
    // Get room IDs in these hostels
    const rooms = await Room.find({ hostel: { $in: hostelIds } });
    const roomIds = rooms.map(room => room._id);
    
    // Get booking IDs for these rooms
    const bookings = await Booking.find({ room: { $in: roomIds } });
    const bookingIds = bookings.map(booking => booking._id);
    
    // Get payments for these bookings
    const payments = await Payment.find({ booking: { $in: bookingIds } })
      .populate({
        path: 'booking',
        populate: [
          {
            path: 'user',
            select: 'name email'
          },
          {
            path: 'room',
            select: 'roomNumber roomType',
            populate: {
              path: 'hostel',
              select: 'name city'
            }
          }
        ]
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: payments.length,
      data: payments
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single payment
// @route   GET /api/payments/:id
// @access  Private
exports.getPayment = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate({
      path: 'booking',
      populate: [
        {
          path: 'user',
          select: 'name email'
        },
        {
          path: 'room',
          select: 'roomNumber roomType',
          populate: {
            path: 'hostel',
            select: 'name city owner',
            populate: {
              path: 'owner',
              select: 'name email'
            }
          }
        }
      ]
    });
    
    if (!payment) {
      return res.status(404).json({
        success: false,
        message: 'Payment not found'
      });
    }
    
    // Check authorization
    const booking = payment.booking;
    
    // Allow access if: user is admin, or user made the booking, or user owns the hostel
    if (req.user.role !== 'admin' && 
        booking.user._id.toString() !== req.user._id.toString() && 
        booking.room.hostel.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this payment'
      });
    }
    
    res.status(200).json({
      success: true,
      data: payment
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};