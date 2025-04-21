// components/bookings/BookingDetails.jsx
import React from 'react';

const BookingDetails = ({ booking }) => {
  if (!booking) return null;

  return (
    <div className="bg-white rounded-xl p-6 shadow">
      <h2 className="text-2xl font-bold mb-2">Booking #{booking.id}</h2>
      <p><strong>User:</strong> {booking.user}</p>
      <p><strong>Room:</strong> {booking.roomNumber}</p>
      <p><strong>Status:</strong> {booking.status}</p>
    </div>
  );
};

export default BookingDetails;
