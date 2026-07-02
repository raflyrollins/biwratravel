import { Head, router } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { useState } from 'react';

import Sidebar, { MobileSidebarToggle } from '@/components/Sidebar';
import ThemeToggle from '@/components/ThemeToggle';

interface DashboardLayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function DashboardLayout({
    children,
    title,
}: DashboardLayoutProps) {
    const [sidebarOpen, setSidebarOpen] = useState(false);

    return (
        <div className="flex min-h-dvh bg-[var(--neutral-secondary-soft)]">
            <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

            <div className="flex flex-1 flex-col">
                <header className="flex h-16 items-center gap-4 border-b border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 lg:px-6">
                    <MobileSidebarToggle onClick={() => setSidebarOpen(true)} />

                    <div className="flex-1" />

                    <ThemeToggle />

                    <button
                        type="button"
                        onClick={() => router.post('/logout')}
                        className="flex cursor-pointer items-center gap-2 border-none bg-transparent px-3 py-2 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:text-[var(--heading)]"
                    >
                        <LogOut size={16} />
                        <span className="hidden sm:inline">Keluar</span>
                    </button>
                </header>

                <main className="flex-1 p-4 lg:p-6">
                    {title && <Head title={title} />}
                    {children}
                </main>
            </div>
        </div>
    );
}
