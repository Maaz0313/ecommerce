import { useState, useEffect } from 'react';

// Loading state types
export interface LoadingState {
  isLoading: boolean;
  error: string | null;
  data: any;
}

export interface AsyncState<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
}

// Hook for managing async operations with loading states
export function useAsyncState<T>(
  asyncFunction: () => Promise<T>,
  dependencies: any[] = []
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: true,
    error: null,
  });

  useEffect(() => {
    let isMounted = true;

    const executeAsync = async () => {
      setState(prev => ({ ...prev, loading: true, error: null }));
      
      try {
        const result = await asyncFunction();
        if (isMounted) {
          setState({
            data: result,
            loading: false,
            error: null,
          });
        }
      } catch (error) {
        if (isMounted) {
          setState({
            data: null,
            loading: false,
            error: error instanceof Error ? error.message : 'An error occurred',
          });
        }
      }
    };

    executeAsync();

    return () => {
      isMounted = false;
    };
  }, dependencies);

  return state;
}

// Hook for managing multiple async operations
export function useMultipleAsyncState<T extends Record<string, any>>(
  asyncOperations: Record<keyof T, () => Promise<T[keyof T]>>
): Record<keyof T, AsyncState<T[keyof T]>> & { allLoading: boolean; anyError: boolean } {
  const [states, setStates] = useState<Record<keyof T, AsyncState<T[keyof T]>>>(() => {
    const initialStates = {} as Record<keyof T, AsyncState<T[keyof T]>>;
    Object.keys(asyncOperations).forEach(key => {
      initialStates[key as keyof T] = {
        data: null,
        loading: true,
        error: null,
      };
    });
    return initialStates;
  });

  useEffect(() => {
    let isMounted = true;

    const executeAllAsync = async () => {
      const promises = Object.entries(asyncOperations).map(async ([key, asyncFn]) => {
        try {
          const result = await (asyncFn as () => Promise<any>)();
          if (isMounted) {
            setStates(prev => ({
              ...prev,
              [key]: {
                data: result,
                loading: false,
                error: null,
              },
            }));
          }
        } catch (error) {
          if (isMounted) {
            setStates(prev => ({
              ...prev,
              [key]: {
                data: null,
                loading: false,
                error: error instanceof Error ? error.message : 'An error occurred',
              },
            }));
          }
        }
      });

      await Promise.allSettled(promises);
    };

    executeAllAsync();

    return () => {
      isMounted = false;
    };
  }, []);

  const allLoading = Object.values(states).some(state => state.loading);
  const anyError = Object.values(states).some(state => state.error !== null);

  return {
    ...states,
    allLoading,
    anyError,
  };
}

// Progressive loading hook for paginated data
export function useProgressiveLoading<T>(
  fetchFunction: (page: number) => Promise<{ data: T[]; hasMore: boolean }>,
  initialPage: number = 1
) {
  const [items, setItems] = useState<T[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(initialPage);

  const loadMore = async () => {
    if (loading || !hasMore) return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchFunction(page);
      setItems(prev => [...prev, ...result.data]);
      setHasMore(result.hasMore);
      setPage(prev => prev + 1);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load more items');
    } finally {
      setLoading(false);
      setInitialLoading(false);
    }
  };

  const reset = () => {
    setItems([]);
    setPage(initialPage);
    setHasMore(true);
    setError(null);
    setInitialLoading(true);
  };

  useEffect(() => {
    loadMore();
  }, []);

  return {
    items,
    loading,
    initialLoading,
    error,
    hasMore,
    loadMore,
    reset,
  };
}

// Debounced loading hook for search/filter operations
export function useDebouncedAsyncState<T>(
  asyncFunction: (query: string) => Promise<T>,
  query: string,
  delay: number = 300
): AsyncState<T> {
  const [state, setState] = useState<AsyncState<T>>({
    data: null,
    loading: false,
    error: null,
  });

  useEffect(() => {
    if (!query.trim()) {
      setState({
        data: null,
        loading: false,
        error: null,
      });
      return;
    }

    setState(prev => ({ ...prev, loading: true, error: null }));

    const timeoutId = setTimeout(async () => {
      try {
        const result = await asyncFunction(query);
        setState({
          data: result,
          loading: false,
          error: null,
        });
      } catch (error) {
        setState({
          data: null,
          loading: false,
          error: error instanceof Error ? error.message : 'Search failed',
        });
      }
    }, delay);

    return () => clearTimeout(timeoutId);
  }, [query, delay]);

  return state;
}

// Loading state utilities
export const LoadingUtils = {
  // Create a delay for better UX (prevents flash of loading state)
  withMinimumDelay: async <T>(
    promise: Promise<T>, 
    minimumDelay: number = 300
  ): Promise<T> => {
    const [result] = await Promise.all([
      promise,
      new Promise(resolve => setTimeout(resolve, minimumDelay))
    ]);
    return result;
  },

  // Retry logic for failed requests
  withRetry: async <T>(
    asyncFunction: () => Promise<T>,
    maxRetries: number = 3,
    delay: number = 1000
  ): Promise<T> => {
    let lastError: Error;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        return await asyncFunction();
      } catch (error) {
        lastError = error instanceof Error ? error : new Error('Unknown error');
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, delay * Math.pow(2, attempt)));
        }
      }
    }
    
    throw lastError!;
  },

  // Timeout wrapper for async operations
  withTimeout: async <T>(
    promise: Promise<T>,
    timeoutMs: number = 10000
  ): Promise<T> => {
    const timeoutPromise = new Promise<never>((_, reject) => {
      setTimeout(() => reject(new Error('Operation timed out')), timeoutMs);
    });

    return Promise.race([promise, timeoutPromise]);
  },
};

// Loading state constants
export const LOADING_STATES = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
} as const;

export type LoadingStateType = typeof LOADING_STATES[keyof typeof LOADING_STATES];

// Enhanced loading state hook with more granular control
export function useEnhancedLoadingState<T>() {
  const [state, setState] = useState<{
    data: T | null;
    status: LoadingStateType;
    error: string | null;
  }>({
    data: null,
    status: LOADING_STATES.IDLE,
    error: null,
  });

  const execute = async (asyncFunction: () => Promise<T>) => {
    setState(prev => ({
      ...prev,
      status: LOADING_STATES.LOADING,
      error: null,
    }));

    try {
      const result = await asyncFunction();
      setState({
        data: result,
        status: LOADING_STATES.SUCCESS,
        error: null,
      });
      return result;
    } catch (error) {
      setState({
        data: null,
        status: LOADING_STATES.ERROR,
        error: error instanceof Error ? error.message : 'An error occurred',
      });
      throw error;
    }
  };

  const reset = () => {
    setState({
      data: null,
      status: LOADING_STATES.IDLE,
      error: null,
    });
  };

  return {
    ...state,
    isLoading: state.status === LOADING_STATES.LOADING,
    isSuccess: state.status === LOADING_STATES.SUCCESS,
    isError: state.status === LOADING_STATES.ERROR,
    isIdle: state.status === LOADING_STATES.IDLE,
    execute,
    reset,
  };
}
