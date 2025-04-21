import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import Login from './pages/Auth/Login';
import Register from './pages/Auth/Register';
import ForgotPassword from './components/auth/ForgotPassword';
import { useAuth } from './hooks/useAuth';
import BookingsList from './pages/Bookings/BookingsList';
import NewBooking from './pages/Bookings/NewBooking';
import BookingDetailsPage from './pages/Bookings/BookingDetails';
import ComplaintsList from './pages/Complaints/ComplaintsList';
import NewComplaint from './pages/Complaints/NewComplaint';
import Dashboard from './pages/Dashboard/Dashboard';
export default function AppRoutes() {
  const { user } = useAuth();
  return (
    <Routes>
      <Route path="/auth/login" element={!user ? <Login /> : <Navigate to="/dashboard" />} />
      <Route path="/auth/register" element={!user ? <Register /> : <Navigate to="/dashboard" />} />
      <Route path="/auth/forgot-password" element={<ForgotPassword />} />
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={user ? <MainLayout /> : <Navigate to="/auth/login" />} />
        {/* TODO: Add protected feature routes */}
      </Route>
      <Route path="*" element={<Navigate to={user ? '/dashboard' : '/auth/login'} replace />} />
      <Route path="/bookings" element={<BookingsList />} />
<Route path="/bookings/new" element={<NewBooking />} />
<Route path="/bookings/:id" element={<BookingDetailsPage />} />
<Route path="/complaints" element={<ComplaintsList />} />
<Route path="/complaints/new" element={<NewComplaint />} />
<Route path="/dashboard" element={<Dashboard />} />

    </Routes>
  );
}