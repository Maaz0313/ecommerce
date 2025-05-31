import api from './api';
import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
  email_verified_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data?: {
    user: User;
    token: string;
    email_verified: boolean;
  };
  email_verified?: boolean;
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      // First, get the CSRF cookie from Laravel Sanctum
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      // Then make the login request
      const response = await api.post<AuthResponse>('/login', credentials);

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Dispatch both a storage event and a custom event to notify components
        // The storage event only works across tabs, while our custom event works within the same tab
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storage-update'));

        return user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Login error details:', error);
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    try {
      // First, get the CSRF cookie from Laravel Sanctum
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      // Then make the registration request
      const response = await api.post<AuthResponse>('/register', data);

      if (response.data.success && response.data.data) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));

        // Dispatch both a storage event and a custom event to notify components
        // The storage event only works across tabs, while our custom event works within the same tab
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storage-update'));

        return user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      console.error('Registration error details:', error);
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
      // First, get the CSRF cookie from Laravel Sanctum
      await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });

      // Then make the logout request
      await api.post('/logout');
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    } catch (error) {
      console.error('Logout error:', error);
      // Still remove items even if API call fails
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  },

  getCurrentUser: (): User | null => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      return JSON.parse(userStr);
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return !!localStorage.getItem('token');
  },

  isEmailVerified: (): boolean => {
    const userStr = localStorage.getItem('user');
    if (userStr) {
      const user = JSON.parse(userStr) as User;
      return !!user.email_verified_at;
    }
    return false;
  },

  resendVerificationEmail: async (): Promise<void> => {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        throw new Error('You must be logged in to resend verification email');
      }

      console.log('Attempting to resend verification email...');

      // First, get the CSRF cookie from Laravel Sanctum
      const csrfResponse = await axios.get('/sanctum/csrf-cookie', {
        withCredentials: true,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
        }
      });
      console.log('CSRF cookie response:', csrfResponse.status);

      // Then make the request to resend verification email
      console.log('Sending verification email request...');
      const response = await api.post('/email/verification-notification');
      console.log('Verification email response:', response.status, response.data);

      return response.data;
    } catch (error) {
      console.error('Resend verification email error:', error);
      throw error;
    }
  },

  refreshUserData: async (): Promise<User | null> => {
    try {
      // Check if user is authenticated
      if (!AuthService.isAuthenticated()) {
        return null;
      }

      // Get user data from the API
      const response = await api.get('/user');
      console.log('Refresh user data response:', response.data);

      if (response.data && response.data.success && response.data.data && response.data.data.user) {
        const userData = response.data.data.user;

        // Update the user data in localStorage
        localStorage.setItem('user', JSON.stringify(userData));

        // Dispatch both a storage event and a custom event to notify components
        // The storage event only works across tabs, while our custom event works within the same tab
        window.dispatchEvent(new Event('storage'));
        window.dispatchEvent(new Event('storage-update'));

        return userData;
      }

      return null;
    } catch (error) {
      console.error('Refresh user data error:', error);
      return null;
    }
  },
};

export default AuthService;
