// pages/Complaints/NewComplaint.jsx
import React from 'react';
import ComplaintForm from '../../components/complaints/ComplaintForm';
import { createComplaint } from '../../services/complaintService';

const NewComplaint = () => {
  const handleSubmit = async (data) => {
    try {
      await createComplaint(data);
      alert('Complaint submitted!');
    } catch (err) {
      alert('Error submitting complaint.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Complaint</h1>
      <ComplaintForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewComplaint;
