<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use App\Models\City;
use App\Models\Route;
use App\Models\Segment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class RouteController extends Controller
{
    public function index()
    {
        $routes = Route::with(['bus:id,name,plate_number', 'originCity', 'destinationCity', 'segments'])
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('dashboard/routes/Index', [
            'routes' => $routes,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/routes/Form', [
            'buses' => Bus::where('is_active', true)->get(['id', 'name', 'plate_number']),
            'cities' => City::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'bus_id' => ['required', 'exists:buses,id'],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'segments' => ['required', 'array', 'min:1'],
            'segments.*.origin_city_id' => ['required', 'exists:cities,id'],
            'segments.*.destination_city_id' => ['required', 'exists:cities,id'],
            'segments.*.order' => ['required', 'integer', 'min:1'],
            'segments.*.base_price' => ['required', 'integer', 'min:0'],
            'segments.*.distance_km' => ['nullable', 'integer', 'min:0'],
        ]);

        $segments = collect($validated['segments'])->sortBy('order');

        $route = Route::create([
            'bus_id' => $validated['bus_id'],
            'name' => $validated['name'],
            'origin_city_id' => $segments->first()['origin_city_id'],
            'destination_city_id' => $segments->last()['destination_city_id'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        foreach ($validated['segments'] as $segmentData) {
            $route->segments()->create($segmentData);
        }

        return redirect()->route('dashboard.routes.index')
            ->with('success', 'Rute berhasil ditambahkan.');
    }

    public function edit(Route $route)
    {
        $route->load('segments');

        return Inertia::render('dashboard/routes/Form', [
            'route' => $route,
            'buses' => Bus::where('is_active', true)->get(['id', 'name', 'plate_number']),
            'cities' => City::where('is_active', true)->orderBy('name')->get(['id', 'name']),
        ]);
    }

    public function update(Request $request, Route $route): RedirectResponse
    {
        $validated = $request->validate([
            'bus_id' => ['required', 'exists:buses,id'],
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
            'segments' => ['required', 'array', 'min:1'],
            'segments.*.id' => ['nullable', 'exists:segments,id'],
            'segments.*.origin_city_id' => ['required', 'exists:cities,id'],
            'segments.*.destination_city_id' => ['required', 'exists:cities,id'],
            'segments.*.order' => ['required', 'integer', 'min:1'],
            'segments.*.base_price' => ['required', 'integer', 'min:0'],
            'segments.*.distance_km' => ['nullable', 'integer', 'min:0'],
        ]);

        $segments = collect($validated['segments'])->sortBy('order');

        $route->update([
            'bus_id' => $validated['bus_id'],
            'name' => $validated['name'],
            'origin_city_id' => $segments->first()['origin_city_id'],
            'destination_city_id' => $segments->last()['destination_city_id'],
            'is_active' => $validated['is_active'] ?? true,
        ]);

        $existingIds = $route->segments()->pluck('id')->toArray();
        $incomingIds = [];

        foreach ($validated['segments'] as $segmentData) {
            if (isset($segmentData['id'])) {
                Segment::where('id', $segmentData['id'])->update($segmentData);
                $incomingIds[] = $segmentData['id'];
            } else {
                $segment = $route->segments()->create($segmentData);
                $incomingIds[] = $segment->id;
            }
        }

        Segment::whereIn('id', $existingIds)->whereNotIn('id', $incomingIds)->delete();

        return redirect()->route('dashboard.routes.index')
            ->with('success', 'Rute berhasil diperbarui.');
    }

    public function destroy(Route $route): RedirectResponse
    {
        $route->delete();

        return redirect()->route('dashboard.routes.index')
            ->with('success', 'Rute berhasil dihapus.');
    }
}
