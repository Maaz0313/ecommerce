<?php

namespace Database\Seeders;

use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Run the user seeder first
        $this->call(UserSeeder::class);

        // Then run the category seeder
        $this->call(CategorySeeder::class);

        // Finally run the product seeder
        $this->call(ProductSeeder::class);
    }
}
