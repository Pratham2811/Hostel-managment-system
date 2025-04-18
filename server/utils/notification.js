const { createNotification } = require('../controllers/notificationController');

// Function to send booking confirmation notification
exports.sendBookingNotification = async (userId, booking) => {
  try {
    await createNotification(
      userId,
      'Booking Confirmation',
      `Your booking for room ${booking.room.roomNumber} has been confirmed.`,
      'success',
      { model: 'Booking', id: booking._id }
    );
  } catch (error) {
    console.error('Error sending booking notification:', error);
  }
};

// Function to send payment confirmation notification
exports.sendPaymentNotification = async (userId, payment) => {
  try {
    await createNotification(
      userId,
      'Payment Confirmation',
      `Your payment of ₹${payment.amount} has been received.`,
      'success',
      { model: 'Payment', id: payment._id }
    );
  } catch (error) {
    console.error('Error sending payment notification:', error);
  }
};

// Function to send complaint status update notification
exports.sendComplaintUpdateNotification = async (userId, complaint) => {
  try {
    let message = '';
    let type = 'info';
    
    switch (complaint.status) {
      case 'in-progress':
        message = `Your complaint "${complaint.title}" is now being processed.`;
        type = 'info';
        break;
      case 'resolved':
        message = `Your complaint "${complaint.title}" has been resolved.`;
        type = 'success';
        break;
      case 'rejected':
        message = `Your complaint "${complaint.title}" has been rejected.`;
        type = 'warning';
        break;
      default:
        message = `Your complaint "${complaint.title}" status has been updated to ${complaint.status}.`;
    }
    
    await createNotification(
      userId,
      'Complaint Update',
      message,
      type,
      { model: 'Complaint', id: complaint._id }
    );
  } catch (error) {
    console.error('Error sending complaint notification:', error);
  }
};

// Function to send room allocation notification
exports.sendRoomAllocationNotification = async (userId, room) => {
  try {
    await createNotification(
      userId,
      'Room Allocation',
      `You have been allocated room ${room.roomNumber} in ${room.block} block.`,
      'success',
      { model: 'Room', id: room._id }
    );
  } catch (error) {
    console.error('Error sending room allocation notification:', error);
  }
};

// Function to send payment reminder notification
exports.sendPaymentReminderNotification = async (userId, dueDate, amount) => {
  try {
    const formattedDate = new Date(dueDate).toLocaleDateString();
    await createNotification(
      userId,
      'Payment Reminder',
      `Your hostel fee payment of ₹${amount} is due on ${formattedDate}.`,
      'warning',
      { model: 'Payment', id: null }
    );
  } catch (error) {
    console.error('Error sending payment reminder notification:', error);
  }
};

// Function to send system announcement to all users
exports.sendAnnouncementToAll = async (userIds, title, message) => {
  try {
    const notifications = userIds.map(userId => ({
      recipient: userId,
      title,
      message,
      type: 'info',
      relatedTo: { model: 'System', id: null }
    }));
    
    // Batch insert notifications
    await require('../models/Notification').insertMany(notifications);
  } catch (error) {
    console.error('Error sending announcement notifications:', error);
  }
};