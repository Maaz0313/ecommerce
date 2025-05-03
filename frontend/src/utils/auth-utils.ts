import { AuthService } from '../services';

/**
 * Refreshes the user data from the backend and updates localStorage
 * @returns A promise that resolves to the updated user data
 */
export const refreshUserData = async () => {
  try {
    console.log('Refreshing user data from backend...');
    const userData = await AuthService.refreshUserData();
    console.log('User data refreshed successfully:', userData);
    return userData;
  } catch (error) {
    console.error('Failed to refresh user data:', error);
    
    // Return the current user data from localStorage as fallback
    return AuthService.getCurrentUser();
  }
};

/**
 * Checks if the user's email is verified
 * @param forceRefresh Whether to force a refresh of user data from the backend
 * @returns A promise that resolves to a boolean indicating if the email is verified
 */
export const checkEmailVerified = async (forceRefresh = false) => {
  if (forceRefresh) {
    await refreshUserData();
  }
  
  return AuthService.isEmailVerified();
};

/**
 * Adds event listeners for storage events to update when user data changes
 * @param callback Function to call when storage events occur
 * @returns A cleanup function to remove the event listeners
 */
export const addStorageEventListeners = (callback: () => void) => {
  // Listen for both storage events (for cross-tab updates) and our custom events (for same-tab updates)
  window.addEventListener('storage', callback);
  window.addEventListener('storage-update', callback);
  
  // Return a cleanup function
  return () => {
    window.removeEventListener('storage', callback);
    window.removeEventListener('storage-update', callback);
  };
};
