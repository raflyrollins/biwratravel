import { Link, router, usePage } from '@inertiajs/react';

import Button from '@/components/Button';
import ThemeToggle from '@/components/ThemeToggle';
import type { Auth } from '@/types';

const links = [
    { href: '/', label: 'Beranda' },
    { href: '/dashboard/customer/search', label: 'Cari Tiket' },
    { href: '#fitur', label: 'Fitur' },
    { href: '#cara-pesan', label: 'Cara Pesan' },
    { href: '#kontak', label: 'Kontak' },
];

export default function Navbar() {
    const { auth } = usePage().props as { auth: Auth };
    const user = auth.user;

    return (
        <nav className="fixed inset-x-0 top-0 z-50 backdrop-blur-md">
            <div className="mx-auto flex max-w-[1152px] items-center justify-between px-6 py-4">
                <Link
                    href="/"
                    className="text-lg font-bold text-[var(--on-brand)] no-underline"
                >
                    biwratravel
                </Link>

                <div className="hidden items-center gap-6 md:flex">
                    {links.map((link) => (
                        <a
                            key={link.href}
                            href={link.href}
                            className="text-sm font-medium text-[var(--on-brand-muted)] no-underline transition-colors duration-150 hover:text-[var(--on-brand)]"
                        >
                            {link.label}
                        </a>
                    ))}
                </div>

                <div className="flex items-center gap-2">
                    <ThemeToggle />
                    {user ? (
                        <Button
                            variant="white"
                            size="default"
                            onClick={() => router.post('/logout')}
                            className="text-sm"
                        >
                            Keluar
                        </Button>
                    ) : (
                        <Link href="/login">
                            <Button
                                variant="white"
                                size="default"
                                className="text-sm"
                            >
                                Masuk
                            </Button>
                        </Link>
                    )}
                </div>
            </div>
        </nav>
    );
}
