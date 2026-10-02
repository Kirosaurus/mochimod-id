<?php

use App\Http\Controllers\ProductController;
use App\Livewire\Auth\LoginPage;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;

Route::get('/', LoginPage::class)->name('login');

Route::middleware('auth')->group(function () {
    Route::get('/dashboard', function () {
        return view('dashboard');
    })->name('dashboard');

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
