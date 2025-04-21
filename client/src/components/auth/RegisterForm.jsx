import React, { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';

export default function RegisterForm() {
  const { register } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-md mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-semibold mb-4">Register</h2>
      {error && <div className="text-red-500 mb-2">{error}</div>}
      <label className="block mb-2">
        <span className="text-gray-700">Name</span>
        <input name="name" value={form.name} onChange={handleChange} className="input" required />
      </label>
      <label className="block mb-2">
        <span className="text-gray-700">Email</span>
        <input type="email" name="email" value={form.email} onChange={handleChange} className="input" required />
      </label>
      <label className="block mb-4">
        <span className="text-gray-700">Password</span>
        <input type="password" name="password" value={form.password} onChange={handleChange} className="input" required />
      </label>
      <button type="submit" className="w-full py-2 bg-green-600 text-white rounded hover:bg-green-700">
        Sign Up
      </button>
    </form>
  );
}