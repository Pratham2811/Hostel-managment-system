const User = require('../models/user');
const Room = require('../models/Room');
const Booking = require('../models/Booking');
const Payment = require('../models/Payment');
const Complaint = require('../models/Complaint');
const Review = require('../models/Review');
const Hostel = require('../models/Hostel');

// @desc    Get dashboard statistics
// @route   GET /api/dashboard/stats
// @access  Private (Admin)
exports.getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalStudents = await User.countDocuments({ role: 'student' });
    const totalRooms = await Room.countDocuments();
    const occupiedRooms = await Room.countDocuments({ isOccupied: true });
    const totalBookings = await Booking.countDocuments();
    const pendingComplaints = await Complaint.countDocuments({ status: 'pending' });
    
    // Get revenue stats
    const payments = await Payment.find();
    const totalRevenue = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    // Get monthly revenue for the current year
    const currentYear = new Date().getFullYear();
    const monthlyRevenue = await Payment.aggregate([
      {
        $match: {
          createdAt: {
            $gte: new Date(`${currentYear}-01-01`),
            $lte: new Date(`${currentYear}-12-31`)
          },
          status: 'completed'
        }
      },
      {
        $group: {
          _id: { $month: '$createdAt' },
          revenue: { $sum: '$amount' }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Format monthly revenue
    const formattedMonthlyRevenue = Array(12).fill(0);
    monthlyRevenue.forEach(item => {
      formattedMonthlyRevenue[item._id - 1] = item.revenue;
    });

    // Get latest bookings
    const latestBookings = await Booking.find()
      .populate('student', 'name email')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get latest complaints
    const latestComplaints = await Complaint.find()
      .populate('student', 'name')
      .populate('room', 'roomNumber')
      .sort({ createdAt: -1 })
      .limit(5);
    
    // Get occupancy rate
    const occupancyRate = totalRooms > 0 ? (occupiedRooms / totalRooms) * 100 : 0;
    
    res.status(200).json({
      success: true,
      data: {
        totalStudents,
        totalRooms,
        occupiedRooms,
        availableRooms: totalRooms - occupiedRooms,
        occupancyRate: occupancyRate.toFixed(2),
        totalBookings,
        pendingComplaints,
        totalRevenue,
        monthlyRevenue: formattedMonthlyRevenue,
        latestBookings,
        latestComplaints
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get student statistics
// @route   GET /api/dashboard/student-stats
// @access  Private (Student)
exports.getStudentDashboardStats = async (req, res) => {
  try {
    const studentId = req.user.id;
    
    // Get student's room
    const student = await User.findById(studentId).populate('room');
    
    // Get student's bookings
    const bookings = await Booking.find({ student: studentId })
      .populate('room', 'roomNumber block')
      .sort({ createdAt: -1 });
    
    // Get student's payments
    const payments = await Payment.find({ student: studentId })
      .sort({ createdAt: -1 });
    
    // Get student's complaints
    const complaints = await Complaint.find({ student: studentId })
      .sort({ createdAt: -1 });
    
    // Get student's reviews
    const reviews = await Review.find({ student: studentId })
      .populate('hostel', 'name')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      data: {
        student,
        currentRoom: student.room,
        bookings,
        bookingsCount: bookings.length,
        payments,
        paymentsTotal: payments.reduce((sum, payment) => sum + payment.amount, 0),
        complaints,
        complaintsCount: complaints.length,
        pendingComplaints: complaints.filter(c => c.status === 'pending').length,
        reviews
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get hostel statistics by block
// @route   GET /api/dashboard/hostel-stats
// @access  Private (Admin)
exports.getHostelStats = async (req, res) => {
  try {
    // Get rooms by block
    const roomsByBlock = await Room.aggregate([
      {
        $group: {
          _id: '$block',
          totalRooms: { $sum: 1 },
          occupiedRooms: {
            $sum: {
              $cond: [{ $eq: ['$isOccupied', true] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    // Calculate occupancy rates by block
    const blockStats = roomsByBlock.map(block => ({
      block: block._id,
      totalRooms: block.totalRooms,
      occupiedRooms: block.occupiedRooms,
      availableRooms: block.totalRooms - block.occupiedRooms,
      occupancyRate: ((block.occupiedRooms / block.totalRooms) * 100).toFixed(2)
    }));
    
    // Get complaint statistics by block
    const complaintsByBlock = await Complaint.aggregate([
      {
        $lookup: {
          from: 'rooms',
          localField: 'room',
          foreignField: '_id',
          as: 'roomData'
        }
      },
      {
        $unwind: '$roomData'
      },
      {
        $group: {
          _id: '$roomData.block',
          totalComplaints: { $sum: 1 },
          pendingComplaints: {
            $sum: {
              $cond: [{ $eq: ['$status', 'pending'] }, 1, 0]
            }
          },
          resolvedComplaints: {
            $sum: {
              $cond: [{ $eq: ['$status', 'resolved'] }, 1, 0]
            }
          }
        }
      },
      {
        $sort: { _id: 1 }
      }
    ]);
    
    res.status(200).json({
      success: true,
      data: {
        blockStats,
        complaintsByBlock
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};