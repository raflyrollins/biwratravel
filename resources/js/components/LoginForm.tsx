import { useForm } from '@inertiajs/react';
import { Eye, EyeOff } from 'lucide-react';
import type { FormEvent } from 'react';
import { useState } from 'react';

import Button from '@/components/Button';

interface LoginFormProps {
    onSwitchMode: (mode: 'login' | 'register') => void;
}

export default function LoginForm({ onSwitchMode }: LoginFormProps) {
    const [showPassword, setShowPassword] = useState(false);

    const { data, setData, errors, processing, post } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/login');
    }

    return (
        <div className="flex min-h-[440px] flex-col justify-center p-8 md:p-12">
            <h2 className="mb-1 text-2xl font-bold text-[var(--heading)]">
                Masuk
            </h2>
            <p className="mb-8 text-sm text-[var(--body-subtle)]">
                Selamat datang kembali! Masuk ke akun Anda.
            </p>

            <form onSubmit={submit} className="flex flex-col gap-5">
                {/* Email */}
                <div>
                    <label
                        htmlFor="login-email"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Email
                    </label>
                    <input
                        id="login-email"
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
                        htmlFor="login-password"
                        className="mb-2 block text-sm font-medium text-[var(--heading)]"
                    >
                        Kata Sandi
                    </label>
                    <div className="relative">
                        <input
                            id="login-password"
                            type={showPassword ? 'text' : 'password'}
                            value={data.password}
                            onChange={(e) => setData('password', e.target.value)}
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 pr-11 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.password
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                            placeholder="Masukkan kata sandi"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((p) => !p)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer border-none bg-transparent p-0 text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                            tabIndex={-1}
                            aria-label={showPassword ? 'Sembunyikan kata sandi' : 'Tampilkan kata sandi'}
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
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

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                    <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body-subtle)]">
                        <input
                            type="checkbox"
                            checked={data.remember}
                            onChange={(e) =>
                                setData('remember', e.target.checked)
                            }
                            className="size-4 accent-[var(--brand)]"
                        />
                        Ingat saya
                    </label>
                    <span className="cursor-pointer text-sm text-[var(--fg-brand)] underline underline-offset-4 transition-colors hover:no-underline">
                        Lupa kata sandi?
                    </span>
                </div>

                {/* Submit */}
                <Button
                    variant="brand"
                    size="large"
                    disabled={processing}
                    type="submit"
                    className="mt-2 w-full"
                >
                    {processing ? 'Memproses...' : 'Masuk'}
                </Button>
            </form>

            <p className="mt-8 text-center text-sm text-[var(--body-subtle)]">
                Belum punya akun?{' '}
                <button
                    type="button"
                    onClick={() => onSwitchMode('register')}
                    className="inline cursor-pointer border-none bg-transparent p-0 font-medium text-[var(--fg-brand)] underline underline-offset-4 transition-colors hover:no-underline"
                >
                    Daftar sekarang
                </button>
            </p>
        </div>
    );
}
