const express = require('express');
const {
  getHostels,
  getHostel,
  createHostel,
  updateHostel,
  deleteHostel,
  getHostelsByOwner
} = require('../controllers/hostelController');

const { protect, authorize } = require('../middleware/auth');

// Include other resource routers
const roomRouter = require('./room');

const router = express.Router();

// Re-route into other resource routers
router.use('/:hostelId/room', roomRouter);

router.route('/')
  .get(getHostels)
  .post(protect, authorize('owner'), createHostel);

router.route('/owner')
  .get(protect, authorize('owner'), getHostelsByOwner);

router.route('/:id')
  .get(getHostel)
  .put(protect, authorize('admin', 'owner'), updateHostel)
  .delete(protect, authorize('admin', 'owner'), deleteHostel);

module.exports = router;