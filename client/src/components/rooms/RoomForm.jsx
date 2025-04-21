// components/rooms/RoomForm.jsx
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { addRoom, updateRoom } from '../../store/roomSlice';

const RoomForm = ({ existingRoom }) => {
  const dispatch = useDispatch();
  const [roomData, setRoomData] = useState({
    id: existingRoom ? existingRoom.id : '',
    name: existingRoom ? existingRoom.name : '',
    type: existingRoom ? existingRoom.type : '',
    price: existingRoom ? existingRoom.price : '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRoomData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (existingRoom) {
      // Dispatch update action
      dispatch(updateRoom(roomData));
    } else {
      // Dispatch add action
      dispatch(addRoom(roomData));
    }

    // Clear the form after submission
    setRoomData({ name: '', type: '', price: '' });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 bg-white p-6 shadow-md rounded-lg">
      <h2 className="text-xl font-semibold">{existingRoom ? 'Update Room' : 'Add Room'}</h2>
      <div className="space-y-2">
        <label htmlFor="name" className="block text-sm">Room Name</label>
        <input
          type="text"
          id="name"
          name="name"
          value={roomData.name}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="type" className="block text-sm">Room Type</label>
        <input
          type="text"
          id="type"
          name="type"
          value={roomData.type}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <div className="space-y-2">
        <label htmlFor="price" className="block text-sm">Price</label>
        <input
          type="number"
          id="price"
          name="price"
          value={roomData.price}
          onChange={handleInputChange}
          className="w-full p-2 border border-gray-300 rounded-lg"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        {existingRoom ? 'Update Room' : 'Add Room'}
      </button>
    </form>
  );
};

export default RoomForm;
