<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Inertia\Inertia;
use Inertia\Response;

class PosController extends Controller
{
    public function show(): Response
    {
        $products = Product::with('category')
                            ->where('is_active', true)
                            ->orderBy('name')
                            ->get();

        $categories = Category::orderBy('name')->get();

        return Inertia::render('pos', [
            'products' => $products,
            'categories' => $categories
        ]);
    }
}
