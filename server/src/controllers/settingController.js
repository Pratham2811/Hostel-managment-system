const Setting = require('../models/Setting');
const { validationResult } = require('express-validator');

// @desc    Get all settings
// @route   GET /api/settings
// @access  Private (Admin)
exports.getAllSettings = async (req, res) => {
  try {
    const settings = await Setting.find().sort({ category: 1, key: 1 });
    
    res.status(200).json({
      success: true,
      data: settings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get public settings
// @route   GET /api/settings/public
// @access  Public
exports.getPublicSettings = async (req, res) => {
  try {
    const settings = await Setting.find({ isPublic: true }).sort({ category: 1, key: 1 });
    
    const formattedSettings = {};
    settings.forEach(setting => {
      formattedSettings[setting.key] = setting.value;
    });
    
    res.status(200).json({
      success: true,
      data: formattedSettings
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Get setting by key
// @route   GET /api/settings/:key
// @access  Private (Admin)
exports.getSettingByKey = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key.toLowerCase() });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Create or Update setting
// @route   PUT /api/settings/:key
// @access  Private (Admin)
exports.updateSetting = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array()
    });
  }
  
  try {
    const { value, description, category, isPublic } = req.body;
    const key = req.params.key.toLowerCase();
    
    let setting = await Setting.findOne({ key });
    
    if (setting) {
      // Update existing setting
      setting.value = value;
      if (description) setting.description = description;
      if (category) setting.category = category;
      if (isPublic !== undefined) setting.isPublic = isPublic;
      setting.updatedBy = req.user.id;
      setting.updatedAt = Date.now();
    } else {
      // Create new setting
      setting = new Setting({
        key,
        value,
        description,
        category: category || 'general',
        isPublic: isPublic || false,
        updatedBy: req.user.id
      });
    }
    
    await setting.save();
    
    res.status(200).json({
      success: true,
      data: setting
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Delete setting
// @route   DELETE /api/settings/:key
// @access  Private (Admin)
exports.deleteSetting = async (req, res) => {
  try {
    const setting = await Setting.findOne({ key: req.params.key.toLowerCase() });
    
    if (!setting) {
      return res.status(404).json({
        success: false,
        message: 'Setting not found'
      });
    }
    
    await setting.remove();
    
    res.status(200).json({
      success: true,
      message: 'Setting deleted successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};

// @desc    Initialize default settings
// @route   POST /api/settings/initialize
// @access  Private (Admin)
exports.initializeSettings = async (req, res) => {
  try {
    // Default settings
    const defaultSettings = [
      {
        key: 'system.name',
        value: 'Hostel Management System',
        description: 'The name of the system',
        category: 'system',
        isPublic: true
      },
      {
        key: 'system.contact.email',
        value: 'admin@hostel.com',
        description: 'Contact email address',
        category: 'system',
        isPublic: true
      },
      {
        key: 'system.contact.phone',
        value: '+91-9876543210',
        description: 'Contact phone number',
        category: 'system',
        isPublic: true
      },
      {
        key: 'booking.auto_approve',
        value: false,
        description: 'Automatically approve booking requests',
        category: 'booking',
        isPublic: false
      },
      {
        key: 'payment.currency',
        value: 'INR',
        description: 'Default currency for payments',
        category: 'payment',
        isPublic: true
      },
      {
        key: 'payment.reminder.days',
        value: 5,
        description: 'Days before due date to send payment reminder',
        category: 'payment',
        isPublic: false
      },
      {
        key: 'notification.email',
        value: true,
        description: 'Send notifications via email',
        category: 'notification',
        isPublic: false
      }
    ];
    
    // Create settings if they don't exist
    for (const setting of defaultSettings) {
      const existingSetting = await Setting.findOne({ key: setting.key });
      if (!existingSetting) {
        await Setting.create({
          ...setting,
          updatedBy: req.user.id
        });
      }
    }
    
    res.status(200).json({
      success: true,
      message: 'Default settings initialized successfully'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error'
    });
  }
};