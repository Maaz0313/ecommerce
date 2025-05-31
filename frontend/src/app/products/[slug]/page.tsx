"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { ProductService, Product, CartService } from "../../../services";
import {
  SkeletonLine,
  SkeletonCard,
  SkeletonImage,
  SkeletonText,
} from "../../../components";

export default function ProductDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const foundProduct = await ProductService.getProductBySlug(slug);
        setProduct(foundProduct);
        setError(null);
      } catch (err) {
        console.error("Error fetching product:", err);
        setError("Failed to load product. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchProduct();
    }
  }, [slug]);

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value);
    if (value > 0 && product && value <= product.quantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = () => {
    if (product) {
      CartService.addToCart(product, quantity);
      // Trigger storage event to update cart count in Layout
      window.dispatchEvent(new Event("storage"));
      alert("Product added to cart!");
    }
  };

  if (loading) {
    return (
      <div className="bg-white">
        <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
            {/* Product image skeleton */}
            <div className="lg:col-span-1">
              <SkeletonImage height="24rem" className="rounded-lg" />
            </div>

            {/* Product details skeleton */}
            <div className="mt-10 lg:mt-0 lg:col-span-1">
              <SkeletonLine height="3rem" width="300px" className="mb-4" />
              <SkeletonLine height="2rem" width="120px" className="mb-4" />

              <div className="mt-4">
                <SkeletonLine height="1rem" width="80px" className="mb-2" />
                <SkeletonLine height="1.5rem" width="150px" className="mb-4" />
              </div>

              <div className="mt-4">
                <SkeletonLine height="1rem" width="100px" className="mb-2" />
                <SkeletonText lines={3} className="mb-4" />
              </div>

              <div className="mt-6">
                <SkeletonLine height="1rem" width="120px" className="mb-2" />
                <SkeletonLine height="2rem" width="200px" className="mb-6" />
              </div>

              <div className="mt-6">
                <SkeletonLine height="1rem" width="80px" className="mb-2" />
                <SkeletonLine height="2.5rem" width="80px" className="mb-8" />
              </div>

              <SkeletonLine height="3rem" width="100%" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !product) {
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
            <p className="text-sm text-red-700">
              {error || "Product not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white">
      <div className="max-w-2xl mx-auto py-8 px-4 sm:px-6 lg:max-w-7xl lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-x-8">
          {/* Product image */}
          <div className="lg:col-span-1">
            <div className="aspect-w-1 aspect-h-1 rounded-lg overflow-hidden">
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-center object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                  <span className="text-gray-400">No image</span>
                </div>
              )}
            </div>
          </div>

          {/* Product details */}
          <div className="mt-10 lg:mt-0 lg:col-span-1">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
              {product.name}
            </h1>

            <div className="mt-4">
              <p className="text-3xl text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
            </div>

            {product.category && (
              <div className="mt-4">
                <h3 className="text-sm text-gray-600">Category</h3>
                <div className="mt-1">
                  <Link
                    href={`/categories/${product.category.slug}`}
                    className="text-indigo-600 hover:text-indigo-500"
                  >
                    {product.category.name}
                  </Link>
                </div>
              </div>
            )}

            <div className="mt-4">
              <h3 className="text-sm text-gray-600">Description</h3>
              <div className="mt-2 prose prose-sm text-gray-500">
                <p>{product.description}</p>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm text-gray-600">Availability</h3>
                <div className="ml-2">
                  {product.quantity > 0 ? (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      In Stock ({product.quantity} available)
                    </span>
                  ) : (
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                      Out of Stock
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="mt-6">
              <div className="flex items-center">
                <h3 className="text-sm text-gray-600 mr-3">Quantity</h3>
                <input
                  type="number"
                  min="1"
                  max={product.quantity}
                  value={quantity}
                  onChange={handleQuantityChange}
                  disabled={product.quantity <= 0}
                  className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-20 sm:text-sm border-gray-300 rounded-md"
                />
              </div>
            </div>

            <div className="mt-8">
              <button
                onClick={handleAddToCart}
                disabled={product.quantity <= 0}
                className={`w-full inline-flex justify-center items-center px-6 py-3 border border-transparent rounded-md shadow-sm text-base font-medium text-white ${
                  product.quantity > 0
                    ? "bg-indigo-600 hover:bg-indigo-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                Add to Cart
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
