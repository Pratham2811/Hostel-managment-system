const mongoose = require('mongoose');

const NotificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'warning', 'success', 'error'],
    default: 'info'
  },
  relatedTo: {
    model: {
      type: String,
      enum: ['Booking', 'Payment', 'Complaint', 'Room', 'Hostel', 'System'],
      default: 'System'
    },
    id: {
      type: mongoose.Schema.Types.ObjectId,
      default: null
    }
  },
  isRead: {
    type: Boolean,
    default: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create index for faster lookup
NotificationSchema.index({ recipient: 1, isRead: 1 });
NotificationSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Notification', NotificationSchema);