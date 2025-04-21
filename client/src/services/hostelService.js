// services/hostelService.js
import api from './api';

export const fetchHostels = (query = '') =>
  api.get(`/hostels${query ? `?search=${query}` : ''}`);

export const fetchHostelById = (id) =>
  api.get(`/hostels/${id}`);

export const saveHostel = (data) =>
  data.id ? api.put(`/hostels/${data.id}`, data) : api.post('/hostels', data);

export const deleteHostel = (id) =>
  api.delete(`/hostels/${id}`);
