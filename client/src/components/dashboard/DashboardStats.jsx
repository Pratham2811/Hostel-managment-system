// components/dashboard/DashboardStats.jsx
import React from 'react';

const DashboardStats = ({ stats }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
    {stats.map(({ label, value }) => (
      <div key={label} className="p-4 bg-white rounded-xl shadow flex flex-col items-center">
        <span className="text-3xl font-bold">{value}</span>
        <span className="text-gray-500">{label}</span>
      </div>
    ))}
  </div>
);

export default DashboardStats;
