<?php

namespace App\Http\Controllers;

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

        return Inertia::render('pos', [
            'products' => $products
        ]);
    }
}
