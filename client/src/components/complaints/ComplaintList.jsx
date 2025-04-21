// components/complaints/ComplaintList.jsx
import React from 'react';

const ComplaintList = ({ complaints }) => {
  return (
    <div className="grid gap-4">
      {complaints.map((comp) => (
        <div key={comp.id} className="p-4 bg-white rounded-xl shadow">
          <h3 className="text-lg font-semibold">{comp.title}</h3>
          <p>{comp.description}</p>
          <p className="text-sm text-gray-500">Status: {comp.status}</p>
        </div>
      ))}
    </div>
  );
};

export default ComplaintList;
