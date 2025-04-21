// pages/Bookings/BookingsList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getBookings } from '../../store/bookingSlice';
import BookingList from '../../components/bookings/BookingList';

const BookingsList = () => {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  useEffect(() => {
    dispatch(getBookings());
  }, [dispatch]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">All Bookings</h1>
      {loading ? <p>Loading...</p> : <BookingList bookings={bookings} />}
    </div>
  );
};

export default BookingsList;
