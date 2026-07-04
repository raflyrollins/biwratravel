import { Link, router, useForm } from '@inertiajs/react';
import { ArrowLeft, Loader2, Plus, Search, Trash2, UserCheck, UserPlus } from 'lucide-react';
import { type FormEvent, useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';
import DatePicker from '@/components/DatePicker';

interface Trip {
    uuid: string;
    departure_date: string;
    departure_time: string;
    estimated_arrival: string | null;
    bus: { name: string; plate_number: string; capacity: number };
    route: {
        name: string;
        origin_city: { name: string };
        destination_city: { name: string };
    };
}

interface CreateProps {
    trip: Trip;
    price_per_seat: number;
    origin_id: number;
    destination_id: number;
}

const MONTHS = [
    'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
    'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des',
];

function formatDate(dateStr: string): string {
    const d = new Date(dateStr + 'T00:00:00');
    return `${d.getDate()} ${MONTHS[d.getMonth()]} ${d.getFullYear()}`;
}

interface PassengerInput {
    nik: string;
    name: string;
    gender: string;
    birth_date: string;
}

export default function LoketBookingCreate({
    trip,
    price_per_seat,
    origin_id,
    destination_id,
}: CreateProps) {
    const { data, setData, errors, processing, post } = useForm({
        trip_id: trip.uuid,
        origin_id,
        destination_id,
        customer_name: '',
        customer_phone: '',
        customer_email: '',
        passengers: [
            { nik: '', name: '', gender: 'L', birth_date: '' },
        ] as PassengerInput[],
    });

    const [nikLoading, setNikLoading] = useState<Record<number, boolean>>({});
    const [nikFound, setNikFound] = useState<Record<number, boolean>>({});

    async function lookupNik(idx: number, nik: string) {
        if (nik.length !== 16) return;

        setNikLoading((prev) => ({ ...prev, [idx]: true }));
        setNikFound((prev) => ({ ...prev, [idx]: false }));

        try {
            const res = await fetch(`/dashboard/loket/passenger/lookup/${nik}`);
            const json = await res.json();

            if (json.found) {
                const updated = [...data.passengers];
                updated[idx] = {
                    ...updated[idx],
                    name: json.name,
                    gender: json.gender,
                    birth_date: json.birth_date,
                };
                setData('passengers', updated);
                setNikFound((prev) => ({ ...prev, [idx]: true }));
            }
        } catch {
            /* silent */
        } finally {
            setNikLoading((prev) => ({ ...prev, [idx]: false }));
        }
    }

    function handleNikKeyDown(
        idx: number,
        nik: string,
        e: React.KeyboardEvent<HTMLInputElement>,
    ) {
        if (e.key === 'Enter') {
            e.preventDefault();
            lookupNik(idx, nik);
        }
    }

    function addPassenger() {
        setData('passengers', [
            ...data.passengers,
            { nik: '', name: '', gender: 'L', birth_date: '' },
        ]);
    }

    function removePassenger(idx: number) {
        if (data.passengers.length <= 1) return;
        setData(
            'passengers',
            data.passengers.filter((_, i) => i !== idx),
        );
        setNikLoading((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
        });
        setNikFound((prev) => {
            const next = { ...prev };
            delete next[idx];
            return next;
        });
    }

    function updatePassenger(
        idx: number,
        field: keyof PassengerInput,
        value: string,
    ) {
        const updated = [...data.passengers];
        updated[idx] = { ...updated[idx], [field]: value };
        setData('passengers', updated);

        if (field !== 'nik') {
            setNikFound((prev) => ({ ...prev, [idx]: false }));
        }
    }

    function submit(e: FormEvent) {
        e.preventDefault();
        post('/dashboard/loket/booking');
    }

    const totalPrice = price_per_seat * data.passengers.length;

    return (
        <DashboardLayout title="Terbitkan Tiket">
            <div className="mx-auto max-w-3xl">
                <div className="mb-6">
                    <Link
                        href="/dashboard/loket/booking/search"
                        className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                    >
                        <ArrowLeft size={16} />
                        Kembali ke Pencarian
                    </Link>
                    <h1 className="text-2xl font-bold text-[var(--heading)]">
                        Terbitkan Tiket
                    </h1>
                </div>

                <div className="mb-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                    <h2 className="mb-3 text-base font-bold text-[var(--heading)]">
                        Detail Trip
                    </h2>
                    <div className="grid gap-x-6 gap-y-2 text-sm md:grid-cols-2">
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Rute:</span>
                            {trip.route.name}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Armada:</span>
                            {trip.bus.name} ({trip.bus.plate_number})
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Tanggal:</span>
                            {formatDate(trip.departure_date)}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Jam:</span>
                            {trip.departure_time}
                            {trip.estimated_arrival && ` - ${trip.estimated_arrival}`}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Harga/org:</span>
                            Rp {price_per_seat.toLocaleString('id-ID')}
                        </div>
                        <div className="flex items-center gap-2 text-[var(--body-subtle)]">
                            <span className="font-medium text-[var(--heading)]">Kapasitas:</span>
                            {trip.bus.capacity} kursi
                        </div>
                    </div>
                </div>

                <form onSubmit={submit}>
                    <div className="mb-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                            Data Pemesan
                        </h2>

                        <div className="mb-4">
                            <label
                                htmlFor="customer_name"
                                className="mb-1.5 block text-sm font-medium text-[var(--heading)]"
                            >
                                Nama Pemesan
                            </label>
                            <input
                                id="customer_name"
                                type="text"
                                value={data.customer_name}
                                onChange={(e) => setData('customer_name', e.target.value)}
                                className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10 ${
                                    errors.customer_name
                                        ? 'border-[var(--danger)]'
                                        : 'border-[var(--border-default)]'
                                }`}
                                placeholder="Nama pemesan"
                            />
                            {errors.customer_name && (
                                <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                    {errors.customer_name}
                                </p>
                            )}
                        </div>

                        <div className="mb-4">
                            <label
                                htmlFor="customer_phone"
                                className="mb-1.5 block text-sm font-medium text-[var(--heading)]"
                            >
                                Nomor Telepon
                            </label>
                            <input
                                id="customer_phone"
                                type="text"
                                value={data.customer_phone}
                                onChange={(e) => setData('customer_phone', e.target.value)}
                                className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10 ${
                                    errors.customer_phone
                                        ? 'border-[var(--danger)]'
                                        : 'border-[var(--border-default)]'
                                }`}
                                placeholder="Nomor telepon"
                            />
                            {errors.customer_phone && (
                                <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                    {errors.customer_phone}
                                </p>
                            )}
                        </div>

                        <div>
                            <label
                                htmlFor="customer_email"
                                className="mb-1.5 block text-sm font-medium text-[var(--heading)]"
                            >
                                Email
                            </label>
                            <input
                                id="customer_email"
                                type="email"
                                value={data.customer_email}
                                onChange={(e) => setData('customer_email', e.target.value)}
                                className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10 ${
                                    errors.customer_email
                                        ? 'border-[var(--danger)]'
                                        : 'border-[var(--border-default)]'
                                }`}
                                placeholder="Email (opsional)"
                            />
                            {errors.customer_email && (
                                <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                    {errors.customer_email}
                                </p>
                            )}
                        </div>
                    </div>

                    <div className="mb-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <div className="mb-4 flex items-center justify-between">
                            <h2 className="text-base font-bold text-[var(--heading)]">
                                Data Penumpang
                            </h2>
                            <button
                                type="button"
                                onClick={addPassenger}
                                className="inline-flex cursor-pointer items-center gap-1 bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                            >
                                <Plus size={14} />
                                Tambah Penumpang
                            </button>
                        </div>

                        {errors.passengers && (
                            <p className="mb-3 text-xs text-[var(--fg-danger)]">
                                {errors.passengers}
                            </p>
                        )}

                        {data.passengers.map((passenger, idx) => (
                            <div
                                key={idx}
                                className="mb-4 border border-[var(--border-default)] p-4"
                            >
                                <div className="mb-3 flex items-center justify-between">
                                    <span className="text-sm font-medium text-[var(--heading)]">
                                        Penumpang {idx + 1}
                                    </span>
                                    {data.passengers.length > 1 && (
                                        <button
                                            type="button"
                                            onClick={() => removePassenger(idx)}
                                            className="inline-flex cursor-pointer items-center gap-1 text-xs text-[var(--fg-danger)] transition-colors hover:text-[var(--fg-danger-strong)]"
                                        >
                                            <Trash2 size={14} />
                                            Hapus
                                        </button>
                                    )}
                                </div>

                                <div className="grid gap-4 sm:grid-cols-2">
                                    <div className="relative">
                                        <label className="mb-1.5 block text-xs font-medium text-[var(--body-subtle)]">
                                            NIK
                                        </label>
                                        <div className="relative">
                                            <input
                                                type="text"
                                                value={passenger.nik}
                                                onChange={(e) =>
                                                    updatePassenger(
                                                        idx,
                                                        'nik',
                                                        e.target.value.replace(/\D/g, '').slice(0, 16),
                                                    )
                                                }
                                                onKeyDown={(e) =>
                                                    handleNikKeyDown(idx, passenger.nik, e)
                                                }
                                                maxLength={16}
                                                className={`block w-full border bg-[var(--neutral-tertiary)] px-3 py-2.5 pr-16 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10 ${
                                                    errors[`passengers.${idx}.nik`]
                                                        ? 'border-[var(--danger)]'
                                                        : nikFound[idx]
                                                          ? 'border-[var(--success)]'
                                                          : 'border-[var(--border-default)]'
                                                }`}
                                                placeholder="16 digit NIK"
                                            />
                                            <div className="absolute right-2.5 top-1/2 -translate-y-1/2">
                                                {nikLoading[idx] ? (
                                                    <Loader2 className="h-4 w-4 animate-spin text-[var(--body-subtle)]" />
                                                ) : (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            lookupNik(idx, passenger.nik)
                                                        }
                                                        className={`cursor-pointer transition-colors ${
                                                            passenger.nik.length === 16
                                                                ? 'text-[var(--brand)] hover:text-[var(--brand-strong)]'
                                                                : 'text-[var(--body-subtle)]'
                                                        }`}
                                                        title="Cari penumpang"
                                                        disabled={passenger.nik.length !== 16}
                                                    >
                                                        <Search className="h-4 w-4" />
                                                    </button>
                                                )}
                                            </div>
                                        </div>
                                        {errors[`passengers.${idx}.nik`] && (
                                            <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                                {errors[`passengers.${idx}.nik`]}
                                            </p>
                                        )}
                                        {nikFound[idx] && (
                                            <p className="mt-1 flex items-center gap-1 text-xs text-[var(--success)]">
                                                <UserCheck className="h-3 w-3" />
                                                Data ditemukan
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[var(--body-subtle)]">
                                            Nama Lengkap
                                        </label>
                                        <input
                                            type="text"
                                            value={passenger.name}
                                            onChange={(e) =>
                                                updatePassenger(idx, 'name', e.target.value)
                                            }
                                            className={`block w-full border bg-[var(--neutral-tertiary)] px-3 py-2.5 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10 ${
                                                errors[`passengers.${idx}.name`]
                                                    ? 'border-[var(--danger)]'
                                                    : 'border-[var(--border-default)]'
                                            }`}
                                            placeholder="Nama sesuai KTP"
                                        />
                                        {errors[`passengers.${idx}.name`] && (
                                            <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                                {errors[`passengers.${idx}.name`]}
                                            </p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[var(--body-subtle)]">
                                            Jenis Kelamin
                                        </label>
                                        <select
                                            value={passenger.gender}
                                            onChange={(e) =>
                                                updatePassenger(idx, 'gender', e.target.value)
                                            }
                                            className="block w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2.5 text-sm text-[var(--heading)] outline-none transition-colors focus:border-[var(--brand)] dark:bg-white/10"
                                        >
                                            <option value="L">Laki-laki</option>
                                            <option value="P">Perempuan</option>
                                        </select>
                                    </div>

                                    <div>
                                        <label className="mb-1.5 block text-xs font-medium text-[var(--body-subtle)]">
                                            Tanggal Lahir
                                        </label>
                                        <DatePicker
                                            value={passenger.birth_date}
                                            onChange={(v) =>
                                                updatePassenger(idx, 'birth_date', v)
                                            }
                                            placeholder="Pilih tanggal lahir"
                                        />
                                        {errors[`passengers.${idx}.birth_date`] && (
                                            <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                                {errors[`passengers.${idx}.birth_date`]}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="mb-8 flex items-center justify-between border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                        <div>
                            <p className="text-sm text-[var(--body-subtle)]">
                                {data.passengers.length} penumpang × Rp{' '}
                                {price_per_seat.toLocaleString('id-ID')}
                            </p>
                            <p className="text-lg font-bold text-[var(--heading)]">
                                Total: Rp {totalPrice.toLocaleString('id-ID')}
                            </p>
                            <p className="text-xs text-[var(--success)]">
                                Pembayaran tunai — tiket langsung diterbitkan
                            </p>
                        </div>
                        <Button
                            type="submit"
                            variant="brand"
                            size="default"
                            disabled={processing}
                        >
                            <UserPlus className="h-4 w-4" />
                            {processing ? 'Menyimpan...' : 'Terbitkan Tiket'}
                        </Button>
                    </div>
                </form>
            </div>
        </DashboardLayout>
    );
}
