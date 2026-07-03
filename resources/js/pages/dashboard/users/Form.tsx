import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface Role {
    value: string;
    label: string;
}

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
}

interface UsersFormProps {
    user?: User;
    roles: Role[];
    lokets: Loket[];
}

export default function UsersForm({ user, roles, lokets }: UsersFormProps) {
    const editing = !!user;
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, errors, processing, post, put } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.role ?? 'customer',
        loket_id: user?.loket_id ?? '',
    });

    function isPetugasLoket(): boolean {
        return data.role === 'petugas_loket';
    }

    function submit(e: FormEvent) {
        e.preventDefault();

        if (editing) {
            put(`/dashboard/users/${user.id}`);
        } else {
            post('/dashboard/users');
        }
    }

    return (
        <DashboardLayout title={editing ? 'Edit Pengguna' : 'Tambah Pengguna'}>
            <div className="mb-6">
                <Link
                    href="/dashboard/users"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    {editing ? 'Edit Pengguna' : 'Tambah Pengguna'}
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
                        Nama
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
                        placeholder="Nama lengkap"
                    />
                    {errors.name && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.name}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="email"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Email
                    </label>
                    <input
                        id="email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.email
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="email@contoh.com"
                    />
                    {errors.email && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.email}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="password"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Password
                        {editing && (
                            <span className="ml-1 text-[var(--body-subtle)]">
                                (biarkan kosong jika tidak diubah)
                            </span>
                        )}
                    </label>
                    <div className="relative">
                        <input
                            id="password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 pr-10 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.password
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                            placeholder={
                                editing
                                    ? 'Kosongkan jika tidak diubah'
                                    : 'Minimal 8 karakter'
                            }
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 flex -translate-y-1/2 cursor-pointer items-center border-none bg-transparent text-[var(--body-subtle)] hover:text-[var(--heading)]"
                            tabIndex={-1}
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    {errors.password && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.password}
                        </p>
                    )}
                </div>

                <div className="mb-5">
                    <label
                        htmlFor="role"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Peran
                    </label>
                    <select
                        id="role"
                        value={data.role}
                        onChange={(e) => {
                            setData('role', e.target.value);
                            if (e.target.value !== 'petugas_loket') {
                                setData('loket_id', '');
                            }
                        }}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.role
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                    >
                        {roles.map((r) => (
                            <option key={r.value} value={r.value}>
                                {r.label}
                            </option>
                        ))}
                    </select>
                    {errors.role && (
                        <p className="mt-1.5 text-xs text-[var(--danger)]">
                            {errors.role}
                        </p>
                    )}
                </div>

                {isPetugasLoket() && (
                    <div className="mb-5">
                        <label
                            htmlFor="loket_id"
                            className="mb-2 block text-sm font-medium text-[var(--heading)]"
                        >
                            Loket
                        </label>
                        <select
                            id="loket_id"
                            value={data.loket_id}
                            onChange={(e) =>
                                setData('loket_id', e.target.value)
                            }
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.loket_id
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                        >
                            <option value="">Pilih loket</option>
                            {lokets.map((l) => (
                                <option key={l.id} value={l.id}>
                                    {l.name}
                                </option>
                            ))}
                        </select>
                        {errors.loket_id && (
                            <p className="mt-1.5 text-xs text-[var(--danger)]">
                                {errors.loket_id}
                            </p>
                        )}
                    </div>
                )}

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
                        href="/dashboard/users"
                        className="inline-flex items-center gap-2 border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}
