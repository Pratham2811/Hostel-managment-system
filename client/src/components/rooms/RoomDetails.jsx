// components/rooms/RoomDetails.jsx
import React from "react";

const RoomDetails = ({ room }) => {
  if (!room) return <div>No room selected.</div>;

  return (
    <div className="p-4 border shadow rounded-md">
      <h2 className="text-2xl font-bold mb-2">{room.name}</h2>
      <p><strong>Type:</strong> {room.type}</p>
      <p><strong>Price:</strong> ₹{room.price}</p>
      <p><strong>Capacity:</strong> {room.capacity}</p>
      <p><strong>Description:</strong> {room.description}</p>
    </div>
  );
};

export default RoomDetails;
