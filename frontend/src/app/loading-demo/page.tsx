"use client";

import React, { useState } from "react";
import { useEnhancedApi, useProductsApi, useCategoriesApi } from "../../hooks/useEnhancedApi";
import { useLoading, useApiLoading, useNavigationLoading } from "../../contexts/LoadingContext";

export default function LoadingDemoPage() {
  const [results, setResults] = useState<any[]>([]);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  
  // Enhanced API hooks
  const { apiGet, apiPost, apiBatchRequests, apiUploadFile } = useEnhancedApi();
  const { getProducts } = useProductsApi();
  const { getCategories } = useCategoriesApi();
  
  // Loading context hooks
  const { loadingState } = useLoading();
  const { withLoading } = useApiLoading();
  const { setNavigationLoading, updateProgress } = useNavigationLoading();

  // Demo functions
  const handleSimpleApiCall = async () => {
    try {
      const response = await apiGet('/products', {
        loadingMessage: 'Fetching products...',
        showProgress: false,
      });
      setResults([{ type: 'Simple API Call', data: response.data }]);
    } catch (error) {
      console.error('API call failed:', error);
    }
  };

  const handleApiCallWithProgress = async () => {
    try {
      const response = await getProducts();
      setResults([{ type: 'API Call with Progress', data: response.data }]);
    } catch (error) {
      console.error('API call with progress failed:', error);
    }
  };

  const handleBatchRequests = async () => {
    try {
      const responses = await apiBatchRequests([
        { config: { method: 'GET', url: '/products' }, key: 'products' },
        { config: { method: 'GET', url: '/categories' }, key: 'categories' },
      ], {
        loadingMessage: 'Loading multiple resources...',
        showProgress: true,
      });
      
      setResults([
        { type: 'Batch Request - Products', data: responses.products.data },
        { type: 'Batch Request - Categories', data: responses.categories.data },
      ]);
    } catch (error) {
      console.error('Batch requests failed:', error);
    }
  };

  const handleLongRunningOperation = async () => {
    try {
      await withLoading(async () => {
        // Simulate a long-running operation
        for (let i = 0; i <= 100; i += 10) {
          await new Promise(resolve => setTimeout(resolve, 200));
          updateProgress(i);
        }
        return { message: 'Long operation completed!' };
      }, 'Processing long operation...');
      
      setResults([{ type: 'Long Running Operation', data: { completed: true } }]);
    } catch (error) {
      console.error('Long operation failed:', error);
    }
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      setUploadProgress(0);
      const response = await apiUploadFile('/upload', file, {
        loadingMessage: `Uploading ${file.name}...`,
        onUploadProgress: (progress) => {
          setUploadProgress(progress);
        },
      });
      
      setResults([{ type: 'File Upload', data: response.data }]);
    } catch (error) {
      console.error('File upload failed:', error);
    }
  };

  const handleManualNavigation = () => {
    setNavigationLoading(true, 0);
    
    // Simulate navigation progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        clearInterval(interval);
        setNavigationLoading(false);
      } else {
        updateProgress(progress);
      }
    }, 200);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Loading System Demo</h1>
      
      {/* Current Loading State Display */}
      <div className="bg-gray-50 rounded-lg p-4 mb-8">
        <h2 className="text-lg font-semibold mb-4">Current Loading State</h2>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <strong>Is Loading:</strong> {loadingState.isLoading ? 'Yes' : 'No'}
          </div>
          <div>
            <strong>Progress:</strong> {loadingState.progress.toFixed(1)}%
          </div>
          <div>
            <strong>Loading Type:</strong> {loadingState.loadingType || 'None'}
          </div>
          <div>
            <strong>Operation:</strong> {loadingState.currentOperation || 'None'}
          </div>
        </div>
      </div>

      {/* Demo Buttons */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <button
          onClick={handleSimpleApiCall}
          className="bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={loadingState.isLoading}
        >
          Simple API Call
        </button>
        
        <button
          onClick={handleApiCallWithProgress}
          className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={loadingState.isLoading}
        >
          API Call with Progress
        </button>
        
        <button
          onClick={handleBatchRequests}
          className="bg-purple-500 hover:bg-purple-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={loadingState.isLoading}
        >
          Batch Requests
        </button>
        
        <button
          onClick={handleLongRunningOperation}
          className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={loadingState.isLoading}
        >
          Long Running Operation
        </button>
        
        <button
          onClick={handleManualNavigation}
          className="bg-indigo-500 hover:bg-indigo-600 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          disabled={loadingState.isLoading}
        >
          Simulate Navigation
        </button>
        
        <div className="flex flex-col">
          <label className="text-sm font-medium text-gray-700 mb-2">
            File Upload Demo
          </label>
          <input
            type="file"
            onChange={handleFileUpload}
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-gray-50 file:text-gray-700 hover:file:bg-gray-100"
            disabled={loadingState.isLoading}
          />
          {uploadProgress > 0 && uploadProgress < 100 && (
            <div className="mt-2">
              <div className="bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${uploadProgress}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Upload Progress: {uploadProgress.toFixed(1)}%
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Results Display */}
      {results.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <h2 className="text-lg font-semibold mb-4">Results</h2>
          <div className="space-y-4">
            {results.map((result, index) => (
              <div key={index} className="border-l-4 border-blue-500 pl-4">
                <h3 className="font-medium text-gray-900">{result.type}</h3>
                <pre className="text-xs text-gray-600 mt-1 overflow-x-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="mt-8 bg-blue-50 rounded-lg p-4">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">How to Test</h2>
        <ul className="text-sm text-blue-800 space-y-1">
          <li>• Click any button to see the line loader in action</li>
          <li>• Navigate between pages to see automatic navigation loading</li>
          <li>• Watch the progress bar and loading states update in real-time</li>
          <li>• Try uploading a file to see upload progress</li>
          <li>• The line loader only appears during actual operations, not on initial page load</li>
        </ul>
      </div>
    </div>
  );
}
