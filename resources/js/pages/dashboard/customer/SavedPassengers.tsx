import { Head, router } from '@inertiajs/react';
import { Pencil, Trash2, UserCheck } from 'lucide-react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/DatePicker';

interface Passenger {
    id: number;
    nik: string;
    name: string;
    gender: string;
    birth_date: string;
}

interface SavedPassengersProps {
    passengers: Passenger[];
}

export default function SavedPassengers({ passengers }: SavedPassengersProps) {
    const [editingId, setEditingId] = useState<number | null>(null);
    const [editForm, setEditForm] = useState({ name: '', gender: 'L', birth_date: '' });
    const [saving, setSaving] = useState(false);

    function startEdit(p: Passenger) {
        setEditingId(p.id);
        setEditForm({
            name: p.name,
            gender: p.gender,
            birth_date: p.birth_date,
        });
    }

    function cancelEdit() {
        setEditingId(null);
    }

    function saveEdit(id: number) {
        setSaving(true);
        router.put(
            `/dashboard/customer/passengers/${id}`,
            editForm,
            {
                preserveScroll: true,
                onSuccess: () => {
                    setEditingId(null);
                    setSaving(false);
                },
                onError: () => setSaving(false),
            },
        );
    }

    function confirmDelete(id: number, name: string) {
        if (!window.confirm(`Hapus data penumpang "${name}"?`)) return;

        router.delete(`/dashboard/customer/passengers/${id}`, {
            preserveScroll: true,
        });
    }

    return (
        <DashboardLayout>
            <Head title="Data Penumpang" />

            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <h1 className="text-xl font-bold text-[var(--heading)]">
                        Data Penumpang
                    </h1>
                    <p className="mt-1 text-sm text-[var(--body-subtle)]">
                        Kelola data penumpang tersimpan. Data ini akan otomatis terisi saat
                        Anda memesan tiket.
                    </p>
                </div>

                {passengers.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 border border-[var(--border-default)] bg-[var(--neutral-primary)] px-6 py-16 text-center">
                        <UserCheck className="h-12 w-12 text-[var(--body-subtle)]" />
                        <p className="text-sm text-[var(--body-subtle)]">
                            Belum ada data penumpang tersimpan.
                        </p>
                        <p className="text-xs text-[var(--body-subtle)]">
                            Data penumpang akan otomatis tersimpan saat Anda memesan tiket.
                        </p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {passengers.map((p) => (
                            <div
                                key={p.id}
                                className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4"
                            >
                                {editingId === p.id ? (
                                    <div className="space-y-4">
                                        <div className="grid gap-4 sm:grid-cols-4">
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                    NIK
                                                </label>
                                                <p className="px-3 py-2 text-sm text-[var(--body)]">
                                                    {p.nik}
                                                </p>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                    Nama
                                                </label>
                                                <input
                                                    type="text"
                                                    value={editForm.name}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            name: e.target.value,
                                                        }))
                                                    }
                                                    className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2 text-sm text-[var(--heading)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10"
                                                />
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                    JK
                                                </label>
                                                <select
                                                    value={editForm.gender}
                                                    onChange={(e) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            gender: e.target.value,
                                                        }))
                                                    }
                                                    className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2 text-sm text-[var(--heading)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10"
                                                >
                                                    <option value="L">Laki-laki</option>
                                                    <option value="P">Perempuan</option>
                                                </select>
                                            </div>
                                            <div>
                                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                    Tanggal Lahir
                                                </label>
                                                <DatePicker
                                                    value={editForm.birth_date}
                                                    onChange={(v) =>
                                                        setEditForm((prev) => ({
                                                            ...prev,
                                                            birth_date: v,
                                                        }))
                                                    }
                                                />
                                            </div>
                                        </div>
                                        <div className="flex justify-end gap-2">
                                            <button
                                                type="button"
                                                onClick={cancelEdit}
                                                className="cursor-pointer border border-[var(--border-default)] bg-transparent px-3 py-1.5 text-sm text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                            >
                                                Batal
                                            </button>
                                            <button
                                                type="button"
                                                disabled={saving}
                                                onClick={() => saveEdit(p.id)}
                                                className="cursor-pointer bg-[var(--brand)] px-4 py-1.5 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:opacity-50"
                                            >
                                                {saving ? 'Menyimpan...' : 'Simpan'}
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex items-start justify-between gap-4">
                                        <div className="grid min-w-0 flex-1 gap-x-6 gap-y-1 sm:grid-cols-4">
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    NIK
                                                </p>
                                                <p className="truncate text-sm font-medium text-[var(--heading)]">
                                                    {p.nik}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    Nama
                                                </p>
                                                <p className="truncate text-sm text-[var(--body)]">
                                                    {p.name}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    JK
                                                </p>
                                                <p className="text-sm text-[var(--body)]">
                                                    {p.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-[var(--body-subtle)]">
                                                    Tanggal Lahir
                                                </p>
                                                <p className="text-sm text-[var(--body)]">
                                                    {new Date(p.birth_date).toLocaleDateString(
                                                        'id-ID',
                                                        {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        },
                                                    )}
                                                </p>
                                            </div>
                                        </div>
                                        <div className="flex shrink-0 gap-1">
                                            <button
                                                type="button"
                                                onClick={() => startEdit(p)}
                                                className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--body-subtle)] transition-colors hover:bg-[var(--neutral-tertiary-soft)] hover:text-[var(--heading)]"
                                                title="Edit"
                                            >
                                                <Pencil className="h-4 w-4" />
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => confirmDelete(p.id, p.name)}
                                                className="flex size-8 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-transparent text-[var(--fg-danger)] transition-colors hover:bg-[var(--fg-danger)] hover:text-[var(--neutral-primary)]"
                                                title="Hapus"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </DashboardLayout>
    );
}
