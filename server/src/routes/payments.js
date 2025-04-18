const express = require('express');
const {
  getPayments,
  getPayment,
  createPayment,
  getUserPayments,
  getOwnerPayments
} = require('../controllers/paymentController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.route('/')
  .get(protect, authorize('admin'), getPayments)
  .post(protect, authorize('guest'), createPayment);

router.route('/me')
  .get(protect, getUserPayments);

router.route('/owner')
  .get(protect, authorize('owner'), getOwnerPayments);

router.route('/:id')
  .get(protect, getPayment);

module.exports = router;