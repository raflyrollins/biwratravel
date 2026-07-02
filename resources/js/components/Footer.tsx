import { Link } from '@inertiajs/react';

import Container from '@/components/Container';

export default function Footer() {
    return (
        <footer className="bg-[var(--brand)] py-12">
            <Container>
                <div className="grid gap-8 md:grid-cols-4">
                    <div className="md:col-span-2">
                        <Link
                            href="/"
                            className="text-lg font-bold text-[var(--on-brand)] no-underline"
                        >
                            biwratravel
                        </Link>
                        <p className="mt-3 max-w-sm text-sm leading-[1.6] text-[var(--on-brand-muted)]">
                            Solusi pemesanan tiket bus online terpercaya di
                            Indonesia. Perjalanan nyaman, harga terjangkau.
                        </p>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[var(--on-brand)]">
                            Navigasi
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--on-brand-muted)]">
                            {[
                                ['Beranda', '#beranda'],
                                ['Fitur', '#fitur'],
                                ['Cara Pesan', '#cara-pesan'],
                            ].map(([label, href]) => (
                                <li key={label}>
                                    <a
                                        href={href}
                                        className="transition-colors hover:text-[var(--on-brand)]"
                                    >
                                        {label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="mb-4 text-sm font-semibold text-[var(--on-brand)]">
                            Kontak
                        </h4>
                        <ul className="space-y-2 text-sm text-[var(--on-brand-muted)]">
                            <li>Medan, Sumatera Utara</li>
                            <li>info@biwratravel.com</li>
                            <li>+62 821 1234 5678</li>
                        </ul>
                    </div>
                </div>

                <div className="mt-10 border-t border-white/15 pt-6 text-center text-sm text-[var(--on-brand-muted)]">
                    &copy; {new Date().getFullYear()} Biwratravel. All rights
                    reserved.
                </div>
            </Container>
        </footer>
    );
}
