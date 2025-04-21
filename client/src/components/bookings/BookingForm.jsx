// components/bookings/BookingForm.jsx
import React, { useState } from 'react';

const BookingForm = ({ onSubmit }) => {
  const [form, setForm] = useState({ user: '', roomNumber: '', status: 'pending' });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-6 bg-white rounded-xl shadow">
      <input name="user" value={form.user} onChange={handleChange} placeholder="User name" className="input" />
      <input name="roomNumber" value={form.roomNumber} onChange={handleChange} placeholder="Room #" className="input" />
      <select name="status" value={form.status} onChange={handleChange} className="input">
        <option value="pending">Pending</option>
        <option value="confirmed">Confirmed</option>
      </select>
      <button type="submit" className="btn btn-primary">Submit Booking</button>
    </form>
  );
};

export default BookingForm;
