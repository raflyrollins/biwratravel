<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Booking;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BookingController extends Controller
{
    public function index(Request $request)
    {
        $query = Booking::with([
            'trip.route.bus',
            'trip.bus',
            'originCity',
            'destinationCity',
            'user',
        ])->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('source')) {
            $query->where('source', $request->source);
        }

        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        if ($request->user()->hasRole(UserRole::Customer)) {
            $query->where('user_id', $request->user()->id);
        }

        $bookings = $query->paginate(20)->withQueryString();

        return Inertia::render('dashboard/bookings/Index', [
            'bookings' => $bookings,
            'filters' => $request->only(['status', 'source', 'date_from', 'date_to']),
        ]);
    }

    public function show(Booking $booking)
    {
        $booking->load([
            'trip.route.bus',
            'trip.bus',
            'trip.route.originCity',
            'trip.route.destinationCity',
            'originCity',
            'destinationCity',
            'user',
            'passengers',
            'payments.validator',
        ]);

        return Inertia::render('dashboard/bookings/Show', [
            'booking' => $booking,
        ]);
    }

    public function destroy(Booking $booking): RedirectResponse
    {
        $booking->delete();

        return redirect()->route('dashboard.bookings.index')
            ->with('success', 'Booking berhasil dihapus.');
    }
}
