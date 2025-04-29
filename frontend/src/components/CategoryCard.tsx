import React from 'react';
import Link from 'next/link';
import { Category } from '../services';

interface CategoryCardProps {
  category: Category;
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group block bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden hover:shadow-md transition-shadow"
    >
      <div className="aspect-w-3 aspect-h-2 bg-gray-200 group-hover:opacity-75 h-40">
        {category.image ? (
          <img
            src={category.image}
            alt={category.name}
            className="w-full h-full object-center object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <span className="text-gray-400">No image</span>
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="text-lg font-medium text-gray-900">{category.name}</h3>
        {category.description && (
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">{category.description}</p>
        )}
      </div>
    </Link>
  );
};

export default CategoryCard;
