// pages/Rooms/NewRoom.jsx
import React from "react";
import RoomForm from "../../components/rooms/RoomForm";

const NewRoom = () => {
  const handleSubmit = (formData) => {
    console.log("Creating room:", formData);
    // Call API here
  };

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Add New Room</h1>
      <RoomForm onSubmit={handleSubmit} />
    </div>
  );
};

export default NewRoom;
