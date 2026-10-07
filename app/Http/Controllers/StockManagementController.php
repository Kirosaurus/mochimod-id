<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;

class StockManagementController extends Controller
{
    public function show():Response
    {
        $products = Product::with('category')->get();
        return Inertia::render('stock-management',[
            'products' => $products 
        ]);
    }
}
