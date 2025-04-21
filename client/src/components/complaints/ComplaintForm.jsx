// components/complaints/ComplaintForm.jsx
import React, { useState } from 'react';

const ComplaintForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ title: '', description: '', status: 'pending' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl shadow">
      <input name="title" value={form.title} onChange={handleChange} placeholder="Complaint Title" className="input" />
      <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="input h-24" />
      <select name="status" value={form.status} onChange={handleChange} className="input">
        <option value="pending">Pending</option>
        <option value="resolved">Resolved</option>
      </select>
      <button type="submit" className="btn btn-primary">Submit Complaint</button>
    </form>
  );
};

export default ComplaintForm;
