import React from 'react';

const DashboardStats = ({ totalHostels, totalBookings, totalComplaints, totalReviews }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-700">Total Hostels</h3>
        <p className="text-2xl text-blue-500">{totalHostels}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-700">Total Bookings</h3>
        <p className="text-2xl text-green-500">{totalBookings}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-700">Total Complaints</h3>
        <p className="text-2xl text-red-500">{totalComplaints}</p>
      </div>
      <div className="bg-white shadow-md rounded-lg p-4">
        <h3 className="text-lg font-bold text-gray-700">Total Reviews</h3>
        <p className="text-2xl text-yellow-500">{totalReviews}</p>
      </div>
    </div>
  );
};

export default DashboardStats;