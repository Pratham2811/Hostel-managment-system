// src/components/hostels/HostelForm.jsx
import React, { useState, useEffect } from 'react';

export default function HostelForm({ initial = {}, onSubmit }) {
  const [form, setForm] = useState({ name: '', location: '', description: '' });

  useEffect(() => {
    if (initial) setForm(initial);
  }, [initial]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={submit} className="space-y-4 p-6 bg-white rounded-xl shadow">
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Hostel Name"
        className="input w-full"
        required
      />
      <input
        name="location"
        value={form.location}
        onChange={handleChange}
        placeholder="Location"
        className="input w-full"
        required
      />
      <textarea
        name="description"
        value={form.description}
        onChange={handleChange}
        placeholder="Description"
        className="input w-full h-24"
      />
      <button type="submit" className="btn btn-primary">
        {initial.id ? 'Update' : 'Create'}
      </button>
    </form>
  );
}
