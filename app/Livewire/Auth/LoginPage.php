<?php

namespace App\Livewire\Auth;

use App\Models\User;
use Illuminate\Contracts\View\View;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Str;
use Livewire\Attributes\Layout;
use Livewire\Attributes\Title;
use Livewire\Component;

#[Layout('layouts.app')]
#[Title('Login - Mochimod-Id')]
class LoginPage extends Component
{
    public string $username = '';

    public string $password = '';

    public bool $remember = false;

    public bool $showPassword = false;

    public ?string $errorMessage = null;

    public ?string $successMessage = null;

    /**
     * Validation rules for the login form.
     *
     * @return array<string, array<int, string>>
     */
    protected function rules(): array
    {
        return [
            'username' => ['required', 'string', 'min:3', 'max:50'],
            'password' => ['required', 'string', 'min:6'],
        ];
    }

    /**
     * Custom validation messages in Indonesian.
     *
     * @return array<string, string>
     */
    protected function messages(): array
    {
        return [
            'username.required' => 'Masukkan username Anda terlebih dahulu.',
            'username.min' => 'Username harus memiliki minimal 3 karakter.',
            'password.required' => 'Masukkan password Anda terlebih dahulu.',
            'password.min' => 'Password minimal terdiri dari 6 karakter.',
        ];
    }

    /**
     * Real-time validation when properties change.
     */
    public function updated(string $propertyName): void
    {
        $this->errorMessage = null;
        $this->validateOnly($propertyName);
    }

    /**
     * Toggle password visibility.
     */
    public function togglePasswordVisibility(): void
    {
        $this->showPassword = ! $this->showPassword;
    }

    /**
     * Fill demo credentials quickly for interactive testing.
     */
    public function fillDemo(): void
    {
        $this->username = 'admin123';
        $this->password = 'mochimod123';
        $this->resetErrorBag();
        $this->errorMessage = null;
    }

    /**
     * Handle user verification and login.
     */
    public function login(): mixed
    {
        $this->errorMessage = null;
        $this->successMessage = null;

        $this->validate();

        $throttleKey = Str::transliterate(Str::lower($this->username).'|'.request()->ip());

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            $this->errorMessage = "Terlalu banyak percobaan login yang gagal. Silakan coba lagi dalam {$seconds} detik.";

            return null;
        }

        // Verify credentials against user records
        $user = User::where('username', $this->username)
            ->orWhere('email', $this->username)
            ->first();

        if (! $user || ! Hash::check($this->password, $user->password)) {
            RateLimiter::hit($throttleKey, 60);
            $this->errorMessage = 'Username atau password yang Anda masukkan tidak sesuai.';
            $this->addError('password', 'Kredensial tidak cocok dengan data kami.');

            return null;
        }

        RateLimiter::clear($throttleKey);

        Auth::login($user, $this->remember);
        session()->regenerate();

        $this->successMessage = 'Login berhasil! Mengalihkan ke sistem...';

        return redirect()->intended(route('dashboard'));
    }

    public function render(): View
    {
        return view('livewire.auth.login-page');
    }
}
