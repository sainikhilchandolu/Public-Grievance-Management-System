import axios from 'axios';

const api = axios.create({  //reusable Axios object
  baseURL: 'http://localhost:5000/api',
  withCredentials: true,
});

// Attach JWT token from localStorage to every request
api.interceptors.request.use((config) => { //first fn after bd
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`; // bd protect mw
  return config;
});

// On 401, clear auth and redirect to login
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
