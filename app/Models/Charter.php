<?php

namespace App\Models;

use App\Models\Concerns\HasUuid;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Charter extends Model
{
    use HasUuid;

    protected $fillable = [
        'uuid',
        'user_id',
        'charter_code',
        'customer_name',
        'customer_phone',
        'customer_email',
        'start_date',
        'end_date',
        'estimated_passengers',
        'estimated_buses',
        'custom_route',
        'additional_info',
        'status',
        'reviewed_by',
        'reviewed_at',
        'quoted_price',
        'quoted_notes',
    ];

    protected function casts(): array
    {
        return [
            'start_date' => 'date:Y-m-d',
            'end_date' => 'date:Y-m-d',
            'estimated_passengers' => 'integer',
            'estimated_buses' => 'integer',
            'quoted_price' => 'integer',
            'reviewed_at' => 'datetime',
        ];
    }

    /** @return BelongsTo<User, $this> */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /** @return BelongsTo<User, $this> */
    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }
}
