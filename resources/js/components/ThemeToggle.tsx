import { Moon, Sun } from 'lucide-react';
import { useEffect, useState } from 'react';

export default function ThemeToggle() {
    const [isDark, setIsDark] = useState(() => {
        if (typeof document === 'undefined') {
return false;
}

        return document.documentElement.classList.contains('dark');
    });

    useEffect(() => {
        const mq = window.matchMedia('(prefers-color-scheme: dark)');

        const onSystemChange = (e: MediaQueryListEvent) => {
            const stored = localStorage.getItem('theme');

            if (!stored) {
                document.documentElement.classList.toggle('dark', e.matches);
                setIsDark(e.matches);
            }
        };

        mq.addEventListener('change', onSystemChange);

        return () => mq.removeEventListener('change', onSystemChange);
    }, []);

    function toggle() {
        const next = !isDark;

        setIsDark(next);
        document.documentElement.classList.toggle('dark', next);
        localStorage.setItem('theme', next ? 'dark' : 'light');
    }

    return (
        <button
            onClick={toggle}
            className="inline-flex size-10 items-center justify-center rounded-none text-[var(--on-brand-muted)] transition-colors duration-150 hover:text-[var(--on-brand)]"
            aria-label={isDark ? 'Mode terang' : 'Mode gelap'}
        >
            {isDark ? <Sun size={20} /> : <Moon size={20} />}
        </button>
    );
}
