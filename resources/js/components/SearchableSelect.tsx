import { Search, ChevronDown } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

interface Option {
    value: string;
    label: string;
}

interface SearchableSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
    label?: string;
    error?: string;
}

export default function SearchableSelect({
    options,
    value,
    onChange,
    placeholder = 'Pilih...',
    label,
    error,
}: SearchableSelectProps) {
    const [open, setOpen] = useState(false);
    const [search, setSearch] = useState('');
    const [highlightedIdx, setHighlightedIdx] = useState(-1);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const searchInputRef = useRef<HTMLInputElement>(null);

    const selected = options.find((o) => o.value === value);

    const filtered = search
        ? options.filter((o) =>
              o.label.toLowerCase().includes(search.toLowerCase()),
          )
        : options;

    useEffect(() => {
        function handleClickOutside(e: MouseEvent) {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setOpen(false);
                setSearch('');
            }
        }
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    useEffect(() => {
        if (open && searchInputRef.current) {
            searchInputRef.current.focus();
            setHighlightedIdx(-1);
        }
    }, [open]);

    function selectOption(opt: Option) {
        onChange(opt.value);
        setOpen(false);
        setSearch('');
    }

    function handleKeyDown(e: React.KeyboardEvent) {
        if (!open) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setHighlightedIdx((prev) =>
                    prev < filtered.length - 1 ? prev + 1 : 0,
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setHighlightedIdx((prev) =>
                    prev > 0 ? prev - 1 : filtered.length - 1,
                );
                break;
            case 'Enter':
                e.preventDefault();
                if (
                    highlightedIdx >= 0 &&
                    highlightedIdx < filtered.length
                ) {
                    selectOption(filtered[highlightedIdx]);
                }
                break;
            case 'Escape':
                e.preventDefault();
                setOpen(false);
                setSearch('');
                break;
        }
    }

    return (
        <div ref={wrapperRef} className="relative">
            {label && (
                <label className="mb-1.5 block text-xs font-medium text-[var(--body-subtle)]">
                    {label}
                </label>
            )}

            <button
                type="button"
                onClick={() => setOpen(!open)}
                className={`flex h-10 w-full cursor-pointer items-center justify-between border bg-[var(--neutral-primary)] px-3 text-sm outline-none transition-colors focus:border-[var(--brand)] ${
                    error
                        ? 'border-[var(--danger)]'
                        : 'border-[var(--border-default)]'
                } ${open ? 'border-[var(--brand)]' : ''}`}
            >
                <span
                    className={
                        selected
                            ? 'text-[var(--heading)]'
                            : 'text-[var(--body-subtle)]'
                    }
                >
                    {selected ? selected.label : placeholder}
                </span>
                <ChevronDown
                    size={16}
                    className={`shrink-0 text-[var(--body)] transition-transform ${
                        open ? 'rotate-180' : ''
                    }`}
                />
            </button>

            {open && (
                <div className="absolute left-0 right-0 top-full z-50 mt-1 border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-lg">
                    <div className="relative border-b border-[var(--border-default)]">
                        <Search
                            size={14}
                            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[var(--body-subtle)]"
                        />
                        <input
                            ref={searchInputRef}
                            type="text"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="Cari..."
                            className="w-full border-none bg-transparent py-2.5 pl-8 pr-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none"
                        />
                    </div>

                    <div className="max-h-48 overflow-y-auto">
                        {filtered.length === 0 && (
                            <div className="px-3 py-6 text-center text-sm text-[var(--body-subtle)]">
                                Tidak ditemukan
                            </div>
                        )}
                        {filtered.map((opt, idx) => (
                            <button
                                key={opt.value}
                                type="button"
                                onClick={() => selectOption(opt)}
                                onMouseEnter={() => setHighlightedIdx(idx)}
                                className={`flex w-full cursor-pointer items-center px-3 py-2 text-left text-sm transition-colors ${
                                    opt.value === value
                                        ? 'bg-[var(--brand-softer)] text-[var(--fg-brand)]'
                                        : idx === highlightedIdx
                                          ? 'bg-[var(--neutral-tertiary-soft)] text-[var(--heading)]'
                                          : 'text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]'
                                }`}
                            >
                                {opt.label}
                            </button>
                        ))}
                    </div>
                </div>
            )}

            {error && (
                <p className="mt-1 text-xs text-[var(--fg-danger)]">{error}</p>
            )}
        </div>
    );
}
