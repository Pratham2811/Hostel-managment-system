const Complaint = require('../models/Complaint');
const User = require('../models/user');
const Room = require('../models/Room');
const { validationResult } = require('express-validator');

// Get all complaints (admin and staff only)
exports.getAllComplaints = async (req, res) => {
    try {
        // Check user role
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({ 
                success: false, 
                message: 'Access denied. Not authorized to view all complaints' 
            });
        }

        let query = {};
        
        // Filter by status if provided
        if (req.query.status) {
            query.status = req.query.status;
        }
        
        // Filter by type if provided
        if (req.query.type) {
            query.type = req.query.type;
        }

        // Staff can only see complaints assigned to them or unassigned ones
        if (req.user.role === 'staff') {
            query.$or = [{ assignedTo: req.user.id }, { assignedTo: null }];
        }

        const complaints = await Complaint.find(query)
            .populate('student', 'name email rollNumber hostelBlock roomNumber')
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get student's own complaints
exports.getMyComplaints = async (req, res) => {
    try {
        const complaints = await Complaint.find({ student: req.user.id })
            .populate('assignedTo', 'name role')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get single complaint
exports.getComplaintById = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id)
            .populate('student', 'name email rollNumber hostelBlock roomNumber')
            .populate('assignedTo', 'name email role')
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',
                    select: 'name role'
                }
            });

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Check authorization - only admin, assigned staff, or the student who created it can view
        if (
            req.user.role !== 'admin' && 
            (req.user.role === 'staff' && complaint.assignedTo?.toString() !== req.user.id) && 
            complaint.student.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view this complaint'
            });
        }

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Create complaint
exports.createComplaint = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        // Check if user is a student
        const user = await User.findById(req.user.id);
        if (!user || user.role !== 'student') {
            return res.status(403).json({
                success: false,
                message: 'Only students can create complaints'
            });
        }

        // Get student's room information
        const studentWithRoom = await User.findById(req.user.id)
            .populate('room', 'roomNumber block');
        
        if (!studentWithRoom.room) {
            return res.status(400).json({
                success: false,
                message: 'Student must be assigned to a room to file a complaint'
            });
        }

        // Create complaint
        const complaint = new Complaint({
            title: req.body.title,
            description: req.body.description,
            type: req.body.type, // e.g., maintenance, cleanliness, security, etc.
            priority: req.body.priority || 'medium',
            student: req.user.id,
            hostelBlock: studentWithRoom.room.block,
            roomNumber: studentWithRoom.room.roomNumber,
            status: 'pending',
            images: req.body.images // Array of image URLs if any
        });

        await complaint.save();

        res.status(201).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Update complaint
exports.updateComplaint = async (req, res) => {
    try {
        let complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Check authorization
        if (req.user.role === 'student' && complaint.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this complaint'
            });
        }

        if (req.user.role === 'staff' && complaint.assignedTo?.toString() !== req.user.id && complaint.status !== 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to update this complaint'
            });
        }

        const updatedFields = {};

        // Different update rules based on user role
        if (req.user.role === 'student') {
            // Students can only update their own pending complaints
            if (complaint.status !== 'pending') {
                return res.status(403).json({
                    success: false,
                    message: 'Cannot update complaint once it has been processed'
                });
            }

            if (req.body.title) updatedFields.title = req.body.title;
            if (req.body.description) updatedFields.description = req.body.description;
            if (req.body.type) updatedFields.type = req.body.type;
            if (req.body.priority) updatedFields.priority = req.body.priority;
            if (req.body.images) updatedFields.images = req.body.images;
        } else {
            // Staff and admin can update these fields
            if (req.body.status) {
                updatedFields.status = req.body.status;
                
                // Set resolution date if status is changing to resolved
                if (req.body.status === 'resolved' && complaint.status !== 'resolved') {
                    updatedFields.resolvedAt = Date.now();
                }
            }
            
            if (req.body.assignedTo) updatedFields.assignedTo = req.body.assignedTo;
            if (req.body.staffRemarks) updatedFields.staffRemarks = req.body.staffRemarks;
            if (req.body.priority) updatedFields.priority = req.body.priority;
        }

        // Update the complaint
        complaint = await Complaint.findByIdAndUpdate(
            req.params.id,
            { $set: updatedFields },
            { new: true, runValidators: true }
        )
        .populate('student', 'name email rollNumber')
        .populate('assignedTo', 'name email role');

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete complaint
exports.deleteComplaint = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Check authorization - only admin or the student who created it can delete
        if (req.user.role !== 'admin' && complaint.student.toString() !== req.user.id) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this complaint'
            });
        }

        // Students can only delete pending complaints
        if (req.user.role === 'student' && complaint.status !== 'pending') {
            return res.status(403).json({
                success: false,
                message: 'Cannot delete complaint once it has been processed'
            });
        }

        await Complaint.deleteOne({ _id: req.params.id });

        res.status(200).json({
            success: true,
            message: 'Complaint successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Add comment to complaint
exports.addComment = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            errors: errors.array()
        });
    }

    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Check authorization - only admin, assigned staff, or the student who created it can comment
        if (
            req.user.role !== 'admin' && 
            (req.user.role === 'staff' && complaint.assignedTo?.toString() !== req.user.id) && 
            complaint.student.toString() !== req.user.id
        ) {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to comment on this complaint'
            });
        }

        // Create new comment
        const newComment = {
            text: req.body.text,
            user: req.user.id,
            role: req.user.role
        };

        // Add comment to complaint
        complaint.comments.unshift(newComment);

        // Save complaint
        await complaint.save();

        // Populate user info in the comment
        await Complaint.populate(complaint, {
            path: 'comments.user',
            select: 'name role'
        });

        res.status(201).json({
            success: true,
            data: complaint.comments[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Delete comment
exports.deleteComment = async (req, res) => {
    try {
        const complaint = await Complaint.findById(req.params.id);

        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Find the comment
        const comment = complaint.comments.find(
            comment => comment._id.toString() === req.params.commentId
        );

        if (!comment) {
            return res.status(404).json({
                success: false,
                message: 'Comment not found'
            });
        }

        // Check if user is authorized to delete comment
        if (comment.user.toString() !== req.user.id && req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to delete this comment'
            });
        }

        // Get index of comment to remove
        const removeIndex = complaint.comments
            .map(comment => comment._id.toString())
            .indexOf(req.params.commentId);

        // Remove comment
        complaint.comments.splice(removeIndex, 1);

        // Save complaint
        await complaint.save();

        res.status(200).json({
            success: true,
            message: 'Comment successfully deleted'
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};
// Get complaints by status
exports.getComplaintsByStatus = async (req, res) => {
    try {
      // Check authorization
      if (req.user.role !== 'admin' && req.user.role !== 'staff') {
        return res.status(403).json({
          success: false,
          message: 'Not authorized to view complaints by status'
        });
      }
  
      const complaints = await Complaint.find({ status: req.params.status })
        .populate('student', 'name email rollNumber hostelBlock roomNumber')
        .populate('assignedTo', 'name email role')
        .sort({ createdAt: -1 });
  
      res.status(200).json({
        success: true,
        count: complaints.length,
        data: complaints
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({
        success: false,
        message: 'Server Error',
        error: error.message
      });
    }
  };
// Assign complaint to staff
exports.assignComplaint = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to assign complaints'
            });
        }

        const { staffId } = req.body;

        // Check if staff exists and is a staff member
        const staff = await User.findById(staffId);
        if (!staff || staff.role !== 'staff') {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }

        // Find complaint
        let complaint = await Complaint.findById(req.params.id);
        if (!complaint) {
            return res.status(404).json({
                success: false,
                message: 'Complaint not found'
            });
        }

        // Update complaint
        complaint.assignedTo = staffId;
        complaint.status = 'in-progress';
        complaint.updatedAt = Date.now();

        await complaint.save();

        // Populate updated complaint
        complaint = await Complaint.findById(req.params.id)
            .populate('student', 'name email rollNumber')
            .populate('assignedTo', 'name email role');

        res.status(200).json({
            success: true,
            data: complaint
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get dashboard statistics for admin and staff
exports.getComplaintStats = async (req, res) => {
    try {
        // Check authorization
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view complaint statistics'
            });
        }

        let matchCriteria = {};

        // Staff can only see their assigned complaints
        if (req.user.role === 'staff') {
            matchCriteria.assignedTo = req.user.id;
        }

        // Filter by hostel block if provided
        if (req.query.block) {
            matchCriteria.hostelBlock = req.query.block;
        }

        // Stats by status
        const statusStats = await Complaint.aggregate([
            { $match: matchCriteria },
            { $group: {
                _id: '$status',
                count: { $sum: 1 }
            }}
        ]);

        // Stats by type
        const typeStats = await Complaint.aggregate([
            { $match: matchCriteria },
            { $group: {
                _id: '$type',
                count: { $sum: 1 }
            }}
        ]);

        // Stats by priority
        const priorityStats = await Complaint.aggregate([
            { $match: matchCriteria },
            { $group: {
                _id: '$priority',
                count: { $sum: 1 }
            }}
        ]);

        // Stats by hostel block
        const blockStats = await Complaint.aggregate([
            { $match: matchCriteria },
            { $group: {
                _id: '$hostelBlock',
                count: { $sum: 1 }
            }}
        ]);

        // Monthly trend (last 6 months)
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const monthlyTrend = await Complaint.aggregate([
            { 
                $match: { 
                    ...matchCriteria,
                    createdAt: { $gte: sixMonthsAgo } 
                } 
            },
            {
                $group: {
                    _id: { 
                        year: { $year: '$createdAt' },
                        month: { $month: '$createdAt' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { '_id.year': 1, '_id.month': 1 } }
        ]);

        // Resolution time statistics (for resolved complaints)
        const resolutionTimeStats = await Complaint.aggregate([
            { 
                $match: { 
                    ...matchCriteria,
                    status: 'resolved',
                    resolvedAt: { $exists: true }
                } 
            },
            {
                $project: {
                    resolutionTime: { 
                        $divide: [
                            { $subtract: ['$resolvedAt', '$createdAt'] },
                            1000 * 60 * 60 * 24 // Convert to days
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgResolutionTime: { $avg: '$resolutionTime' },
                    minResolutionTime: { $min: '$resolutionTime' },
                    maxResolutionTime: { $max: '$resolutionTime' }
                }
            }
        ]);

        // Format the response
        const formattedStats = {
            total: await Complaint.countDocuments(matchCriteria),
            byStatus: statusStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            byType: typeStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            byPriority: priorityStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            byBlock: blockStats.reduce((acc, curr) => {
                acc[curr._id] = curr.count;
                return acc;
            }, {}),
            monthlyTrend: monthlyTrend.map(item => ({
                year: item._id.year,
                month: item._id.month,
                count: item.count
            })),
            resolutionTime: resolutionTimeStats.length > 0 ? {
                average: resolutionTimeStats[0].avgResolutionTime.toFixed(2),
                minimum: resolutionTimeStats[0].minResolutionTime.toFixed(2),
                maximum: resolutionTimeStats[0].maxResolutionTime.toFixed(2)
            } : null
        };

        res.status(200).json({
            success: true,
            data: formattedStats
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Get complaints by room
exports.getComplaintsByRoom = async (req, res) => {
    try {
        // Check authorization
        if (req.user.role !== 'admin' && req.user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to view room complaints'
            });
        }

        const { roomNumber, block } = req.params;

        // Validate room exists
        const room = await Room.findOne({ 
            roomNumber, 
            block 
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: 'Room not found'
            });
        }

        // Get complaints for this room
        const complaints = await Complaint.find({
            roomNumber,
            hostelBlock: block
        })
        .populate('student', 'name email rollNumber')
        .populate('assignedTo', 'name email role')
        .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: complaints.length,
            data: complaints
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

// Export complaint data (admin only)
exports.exportComplaintData = async (req, res) => {
    try {
        // Check if user is admin
        if (req.user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Not authorized to export complaint data'
            });
        }

        // Query parameters for filtering
        const query = {};
        if (req.query.status) query.status = req.query.status;
        if (req.query.type) query.type = req.query.type;
        if (req.query.block) query.hostelBlock = req.query.block;
        if (req.query.priority) query.priority = req.query.priority;

        // Date range filter
        if (req.query.startDate && req.query.endDate) {
            query.createdAt = {
                $gte: new Date(req.query.startDate),
                $lte: new Date(req.query.endDate)
            };
        }

        // Get filtered complaints
        const complaints = await Complaint.find(query)
            .populate('student', 'name email rollNumber')
            .populate('assignedTo', 'name email role')
            .sort({ createdAt: -1 });

        // Format data for export
        const exportData = complaints.map(complaint => {
            return {
                id: complaint._id,
                title: complaint.title,
                description: complaint.description,
                type: complaint.type,
                priority: complaint.priority,
                status: complaint.status,
                hostelBlock: complaint.hostelBlock,
                roomNumber: complaint.roomNumber,
                student: complaint.student ? {
                    id: complaint.student._id,
                    name: complaint.student.name,
                    email: complaint.student.email,
                    rollNumber: complaint.student.rollNumber
                } : null,
                assignedTo: complaint.assignedTo ? {
                    id: complaint.assignedTo._id,
                    name: complaint.assignedTo.name,
                    email: complaint.assignedTo.email,
                    role: complaint.assignedTo.role
                } : null,
                comments: complaint.comments.length,
                staffRemarks: complaint.staffRemarks,
                createdAt: complaint.createdAt,
                updatedAt: complaint.updatedAt,
                resolvedAt: complaint.resolvedAt
            };
        });

        res.status(200).json({
            success: true,
            count: exportData.length,
            data: exportData
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            success: false,
            message: 'Server Error',
            error: error.message
        });
    }
};

module.exports = exports;