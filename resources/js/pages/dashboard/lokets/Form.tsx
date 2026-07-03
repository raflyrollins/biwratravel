import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft } from 'lucide-react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface City {
    id: number;
    name: string;
}

interface Loket {
    id: number;
    name: string;
    address: string | null;
    city_id: number | null;
    is_active: boolean;
}

interface LoketsFormProps {
    loket?: Loket;
    cities: City[];
}

export default function LoketsForm({ loket, cities }: LoketsFormProps) {
    const editing = !!loket;
    const { data, setData, errors, processing, post, put } = useForm({
        name: loket?.name ?? '',
        address: loket?.address ?? '',
        city_id: loket?.city_id ?? '',
        is_active: loket?.is_active ?? true,
    });

    function submit(e: FormEvent) {
        e.preventDefault();

        if (editing) {
            put(`/dashboard/lokets/${loket.id}`);
        } else {
            post('/dashboard/lokets');
        }
    }

    return (
        <DashboardLayout title={editing ? 'Edit Loket' : 'Tambah Loket'}>
            <div className="mb-6">
                <Link
                    href="/dashboard/lokets"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    {editing ? 'Edit Loket' : 'Tambah Loket'}
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
                        Nama Loket
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
                        placeholder="Contoh: Loket Medan Pusat"
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="address"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Alamat
                    </label>
                    <textarea
                        id="address"
                        value={data.address}
                        onChange={(e) => setData('address', e.target.value)}
                        rows={3}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.address
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="Jl. Contoh No. 123"
                    />
                    {errors.address && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.address}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="city_id"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Kota
                    </label>
                    <select
                        id="city_id"
                        value={data.city_id}
                        onChange={(e) => setData('city_id', e.target.value)}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.city_id
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                    >
                        <option value="">Pilih kota</option>
                        {cities.map((c) => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </select>
                    {errors.city_id && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.city_id}
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
                        href="/dashboard/lokets"
                        className="inline-flex items-center gap-2 border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}
