<?php

namespace Database\Seeders;

use App\Enums\UserRole;
use App\Models\Bus;
use App\Models\City;
use App\Models\Route;
use App\Models\Segment;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        User::factory()->create([
            'name' => 'Superadmin',
            'email' => 'superadmin@biwratravel.com',
            'role' => UserRole::Superadmin,
        ]);

        User::factory()->create([
            'name' => 'Admin Penjualan',
            'email' => 'admin@biwratravel.com',
            'role' => UserRole::AdminPenjualan,
        ]);

        User::factory()->create([
            'name' => 'Admin Charter',
            'email' => 'charter@biwratravel.com',
            'role' => UserRole::AdminCharter,
        ]);

        User::factory()->create([
            'name' => 'Driver Budi',
            'email' => 'driver@biwratravel.com',
            'role' => UserRole::Driver,
        ]);

        User::factory()->create([
            'name' => 'Petugas Loket',
            'email' => 'loket@biwratravel.com',
            'role' => UserRole::PetugasLoket,
        ]);

        User::factory()->create([
            'name' => 'Customer',
            'email' => 'customer@biwratravel.com',
            'role' => UserRole::Customer,
        ]);

        // ── Seed sample cities ──
        $medan = City::create(['name' => 'Medan', 'slug' => 'medan']);
        $binjai = City::create(['name' => 'Binjai', 'slug' => 'binjai']);
        $stabat = City::create(['name' => 'Stabat', 'slug' => 'stabat']);
        $tanjungPura = City::create(['name' => 'Tanjung Pura', 'slug' => 'tanjung-pura']);
        $langkat = City::create(['name' => 'Langkat', 'slug' => 'langkat']);
        $kualanamu = City::create(['name' => 'Kualanamu', 'slug' => 'kualanamu']);
        $tebingTinggi = City::create(['name' => 'Tebing Tinggi', 'slug' => 'tebing-tinggi']);
        $kisaran = City::create(['name' => 'Kisaran', 'slug' => 'kisaran']);

        // ── Seed sample buses ──
        $busA = Bus::create(['plate_number' => 'BK 1234 AB', 'name' => 'Budi Jaya', 'capacity' => 60]);
        $busB = Bus::create(['plate_number' => 'BK 5678 CD', 'name' => 'Sinar Mulia', 'capacity' => 50]);

        // ── Seed route Medan → Tanjung Pura ──
        $route1 = Route::create([
            'bus_id' => $busA->id,
            'name' => 'Medan – Tanjung Pura',
            'origin_city_id' => $medan->id,
            'destination_city_id' => $tanjungPura->id,
        ]);

        Segment::create(['route_id' => $route1->id, 'origin_city_id' => $medan->id, 'destination_city_id' => $binjai->id, 'order' => 1, 'base_price' => 15000]);
        Segment::create(['route_id' => $route1->id, 'origin_city_id' => $binjai->id, 'destination_city_id' => $stabat->id, 'order' => 2, 'base_price' => 12000]);
        Segment::create(['route_id' => $route1->id, 'origin_city_id' => $stabat->id, 'destination_city_id' => $tanjungPura->id, 'order' => 3, 'base_price' => 10000]);

        // ── Seed route Medan → Kisaran ──
        $route2 = Route::create([
            'bus_id' => $busB->id,
            'name' => 'Medan – Kisaran',
            'origin_city_id' => $medan->id,
            'destination_city_id' => $kisaran->id,
        ]);

        Segment::create(['route_id' => $route2->id, 'origin_city_id' => $medan->id, 'destination_city_id' => $kualanamu->id, 'order' => 1, 'base_price' => 20000]);
        Segment::create(['route_id' => $route2->id, 'origin_city_id' => $kualanamu->id, 'destination_city_id' => $tebingTinggi->id, 'order' => 2, 'base_price' => 25000]);
        Segment::create(['route_id' => $route2->id, 'origin_city_id' => $tebingTinggi->id, 'destination_city_id' => $kisaran->id, 'order' => 3, 'base_price' => 18000]);
    }
}
