import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useMemo, useState } from 'react';

interface DatePickerProps {
    value: string;
    onChange: (value: string) => void;
    label?: string;
    id?: string;
    error?: string;
    placeholder?: string;
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

export default function DatePicker({
    value,
    onChange,
    label,
    id,
    error,
    placeholder = 'Pilih tanggal',
}: DatePickerProps) {
    const [open, setOpen] = useState(false);
    const today = useMemo(() => new Date(), []);
    const selectedDate = value ? new Date(value + 'T00:00:00') : null;
    const [viewMonth, setViewMonth] = useState(
        selectedDate?.getMonth() ?? today.getMonth(),
    );
    const [viewYear, setViewYear] = useState(
        selectedDate?.getFullYear() ?? today.getFullYear(),
    );

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
                id={id}
                onClick={() => setOpen((o) => !o)}
                className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-left text-sm transition-all duration-200 focus:outline-none dark:bg-white/10 ${
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
                        onClick={() => setOpen(false)}
                    />
                    <div className="absolute z-40 mt-1 w-[280px] border border-[var(--border-default)] bg-[var(--neutral-primary)] shadow-xl">
                        <div className="flex items-center justify-between border-b border-[var(--border-default)] px-4 py-3">
                            <button
                                type="button"
                                onClick={prevMonth}
                                className="flex size-8 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body)] transition-colors hover:text-[var(--heading)]"
                                aria-label="Bulan sebelumnya"
                            >
                                <ChevronLeft size={18} />
                            </button>
                            <span className="text-sm font-medium text-[var(--heading)]">
                                {MONTHS[viewMonth]} {viewYear}
                            </span>
                            <button
                                type="button"
                                onClick={nextMonth}
                                className="flex size-8 cursor-pointer items-center justify-center border-none bg-transparent text-[var(--body)] transition-colors hover:text-[var(--heading)]"
                                aria-label="Bulan berikutnya"
                            >
                                <ChevronRight size={18} />
                            </button>
                        </div>

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
                    </div>
                </>
            )}
        </div>
    );
}
