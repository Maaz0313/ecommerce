import api from './api';
import axios from 'axios';

export interface User {
  id: number;
  name: string;
  email: string;
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
  data: {
    user: User;
    token: string;
  };
}

const AuthService = {
  login: async (credentials: LoginCredentials): Promise<User> => {
    try {
      const response = await api.post<AuthResponse>('/login', credentials);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  },

  register: async (data: RegisterData): Promise<User> => {
    try {
      // Use the configured Axios instance to fetch the CSRF token
      await api.get('/sanctum/csrf-cookie');
      const response = await api.post<AuthResponse>('/register', data);
      
      if (response.data.success) {
        const { user, token } = response.data.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        return user;
      } else {
        throw new Error(response.data.message);
      }
    } catch (error) {
      throw error;
    }
  },

  logout: async (): Promise<void> => {
    try {
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
};

export default AuthService;
