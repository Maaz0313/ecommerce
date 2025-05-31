"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingCartIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
} from "@heroicons/react/24/outline";
import { AuthService, CartService } from "../services";
import CsrfToken from "../components/CsrfToken";
import VerificationNotice from "../components/VerificationNotice";
import NavigationProgress from "../components/NavigationProgress";
import SimpleNavigationProgress from "../components/SimpleNavigationProgress";
import ProgressLink from "../components/ProgressLink";

import {
  refreshUserData as refreshUserDataUtil,
  addStorageEventListeners,
} from "../utils/auth-utils";

interface ClientLayoutProps {
  children: React.ReactNode;
}

export default function ClientLayout({ children }: ClientLayoutProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [showVerificationNotice, setShowVerificationNotice] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Function to update authentication state from localStorage
  const updateAuthState = () => {
    // Check authentication status
    const isAuth = AuthService.isAuthenticated();
    setIsAuthenticated(isAuth);

    // Get current user and check verification status
    if (isAuth) {
      const user = AuthService.getCurrentUser();
      setCurrentUser(user);

      // Show verification notice if email is not verified
      if (user && !AuthService.isEmailVerified()) {
        setShowVerificationNotice(true);
      } else {
        setShowVerificationNotice(false);
      }
    } else {
      setCurrentUser(null);
      setShowVerificationNotice(false);
    }

    // Get cart item count
    setCartItemCount(CartService.getItemCount());
  };

  // Function to refresh user data from the backend
  const refreshUserData = async () => {
    try {
      if (AuthService.isAuthenticated()) {
        console.log("Refreshing user data from backend...");
        // Use the shared utility function
        await refreshUserDataUtil();
        updateAuthState();
      }
    } catch (error) {
      console.error("Failed to refresh user data:", error);
      // Still update from localStorage even if API call fails
      updateAuthState();
    }
  };

  useEffect(() => {
    // Initial update of authentication state and refresh from backend
    refreshUserData();

    // Add event listener for cart updates and auth changes
    const handleStorageChange = () => {
      // Update all authentication and cart state
      updateAuthState();
    };

    // Set up an interval to periodically refresh user data
    const refreshInterval = setInterval(() => {
      if (AuthService.isAuthenticated()) {
        refreshUserData();
      }
    }, 60000); // Refresh every minute

    // Set up event listeners using the shared utility function
    const cleanup = addStorageEventListeners(handleStorageChange);

    return () => {
      cleanup();
      clearInterval(refreshInterval);
    };
  }, []);

  const handleLogout = async () => {
    await AuthService.logout();
    setIsAuthenticated(false);
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Navigation Progress Bar */}
      <NavigationProgress
        color="#4f46e5"
        height={3}
        showSpinner={false}
        delay={100}
        minDuration={300}
      />

      {/* CSRF Token Component */}
      <CsrfToken />

      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                <ProgressLink
                  href="/"
                  className="text-2xl font-bold text-indigo-600"
                >
                  EcommerceApp
                </ProgressLink>
              </div>
              <nav className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <ProgressLink
                  href="/"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Home
                </ProgressLink>
                <ProgressLink
                  href="/products"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Products
                </ProgressLink>
                <ProgressLink
                  href="/categories"
                  className="border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium"
                >
                  Categories
                </ProgressLink>
              </nav>
            </div>
            <div className="hidden sm:ml-6 sm:flex sm:items-center sm:space-x-4">
              <ProgressLink
                href="/cart"
                className="relative p-1 rounded-full text-gray-400 hover:text-gray-500"
              >
                <ShoppingCartIcon className="h-6 w-6" aria-hidden="true" />
                {cartItemCount > 0 && (
                  <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-indigo-600 rounded-full">
                    {cartItemCount}
                  </span>
                )}
              </ProgressLink>
              {isAuthenticated ? (
                <>
                  <ProgressLink
                    href="/profile"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                  >
                    <UserIcon className="h-5 w-5 mr-2" aria-hidden="true" />
                    My Account
                  </ProgressLink>
                  <button
                    onClick={handleLogout}
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <ProgressLink
                    href="/login"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-600 bg-white hover:bg-gray-50"
                  >
                    Login
                  </ProgressLink>
                  <ProgressLink
                    href="/register"
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
                  >
                    Register
                  </ProgressLink>
                </>
              )}
            </div>
            <div className="-mr-2 flex items-center sm:hidden">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 cursor-pointer"
              >
                <span className="sr-only">Open main menu</span>
                {isMenuOpen ? (
                  <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                ) : (
                  <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="sm:hidden">
            <div className="pt-2 pb-3 space-y-1">
              <ProgressLink
                href="/"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </ProgressLink>
              <ProgressLink
                href="/products"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Products
              </ProgressLink>
              <ProgressLink
                href="/categories"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Categories
              </ProgressLink>
              <ProgressLink
                href="/cart"
                className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                onClick={() => setIsMenuOpen(false)}
              >
                Cart ({cartItemCount})
              </ProgressLink>
              {isAuthenticated ? (
                <>
                  <ProgressLink
                    href="/profile"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    My Account
                  </ProgressLink>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMenuOpen(false);
                    }}
                    className="block w-full text-left pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800 cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <ProgressLink
                    href="/login"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Login
                  </ProgressLink>
                  <ProgressLink
                    href="/register"
                    className="block pl-3 pr-4 py-2 border-l-4 border-transparent text-base font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-800"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Register
                  </ProgressLink>
                </>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Main content */}
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          {/* Verification notice */}
          {showVerificationNotice && currentUser && (
            <VerificationNotice
              email={currentUser.email}
              showDismiss={true}
              onDismiss={() => setShowVerificationNotice(false)}
            />
          )}

          {children}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 text-sm">
            &copy; {new Date().getFullYear()} EcommerceApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
