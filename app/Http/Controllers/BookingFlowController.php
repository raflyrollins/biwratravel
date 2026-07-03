<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Payment;
use App\Models\Trip;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class BookingFlowController extends Controller
{
    public function index(Request $request)
    {
        $bookings = Booking::with([
            'trip.bus',
            'trip.route.originCity',
            'trip.route.destinationCity',
            'originCity',
            'destinationCity',
            'payments' => fn ($q) => $q->latest()->limit(1),
        ])
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->paginate(10)
            ->withQueryString();

        return Inertia::render('dashboard/customer/BookingsIndex', [
            'bookings' => $bookings,
        ]);
    }

    public function create(Trip $trip, Request $request)
    {
        $request->validate([
            'origin' => ['required', 'exists:cities,id'],
            'destination' => ['required', 'exists:cities,id'],
        ]);

        $trip->load(['bus', 'route.originCity', 'route.destinationCity', 'route.segments']);

        $route = $trip->route;
        $segments = $route->segments;

        $chain = [$route->origin_city_id];
        foreach ($segments as $seg) {
            $chain[] = $seg->destination_city_id;
        }

        $originIdx = array_search((int) $request->input('origin'), $chain, true);
        $destIdx = array_search((int) $request->input('destination'), $chain, true);

        abort_if($originIdx === false || $destIdx === false || $originIdx >= $destIdx, 422, 'Rute tidak valid');

        $price = 0;
        for ($i = $originIdx; $i < $destIdx; $i++) {
            $price += $segments[$i]->base_price;
        }

        $savedPassengers = $request->user()?->savedPassengers()->orderBy('name')->get() ?? collect();

        return Inertia::render('dashboard/customer/BookingCreate', [
            'trip' => $trip,
            'price_per_seat' => $price,
            'origin_id' => (int) $request->input('origin'),
            'destination_id' => (int) $request->input('destination'),
            'saved_passengers' => $savedPassengers,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'trip_id' => ['required', 'exists:trips,uuid'],
            'origin_id' => ['required', 'exists:cities,id'],
            'destination_id' => ['required', 'exists:cities,id'],
            'customer_name' => ['required', 'string', 'max:255'],
            'customer_phone' => ['nullable', 'string', 'max:20'],
            'customer_email' => ['nullable', 'email', 'max:255'],
            'passengers' => ['required', 'array', 'min:1'],
            'passengers.*.nik' => ['required', 'string', 'size:16'],
            'passengers.*.name' => ['required', 'string', 'max:255'],
            'passengers.*.gender' => ['required', Rule::in(['L', 'P'])],
            'passengers.*.birth_date' => ['required', 'date'],
        ]);

        $trip = Trip::with(['bus', 'route.segments'])->where('uuid', $validated['trip_id'])->firstOrFail();
        $route = $trip->route;

        $chain = [$route->origin_city_id];
        foreach ($route->segments as $seg) {
            $chain[] = $seg->destination_city_id;
        }

        $originIdx = array_search((int) $validated['origin_id'], $chain, true);
        $destIdx = array_search((int) $validated['destination_id'], $chain, true);

        abort_if($originIdx === false || $destIdx === false || $originIdx >= $destIdx, 422);

        $pricePerSeat = 0;
        for ($i = $originIdx; $i < $destIdx; $i++) {
            $pricePerSeat += $route->segments[$i]->base_price;
        }

        $totalPassengers = count($validated['passengers']);
        $totalPrice = $pricePerSeat * $totalPassengers;

        do {
            $bookingCode = 'BWR-'.now()->format('dmy').'-'.str_pad((string) random_int(0, 9999), 4, '0', STR_PAD_LEFT);
        } while (Booking::where('booking_code', $bookingCode)->exists());

        $booking = Booking::create([
            'booking_code' => $bookingCode,
            'user_id' => $request->user()?->id,
            'trip_id' => $trip->id,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
            'origin_city_id' => $validated['origin_id'],
            'destination_city_id' => $validated['destination_id'],
            'total_passengers' => $totalPassengers,
            'total_price' => $totalPrice,
            'status' => 'awaiting_payment',
            'source' => 'online',
        ]);

        foreach ($validated['passengers'] as $p) {
            $booking->passengers()->create([
                'nik' => $p['nik'],
                'name' => $p['name'],
                'gender' => $p['gender'],
                'birth_date' => $p['birth_date'],
            ]);

            if ($request->user()) {
                $request->user()->savedPassengers()->updateOrCreate(
                    ['nik' => $p['nik']],
                    [
                        'name' => $p['name'],
                        'gender' => $p['gender'],
                        'birth_date' => $p['birth_date'],
                    ],
                );
            }
        }

        return redirect()->route('dashboard.customer.booking.payment', $booking);
    }

    public function payment(Booking $booking)
    {
        $booking->load(['trip.bus', 'trip.route.originCity', 'trip.route.destinationCity', 'passengers', 'originCity', 'destinationCity']);

        $latestPayment = $booking->payments()->latest()->first();

        return Inertia::render('dashboard/customer/BookingPayment', [
            'booking' => $booking,
            'latest_payment' => $latestPayment,
            'deadline' => $booking->created_at->addMinutes(30)->toIso8601String(),
        ]);
    }

    public function uploadProof(Request $request, Booking $booking)
    {
        abort_if($booking->status !== 'awaiting_payment', 422, 'Booking tidak dalam status menunggu pembayaran');

        $validated = $request->validate([
            'proof_image' => ['required', 'image', 'mimes:jpg,jpeg,png', 'max:2048'],
        ]);

        $path = $validated['proof_image']->store('payments', 'public');

        Payment::create([
            'booking_id' => $booking->id,
            'amount' => $booking->total_price,
            'method' => 'transfer',
            'proof_image' => $path,
            'status' => 'pending',
        ]);

        return redirect()->route('dashboard.customer.booking.payment', $booking)
            ->with('success', 'Bukti pembayaran berhasil diunggah. Silakan tunggu verifikasi dari Admin Penjualan.');
    }

    public function cancel(Booking $booking)
    {
        abort_if($booking->user_id !== request()->user()?->id, 403);

        if (! in_array($booking->status, ['awaiting_payment', 'pending'], true)) {
            return redirect()->back()->with('info', 'Booking sudah tidak aktif.');
        }

        $booking->update(['status' => 'cancelled']);

        return redirect()->back()->with('success', 'Booking dibatalkan.');
    }
}
