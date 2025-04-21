// pages/Bookings/BookingDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchBookingById } from '../../services/bookingService';
import BookingDetails from '../../components/bookings/BookingDetails';

const BookingDetailsPage = () => {
  const { id } = useParams();
  const [booking, setBooking] = useState(null);

  useEffect(() => {
    const getBooking = async () => {
      const res = await fetchBookingById(id);
      setBooking(res.data);
    };
    getBooking();
  }, [id]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Booking Details</h1>
      <BookingDetails booking={booking} />
    </div>
  );
};

export default BookingDetailsPage;
