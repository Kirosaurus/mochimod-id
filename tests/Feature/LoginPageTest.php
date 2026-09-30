<?php

namespace Tests\Feature;

use App\Livewire\Auth\LoginPage;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Livewire\Livewire;
use Tests\TestCase;

class LoginPageTest extends TestCase
{
    use RefreshDatabase;

    public function test_login_page_can_be_rendered(): void
    {
        $response = $this->get('/');

        $response->assertStatus(200);
        $response->assertSeeLivewire(LoginPage::class);
        $response->assertSee('Login');
        $response->assertSee('Username');
        $response->assertSee('Password');
        $response->assertSee('6-Digit Pin');
        $response->assertSee('Masuk ke Sistem');
    }

    public function test_validation_requires_username_and_password(): void
    {
        Livewire::test(LoginPage::class)
            ->set('username', '')
            ->set('password', '')
            ->call('login')
            ->assertHasErrors(['username', 'password']);
    }

    public function test_validation_requires_minimum_password_length(): void
    {
        Livewire::test(LoginPage::class)
            ->set('username', 'admin123')
            ->set('password', '123')
            ->call('login')
            ->assertHasErrors(['password']);
    }

    public function test_password_visibility_can_be_toggled(): void
    {
        Livewire::test(LoginPage::class)
            ->assertSet('showPassword', false)
            ->call('togglePasswordVisibility')
            ->assertSet('showPassword', true)
            ->call('togglePasswordVisibility')
            ->assertSet('showPassword', false);
    }

    public function test_demo_credentials_can_be_filled(): void
    {
        Livewire::test(LoginPage::class)
            ->call('fillDemo')
            ->assertSet('username', 'admin123')
            ->assertSet('password', 'mochimod123');
    }

    public function test_user_can_authenticate_with_valid_credentials(): void
    {
        $user = User::factory()->create([
            'username' => 'admin123',
            'password' => bcrypt('mochimod123'),
        ]);

        Livewire::test(LoginPage::class)
            ->set('username', 'admin123')
            ->set('password', 'mochimod123')
            ->call('login')
            ->assertHasNoErrors()
            ->assertRedirect(route('dashboard'));

        $this->assertAuthenticatedAs($user);
    }

    public function test_user_cannot_authenticate_with_invalid_credentials(): void
    {
        User::factory()->create([
            'username' => 'admin123',
            'password' => bcrypt('mochimod123'),
        ]);

        Livewire::test(LoginPage::class)
            ->set('username', 'admin123')
            ->set('password', 'wrongpassword')
            ->call('login')
            ->assertHasErrors(['password'])
            ->assertSee('Username atau password yang Anda masukkan tidak sesuai.');

        $this->assertGuest();
    }
}
