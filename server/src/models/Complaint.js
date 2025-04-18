const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const CommentSchema = new Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    role: {
        type: String,
        enum: ['student', 'staff', 'admin'],
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const ComplaintSchema = new Schema({
    title: {
        type: String,
        required: [true, 'Please provide a title for the complaint'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        required: [true, 'Please provide a description of the complaint'],
        trim: true,
        maxlength: [1000, 'Description cannot be more than 1000 characters']
    },
    type: {
        type: String,
        required: [true, 'Please specify the type of complaint'],
        enum: [
            'maintenance',
            'plumbing',
            'electrical',
            'furniture',
            'cleanliness',
            'security',
            'internet',
            'roommate',
            'noise',
            'mess',
            'other'
        ]
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high', 'urgent'],
        default: 'medium'
    },
    status: {
        type: String,
        enum: ['pending', 'in-progress', 'resolved', 'rejected'],
        default: 'pending'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    hostelBlock: {
        type: String,
        required: true
    },
    roomNumber: {
        type: String,
        required: true
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    staffRemarks: {
        type: String,
        trim: true,
        maxlength: [500, 'Remarks cannot be more than 500 characters']
    },
    comments: [CommentSchema],
    images: [String], // Array of image URLs
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    },
    resolvedAt: {
        type: Date
    }
});

// Pre-save middleware to update the updatedAt field
ComplaintSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Virtual for time to resolution (in days)
ComplaintSchema.virtual('resolutionTime').get(function() {
    if (this.resolvedAt && this.status === 'resolved') {
        const diffTime = Math.abs(this.resolvedAt - this.createdAt);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
        return diffDays;
    }
    return null;
});

module.exports = mongoose.model('Complaint', ComplaintSchema);