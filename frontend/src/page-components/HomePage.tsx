"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  ProductService,
  CategoryService,
  Product,
  Category,
} from "../services";
import { initializeApi } from "../services/api";
import { ProductCard, CategoryCard, LoadingSpinner } from "../components";

const HomePage: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

        // Initialize API first
        await initializeApi();

        const [productsData, categoriesData] = await Promise.all([
          ProductService.getFeaturedProducts(),
          CategoryService.getAllCategories(),
        ]);

        // Safely access the data arrays
        if (productsData && productsData.data) {
          setFeaturedProducts(
            Array.isArray(productsData.data) ? productsData.data : []
          );
        }

        if (categoriesData && categoriesData.data) {
          setCategories(
            Array.isArray(categoriesData.data) ? categoriesData.data : []
          );
        }

        setError(null);
      } catch (err: any) {
        setError("Failed to load data. Please try again later.");
        setFeaturedProducts([]);
        setCategories([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <LoadingSpinner size="lg" text="Loading products and categories..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-l-4 border-red-400 p-4 my-4">
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
            <p className="text-sm text-red-700">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero section */}
      <div className="bg-indigo-700 rounded-lg shadow-xl overflow-hidden">
        <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl mx-auto text-center">
            <h1 className="text-3xl font-extrabold text-white sm:text-4xl">
              <span className="block">Welcome to EcommerceApp</span>
            </h1>
            <p className="mt-4 text-lg leading-6 text-indigo-100">
              Discover amazing products at great prices. Shop now and enjoy fast
              delivery!
            </p>
            <div className="mt-8 flex justify-center">
              <div className="inline-flex rounded-md shadow">
                <Link
                  href="/products"
                  className="inline-flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-indigo-600 bg-white hover:bg-indigo-50"
                >
                  Browse Products
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured products section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            Featured Products
          </h2>
          <Link
            href="/products"
            className="text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {featuredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : loading ? (
          <div className="flex justify-center py-8">
            <LoadingSpinner size="md" text="Loading featured products..." />
          </div>
        ) : (
          <p className="text-gray-500">No featured products available.</p>
        )}
      </div>

      {/* Categories section */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Shop by Category</h2>
          <Link
            href="/categories"
            className="text-indigo-600 hover:text-indigo-500"
          >
            View all
          </Link>
        </div>
        {categories.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
            {categories.slice(0, 3).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No categories available.</p>
        )}
      </div>
    </div>
  );
};

export default HomePage;
