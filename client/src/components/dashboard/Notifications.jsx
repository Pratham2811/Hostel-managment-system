// components/dashboard/Notifications.jsx
import React from 'react';
import { useSelector } from 'react-redux';

const Notifications = () => {
  const { notifications } = useSelector((state) => state.notifications);

  return (
    <div className="p-4 bg-white rounded-xl shadow">
      <h2 className="text-xl font-semibold mb-4">Notifications</h2>
      <ul className="space-y-2">
        {notifications.map((n) => (
          <li key={n.id}>
            <span className="font-medium">{n.message}</span>
            <span className="text-sm text-gray-500 ml-2">
              ({new Date(n.date).toLocaleDateString()})
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;
