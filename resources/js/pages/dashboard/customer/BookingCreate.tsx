import { Head, router, usePage } from '@inertiajs/react';
import {
    Bus,
    CalendarDays,
    Clock,
    MapPin,
    Minus,
    Plus,
    Route,
    Users,
} from 'lucide-react';
import { type FormEvent, useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/DatePicker';

interface Trip {
    uuid: string;
    departure_date: string;
    departure_time: string;
    estimated_arrival: string | null;
    bus: { name: string; plate_number: string };
    route: {
        name: string;
        origin_city: { name: string };
        destination_city: { name: string };
    };
}

interface SavedPassenger {
    id: number;
    nik: string;
    name: string;
    gender: string;
    birth_date: string;
}

interface BookingCreateProps {
    trip: Trip;
    price_per_seat: number;
    origin_id: number;
    destination_id: number;
    saved_passengers: SavedPassenger[];
}

interface PassengerInput {
    nik: string;
    name: string;
    gender: string;
    birth_date: string;
}

export default function BookingCreate({
    trip,
    price_per_seat,
    origin_id,
    destination_id,
    saved_passengers,
}: BookingCreateProps) {
    const { auth } = usePage().props as {
        auth: { user?: { name: string; email: string } | null };
    };

    const [customerName, setCustomerName] = useState(auth?.user?.name ?? '');
    const [customerPhone, setCustomerPhone] = useState('');
    const [customerEmail, setCustomerEmail] = useState(auth?.user?.email ?? '');
    const [passengers, setPassengers] = useState<PassengerInput[]>([
        { nik: '', name: '', gender: 'L', birth_date: '' },
    ]);
    const [submitting, setSubmitting] = useState(false);

    const totalPrice = price_per_seat * passengers.length;

    function addPassenger() {
        setPassengers((prev) => [
            ...prev,
            { nik: '', name: '', gender: 'L', birth_date: '' },
        ]);
    }

    function removePassenger(index: number) {
        setPassengers((prev) => prev.filter((_, i) => i !== index));
    }

    function updatePassenger(
        index: number,
        field: keyof PassengerInput,
        value: string,
    ) {
        setPassengers((prev) =>
            prev.map((p, i) => (i === index ? { ...p, [field]: value } : p)),
        );
    }

    function selectSavedPassenger(id: number) {
        const sp = saved_passengers.find((p) => p.id === id);
        if (!sp) return;

        const firstEmpty = passengers.findIndex(
            (p) => !p.nik && !p.name,
        );
        const target = firstEmpty >= 0 ? firstEmpty : passengers.length - 1;

        setPassengers((prev) =>
            prev.map((p, i) =>
                i === target
                    ? { nik: sp.nik, name: sp.name, gender: sp.gender, birth_date: sp.birth_date }
                    : p,
            ),
        );
    }

    function handleSubmit(e: FormEvent) {
        e.preventDefault();
        setSubmitting(true);

        const data = {
            trip_id: trip.uuid,
            origin_id,
            destination_id,
            customer_name: customerName,
            customer_phone: customerPhone,
            customer_email: customerEmail,
            passengers: passengers.map((p) => ({ ...p })),
        };

        router.post('/dashboard/customer/booking', data, {
            onFinish: () => setSubmitting(false),
            onError: () => setSubmitting(false),
        });
    }

    return (
        <DashboardLayout>
            <Head title="Pesan Tiket" />

            <div className="mx-auto max-w-3xl">
                <h1 className="mb-6 text-xl font-bold text-[var(--heading)]">
                    Pesan Tiket
                </h1>

                <div className="mb-6 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                    <h2 className="mb-3 text-sm font-semibold text-[var(--body)]">
                        Detail Perjalanan
                    </h2>
                    <div className="grid gap-3 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <Route className="h-4 w-4 shrink-0 text-[var(--fg-brand)]" />
                            {trip.route.name}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <Bus className="h-4 w-4 shrink-0" />
                            {trip.bus.name} ({trip.bus.plate_number})
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            {trip.departure_date}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <Clock className="h-4 w-4 shrink-0" />
                            {trip.departure_time}
                            {trip.estimated_arrival &&
                                ` - ${trip.estimated_arrival}`}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <MapPin className="h-4 w-4 shrink-0" />
                            {trip.route.origin_city.name} →{' '}
                            {trip.route.destination_city.name}
                        </div>
                        <div className="flex items-center gap-2 font-medium text-[var(--fg-brand)]">
                            Rp {price_per_seat.toLocaleString('id-ID')} / orang
                        </div>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <h2 className="mb-3 text-sm font-semibold text-[var(--body)]">
                            Data Pemesan
                        </h2>
                        <div className="grid gap-3 md:grid-cols-3">
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                    Nama{' '}
                                    <span className="text-[var(--fg-danger)]">*</span>
                                </label>
                                <input
                                    type="text"
                                    value={customerName}
                                    onChange={(e) => setCustomerName(e.target.value)}
                                    required
                                    className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                    No. Telepon
                                </label>
                                <input
                                    type="text"
                                    inputMode="tel"
                                    value={customerPhone}
                                    onChange={(e) => setCustomerPhone(e.target.value)}
                                    className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                />
                            </div>
                            <div>
                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    value={customerEmail}
                                    onChange={(e) => setCustomerEmail(e.target.value)}
                                    className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <div className="mb-3 flex items-center justify-between">
                            <h2 className="text-sm font-semibold text-[var(--body)]">
                                Data Penumpang
                            </h2>
                            <button
                                type="button"
                                onClick={addPassenger}
                                className="flex cursor-pointer items-center gap-1 text-sm font-medium text-[var(--fg-brand)] hover:text-[var(--brand-strong)]"
                            >
                                <Plus className="h-4 w-4" />
                                Tambah
                            </button>
                        </div>

                        {saved_passengers.length > 0 && (
                            <div className="mb-3">
                                <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                    Penumpang Tersimpan
                                </label>
                                <select
                                    defaultValue=""
                                    onChange={(e) => {
                                        const val = e.target.value;
                                        if (val) selectSavedPassenger(Number(val));
                                    }}
                                    className="h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2 focus:ring-[var(--brand)]"
                                >
                                    <option value="">Pilih penumpang tersimpan...</option>
                                    {saved_passengers.map((sp) => (
                                        <option key={sp.id} value={sp.id}>
                                            {sp.name} ({sp.nik})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        <div className="space-y-3">
                            {passengers.map((p, i) => (
                                <div
                                    key={i}
                                    className="rounded-none border border-[var(--border-default)] bg-[var(--bg)] p-3"
                                >
                                    <div className="mb-2 flex items-center justify-between">
                                        <span className="text-xs font-medium text-[var(--body-subtle)]">
                                            Penumpang {i + 1}
                                        </span>
                                        {passengers.length > 1 && (
                                            <button
                                                type="button"
                                                onClick={() => removePassenger(i)}
                                                className="flex cursor-pointer items-center gap-1 text-xs text-[var(--fg-danger)] hover:underline"
                                            >
                                                <Minus className="h-3 w-3" />
                                                Hapus
                                            </button>
                                        )}
                                    </div>
                                    <div className="grid gap-3 md:grid-cols-4">
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                NIK{' '}
                                                <span className="text-[var(--fg-danger)]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                inputMode="numeric"
                                                value={p.nik}
                                                onInput={(e) => {
                                                    const el = e.currentTarget;
                                                    el.value = el.value.replace(/\D/g, '');
                                                }}
                                                onChange={(e) =>
                                                    updatePassenger(i, 'nik', e.target.value)
                                                }
                                                required
                                                maxLength={16}
                                                className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                Nama{' '}
                                                <span className="text-[var(--fg-danger)]">*</span>
                                            </label>
                                            <input
                                                type="text"
                                                value={p.name}
                                                onChange={(e) =>
                                                    updatePassenger(i, 'name', e.target.value)
                                                }
                                                required
                                                className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                            />
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                JK{' '}
                                                <span className="text-[var(--fg-danger)]">*</span>
                                            </label>
                                            <select
                                                value={p.gender}
                                                onChange={(e) =>
                                                    updatePassenger(i, 'gender', e.target.value)
                                                }
                                                required
                                                className="focus:ring-[var(--brand)] h-10 w-full rounded-none border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-3 text-sm text-[var(--body)] outline-none focus:ring-2"
                                            >
                                                <option value="L">Laki-laki</option>
                                                <option value="P">Perempuan</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                                Tanggal Lahir{' '}
                                                <span className="text-[var(--fg-danger)]">*</span>
                                            </label>
                                            <DatePicker
                                                value={p.birth_date}
                                                onChange={(v) =>
                                                    updatePassenger(i, 'birth_date', v)
                                                }
                                                placeholder="Tgl lahir"
                                                className="h-10 rounded-none border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] px-3 dark:bg-white/[0.06]"
                                            />
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="flex items-center justify-between rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <p className="text-sm text-[var(--body-subtle)]">
                            <Users className="mr-1 inline h-4 w-4" />
                            {passengers.length} penumpang × Rp{' '}
                            {price_per_seat.toLocaleString('id-ID')}
                        </p>
                        <div className="text-right">
                            <p className="text-xs text-[var(--body-subtle)]">Total</p>
                            <p className="text-xl font-bold text-[var(--fg-brand)]">
                                Rp {totalPrice.toLocaleString('id-ID')}
                            </p>
                        </div>
                    </div>

                    <div className="flex justify-end">
                        <Button
                            type="submit"
                            variant="brand"
                            size="large"
                            disabled={submitting}
                        >
                            {submitting ? 'Memproses...' : 'Lanjut ke Pembayaran'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
