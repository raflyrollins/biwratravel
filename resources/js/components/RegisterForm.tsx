import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import Button from '@/components/Button';

interface RegisterFormProps {
    onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function RegisterForm({ onSwitchMode }: RegisterFormProps) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const { data, setData, errors, processing, post } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/register');
    }

    return (
        <div className="flex min-h-[440px] flex-col justify-center p-8 md:p-12">
            <h2 className="mb-1 text-2xl font-bold text-[var(--heading)]">
                Daftar
            </h2>
            <p className="mb-8 text-sm text-[var(--body-subtle)]">
                Buat akun baru untuk mulai memesan tiket.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Name */}
                <div>
                    <label
                        htmlFor="reg-name"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Nama Lengkap
                    </label>
                    <input
                        id="reg-name"
                        type="text"
                        value={data.name}
                        onChange={(e) => setData('name', e.target.value)}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.name
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="Nama lengkap Anda"
                    />
                    <div className="mt-1.5 min-h-[1em]">
                        {errors.name && (
                            <p className="text-xs text-[var(--danger)]">
                                {errors.name}
                            </p>
                        )}
                    </div>
                </div>

                {/* Email */}
                <div>
                    <label
                        htmlFor="reg-email"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Email
                    </label>
                    <input
                        id="reg-email"
                        type="email"
                        value={data.email}
                        onChange={(e) => setData('email', e.target.value)}
                        className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                            errors.email
                                ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                        }`}
                        placeholder="contoh@email.com"
                    />
                    <div className="mt-1.5 min-h-[1em]">
                        {errors.email && (
                            <p className="text-xs text-[var(--danger)]">
                                {errors.email}
                            </p>
                        )}
                    </div>
                </div>

                {/* Password */}
                <div>
                    <label
                        htmlFor="reg-password"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id="reg-password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 pr-11 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.password
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                            placeholder="Minimal 8 karakter"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                            tabIndex={-1}
                            aria-label={
                                showPassword
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                        >
                            {showPassword ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <div className="mt-1.5 min-h-[1em]">
                        {errors.password && (
                            <p className="text-xs text-[var(--danger)]">
                                {errors.password}
                            </p>
                        )}
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="reg-password-confirm"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Konfirmasi Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id="reg-password-confirm"
                            type={showConfirm ? 'text' : 'password'}
                            value={data.password_confirmation}
                            onChange={(e) =>
                                setData('password_confirmation', e.target.value)
                            }
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 pr-11 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.password_confirmation
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                            placeholder="Ulangi kata sandi"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm((p) => !p)}
                            className="absolute top-1/2 right-3 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                            tabIndex={-1}
                            aria-label={
                                showConfirm
                                    ? 'Sembunyikan kata sandi'
                                    : 'Tampilkan kata sandi'
                            }
                        >
                            {showConfirm ? (
                                <EyeOff size={18} />
                            ) : (
                                <Eye size={18} />
                            )}
                        </button>
                    </div>
                    <div className="mt-1.5 min-h-[1em]">
                        {errors.password_confirmation && (
                            <p className="text-xs text-[var(--danger)]">
                                {errors.password_confirmation}
                            </p>
                        )}
                    </div>
                </div>

                {/* Submit */}
                <Button
                    variant="brand"
                    size="large"
                    disabled={processing}
                    type="submit"
                    className="mt-2 w-full"
                >
                    {processing ? 'Memproses...' : 'Daftar'}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--body-subtle)]">
                Sudah punya akun?{' '}
                <button
                    type="button"
                    onClick={() => onSwitchMode('login')}
                    className="inline cursor-pointer border-none bg-transparent p-0 font-medium text-[var(--fg-brand)] underline underline-offset-4 transition-colors hover:no-underline"
                >
                    Masuk di sini
                </button>
            </p>
        </div>
    );
}
