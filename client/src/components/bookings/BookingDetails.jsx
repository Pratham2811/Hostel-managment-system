import React from 'react';
import { Link } from 'react-router-dom';

const BookingDetails = ({ booking, userRole }) => {
    if (!booking) {
        return <div className="text-center">Loading booking details...</div>;
    }

    return (
        <div className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <h2 className="text-2xl font-bold mb-4">Booking Details</h2>
            <div className="mb-4">
                <span className="font-bold">User:</span> {booking.user && `${booking.user.name} (${booking.user.email})`}
            </div>
            <div className="mb-4">
                <span className="font-bold">Room:</span> {booking.room && booking.room.roomNumber}
            </div>
            <div className="mb-4">
                <span className="font-bold">Check-in Date:</span> {new Date(booking.checkInDate).toLocaleDateString()}
            </div>
            <div className="mb-4">
                <span className="font-bold">Check-out Date:</span> {new Date(booking.checkOutDate).toLocaleDateString()}
            </div>
            <div className="mb-6">
                <span className="font-bold">Status:</span> {booking.status}
            </div>

            <Link to="/bookings" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">
                Back to Bookings
            </Link>
        </div>
    );
};

export default BookingDetails;