"use client";

import React, { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import {
  CategoryService,
  ProductService,
  Category,
  Product,
} from "../../../services";
import {
  ProductCard,
  SkeletonLine,
  SkeletonCard,
  SkeletonImage,
  SkeletonText,
} from "../../../components";

export default function CategoryDetailPage() {
  const params = useParams();
  const slug = params.slug as string;

  const [category, setCategory] = useState<Category | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryAndProducts = async () => {
      try {
        setLoading(true);

        // Get category by slug
        const foundCategory = await CategoryService.getCategoryBySlug(slug);
        setCategory(foundCategory);

        // Get all products
        const allProducts = await ProductService.getAllProducts();

        // Filter products by category
        const categoryProducts = allProducts.filter(
          (product) => product.category_id === foundCategory.id
        );

        setProducts(categoryProducts);
        setError(null);
      } catch (err) {
        console.error("Error fetching category and products:", err);
        setError("Failed to load category. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchCategoryAndProducts();
    }
  }, [slug]);

  if (loading) {
    return (
      <div>
        {/* Category header skeleton */}
        <div className="bg-white">
          <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
            <div className="text-center">
              <SkeletonLine
                height="3rem"
                width="300px"
                className="mx-auto mb-4"
              />
              <SkeletonText lines={2} className="max-w-2xl mx-auto" />
            </div>
          </div>
        </div>

        {/* Products section skeleton */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <SkeletonLine height="2rem" width="250px" className="mb-6" />
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, index) => (
              <SkeletonCard key={index}>
                <SkeletonImage height="12rem" className="mb-4" />
                <SkeletonLine height="1.5rem" className="mb-2" />
                <SkeletonText lines={2} className="mb-3" />
                <div className="flex justify-between items-center">
                  <SkeletonLine width="4rem" height="1.25rem" />
                  <SkeletonLine width="5rem" height="2rem" />
                </div>
              </SkeletonCard>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !category) {
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
              {error || "Category not found"}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="bg-white">
        <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">
              {category.name}
            </h1>
            {category.description && (
              <p className="mt-4 max-w-2xl mx-auto text-xl text-gray-500">
                {category.description}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">
          Products in this category
        </h2>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            No products available in this category.
          </p>
        )}
      </div>
    </div>
  );
}
