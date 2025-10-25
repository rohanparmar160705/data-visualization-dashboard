import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth
export const authAPI = {
  signup: (data: { email: string; password: string; name: string; role?: string }) =>
    api.post('/auth/signup', data),
  signin: (data: { email: string; password: string }) =>
    api.post('/auth/signin', data),
  getCurrentUser: () => api.get('/auth/me'),
};

// Datasets
export const datasetAPI = {
  upload: (formData: FormData) =>
    api.post('/datasets/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getAll: () => api.get('/datasets'),
  getOne: (id: string) => api.get(`/datasets/${id}`),
  getData: (id: string, params?: any) => api.get(`/datasets/${id}/data`, { params }),
  delete: (id: string) => api.delete(`/datasets/${id}`),
};

// Admin
export const adminAPI = {
  getUsers: () => api.get('/admin/users'),
  deleteUser: (id: string) => api.delete(`/admin/users/${id}`),
  updateUserRole: (id: string, role: string) =>
    api.put(`/admin/users/${id}/role`, { role }),
};

export default api;