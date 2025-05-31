import React from 'react';

interface SkeletonLineProps {
  width?: string;
  height?: string;
  className?: string;
}

interface SkeletonTextProps {
  lines?: number;
  className?: string;
}

interface SkeletonImageProps {
  width?: string;
  height?: string;
  className?: string;
}

interface SkeletonCardProps {
  className?: string;
  children?: React.ReactNode;
}

interface SkeletonGridProps {
  columns?: number;
  rows?: number;
  gap?: string;
  className?: string;
}

// Base skeleton animation class
const skeletonBase = "animate-pulse bg-gray-200 rounded";

// Basic line skeleton component
export const SkeletonLine: React.FC<SkeletonLineProps> = ({ 
  width = "100%", 
  height = "1rem", 
  className = "" 
}) => {
  return (
    <div 
      className={`${skeletonBase} ${className}`}
      style={{ width, height }}
    />
  );
};

// Multi-line text skeleton
export const SkeletonText: React.FC<SkeletonTextProps> = ({ 
  lines = 3, 
  className = "" 
}) => {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, index) => (
        <SkeletonLine 
          key={index}
          width={index === lines - 1 ? "75%" : "100%"}
          height="1rem"
        />
      ))}
    </div>
  );
};

// Image placeholder skeleton
export const SkeletonImage: React.FC<SkeletonImageProps> = ({ 
  width = "100%", 
  height = "12rem", 
  className = "" 
}) => {
  return (
    <div 
      className={`${skeletonBase} flex items-center justify-center ${className}`}
      style={{ width, height }}
    >
      <svg 
        className="w-8 h-8 text-gray-300" 
        fill="currentColor" 
        viewBox="0 0 20 20"
      >
        <path 
          fillRule="evenodd" 
          d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" 
          clipRule="evenodd" 
        />
      </svg>
    </div>
  );
};

// Card container skeleton
export const SkeletonCard: React.FC<SkeletonCardProps> = ({ 
  className = "", 
  children 
}) => {
  return (
    <div className={`bg-white rounded-lg shadow-md p-4 ${className}`}>
      {children}
    </div>
  );
};

// Grid layout skeleton
export const SkeletonGrid: React.FC<SkeletonGridProps> = ({ 
  columns = 4, 
  rows = 3, 
  gap = "gap-6", 
  className = "" 
}) => {
  const gridCols = {
    1: "grid-cols-1",
    2: "grid-cols-2", 
    3: "grid-cols-3",
    4: "grid-cols-4",
    5: "grid-cols-5",
    6: "grid-cols-6"
  };

  return (
    <div className={`grid ${gridCols[columns as keyof typeof gridCols] || 'grid-cols-4'} ${gap} ${className}`}>
      {Array.from({ length: columns * rows }).map((_, index) => (
        <SkeletonCard key={index}>
          <SkeletonImage height="8rem" className="mb-4" />
          <SkeletonLine height="1.25rem" className="mb-2" />
          <SkeletonText lines={2} />
        </SkeletonCard>
      ))}
    </div>
  );
};

// Specialized skeleton components for specific use cases

// Product card skeleton
export const ProductCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <SkeletonCard className={className}>
      <SkeletonImage height="12rem" className="mb-4" />
      <SkeletonLine height="1.5rem" className="mb-2" />
      <SkeletonText lines={2} className="mb-3" />
      <div className="flex justify-between items-center">
        <SkeletonLine width="4rem" height="1.25rem" />
        <SkeletonLine width="5rem" height="2rem" />
      </div>
    </SkeletonCard>
  );
};

// Category card skeleton
export const CategoryCardSkeleton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <SkeletonCard className={className}>
      <SkeletonImage height="8rem" className="mb-3" />
      <SkeletonLine height="1.25rem" className="mb-2" />
      <SkeletonLine width="60%" height="1rem" />
    </SkeletonCard>
  );
};

// Order item skeleton
export const OrderItemSkeleton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <div className={`flex items-center space-x-4 p-4 border-b border-gray-200 ${className}`}>
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
  );
};

// User profile skeleton
export const UserProfileSkeleton: React.FC<{ className?: string }> = ({ 
  className = "" 
}) => {
  return (
    <SkeletonCard className={className}>
      <div className="flex items-center space-x-4 mb-6">
        <div className={`${skeletonBase} rounded-full w-16 h-16`} />
        <div className="flex-1">
          <SkeletonLine height="1.5rem" className="mb-2" />
          <SkeletonLine width="60%" height="1rem" />
        </div>
      </div>
      <div className="space-y-4">
        <div>
          <SkeletonLine width="25%" height="1rem" className="mb-2" />
          <SkeletonLine height="2.5rem" />
        </div>
        <div>
          <SkeletonLine width="25%" height="1rem" className="mb-2" />
          <SkeletonLine height="2.5rem" />
        </div>
        <div>
          <SkeletonLine width="25%" height="1rem" className="mb-2" />
          <SkeletonLine height="2.5rem" />
        </div>
      </div>
    </SkeletonCard>
  );
};

// Table skeleton
export const TableSkeleton: React.FC<{ 
  rows?: number; 
  columns?: number; 
  className?: string 
}> = ({ 
  rows = 5, 
  columns = 4, 
  className = "" 
}) => {
  return (
    <div className={`overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg ${className}`}>
      <table className="min-w-full divide-y divide-gray-300">
        <thead className="bg-gray-50">
          <tr>
            {Array.from({ length: columns }).map((_, index) => (
              <th key={index} className="px-6 py-3">
                <SkeletonLine height="1rem" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <tr key={rowIndex}>
              {Array.from({ length: columns }).map((_, colIndex) => (
                <td key={colIndex} className="px-6 py-4">
                  <SkeletonLine height="1rem" />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

// List skeleton
export const ListSkeleton: React.FC<{ 
  items?: number; 
  className?: string 
}> = ({ 
  items = 5, 
  className = "" 
}) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: items }).map((_, index) => (
        <div key={index} className="flex items-center space-x-3 p-3 border border-gray-200 rounded-lg">
          <SkeletonImage width="3rem" height="3rem" />
          <div className="flex-1">
            <SkeletonLine height="1.25rem" className="mb-2" />
            <SkeletonLine width="70%" height="1rem" />
          </div>
          <SkeletonLine width="4rem" height="1rem" />
        </div>
      ))}
    </div>
  );
};
