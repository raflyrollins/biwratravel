<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use App\Models\Route;
use App\Models\Trip;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TripController extends Controller
{
    public function index()
    {
        $trips = Trip::with(['route.bus', 'bus'])
            ->orderBy('departure_date', 'desc')
            ->orderBy('departure_time')
            ->paginate(20);

        return Inertia::render('dashboard/trips/Index', [
            'trips' => $trips,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/trips/Form', [
            'routes' => Route::with(['bus', 'originCity', 'destinationCity'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'bus_id']),
            'buses' => Bus::where('is_active', true)->get(['id', 'name', 'plate_number']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'route_id' => ['required', 'exists:routes,id'],
            'bus_id' => ['required', 'exists:buses,id'],
            'departure_date' => ['required', 'date'],
            'departure_time' => ['required', 'string'],
            'estimated_arrival' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        Trip::create($validated);

        return redirect()->route('dashboard.trips.index')
            ->with('success', 'Jadwal berhasil ditambahkan.');
    }

    public function edit(Trip $trip)
    {
        return Inertia::render('dashboard/trips/Form', [
            'trip' => $trip,
            'routes' => Route::with(['bus', 'originCity', 'destinationCity'])
                ->where('is_active', true)
                ->orderBy('name')
                ->get(['id', 'name', 'bus_id']),
            'buses' => Bus::where('is_active', true)->get(['id', 'name', 'plate_number']),
        ]);
    }

    public function update(Request $request, Trip $trip): RedirectResponse
    {
        $validated = $request->validate([
            'route_id' => ['required', 'exists:routes,id'],
            'bus_id' => ['required', 'exists:buses,id'],
            'departure_date' => ['required', 'date'],
            'departure_time' => ['required', 'string'],
            'estimated_arrival' => ['nullable', 'string'],
            'is_active' => ['boolean'],
        ]);

        $trip->update($validated);

        return redirect()->route('dashboard.trips.index')
            ->with('success', 'Jadwal berhasil diperbarui.');
    }

    public function destroy(Trip $trip): RedirectResponse
    {
        $trip->delete();

        return redirect()->route('dashboard.trips.index')
            ->with('success', 'Jadwal berhasil dihapus.');
    }
}
