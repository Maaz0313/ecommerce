<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class ProductSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add debugging
        echo "Running ProductSeeder...\n";

        // Get all categories
        $categories = Category::all();

        echo "Found " . $categories->count() . " categories\n";

        // Electronics products
        $electronicsCategory = $categories->where('name', 'Electronics')->first();
        if ($electronicsCategory) {
            $products = [
                [
                    'name' => 'Smartphone X',
                    'description' => 'Latest smartphone with advanced features and high-resolution camera',
                    'price' => 799.99,
                    'quantity' => 50,
                    'image' => 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => true,
                ],
                [
                    'name' => 'Laptop Pro',
                    'description' => 'Powerful laptop for professionals with high performance and long battery life',
                    'price' => 1299.99,
                    'quantity' => 30,
                    'image' => 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => true,
                ],
                [
                    'name' => 'Wireless Earbuds',
                    'description' => 'High-quality wireless earbuds with noise cancellation',
                    'price' => 149.99,
                    'quantity' => 100,
                    'image' => 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
            ];

            $this->createProducts($products, $electronicsCategory->id);
        }

        // Clothing products
        $clothingCategory = $categories->where('name', 'Clothing')->first();
        if ($clothingCategory) {
            $products = [
                [
                    'name' => 'Men\'s T-Shirt',
                    'description' => 'Comfortable cotton t-shirt for men',
                    'price' => 24.99,
                    'quantity' => 200,
                    'image' => 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
                [
                    'name' => 'Modest Dress',
                    'description' => 'Elegant and modest dress suitable for all occasions',
                    'price' => 59.99,
                    'quantity' => 150,
                    'image' => 'https://images.unsplash.com/photo-1729200688422-e4ffe8ac73a1?q=80&w=1528&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
                    'featured' => true,
                ],
                [
                    'name' => 'Kids\' Jacket',
                    'description' => 'Warm and comfortable jacket for kids',
                    'price' => 39.99,
                    'quantity' => 100,
                    'image' => 'https://images.unsplash.com/photo-1522771930-78848d9293e8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
            ];

            $this->createProducts($products, $clothingCategory->id);
        }

        // Home & Kitchen products
        $homeCategory = $categories->where('name', 'Home & Kitchen')->first();
        if ($homeCategory) {
            $products = [
                [
                    'name' => 'Coffee Maker',
                    'description' => 'Automatic coffee maker for your morning coffee',
                    'price' => 89.99,
                    'quantity' => 75,
                    'image' => 'https://images.unsplash.com/photo-1570486916434-a8b36c5e9c1c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => true,
                ],
                [
                    'name' => 'Blender',
                    'description' => 'High-speed blender for smoothies and more',
                    'price' => 49.99,
                    'quantity' => 100,
                    'image' => 'https://images.unsplash.com/photo-1570222094114-d054a817e56b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
                [
                    'name' => 'Bedding Set',
                    'description' => 'Comfortable bedding set for a good night\'s sleep',
                    'price' => 79.99,
                    'quantity' => 50,
                    'image' => 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
            ];

            $this->createProducts($products, $homeCategory->id);
        }

        // Books products
        $booksCategory = $categories->where('name', 'Books')->first();
        if ($booksCategory) {
            $products = [
                [
                    'name' => 'Fiction Novel',
                    'description' => 'Bestselling fiction novel that will keep you engaged',
                    'price' => 14.99,
                    'quantity' => 200,
                    'image' => 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => true,
                ],
                [
                    'name' => 'Cookbook',
                    'description' => 'Collection of delicious recipes for all occasions',
                    'price' => 24.99,
                    'quantity' => 150,
                    'image' => 'https://images.unsplash.com/photo-1589998059171-988d887df646?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
                [
                    'name' => 'Self-Help Book',
                    'description' => 'Guide to personal development and growth',
                    'price' => 19.99,
                    'quantity' => 100,
                    'image' => 'https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
            ];

            $this->createProducts($products, $booksCategory->id);
        }

        // Sports & Outdoors products
        $sportsCategory = $categories->where('name', 'Sports & Outdoors')->first();
        if ($sportsCategory) {
            $products = [
                [
                    'name' => 'Yoga Mat',
                    'description' => 'Non-slip yoga mat for your workout',
                    'price' => 29.99,
                    'quantity' => 100,
                    'image' => 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
                [
                    'name' => 'Tennis Racket',
                    'description' => 'Professional tennis racket for players of all levels',
                    'price' => 89.99,
                    'quantity' => 50,
                    'image' => 'https://images.unsplash.com/photo-1617083934551-ac1f1d1aabc4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => true,
                ],
                [
                    'name' => 'Camping Tent',
                    'description' => 'Spacious tent for your camping adventures',
                    'price' => 129.99,
                    'quantity' => 30,
                    'image' => 'https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
                    'featured' => false,
                ],
            ];

            $this->createProducts($products, $sportsCategory->id);
        }
    }

    /**
     * Create products for a category
     */
    private function createProducts(array $products, int $categoryId): void
    {
        echo "Creating " . count($products) . " products for category ID: " . $categoryId . "\n";

        try {
            foreach ($products as $product) {
                echo "Creating product: " . $product['name'] . "\n";

                $newProduct = new Product();
                $newProduct->name = $product['name'];
                $newProduct->slug = Str::slug($product['name']);
                $newProduct->description = $product['description'];
                $newProduct->price = $product['price'];
                $newProduct->quantity = $product['quantity'];
                $newProduct->image = $product['image'];
                $newProduct->category_id = $categoryId;
                $newProduct->is_active = true;
                $newProduct->featured = $product['featured'];
                $newProduct->save();

                echo "Product created: " . $newProduct->id . "\n";
            }

            echo "All products created successfully for category ID: " . $categoryId . "\n";
        } catch (\Exception $e) {
            echo "Error creating products: " . $e->getMessage() . "\n";
        }
    }
}
