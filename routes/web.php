<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\TripController;
use Illuminate\Support\Facades\Route;

Route::inertia('/', 'welcome')->name('home');

Route::middleware('guest')->group(function () {
    Route::inertia('/login', 'auth/Auth', ['mode' => 'login'])->name('login');
    Route::inertia('/register', 'auth/Auth', ['mode' => 'register'])->name('register');
    Route::post('/login', [AuthController::class, 'login']);
    Route::post('/register', [AuthController::class, 'register']);
});

Route::post('/logout', [AuthController::class, 'logout'])->middleware('auth');

Route::middleware('auth')->prefix('dashboard')->name('dashboard.')->group(function () {
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::resource('cities', CityController::class)->names([
        'index' => 'cities.index',
        'create' => 'cities.create',
        'store' => 'cities.store',
        'edit' => 'cities.edit',
        'update' => 'cities.update',
        'destroy' => 'cities.destroy',
    ]);

    Route::resource('buses', BusController::class)->names([
        'index' => 'buses.index',
        'create' => 'buses.create',
        'store' => 'buses.store',
        'edit' => 'buses.edit',
        'update' => 'buses.update',
        'destroy' => 'buses.destroy',
    ]);

    Route::resource('routes', RouteController::class)->names([
        'index' => 'routes.index',
        'create' => 'routes.create',
        'store' => 'routes.store',
        'edit' => 'routes.edit',
        'update' => 'routes.update',
        'destroy' => 'routes.destroy',
    ]);

    Route::resource('trips', TripController::class)->names([
        'index' => 'trips.index',
        'create' => 'trips.create',
        'store' => 'trips.store',
        'edit' => 'trips.edit',
        'update' => 'trips.update',
        'destroy' => 'trips.destroy',
    ]);
});
