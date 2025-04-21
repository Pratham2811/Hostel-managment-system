// components/hostels/HostelCard.jsx
import React from "react";
import { FaMapMarkerAlt, FaRupeeSign, FaStar, FaEdit, FaTrash } from "react-icons/fa";
import { Link } from "react-router-dom";

const HostelCard = ({ hostel, canEdit, onDelete }) => {
  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-all duration-300 max-w-sm">
      <img
        src={hostel.image || "https://via.placeholder.com/400x200"}
        alt={hostel.name}
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h2 className="text-xl font-semibold text-gray-800">{hostel.name}</h2>
        <p className="text-gray-500 text-sm flex items-center space-x-2">
          <FaMapMarkerAlt className="text-gray-400" />
          <span>{hostel.address}</span>
        </p>
        <p className="text-gray-700 mt-2">{hostel.description}</p>
        <div className="flex items-center justify-between mt-4">
          <div className="flex items-center space-x-2">
            <FaStar className="text-yellow-400" />
            <span>{hostel.averageRating}</span>
          </div>
          <div className="flex items-center space-x-2">
            <FaRupeeSign className="text-gray-500" />
            <span>{hostel.minPrice} - {hostel.maxPrice}</span>
          </div>
        </div>
        {canEdit && (
          <div className="flex justify-between mt-4">
            <Link
              to={`/hostels/edit/${hostel._id}`}
              className="text-blue-500 hover:text-blue-700"
            >
              <FaEdit className="inline-block" /> Edit
            </Link>
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

export default HostelCard;
