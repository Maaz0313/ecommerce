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

            // Create payment intent using Cashier
            $paymentIntent = $user->createPaymentIntent($amountInCents, [
                'currency' => 'usd',
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

            // Process payment using Cashier
            $payment = $user->charge($amountInCents, $request->payment_method_id, [
                'currency' => 'usd',
                'metadata' => [
                    'items' => json_encode($items),
                ],
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Payment processed successfully',
                'payment_intent' => $payment->id,
                'amount' => $totalAmount,
                'items' => $items
            ]);

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
