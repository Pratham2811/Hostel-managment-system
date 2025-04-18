const Room = require('../models/Room');
const Hostel = require('../models/Hostel');

// @desc    Create a new room
// @route   POST /api/hostels/:hostelId/rooms
// @access  Private (Owner only)
exports.createRoom = async (req, res) => {
  try {
    req.body.hostel = req.params.hostelId;
    
    const hostel = await Hostel.findById(req.params.hostelId);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Check if user is hostel owner
    if (hostel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'User not authorized to add rooms to this hostel'
      });
    }
    
    const room = await Room.create(req.body);
    
    res.status(201).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all rooms
// @route   GET /api/rooms
// @access  Public
exports.getRooms = async (req, res) => {
  try {
    let query;
    
    // Copy req.query
    const reqQuery = { ...req.query };
    
    // Fields to exclude
    const removeFields = ['select', 'sort', 'page', 'limit'];
    
    // Loop over removeFields and delete them from reqQuery
    removeFields.forEach(param => delete reqQuery[param]);
    
    // Create query string
    let queryStr = JSON.stringify(reqQuery);
    
    // Create operators ($gt, $gte, etc)
    queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);
    
    // Finding resource
    query = Room.find(JSON.parse(queryStr)).populate({
      path: 'hostel',
      select: 'name address city isVerified',
      populate: {
        path: 'owner',
        select: 'name email'
      }
    });
    
    // For user role guest, only show rooms from verified hostels
    if (!req.user || req.user.role === 'guest') {
      const verifiedHostels = await Hostel.find({ isVerified: true }).select('_id');
      const verifiedHostelIds = verifiedHostels.map(hostel => hostel._id);
      query = query.find({ hostel: { $in: verifiedHostelIds } });
    }
    
    // Select Fields
    if (req.query.select) {
      const fields = req.query.select.split(',').join(' ');
      query = query.select(fields);
    }
    
    // Sort
    if (req.query.sort) {
      const sortBy = req.query.sort.split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }
    
    // Pagination
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 25;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Room.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const rooms = await query;
    
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
      count: rooms.length,
      pagination,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get rooms for a hostel
// @route   GET /api/hostels/:hostelId/rooms
// @access  Public
exports.getHostelRooms = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.hostelId);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // If hostel is not verified and requester is not admin or owner, deny access
    if (!hostel.isVerified && 
        (!req.user || 
        (req.user.role !== 'admin' && 
        req.user._id.toString() !== hostel.owner.toString()))) {
      return res.status(403).json({
        success: false,
        message: 'This hostel is pending verification'
      });
    }
    
    const rooms = await Room.find({ hostel: req.params.hostelId });
    
    res.status(200).json({
      success: true,
      count: rooms.length,
      data: rooms
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single room
// @route   GET /api/rooms/:id
// @access  Public
exports.getRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate({
      path: 'hostel',
      select: 'name address city isVerified',
      populate: {
        path: 'owner',
        select: 'name email'
      }
    });
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // If hostel is not verified and requester is not admin or owner, deny access
    if (!room.hostel.isVerified && 
        (!req.user || 
        (req.user.role !== 'admin' && 
        req.user._id.toString() !== room.hostel.owner._id.toString()))) {
      return res.status(403).json({
        success: false,
        message: 'This hostel is pending verification'
      });
    }
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update room
// @route   PUT /api/rooms/:id
// @access  Private (Owner or Admin)
exports.updateRoom = async (req, res) => {
  try {
    let room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Get hostel to check ownership
    const hostel = await Hostel.findById(room.hostel);
    
    // Make sure user is hostel owner or admin
    if (hostel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this room'
      });
    }
    
    room = await Room.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: room
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete room
// @route   DELETE /api/rooms/:id
// @access  Private (Owner or Admin)
exports.deleteRoom = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id);
    
    if (!room) {
      return res.status(404).json({
        success: false,
        message: 'Room not found'
      });
    }
    
    // Get hostel to check ownership
    const hostel = await Hostel.findById(room.hostel);
    
    // Make sure user is hostel owner or admin
    if (hostel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this room'
      });
    }
    
    await room.remove();
    
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