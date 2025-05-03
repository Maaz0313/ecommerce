'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { CartService, OrderService, AuthService, CartItem } from '../../services';

export default function CheckoutPage() {
  const router = useRouter();
  const [cart, setCart] = useState<{ items: CartItem[], total: number }>({ items: [], total: 0 });
  const [loading, setLoading] = useState<boolean>(true);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // Form state
  const [shippingAddress, setShippingAddress] = useState<string>('');
  const [shippingCity, setShippingCity] = useState<string>('');
  const [shippingState, setShippingState] = useState<string>('');
  const [shippingCountry, setShippingCountry] = useState<string>('');
  const [shippingZipCode, setShippingZipCode] = useState<string>('');
  const [shippingPhone, setShippingPhone] = useState<string>('');
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'credit_card' | 'paypal'>('credit_card');
  const [notes, setNotes] = useState<string>('');
  
  // Form validation
  const [formErrors, setFormErrors] = useState<{[key: string]: string}>({});

  useEffect(() => {
    // Check if user is authenticated
    if (!AuthService.isAuthenticated()) {
      router.push('/login?redirect=/checkout');
      return;
    }

    // Get cart from local storage
    const cartData = CartService.getCart();
    
    // Redirect to cart page if cart is empty
    if (cartData.items.length === 0) {
      router.push('/cart');
      return;
    }
    
    setCart(cartData);
    setLoading(false);
  }, [router]);

  const validateForm = () => {
    const errors: {[key: string]: string} = {};
    
    if (!shippingAddress.trim()) errors.shippingAddress = 'Shipping address is required';
    if (!shippingCity.trim()) errors.shippingCity = 'City is required';
    if (!shippingState.trim()) errors.shippingState = 'State is required';
    if (!shippingCountry.trim()) errors.shippingCountry = 'Country is required';
    if (!shippingZipCode.trim()) errors.shippingZipCode = 'ZIP code is required';
    if (!shippingPhone.trim()) errors.shippingPhone = 'Phone number is required';
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    try {
      setSubmitting(true);
      setError(null);
      
      // Prepare order data
      const orderData = {
        shipping_address: shippingAddress,
        shipping_city: shippingCity,
        shipping_state: shippingState,
        shipping_country: shippingCountry,
        shipping_zip_code: shippingZipCode,
        shipping_phone: shippingPhone,
        payment_method: paymentMethod,
        notes: notes || undefined,
        items: cart.items.map(item => ({
          product_id: item.product_id,
          quantity: item.quantity
        }))
      };
      
      // Create order
      const order = await OrderService.createOrder(orderData);
      
      // Clear cart
      CartService.clearCart();
      
      // Trigger storage event to update cart count in Layout
      window.dispatchEvent(new Event('storage'));
      
      // Redirect to order confirmation page
      router.push(`/order-confirmation/${order.id}`);
    } catch (err: any) {
      console.error('Error creating order:', err);
      setError(err.response?.data?.message || 'Failed to create order. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-6">Checkout</h1>
      
      {error && (
        <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Shipping and Payment Form */}
        <div className="md:col-span-2">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Shipping Information</h2>
              
              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-6 gap-6">
                  <div className="col-span-6">
                    <label htmlFor="shipping-address" className="block text-sm font-medium text-gray-700">
                      Address
                    </label>
                    <input
                      type="text"
                      id="shipping-address"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingAddress ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingAddress && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingAddress}</p>
                    )}
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="shipping-city" className="block text-sm font-medium text-gray-700">
                      City
                    </label>
                    <input
                      type="text"
                      id="shipping-city"
                      value={shippingCity}
                      onChange={(e) => setShippingCity(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingCity ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingCity && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingCity}</p>
                    )}
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="shipping-state" className="block text-sm font-medium text-gray-700">
                      State / Province
                    </label>
                    <input
                      type="text"
                      id="shipping-state"
                      value={shippingState}
                      onChange={(e) => setShippingState(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingState ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingState && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingState}</p>
                    )}
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="shipping-country" className="block text-sm font-medium text-gray-700">
                      Country
                    </label>
                    <input
                      type="text"
                      id="shipping-country"
                      value={shippingCountry}
                      onChange={(e) => setShippingCountry(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingCountry ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingCountry && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingCountry}</p>
                    )}
                  </div>
                  
                  <div className="col-span-6 sm:col-span-3">
                    <label htmlFor="shipping-zip" className="block text-sm font-medium text-gray-700">
                      ZIP / Postal Code
                    </label>
                    <input
                      type="text"
                      id="shipping-zip"
                      value={shippingZipCode}
                      onChange={(e) => setShippingZipCode(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingZipCode ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingZipCode && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingZipCode}</p>
                    )}
                  </div>
                  
                  <div className="col-span-6">
                    <label htmlFor="shipping-phone" className="block text-sm font-medium text-gray-700">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      id="shipping-phone"
                      value={shippingPhone}
                      onChange={(e) => setShippingPhone(e.target.value)}
                      className={`mt-1 block w-full border ${formErrors.shippingPhone ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    />
                    {formErrors.shippingPhone && (
                      <p className="mt-1 text-sm text-red-600">{formErrors.shippingPhone}</p>
                    )}
                  </div>
                </div>
                
                <div className="mt-8">
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Payment Method</h2>
                  
                  <div className="space-y-4">
                    <div className="flex items-center">
                      <input
                        id="payment-credit-card"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'credit_card'}
                        onChange={() => setPaymentMethod('credit_card')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor="payment-credit-card" className="ml-3 block text-sm font-medium text-gray-700">
                        Credit Card
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-paypal"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'paypal'}
                        onChange={() => setPaymentMethod('paypal')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor="payment-paypal" className="ml-3 block text-sm font-medium text-gray-700">
                        PayPal
                      </label>
                    </div>
                    
                    <div className="flex items-center">
                      <input
                        id="payment-cash"
                        name="payment-method"
                        type="radio"
                        checked={paymentMethod === 'cash'}
                        onChange={() => setPaymentMethod('cash')}
                        className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                      />
                      <label htmlFor="payment-cash" className="ml-3 block text-sm font-medium text-gray-700">
                        Cash on Delivery
                      </label>
                    </div>
                  </div>
                </div>
                
                <div className="mt-8">
                  <label htmlFor="notes" className="block text-sm font-medium text-gray-700">
                    Order Notes (Optional)
                  </label>
                  <textarea
                    id="notes"
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Special instructions for delivery"
                  />
                </div>
                
                <div className="mt-8 flex justify-end">
                  <Link
                    href="/cart"
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 mr-4"
                  >
                    Back to Cart
                  </Link>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                  >
                    {submitting ? 'Processing...' : 'Place Order'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        {/* Order Summary */}
        <div className="md:col-span-1">
          <div className="bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Order Summary</h2>
              
              <div className="mt-4 border-t border-gray-200 pt-4">
                <div className="flow-root">
                  <ul className="-my-4 divide-y divide-gray-200">
                    {cart.items.map((item) => (
                      <li key={item.product_id} className="py-4 flex">
                        <div className="flex-shrink-0 w-16 h-16 border border-gray-200 rounded-md overflow-hidden">
                          {item.product.image ? (
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="w-full h-full object-center object-cover"
                            />
                          ) : (
                            <div className="w-full h-full bg-gray-200 flex items-center justify-center">
                              <span className="text-gray-400 text-xs">No image</span>
                            </div>
                          )}
                        </div>
                        
                        <div className="ml-4 flex-1 flex flex-col">
                          <div>
                            <div className="flex justify-between text-base font-medium text-gray-900">
                              <h3>{item.product.name}</h3>
                              <p className="ml-4">${(item.product.price * item.quantity).toFixed(2)}</p>
                            </div>
                          </div>
                          <div className="flex-1 flex items-end justify-between text-sm">
                            <p className="text-gray-500">Qty {item.quantity}</p>
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-base font-medium text-gray-900">
                  <p>Subtotal</p>
                  <p>${cart.total.toFixed(2)}</p>
                </div>
                <p className="mt-0.5 text-sm text-gray-500">Shipping and taxes calculated at checkout.</p>
              </div>
              
              <div className="border-t border-gray-200 pt-4 mt-4">
                <div className="flex justify-between text-lg font-bold text-gray-900">
                  <p>Total</p>
                  <p>${cart.total.toFixed(2)}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
