"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { AuthService } from "../../services";
import VerificationNotice from "../../components/VerificationNotice";
import {
  refreshUserData,
  addStorageEventListeners,
} from "../../utils/auth-utils";

const ProfilePage: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Function to load user data
  const loadUserData = () => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Get current user
    const currentUser = AuthService.getCurrentUser();
    setUser(currentUser);
    setLoading(false);
  };

  // Function to refresh user data from the backend
  const handleRefreshUserData = async () => {
    try {
      setLoading(true);

      // Only refresh from backend if user is authenticated
      if (AuthService.isAuthenticated()) {
        await refreshUserData();
      }

      loadUserData();
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      loadUserData(); // Still load from localStorage even if API call fails
    }
  };

  useEffect(() => {
    // Check authentication first
    if (!AuthService.isAuthenticated()) {
      router.push("/login");
      return;
    }

    // Initial load of user data - only refresh from backend if authenticated
    handleRefreshUserData();

    // Add event listeners for storage changes
    const handleStorageChange = () => {
      loadUserData();
    };

    // Set up event listeners and get cleanup function
    const cleanup = addStorageEventListeners(handleStorageChange);

    return cleanup;
  }, [router]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">My Account</h1>
        <button
          onClick={handleRefreshUserData}
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          disabled={loading}
        >
          {loading ? "Refreshing..." : "Refresh Data"}
        </button>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900">
            User Information
          </h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">
            Personal details and account information.
          </p>
        </div>
        <div className="border-t border-gray-200">
          <dl>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Full name</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.name}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email address
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {user?.email}
              </dd>
            </div>
            <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Email verification
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {AuthService.isEmailVerified() ? (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Verified
                  </span>
                ) : (
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                    Not verified
                  </span>
                )}
              </dd>
            </div>
            <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">
                Account created
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {new Date(user?.created_at).toLocaleDateString()}
              </dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
