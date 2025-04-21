// components/dashboard/RecentBookings.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';

const RecentBookings = () => {
  const { bookings } = useSelector((state) => state.bookings);
  const recent = bookings.slice(-5).reverse();

  return (
    <div className="p-4 bg-white rounded-xl shadow mb-6">
      <h2 className="text-xl font-semibold mb-4">Recent Bookings</h2>
      <ul className="space-y-2">
        {recent.map((b) => (
          <li key={b.id}>
            <Link to={`/bookings/${b.id}`} className="text-blue-600 hover:underline">
              #{b.id} — {b.user}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecentBookings;
