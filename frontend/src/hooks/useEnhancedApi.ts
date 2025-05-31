"use client";

import { useEffect, useCallback } from 'react';
import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { useLoading } from '../contexts/LoadingContext';
import enhancedApiService from '../services/enhanced-api';

// Hook that connects the enhanced API service with the loading context
export const useEnhancedApi = () => {
  const { setApiLoading, updateProgress } = useLoading();

  // Set up the loading callbacks when the hook is used
  useEffect(() => {
    enhancedApiService.setLoadingCallbacks({
      setApiLoading,
      updateProgress,
    });
  }, [setApiLoading, updateProgress]);

  // Wrapper methods that use the enhanced API service
  const apiRequest = useCallback(async <T = any>(
    config: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.request<T>(config);
  }, []);

  const apiGet = useCallback(async <T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.get<T>(url, config);
  }, []);

  const apiPost = useCallback(async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.post<T>(url, data, config);
  }, []);

  const apiPut = useCallback(async <T = any>(
    url: string, 
    data?: any, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.put<T>(url, data, config);
  }, []);

  const apiDelete = useCallback(async <T = any>(
    url: string, 
    config?: AxiosRequestConfig & { 
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.delete<T>(url, config);
  }, []);

  const apiBatchRequests = useCallback(async <T = any>(
    requests: Array<{
      config: AxiosRequestConfig;
      key: string;
    }>,
    options: {
      loadingMessage?: string;
      showProgress?: boolean;
      silent?: boolean;
    } = {}
  ): Promise<Record<string, AxiosResponse<T>>> => {
    return enhancedApiService.batchRequests<T>(requests, options);
  }, []);

  const apiUploadFile = useCallback(async <T = any>(
    url: string,
    file: File,
    config?: AxiosRequestConfig & {
      loadingMessage?: string;
      onUploadProgress?: (progress: number) => void;
    }
  ): Promise<AxiosResponse<T>> => {
    return enhancedApiService.uploadFile<T>(url, file, config);
  }, []);

  return {
    apiRequest,
    apiGet,
    apiPost,
    apiPut,
    apiDelete,
    apiBatchRequests,
    apiUploadFile,
  };
};

// Specific hooks for common API operations
export const useProductsApi = () => {
  const { apiGet, apiPost, apiPut, apiDelete } = useEnhancedApi();

  const getProducts = useCallback(async (params?: any) => {
    return apiGet('/products', {
      params,
      loadingMessage: 'Loading products...',
      showProgress: true,
    });
  }, [apiGet]);

  const getProduct = useCallback(async (id: string | number) => {
    return apiGet(`/products/${id}`, {
      loadingMessage: 'Loading product details...',
    });
  }, [apiGet]);

  const createProduct = useCallback(async (productData: any) => {
    return apiPost('/products', productData, {
      loadingMessage: 'Creating product...',
      showProgress: true,
    });
  }, [apiPost]);

  const updateProduct = useCallback(async (id: string | number, productData: any) => {
    return apiPut(`/products/${id}`, productData, {
      loadingMessage: 'Updating product...',
      showProgress: true,
    });
  }, [apiPut]);

  const deleteProduct = useCallback(async (id: string | number) => {
    return apiDelete(`/products/${id}`, {
      loadingMessage: 'Deleting product...',
    });
  }, [apiDelete]);

  return {
    getProducts,
    getProduct,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};

export const useCategoriesApi = () => {
  const { apiGet, apiPost, apiPut, apiDelete } = useEnhancedApi();

  const getCategories = useCallback(async (params?: any) => {
    return apiGet('/categories', {
      params,
      loadingMessage: 'Loading categories...',
      showProgress: true,
    });
  }, [apiGet]);

  const getCategory = useCallback(async (id: string | number) => {
    return apiGet(`/categories/${id}`, {
      loadingMessage: 'Loading category details...',
    });
  }, [apiGet]);

  const createCategory = useCallback(async (categoryData: any) => {
    return apiPost('/categories', categoryData, {
      loadingMessage: 'Creating category...',
      showProgress: true,
    });
  }, [apiPost]);

  const updateCategory = useCallback(async (id: string | number, categoryData: any) => {
    return apiPut(`/categories/${id}`, categoryData, {
      loadingMessage: 'Updating category...',
      showProgress: true,
    });
  }, [apiPut]);

  const deleteCategory = useCallback(async (id: string | number) => {
    return apiDelete(`/categories/${id}`, {
      loadingMessage: 'Deleting category...',
    });
  }, [apiDelete]);

  return {
    getCategories,
    getCategory,
    createCategory,
    updateCategory,
    deleteCategory,
  };
};

export const useOrdersApi = () => {
  const { apiGet, apiPost, apiPut } = useEnhancedApi();

  const getOrders = useCallback(async (params?: any) => {
    return apiGet('/orders', {
      params,
      loadingMessage: 'Loading orders...',
      showProgress: true,
    });
  }, [apiGet]);

  const getOrder = useCallback(async (id: string | number) => {
    return apiGet(`/orders/${id}`, {
      loadingMessage: 'Loading order details...',
    });
  }, [apiGet]);

  const createOrder = useCallback(async (orderData: any) => {
    return apiPost('/orders', orderData, {
      loadingMessage: 'Creating order...',
      showProgress: true,
    });
  }, [apiPost]);

  const updateOrder = useCallback(async (id: string | number, orderData: any) => {
    return apiPut(`/orders/${id}`, orderData, {
      loadingMessage: 'Updating order...',
      showProgress: true,
    });
  }, [apiPut]);

  const cancelOrder = useCallback(async (id: string | number) => {
    return apiPost(`/orders/${id}/cancel`, {}, {
      loadingMessage: 'Cancelling order...',
    });
  }, [apiPost]);

  return {
    getOrders,
    getOrder,
    createOrder,
    updateOrder,
    cancelOrder,
  };
};
