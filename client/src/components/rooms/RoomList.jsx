// components/rooms/RoomList.jsx
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { removeRoom } from '../../store/roomSlice';

const RoomList = () => {
  const dispatch = useDispatch();
  const rooms = useSelector((state) => state.rooms.rooms);

  const handleRemove = (id) => {
    dispatch(removeRoom({ id }));
  };

  useEffect(() => {
    // You can fetch rooms from an API and dispatch them to Redux store here.
  }, [dispatch]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-semibold">Rooms List</h2>
      <ul className="space-y-3">
        {rooms.map((room) => (
          <li key={room.id} className="flex justify-between p-4 bg-gray-100 rounded-lg shadow-md">
            <div>
              <p className="text-lg font-semibold">{room.name}</p>
              <p className="text-sm">{room.type}</p>
              <p className="text-sm">₹ {room.price}</p>
            </div>
            <button
              onClick={() => handleRemove(room.id)}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-300"
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomList;
