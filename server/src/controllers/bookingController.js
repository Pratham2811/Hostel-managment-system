const Booking = require('../models/Booking');
const Room = require('../models/Room');
const Hostel = require('../models/Hostel');

// @desc    Create a new booking
// @route   POST /api/bookings
// @access  Private (Guest only)
exports.createBooking = async (req, res) => {
  try {
    // Add user ID to req.body
    req.body.user = req.user._id;
    
    // Check if room exists
    const room = await Room.findById(req.body.room);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Check if room is available
    if (!room.isAvailable) {
      return res.status(400).json({
        success: false,
        message: 'Room is not available for booking'
      });
    }
    
    // Check if dates are valid
    const checkInDate = new Date(req.body.checkInDate);
    const checkOutDate = new Date(req.body.checkOutDate);
    
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({
        success: false,
        message: 'Check-out date must be after check-in date'
      });
    }
    
    // Check if room is already booked for the requested dates
    const existingBooking = await Booking.findOne({
      room: req.body.room,
      status: { $in: ['pending', 'confirmed'] },
      $or: [
        {
          checkInDate: { $lte: checkOutDate },
          checkOutDate: { $gte: checkInDate }
        }
      ]
    });
    
    if (existingBooking) {
      return res.status(400).json({
        success: false,
        message: 'Room is already booked for the requested dates'
      });
    }
    
    // Create booking
    const booking = await Booking.create(req.body);
    
    res.status(201).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Private (Admin only)
exports.getBookings = async (req, res) => {
  try {
    let query;
    
    // If user is admin, get all bookings
    if (req.user.role === 'admin') {
      query = Booking.find().populate({
        path: 'room',
        select: 'roomNumber roomType price',
        populate: {
          path: 'hostel',
          select: 'name city'
        }
      }).populate({
        path: 'user',
        select: 'name email phone'
      });
    } else {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view all bookings'
      });
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Booking.countDocuments();
    
    query = query.skip(startIndex).limit(limit).sort('-createdAt');
    
    // Executing query
    const bookings = await query;
    
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
      count: bookings.length,
      pagination,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get user bookings
// @route   GET /api/bookings/me
// @access  Private
exports.getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate({
        path: 'room',
        select: 'roomNumber roomType price',
        populate: {
          path: 'hostel',
          select: 'name city'
        }
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get owner bookings
// @route   GET /api/bookings/owner
// @access  Private (Owner only)
exports.getOwnerBookings = async (req, res) => {
  try {
    // Get owner's hostels
    const hostels = await Hostel.find({ owner: req.user._id });
    const hostelIds = hostels.map(hostel => hostel._id);
    
    // Get all rooms belonging to these hostels
    const rooms = await Room.find({ hostel: { $in: hostelIds } });
    const roomIds = rooms.map(room => room._id);
    
    // Get all bookings for these rooms
    const bookings = await Booking.find({ room: { $in: roomIds } })
      .populate({
        path: 'room',
        select: 'roomNumber roomType price',
        populate: {
          path: 'hostel',
          select: 'name city'
        }
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      })
      .sort('-createdAt');
    
    res.status(200).json({
      success: true,
      count: bookings.length,
      data: bookings
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Private
exports.getBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate({
        path: 'room',
        select: 'roomNumber roomType price',
        populate: {
          path: 'hostel',
          select: 'name city owner',
          populate: {
            path: 'owner',
            select: 'name email'
          }
        }
      })
      .populate({
        path: 'user',
        select: 'name email phone'
      });
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Make sure user is admin or owns the booking or is the hostel owner
    if (req.user.role !== 'admin' && 
        booking.user._id.toString() !== req.user._id.toString() && 
        booking.room.hostel.owner._id.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this booking'
      });
    }
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update booking status
// @route   PUT /api/bookings/:id
// @access  Private (Owner or Admin or Guest who made booking)
exports.updateBooking = async (req, res) => {
  try {
    let booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    const room = await Room.findById(booking.room).populate({
      path: 'hostel',
      select: 'owner'
    });
    
    // Check authorization based on the update being made
    if (req.body.status) {
      // Status updates:
      // - Owner can confirm or reject bookings
      // - Guest can only cancel their own booking
      // - Admin can update any booking status
      
      if (req.user.role === 'owner') {
        // Owner can only update bookings for their hostel
        if (room.hostel.owner.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to update this booking'
          });
        }
        
        // Owner can only confirm or reject bookings
        if (!['confirmed', 'cancelled'].includes(req.body.status)) {
          return res.status(400).json({
            success: false,
            message: 'Owner can only confirm or reject bookings'
          });
        }
      } else if (req.user.role === 'guest') {
        // Guest can only cancel their own booking
        if (booking.user.toString() !== req.user._id.toString()) {
          return res.status(403).json({
            success: false,
            message: 'Not authorized to update this booking'
          });
        }
        
        if (req.body.status !== 'cancelled') {
          return res.status(400).json({
            success: false,
            message: 'Guest can only cancel bookings'
          });
        }
      }
    }
    
    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: booking
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private (Admin only)
exports.deleteBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: 'Booking not found'
      });
    }
    
    // Only admin can delete bookings
    if (req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete bookings'
      });
    }
    
    await booking.remove();
    
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