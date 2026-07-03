import { Link, router } from '@inertiajs/react';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { useState } from 'react';

import ConfirmDialog from '@/components/ConfirmDialog';
import DashboardLayout from '@/components/DashboardLayout';

const ROLE_LABELS: Record<string, string> = {
    superadmin: 'Superadmin',
    admin_penjualan: 'Admin Penjualan',
    admin_charter: 'Admin Charter',
    driver: 'Driver',
    petugas_loket: 'Petugas Loket',
    customer: 'Customer',
};

interface Loket {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    role: string;
    loket_id: number | null;
    loket: Loket | null;
    created_at: string;
}

interface UsersIndexProps {
    users: {
        data: User[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
}

export default function UsersIndex({ users }: UsersIndexProps) {
    const [deleteTarget, setDeleteTarget] = useState<User | null>(null);

    function confirmDelete() {
        if (deleteTarget) {
            router.delete(`/dashboard/users/${deleteTarget.id}`);
            setDeleteTarget(null);
        }
    }

    return (
        <DashboardLayout title="Pengguna">
            <div className="mb-6 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Pengguna
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola pengguna sistem Biwratravel.
                    </p>
                </div>
                <Link
                    href="/dashboard/users/create"
                    className="inline-flex items-center gap-2 bg-[var(--brand)] px-4 py-3 text-sm font-medium text-[var(--on-brand)] no-underline transition-colors hover:bg-[var(--brand-strong)]"
                >
                    <Plus size={16} />
                    Tambah Pengguna
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
                                Email
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Peran
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Loket
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={5}
                                    className="px-6 py-12 text-center text-[var(--body-subtle)]"
                                >
                                    Belum ada pengguna.
                                </td>
                            </tr>
                        )}
                        {users.data.map((user) => (
                            <tr
                                key={user.id}
                                className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                            >
                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                    {user.name}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {user.email}
                                </td>
                                <td className="px-6 py-4">
                                    <span className="inline-block px-2 py-0.5 text-xs font-medium bg-[var(--brand-softer)] text-[var(--fg-brand)]">
                                        {ROLE_LABELS[user.role] ?? user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {user.loket?.name ?? '-'}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/users/${user.id}/edit`}
                                            className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            <Pencil size={14} />
                                            Edit
                                        </Link>
                                        <button
                                            type="button"
                                            onClick={() => setDeleteTarget(user)}
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
                title="Hapus Pengguna"
                message={`Yakin ingin menghapus pengguna "${deleteTarget?.name}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmLabel="Hapus"
                cancelLabel="Batal"
                variant="danger"
                onConfirm={confirmDelete}
                onCancel={() => setDeleteTarget(null)}
            />

            {users.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {users.links.map((link, i) => (
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
