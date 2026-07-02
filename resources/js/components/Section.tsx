import type { ReactNode } from 'react';

interface SectionProps {
    children: ReactNode;
    className?: string;
}

export default function Section({ children, className = '' }: SectionProps) {
    return (
        <section className={`bg-[var(--brand)] py-24 ${className}`}>
            {children}
        </section>
    );
}
