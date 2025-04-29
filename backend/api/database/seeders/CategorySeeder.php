<?php

namespace Database\Seeders;

use App\Models\Category;
use Illuminate\Database\Seeder;
use Illuminate\Support\Str;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Add debugging
        echo "Running CategorySeeder...\n";

        $categories = [
            [
                'name' => 'Electronics',
                'description' => 'Electronic devices and gadgets for everyday use',
                'image' => 'https://images.unsplash.com/photo-1498049794561-7780e7231661?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            ],
            [
                'name' => 'Clothing',
                'description' => 'Fashion items for men, women, and children',
                'image' => 'https://images.unsplash.com/photo-1567401893414-76b7b1e5a7a5?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            ],
            [
                'name' => 'Home & Kitchen',
                'description' => 'Everything you need for your home and kitchen',
                'image' => 'https://images.unsplash.com/photo-1556911220-bda9f7f7597b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            ],
            [
                'name' => 'Books',
                'description' => 'Books of all genres for all ages',
                'image' => 'https://images.unsplash.com/photo-1495446815901-a7297e633e8d?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            ],
            [
                'name' => 'Sports & Outdoors',
                'description' => 'Equipment and gear for sports and outdoor activities',
                'image' => 'https://images.unsplash.com/photo-1517649763962-0c623066013b?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80',
            ],
        ];

        echo "Categories array created with " . count($categories) . " items\n";

        try {
            foreach ($categories as $category) {
                echo "Creating category: " . $category['name'] . "\n";

                $newCategory = new Category();
                $newCategory->name = $category['name'];
                $newCategory->slug = Str::slug($category['name']);
                $newCategory->description = $category['description'];
                $newCategory->image = $category['image'];
                $newCategory->is_active = true;
                $newCategory->save();

                echo "Category created: " . $newCategory->id . "\n";
            }

            echo "All categories created successfully\n";
        } catch (\Exception $e) {
            echo "Error creating categories: " . $e->getMessage() . "\n";
        }
    }
}
