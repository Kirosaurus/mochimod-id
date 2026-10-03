<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Inertia\Inertia;

class PosController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $products = Product::with('cateogry')
                    ->where('is_active', true)
                    ->orderBy('name')
                    ->get();

        return Inertia::render('pos/index', [
            'products' => $products
        ]);
    }
}
