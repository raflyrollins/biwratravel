<?php

namespace App\Console\Commands;

use App\Models\Booking;
use Illuminate\Console\Command;

class CancelExpiredBookings extends Command
{
    protected $signature = 'bookings:cancel-expired';

    protected $description = 'Cancel bookings that have passed the 30-minute payment deadline';

    public function handle(): int
    {
        $count = Booking::where('status', 'awaiting_payment')
            ->where('created_at', '<=', now()->subMinutes(30))
            ->update(['status' => 'cancelled']);

        $this->info("{$count} expired booking(s) cancelled.");

        return self::SUCCESS;
    }
}
