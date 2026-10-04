<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StockManagementController;

Route::inertia('/', 'welcome')->name('home');
// Route::inertia('/manajemen-stok', 'manajemen-stok')->name('manajemen stok');
Route::get('/login', [AuthController::class, 'show'])->name('Login');
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('auth')->group(function () {
    Route::get('/manajemen-stok', [StockManagementController::class, 'show'])->name('Stock Management');

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
