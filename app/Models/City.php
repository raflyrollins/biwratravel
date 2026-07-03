<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class City extends Model
{
    use HasUuid;

    protected $fillable = ['uuid', 'name', 'slug', 'is_active'];

    public function getRouteKeyName(): string
    {
        return 'uuid';
    }

    protected function casts(): array
    {
        return [
            'is_active' => 'boolean',
        ];
    }

    /** @return HasMany<Route, $this> */
    public function routesFrom(): HasMany
    {
        return $this->hasMany(Route::class, 'origin_city_id');
    }
}
