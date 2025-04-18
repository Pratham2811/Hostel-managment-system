const mongoose = require('mongoose');

const SettingSchema = new mongoose.Schema({
  key: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  value: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  category: {
    type: String,
    enum: ['general', 'payment', 'booking', 'notification', 'system'],
    default: 'general'
  },
  isPublic: {
    type: Boolean,
    default: false
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Setting', SettingSchema);