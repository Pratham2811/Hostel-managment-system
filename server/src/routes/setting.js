const express = require('express');
const router = express.Router();
const { check } = require('express-validator');
const { protect, authorize } = require('../middleware/auth');
const {
  getAllSettings,
  getPublicSettings,
  getSettingByKey,
  updateSetting,
  deleteSetting,
  initializeSettings
} = require('../controllers/settingController');

// Get public settings - Public
router.get('/public', getPublicSettings);

// All other routes require authentication
router.use(protect);

// Only admin can access these routes
router.use(authorize('admin'));

// Get all settings
router.get('/', getAllSettings);

// Get setting by key
router.get('/:key', getSettingByKey);

// Create or update setting
router.put(
  '/:key',
  [
    check('value', 'Value is required').exists(),
    check('category', 'Category must be valid').optional().isIn(['general', 'payment', 'booking', 'notification', 'system'])
  ],
  updateSetting
);

// Delete setting
router.delete('/:key', deleteSetting);

// Initialize default settings
router.post('/initialize', initializeSettings);

module.exports = router;