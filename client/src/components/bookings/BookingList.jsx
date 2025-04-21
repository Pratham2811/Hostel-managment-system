import React from 'react';
import { Link } from 'react-router-dom';

const BookingList = ({ bookings, onDelete, userRole }) => {
    return (
        <div className="bg-white shadow-md rounded my-6 overflow-x-auto">
            <table className="min-w-max w-full table-auto">
                <thead>
                    <tr className="bg-gray-200 text-gray-600 uppercase text-sm leading-normal">
                        <th className="py-3 px-6 text-left">User</th>
                        <th className="py-3 px-6 text-left">Room</th>
                        <th className="py-3 px-6 text-center">Check-in Date</th>
                        <th className="py-3 px-6 text-center">Check-out Date</th>
                        <th className="py-3 px-6 text-center">Status</th>
                        <th className="py-3 px-6 text-center">Actions</th>
                    </tr>
                </thead>
                <tbody className="text-gray-600 text-sm font-light">
                    {bookings && bookings.map((booking) => (
                        <tr key={booking._id} className="border-b border-gray-200 hover:bg-gray-100">
                            <td className="py-3 px-6 text-left whitespace-nowrap">
                                {booking.user && `${booking.user.name} (${booking.user.email})`}
                            </td>
                            <td className="py-3 px-6 text-left">
                                {booking.room && booking.room.roomNumber}
                            </td>
                            <td className="py-3 px-6 text-center">
                                {new Date(booking.checkInDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-6 text-center">
                                {new Date(booking.checkOutDate).toLocaleDateString()}
                            </td>
                            <td className="py-3 px-6 text-center">
                <span className={`bg-${
                    booking.status === 'confirmed' ? 'green' : booking.status === 'cancelled' ? 'red' : 'yellow'
                }-200 text-${
                    booking.status === 'confirmed' ? 'green' : booking.status === 'cancelled' ? 'red' : 'yellow'
                }-600 py-1 px-3 rounded-full text-xs`}>
                  {booking.status}
                </span>
              </td>
                            <td className="py-3 px-6 text-center">
                                <div className="flex item-center justify-center">
                                    <Link to={`/bookings/${booking._id}`} className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7 2.26 3.447 2.26 8.057 0 11.504-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7-2.26-3.447-2.26-8.057 0-11.504z" />
                                        </svg>
                                    </Link>

                                    {userRole === 'admin' && (
                                        <div className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110 cursor-pointer" onClick={() => onDelete(booking._id)}>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default BookingList;