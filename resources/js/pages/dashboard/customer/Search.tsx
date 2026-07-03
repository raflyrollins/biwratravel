import { Head, Link, router, usePage } from '@inertiajs/react';
import { Bus, Clock, MapPin, Route, Search as SearchIcon, Users } from 'lucide-react';
import { type FormEvent, useEffect, useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/DatePicker';

interface City {
    id: number;
    name: string;
}

interface TripResult {
    uuid: string;
    route_name: string;
    bus_name: string;
    plate_number: string;
    departure_time: string;
    estimated_arrival: string | null;
    price: number;
    available_seats: number;
    capacity: number;
    origin_id: number;
    destination_id: number;
}

interface CustomerSearchProps {
    cities: City[];
    grouped_results: Record<string, TripResult[]>;
    filters: { origin?: string; destination?: string; date?: string };
}

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatDateLabel(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

function formatTabLabel(dateStr: string, count: number): string {
    const d = new Date(dateStr + 'T00:00:00');
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(d);
    target.setHours(0, 0, 0, 0);
    const diff = Math.round((target.getTime() - today.getTime()) / 86400000);

    let prefix = '';
    if (diff === 0) prefix = 'Hari Ini';
    else if (diff === 1) prefix = 'Besok';
    else if (diff === -1) prefix = 'Kemarin';
    else prefix = formatDateLabel(dateStr);

    return `${prefix} (${count})`;
}

export default function CustomerSearch({
    cities,
    grouped_results,
    filters,
}: CustomerSearchProps) {
    const { auth } = usePage().props as { auth: { user: { name: string } } };
    const [origin, setOrigin] = useState(filters.origin ?? '');
    const [destination, setDestination] = useState(filters.destination ?? '');
    const [date, setDate] = useState(filters.date ?? '');
    const [activeTab, setActiveTab] = useState('');

    const dateKeys = Object.keys(grouped_results).sort();

    function handleSearch(e: FormEvent) {
        e.preventDefault();
        router.get(
            '/dashboard/customer/search',
            { origin, destination, date },
            { preserveState: true },
        );
    }

    useEffect(() => {
        if (dateKeys.length > 0 && !activeTab) {
            setActiveTab(dateKeys[0]);
        }
    }, [dateKeys.length, activeTab, dateKeys]);

    const activeResults = activeTab ? grouped_results[activeTab] ?? [] : [];

    return (
        <DashboardLayout>
            <Head title="Cari Tiket" />

            <div className="mx-auto max-w-4xl">
                <h1 className="mb-2 text-xl font-bold text-[var(--heading)]">
                    Cari Tiket Bus
                </h1>
                <p className="mb-6 text-sm text-[var(--body-subtle)]">
                    Cari jadwal bus berdasarkan kota asal, tujuan, dan tanggal
                    keberangkatan.
                </p>

                <form
                    onSubmit={handleSearch}
                    className="mb-8 flex flex-wrap items-end gap-3 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4"
                >
                    <div className="min-w-44 flex-1">
                        <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                            Kota Asal
                        </label>
                        <select
                            value={origin}
                            onChange={(e) => setOrigin(e.target.value)}
                            className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                        >
                            <option value="">Pilih kota asal</option>
                            {cities.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="min-w-44 flex-1">
                        <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                            Kota Tujuan
                        </label>
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                        >
                            <option value="">Pilih kota tujuan</option>
                            {cities.map((c) => (
                                <option key={c.id} value={c.id}>
                                    {c.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="w-44">
                        <DatePicker
                            value={date}
                            onChange={(v) => setDate(v)}
                            placeholder="Pilih tanggal"
                        />
                    </div>

                    <Button type="submit" variant="brand" size="default" className="h-10">
                        <SearchIcon className="h-4 w-4" />
                        Cari
                    </Button>
                </form>

                {dateKeys.length > 1 && (
                    <div className="mb-6 flex flex-wrap gap-2">
                        {dateKeys.map((key) => (
                            <button
                                key={key}
                                type="button"
                                onClick={() => setActiveTab(key)}
                                className={`cursor-pointer rounded-none border px-4 py-2 text-sm font-medium transition-colors ${
                                    activeTab === key
                                        ? 'border-[var(--brand)] bg-[var(--brand)] text-[var(--on-brand)]'
                                        : 'border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--body)] hover:border-[var(--brand)] hover:text-[var(--fg-brand)]'
                                }`}
                            >
                                {formatTabLabel(key, grouped_results[key].length)}
                            </button>
                        ))}
                    </div>
                )}

                {dateKeys.length > 0 && activeResults.length > 0 && (
                    <div className="space-y-3">
                        <p className="text-sm text-[var(--body-subtle)]">
                            {formatDateLabel(activeTab)} &mdash;{' '}
                            {activeResults.length} jadwal
                        </p>

                        {activeResults.map((trip) => (
                            <div
                                key={trip.uuid}
                                className="flex flex-col gap-4 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4 md:flex-row md:items-center md:justify-between"
                            >
                                <div className="flex flex-1 flex-wrap items-center gap-x-5 gap-y-2">
                                    <div className="flex items-center gap-2">
                                        <Route className="h-4 w-4 text-[var(--fg-brand)]" />
                                        <span className="font-medium text-[var(--body)]">
                                            {trip.route_name}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[var(--body-subtle)]">
                                        <Bus className="h-4 w-4" />
                                        {trip.bus_name} ({trip.plate_number})
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[var(--body-subtle)]">
                                        <Clock className="h-4 w-4" />
                                        {trip.departure_time}{' '}
                                        {trip.estimated_arrival &&
                                            `- ${trip.estimated_arrival}`}
                                    </div>
                                    <div className="flex items-center gap-2 text-sm text-[var(--body-subtle)]">
                                        <Users className="h-4 w-4" />
                                        <span
                                            className={
                                                trip.available_seats <= 5
                                                    ? 'font-semibold text-[var(--fg-danger)]'
                                                    : ''
                                            }
                                        >
                                            {trip.available_seats} kursi
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Harga/org
                                        </p>
                                        <p className="text-lg font-bold text-[var(--fg-brand)]">
                                            Rp {trip.price.toLocaleString('id-ID')}
                                        </p>
                                    </div>
                                    <Link
                                        href={`/dashboard/customer/booking/trip/${trip.uuid}?origin=${trip.origin_id}&destination=${trip.destination_id}`}
                                    >
                                        <Button variant="brand" size="default">
                                            Pesan
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {filters.origin && filters.destination && filters.date && dateKeys.length > 0 && activeResults.length === 0 && (
                    <div className="py-12 text-center">
                        <MapPin className="mx-auto mb-3 h-8 w-8 text-[var(--body-subtle)]" />
                        <p className="text-[var(--body-subtle)]">
                            Tidak ada jadwal tersedia untuk tanggal tersebut.
                        </p>
                    </div>
                )}

                {filters.origin && filters.destination && filters.date && dateKeys.length === 0 && (
                    <div className="py-12 text-center">
                        <MapPin className="mx-auto mb-3 h-8 w-8 text-[var(--body-subtle)]" />
                        <p className="text-[var(--body-subtle)]">
                            Tidak ada jadwal tersedia untuk rute dan periode tersebut.
                        </p>
                    </div>
                )}

                {!filters.origin && (
                    <div className="py-12 text-center">
                        <SearchIcon className="mx-auto mb-3 h-8 w-8 text-[var(--body-subtle)]" />
                        <p className="text-[var(--body-subtle)]">
                            Pilih kota asal dan tujuan untuk mencari tiket.
                        </p>
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
