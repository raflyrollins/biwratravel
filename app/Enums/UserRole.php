<?php

namespace App\Enums;

enum UserRole: string
{
    case Superadmin = 'superadmin';
    case AdminPenjualan = 'admin_penjualan';
    case AdminCharter = 'admin_charter';
    case Driver = 'driver';
    case PetugasLoket = 'petugas_loket';
    case Customer = 'customer';

    public function label(): string
    {
        return match ($this) {
            self::Superadmin => 'Superadmin',
            self::AdminPenjualan => 'Admin Penjualan',
            self::AdminCharter => 'Admin Charter',
            self::Driver => 'Driver',
            self::PetugasLoket => 'Petugas Loket',
            self::Customer => 'Customer',
        };
    }
}
