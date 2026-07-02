import { Link, router } from '@inertiajs/react';
import { Map, Plus, Pencil, Trash2 } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface Segment {
    id: number;
    origin_city_id: number;
    destination_city_id: number;
    order: number;
    base_price: number;
    origin_city?: { id: number; name: string };
    destination_city?: { id: number; name: string };
}

interface Route {
    id: number;
    name: string;
    is_active: boolean;
    bus: { id: number; name: string; plate_number: string };
    origin_city: { id: number; name: string };
    destination_city: { id: number; name: string };
    segments: Segment[];
}

interface RoutesIndexProps {
    routes: {
        data: Route[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function RoutesIndex({ routes }: RoutesIndexProps) {
    function deleteRoute(route: Route) {
        if (confirm(`Hapus rute "${route.name}"?`)) {
            router.delete(`/dashboard/routes/${route.id}`);
        }
    }

    return (
        <DashboardLayout title="Rute">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Rute
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola rute perjalanan setiap armada.
                    </p>
                </div>
                <Link
                    href="/dashboard/routes/create"
                    className="inline-flex items-center gap-2 bg-[var(--brand)] px-4 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                >
                    <Plus size={16} />
                    Tambah Rute
                </Link>
            </div>

            <div className="space-y-4">
                {routes.data.length === 0 && (
                    <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-12 text-center text-[var(--body-subtle)]">
                        Belum ada rute.
                    </div>
                )}

                {routes.data.map((route) => (
                    <div
                        key={route.id}
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex items-start gap-3">
                                <div className="inline-flex size-10 items-center justify-center bg-[var(--brand-softer)] text-[var(--fg-brand)]">
                                    <Map size={20} />
                                </div>
                                <div>
                                    <h3 className="text-base font-medium text-[var(--heading)]">
                                        {route.name}
                                    </h3>
                                    <p className="text-xs text-[var(--body-subtle)]">
                                        {route.bus.name} (
                                        {route.bus.plate_number})
                                    </p>
                                    <p className="mt-1 text-xs text-[var(--body-subtle)]">
                                        {route.origin_city.name} &rarr;{' '}
                                        {route.destination_city.name}
                                        {' | '}
                                        {route.segments?.length ?? 0} segmen
                                    </p>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                <Link
                                    href={`/dashboard/routes/${route.id}/edit`}
                                    className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                >
                                    <Pencil size={14} />
                                    Edit
                                </Link>
                                <button
                                    type="button"
                                    onClick={() => deleteRoute(route)}
                                    className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-danger-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--fg-danger)] transition-colors hover:bg-[var(--danger-soft)]"
                                >
                                    <Trash2 size={14} />
                                    Hapus
                                </button>
                            </div>
                        </div>

                        {route.segments && route.segments.length > 0 && (
                            <div className="mt-4 border-t border-[var(--border-default)] pt-4">
                                <div className="flex flex-wrap gap-2">
                                    {route.segments.map((seg, i) => (
                                        <span
                                            key={seg.id}
                                            className="inline-flex items-center gap-1 bg-[var(--neutral-tertiary-soft)] px-3 py-1 text-xs text-[var(--body)]"
                                        >
                                            Seg {seg.order}: Rp
                                            {seg.base_price.toLocaleString(
                                                'id-ID',
                                            )}
                                            {i < route.segments.length - 1 && (
                                                <span className="text-[var(--body-subtle)]">
                                                    &rarr;
                                                </span>
                                            )}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>

            {routes.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {routes.links.map((link, i) => (
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
