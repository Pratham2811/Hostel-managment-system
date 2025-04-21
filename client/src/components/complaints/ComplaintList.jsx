import React from 'react';

const ComplaintList = ({ complaints, userRole, onUpdateStatus }) => {
  return (
    <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
      <table className="min-w-max w-full table-auto">
        <thead>
          <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
            <th className="py-3 px-6 text-left">User</th>
            <th className="py-3 px-6 text-left">Subject</th>
            <th className="py-3 px-6 text-left">Description</th>
            <th className="py-3 px-6 text-center">Status</th>
            {userRole === 'admin' && <th className="py-3 px-6 text-center">Actions</th>}
          </tr>
        </thead>
        <tbody className="text-gray-600 text-sm font-light">
          {complaints && complaints.map((complaint) => (
            <tr key={complaint._id} className="border-b border-gray-200 hover:bg-gray-100">
              <td className="py-3 px-6 text-left whitespace-nowrap">
                {complaint.user ? complaint.user.name : 'Unknown User'}
              </td>
              <td className="py-3 px-6 text-left">
                {complaint.subject}
              </td>
              <td className="py-3 px-6 text-left">
                {complaint.description}
              </td>
              <td className="py-3 px-6 text-center">
                {complaint.status}
              </td>
              {userRole === 'admin' && (
                <td className="py-3 px-6 text-center">
                  <select
                    value={complaint.status}
                    onChange={(e) => onUpdateStatus(complaint._id, e.target.value)}
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                  >
                    <option value="pending">Pending</option>
                    <option value="reviewing">Reviewing</option>
                    <option value="resolved">Resolved</option>
                  </select>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComplaintList;