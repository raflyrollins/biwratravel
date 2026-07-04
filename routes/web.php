<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\BookingFlowController;
use App\Http\Controllers\BusController;
use App\Http\Controllers\CityController;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\LoketBookingController;
use App\Http\Controllers\LoketController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\PrintTicketController;
use App\Http\Controllers\RouteController;
use App\Http\Controllers\SavedPassengerController;
use App\Http\Controllers\TripController;
use App\Http\Controllers\TripSearchController;
use App\Http\Controllers\UserController;
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
    Route::middleware('role:customer')->prefix('customer')->name('customer.')->group(function () {
        Route::get('/bookings', [BookingFlowController::class, 'index'])->name('bookings');
        Route::get('/search', [TripSearchController::class, 'search'])->name('search');
        Route::get('/booking/trip/{trip}', [BookingFlowController::class, 'create'])->name('booking.create');
        Route::post('/booking', [BookingFlowController::class, 'store'])->name('booking.store');
        Route::get('/booking/{booking}/payment', [BookingFlowController::class, 'payment'])->name('booking.payment');
        Route::post('/booking/{booking}/payment', [BookingFlowController::class, 'uploadProof'])->name('booking.payment.upload');
        Route::post('/booking/{booking}/cancel', [BookingFlowController::class, 'cancel'])->name('booking.cancel');
        Route::get('/passengers', [SavedPassengerController::class, 'index'])->name('passengers.index');
        Route::put('/passengers/{savedPassenger}', [SavedPassengerController::class, 'update'])->name('passengers.update');
        Route::delete('/passengers/{savedPassenger}', [SavedPassengerController::class, 'destroy'])->name('passengers.destroy');
    });
    Route::get('/', [DashboardController::class, 'index'])->name('index');

    Route::middleware('role:superadmin')->group(function () {
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

        Route::resource('lokets', LoketController::class)->names([
            'index' => 'lokets.index',
            'create' => 'lokets.create',
            'store' => 'lokets.store',
            'edit' => 'lokets.edit',
            'update' => 'lokets.update',
            'destroy' => 'lokets.destroy',
        ]);

        Route::resource('users', UserController::class)->names([
            'index' => 'users.index',
            'create' => 'users.create',
            'store' => 'users.store',
            'edit' => 'users.edit',
            'update' => 'users.update',
            'destroy' => 'users.destroy',
        ]);
    });

    Route::middleware('role:superadmin,admin_penjualan')->group(function () {
        Route::resource('bookings', BookingController::class)->only([
            'index', 'show', 'destroy',
        ])->names([
            'index' => 'bookings.index',
            'show' => 'bookings.show',
            'destroy' => 'bookings.destroy',
        ]);
    });

    Route::get('/booking/{booking}/print', [PrintTicketController::class, 'show'])->name('booking.print');

    Route::middleware('role:petugas_loket')->prefix('loket')->name('loket.')->group(function () {
        Route::get('/booking/search', [LoketBookingController::class, 'search'])->name('booking.search');
        Route::get('/booking/trip/{trip}', [LoketBookingController::class, 'create'])->name('booking.create');
        Route::post('/booking', [LoketBookingController::class, 'store'])->name('booking.store');
        Route::get('/bookings', [LoketBookingController::class, 'index'])->name('bookings');
        Route::get('/booking/lookup', [LoketBookingController::class, 'lookup'])->name('booking.lookup');
        Route::get('/passenger/lookup/{nik}', [LoketBookingController::class, 'lookupPassenger'])->name('passenger.lookup');
    });

    Route::middleware('role:superadmin,admin_penjualan')->group(function () {
        Route::prefix('payments')->name('payments.')->group(function () {
            Route::get('/', [PaymentController::class, 'index'])->name('index');
            Route::post('{payment}/approve', [PaymentController::class, 'approve'])->name('approve');
            Route::post('{payment}/reject', [PaymentController::class, 'reject'])->name('reject');
        });
    });
});
