const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification
} = require('../controllers/notificationController');

// Protect all routes
router.use(protect);

// Get user notifications
router.get('/', getUserNotifications);

// Get unread notification count
router.get('/unread/count', getUnreadCount);

// Mark notification as read
router.put('/:id/read', markAsRead);

// Mark all notifications as read
router.put('/read/all', markAllAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

module.exports = router;