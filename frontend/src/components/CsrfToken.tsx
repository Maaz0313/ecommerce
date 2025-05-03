'use client';

import { useEffect } from 'react';
import api from '../services/api';

/**
 * Component to fetch CSRF token on initial load
 */
export default function CsrfToken() {
  useEffect(() => {
    // Fetch CSRF token on initial load
    const fetchCsrfToken = async () => {
      try {
        await api.get('/sanctum/csrf-cookie');
        console.log('CSRF token fetched successfully');
      } catch (error) {
        console.error('Failed to fetch CSRF token:', error);
      }
    };

    fetchCsrfToken();
  }, []);

  // This component doesn't render anything
  return null;
}
