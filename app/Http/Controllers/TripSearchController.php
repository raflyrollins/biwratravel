<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Route;
use App\Models\Trip;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TripSearchController extends Controller
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

        return Inertia::render('dashboard/customer/Search', [
            'cities' => $cities,
            'grouped_results' => $groupedResults,
            'filters' => $request->only(['origin', 'destination', 'date']),
        ]);
    }
}
