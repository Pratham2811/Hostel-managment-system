import React, { useState, useEffect } from 'react';

const BookingForm = ({ onSubmit, initialValues, rooms, users, editing }) => {
    const [roomId, setRoomId] = useState(initialValues?.room || '');
    const [userId, setUserId] = useState(initialValues?.user || '');
    const [checkInDate, setCheckInDate] = useState(initialValues?.checkInDate || '');
    const [checkOutDate, setCheckOutDate] = useState(initialValues?.checkOutDate || '');

    useEffect(() => {
        if (initialValues) {
            setRoomId(initialValues.room || '');
            setUserId(initialValues.user || '');
            setCheckInDate(initialValues.checkInDate || '');
            setCheckOutDate(initialValues.checkOutDate || '');
        }
    }, [initialValues]);

    const handleSubmit = (e) => {
        e.preventDefault();
        const bookingData = {
            room: roomId,
            user: userId,
            checkInDate,
            checkOutDate
        };
        onSubmit(bookingData);
    };

    return (
        <form onSubmit={handleSubmit} className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4">
            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="roomId">
                    Room
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="roomId"
                    value={roomId}
                    onChange={(e) => setRoomId(e.target.value)}
                    required
                    disabled={editing}
                >
                    <option value="">Select Room</option>
                    {rooms && rooms.map(room => (
                        <option key={room._id} value={room._id}>{room.roomNumber} ({room.roomType})</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="userId">
                    User
                </label>
                <select
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="userId"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    required
                    disabled={editing}
                >
                    <option value="">Select User</option>
                    {users && users.map(user => (
                        <option key={user._id} value={user._id}>{user.name} ({user.email})</option>
                    ))}
                </select>
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkInDate">
                    Check-in Date
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="checkInDate"
                    type="date"
                    value={checkInDate}
                    onChange={(e) => setCheckInDate(e.target.value)}
                    required
                />
            </div>

            <div className="mb-4">
                <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="checkOutDate">
                    Check-out Date
                </label>
                <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    id="checkOutDate"
                    type="date"
                    value={checkOutDate}
                    onChange={(e) => setCheckOutDate(e.target.value)}
                    required
                />
            </div>

            <div className="flex items-center justify-between">
                <button
                    className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                    type="submit"
                >
                    Submit
                </button>
            </div>
        </form>
    );
};

export default BookingForm;