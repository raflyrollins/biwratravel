<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Booking;
use App\Models\Bus;
use App\Models\Charter;
use App\Models\City;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        $stats = [];

        if ($user->hasRole(UserRole::Superadmin)) {
            $stats = [
                'totalCities' => City::count(),
                'totalBuses' => Bus::count(),
                'totalTrips' => Trip::count(),
                'totalBookings' => Booking::count(),
            ];
        } elseif ($user->hasRole(UserRole::AdminPenjualan)) {
            $stats = [
                'pendingPayments' => Booking::where('status', 'awaiting_payment')->count(),
                'totalBookings' => Booking::count(),
            ];
        } elseif ($user->hasRole(UserRole::AdminCharter)) {
            $stats = [
                'pendingCharters' => Charter::where('status', 'submitted')->count(),
                'totalCharters' => Charter::count(),
            ];
        } elseif ($user->hasRole(UserRole::Driver)) {
            $stats = [
                'todayTrips' => Trip::where('departure_date', today())->count(),
            ];
        } elseif ($user->hasRole(UserRole::PetugasLoket)) {
            $stats = [
                'todayBookings' => Booking::whereDate('created_at', today())->count(),
            ];
        } elseif ($user->hasRole(UserRole::Customer)) {
            $stats = [
                'myBookings' => Booking::where('user_id', $user->id)->count(),
            ];
        }

        return Inertia::render('dashboard/Index', [
            'stats' => $stats,
        ]);
    }
}
