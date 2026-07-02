import { Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface City {
    id: number;
    name: string;
    slug: string;
    is_active: boolean;
    created_at: string;
}

interface CitiesIndexProps {
    cities: {
        data: City[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function CitiesIndex({ cities }: CitiesIndexProps) {
    function deleteCity(city: City) {
        if (confirm(`Hapus kota "${city.name}"?`)) {
            router.delete(`/dashboard/cities/${city.id}`);
        }
    }

    return (
        <DashboardLayout title="Kota">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Kota
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola daftar kota/stasiun.
                    </p>
                </div>
                <Link
                    href="/dashboard/cities/create"
                    className="inline-flex items-center gap-2 bg-[var(--brand)] px-4 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                >
                    <Plus size={16} />
                    Tambah Kota
                </Link>
            </div>

            <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Nama
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Slug
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
                        {cities.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={4}
                                    className="px-6 py-12 text-center text-[var(--body-subtle)]"
                                >
                                    Belum ada kota. Silakan tambah kota baru.
                                </td>
                            </tr>
                        )}
                        {cities.data.map((city) => (
                            <tr
                                key={city.id}
                                className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                            >
                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                    {city.name}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {city.slug}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={`inline-block px-2 py-0.5 text-xs font-medium ${
                                            city.is_active
                                                ? 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]'
                                                : 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]'
                                        }`}
                                    >
                                        {city.is_active ? 'Aktif' : 'Nonaktif'}
                                    </span>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/cities/${city.id}/edit`}
                                            className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => deleteCity(city)}
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

            {cities.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {cities.links.map((link, i) => (
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
