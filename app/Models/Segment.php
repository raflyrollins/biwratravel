<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Segment extends Model
{
    protected $fillable = [
        'route_id',
        'origin_city_id',
        'destination_city_id',
        'order',
        'base_price',
        'distance_km',
    ];

    protected function casts(): array
    {
        return [
            'order' => 'integer',
            'base_price' => 'integer',
            'distance_km' => 'integer',
        ];
    }

    /** @return BelongsTo<Route, $this> */
    public function route(): BelongsTo
    {
        return $this->belongsTo(Route::class);
    }

    /** @return BelongsTo<City, $this> */
    public function originCity(): BelongsTo
    {
        return $this->belongsTo(City::class, 'origin_city_id');
    }

    /** @return BelongsTo<City, $this> */
    public function destinationCity(): BelongsTo
    {
        return $this->belongsTo(City::class, 'destination_city_id');
    }
}
