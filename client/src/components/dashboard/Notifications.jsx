import React from 'react';

const Notifications = ({ notifications }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h2 className="text-xl font-bold text-gray-700 mb-4">Notifications</h2>
      <ul>
        {notifications && notifications.map((notification) => (
          <li key={notification._id} className="py-2 border-b border-gray-200">
            {notification.message} - {new Date(notification.createdAt).toLocaleTimeString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Notifications;