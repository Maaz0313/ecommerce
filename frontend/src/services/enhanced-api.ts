import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import api from './api';

// Enhanced API service that integrates with loading context
class EnhancedApiService {
  private loadingCallbacks: {
    setApiLoading?: (isLoading: boolean, operation?: string) => void;
    updateProgress?: (progress: number) => void;
  } = {};

  // Set loading callbacks from the context
  setLoadingCallbacks(callbacks: {
    setApiLoading?: (isLoading: boolean, operation?: string) => void;
    updateProgress?: (progress: number) => void;
  }) {
    this.loadingCallbacks = callbacks;
  }

  // Enhanced request method with loading states
  async request<T = any>(
    config: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    const { 
      loadingMessage = 'Loading...', 
      showProgress = false, 
      silent = false,
      ...axiosConfig 
    } = config;

    if (!silent && this.loadingCallbacks.setApiLoading) {
      this.loadingCallbacks.setApiLoading(true, loadingMessage);
    }

    try {
      // Simulate progress for long-running requests
      let progressInterval: NodeJS.Timeout | undefined;
      
      if (showProgress && this.loadingCallbacks.updateProgress) {
        let progress = 0;
        progressInterval = setInterval(() => {
          progress += Math.random() * 10 + 5; // 5-15% increments
          if (progress < 90) {
            this.loadingCallbacks.updateProgress?.(progress);
          }
        }, 200);
      }

      const response = await api.request<T>(axiosConfig);

      // Complete progress
      if (progressInterval) {
        clearInterval(progressInterval);
        this.loadingCallbacks.updateProgress?.(100);
      }

      return response;
    } catch (error) {
      throw error;
    } finally {
      if (!silent && this.loadingCallbacks.setApiLoading) {
        this.loadingCallbacks.setApiLoading(false);
      }
    }
  }

  // Convenience methods
  async get<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'GET', url });
  }

  async post<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'POST', url, data });
  }

  async put<T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'PUT', url, data });
  }

  async delete<T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> {
    return this.request<T>({ ...config, method: 'DELETE', url });
  }

  // Batch requests with combined loading state
  async batchRequests<T = any>(
    requests: Array<{
      config: AxiosRequestConfig;
      key: string;
    }>,
    options: {
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    } = {}
  ): Promise<Record<string, AxiosResponse<T>>> {
    const { 
      loadingMessage = 'Loading multiple resources...', 
      showProgress = true, 
      silent = false 
    } = options;

    if (!silent && this.loadingCallbacks.setApiLoading) {
      this.loadingCallbacks.setApiLoading(true, loadingMessage);
    }

    try {
      let completedRequests = 0;
      const totalRequests = requests.length;
      
      const promises = requests.map(async ({ config, key }) => {
        const response = await api.request<T>(config);
        
        completedRequests++;
        if (showProgress && this.loadingCallbacks.updateProgress) {
          const progress = (completedRequests / totalRequests) * 100;
          this.loadingCallbacks.updateProgress(progress);
        }
        
        return { key, response };
      });

      const results = await Promise.all(promises);
      
      // Convert array to object with keys
      const resultMap: Record<string, AxiosResponse<T>> = {};
      results.forEach(({ key, response }) => {
        resultMap[key] = response;
      });

      return resultMap;
    } catch (error) {
      throw error;
    } finally {
      if (!silent && this.loadingCallbacks.setApiLoading) {
        this.loadingCallbacks.setApiLoading(false);
      }
    }
  }

  // File upload with progress
  async uploadFile<T = any>(
    url: string,
    file: File,
    config?: AxiosRequestConfig & {
      loadingMessage?: string;
      onUploadProgress?: (progress: number) => void;
    }
  ): Promise<AxiosResponse<T>> {
    const { 
      loadingMessage = 'Uploading file...', 
      onUploadProgress,
      ...axiosConfig 
    } = config || {};

    if (this.loadingCallbacks.setApiLoading) {
      this.loadingCallbacks.setApiLoading(true, loadingMessage);
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await api.request<T>({
        ...axiosConfig,
        method: 'POST',
        url,
        data: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          ...axiosConfig.headers,
        },
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const progress = (progressEvent.loaded / progressEvent.total) * 100;
            onUploadProgress?.(progress);
            this.loadingCallbacks.updateProgress?.(progress);
          }
        },
      });

      return response;
    } catch (error) {
      throw error;
    } finally {
      if (this.loadingCallbacks.setApiLoading) {
        this.loadingCallbacks.setApiLoading(false);
      }
    }
  }
}

// Create singleton instance
const enhancedApiService = new EnhancedApiService();

export default enhancedApiService;
