<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StockManagementController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\SalesReportController;
use App\Http\Controllers\OrderController;

Route::get('/', function () {
    if (auth()->check()) {
        return redirect()->route('POS');
    }

    return redirect()->route('login');
})->name('home');
// Route::inertia('/manajemen-stok', 'manajemen-stok')->name('manajemen stok');

Route::get('/login', [AuthController::class, 'show'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::post('/orders', [
        OrderController::class,
        'store',
    ])->name('orders.store');

    Route::get('/orders/{order}/receipt', [
        OrderController::class,
        'show',
    ])->name('orders.receipt');

    Route::post('/orders/{order}/cancel', [
        OrderController::class,
        'cancel',
    ])->name('orders.cancel');

    Route::get('/pos', [PosController::class, 'show'])->name('POS');

    Route::get('/manajemen-stok', [StockManagementController::class, 'show'])->name('Stock Management');

    Route::get('/laporan-penjualan', [SalesReportController::class, 'show'])->name('Sales Report');
    
    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login');
    })->name('logout');

    Route::resource("/products", ProductController::class)
        ->middleware('auth.basic')
        ->except("create", "show", "edit");
});
