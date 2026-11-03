<?php

namespace Database\Factories;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Database\Eloquent\Factories\Factory;

/**
 * @extends Factory<Product>
 */
class ProductFactory extends Factory
{
    /**
     * Define the model's default state.
     *
     * @return array<string, mixed>
     */
    public function definition(): array
    {
        return [
            'category_id' => Category::inRandomOrder()->value('id') ?? Category::create(['name' => 'Kateogri Umum'])->id,

            'name' => fake()->words(3, true),
            'stock' => fake()->numberBetween(0, 100),
            'price' => fake()->numberBetween(10, 100) * 1000,
            'image' => null,
            'is_active' => fake()->boolean(90)
        ];
    }
}
