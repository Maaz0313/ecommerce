'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { CartService, CartItem, AuthService } from '../../services';
import { TrashIcon } from '@heroicons/react/24/outline';

export default function CartPage() {
  const [cart, setCart] = useState<{ items: CartItem[], total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const router = useRouter();

  useEffect(() => {
    // Get cart from local storage
    const cartData = CartService.getCart();
    setCart(cartData);
    setLoading(false);
  }, []);

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    const updatedCart = CartService.updateQuantity(productId, quantity);
    setCart(updatedCart);
    // Trigger storage event to update cart count in Layout
    window.dispatchEvent(new Event('storage'));
  };

  const handleRemoveItem = (productId: number) => {
    const updatedCart = CartService.removeFromCart(productId);
    setCart(updatedCart);
    // Trigger storage event to update cart count in Layout
    window.dispatchEvent(new Event('storage'));
  };

  const handleCheckout = () => {
    if (!AuthService.isAuthenticated()) {
      router.push('/login');
      return;
    }
    
    router.push('/checkout');
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (cart.items.length === 0) {
    return (
      <div className="text-center py-12">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Your Cart</h1>
        <p className="text-gray-500 mb-8">Your cart is empty.</p>
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Your Cart</h1>
      
      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="border-t border-gray-200">
          <dl>
            {cart.items.map((item) => (
              <div key={item.product_id} className="bg-white px-4 py-5 sm:grid sm:grid-cols-6 sm:gap-4 sm:px-6 border-b border-gray-200">
                <dt className="text-sm font-medium text-gray-500 sm:col-span-2">
                  <div className="flex items-center">
                    {item.product.image ? (
                      <img
                        src={item.product.image}
                        alt={item.product.name}
                        className="h-16 w-16 object-cover rounded mr-4"
                      />
                    ) : (
                      <div className="h-16 w-16 bg-gray-100 rounded mr-4 flex items-center justify-center">
                        <span className="text-gray-400">No image</span>
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">{item.product.name}</h3>
                      <p className="text-sm text-gray-500">${item.product.price.toFixed(2)} each</p>
                    </div>
                  </div>
                </dt>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                  <div className="flex items-center">
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity - 1)}
                      className="p-1 rounded-md border border-gray-300 text-gray-700"
                      disabled={item.quantity <= 1}
                    >
                      -
                    </button>
                    <span className="mx-2">{item.quantity}</span>
                    <button
                      onClick={() => handleUpdateQuantity(item.product_id, item.quantity + 1)}
                      className="p-1 rounded-md border border-gray-300 text-gray-700"
                      disabled={item.quantity >= item.product.quantity}
                    >
                      +
                    </button>
                  </div>
                </dd>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                  <div className="text-right">
                    <p className="text-lg font-medium text-gray-900">
                      ${(item.product.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                </dd>
                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-1">
                  <div className="text-right">
                    <button
                      onClick={() => handleRemoveItem(item.product_id)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <TrashIcon className="h-5 w-5" />
                    </button>
                  </div>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg mb-6">
        <div className="px-4 py-5 sm:p-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg leading-6 font-medium text-gray-900">Order Summary</h3>
            <p className="text-2xl font-bold text-gray-900">${cart.total.toFixed(2)}</p>
          </div>
        </div>
      </div>

      <div className="flex justify-between">
        <Link
          href="/products"
          className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
        >
          Continue Shopping
        </Link>
        <button
          onClick={handleCheckout}
          className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
}
