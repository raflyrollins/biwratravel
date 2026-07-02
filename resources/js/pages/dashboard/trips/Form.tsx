import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/DatePicker';

interface Bus {
    id: number;
    name: string;
    plate_number: string;
}

interface Route {
    id: number;
    name: string;
    bus_id: number;
    bus: { name: string; plate_number: string };
    origin_city: { name: string };
    destination_city: { name: string };
}

interface TripData {
    id: number;
    route_id: number;
    bus_id: number;
    departure_date: string;
    departure_time: string;
    estimated_arrival: string | null;
    is_active: boolean;
}

interface TripsFormProps {
    trip?: TripData;
    routes: Route[];
    buses: Bus[];
}

export default function TripsForm({ trip, routes, buses }: TripsFormProps) {
    const editing = !!trip;
    const { data, setData, errors, processing, post, put } = useForm({
        route_id: trip?.route_id ?? '',
        bus_id: trip?.bus_id ?? '',
        departure_date: trip?.departure_date ?? '',
        departure_time: trip?.departure_time ?? '',
        estimated_arrival: trip?.estimated_arrival ?? '',
        is_active: trip?.is_active ?? true,
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (editing) {
            put(`/dashboard/trips/${trip.id}`);
        } else {
            post('/dashboard/trips');
        }
    }

    return (
        <DashboardLayout title={editing ? 'Edit Jadwal' : 'Tambah Jadwal'}>
            <div className="mb-6">
                <Link
                    href="/dashboard/trips"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    {editing ? 'Edit Jadwal' : 'Tambah Jadwal'}
                </h1>
            </div>

            <form
                onSubmit={submit}
                className="max-w-lg border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
            >
                <div className="mb-5">
                    <label
                        htmlFor="route_id"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Rute
                    </label>
                    <select
                        id="route_id"
                        value={data.route_id}
                        onChange={(e) => {
                            const routeId = Number(e.target.value);
                            const selectedRoute = routes.find(
                                (r) => r.id === routeId,
                            );
                            setData('route_id', routeId);

                            if (selectedRoute && !data.bus_id) {
                                setData('bus_id', selectedRoute.bus_id);
                            }
                        }}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.route_id
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                    >
                        <option value="">Pilih rute</option>
                        {routes.map((r) => (
                            <option key={r.id} value={r.id}>
                                {r.name} — {r.bus.name}
                            </option>
                        ))}
                    </select>
                    {errors.route_id && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.route_id}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="bus_id"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Armada
                    </label>
                    <select
                        id="bus_id"
                        value={data.bus_id}
                        onChange={(e) =>
                            setData('bus_id', Number(e.target.value))
                        }
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.bus_id
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                    >
                        <option value="">Pilih armada</option>
                        {buses.map((b) => (
                            <option key={b.id} value={b.id}>
                                {b.name} ({b.plate_number})
                            </option>
                        ))}
                    </select>
                    {errors.bus_id && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.bus_id}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <DatePicker
                        id="departure_date"
                        label="Tanggal Keberangkatan"
                        value={data.departure_date}
                        onChange={(v) => setData('departure_date', v)}
                        error={errors.departure_date}
                    />
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="departure_time"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Jam Berangkat
                    </label>
                    <input
                        id="departure_time"
                        type="time"
                        value={data.departure_time}
                        onChange={(e) =>
                            setData('departure_time', e.target.value)
                        }
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.departure_time
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                    />
                    {errors.departure_time && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.departure_time}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="estimated_arrival"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Estimasi Tiba
                    </label>
                    <input
                        id="estimated_arrival"
                        type="time"
                        value={data.estimated_arrival}
                        onChange={(e) =>
                            setData('estimated_arrival', e.target.value)
                        }
                        className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none dark:bg-white/10"
                    />
                </div>

                <div className="mb-6">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body-subtle)]">
                        <input
                            type="checkbox"
                            checked={data.is_active}
                            onChange={(e) =>
                                setData('is_active', e.target.checked)
                            }
                            className="size-4 accent-[var(--brand)]"
                        />
                        Aktif
                    </label>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing
                            ? 'Menyimpan...'
                            : editing
                              ? 'Perbarui'
                              : 'Simpan'}
                    </button>
                    <Link
                        href="/dashboard/trips"
                        className="inline-flex items-center gap-2 border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}
