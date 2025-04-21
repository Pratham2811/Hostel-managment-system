// services/complaintService.js
import api from './api';

export const fetchComplaints = () => api.get('/complaints');
export const fetchComplaintById = (id) => api.get(`/complaints/${id}`);
export const createComplaint = (data) => api.post('/complaints', data);
export const updateComplaint = (id, data) => api.put(`/complaints/${id}`, data);
export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);
