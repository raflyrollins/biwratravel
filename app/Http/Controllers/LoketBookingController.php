<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\BookingPassenger;
use App\Models\City;
use App\Models\Payment;
use App\Models\Route;
use App\Models\Trip;
use Carbon\Carbon;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class LoketBookingController extends Controller
{
    public function search(Request $request)
    {
        $request->validate([
            'origin' => 'nullable|exists:cities,id',
            'destination' => 'nullable|exists:cities,id',
            'date' => 'nullable|date',
        ]);

        $cities = City::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        $groupedResults = [];

        if ($request->filled(['origin', 'destination', 'date'])) {
            $originId = (int) $request->input('origin');
            $destinationId = (int) $request->input('destination');
            $startDate = $request->input('date');
            $endDate = date('Y-m-t', strtotime($startDate));

            $allRoutes = Route::with('segments')
                ->where('is_active', true)
                ->get();

            $validRouteIds = [];
            $segmentsMap = [];

            foreach ($allRoutes as $route) {
                $segments = $route->segments;
                $chain = [$route->origin_city_id];
                foreach ($segments as $seg) {
                    $chain[] = $seg->destination_city_id;
                }

                $originIdx = array_search($originId, $chain, true);
                $destIdx = array_search($destinationId, $chain, true);

                if ($originIdx !== false && $destIdx !== false && $originIdx < $destIdx) {
                    $validRouteIds[] = $route->id;

                    $price = 0;
                    for ($i = $originIdx; $i < $destIdx; $i++) {
                        $price += $segments[$i]->base_price;
                    }

                    $segmentsMap[$route->id] = [
                        'price' => $price,
                        'origin_idx' => $originIdx,
                        'dest_idx' => $destIdx,
                    ];
                }
            }

            if (! empty($validRouteIds)) {
                $trips = Trip::with(['bus', 'route.originCity', 'route.destinationCity'])
                    ->whereIn('route_id', $validRouteIds)
                    ->whereBetween('departure_date', [$startDate, $endDate])
                    ->where('is_active', true)
                    ->orderBy('departure_date')
                    ->orderBy('departure_time')
                    ->get();

                foreach ($trips as $trip) {
                    $confirmedPassengers = $trip->bookings()
                        ->where('status', 'confirmed')
                        ->sum('total_passengers');

                    $available = $trip->bus->capacity - $confirmedPassengers;

                    if ($available <= 0) {
                        continue;
                    }

                    $routeData = $segmentsMap[$trip->route_id];
                    $date = $trip->departure_date->format('Y-m-d'); // @phpstan-ignore-line

                    $groupedResults[$date][] = [
                        'uuid' => $trip->uuid,
                        'route_name' => $trip->route->name,
                        'bus_name' => $trip->bus->name,
                        'plate_number' => $trip->bus->plate_number,
                        'departure_time' => $trip->departure_time,
                        'estimated_arrival' => $trip->estimated_arrival,
                        'price' => $routeData['price'],
                        'available_seats' => $available,
                        'capacity' => $trip->bus->capacity,
                        'origin_id' => $originId,
                        'destination_id' => $destinationId,
                    ];
                }
            }
        }

        return Inertia::render('dashboard/loket/bookings/Search', [
            'cities' => $cities,
            'grouped_results' => $groupedResults,
            'filters' => $request->only(['origin', 'destination', 'date']),
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

        return Inertia::render('dashboard/loket/bookings/Create', [
            'trip' => $trip,
            'price_per_seat' => $price,
            'origin_id' => (int) $request->input('origin'),
            'destination_id' => (int) $request->input('destination'),
        ]);
    }

    public function store(Request $request): RedirectResponse
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
        ], [
            'passengers.required' => 'Minimal satu penumpang harus diisi.',
            'passengers.min' => 'Minimal satu penumpang harus diisi.',
            'passengers.*.nik.required' => 'NIK penumpang wajib diisi.',
            'passengers.*.nik.size' => 'NIK harus 16 digit.',
            'passengers.*.name.required' => 'Nama penumpang wajib diisi.',
            'passengers.*.gender.required' => 'Jenis kelamin penumpang wajib dipilih.',
            'passengers.*.gender.in' => 'Jenis kelamin tidak valid.',
            'passengers.*.birth_date.required' => 'Tanggal lahir penumpang wajib diisi.',
            'passengers.*.birth_date.date' => 'Format tanggal lahir tidak valid.',
        ]);

        $trip = Trip::with(['bus', 'route.segments'])->where('uuid', $validated['trip_id'])->firstOrFail();
        $user = $request->user();
        $loket = $user->loket;

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
            'user_id' => $user->id,
            'trip_id' => $trip->id,
            'loket_id' => $loket?->id,
            'customer_name' => $validated['customer_name'],
            'customer_phone' => $validated['customer_phone'],
            'customer_email' => $validated['customer_email'],
            'origin_city_id' => $validated['origin_id'],
            'destination_city_id' => $validated['destination_id'],
            'total_passengers' => $totalPassengers,
            'total_price' => $totalPrice,
            'status' => 'confirmed',
            'source' => 'offline',
        ]);

        foreach ($validated['passengers'] as $p) {
            $birthDate = Carbon::parse($p['birth_date'])->format('Y-m-d');

            $booking->passengers()->create([
                'nik' => $p['nik'],
                'name' => $p['name'],
                'gender' => $p['gender'],
                'birth_date' => $birthDate,
            ]);
        }

        Payment::create([
            'booking_id' => $booking->id,
            'amount' => $totalPrice,
            'method' => 'tunai',
            'status' => 'approved',
            'validated_by' => $user->id,
            'validated_at' => now(),
        ]);

        return redirect()->route('dashboard.loket.bookings')
            ->with('success', "Tiket berhasil diterbitkan. Kode booking: {$booking->booking_code}")
            ->with('print_url', "/dashboard/booking/{$booking->uuid}/print");
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $loket = $user->loket;

        $bookings = Booking::with([
            'trip.bus',
            'trip.route.originCity',
            'trip.route.destinationCity',
            'originCity',
            'destinationCity',
        ])
            ->when($loket, fn ($q) => $q->where('loket_id', $loket->id))
            ->orWhere(fn ($q) => $q->whereNull('loket_id')->where('user_id', $user->id))
            ->orderBy('created_at', 'desc')
            ->paginate(20)
            ->withQueryString();

        return Inertia::render('dashboard/loket/bookings/Index', [
            'bookings' => $bookings,
        ]);
    }

    public function lookup(Request $request)
    {
        $request->validate([
            'code' => 'nullable|string|max:20',
        ]);

        $booking = null;

        if ($request->filled('code')) {
            $booking = Booking::with([
                'trip.bus',
                'trip.route.originCity',
                'trip.route.destinationCity',
                'originCity',
                'destinationCity',
                'passengers',
            ])
                ->where('booking_code', $request->input('code'))
                ->first();
        }

        return Inertia::render('dashboard/loket/bookings/Lookup', [
            'booking' => $booking,
            'code' => $request->input('code', ''),
        ]);
    }

    public function lookupPassenger(string $nik)
    {
        $passenger = BookingPassenger::where('nik', $nik)
            ->select('nik', 'name', 'gender', 'birth_date')
            ->latest()
            ->first();

        return response()->json($passenger ? [
            'found' => true,
            'nik' => $passenger->nik,
            'name' => $passenger->name,
            'gender' => $passenger->gender,
            'birth_date' => $passenger->birth_date->format('Y-m-d'), // @phpstan-ignore-line
        ] : [
            'found' => false,
        ]);
    }
}
