// components/rooms/RoomCard.jsx
import React from "react";
import { FaRupeeSign, FaBed } from "react-icons/fa";

const RoomCard = ({ room, onDelete, canEdit }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 max-w-sm">
      <img
        src={room.image || "https://via.placeholder.com/400x200"}
        alt={room.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
        <p className="text-gray-500 text-sm flex items-center space-x-2">
          <FaBed className="text-gray-400" />
          <span>{room.beds} Beds</span>
        </p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <FaRupeeSign className="text-gray-500" />
            <span>{room.price}</span>
          </div>
        </div>
        {canEdit && (
          <div className="flex justify-between mt-4">
            <button
              onClick={onDelete}
              className="text-red-500 hover:text-red-700"
            >
              <FaTrash className="inline-block" /> Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default RoomCard;
