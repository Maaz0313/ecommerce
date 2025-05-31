import axios from 'axios';

// Create an Axios instance with the base configuration
const api = axios.create({
    // Use relative URLs to leverage the custom API proxy route
    // This ensures requests go through the Next.js proxy at /api/[...proxy]
    baseURL: '/api',
    withCredentials: true, // This is important for cookies to be sent
    headers: {
        'X-Requested-With': 'XMLHttpRequest', // Required for Laravel to identify AJAX requests
        'Content-Type': 'application/json',
        'Accept': 'application/json',
    }
});

// Create a separate axios instance for Sanctum routes (no /api prefix)
const sanctumApi = axios.create({
    baseURL: 'localhost:8000',
    withCredentials: true,
    headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    }
});

// Function to fetch CSRF token
const fetchCSRFToken = async () => {
    try {
        // Use the sanctum-specific axios instance
        await sanctumApi.get('/sanctum/csrf-cookie');
        return true;
    } catch (error: any) {
        return false;
    }
};

// Add a request interceptor to include the auth token in all requests
api.interceptors.request.use(
    config => {
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

// Track if API has been initialized to avoid repeated CSRF token fetches
let isApiInitialized = false;
let initializationPromise: Promise<boolean> | null = null;

// Initialize API by fetching CSRF token
export const initializeApi = async () => {
    // If already initialized, return immediately
    if (isApiInitialized) {
        return true;
    }

    // If initialization is in progress, wait for it
    if (initializationPromise) {
        return initializationPromise;
    }

    // Start initialization
    initializationPromise = (async () => {
        try {
            await fetchCSRFToken();
            isApiInitialized = true;
            return true;
        } catch (error: any) {
            console.error('Failed to initialize API:', error);
            return false;
        } finally {
            initializationPromise = null;
        }
    })();

    return initializationPromise;
};

// Reset API initialization state (useful for logout)
export const resetApiInitialization = () => {
    isApiInitialized = false;
    initializationPromise = null;
};

export default api;
