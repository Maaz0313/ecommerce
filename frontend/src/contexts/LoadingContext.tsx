"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useRef,
  useEffect,
} from "react";
import { usePathname, useSearchParams } from "next/navigation";

interface LoadingState {
  isLoading: boolean;
  progress: number;
  loadingType: "navigation" | "api" | "page" | null;
  currentOperation: string | null;
}

interface LoadingContextType {
  loadingState: LoadingState;
  setNavigationLoading: (isLoading: boolean, progress?: number) => void;
  setApiLoading: (isLoading: boolean, operation?: string) => void;
  setPageLoading: (isLoading: boolean, operation?: string) => void;
  updateProgress: (progress: number) => void;
  isAnyLoading: boolean;
}

const LoadingContext = createContext<LoadingContextType | undefined>(undefined);

interface LoadingProviderProps {
  children: React.ReactNode;
}

export const LoadingProvider: React.FC<LoadingProviderProps> = ({
  children,
}) => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loadingState, setLoadingState] = useState<LoadingState>({
    isLoading: false,
    progress: 0,
    loadingType: null,
    currentOperation: null,
  });

  const previousPathRef = useRef<string | null>(null);
  const loadingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitialLoadRef = useRef(true);

  const setNavigationLoading = useCallback(
    (isLoading: boolean, progress: number = 0) => {
      setLoadingState((prev) => ({
        ...prev,
        isLoading,
        progress,
        loadingType: isLoading ? "navigation" : null,
        currentOperation: isLoading ? "Navigating..." : null,
      }));
    },
    []
  );

  // Auto-detect navigation changes (but not initial page loads)
  useEffect(() => {
    const currentPath = `${pathname}${
      searchParams.toString() ? `?${searchParams.toString()}` : ""
    }`;
    const previousPath = previousPathRef.current;

    // Skip loading on initial page load
    if (isInitialLoadRef.current) {
      isInitialLoadRef.current = false;
      previousPathRef.current = currentPath;
      console.log(
        "🏠 LoadingContext: Initial page load, skipping navigation loading"
      );
      return;
    }

    // Only trigger loading if the path actually changed
    if (currentPath !== previousPath && previousPath !== null) {
      console.log(
        "🔄 LoadingContext: Navigation detected from",
        previousPath,
        "to",
        currentPath
      );

      // Start navigation loading
      setNavigationLoading(true, 0);

      // Auto-complete navigation loading after a delay
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }

      loadingTimeoutRef.current = setTimeout(() => {
        setNavigationLoading(false);
        console.log("✅ LoadingContext: Navigation loading completed");
      }, 500);
    }

    // Always update the previous path reference
    previousPathRef.current = currentPath;

    return () => {
      if (loadingTimeoutRef.current) {
        clearTimeout(loadingTimeoutRef.current);
      }
    };
  }, [pathname, searchParams, setNavigationLoading]);

  const setApiLoading = useCallback(
    (isLoading: boolean, operation: string = "Loading...") => {
      setLoadingState((prev) => ({
        ...prev,
        isLoading,
        progress: isLoading ? 0 : 100,
        loadingType: isLoading ? "api" : null,
        currentOperation: isLoading ? operation : null,
      }));
    },
    []
  );

  const setPageLoading = useCallback(
    (isLoading: boolean, operation: string = "Loading page...") => {
      setLoadingState((prev) => ({
        ...prev,
        isLoading,
        progress: isLoading ? 0 : 100,
        loadingType: isLoading ? "page" : null,
        currentOperation: isLoading ? operation : null,
      }));
    },
    []
  );

  const updateProgress = useCallback((progress: number) => {
    setLoadingState((prev) => ({
      ...prev,
      progress: Math.max(0, Math.min(100, progress)),
    }));
  }, []);

  const isAnyLoading = loadingState.isLoading;

  const contextValue: LoadingContextType = {
    loadingState,
    setNavigationLoading,
    setApiLoading,
    setPageLoading,
    updateProgress,
    isAnyLoading,
  };

  return (
    <LoadingContext.Provider value={contextValue}>
      {children}
    </LoadingContext.Provider>
  );
};

export const useLoading = (): LoadingContextType => {
  const context = useContext(LoadingContext);
  if (context === undefined) {
    throw new Error("useLoading must be used within a LoadingProvider");
  }
  return context;
};

// Hook for API loading states
export const useApiLoading = () => {
  const { setApiLoading, loadingState } = useLoading();

  const withLoading = useCallback(
    async <T,>(
      asyncFunction: () => Promise<T>,
      operation: string = "Loading..."
    ): Promise<T> => {
      setApiLoading(true, operation);
      try {
        const result = await asyncFunction();
        return result;
      } finally {
        setApiLoading(false);
      }
    },
    [setApiLoading]
  );

  return {
    withLoading,
    isApiLoading: loadingState.loadingType === "api" && loadingState.isLoading,
    currentOperation: loadingState.currentOperation,
  };
};

// Hook for navigation loading states
export const useNavigationLoading = () => {
  const { setNavigationLoading, loadingState, updateProgress } = useLoading();

  return {
    setNavigationLoading,
    updateProgress,
    isNavigationLoading:
      loadingState.loadingType === "navigation" && loadingState.isLoading,
    progress: loadingState.progress,
  };
};

// Hook for page loading states
export const usePageLoading = () => {
  const { setPageLoading, loadingState } = useLoading();

  return {
    setPageLoading,
    isPageLoading:
      loadingState.loadingType === "page" && loadingState.isLoading,
    currentOperation: loadingState.currentOperation,
  };
};
