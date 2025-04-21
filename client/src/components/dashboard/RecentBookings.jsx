import React from 'react';
import { Link } from 'react-router-dom';

const RecentBookings = ({ bookings }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Recent Bookings</h2>
      <ul>
        {bookings && bookings.map((booking) => (
          <li key={booking._id} className="py-2 border-b border-gray-200">
            <Link to={`/bookings/${booking._id}`} className="hover:text-blue-500">
              Booking ID: {booking._id} - Check-in: {new Date(booking.checkInDate).toLocaleDateString()}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentBookings;