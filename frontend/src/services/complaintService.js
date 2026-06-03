import api from './api';

// Create complaint — uses FormData for image upload
export const createComplaint = (data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === 'images' && Array.isArray(val)) {
      val.forEach((file) => formData.append('images', file));
    } else if (val !== undefined && val !== null) {
      formData.append(key, val);
    }
  });
  return api.post('/complaints', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Track complaint by Tracking ID (public — no auth)
export const trackComplaint = (trackingId) =>
  api.get(`/complaints/track/${trackingId}`);

// Get complaints list (with filters)
export const getComplaints = (params = {}) =>
  api.get('/complaints', { params });

// Get single complaint by MongoDB ID
export const getComplaint = (id) => api.get(`/complaints/${id}`);

// Update complaint details
export const updateComplaint = (id, data) => {
  const formData = new FormData();
  Object.entries(data).forEach(([key, val]) => {
    if (key === 'images' && Array.isArray(val)) {
      val.forEach((file) => formData.append('images', file));
    } else if (val !== undefined && val !== null) {
      formData.append(key, val);
    }
  });
  return api.put(`/complaints/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};

// Delete complaint
export const deleteComplaint = (id) => api.delete(`/complaints/${id}`);

// Update status (admin)
export const updateStatus = (id, data) =>
  api.put(`/complaints/${id}/status`, data);

// Get stats (admin)
export const getStats = () => api.get('/complaints/stats');
