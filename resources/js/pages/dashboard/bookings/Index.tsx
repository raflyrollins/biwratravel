import { Link, router } from '@inertiajs/react';
import { Eye, Filter, X } from 'lucide-react';
import { useState } from 'react';

import DatePicker from '@/components/DatePicker';
import DashboardLayout from '@/components/DashboardLayout';

interface Booking {
    id: number;
    uuid: string;
    booking_code: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    total_passengers: number;
    total_price: number;
    status: string;
    source: string;
    created_at: string;
    trip: {
        id: number;
        departure_date: string;
        departure_time: string;
        route: { name: string; bus: { name: string } };
        bus: { name: string; plate_number: string };
    };
    origin_city: { id: number; name: string };
    destination_city: { id: number; name: string };
    user: { id: number; name: string } | null;
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
    filters: {
        status?: string;
        source?: string;
        date_from?: string;
        date_to?: string;
    };
}

const STATUS_LABELS: Record<string, string> = {
    awaiting_payment: 'Menunggu Pembayaran',
    confirmed: 'Dikonfirmasi',
    expired: 'Kadaluwarsa',
};

const STATUS_COLORS: Record<string, string> = {
    awaiting_payment: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    confirmed: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    expired: 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]',
};

const SOURCE_LABELS: Record<string, string> = {
    online: 'Online',
    offline: 'Loket',
};

function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function BookingsIndex({ bookings, filters }: BookingsIndexProps) {
    const [showFilters, setShowFilters] = useState(
        Boolean(filters.status || filters.source || filters.date_from || filters.date_to),
    );
    const [status, setStatus] = useState(filters.status ?? '');
    const [source, setSource] = useState(filters.source ?? '');
    const [dateFrom, setDateFrom] = useState(filters.date_from ?? '');
    const [dateTo, setDateTo] = useState(filters.date_to ?? '');

    function applyFilters() {
        const params: Record<string, string> = {};

        if (status) {
params.status = status;
}

        if (source) {
params.source = source;
}

        if (dateFrom) {
params.date_from = dateFrom;
}

        if (dateTo) {
params.date_to = dateTo;
}

        router.get('/dashboard/bookings', params, { preserveState: true });
    }

    function resetFilters() {
        setStatus('');
        setSource('');
        setDateFrom('');
        setDateTo('');
        router.get('/dashboard/bookings', {}, { preserveState: true });
    }

    return (
        <DashboardLayout title="Booking">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Booking
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola data pemesanan tiket.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={() => setShowFilters(!showFilters)}
                    className="inline-flex cursor-pointer items-center gap-2 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3 text-sm font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                >
                    <Filter size={16} />
                    Filter
                </button>
            </div>

            {showFilters && (
                <div className="mb-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                    <div className="flex flex-wrap gap-4">
                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[var(--body-subtle)]">
                                Status
                            </label>
                            <select
                                value={status}
                                onChange={(e) => setStatus(e.target.value)}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                            >
                                <option value="">Semua Status</option>
                                {Object.entries(STATUS_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[var(--body-subtle)]">
                                Sumber
                            </label>
                            <select
                                value={source}
                                onChange={(e) => setSource(e.target.value)}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-3 py-2 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                            >
                                <option value="">Semua Sumber</option>
                                {Object.entries(SOURCE_LABELS).map(([key, label]) => (
                                    <option key={key} value={key}>
                                        {label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[var(--body-subtle)]">
                                Dari Tanggal
                            </label>
                            <DatePicker
                                value={dateFrom}
                                onChange={(v) => setDateFrom(v)}
                                placeholder="Pilih tanggal"
                            />
                        </div>

                        <div className="flex flex-col gap-1.5">
                            <label className="text-xs font-medium text-[var(--body-subtle)]">
                                Sampai Tanggal
                            </label>
                            <DatePicker
                                value={dateTo}
                                onChange={(v) => setDateTo(v)}
                                placeholder="Pilih tanggal"
                            />
                        </div>
                    </div>

                    <div className="mt-4 flex gap-2">
                        <button
                            type="button"
                            onClick={applyFilters}
                            className="cursor-pointer bg-[var(--brand)] px-4 py-2 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                        >
                            Terapkan Filter
                        </button>
                        <button
                            type="button"
                            onClick={resetFilters}
                            className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] px-4 py-2 text-sm font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                        >
                            <X size={14} />
                            Reset
                        </button>
                    </div>
                </div>
            )}

            <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Kode
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Customer
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Trip
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Rute
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Penumpang
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Total
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Status
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Sumber
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={9}
                                    className="px-6 py-12 text-center text-[var(--body-subtle)]"
                                >
                                    Belum ada booking.
                                </td>
                            </tr>
                        )}
                        {bookings.data.map((booking) => (
                            <tr
                                key={booking.id}
                                className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                            >
                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                    {booking.booking_code}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    <div>{booking.customer_name}</div>
                                    {booking.customer_phone && (
                                        <div className="text-xs text-[var(--body-subtle)]">
                                            {booking.customer_phone}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    <div>{booking.trip?.route?.name ?? '-'}</div>
                                    <div className="text-xs text-[var(--body-subtle)]">
                                        {booking.trip?.departure_date}{' '}
                                        {booking.trip?.departure_time}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[var(--body)]">
                                    {booking.origin_city?.name} &rarr;{' '}
                                    {booking.destination_city?.name}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {booking.total_passengers}
                                </td>
                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                    Rp {booking.total_price.toLocaleString('id-ID')}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={classNames(
                                            'inline-block px-2 py-0.5 text-xs font-medium',
                                            STATUS_COLORS[booking.status] ??
                                                'bg-[var(--neutral-tertiary-soft)] text-[var(--body)]',
                                        )}
                                    >
                                        {STATUS_LABELS[booking.status] ?? booking.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--body-subtle)]">
                                    {SOURCE_LABELS[booking.source] ?? booking.source}
                                </td>
                                <td className="px-6 py-4">
                                    <Link
                                        href={`/dashboard/bookings/${booking.uuid}`}
                                        className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                    >
                                        <Eye size={14} />
                                        Detail
                                    </Link>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {bookings.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {bookings.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={classNames(
                                'inline-flex items-center justify-center border px-3 py-2 text-sm no-underline transition-colors',
                                link.active
                                    ? 'border-[var(--brand)] bg-[var(--brand-softer)] text-[var(--fg-brand)]'
                                    : 'border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]',
                                !link.url && 'pointer-events-none opacity-50',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
