import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchHostels, deleteHostel } from '../../store/hostelSlice';
import HostelCard from '../../components/hostels/HostelCard';

const HostelsList = () => {
  const dispatch = useDispatch();
  const { hostels, isLoading, error } = useSelector(state => state.hostels);
  const { user } = useSelector(state => state.auth);
  
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOptions, setFilterOptions] = useState({
    minPrice: '',
    maxPrice: '',
    ratings: [],
    amenities: []
  });
  
  useEffect(() => {
    dispatch(fetchHostels());
  }, [dispatch]);
  
  // Filter hostels based on search term and filters
  const filteredHostels = hostels.filter(hostel => {
    // Search term filter
    const matchesSearch = hostel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         hostel.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Price filter
    const matchesPrice = (filterOptions.minPrice === '' || hostel.minPrice >= Number(filterOptions.minPrice)) &&
                        (filterOptions.maxPrice === '' || hostel.maxPrice <= Number(filterOptions.maxPrice));
    
    // Ratings filter
    const matchesRating = filterOptions.ratings.length === 0 || 
                         filterOptions.ratings.includes(Math.floor(hostel.averageRating));
    
    // Amenities filter
    const matchesAmenities = filterOptions.amenities.length === 0 ||
                           filterOptions.amenities.every(amenity => 
                             hostel.amenities.includes(amenity));
    
    return matchesSearch && matchesPrice && matchesRating && matchesAmenities;
  });
  
  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  // Handle filter changes
  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    if (type === 'checkbox') {
      if (name === 'rating') {
        setFilterOptions(prev => {
          const ratings = checked 
            ? [...prev.ratings, Number(value)]
            : prev.ratings.filter(r => r !== Number(value));
          
          return { ...prev, ratings };
        });
      } else if (name === 'amenity') {
        setFilterOptions(prev => {
          const amenities = checked 
            ? [...prev.amenities, value]
            : prev.amenities.filter(a => a !== value);
          
          return { ...prev, amenities };
        });
      }
    } else {
      setFilterOptions(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  // Handle hostel deletion
  const handleDeleteHostel = (id) => {
    if (window.confirm('Are you sure you want to delete this hostel?')) {
      dispatch(deleteHostel(id));
    }
  };
  
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">
          <i className="fas fa-exclamation-circle"></i>
          <p>Error loading hostels: {error}</p>
          <button onClick={() => dispatch(fetchHostels())}>Retry</button>
        </div>
      </div>
    );
  }

  const isAdmin = user?.role === 'admin';
  const isHostelOwner = user?.role === 'hostel_owner';
  const canAddHostel = isAdmin || isHostelOwner;

  return (
    <div className="hostels-list-container">
      <div className="page-header">
        <div className="title-section">
          <h1>Hostels</h1>
          <p>Browse and manage available hostels</p>
        </div>
        {canAddHostel && (
          <Link to="/hostels/new" className="add-hostel-btn">
            <i className="fas fa-plus"></i> Add New Hostel
          </Link>
        )}
      </div>

      <div className="filters-section">
        <div className="search-bar">
          <i className="fas fa-search"></i>
          <input
            type="text"
            placeholder="Search hostels by name, location, or features..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>

        <div className="filters-container">
          <div className="price-filter">
            <h4>Price Range</h4>
            <div className="price-inputs">
              <input
                type="number"
                name="minPrice"
                placeholder="Min"
                value={filterOptions.minPrice}
                onChange={handleFilterChange}
              />
              <span>to</span>
              <input
                type="number"
                name="maxPrice"
                placeholder="Max"
                value={filterOptions.maxPrice}
                onChange={handleFilterChange}
              />
            </div>
          </div>

          <div className="rating-filter">
            <h4>Rating</h4>
            <div className="rating-checkboxes">
              {[5, 4, 3, 2, 1].map(rating => (
                <label key={rating} className="rating-checkbox">
                  <input
                    type="checkbox"
                    name="rating"
                    value={rating}
                    checked={filterOptions.ratings.includes(rating)}
                    onChange={handleFilterChange}
                  />
                  {rating} Stars & Up
                </label>
              ))}
            </div>
          </div>

          <div className="amenities-filter">
            <h4>Amenities</h4>
            <div className="amenities-checkboxes">
              {['WiFi', 'AC', 'Laundry', 'Kitchen', 'Parking', 'Study Room'].map(amenity => (
                <label key={amenity} className="amenity-checkbox">
                  <input
                    type="checkbox"
                    name="amenity"
                    value={amenity}
                    checked={filterOptions.amenities.includes(amenity)}
                    onChange={handleFilterChange}
                  />
                  {amenity}
                </label>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="hostels-grid">
        {filteredHostels.length > 0 ? (
          filteredHostels.map(hostel => (
            <HostelCard
              key={hostel._id}
              hostel={hostel}
              canEdit={isAdmin || (isHostelOwner && hostel.owner === user?._id)}
              onDelete={() => handleDeleteHostel(hostel._id)}
            />
          ))
        ) : (
          <div className="no-hostels-found">
            <i className="fas fa-search"></i>
            <h3>No hostels found</h3>
            <p>Try adjusting your search criteria or filters</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HostelsList;