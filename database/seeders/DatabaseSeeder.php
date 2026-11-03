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

        User::updateOrCreate([
            'email' => 'admin@mochimod.id',
        ], [
            'name' => 'Admin Mochimod',
            'username' => 'admin123',
            'email' => 'admin@mochimod.id',
            'password' => bcrypt('mochimod123'),
        ]);

        $mochiCategory = Category::firstOrCreate([
            'name' => 'Mochi',
        ], [
            'description' => 'Beragam varian mochi',
        ]);

        $juiceCategory = Category::firstOrCreate([
            'name' => 'Jus',
        ], [
            'description' => 'Minuman jus buah segar',
        ]);

        $products = [
            [$mochiCategory, 'Mochi Cokelat', 20, 15000],
            [$mochiCategory, 'Mochi Stroberi', 15, 12000],
            [$mochiCategory, 'Mochi Matcha', 15, 14000],
            [$mochiCategory, 'Mochi Taro', 15, 14000],
            [$mochiCategory, 'Mochi Mangga', 15, 13000],
            [$mochiCategory, 'Mochi Keju', 15, 15000],
            [$juiceCategory, 'Jus Jeruk', 20, 10000],
            [$juiceCategory, 'Jus Mangga', 20, 12000],
            [$juiceCategory, 'Jus Alpukat', 20, 15000],
            [$juiceCategory, 'Jus Stroberi', 20, 13000],
        ];

        foreach ($products as [$category, $name, $stock, $price]) {
            Product::updateOrCreate(
                ['name' => $name],
                [
                    'category_id' => $category->id,
                    'stock' => $stock,
                    'price' => $price,
                    'image' => null,
                    'is_active' => true,
                ],
            );
        }
    }
}
