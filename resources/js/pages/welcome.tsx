import { Head } from '@inertiajs/react';
import { AnimatePresence, motion } from 'framer-motion';
import {
    ArrowRight,
    Bus,
    ChevronDown,
    ChevronLeft,
    ChevronRight,
    ShieldCheck,
    Star,
    Ticket,
} from 'lucide-react';
import { useCallback, useEffect, useState } from 'react';

import Button from '@/components/Button';
import Container from '@/components/Container';
import Footer from '@/components/Footer';
import Navbar from '@/components/Navbar';

const HERO_IMG =
    'https://images.unsplash.com/photo-1570125909232-eb263c188f7e?w=1920&q=80';

const GALLERY_IMAGES = [
    {
        url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=1200&q=80',
        caption: 'Armada bus kami yang nyaman dan terawat',
    },
    {
        url: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1200&q=80',
        caption: 'Pemandangan perjalanan yang indah',
    },
    {
        url: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=1200&q=80',
        caption: 'Rute perjalanan yang lengkap',
    },
    {
        url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=1200&q=80',
        caption: 'Pengalaman perjalanan tak terlupakan',
    },
    {
        url: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=1200&q=80',
        caption: 'Kemudahan dalam setiap perjalanan',
    },
];

const PARALLAX_IMG =
    'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=1920&q=80';

const STEP_IMAGES: Record<string, string> = {
    route: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=600&q=80',
    schedule:
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&q=80',
    payment:
        'https://images.unsplash.com/photo-1563013544-824ae1b704d3?w=600&q=80',
    travel: 'https://images.unsplash.com/photo-1504608524841-42fe6f032b4b?w=600&q=80',
};

const PEOPLE = [
    'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80',
    'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&q=80',
    'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80',
    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&q=80',
    'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&q=80',
];

const GALLERY_INTERVAL = 4000;

export default function Welcome() {
    const [galleryIndex, setGalleryIndex] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
        }, GALLERY_INTERVAL);

        return () => clearInterval(timer);
    }, []);

    const prevGallery = useCallback(() => {
        setGalleryIndex((prev) =>
            prev === 0 ? GALLERY_IMAGES.length - 1 : prev - 1,
        );
    }, []);

    const nextGallery = useCallback(() => {
        setGalleryIndex((prev) => (prev + 1) % GALLERY_IMAGES.length);
    }, []);

    return (
        <>
            <Head title="Selamat Datang" />

            <Navbar />

            {/* ── Hero ── */}
            <section
                id="beranda"
                className="relative min-h-screen bg-cover bg-center bg-no-repeat"
                style={{ backgroundImage: `url(${HERO_IMG})` }}
            >
                <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/85 to-[var(--brand)]/60" />
                <div className="absolute inset-0 bg-black/20" />

                <Container className="relative z-10 grid min-h-screen items-center gap-12 pt-24 md:grid-cols-2 md:pt-0">
                    <motion.div
                        initial={{ opacity: 0, y: 40 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <h1 className="mb-6 text-[32px] leading-[1.1] font-bold text-[var(--on-brand)] md:text-[40px] lg:text-[56px] lg:tracking-[-0.8px]">
                            Perjalanan Anda,
                            <br />
                            Mulai dari Sini
                        </h1>
                        <p className="mb-8 max-w-[65ch] text-lg leading-[1.7] text-[var(--on-brand-muted)] md:text-xl">
                            Tiket bus online termurah di Indonesia. Pesan tiket
                            dari kota asal ke kota tujuan dengan mudah, cepat,
                            dan aman.
                        </p>
                        <div className="flex flex-wrap gap-4">
                            <Button variant="white" size="large">
                                Cari Tiket
                                <ArrowRight size={20} />
                            </Button>
                            <Button variant="white" size="large">
                                Pesan Charter
                            </Button>
                        </div>
                    </motion.div>

                    <motion.div
                        className="flex flex-col items-center md:items-end"
                        initial={{ opacity: 0, x: 40 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.8, delay: 0.4 }}
                    >
                        <div className="w-full max-w-sm rounded-none border border-white/20 bg-white/10 p-8 backdrop-blur-sm">
                            <div className="mb-6 flex items-center">
                                <div className="flex">
                                    {PEOPLE.map((src, i) => (
                                        <img
                                            key={src}
                                            src={src}
                                            alt=""
                                            className="size-11 rounded-none border-2 border-[var(--brand)] object-cover"
                                            style={{
                                                marginLeft:
                                                    i === 0 ? 0 : '-8px',
                                                zIndex: PEOPLE.length - i,
                                            }}
                                        />
                                    ))}
                                </div>
                            </div>

                            <p className="mb-1 text-2xl font-bold text-[var(--on-brand)]">
                                10.000+
                            </p>
                            <p className="mb-4 text-sm text-[var(--on-brand-muted)]">
                                Penumpang telah menggunakan Biwratravel
                            </p>

                            <div className="mb-4 flex items-center gap-2">
                                <div className="flex gap-0.5">
                                    {Array.from({ length: 5 }).map((_, i) => (
                                        <Star
                                            key={i}
                                            size={16}
                                            className="fill-[#FFD166] text-[#FFD166]"
                                        />
                                    ))}
                                </div>
                                <span className="text-sm font-medium text-[var(--on-brand)]">
                                    4.8
                                </span>
                            </div>

                            <div className="mb-4 border-t border-white/15" />

                            <div className="flex flex-wrap gap-2">
                                <span className="inline-flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[var(--on-brand)]">
                                    <Bus size={14} />
                                    Rute Lengkap
                                </span>
                                <span className="inline-flex items-center gap-1.5 rounded-none border border-white/20 bg-white/10 px-3 py-1 text-xs font-medium text-[var(--on-brand)]">
                                    <ShieldCheck size={14} />
                                    Aman
                                </span>
                            </div>
                        </div>
                    </motion.div>
                </Container>
            </section>

            {/* ── Features ── */}
            <section id="fitur" className="bg-[var(--brand)] py-24">
                <Container>
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]">
                            Kenapa Memilih Biwratravel?
                        </h2>
                        <p className="mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]">
                            Kami hadir untuk membuat perjalanan Anda lebih
                            nyaman dan terjangkau.
                        </p>
                    </motion.div>

                    <div className="grid gap-8 md:grid-cols-3">
                        {features.map((feature, index) => (
                            <motion.article
                                key={feature.title}
                                className="group rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] p-8 transition-colors duration-150 hover:bg-[var(--neutral-secondary-medium)]"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-40px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.15,
                                }}
                            >
                                <motion.div
                                    className="mb-5 inline-flex size-14 items-center justify-center rounded-none bg-[var(--brand-softer)] text-[var(--brand-strong)] transition-colors duration-150"
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                >
                                    <feature.icon size={24} />
                                </motion.div>
                                <h3 className="mb-2 text-xl font-medium text-[var(--heading)]">
                                    {feature.title}
                                </h3>
                                <p className="text-base leading-[1.7] text-[var(--body)]">
                                    {feature.description}
                                </p>
                            </motion.article>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── Gallery ── */}
            <section
                id="galeri"
                className="bg-[var(--neutral-secondary-soft)] py-24"
            >
                <Container>
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--heading)] md:text-[36px] lg:text-[44px]">
                            Galeri Perjalanan
                        </h2>
                        <p className="mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--body-subtle)]">
                            Lihat pengalaman perjalanan bersama Biwratravel
                            melalui foto-foto berikut.
                        </p>
                    </motion.div>

                    <div className="relative mx-auto max-w-4xl">
                        <div className="relative aspect-[16/9] overflow-hidden border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-xl">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={galleryIndex}
                                    className="absolute inset-0 bg-cover bg-center"
                                    style={{
                                        backgroundImage: `url(${GALLERY_IMAGES[galleryIndex].url})`,
                                    }}
                                    initial={{ opacity: 0, scale: 1.1 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.95 }}
                                    transition={{
                                        duration: 0.7,
                                        ease: 'easeInOut',
                                    }}
                                />
                            </AnimatePresence>

                            <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/60 to-transparent" />

                            <AnimatePresence mode="wait">
                                <motion.p
                                    key={galleryIndex + '-caption'}
                                    className="absolute right-6 bottom-4 left-6 text-sm text-white md:text-base"
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.4 }}
                                >
                                    {GALLERY_IMAGES[galleryIndex].caption}
                                </motion.p>
                            </AnimatePresence>
                        </div>

                        <button
                            type="button"
                            onClick={prevGallery}
                            className="absolute top-1/2 -left-4 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--heading)] shadow-lg transition-colors hover:bg-[var(--neutral-tertiary)]"
                            aria-label="Gambar sebelumnya"
                        >
                            <ChevronLeft size={22} />
                        </button>
                        <button
                            type="button"
                            onClick={nextGallery}
                            className="absolute top-1/2 -right-4 z-10 flex size-12 -translate-y-1/2 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--heading)] shadow-lg transition-colors hover:bg-[var(--neutral-tertiary)]"
                            aria-label="Gambar berikutnya"
                        >
                            <ChevronRight size={22} />
                        </button>

                        <div className="mt-6 flex items-center justify-center gap-2">
                            {GALLERY_IMAGES.map((_, index) => (
                                <button
                                    key={index}
                                    type="button"
                                    onClick={() => setGalleryIndex(index)}
                                    className={`size-2.5 cursor-pointer border-none p-0 transition-all duration-300 ${
                                        index === galleryIndex
                                            ? 'w-8 bg-[var(--brand)]'
                                            : 'bg-[var(--border-default)] hover:bg-[var(--gray)]'
                                    }`}
                                    aria-label={`Gambar ke-${index + 1}`}
                                />
                            ))}
                        </div>
                    </div>
                </Container>
            </section>

            {/* ── Parallax ── */}
            <section
                className="relative h-[500px] overflow-hidden bg-cover bg-fixed bg-center"
                style={{
                    backgroundImage: `url(${PARALLAX_IMG})`,
                }}
            >
                <div className="absolute inset-0 bg-[var(--brand)]/70" />

                <Container className="relative flex h-full flex-col items-center justify-center text-center">
                    <motion.h2
                        className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Setiap Perjalanan Punya Cerita
                    </motion.h2>
                    <motion.p
                        className="mb-10 max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.15 }}
                    >
                        Bersama Biwratravel, setiap kilometer adalah kenangan.
                        Nikmati perjalanan Anda dengan armada bus terbaik kami.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.3 }}
                    >
                        <Button variant="white" size="large">
                            Jelajahi Rute
                            <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                </Container>
            </section>

            {/* ── How It Works ── */}
            <section id="cara-pesan" className="bg-[var(--brand)] py-24">
                <Container>
                    <motion.div
                        className="mb-12 text-center"
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: '-60px' }}
                        transition={{ duration: 0.6 }}
                    >
                        <h2 className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]">
                            Cara Pesan Tiket
                        </h2>
                        <p className="mx-auto max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]">
                            Hanya 4 langkah mudah untuk memesan tiket bus impian
                            Anda.
                        </p>
                    </motion.div>

                    <div className="relative grid gap-6 md:grid-cols-2">
                        <div
                            className="pointer-events-none absolute hidden md:block"
                            style={{
                                inset: '48px -24px 48px -24px',
                            }}
                        >
                            <svg
                                className="absolute"
                                style={{
                                    top: '20%',
                                    left: 'calc(50% + 12px)',
                                    width: 'calc(50% - 24px)',
                                }}
                                height="2"
                                viewBox="0 0 200 2"
                            >
                                <line
                                    x1="0"
                                    y1="1"
                                    x2="190"
                                    y2="1"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    opacity="0.5"
                                />
                                <polygon
                                    points="200,1 190,-4 190,6"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </svg>
                            <svg
                                className="absolute"
                                style={{
                                    top: 'calc(50% + 12px)',
                                    right: '0',
                                    height: 'calc(50% - 12px)',
                                }}
                                width="2"
                                viewBox="0 0 2 200"
                            >
                                <line
                                    x1="1"
                                    y1="0"
                                    x2="1"
                                    y2="190"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    opacity="0.5"
                                />
                                <polygon
                                    points="1,200 -4,190 6,190"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </svg>
                            <svg
                                className="absolute"
                                style={{
                                    top: 'calc(50% + 12px)',
                                    left: '0',
                                    height: 'calc(50% - 12px)',
                                }}
                                width="2"
                                viewBox="0 0 2 200"
                            >
                                <line
                                    x1="1"
                                    y1="0"
                                    x2="1"
                                    y2="190"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    opacity="0.5"
                                />
                                <polygon
                                    points="1,200 -4,190 6,190"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </svg>
                            <svg
                                className="absolute"
                                style={{
                                    top: 'calc(50% + 12px)',
                                    left: 'calc(50% + 12px)',
                                    width: 'calc(50% - 24px)',
                                }}
                                height="2"
                                viewBox="0 0 200 2"
                            >
                                <line
                                    x1="0"
                                    y1="1"
                                    x2="190"
                                    y2="1"
                                    stroke="white"
                                    strokeWidth="2"
                                    strokeDasharray="6 6"
                                    opacity="0.5"
                                />
                                <polygon
                                    points="200,1 190,-4 190,6"
                                    fill="white"
                                    opacity="0.5"
                                />
                            </svg>
                        </div>

                        <div className="pointer-events-none absolute top-0 left-[27px] hidden h-full w-px border-l-2 border-dashed border-white/30 max-md:block" />

                        {steps.map((step, index) => (
                            <motion.article
                                key={step.title}
                                className="group relative flex flex-col overflow-hidden rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary-soft)] shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:flex-row"
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true, margin: '-50px' }}
                                transition={{
                                    duration: 0.5,
                                    delay: index * 0.12,
                                }}
                            >
                                <div className="aspect-[4/3] shrink-0 overflow-hidden sm:aspect-auto sm:w-48 md:w-56">
                                    <motion.div
                                        className="h-full bg-cover bg-center"
                                        style={{
                                            backgroundImage: `url(${step.image})`,
                                        }}
                                        whileHover={{ scale: 1.08 }}
                                        transition={{ duration: 0.4 }}
                                    />
                                </div>
                                <div className="relative flex flex-1 flex-col justify-center p-6">
                                    <span className="mb-3 inline-flex size-8 items-center justify-center rounded-none bg-[var(--brand)] text-sm font-bold text-[var(--on-brand)]">
                                        {index + 1}
                                    </span>

                                    <h3 className="mb-1 text-lg font-medium text-[var(--heading)]">
                                        {step.title}
                                    </h3>
                                    <p className="text-sm leading-[1.6] text-[var(--body-subtle)]">
                                        {step.description}
                                    </p>
                                </div>

                                {index < steps.length - 1 && (
                                    <ChevronDown
                                        size={20}
                                        className="absolute -bottom-3 left-1/2 z-10 -translate-x-1/2 text-white/50 md:hidden"
                                    />
                                )}
                            </motion.article>
                        ))}
                    </div>

                    <div className="mt-8 hidden justify-center gap-2 md:flex">
                        {steps.map((_, index) => (
                            <motion.span
                                key={index}
                                className="flex size-10 items-center justify-center rounded-none border border-white/20 bg-white/10 text-sm font-bold text-[var(--on-brand)]"
                                initial={{ opacity: 0, scale: 0.5 }}
                                whileInView={{ opacity: 1, scale: 1 }}
                                viewport={{ once: true }}
                                transition={{
                                    duration: 0.3,
                                    delay: index * 0.05,
                                }}
                            >
                                {index + 1}
                            </motion.span>
                        ))}
                    </div>
                </Container>
            </section>

            {/* ── CTA ── */}
            <section className="bg-[var(--brand)] py-24">
                <Container className="flex flex-col items-center text-center">
                    <motion.h2
                        className="mb-4 text-[28px] leading-[1.15] font-bold text-[var(--on-brand)] md:text-[36px] lg:text-[44px]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6 }}
                    >
                        Siap Bepergian?
                    </motion.h2>
                    <motion.p
                        className="mb-10 max-w-[65ch] text-base leading-[1.7] text-[var(--on-brand-muted)]"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.1 }}
                    >
                        Pesan tiket bus Anda sekarang dan nikmati perjalanan
                        yang nyaman bersama Biwratravel.
                    </motion.p>
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                    >
                        <Button variant="white" size="large">
                            Pesan Tiket Sekarang
                            <ArrowRight size={20} />
                        </Button>
                    </motion.div>
                </Container>
            </section>

            <Footer />
        </>
    );
}

const features = [
    {
        icon: Bus,
        title: 'Rute Lengkap',
        description:
            'Melayani berbagai rute antar kota di Sumatera Utara dan seluruh Indonesia. Dari Medan ke kota tujuan favorit Anda.',
    },
    {
        icon: ShieldCheck,
        title: 'Aman & Terpercaya',
        description:
            'Setiap transaksi divalidasi oleh admin kami. Data perjalanan Anda terlindungi dan aman.',
    },
    {
        icon: Ticket,
        title: 'Mudah & Cepat',
        description:
            'Pesan tiket dalam hitungan menit. Dapat digunakan di seluruh loket biwratravel tanpa ribet.',
    },
];

const steps = [
    {
        title: 'Pilih Rute & Jadwal',
        description:
            'Tentukan kota asal, kota tujuan, dan tanggal keberangkatan Anda. Sistem akan menampilkan semua bus yang tersedia.',
        image: STEP_IMAGES.route,
    },
    {
        title: 'Pilih Kursi & Data Penumpang',
        description:
            'Pilih kursi favorit Anda dan lengkapi data penumpang. Bisa pesan untuk beberapa orang sekaligus.',
        image: STEP_IMAGES.schedule,
    },
    {
        title: 'Lakukan Pembayaran',
        description:
            'Bayar melalui transfer bank atau scan QRIS. Unggah bukti pembayaran dan admin kami akan memvalidasi.',
        image: STEP_IMAGES.payment,
    },
    {
        title: 'Nikmati Perjalanan',
        description:
            'Tukarkan kode booking di loket keberangkatan dan nikmati perjalanan Anda bersama Biwratravel!',
        image: STEP_IMAGES.travel,
    },
];
