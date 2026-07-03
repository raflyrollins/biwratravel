import { Head, router, usePage } from '@inertiajs/react';
import {
    AlertCircle,
    Bus,
    CalendarDays,
    CheckCircle2,
    Clock,
    CreditCard,
    MapPin,
    Route,
    Timer,
    Upload,
    Users,
} from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

import Button from '@/components/Button';
import DashboardLayout from '@/components/DashboardLayout';

interface Payment {
    id: number;
    uuid: string;
    amount: number;
    method: string;
    proof_image: string | null;
    status: string;
    notes: string | null;
    created_at: string;
}

interface Booking {
    uuid: string;
    booking_code: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    total_passengers: number;
    total_price: number;
    status: string;
    created_at: string;
    trip: {
        bus: { name: string; plate_number: string };
        route: {
            name: string;
            origin_city: { name: string };
            destination_city: { name: string };
        };
        departure_date: string;
        departure_time: string;
        estimated_arrival: string | null;
    };
    passengers: { id: number; nik: string; name: string; gender: string; birth_date: string }[];
    origin_city: { name: string };
    destination_city: { name: string };
}

interface BookingPaymentProps {
    booking: Booking;
    latest_payment: Payment | null;
    deadline: string;
}

const BANK_ACCOUNTS = [
    { bank: 'Bank Mandiri', account: '123-00-4567890-1', name: 'PT Biwratravel' },
    { bank: 'Bank BCA', account: '0987654321', name: 'PT Biwratravel' },
    { bank: 'Bank BRI', account: '1234-01-567890-0', name: 'PT Biwratravel' },
];

export default function BookingPayment({
    booking,
    latest_payment,
    deadline,
}: BookingPaymentProps) {
    const { errors } = usePage().props as {
        errors: Record<string, string>;
        flash?: { success?: string };
    };
    const { flash } = usePage().props as { flash?: { success?: string } };

    const [timeLeft, setTimeLeft] = useState('');
    const [expired, setExpired] = useState(false);
    const MAX_SIZE_MB = 2;
    const MAX_SIZE_BYTES = MAX_SIZE_MB * 1024 * 1024;
    const [file, setFile] = useState<File | null>(null);
    const [fileError, setFileError] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const fileRef = useRef<HTMLInputElement>(null);

    const isPending = latest_payment?.status === 'pending';
    const isApproved = latest_payment?.status === 'approved';
    const isFinal = booking.status !== 'awaiting_payment';

    useEffect(() => {
        if (isFinal) return;

        function tick() {
            const diff = new Date(deadline).getTime() - Date.now();
            if (diff <= 0) {
                setTimeLeft('Waktu habis');
                setExpired(true);
                return;
            }
            const minutes = Math.floor(diff / 60000);
            const seconds = Math.floor((diff % 60000) / 1000);
            setTimeLeft(`${minutes}:${seconds.toString().padStart(2, '0')}`);
        }

        tick();
        const interval = setInterval(tick, 1000);
        return () => clearInterval(interval);
    }, [deadline, isFinal]);

    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const f = e.target.files?.[0];
        if (f) {
            if (f.size > MAX_SIZE_BYTES) {
                setFileError(`Ukuran file maksimal ${MAX_SIZE_MB}MB`);
                setFile(null);
                if (fileRef.current) fileRef.current.value = '';
                return;
            }
            setFileError('');
            setFile(f);
        }
    }

    function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!file || submitting) return;

        setSubmitting(true);
        router.post(
            `/dashboard/customer/booking/${booking.uuid}/payment`,
            { proof_image: file },
            {
                forceFormData: true,
                onFinish: () => setSubmitting(false),
                onSuccess: () => {
                    setFile(null);
                    if (fileRef.current) fileRef.current.value = '';
                },
            },
        );
    }

    return (
        <DashboardLayout>
            <Head title={`Pembayaran - ${booking.booking_code}`} />

            <div className="mx-auto max-w-2xl">
                <h1 className="mb-1 text-xl font-bold text-[var(--heading)]">
                    Pembayaran
                </h1>
                <p className="mb-5 text-sm text-[var(--body-subtle)]">
                    Kode Booking:{' '}
                    <span className="font-mono font-bold text-[var(--body)]">
                        {booking.booking_code}
                    </span>
                </p>

                {flash?.success && (
                    <div className="mb-4 flex items-center gap-2 rounded-none bg-[var(--success-soft)] px-4 py-3 text-sm font-medium text-[var(--fg-success-strong)]">
                        <CheckCircle2 className="h-4 w-4 shrink-0" />
                        {flash.success}
                    </div>
                )}

                {expired && booking.status === 'awaiting_payment' && (
                    <div className="mb-4 flex items-center gap-2 rounded-none bg-[var(--danger-soft)] px-4 py-3 text-sm font-medium text-[var(--fg-danger)]">
                        <AlertCircle className="h-4 w-4 shrink-0" />
                        Waktu pembayaran telah habis. Booking akan dibatalkan secara otomatis.
                    </div>
                )}

                {!isFinal && (
                    <div className="mb-4 flex items-center gap-3 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3">
                        <Timer className="h-5 w-5 text-[var(--fg-brand)]" />
                        <span className="text-sm text-[var(--body-subtle)]">
                            Sisa waktu pembayaran:
                        </span>
                        <span
                            className={`text-xl font-bold font-mono ${
                                expired
                                    ? 'text-[var(--fg-danger)]'
                                    : 'text-[var(--fg-brand)]'
                            }`}
                        >
                            {timeLeft}
                        </span>
                    </div>
                )}

                <div className="mb-5 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                    <h2 className="mb-3 text-sm font-semibold text-[var(--body)]">
                        Ringkasan Pesanan
                    </h2>
                    <div className="space-y-2 text-sm text-[var(--body-subtle)]">
                        <div className="flex items-center gap-2">
                            <Route className="h-4 w-4 shrink-0 text-[var(--fg-brand)]" />
                            {booking.trip.route.name}
                        </div>
                        <div className="flex items-center gap-2">
                            <Bus className="h-4 w-4 shrink-0" />
                            {booking.trip.bus.name} ({booking.trip.bus.plate_number})
                        </div>
                        <div className="flex items-center gap-2">
                            <CalendarDays className="h-4 w-4 shrink-0" />
                            {booking.trip.departure_date} •{' '}
                            {booking.trip.departure_time}
                            {booking.trip.estimated_arrival &&
                                ` - ${booking.trip.estimated_arrival}`}
                        </div>
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 shrink-0" />
                            {booking.origin_city.name} →{' '}
                            {booking.destination_city.name}
                        </div>
                        <div className="flex items-center gap-2">
                            <Users className="h-4 w-4 shrink-0" />
                            {booking.total_passengers} penumpang
                        </div>
                    </div>
                    <div className="mt-3 border-t border-[var(--border-default)] pt-3">
                        <div className="flex justify-between">
                            <span className="text-sm text-[var(--body-subtle)]">
                                Total Pembayaran
                            </span>
                            <span className="text-lg font-bold text-[var(--fg-brand)]">
                                Rp {booking.total_price.toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="mb-5 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                    <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-[var(--body)]">
                        <CreditCard className="h-4 w-4 text-[var(--fg-brand)]" />
                        Transfer ke
                    </h2>
                    <div className="space-y-2">
                        {BANK_ACCOUNTS.map((acc) => (
                            <div
                                key={acc.bank}
                                className="rounded-none border border-[var(--border-default)] bg-[var(--bg)] px-4 py-3"
                            >
                                <p className="text-xs font-medium text-[var(--body-subtle)]">
                                    {acc.bank}
                                </p>
                                <p className="font-mono text-sm font-bold text-[var(--body)]">
                                    {acc.account}
                                </p>
                                <p className="text-xs text-[var(--body-subtle)]">
                                    a.n. {acc.name}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>

                {isApproved ? (
                    <div className="flex items-center gap-3 rounded-none bg-[var(--success-soft)] px-4 py-3">
                        <CheckCircle2 className="h-6 w-6 text-[var(--fg-success-strong)]" />
                        <div>
                            <p className="font-medium text-[var(--fg-success-strong)]">
                                Pembayaran telah dikonfirmasi
                            </p>
                            <p className="text-sm text-[var(--body-subtle)]">
                                Tiket Anda sudah aktif. Tunjukkan kode booking ke petugas.
                            </p>
                        </div>
                    </div>
                ) : isPending ? (
                    <div className="flex items-center gap-3 rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] px-4 py-3">
                        <Clock className="h-6 w-6 text-[var(--fg-brand)]" />
                        <div>
                            <p className="font-medium text-[var(--body)]">
                                Bukti sedang diverifikasi
                            </p>
                            <p className="text-sm text-[var(--body-subtle)]">
                                Admin akan memverifikasi pembayaran Anda.
                            </p>
                        </div>
                    </div>
                ) : (
                    booking.status === 'awaiting_payment' && !expired && (
                        <form onSubmit={handleSubmit} className="space-y-3">
                            <div className="rounded-none border border-[var(--border-default)] bg-[var(--neutral-primary)] p-4">
                                <h2 className="mb-3 text-sm font-semibold text-[var(--body)]">
                                    Upload Bukti Pembayaran
                                </h2>
                                <input
                                    ref={fileRef}
                                    type="file"
                                    accept="image/jpeg,image/png"
                                    onChange={handleFileChange}
                                    required
                                    className="focus:ring-[var(--brand)] block w-full text-sm text-[var(--body)] file:mr-3 file:cursor-pointer file:rounded-none file:border-0 file:bg-[var(--brand)] file:px-4 file:py-2 file:text-sm file:font-medium file:text-[var(--on-brand)] hover:file:bg-[var(--brand-strong)]"
                                />
                                {fileError && (
                                    <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                        {fileError}
                                    </p>
                                )}
                                {errors.proof_image && (
                                    <p className="mt-1 text-xs text-[var(--fg-danger)]">
                                        {errors.proof_image}
                                    </p>
                                )}
                            </div>
                            <div className="flex justify-end">
                                <Button
                                    type="submit"
                                    variant="brand"
                                    size="large"
                                    disabled={!file || submitting}
                                >
                                    <Upload className="h-4 w-4" />
                                    {submitting ? 'Mengunggah...' : 'Upload Bukti Bayar'}
                                </Button>
                            </div>
                        </form>
                    )
                )}
            </div>
        </DashboardLayout>
    );
}
