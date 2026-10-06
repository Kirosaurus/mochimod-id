<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Inertia\Inertia;

class SalesReportController extends Controller
{
    public function show(){
        return Inertia::render('stock-management');
    }
}
