// pages/HostelsList.jsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchHostels, deleteHostel } from "../../store/hostelSlice";
import HostelCard from "../../components/hostels/HostelCard";

const HostelsList = () => {
  const dispatch = useDispatch();
  const { hostels, isLoading, error } = useSelector((state) => state.hostels);
  const { user } = useSelector((state) => state.auth);

  const [searchTerm, setSearchTerm] = useState("");
  const [filterOptions, setFilterOptions] = useState({
    minPrice: "",
    maxPrice: "",
    ratings: [],
    amenities: [],
  });

  useEffect(() => {
    dispatch(fetchHostels());
  }, [dispatch]);

  const filteredHostels = hostels.filter((hostel) => {
    const matchesSearch =
      hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hostel.description.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesPrice =
      (filterOptions.minPrice === "" || hostel.minPrice >= Number(filterOptions.minPrice)) &&
      (filterOptions.maxPrice === "" || hostel.maxPrice <= Number(filterOptions.maxPrice));

    const matchesRating =
      filterOptions.ratings.length === 0 ||
      filterOptions.ratings.includes(Math.floor(hostel.averageRating));

    const matchesAmenities =
      filterOptions.amenities.length === 0 ||
      filterOptions.amenities.every((amenity) => hostel.amenities.includes(amenity));

    return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (type === "checkbox") {
      if (name === "rating") {
        setFilterOptions((prev) => {
          const ratings = checked
            ? [...prev.ratings, Number(value)]
            : prev.ratings.filter((r) => r !== Number(value));

          return { ...prev, ratings };
        });
      } else if (name === "amenity") {
        setFilterOptions((prev) => {
          const amenities = checked
            ? [...prev.amenities, value]
            : prev.amenities.filter((a) => a !== value);

          return { ...prev, amenities };
        });
      }
    } else {
      setFilterOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleDeleteHostel = (id) => {
    if (window.confirm("Are you sure you want to delete this hostel?")) {
      dispatch(deleteHostel(id));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-10">
        <p className="text-red-500">Error loading hostels: {error}</p>
        <button
          onClick={() => dispatch(fetchHostels())}
          className="mt-4 text-blue-500 hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  const isAdmin = user?.role === "admin";
  const isHostelOwner = user?.role === "hostel_owner";
  const canAddHostel = isAdmin || isHostelOwner;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-semibold">Hostels</h1>
        {canAddHostel && (
          <Link to="/hostels/new" className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Add New Hostel
          </Link>
        )}
      </div>

      <div className="mb-6 flex justify-between items-center">
        <div className="w-full max-w-md">
          <input
            type="text"
            placeholder="Search hostels..."
            value={searchTerm}
            onChange={handleSearchChange}
            className="w-full p-2 border rounded-lg"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredHostels.length > 0 ? (
          filteredHostels.map((hostel) => (
            <HostelCard
              key={hostel._id}
              hostel={hostel}
              canEdit={isAdmin || (isHostelOwner && hostel.owner === user?._id)}
              onDelete={() => handleDeleteHostel(hostel._id)}
            />
          ))
        ) : (
          <div className="col-span-full text-center">
            <p>No hostels found. Try adjusting your search criteria.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelsList;
