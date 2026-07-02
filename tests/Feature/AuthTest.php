<?php

use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;

uses(RefreshDatabase::class);

// ── Login ──

test('login page renders', function () {
    $this->get(route('login'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/Auth')
            ->where('mode', 'login')
        );
});

test('user can login with valid credentials', function () {
    $user = User::factory()->create([
        'password' => bcrypt('secret123'),
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'secret123',
    ])->assertRedirect(route('home'));

    $this->assertAuthenticatedAs($user);
});

test('user cannot login with wrong password', function () {
    $user = User::factory()->create([
        'password' => bcrypt('secret123'),
    ]);

    $this->post('/login', [
        'email' => $user->email,
        'password' => 'wrong-password',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('user cannot login with non-existent email', function () {
    $this->post('/login', [
        'email' => 'nonexistent@example.com',
        'password' => 'somepassword',
    ])->assertSessionHasErrors('email');

    $this->assertGuest();
});

test('authenticated user cannot see login page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('login'))
        ->assertRedirect();
});

// ── Register ──

test('register page renders', function () {
    $this->get(route('register'))
        ->assertOk()
        ->assertInertia(fn ($page) => $page
            ->component('auth/Auth')
            ->where('mode', 'register')
        );
});

test('user can register with valid data', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertRedirect(route('home'));

    $this->assertAuthenticated();
    $this->assertDatabaseHas('users', [
        'email' => 'test@example.com',
        'name' => 'Test User',
    ]);
});

test('user cannot register with duplicate email', function () {
    User::factory()->create(['email' => 'test@example.com']);

    $this->post('/register', [
        'name' => 'Another User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'password123',
    ])->assertSessionHasErrors('email');
});

test('registration requires password confirmation', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'password123',
        'password_confirmation' => 'different-password',
    ])->assertSessionHasErrors('password');
});

test('registration requires minimum password length', function () {
    $this->post('/register', [
        'name' => 'Test User',
        'email' => 'test@example.com',
        'password' => 'short',
        'password_confirmation' => 'short',
    ])->assertSessionHasErrors('password');
});

test('authenticated user cannot see register page', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->get(route('register'))
        ->assertRedirect();
});

// ── Logout ──

test('authenticated user can logout', function () {
    $user = User::factory()->create();

    $this->actingAs($user)
        ->post('/logout')
        ->assertRedirect('/');

    $this->assertGuest();
});

test('guest cannot logout', function () {
    $this->post('/logout')->assertRedirect(route('login'));
});
