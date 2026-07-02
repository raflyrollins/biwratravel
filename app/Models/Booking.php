<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Booking extends Model
{
    protected $fillable = [
        'booking_code',
        'user_id',
        'trip_id',
        'customer_name',
        'customer_phone',
        'customer_email',
        'origin_city_id',
        'destination_city_id',
        'total_passengers',
        'total_price',
        'status',
        'source',
        'notes',
    ];

    protected function casts(): array
    {
        return [
            'total_passengers' => 'integer',
            'total_price' => 'integer',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<Trip, $this> */
    public function trip(): BelongsTo
    {
        return $this->belongsTo(Trip::class);
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

    /** @return HasMany<Payment, $this> */
    public function payments(): HasMany
    {
        return $this->hasMany(Payment::class);
    }

    /** @return HasMany<BookingPassenger, $this> */
    public function passengers(): HasMany
    {
        return $this->hasMany(BookingPassenger::class);
    }
}
