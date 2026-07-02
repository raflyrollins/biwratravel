import { Head, Link, router } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import LoginForm from '@/components/LoginForm';
import RegisterForm from '@/components/RegisterForm';

const LOGIN_IMG =
    'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&q=80';

const REGISTER_IMG =
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=800&q=80';

interface AuthProps {
    mode: 'login' | 'register';
}

const TRANSITION = {
    type: 'tween' as const,
    duration: 0.45,
    ease: 'easeInOut' as const,
};

export default function Auth({ mode: initialMode }: AuthProps) {
    const [localMode, setLocalMode] = useState<'login' | 'register'>(
        initialMode,
    );
    const isLogin = localMode === 'login';
    const imgSrc = isLogin ? LOGIN_IMG : REGISTER_IMG;

    const prevMode = useRef(localMode);
    const [direction, setDirection] = useState(0);

    function switchMode(nextMode: 'login' | 'register') {
        setLocalMode(nextMode);
        router.visit(nextMode === 'login' ? '/login' : '/register', {
            preserveState: true,
            replace: true,
        });
    }

    useEffect(() => {
        if (prevMode.current !== localMode) {
            setDirection(localMode === 'register' ? 1 : -1);
            prevMode.current = localMode;
        }
    }, [localMode]);

    const leftVariants = {
        enter: { x: `${-direction * 100}%`, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: `${direction * 100}%`, opacity: 0 },
    };

    const rightVariants = {
        enter: { x: `${direction * 100}%`, opacity: 0 },
        center: { x: 0, opacity: 1 },
        exit: { x: `${-direction * 100}%`, opacity: 0 },
    };

    return (
        <>
            <Head title={isLogin ? 'Masuk' : 'Daftar'} />

            <div className="relative flex min-h-dvh items-center justify-center bg-gradient-to-br from-[var(--brand-softer)] via-[var(--neutral-primary)] to-[var(--brand-softer)] p-4">
                {/* Back to home */}
                <Link
                    href="/"
                    className="absolute top-6 left-6 z-20 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                {/* ── Mobile: stacked ── */}
                <div className="flex w-full max-w-md flex-col overflow-y-auto border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-xl md:hidden dark:border-white/10 dark:bg-white/5 dark:backdrop-blur-sm">
                    <div
                        className="relative aspect-[16/9] bg-cover bg-center"
                        style={{ backgroundImage: `url(${imgSrc})` }}
                    >
                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2E]/80 via-[#0F0F2E]/30 to-transparent" />
                        <div className="relative flex h-full flex-col justify-end p-6">
                            <h3 className="text-lg font-bold text-white">
                                {isLogin
                                    ? 'Selamat Datang Kembali'
                                    : 'Mulai Perjalanan Anda'}
                            </h3>
                            <p className="mt-1 text-sm text-white/70">
                                {isLogin
                                    ? 'Masuk ke akun Biwratravel Anda.'
                                    : 'Daftar untuk memesan tiket bus.'}
                            </p>
                        </div>
                    </div>
                    <AnimatePresence initial={false} mode="wait">
                        <motion.div
                            key={localMode}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            transition={TRANSITION}
                        >
                            {isLogin ? (
                                <LoginForm onSwitchMode={switchMode} />
                            ) : (
                                <RegisterForm onSwitchMode={switchMode} />
                            )}
                        </motion.div>
                    </AnimatePresence>
                </div>

                {/* ── Desktop: animated panels ── */}
                <div className="hidden overflow-x-hidden md:flex md:h-[560px] md:w-full md:max-w-[900px] md:border md:[border-color:var(--border-default)] md:bg-[var(--neutral-primary)] md:shadow-xl dark:md:border-white/10 dark:md:bg-white/5 dark:md:backdrop-blur-sm">
                    {/* ── Left panel ── */}
                    <div className="relative w-1/2">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={
                                    isLogin
                                        ? 'panel-left-image'
                                        : 'panel-left-form'
                                }
                                variants={leftVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                className="absolute inset-0 overflow-y-auto"
                            >
                                {isLogin ? (
                                    <div
                                        className="h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${LOGIN_IMG})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2E]/80 via-[#0F0F2E]/30 to-transparent" />
                                        <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
                                            <h3 className="text-xl font-bold text-white md:text-2xl">
                                                Selamat Datang Kembali
                                            </h3>
                                            <p className="mt-2 text-sm text-white/70">
                                                Masuk untuk melanjutkan
                                                perjalanan Anda bersama
                                                Biwratravel.
                                            </p>
                                        </div>
                                    </div>
                                ) : (
                                    <RegisterForm onSwitchMode={switchMode} />
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {/* ── Right panel ── */}
                    <div className="relative w-1/2">
                        <AnimatePresence initial={false}>
                            <motion.div
                                key={
                                    isLogin
                                        ? 'panel-right-form'
                                        : 'panel-right-image'
                                }
                                variants={rightVariants}
                                initial="enter"
                                animate="center"
                                exit="exit"
                                transition={TRANSITION}
                                className="absolute inset-0 overflow-y-auto"
                            >
                                {isLogin ? (
                                    <LoginForm onSwitchMode={switchMode} />
                                ) : (
                                    <div
                                        className="h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${REGISTER_IMG})`,
                                        }}
                                    >
                                        <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F2E]/80 via-[#0F0F2E]/30 to-transparent" />
                                        <div className="relative flex h-full flex-col justify-end p-8 md:p-12">
                                            <h3 className="text-xl font-bold text-white md:text-2xl">
                                                Mulai Perjalanan Anda
                                            </h3>
                                            <p className="mt-2 text-sm text-white/70">
                                                Daftar sekarang dan nikmati
                                                kemudahan memesan tiket bus
                                                secara online.
                                            </p>
                                        </div>
                                    </div>
                                )}
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </>
    );
}
