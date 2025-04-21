// pages/Rooms/RoomsList.jsx
import React, { useState } from "react";
import RoomList from "../../components/rooms/RoomList";
import RoomDetails from "../../components/rooms/RoomDetails";

const dummyRooms = [
  { _id: "1", name: "A101", type: "Single", price: 1200, capacity: 1, description: "Nice view" },
  { _id: "2", name: "B202", type: "Double", price: 2000, capacity: 2, description: "Spacious" },
];

const RoomsList = () => {
  const [selectedRoomId, setSelectedRoomId] = useState(null);

  const selectedRoom = dummyRooms.find((r) => r._id === selectedRoomId);

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">All Rooms</h1>
      <RoomList rooms={dummyRooms} onSelect={setSelectedRoomId} />
      {selectedRoom && (
        <div className="mt-8">
          <h2 className="text-2xl font-semibold mb-2">Room Details</h2>
          <RoomDetails room={selectedRoom} />
        </div>
      )}
    </div>
  );
};

export default RoomsList;
