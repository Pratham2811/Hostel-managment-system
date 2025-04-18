const express = require('express');
const {
  getRooms,
  getRoom,
  createRoom,
  updateRoom,
  deleteRoom,
  getHostelRooms
} = require('../controllers/roomController');

const { protect, authorize } = require('../middleware/auth');

const router = express.Router({ mergeParams: true });

router.route('/')
  .get(getHostelRooms)
  .post(protect, authorize('owner'), createRoom);

router.route('/:id')
  .get(getRoom)
  .put(protect, authorize('admin', 'owner'), updateRoom)
  .delete(protect, authorize('admin', 'owner'), deleteRoom);

module.exports = router;