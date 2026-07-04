import { Link, usePage } from '@inertiajs/react';
import {
    Bus,
    Building2,
    Calendar,
    ChartNoAxesColumn,
    Contact,
    LayoutDashboard,
    Map,
    MapPin,
    Menu,
    Search,
    ShoppingBag,
    Ticket,
    TicketCheck,
    Truck,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { useMemo } from 'react';

import type { Auth, UserRole } from '@/types/auth';

interface MenuItem {
    label: string;
    href: string;
    icon: typeof LayoutDashboard;
}

interface MenuGroup {
    label: string;
    items: MenuItem[];
}

interface SidebarProps {
    open: boolean;
    onClose: () => void;
}

const ALL_MENUS: MenuGroup[] = [
    {
        label: 'Umum',
        items: [
            { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
        ],
    },
    {
        label: 'Master Data',
        items: [
            { label: 'Kota', href: '/dashboard/cities', icon: MapPin },
            { label: 'Armada', href: '/dashboard/buses', icon: Bus },
            { label: 'Rute', href: '/dashboard/routes', icon: Map },
            { label: 'Jadwal', href: '/dashboard/trips', icon: Calendar },
            { label: 'Loket', href: '/dashboard/lokets', icon: Building2 },
            { label: 'Pengguna', href: '/dashboard/users', icon: Users },
        ],
    },
    {
        label: 'Transaksi',
        items: [
            { label: 'Booking', href: '/dashboard/bookings', icon: Ticket },
            { label: 'Pembayaran', href: '/dashboard/payments', icon: Wallet },
            { label: 'Charter', href: '/dashboard/charters', icon: Truck },
        ],
    },
    {
        label: 'Customer',
        items: [
            { label: 'Cari Tiket', href: '/dashboard/customer/search', icon: Search },
            {
                label: 'Pemesanan Saya',
                href: '/dashboard/customer/bookings',
                icon: ShoppingBag,
            },
            {
                label: 'Data Penumpang',
                href: '/dashboard/customer/passengers',
                icon: Contact,
            },
        ],
    },
    {
        label: 'Loket',
        items: [
            { label: 'Penjualan Tiket', href: '/dashboard/loket/booking/search', icon: Ticket },
            { label: 'Riwayat Penerbitan', href: '/dashboard/loket/bookings', icon: TicketCheck },
            { label: 'Cari Booking', href: '/dashboard/loket/booking/lookup', icon: Search },
        ],
    },
    {
        label: 'Lainnya',
        items: [
            {
                label: 'Laporan',
                href: '/dashboard/reports',
                icon: ChartNoAxesColumn,
            },
        ],
    },
];

const ROLE_MENUS: Record<UserRole, string[]> = {
    superadmin: ['Umum', 'Master Data', 'Transaksi', 'Lainnya'],
    admin_penjualan: ['Umum', 'Transaksi'],
    admin_charter: ['Umum'],
    driver: ['Umum'],
    petugas_loket: ['Umum', 'Loket'],
    customer: ['Umum', 'Customer'],
};

const ROLE_LABELS: Record<UserRole, string> = {
    superadmin: 'Superadmin',
    admin_penjualan: 'Admin Penjualan',
    admin_charter: 'Admin Charter',
    driver: 'Driver',
    petugas_loket: 'Petugas Loket',
    customer: 'Customer',
};

export default function Sidebar({ open, onClose }: SidebarProps) {
    const { url, props } = usePage();
    const { auth } = props as { auth: Auth };
    const role = auth.user?.role ?? 'customer';
    const filteredMenus = useMemo(() => {
        const allowedGroups = ROLE_MENUS[role] ?? [];

        return ALL_MENUS.filter((g) => allowedGroups.includes(g.label));
    }, [role]);

    return (
        <>
            {open && (
                <div
                    className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                    onClick={onClose}
                />
            )}

            <aside
                className={`fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-[var(--border-default)] bg-[var(--neutral-primary)] transition-transform duration-200 lg:static lg:translate-x-0 ${
                    open ? 'translate-x-0' : '-translate-x-full'
                }`}
            >
                <div className="flex h-16 items-center justify-between border-b border-[var(--border-default)] px-4">
                    <Link
                        href="/dashboard"
                        className="text-base font-bold text-[var(--heading)] no-underline"
                        onClick={onClose}
                    >
                        biwratravel
                    </Link>
                    <button
                        type="button"
                        onClick={onClose}
                        className="flex size-8 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body)] transition-colors hover:text-[var(--heading)] lg:hidden"
                        aria-label="Tutup sidebar"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="border-b border-[var(--border-default)] px-4 py-3">
                    <p className="text-sm font-medium text-[var(--heading)]">
                        {auth.user?.name ?? 'Guest'}{' '}
                    </p>
                    <p className="text-xs text-[var(--body-subtle)]">
                        {ROLE_LABELS[role]}
                    </p>
                </div>

                <nav className="flex-1 overflow-y-auto px-3 py-4">
                    {filteredMenus.map((group) => (
                        <div key={group.label} className="mb-6">
                            <p className="mb-2 px-3 text-xs font-semibold tracking-wider text-[var(--body-subtle)] uppercase">
                                {group.label}
                            </p>
                            <ul className="space-y-1">
                                {group.items.map((item) => {
                                    const isActive =
                                        url === item.href ||
                                        (item.href !== '/dashboard' && url.startsWith(item.href + '/'));
                                    const Icon = item.icon;

                                    return (
                                        <li key={item.href}>
                                            <Link
                                                href={item.href}
                                                onClick={onClose}
                                                className={`flex items-center gap-3 rounded-none px-3 py-2.5 text-sm font-medium no-underline transition-colors ${
                                                    isActive
                                                        ? 'bg-[var(--brand-softer)] text-[var(--fg-brand)]'
                                                        : 'text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)] hover:text-[var(--heading)]'
                                                }`}
                                            >
                                                <Icon size={18} />
                                                {item.label}
                                            </Link>
                                        </li>
                                    );
                                })}
                            </ul>
                        </div>
                    ))}
                </nav>

                <div className="border-t border-[var(--border-default)] p-3">
                    <Link
                        href="/"
                        className="flex items-center gap-2 rounded-none px-3 py-2 text-xs font-medium text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                    >
                        &larr; Kembali ke Beranda
                    </Link>
                </div>
            </aside>
        </>
    );
}

export function MobileSidebarToggle({ onClick }: { onClick: () => void }) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex size-10 cursor-pointer items-center justify-center border border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--heading)] transition-colors hover:bg-[var(--neutral-tertiary-soft)] lg:hidden"
            aria-label="Buka menu"
        >
            <Menu size={20} />
        </button>
    );
}
