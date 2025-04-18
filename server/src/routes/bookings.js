const express = require('express');
const {
  getBookings,
  getBooking,
  createBooking,
  updateBooking,
  deleteBooking,
  getUserBookings,
  getOwnerBookings
} = require('../controllers/bookingController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getBookings)
  .post(protect, authorize('guest'), createBooking);

router.route('/me')
  .get(protect, getUserBookings);

router.route('/owner')
  .get(protect, authorize('owner'), getOwnerBookings);

router.route('/:id')
  .get(protect, getBooking)
  .put(protect, updateBooking)
  .delete(protect, authorize('admin'), deleteBooking);

module.exports = router;