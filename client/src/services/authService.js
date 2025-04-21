import axios from 'axios';

const API_URL = '/api/auth';

export const login = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const register = (info) => axios.post(`${API_URL}/register`, info);
export const forgotPassword = (email) => axios.post(`${API_URL}/forgot-password`, { email });