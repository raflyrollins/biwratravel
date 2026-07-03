import { Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import ConfirmDialog from '@/components/ConfirmDialog';
import DashboardLayout from '@/components/DashboardLayout';

interface Trip {
    id: number;
    uuid: string;
    departure_date: string;
    departure_time: string;
    estimated_arrival: string | null;
    is_active: boolean;
    route: {
        id: number;
        name: string;
        bus: { name: string; plate_number: string };
    };
    bus: { id: number; name: string; plate_number: string };
}

interface TripsIndexProps {
    trips: {
        data: Trip[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function TripsIndex({ trips }: TripsIndexProps) {
    const [deleteTarget, setDeleteTarget] = useState<Trip | null>(null);

    function confirmDelete() {
        if (deleteTarget) {
            router.delete(`/dashboard/trips/${deleteTarget.uuid}`);
            setDeleteTarget(null);
        }
    }

    return (
        <DashboardLayout title="Jadwal">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Jadwal
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola jadwal keberangkatan.
                    </p>
                </div>
                <Link
                    href="/dashboard/trips/create"
                    className="inline-flex items-center gap-2 bg-[var(--brand)] px-4 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                >
                    <Plus size={16} />
                    Tambah Jadwal
                </Link>
            </div>

            <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Rute
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Armada
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Jam
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Status
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {trips.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={6}
                                    className="px-6 py-12 text-center text-[var(--body-subtle)]"
                                >
                                    Belum ada jadwal.
                                </td>
                            </tr>
                        )}
                        {trips.data.map((trip) => (
                            <tr
                                key={trip.id}
                                className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                            >
                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                    {trip.route?.name ?? '-'}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {trip.bus?.name ?? '-'}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {trip.departure_date}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {trip.departure_time}
                                    {trip.estimated_arrival && (
                                        <span className="text-[var(--body-subtle)]">
                                            {' '}
                                            &rarr; {trip.estimated_arrival}
                                        </span>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                                            trip.is_active
                                                ? 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]'
                                                : 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]'
                                        }`}
                                    >
                                        {trip.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/trips/${trip.uuid}/edit`}
                                            className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(trip)}
                                            className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-danger-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--fg-danger)] transition-colors hover:bg-[var(--danger-soft)]"
                                        >
                                            <Trash2 size={14} />
                                            Hapus
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            <ConfirmDialog
                open={deleteTarget !== null}
                title="Hapus Jadwal"
                message={`Yakin ingin menghapus jadwal ini? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {trips.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {trips.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={`inline-flex items-center justify-center border px-3 py-2 text-sm no-underline transition-colors ${
                                link.active
                                    ? 'border-[var(--brand)] bg-[var(--brand-softer)] text-[var(--fg-brand)]'
                                    : 'border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]'
                            } ${!link.url ? 'pointer-events-none opacity-50' : ''}`}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
        </DashboardLayout>
    );
}
