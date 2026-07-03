import { Head, Link } from '@inertiajs/react';
import {
    Bus,
    CalendarDays,
    Clock,
    MapPin,
    Route,
    ShoppingBag,
    Timer,
    Users,
} from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface Trip {
    bus: { name: string; plate_number: string };
    route: { origin_city: { name: string }; destination_city: { name: string } };
    departure_date: string;
    departure_time: string;
}

interface PaymentSummary {
    id: number;
    status: string;
}

interface Booking {
    uuid: string;
    booking_code: string;
    total_passengers: number;
    total_price: number;
    status: string;
    created_at: string;
    trip: Trip;
    origin_city: { name: string };
    destination_city: { name: string };
    payments: PaymentSummary[];
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

function statusColor(status: string): string {
    return STATUS_COLORS[status] ?? 'bg-[var(--neutral-tertiary-soft)] text-[var(--body-subtle)]';
}

export default function BookingsIndex({ bookings }: BookingsIndexProps) {
    return (
        <DashboardLayout>
            <Head title="Pemesanan Saya" />

            <div className="mx-auto max-w-4xl">
                <h1 className="mb-6 text-xl font-bold text-[var(--heading)]">
                    Pemesanan Saya
                </h1>

                {bookings.data.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-16">
                        <ShoppingBag className="h-12 w-12 text-[var(--body-subtle)]" />
                        <p className="text-sm text-[var(--body-subtle)]">
                            Belum ada pemesanan.
                        </p>
                        <Link
                            href="/dashboard/customer/search"
                            className="text-sm font-medium text-[var(--fg-brand)] hover:underline"
                        >
                            Cari Tiket Sekarang
                        </Link>
                    </div>
                ) : (
                    <div className="space-y-4">
                        {bookings.data.map((booking) => {
                            const hasPendingPayment = booking.payments.some(
                                (p) => p.status === 'pending',
                            );
                            const effectiveStatus = hasPendingPayment
                                ? 'pending'
                                : booking.status;

                            return (
                                <Link
                                    key={booking.uuid}
                                    href={
                                        effectiveStatus === 'awaiting_payment'
                                            ? `/dashboard/customer/booking/${booking.uuid}/payment`
                                            : '#'
                                    }
                                    className="block rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4 transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                                >
                                    <div className="mb-3 flex items-start justify-between gap-2">
                                        <div>
                                            <p className="text-sm font-semibold text-[var(--body)]">
                                                {booking.booking_code}
                                            </p>
                                            <p className="text-xs text-[var(--body-subtle)]">
                                                {new Date(
                                                    booking.created_at,
                                                ).toLocaleDateString('id-ID', {
                                                    day: 'numeric',
                                                    month: 'long',
                                                    year: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })}
                                            </p>
                                        </div>
                                        <span
                                            className={`shrink-0 rounded-none px-2 py-0.5 text-xs font-medium ${statusColor(effectiveStatus)}`}
                                        >
                                            {STATUS_LABELS[effectiveStatus] ??
                                                booking.status}
                                        </span>
                                    </div>

                                    <div className="grid gap-x-6 gap-y-1 text-sm md:grid-cols-2">
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <Route className="h-3.5 w-3.5 shrink-0" />
                                            {booking.trip.route.origin_city.name}{' '}
                                            →{' '}
                                            {booking.trip.route.destination_city.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <Bus className="h-3.5 w-3.5 shrink-0" />
                                            {booking.trip.bus.name} (
                                            {booking.trip.bus.plate_number})
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <CalendarDays className="h-3.5 w-3.5 shrink-0" />
                                            {booking.trip.departure_date}
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <Clock className="h-3.5 w-3.5 shrink-0" />
                                            {booking.trip.departure_time}
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <MapPin className="h-3.5 w-3.5 shrink-0" />
                                            {booking.origin_city.name} →{' '}
                                            {booking.destination_city.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                                            <Users className="h-3.5 w-3.5 shrink-0" />
                                            {booking.total_passengers} penumpang
                                        </div>
                                    </div>

                                    {effectiveStatus === 'awaiting_payment' && (
                                        <div className="mt-3 flex items-center gap-1 text-xs text-[var(--fg-warning)]">
                                            <Timer className="h-3.5 w-3.5" />
                                            Lanjutkan pembayaran
                                        </div>
                                    )}
                                </Link>
                            );
                        })}

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
                                            className={`rounded-none px-3 py-1 text-sm transition-colors ${
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
                                            className="rounded-none px-3 py-1 text-sm text-[var(--body-subtle)]"
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
