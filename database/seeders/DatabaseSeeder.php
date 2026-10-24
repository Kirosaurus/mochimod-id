<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Product;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // User::factory(10)->create();

        User::factory()->create([
            'name' => 'Admin Mochimod',
            'username' => 'admin123',
            'email' => 'admin@mochimod.id',
            'password' => bcrypt('mochimod123'),
        ]);

        $category = Category::create([
            'name' => 'Mochi',
            'description' => 'Produk mochi',
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Mochi Cokelat',
            'stock' => 20,
            'price' => 15000,
            'image' => null,
            'is_active' => true,
        ]);

        Product::create([
            'category_id' => $category->id,
            'name' => 'Mochi Stroberi',
            'stock' => 15,
            'price' => 12000,
            'image' => null,
            'is_active' => true,
        ]);
    }
}
