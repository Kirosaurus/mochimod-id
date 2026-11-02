<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\CheckoutController;
use App\Http\Controllers\PosController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\SalesReportController;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

// Route::inertia('/', 'welcome')->name('home');

Route::get('/login', [AuthController::class, 'show'])->name('login');
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    // Route for Point of Sales
    Route::get('/', [PosController::class, 'show'])->name('POS');

    // Route for Products & Stock Management
    Route::resource('/products', ProductController::class)
        ->except('create', 'show', 'edit');
    Route::get('/manajemen-stok', fn () => redirect()->route('products.index'));

    // Route for Sale Report
    Route::get('/laporan-penjualan', [SalesReportController::class, 'show'])->name('Sales Report');

    // Route for Logout
    Route::post('/logout', function () {
        Auth::logout();
        request()->session()->invalidate();
        request()->session()->regenerateToken();

        return redirect()->route('login');
    })->name('logout');

    // Route for Checkout
    Route::prefix('checkout')->name('checkout.')->group(function () {
        Route::post('/confirm', [CheckoutController::class, 'confirm'])->name('confirm');
        Route::get('/{transaction}/receipt', [CheckoutController::class, 'receipt'])->name('receipt');
        Route::get('/{transaction}/receipt/pdf', [CheckoutController::class, 'downloadPdf'])->name('receipt.pdf');
    });

    // Route for Sales Report
    Route::prefix('laporan-penjualan')->name('sales-report.')->group(function () {
        Route::get('/', [SalesReportController::class, 'show'])->name('index');
        Route::get('/summary', [SalesReportController::class, 'summary'])->name('summary');
        Route::get('/chart', [SalesReportController::class, 'chart'])->name('chart');
        Route::get('/history', [SalesReportController::class, 'history'])->name('history');
        Route::get('/pdf', [SalesReportController::class, 'downloadPdf'])->name('pdf');
    });
});
