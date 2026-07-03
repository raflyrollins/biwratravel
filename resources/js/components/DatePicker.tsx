import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
    error?: string;
    placeholder?: string;
    className?: string;
}

const WEEKDAYS = ['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'];
const MONTHS = [
    'Januari',
    'Februari',
    'Maret',
    'April',
    'Mei',
    'Juni',
    'Juli',
    'Agustus',
    'September',
    'Oktober',
    'November',
    'Desember',
];

const DECADE_SIZE = 12;
const ESTIMATED_PANEL_HEIGHT = 320;
const GAP = 4;
const MARGIN = 8;

export default function DatePicker({
    value,
    onChange,
    label,
    id,
    error,
    placeholder = 'Pilih tanggal',
    className,
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const [showYearPicker, setShowYearPicker] = useState(false);
    const [openUpward, setOpenUpward] = useState(false);
    const triggerRef = useRef<HTMLButtonElement>(null);
    const panelRef = useRef<HTMLDivElement>(null);
    const today = useMemo(() => new Date(), []);
    const selectedDate = value ? new Date(value + 'T00:00:00') : null;
    const [viewMonth, setViewMonth] = useState(
        selectedDate?.getMonth() ?? today.getMonth(),
    );
    const [viewYear, setViewYear] = useState(
        selectedDate?.getFullYear() ?? today.getFullYear(),
    );
    const [decadeStart, setDecadeStart] = useState(
        Math.floor((selectedDate?.getFullYear() ?? today.getFullYear()) / DECADE_SIZE) * DECADE_SIZE,
    );

    const decadeYears = useMemo(() => {
        const y: number[] = [];
        for (let i = 0; i < DECADE_SIZE; i++) {
            y.push(decadeStart + i);
        }
        return y;
    }, [decadeStart]);

    useLayoutEffect(() => {
        if (!open) return;

        function calculatePosition() {
            const trigger = triggerRef.current;
            const panel = panelRef.current;
            if (!trigger || !panel) return;

            const triggerRect = trigger.getBoundingClientRect();
            const panelHeight = panel.offsetHeight;
            const viewportHeight = window.innerHeight;

            const spaceBelow = viewportHeight - triggerRect.bottom;
            const spaceAbove = triggerRect.top;
            const needed = panelHeight + GAP + MARGIN;

            setOpenUpward(spaceBelow < needed && spaceAbove >= needed);
        }

        calculatePosition();
        window.addEventListener('resize', calculatePosition);
        return () => {
            window.removeEventListener('resize', calculatePosition);
        };
    }, [open, showYearPicker]);

    const calendarDays = useMemo(() => {
        const firstDay = new Date(viewYear, viewMonth, 1).getDay();
        const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
        const cells: (number | null)[] = Array.from(
            { length: firstDay },
            () => null,
        );

        for (let d = 1; d <= daysInMonth; d++) {
            cells.push(d);
        }

        return cells;
    }, [viewMonth, viewYear]);

    const prevMonth = useCallback(() => {
        if (viewMonth === 0) {
            setViewMonth(11);
            setViewYear((y) => y - 1);
        } else {
            setViewMonth((m) => m - 1);
        }
    }, [viewMonth]);

    const nextMonth = useCallback(() => {
        if (viewMonth === 11) {
            setViewMonth(0);
            setViewYear((y) => y + 1);
        } else {
            setViewMonth((m) => m + 1);
        }
    }, [viewMonth]);

    const prevYear = useCallback(() => {
        setViewYear((y) => y - 1);
    }, []);

    const nextYear = useCallback(() => {
        setViewYear((y) => y + 1);
    }, []);

    const prevDecade = useCallback(() => {
        setDecadeStart((d) => d - DECADE_SIZE);
    }, []);

    const nextDecade = useCallback(() => {
        setDecadeStart((d) => d + DECADE_SIZE);
    }, []);

    function isToday(day: number) {
        return (
            today.getFullYear() === viewYear &&
            today.getMonth() === viewMonth &&
            today.getDate() === day
        );
    }

    function isSelected(day: number) {
        if (!selectedDate) {
            return false;
        }

        return (
            selectedDate.getFullYear() === viewYear &&
            selectedDate.getMonth() === viewMonth &&
            selectedDate.getDate() === day
        );
    }

    function selectDay(day: number) {
        const month = String(viewMonth + 1).padStart(2, '0');
        const d = String(day).padStart(2, '0');
        onChange(`${viewYear}-${month}-${d}`);
        setOpen(false);
    }

    const displayValue = selectedDate
        ? `${selectedDate.getDate()} ${MONTHS[selectedDate.getMonth()]} ${selectedDate.getFullYear()}`
        : '';

    return (
        <div className="relative">
            {label && (
                <label
                    htmlFor={id}
                    className="mb-2 block text-sm font-medium text-[var(--heading)]"
                >
                    {label}
                </label>
            )}
            <button
                type="button"
                ref={triggerRef}
                id={id}
                onClick={() => {
                    if (open) {
                        setOpen(false);
                        setShowYearPicker(false);
                        return;
                    }

                    const trigger = triggerRef.current;
                    if (trigger) {
                        const triggerRect = trigger.getBoundingClientRect();
                        const viewportHeight = window.innerHeight;
                        const spaceBelow = viewportHeight - triggerRect.bottom;
                        const spaceAbove = triggerRect.top;
                        const needed = ESTIMATED_PANEL_HEIGHT + GAP + MARGIN;
                        setOpenUpward(spaceBelow < needed && spaceAbove >= needed);
                    } else {
                        setOpenUpward(false);
                    }

                    setOpen(true);
                }}
                className={`block w-full border text-left text-sm transition-all duration-200 focus:outline-none ${className ?? 'bg-[var(--neutral-tertiary)] px-4 py-3 dark:bg-white/10'} ${
                    error
                        ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                        : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                } ${displayValue ? 'text-[var(--heading)]' : 'text-[var(--body-subtle)]'}`}
            >
                {displayValue || placeholder}
            </button>
            {error && (
                <p className="mt-1.5 text-xs text-[var(--danger)]">{error}</p>
            )}

            {open && (
                <>
                    <div
                        className="fixed inset-0 z-30"
                        onClick={() => {
                            setOpen(false);
                            setShowYearPicker(false);
                        }}
                    />
                    <div
                        ref={panelRef}
                        className={`absolute z-40 w-[280px] border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-xl ${openUpward ? 'bottom-full mb-1' : 'mt-1'}`}
                    >
                        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-2 py-2">
                            <div className="flex items-center gap-1">
                                <button
                                    type="button"
                                    onClick={showYearPicker ? prevDecade : prevYear}
                                    className="flex size-7 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                                    aria-label={showYearPicker ? 'Dekade sebelumnya' : 'Tahun sebelumnya'}
                                >
                                    <ChevronsLeft size={14} />
                                </button>
                                {!showYearPicker && (
                                    <button
                                        type="button"
                                        onClick={prevMonth}
                                        className="flex size-7 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body)] transition-colors hover:text-[var(--heading)]"
                                        aria-label="Bulan sebelumnya"
                                    >
                                        <ChevronLeft size={16} />
                                    </button>
                                )}
                            </div>

                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => {
                                        if (!showYearPicker) {
                                            setDecadeStart(
                                                Math.floor(viewYear / DECADE_SIZE) * DECADE_SIZE,
                                            );
                                        }
                                        setShowYearPicker((s) => !s);
                                    }}
                                    className="cursor-pointer border-none bg-transparent px-1 text-sm font-medium text-[var(--heading)] transition-colors hover:text-[var(--fg-brand)]"
                                >
                                    {showYearPicker
                                        ? `${decadeStart}–${decadeStart + DECADE_SIZE - 1}`
                                        : `${MONTHS[viewMonth]} ${viewYear}`}
                                </button>
                            </div>

                            <div className="flex items-center gap-1">
                                {!showYearPicker && (
                                    <button
                                        type="button"
                                        onClick={nextMonth}
                                        className="flex size-7 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body)] transition-colors hover:text-[var(--heading)]"
                                        aria-label="Bulan berikutnya"
                                    >
                                        <ChevronRight size={16} />
                                    </button>
                                )}
                                <button
                                    type="button"
                                    onClick={showYearPicker ? nextDecade : nextYear}
                                    className="flex size-7 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body-subtle)] transition-colors hover:text-[var(--heading)]"
                                    aria-label={showYearPicker ? 'Dekade berikutnya' : 'Tahun berikutnya'}
                                >
                                    <ChevronsRight size={14} />
                                </button>
                            </div>
                        </div>

                        {showYearPicker ? (
                            <div className="grid grid-cols-4 gap-1 p-3" style={{ height: '216px' }}>
                                {decadeYears.map((yr) => (
                                    <button
                                        key={yr}
                                        type="button"
                                        onClick={() => {
                                            setViewYear(yr);
                                            setDecadeStart(
                                                Math.floor(yr / DECADE_SIZE) * DECADE_SIZE,
                                            );
                                            setShowYearPicker(false);
                                        }}
                                        className={`flex cursor-pointer items-center justify-center border-none text-sm transition-colors ${
                                            yr === viewYear
                                                ? 'bg-[var(--brand)] font-medium text-[var(--on-brand)]'
                                                : yr === today.getFullYear()
                                                  ? 'bg-[var(--brand-softer)] text-[var(--fg-brand)] hover:bg-[var(--brand-soft)]'
                                                  : 'bg-transparent text-[var(--heading)] hover:bg-[var(--neutral-tertiary-soft)]'
                                        }`}
                                    >
                                        {yr}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="grid grid-cols-7 gap-px bg-[var(--border-default-subtle)] p-2">
                                {WEEKDAYS.map((day) => (
                                    <div
                                        key={day}
                                        className="py-1 text-center text-xs font-medium text-[var(--body-subtle)]"
                                    >
                                        {day}
                                    </div>
                                ))}
                                {calendarDays.map((day, i) =>
                                    day === null ? (
                                        <div key={`empty-${i}`} />
                                    ) : (
                                        <button
                                            key={day}
                                            type="button"
                                            onClick={() => selectDay(day)}
                                            className={`cursor-pointer border-none py-2 text-center text-sm transition-colors ${
                                                isSelected(day)
                                                    ? 'bg-[var(--brand)] font-medium text-[var(--on-brand)]'
                                                    : isToday(day)
                                                      ? 'bg-[var(--brand-softer)] text-[var(--fg-brand)] hover:bg-[var(--brand-soft)]'
                                                      : 'bg-transparent text-[var(--heading)] hover:bg-[var(--neutral-tertiary-soft)]'
                                            }`}
                                        >
                                            {day}
                                        </button>
                                    ),
                                )}
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}
