import axios from 'axios';

// Create an Axios instance with the base configuration
const api = axios.create({
    // Use relative URLs to leverage Next.js API rewrites
    // This ensures requests go through the Next.js proxy
    baseURL: '',
    withCredentials: true, // This is important for cookies to be sent
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // Required for Laravel to identify AJAX requests
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    config => {
        // Log the request URL for debugging
        console.log(`Making request to: ${config.method?.toUpperCase()} ${config.url}`);

        const token = localStorage.getItem('token');
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    error => {
        return Promise.reject(error);
    }
);

// Add a response interceptor to handle CSRF token errors
api.interceptors.response.use(
    response => response,
    error => {
        if (error.response && error.response.status === 419) {
            console.error('CSRF token mismatch. Refreshing token...');
            // You could implement token refresh logic here if needed
        }
        return Promise.reject(error);
    }
);

export default api;
