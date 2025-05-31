"use client";

import { useEffect } from "react";
import axios from "axios";

/**
 * Component to fetch CSRF token on initial load
 */
export default function CsrfToken() {
  useEffect(() => {
    // Fetch CSRF token on initial load
    const fetchCsrfToken = async () => {
      try {
        // Use axios directly with no base URL to avoid /api prefix
        await axios.get("/sanctum/csrf-cookie", {
          withCredentials: true,
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        // Silently fail - CSRF token fetch is not critical for initial load
      }
    };

    fetchCsrfToken();
  }, []);

  // This component doesn't render anything
  return null;
}
