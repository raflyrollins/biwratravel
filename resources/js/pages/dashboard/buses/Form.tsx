import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface Bus {
    id: number;
    uuid: string;
    plate_number: string;
    name: string;
    capacity: number;
    is_active: boolean;
}

interface BusesFormProps {
    bus?: Bus;
}

export default function BusesForm({ bus }: BusesFormProps) {
    const editing = !!bus;
    const { data, setData, errors, processing, post, put } = useForm({
        plate_number: bus?.plate_number ?? '',
        name: bus?.name ?? '',
        capacity: bus?.capacity ?? 60,
        is_active: bus?.is_active ?? true,
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (editing) {
            put(`/dashboard/buses/${bus.uuid}`);
        } else {
            post('/dashboard/buses');
        }
    }

    return (
        <DashboardLayout title={editing ? 'Edit Armada' : 'Tambah Armada'}>
            <div className="mb-6">
                <Link
                    href="/dashboard/buses"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    {editing ? 'Edit Armada' : 'Tambah Armada'}
                </h1>
            </div>

            <form
                onSubmit={submit}
                className="max-w-lg border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
            >
                <div className="mb-5">
                    <label
                        htmlFor="name"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Nama Armada
                    </label>
                    <input
                        id="name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.name
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="Contoh: Budi Jaya"
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="plate_number"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Plat Nomor
                    </label>
                    <input
                        id="plate_number"
                        type="text"
                        value={data.plate_number}
                        onChange={(e) =>
                            setData('plate_number', e.target.value)
                        }
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.plate_number
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="BK 1234 AB"
                    />
                    {errors.plate_number && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.plate_number}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="capacity"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Kapasitas (kursi)
                    </label>
                    <input
                        id="capacity"
                        type="text"
                        inputMode="numeric"
                        value={data.capacity || ''}
                        onInput={(e) => {
                            const el = e.currentTarget;
                            el.value = el.value.replace(/\D/g, '');
                        }}
                        onChange={(e) =>
                            setData('capacity', Number(e.target.value.replace(/\D/g, '')))
                        }
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.capacity
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        min="1"
                    />
                    {errors.capacity && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.capacity}
                        </p>
                    )}
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
                        href="/dashboard/buses"
                        className="inline-flex items-center gap-2 border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}
