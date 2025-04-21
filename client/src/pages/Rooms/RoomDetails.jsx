// pages/Rooms/RoomDetails.jsx
import React from "react";
import RoomDetails from "../../components/rooms/RoomDetails";

const dummyRoom = {
  _id: "1",
  name: "A101",
  type: "Single",
  price: 1200,
  capacity: 1,
  description: "Peaceful room with balcony",
};

const RoomDetailsPage = () => {
  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Room Details</h1>
      <RoomDetails room={dummyRoom} />
    </div>
  );
};

export default RoomDetailsPage;
