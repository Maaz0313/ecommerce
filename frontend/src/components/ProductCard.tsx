import React from 'react';
import Link from 'next/link';
import { Product, CartService } from '../services';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  console.log('Rendering ProductCard with product:', product);

  const handleAddToCart = () => {
    CartService.addToCart(product, 1);
    // Trigger storage event to update cart count in Layout
    window.dispatchEvent(new Event('storage'));
  };

  return (
    <div className="group relative bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
      <div className="aspect-w-3 aspect-h-4 bg-gray-200 group-hover:opacity-75 h-48">
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
      <div className="flex flex-col space-y-2 p-4">
        <h3 className="text-sm font-medium text-gray-900">
          <Link href={`/products/${product.slug}`} className="block">
            <span aria-hidden="true" className="absolute inset-0" />
            {product.name}
          </Link>
        </h3>
        <p className="text-sm text-gray-500 line-clamp-2">{product.description}</p>
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium text-gray-900">${Number(product.price).toFixed(2)}</p>
          {product.quantity > 0 ? (
            <span className="text-sm text-green-600">In Stock</span>
          ) : (
            <span className="text-sm text-red-600">Out of Stock</span>
          )}
        </div>
        <button
          onClick={handleAddToCart}
          disabled={product.quantity <= 0}
          className={`mt-2 w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white ${
            product.quantity > 0
              ? 'bg-indigo-600 hover:bg-indigo-700'
              : 'bg-gray-400 cursor-not-allowed'
          }`}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
