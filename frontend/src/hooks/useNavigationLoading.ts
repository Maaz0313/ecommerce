"use client";

import { useState, useEffect } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

interface NavigationLoadingOptions {
  delay?: number;
  minDuration?: number;
  excludePaths?: string[];
  includeSearchParams?: boolean;
}

interface NavigationLoadingState {
  isLoading: boolean;
  progress: number;
  currentPath: string;
  previousPath: string;
}

export function useNavigationLoading(options: NavigationLoadingOptions = {}) {
  const {
    delay = 100,
    minDuration = 300,
    excludePaths = [],
    includeSearchParams = false,
  } = options;

  const pathname = usePathname();
  const searchParams = useSearchParams();
  
  const [state, setState] = useState<NavigationLoadingState>({
    isLoading: false,
    progress: 0,
    currentPath: pathname,
    previousPath: pathname,
  });

  // Create full path including search params if needed
  const fullPath = includeSearchParams && searchParams.toString() 
    ? `${pathname}?${searchParams.toString()}`
    : pathname;

  useEffect(() => {
    // Check if this path should be excluded from loading
    const shouldExclude = excludePaths.some(excludePath => 
      pathname.startsWith(excludePath)
    );

    if (shouldExclude) return;

    // Only trigger loading when path actually changes
    if (fullPath !== state.currentPath) {
      setState(prev => ({
        ...prev,
        isLoading: true,
        progress: 0,
        previousPath: prev.currentPath,
        currentPath: fullPath,
      }));

      let progressInterval: NodeJS.Timeout;
      let delayTimer: NodeJS.Timeout;
      let completeTimer: NodeJS.Timeout;

      // Start progress after delay
      delayTimer = setTimeout(() => {
        progressInterval = setInterval(() => {
          setState(prev => {
            if (prev.progress >= 90) {
              clearInterval(progressInterval);
              return prev;
            }
            return {
              ...prev,
              progress: prev.progress + Math.random() * 15,
            };
          });
        }, 100);
      }, delay);

      // Complete loading after minimum duration
      completeTimer = setTimeout(() => {
        setState(prev => ({
          ...prev,
          progress: 100,
        }));

        // Hide loading state
        setTimeout(() => {
          setState(prev => ({
            ...prev,
            isLoading: false,
            progress: 0,
          }));
        }, 200);
      }, minDuration);

      return () => {
        clearTimeout(delayTimer);
        clearTimeout(completeTimer);
        if (progressInterval) clearInterval(progressInterval);
      };
    }
  }, [fullPath, state.currentPath, delay, minDuration, excludePaths, pathname]);

  return state;
}

// Hook specifically for route transitions
export function useRouteTransition() {
  const pathname = usePathname();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [previousRoute, setPreviousRoute] = useState(pathname);

  useEffect(() => {
    if (pathname !== previousRoute) {
      setIsTransitioning(true);
      setPreviousRoute(pathname);

      // End transition after a short delay
      const timer = setTimeout(() => {
        setIsTransitioning(false);
      }, 150);

      return () => clearTimeout(timer);
    }
  }, [pathname, previousRoute]);

  return {
    isTransitioning,
    currentRoute: pathname,
    previousRoute,
  };
}

// Hook for page-specific loading states
export function usePageLoading(pageName: string) {
  const pathname = usePathname();
  const [isPageLoading, setIsPageLoading] = useState(false);
  const [loadingStartTime, setLoadingStartTime] = useState<number | null>(null);

  // Check if current path matches the page
  const isCurrentPage = pathname.includes(pageName) || 
    (pageName === 'home' && pathname === '/');

  useEffect(() => {
    if (isCurrentPage) {
      setIsPageLoading(true);
      setLoadingStartTime(Date.now());

      // Simulate page loading completion
      const timer = setTimeout(() => {
        setIsPageLoading(false);
        setLoadingStartTime(null);
      }, 500);

      return () => clearTimeout(timer);
    }
  }, [isCurrentPage]);

  const loadingDuration = loadingStartTime 
    ? Date.now() - loadingStartTime 
    : 0;

  return {
    isPageLoading,
    loadingDuration,
    isCurrentPage,
  };
}

// Hook for managing loading states across multiple components
export function useGlobalLoadingState() {
  const [loadingStates, setLoadingStates] = useState<Record<string, boolean>>({});

  const setLoading = (key: string, isLoading: boolean) => {
    setLoadingStates(prev => ({
      ...prev,
      [key]: isLoading,
    }));
  };

  const isAnyLoading = Object.values(loadingStates).some(Boolean);
  const getLoadingState = (key: string) => loadingStates[key] || false;

  const clearAllLoading = () => {
    setLoadingStates({});
  };

  return {
    loadingStates,
    isAnyLoading,
    setLoading,
    getLoadingState,
    clearAllLoading,
  };
}
