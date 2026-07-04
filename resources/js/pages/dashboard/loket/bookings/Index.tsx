import { Link, usePage } from '@inertiajs/react';
import { CalendarDays, Clock, Printer, ShoppingBag, Users } from 'lucide-react';
import { useEffect } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface Booking {
    uuid: string;
    booking_code: string;
    customer_name: string;
    total_passengers: number;
    total_price: number;
    created_at: string;
    trip: {
        departure_date: string;
        departure_time: string;
        bus: { name: string; plate_number: string };
        route: { name: string };
    };
    origin_city: { name: string };
    destination_city: { name: string };
}

interface BookingsIndexProps {
    bookings: {
        data: Booking[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    flash?: {
        print_url?: string;
    };
}

export default function LoketBookingsIndex({ bookings }: BookingsIndexProps) {
    const { flash } = usePage().props as { flash?: { print_url?: string } };

    useEffect(() => {
        if (flash?.print_url) {
            window.open(flash.print_url, '_blank');
        }
    }, [flash?.print_url]);
    return (
        <DashboardLayout title="Riwayat Penerbitan Tiket">
            <div className="mx-auto max-w-4xl">
                <h1 className="mb-2 text-xl font-bold text-[var(--heading)]">
                    Riwayat Penerbitan Tiket
                </h1>
                <p className="mb-6 text-sm text-[var(--body-subtle)]">
                    Tiket yang telah diterbitkan melalui loket.
                </p>

                {bookings.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-16">
                        <ShoppingBag className="h-12 w-12 text-[var(--body-subtle)]" />
                        <p className="text-sm text-[var(--body-subtle)]">
                            Belum ada tiket yang diterbitkan.
                        </p>
                        <Link
                            href="/dashboard/loket/booking/search"
                            className="text-sm font-medium text-[var(--fg-brand)] hover:underline"
                        >
                            Terbitkan Tiket Baru
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {bookings.data.map((booking) => (
                            <div
                                key={booking.uuid}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4"
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <div>
                                        <div className="flex items-center gap-2">
                                            <p className="font-mono text-sm font-semibold text-[var(--heading)]">
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
                                                className="cursor-pointer text-[var(--body-subtle)] transition-colors hover:text-[var(--fg-brand)]"
                                                title="Cetak Tiket"
                                            >
                                                <Printer className="h-4 w-4" />
                                            </button>
                                        </div>
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            {booking.customer_name}
                                        </p>
                                    </div>
                                    <span className="shrink-0 bg-[var(--success-soft)] px-2 py-0.5 text-xs font-medium text-[var(--fg-success-strong)]">
                                        Lunas
                                    </span>
                                </div>

                                <div className="grid gap-x-6 gap-y-1 text-sm md:grid-cols-3">
                                    <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                        <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                        {booking.trip.departure_date}
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                        <Clock className="h-3.5 w-3.5 shrink-0" />
                                        {booking.trip.departure_time}
                                    </div>
                                    <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                        <Users className="h-3.5 w-3.5 shrink-0" />
                                        {booking.total_passengers} penumpang
                                    </div>
                                </div>

                                <div className="mt-2 flex items-center justify-between">
                                    <p className="text-xs text-[var(--body-subtle)]">
                                        {booking.origin_city.name} &rarr;{' '}
                                        {booking.destination_city.name} &middot;{' '}
                                        {booking.trip.bus.name}
                                    </p>
                                    <p className="text-sm font-bold text-[var(--fg-brand)]">
                                        Rp{' '}
                                        {booking.total_price.toLocaleString('id-ID')}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {bookings.links.length > 3 && (
                            <div className="flex justify-center gap-1">
                                {bookings.links.map((link, i) => {
                                    const label = link.label
                                        .replace('&laquo;', '«')
                                        .replace('&raquo;', '»');
                                    return link.url ? (
                                        <Link
                                            key={i}
                                            href={link.url}
                                            className={`px-3 py-1 text-sm no-underline transition-colors ${
                                                link.active
                                                    ? 'bg-[var(--brand)] text-[var(--on-brand)]'
                                                    : 'bg-[var(--neutral-primary)] text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]'
                                            }`}
                                        >
                                            {label}
                                        </Link>
                                    ) : (
                                        <span
                                            key={i}
                                            className="px-3 py-1 text-sm text-[var(--body-subtle)]"
                                        >
                                            {label}
                                        </span>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
