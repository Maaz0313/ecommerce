"use client";

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { SkeletonLine, SkeletonText, SkeletonImage, SkeletonCard } from './SkeletonLoader';

interface NavigationLoaderProps {
  children: React.ReactNode;
  loadingDelay?: number;
  minLoadingTime?: number;
}

// Page-specific skeleton layouts
const PageSkeletons = {
  products: () => (
    <div>
      <SkeletonLine height="2.5rem" width="200px" className="mb-6" />
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
  ),

  categories: () => (
    <div>
      <SkeletonLine height="2.5rem" width="180px" className="mb-6" />
      <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index}>
            <SkeletonImage height="8rem" className="mb-3" />
            <SkeletonLine height="1.25rem" className="mb-2" />
            <SkeletonLine width="60%" height="1rem" />
          </SkeletonCard>
        ))}
      </div>
    </div>
  ),

  home: () => (
    <div>
      {/* Hero section skeleton */}
      <div className="bg-gray-200 rounded-lg shadow-xl overflow-hidden animate-pulse">
        <div className="px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <SkeletonLine height="3rem" width="400px" className="mx-auto" />
            <SkeletonText lines={2} className="max-w-lg mx-auto" />
            <SkeletonLine height="3rem" width="150px" className="mx-auto mt-8" />
          </div>
        </div>
      </div>

      {/* Featured products skeleton */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <SkeletonLine height="2rem" width="200px" />
          <SkeletonLine height="1.5rem" width="80px" />
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, index) => (
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

      {/* Categories skeleton */}
      <div className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <SkeletonLine height="2rem" width="180px" />
          <SkeletonLine height="1.5rem" width="80px" />
        </div>
        <div className="grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonCard key={index}>
              <SkeletonImage height="8rem" className="mb-3" />
              <SkeletonLine height="1.25rem" className="mb-2" />
              <SkeletonLine width="60%" height="1rem" />
            </SkeletonCard>
          ))}
        </div>
      </div>
    </div>
  ),

  profile: () => (
    <div>
      <SkeletonLine height="2.5rem" width="150px" className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <SkeletonCard>
            <div className="flex items-center space-x-4 mb-6">
              <div className="animate-pulse bg-gray-200 rounded-full w-16 h-16" />
              <div className="flex-1">
                <SkeletonLine height="1.5rem" className="mb-2" />
                <SkeletonLine width="60%" height="1rem" />
              </div>
            </div>
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <SkeletonLine key={index} height="1rem" />
              ))}
            </div>
          </SkeletonCard>
        </div>
        <div className="lg:col-span-2">
          <SkeletonCard>
            <SkeletonLine height="1.5rem" width="200px" className="mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 3 }).map((_, index) => (
                <div key={index}>
                  <SkeletonLine width="25%" height="1rem" className="mb-2" />
                  <SkeletonLine height="2.5rem" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  ),

  cart: () => (
    <div>
      <SkeletonLine height="2.5rem" width="200px" className="mb-6" />
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <SkeletonCard>
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="flex items-center space-x-4 p-4 border-b border-gray-200 last:border-b-0">
                <SkeletonImage width="4rem" height="4rem" />
                <div className="flex-1">
                  <SkeletonLine height="1.25rem" className="mb-2" />
                  <SkeletonLine width="40%" height="1rem" />
                </div>
                <div className="text-right">
                  <SkeletonLine width="3rem" height="1.25rem" className="mb-1" />
                  <SkeletonLine width="2rem" height="1rem" />
                </div>
              </div>
            ))}
          </SkeletonCard>
        </div>
        <div className="lg:col-span-1">
          <SkeletonCard>
            <SkeletonLine height="1.5rem" width="150px" className="mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 4 }).map((_, index) => (
                <div key={index} className="flex justify-between">
                  <SkeletonLine width="40%" height="1rem" />
                  <SkeletonLine width="30%" height="1rem" />
                </div>
              ))}
            </div>
            <div className="mt-6 pt-4 border-t border-gray-200">
              <SkeletonLine height="3rem" />
            </div>
          </SkeletonCard>
        </div>
      </div>
    </div>
  ),

  orders: () => (
    <div>
      <SkeletonLine height="2.5rem" width="150px" className="mb-6" />
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <SkeletonCard key={index}>
            <div className="flex justify-between items-start mb-4">
              <div>
                <SkeletonLine height="1.25rem" width="120px" className="mb-2" />
                <SkeletonLine height="1rem" width="200px" />
              </div>
              <SkeletonLine height="1.5rem" width="80px" />
            </div>
            <div className="space-y-2">
              {Array.from({ length: 2 }).map((_, itemIndex) => (
                <div key={itemIndex} className="flex items-center space-x-3">
                  <SkeletonImage width="3rem" height="3rem" />
                  <div className="flex-1">
                    <SkeletonLine height="1rem" className="mb-1" />
                    <SkeletonLine width="60%" height="0.875rem" />
                  </div>
                  <SkeletonLine width="3rem" height="1rem" />
                </div>
              ))}
            </div>
          </SkeletonCard>
        ))}
      </div>
    </div>
  ),

  default: () => (
    <div className="space-y-6">
      <SkeletonLine height="2.5rem" width="300px" />
      <div className="space-y-4">
        {Array.from({ length: 6 }).map((_, index) => (
          <SkeletonCard key={index}>
            <SkeletonText lines={3} />
          </SkeletonCard>
        ))}
      </div>
    </div>
  ),
};

const NavigationLoader: React.FC<NavigationLoaderProps> = ({
  children,
  loadingDelay = 100,
  minLoadingTime = 300,
}) => {
  const pathname = usePathname();
  const [isNavigating, setIsNavigating] = useState(false);
  const [showSkeleton, setShowSkeleton] = useState(false);
  const [previousPathname, setPreviousPathname] = useState(pathname);

  useEffect(() => {
    // Only show loading when pathname actually changes
    if (pathname !== previousPathname) {
      setIsNavigating(true);
      
      // Small delay before showing skeleton to avoid flash for fast navigations
      const delayTimer = setTimeout(() => {
        setShowSkeleton(true);
      }, loadingDelay);

      // Minimum loading time to prevent flashing
      const minTimer = setTimeout(() => {
        setIsNavigating(false);
        setShowSkeleton(false);
      }, minLoadingTime);

      setPreviousPathname(pathname);

      return () => {
        clearTimeout(delayTimer);
        clearTimeout(minTimer);
      };
    }
  }, [pathname, previousPathname, loadingDelay, minLoadingTime]);

  // Determine which skeleton to show based on current path
  const getSkeletonForPath = (path: string) => {
    if (path === '/') return PageSkeletons.home();
    if (path.startsWith('/products')) return PageSkeletons.products();
    if (path.startsWith('/categories')) return PageSkeletons.categories();
    if (path.startsWith('/profile')) return PageSkeletons.profile();
    if (path.startsWith('/cart')) return PageSkeletons.cart();
    if (path.startsWith('/orders')) return PageSkeletons.orders();
    return PageSkeletons.default();
  };

  if (showSkeleton && isNavigating) {
    return (
      <div className="animate-pulse">
        {getSkeletonForPath(pathname)}
      </div>
    );
  }

  return <>{children}</>;
};

export default NavigationLoader;
