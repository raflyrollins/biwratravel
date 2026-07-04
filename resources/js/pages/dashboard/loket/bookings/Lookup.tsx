import { router } from '@inertiajs/react';
import { CalendarDays, Clock, Printer, Search, Ticket, Users } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface Passenger {
    id: number;
    nik: string | null;
    name: string;
    gender: string | null;
    birth_date: string | null;
}

interface Trip {
    departure_date: string;
    departure_time: string;
    estimated_arrival: string | null;
    bus: { name: string; plate_number: string };
    route: { name: string };
}

interface BookingDetail {
    uuid: string;
    booking_code: string;
    customer_name: string;
    customer_phone: string | null;
    total_passengers: number;
    total_price: number;
    status: string;
    created_at: string;
    trip: Trip;
    origin_city: { name: string };
    destination_city: { name: string };
    passengers: Passenger[];
}

interface LookupProps {
    booking: BookingDetail | null;
    code: string;
}

const STATUS_LABELS: Record<string, string> = {
    awaiting_payment: 'Menunggu Pembayaran',
    pending: 'Pembayaran Diproses',
    confirmed: 'Dikonfirmasi',
    cancelled: 'Dibatalkan',
    expired: 'Kadaluwarsa',
};

const STATUS_COLORS: Record<string, string> = {
    awaiting_payment: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    pending: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    confirmed: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    cancelled: 'bg-[var(--danger-soft)] text-[var(--fg-danger)]',
    expired: 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]',
};

function formatPrice(amount: number) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function LoketBookingLookup({ booking, code }: LookupProps) {
    const [searchCode, setSearchCode] = useState(code);

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get(
            '/dashboard/loket/booking/lookup',
            { code: searchCode },
            { preserveState: true },
        );
    }

    return (
        <DashboardLayout title="Cari Booking">
            <div className="mx-auto max-w-2xl">
                <h1 className="mb-2 text-xl font-bold text-[var(--heading)]">
                    Cari Booking
                </h1>
                <p className="mb-6 text-sm text-[var(--body-subtle)]">
                    Masukkan kode booking untuk mencari data pemesanan
                    dan mencetak tiket.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mb-8 flex gap-3"
                >
                    <div className="flex-1">
                        <input
                            type="text"
                            value={searchCode}
                            onChange={(e) => setSearchCode(e.target.value)}
                            placeholder="Masukkan kode booking (contoh: BWR-040726-0001)"
                            className="block w-full border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)]"
                        />
                    </div>
                    <Button type="submit" variant="brand" size="default">
                        <Search className="h-4 w-4" />
                        Cari
                    </Button>
                </form>

                {booking === null && code && (
                    <div className="flex flex-col items-center gap-3 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-16">
                        <Ticket className="h-12 w-12 text-[var(--body-subtle)]" />
                        <p className="text-sm text-[var(--body-subtle)]">
                            Booking tidak ditemukan.
                        </p>
                    </div>
                )}

                {booking && (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                        <div className="border-b border-[var(--border-default)] p-4">
                            <div className="flex items-start justify-between gap-2">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <p className="font-mono text-lg font-bold text-[var(--heading)]">
                                            {booking.booking_code}
                                        </p>
                                        <button
                                            type="button"
                                            onClick={() =>
                                                window.open(
                                                    `/dashboard/booking/${booking.uuid}/print`,
                                                    '_blank',
                                                )
                                            }
                                            className="cursor-pointer text-[var(--fg-brand)] transition-colors hover:text-[var(--brand-strong)]"
                                            title="Cetak Tiket"
                                        >
                                            <Printer className="h-5 w-5" />
                                        </button>
                                    </div>
                                    <p className="text-sm text-[var(--body-subtle)]">
                                        {booking.customer_name}
                                        {booking.customer_phone && ` — ${booking.customer_phone}`}
                                    </p>
                                </div>
                                <span
                                    className={`shrink-0 px-2 py-0.5 text-xs font-medium ${
                                        STATUS_COLORS[booking.status] ??
                                        'bg-[var(--neutral-tertiary-soft)] text-[var(--body)]'
                                    }`}
                                >
                                    {STATUS_LABELS[booking.status] ??
                                        booking.status}
                                </span>
                            </div>
                        </div>

                        <div className="grid gap-x-6 gap-y-2 p-4 text-sm md:grid-cols-2">
                            <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                <CalendarDays className="h-4 w-4 shrink-0" />
                                {booking.trip.departure_date}
                            </div>
                            <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                <Clock className="h-4 w-4 shrink-0" />
                                {booking.trip.departure_time}
                                {booking.trip.estimated_arrival &&
                                    ` - ${booking.trip.estimated_arrival}`}
                            </div>
                            <div className="flex items-center gap-2 text-[var(--body-subtle)] md:col-span-2">
                                <span className="font-medium text-[var(--heading)]">Rute:</span>
                                {booking.origin_city.name} &rarr;{' '}
                                {booking.destination_city.name}
                            </div>
                            <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                <span className="font-medium text-[var(--heading)]">Armada:</span>
                                {booking.trip.bus.name} ({booking.trip.bus.plate_number})
                            </div>
                            <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                <Users className="h-4 w-4 shrink-0" />
                                {booking.total_passengers} penumpang
                            </div>
                        </div>

                        <div className="border-t border-[var(--border-default)] p-4">
                            <h3 className="mb-3 text-sm font-bold text-[var(--heading)]">
                                Data Penumpang
                            </h3>
                            {booking.passengers.length > 0 && (
                                <div className="overflow-x-auto">
                                    <table className="w-full text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                                                <th className="px-3 py-2 font-medium text-[var(--body)]">
                                                    NIK
                                                </th>
                                                <th className="px-3 py-2 font-medium text-[var(--body)]">
                                                    Nama
                                                </th>
                                                <th className="px-3 py-2 font-medium text-[var(--body)]">
                                                    JK
                                                </th>
                                                <th className="px-3 py-2 font-medium text-[var(--body)]">
                                                    Tgl Lahir
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {booking.passengers.map((p) => (
                                                <tr
                                                    key={p.id}
                                                    className="border-b border-[var(--border-default)]"
                                                >
                                                    <td className="px-3 py-2.5 font-mono text-xs text-[var(--body)]">
                                                        {p.nik ?? '-'}
                                                    </td>
                                                    <td className="px-3 py-2.5 font-medium text-[var(--heading)]">
                                                        {p.name}
                                                    </td>
                                                    <td className="px-3 py-2.5 text-[var(--body)]">
                                                        {p.gender === 'L'
                                                            ? 'L'
                                                            : 'P'}
                                                    </td>
                                                    <td className="px-3 py-2.5 text-[var(--body)]">
                                                        {p.birth_date
                                                            ? new Date(p.birth_date).toLocaleDateString('id-ID', {
                                                                  year: 'numeric',
                                                                  month: 'long',
                                                                  day: 'numeric',
                                                              })
                                                            : '-'}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center justify-between border-t border-[var(--border-default)] p-4">
                            <p className="text-sm text-[var(--body-subtle)]">
                                {booking.total_passengers} penumpang
                            </p>
                            <p className="text-base font-bold text-[var(--heading)]">
                                {formatPrice(booking.total_price)}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
