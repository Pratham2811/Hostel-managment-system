import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Auth Pages
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ResetPassword from './pages/Auth/ResetPassword';

// Dashboard
import Dashboard from './pages/Dashboard/Dashboard';

// Hostels
import HostelsList from './pages/Hostels/HostelsList';
import NewHostel from './pages/Hostels/NewHostel';
import HostelDetails from './pages/Hostels/HostelDetails';

// Rooms
import RoomsList from './pages/Rooms/RoomsList';
import NewRoom from './pages/Rooms/NewRoom';
import RoomDetails from './pages/Rooms/RoomDetails';

// Bookings
import BookingsList from './pages/Bookings/BookingsList';
import NewBooking from './pages/Bookings/NewBooking';
import BookingDetails from './pages/Bookings/BookingDetails';

// Payments
import NewPayment from './pages/Payments/NewPayment';
import PaymentHistory from './pages/Payments/PaymentHistory';

// Reviews
import ReviewsList from './pages/Reviews/ReviewsList';
import WriteReview from './pages/Reviews/WriteReview';

// Complaints
import ComplaintsList from './pages/Complaints/ComplaintsList';
import NewComplaint from './pages/Complaints/NewComplaint';

// Settings
import Settings from './pages/Settings/Settings';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/reset-password" element={<ResetPassword />} />

      {/* Protected Routes */}
      <Route path="/" element={<ProtectedRoute><MainLayout /></ProtectedRoute>}>
        <Route index element={<Navigate to="/dashboard" replace />} />
        <Route path="dashboard" element={<Dashboard />} />
        
        {/* Hostel Routes */}
        <Route path="hostels" element={<HostelsList />} />
        <Route path="hostels/new" element={<NewHostel />} />
        <Route path="hostels/:id" element={<HostelDetails />} />
        
        {/* Room Routes */}
        <Route path="rooms" element={<RoomsList />} />
        <Route path="rooms/new" element={<NewRoom />} />
        <Route path="rooms/:id" element={<RoomDetails />} />
        
        {/* Booking Routes */}
        <Route path="bookings" element={<BookingsList />} />
        <Route path="bookings/new" element={<NewBooking />} />
        <Route path="bookings/:id" element={<BookingDetails />} />
        
        {/* Payment Routes */}
        <Route path="payments/new" element={<NewPayment />} />
        <Route path="payments/history" element={<PaymentHistory />} />
        
        {/* Review Routes */}
        <Route path="reviews" element={<ReviewsList />} />
        <Route path="reviews/new" element={<WriteReview />} />
        
        {/* Complaint Routes */}
        <Route path="complaints" element={<ComplaintsList />} />
        <Route path="complaints/new" element={<NewComplaint />} />
        
        {/* Settings Route */}
        <Route path="settings" element={<Settings />} />
      </Route>

      {/* 404 Catch */}
      <Route path="*" element={<Navigate to="/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;