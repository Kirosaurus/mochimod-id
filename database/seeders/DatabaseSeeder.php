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

        $categories = collect(['Mochi', 'Jus'])->map(function ($name) {
            return Category::create([
                'name' => $name,
                'description' => "Aneka menu varian {$name}"
            ]);
        });

        Product::factory(50)->create([
            'category_id' => fn () => $categories->random()->id
        ]);
    }
}
