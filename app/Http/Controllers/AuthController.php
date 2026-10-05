<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class AuthController extends Controller
{
    public function show(){
        return Inertia::render('login-page');
    }

    public function login(Request $request){
        $credentials = $request->validate([
            'username' => ['required', 'string'],
            'password' => ['required'],
        ]);

        if (Auth::attempt($credentials, $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended('/pos');
        }

        return back()->withErrors([
            'username' => 'Username atau Password salah.',
            'password' => 'Username atau Password salah.',
        ]);
    }
}
