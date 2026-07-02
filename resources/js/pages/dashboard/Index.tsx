import { usePage } from '@inertiajs/react';
import { Bus, Calendar, MapPin, Ticket } from 'lucide-react';

import DashboardLayout from '@/components/DashboardLayout';

interface Stats {
    totalCities?: number;
    totalBuses?: number;
    totalTrips?: number;
    totalBookings?: number;
    pendingPayments?: number;
    pendingCharters?: number;
    todayTrips?: number;
    todayBookings?: number;
    myBookings?: number;
}

interface DashboardProps {
    stats: Stats;
}

export default function DashboardIndex({ stats }: DashboardProps) {
    const { auth } = usePage().props as { auth: { user: { name: string } } };

    const cards = [
        {
            label: 'Kota',
            value: stats.totalCities,
            icon: MapPin,
            color: 'text-[var(--fg-brand)] bg-[var(--brand-softer)]',
        },
        {
            label: 'Armada',
            value: stats.totalBuses,
            icon: Bus,
            color: 'text-[var(--fg-success-strong)] bg-[var(--success-soft)]',
        },
        {
            label: 'Jadwal',
            value: stats.totalTrips,
            icon: Calendar,
            color: 'text-[var(--fg-warning)] bg-[var(--warning-soft)]',
        },
        {
            label: 'Booking',
            value: stats.totalBookings,
            icon: Ticket,
            color: 'text-[var(--fg-danger-strong)] bg-[var(--danger-soft)]',
        },
    ].filter((c) => c.value !== undefined);

    const otherCards = [
        { label: 'Pembayaran Pending', value: stats.pendingPayments },
        { label: 'Pengajuan Charter', value: stats.pendingCharters },
        { label: 'Jadwal Hari Ini', value: stats.todayTrips },
        { label: 'Booking Hari Ini', value: stats.todayBookings },
        { label: 'Booking Saya', value: stats.myBookings },
    ].filter((c) => c.value !== undefined);

    return (
        <DashboardLayout title="Dashboard">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    Selamat Datang, {auth.user?.name}!
                </h1>
                <p className="mt-1 text-sm text-[var(--body-subtle)]">
                    Ringkasan aktivitas sistem Biwratravel.
                </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {cards.map((card) => {
                    const Icon = card.icon;

                    return (
                        <div
                            key={card.label}
                            className="flex items-center gap-4 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
                        >
                            <div
                                className={`inline-flex size-12 items-center justify-center ${card.color}`}
                            >
                                <Icon size={24} />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-[var(--heading)]">
                                    {card.value ?? 0}
                                </p>
                                <p className="text-sm text-[var(--body-subtle)]">
                                    {card.label}
                                </p>
                            </div>
                        </div>
                    );
                })}

                {otherCards.map((card) => (
                    <div
                        key={card.label}
                        className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6"
                    >
                        <p className="text-2xl font-bold text-[var(--heading)]">
                            {card.value ?? 0}
                        </p>
                        <p className="text-sm text-[var(--body-subtle)]">
                            {card.label}
                        </p>
                    </div>
                ))}
            </div>

            {cards.length === 0 && otherCards.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                    <p className="text-lg font-medium text-[var(--heading)]">
                        Dashboard
                    </p>
                    <p className="mt-2 text-sm text-[var(--body-subtle)]">
                        Data ringkasan akan muncul di sini.
                    </p>
                </div>
            )}
        </DashboardLayout>
    );
}
