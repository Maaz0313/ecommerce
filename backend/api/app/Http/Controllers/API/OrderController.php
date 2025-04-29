<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\OrderItem;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class OrderController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $orders = Order::with('orderItems.product')->where('user_id', $user->id)->get();

        return response()->json([
            'success' => true,
            'data' => $orders
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'shipping_address' => 'required|string',
            'shipping_city' => 'required|string',
            'shipping_state' => 'required|string',
            'shipping_country' => 'required|string',
            'shipping_zip_code' => 'required|string',
            'shipping_phone' => 'required|string',
            'payment_method' => 'required|string|in:cash,credit_card,paypal',
            'notes' => 'nullable|string',
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

        // Start a database transaction
        DB::beginTransaction();

        try {
            $user = $request->user();
            $items = $request->items;
            $totalAmount = 0;

            // Calculate total amount and check product availability
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                if ($product->quantity < $item['quantity']) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Product '{$product->name}' is out of stock. Available quantity: {$product->quantity}"
                    ], 422);
                }

                $totalAmount += $product->price * $item['quantity'];
            }

            // Create order
            $order = Order::create([
                'user_id' => $user->id,
                'total_amount' => $totalAmount,
                'status' => 'pending',
                'payment_method' => $request->payment_method,
                'payment_status' => 'pending',
                'shipping_address' => $request->shipping_address,
                'shipping_city' => $request->shipping_city,
                'shipping_state' => $request->shipping_state,
                'shipping_country' => $request->shipping_country,
                'shipping_zip_code' => $request->shipping_zip_code,
                'shipping_phone' => $request->shipping_phone,
                'notes' => $request->notes,
            ]);

            // Create order items and update product quantities
            foreach ($items as $item) {
                $product = Product::findOrFail($item['product_id']);

                OrderItem::create([
                    'order_id' => $order->id,
                    'product_id' => $product->id,
                    'quantity' => $item['quantity'],
                    'price' => $product->price,
                    'subtotal' => $product->price * $item['quantity'],
                ]);

                // Update product quantity
                $product->quantity -= $item['quantity'];
                $product->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order created successfully',
                'data' => Order::with('orderItems.product')->find($order->id)
            ], 201);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to create order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id, Request $request)
    {
        $user = $request->user();
        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if the order belongs to the authenticated user
        if ($order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        return response()->json([
            'success' => true,
            'data' => $order
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $user = $request->user();
        $order = Order::find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if the order belongs to the authenticated user
        if ($order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Only allow updating notes for now
        $validator = Validator::make($request->all(), [
            'notes' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation Error',
                'errors' => $validator->errors()
            ], 422);
        }

        $order->update([
            'notes' => $request->notes,
        ]);

        return response()->json([
            'success' => true,
            'message' => 'Order updated successfully',
            'data' => $order
        ]);
    }

    /**
     * Cancel an order.
     */
    public function cancel(string $id, Request $request)
    {
        $user = $request->user();
        $order = Order::with('orderItems.product')->find($id);

        if (!$order) {
            return response()->json([
                'success' => false,
                'message' => 'Order not found'
            ], 404);
        }

        // Check if the order belongs to the authenticated user
        if ($order->user_id !== $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'Unauthorized'
            ], 403);
        }

        // Check if the order can be canceled
        if ($order->status !== 'pending') {
            return response()->json([
                'success' => false,
                'message' => 'Only pending orders can be canceled'
            ], 422);
        }

        DB::beginTransaction();

        try {
            // Update order status
            $order->status = 'canceled';
            $order->save();

            // Restore product quantities
            foreach ($order->orderItems as $item) {
                $product = $item->product;
                $product->quantity += $item->quantity;
                $product->save();
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order canceled successfully',
                'data' => $order
            ]);
        } catch (\Exception $e) {
            DB::rollBack();

            return response()->json([
                'success' => false,
                'message' => 'Failed to cancel order',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        return response()->json([
            'success' => false,
            'message' => 'Orders cannot be deleted'
        ], 403);
    }
}
