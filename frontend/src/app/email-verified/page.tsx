"use client";

import React, { useEffect, useState, useRef, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { AuthService } from "../../services";
import { refreshUserData } from "../../utils/auth-utils";

const EmailVerifiedContent: React.FC = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const redirectInProgress = useRef(false);

  const success = searchParams.get("success") === "true";
  const already = searchParams.get("already") === "true";

  // First effect: Handle data refresh
  useEffect(() => {
    const refreshUserData = async () => {
      if (!success && !already) return;

      setIsRefreshing(true);
      console.log("Email verification successful, refreshing user data...");

      // Add a small delay to ensure the backend has processed the verification
      await new Promise((resolve) => setTimeout(resolve, 500));

      try {
        // Try refreshing multiple times if needed
        let retries = 3;
        let userData = null;

        while (retries > 0 && !userData) {
          try {
            // Use the shared utility function
            userData = await refreshUserData();
            console.log("User data refreshed successfully:", userData);
            break;
          } catch (err) {
            retries--;
            if (retries > 0) {
              console.log(
                `Retrying user data refresh... (${retries} attempts left)`
              );
              await new Promise((resolve) => setTimeout(resolve, 1000));
            } else {
              throw err;
            }
          }
        }
      } catch (error) {
        console.error("Failed to refresh user data:", error);

        // Fallback: manually update the verification status if API call fails
        if (success) {
          const currentUser = AuthService.getCurrentUser();

          if (currentUser) {
            console.log("Using fallback method to update verification status");
            const updatedUser = {
              ...currentUser,
              email_verified_at: new Date().toISOString(),
            };

            localStorage.setItem("user", JSON.stringify(updatedUser));

            // Dispatch both a storage event and a custom event to notify components
            window.dispatchEvent(new Event("storage"));
            window.dispatchEvent(new Event("storage-update"));
          }
        }
      } finally {
        setIsRefreshing(false);
      }
    };

    refreshUserData();
  }, [success, already]);

  // Second effect: Handle countdown and navigation
  useEffect(() => {
    if (!success && !already) return;

    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);

          // Use this approach to prevent multiple redirects
          if (!redirectInProgress.current) {
            redirectInProgress.current = true;
            // Use window.location for navigation instead of router.push
            // This avoids the React state update during render issue
            window.location.href = "/";
          }
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [success, already]);

  return (
    <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Email Verification
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          {success ? (
            <div className="bg-green-50 border-l-4 border-green-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">
                    Your email has been verified successfully!
                  </p>
                </div>
              </div>
            </div>
          ) : already ? (
            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-blue-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9a1 1 0 00-1-1z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-blue-700">
                    Your email has already been verified.
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">
                    Invalid verification link. Please request a new verification
                    link.
                  </p>
                </div>
              </div>
            </div>
          )}

          {isRefreshing ? (
            <div className="flex justify-center items-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-indigo-500 mr-2"></div>
              <p className="text-sm text-gray-600">
                Updating your account information...
              </p>
            </div>
          ) : (
            <p className="text-center text-sm text-gray-600">
              You will be redirected to the home page in {countdown} seconds.
            </p>
          )}

          <div className="mt-6">
            <Link
              href="/"
              className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Go to Home Page
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

const EmailVerifiedPage: React.FC = () => {
  return (
    <Suspense
      fallback={
        <div className="min-h-full flex flex-col justify-center py-12 sm:px-6 lg:px-8">
          <div className="sm:mx-auto sm:w-full sm:max-w-md">
            <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
              <div className="flex justify-center items-center py-4">
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"></div>
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.2s" }}
                  ></div>
                  <div
                    className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse"
                    style={{ animationDelay: "0.4s" }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 ml-3">Loading...</p>
              </div>
            </div>
          </div>
        </div>
      }
    >
      <EmailVerifiedContent />
    </Suspense>
  );
};

export default EmailVerifiedPage;
