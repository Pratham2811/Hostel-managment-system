// services/bookingService.js
import api from './api';

export const fetchBookings = () => api.get('/bookings');
export const fetchBookingById = (id) => api.get(`/bookings/${id}`);
export const createBooking = (data) => api.post('/bookings', data);
export const updateBooking = (id, data) => api.put(`/bookings/${id}`, data);
export const deleteBooking = (id) => api.delete(`/bookings/${id}`);
