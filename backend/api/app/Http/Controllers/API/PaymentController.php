<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;

class PaymentController extends Controller
{
    /**
     * Create a payment intent for the order using Cashier
     */
    public function createPaymentIntent(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $items = $request->items;
            $totalAmount = 0;

            // Calculate total amount and verify product availability
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->quantity < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => "Product '{$product->name}' is out of stock. Available quantity: {$product->quantity}"
                    ], 422);
                }

                $totalAmount += $product->price * $item['quantity'];
            }

            // Convert to cents for Stripe (Cashier expects amounts in cents)
            $amountInCents = (int) ($totalAmount * 100);

            // Ensure user has a Stripe customer ID
            if (!$user->hasStripeId()) {
                $user->createAsStripeCustomer();
            }

            // Create payment intent using Cashier's pay method
            $paymentIntent = $user->pay($amountInCents, [
                'currency' => 'usd',
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'return_url' => config('app.frontend_url', 'http://localhost:3000') . '/checkout/success',
                'metadata' => [
                    'items' => json_encode($items),
                ],
            ]);

            return response()->json([
                'success' => true,
                'client_secret' => $paymentIntent->client_secret,
                'amount' => $totalAmount,
            ]);

        } catch (\Exception $e) {
            Log::error('Payment Intent Creation Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Failed to create payment intent. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Process payment using Cashier
     */
    public function processPayment(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'payment_method_id' => 'required|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|integer|min:1',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $user = $request->user();
            $items = $request->items;
            $totalAmount = 0;

            // Calculate total amount and verify product availability
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->quantity < $item['quantity']) {
                    return response()->json([
                        'success' => false,
                        'message' => "Product '{$product->name}' is out of stock. Available quantity: {$product->quantity}"
                    ], 422);
                }

                $totalAmount += $product->price * $item['quantity'];
            }

            // Convert to cents for Stripe
            $amountInCents = (int) ($totalAmount * 100);

            // Ensure user has a Stripe customer ID
            if (!$user->hasStripeId()) {
                $user->createAsStripeCustomer();
            }

            // Create and confirm payment intent using Cashier's pay method
            $paymentIntent = $user->pay($amountInCents, [
                'currency' => 'usd',
                'payment_method' => $request->payment_method_id,
                'confirm' => true,
                'automatic_payment_methods' => [
                    'enabled' => true,
                ],
                'return_url' => config('app.frontend_url', 'http://localhost:3000') . '/checkout/success',
                'metadata' => [
                    'items' => json_encode($items),
                ],
            ]);

            // Check if payment requires additional action
            if ($paymentIntent->status === 'requires_action') {
                return response()->json([
                    'success' => false,
                    'requires_action' => true,
                    'payment_intent' => [
                        'id' => $paymentIntent->id,
                        'client_secret' => $paymentIntent->client_secret,
                    ],
                    'message' => 'Payment requires additional confirmation.'
                ], 422);
            }

            // Check if payment failed
            if ($paymentIntent->status !== 'succeeded') {
                return response()->json([
                    'success' => false,
                    'message' => 'Payment failed. Please try again.',
                ], 422);
            }

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'payment_intent' => $paymentIntent->id,
                'amount' => $totalAmount,
                'items' => $items
            ]);

        } catch (\Laravel\Cashier\Exceptions\IncompletePayment $e) {
            return response()->json([
                'success' => false,
                'requires_action' => true,
                'payment_intent' => [
                    'id' => $e->payment->id,
                    'client_secret' => $e->payment->client_secret,
                ],
                'message' => 'Payment requires additional confirmation.'
            ], 422);
        } catch (\Exception $e) {
            Log::error('Payment Processing Error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment failed. Please try again.',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
