<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\StockManagementController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');
// Route::inertia('/manajemen-stok', 'manajemen-stok')->name('manajemen stok');

Route::get('/login', [AuthController::class, 'show'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    // Route for Point of Sales
    Route::get('/', [PosController::class, 'show'])->name('POS');

    // Route for Stock Management
    Route::get('/manajemen-stok', [StockManagementController::class, 'show'])->name('Stock Management');

    // Route for Sale Report
    Route::get('/laporan-penjualan', [SalesReportController::class, 'show'])->name('Sales Report');
    
    // Route for Logout
    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login');
    })->name('logout');

    // Route for Product
    Route::resource("/products", ProductController::class)
        ->middleware('auth.basic')
        ->except("create", "show", "edit");

    // Route for Checkout
    Route::post('checkout/confirm', [CheckoutController::class, 'confirm'])
        ->name('confirm');

    Route::get('checkout/{id}/receipt', [CheckoutController::class, 'receipt'])
        ->name('receipt');
});
