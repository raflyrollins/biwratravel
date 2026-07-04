<?php

namespace App\Http\Controllers;

use App\Models\Booking;

class PrintTicketController extends Controller
{
    public function show(Booking $booking)
    {
        $booking->load([
            'trip.bus',
            'trip.route.originCity',
            'trip.route.destinationCity',
            'trip.route.segments.originCity',
            'trip.route.segments.destinationCity',
            'originCity',
            'destinationCity',
            'passengers',
        ]);

        $route = $booking->trip->route;
        $chain = [$route->origin_city_id];
        foreach ($route->segments as $seg) {
            $chain[] = $seg->destination_city_id;
        }

        $originIdx = array_search($booking->origin_city_id, $chain, true);
        $destIdx = array_search($booking->destination_city_id, $chain, true);

        $relevantSegments = $route->segments
            ->filter(fn ($seg) => $seg->order > $originIdx && $seg->order <= $destIdx)
            ->sortBy('order')
            ->values();

        $passengers = $booking->passengers;

        return view('tickets.print', [
            'booking' => $booking,
            'trip' => $booking->trip,
            'bus' => $booking->trip->bus,
            'route' => $route,
            'segments' => $relevantSegments,
            'originCity' => $booking->originCity,
            'destinationCity' => $booking->destinationCity,
            'passengers' => $passengers,
        ]);
    }
}
