const Hostel = require('../models/Hostel');
const Room = require('../models/Room');

// @desc    Create a new hostel
// @route   POST /api/hostels
// @access  Private (Owner only)
exports.createHostel = async (req, res) => {
  try {
    // Add owner to req.body
    req.body.owner = req.user._id;
    
    const hostel = await Hostel.create(req.body);

    res.status(201).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get all hostels
// @route   GET /api/hostels
// @access  Public
exports.getHostels = async (req, res) => {
  try {
    // Build query
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
    query = Hostel.find(JSON.parse(queryStr)).populate('owner', 'name email');
    
    // For user role guest, only show verified hostels
    if (!req.user || req.user.role === 'guest') {
      query = query.find({ isVerified: true });
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
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hostel.countDocuments();
    
    query = query.skip(startIndex).limit(limit);
    
    // Executing query
    const hostels = await query;
    
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
      count: hostels.length,
      pagination,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Get single hostel
// @route   GET /api/hostels/:id
// @access  Public
exports.getHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id)
      .populate('owner', 'name email')
      .populate('verifiedBy', 'name');
    
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
        req.user._id.toString() !== hostel.owner._id.toString()))) {
      return res.status(403).json({
        success: false,
        message: 'This hostel is pending verification'
      });
    }
    
    res.status(200).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Update hostel
// @route   PUT /api/hostels/:id
// @access  Private (Owner or Admin)
exports.updateHostel = async (req, res) => {
  try {
    let hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Make sure user is hostel owner or admin
    if (hostel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this hostel'
      });
    }
    
    // If admin is verifying the hostel
    if (req.user.role === 'admin' && req.body.isVerified !== undefined) {
      req.body.verifiedBy = req.user._id;
    }
    
    // Update hostel
    hostel = await Hostel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    
    res.status(200).json({
      success: true,
      data: hostel
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// @desc    Delete hostel
// @route   DELETE /api/hostels/:id
// @access  Private (Owner or Admin)
exports.deleteHostel = async (req, res) => {
  try {
    const hostel = await Hostel.findById(req.params.id);
    
    if (!hostel) {
      return res.status(404).json({
        success: false,
        message: 'Hostel not found'
      });
    }
    
    // Make sure user is hostel owner or admin
    if (hostel.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this hostel'
      });
    }
    
    // Delete associated rooms first
    await Room.deleteMany({ hostel: req.params.id });
    
    // Delete hostel
    await hostel.remove();
    
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

// @desc    Get hostels by owner
// @route   GET /api/hostels/owner
// @access  Private (Owner only)
exports.getHostelsByOwner = async (req, res) => {
  try {
    const hostels = await Hostel.find({ owner: req.user._id });
    
    res.status(200).json({
      success: true,
      count: hostels.length,
      data: hostels
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};