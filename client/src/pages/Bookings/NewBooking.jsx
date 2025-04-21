// pages/Bookings/NewBooking.jsx
import React from 'react';
import { createBooking } from '../../services/bookingService';
import BookingForm from '../../components/bookings/BookingForm';

const NewBooking = () => {
  const handleSubmit = async (data) => {
    try {
      await createBooking(data);
      alert('Booking created!');
    } catch (error) {
      alert('Failed to create booking.');
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">New Booking</h1>
      <BookingForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewBooking;
