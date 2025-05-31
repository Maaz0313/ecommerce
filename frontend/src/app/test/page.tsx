"use client";

import React, { useState } from "react";
import { ProductService } from "../../services";
import axios from "axios";

export default function TestPage() {
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const testDirectFetch = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Making direct fetch request...");
      const response = await fetch("/api/products?featured=true", {
        method: "GET",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });

      console.log("Response status:", response.status);
      console.log("Response headers:", response.headers);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response data:", data);
      setResult(data);
    } catch (err) {
      console.error("Test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testServiceMethod = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Making service method request...");
      const data = await ProductService.getFeaturedProducts();
      console.log("Service response data:", data);
      setResult(data);
    } catch (err) {
      console.error("Service test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  const testDirectAxios = async () => {
    setLoading(true);
    setError(null);
    try {
      console.log("Making direct axios request...");
      const response = await axios.get("/api/products?featured=true", {
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
      });
      console.log("Axios response:", response);
      console.log("Axios response data:", response.data);
      setResult(response.data);
    } catch (err) {
      console.error("Axios test error:", err);
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">API Test Page</h1>

      <div className="space-x-4">
        <button
          onClick={testDirectFetch}
          disabled={loading}
          className="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Direct Fetch"}
        </button>

        <button
          onClick={testServiceMethod}
          disabled={loading}
          className="bg-green-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Service Method"}
        </button>

        <button
          onClick={testDirectAxios}
          disabled={loading}
          className="bg-purple-500 text-white px-4 py-2 rounded disabled:opacity-50"
        >
          {loading ? "Testing..." : "Test Direct Axios"}
        </button>
      </div>

      {error && (
        <div className="mt-4 p-4 bg-red-100 border border-red-400 text-red-700 rounded">
          Error: {error}
        </div>
      )}

      {result && (
        <div className="mt-4">
          <h2 className="text-lg font-semibold mb-2">Result:</h2>
          <pre className="bg-gray-100 p-4 rounded overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>

          {result.data && Array.isArray(result.data) && (
            <div className="mt-4">
              <h3 className="text-md font-semibold mb-2">
                Products ({result.data.length}):
              </h3>
              <ul className="list-disc list-inside">
                {result.data.map((product: any) => (
                  <li key={product.id}>
                    {product.name} - ${product.price}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
