import axios from 'axios';

// Direct access to the Laravel API
const API_URL = 'http://127.0.0.1:8000/api';

const api = axios.create({
  baseURL: 'http://127.0.0.1:8000', // Set the backend server's base URL
  withCredentials: true, // Include credentials for CSRF protection
});

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error('API Error interceptor:', error.config?.url, error.message, error.response?.data);

    // Handle 401 Unauthorized errors
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      // Redirect to login page if not already there
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }

    return Promise.reject(error);
  }
);

export default api;
