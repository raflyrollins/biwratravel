import { Link, router, usePage } from '@inertiajs/react';
import {
    ArrowLeft,
    CheckCircle,
    XCircle,
} from 'lucide-react';
import { useState } from 'react';

import ConfirmDialog from '@/components/ConfirmDialog';
import DashboardLayout from '@/components/DashboardLayout';
import type { Auth } from '@/types/auth';

interface BookingPassenger {
    id: number;
    nik: string | null;
    name: string;
    gender: string | null;
    birth_date: string | null;
    seat_number: string | null;
}

interface Payment {
    id: number;
    uuid: string;
    amount: number;
    method: string | null;
    proof_image: string | null;
    status: string;
    notes: string | null;
    validated_at: string | null;
    created_at: string;
    validator: { id: number; name: string } | null;
}

interface Booking {
    id: number;
    uuid: string;
    booking_code: string;
    customer_name: string;
    customer_phone: string | null;
    customer_email: string | null;
    total_passengers: number;
    total_price: number;
    status: string;
    source: string;
    notes: string | null;
    created_at: string;
    updated_at: string;
    trip: {
        id: number;
        departure_date: string;
        departure_time: string;
        estimated_arrival: string | null;
        route: {
            id: number;
            name: string;
            bus: { id: number; name: string; plate_number: string };
            origin_city: { id: number; name: string } | null;
            destination_city: { id: number; name: string } | null;
        };
        bus: { id: number; name: string; plate_number: string };
    };
    origin_city: { id: number; name: string };
    destination_city: { id: number; name: string };
    user: { id: number; name: string } | null;
    passengers: BookingPassenger[];
    payments: Payment[];
}

interface BookingShowProps {
    booking: Booking;
}

const SOURCE_LABELS: Record<string, string> = {
    online: 'Online',
    offline: 'Loket',
};

const PAYMENT_STATUS_LABELS: Record<string, string> = {
    pending: 'Menunggu Validasi',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

const PAYMENT_STATUS_COLORS: Record<string, string> = {
    pending: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    approved: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    rejected: 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]',
};

function formatPrice(amount: number) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

export default function BookingShow({ booking }: BookingShowProps) {
    const { auth } = usePage().props as { auth: Auth };
    const role = auth.user?.role;
    const [rejectNotes, setRejectNotes] = useState('');
    const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
    const [approvePaymentId, setApprovePaymentId] = useState<string | null>(null);
    const canValidate = role === 'superadmin' || role === 'admin_penjualan';

    function confirmApprove() {
        if (approvePaymentId) {
            router.post(`/dashboard/payments/${approvePaymentId}/approve`);
            setApprovePaymentId(null);
        }
    }

    function rejectPayment(paymentId: string | null) {
        if (!paymentId) {
return;
}

        router.post(`/dashboard/payments/${paymentId}/reject`, {
            notes: rejectNotes,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                setRejectNotes('');
                setRejectPaymentId(null);
            },
        });
    }

    return (
        <DashboardLayout title={`Booking ${booking.booking_code}`}>
            <div className="mb-6">
                <Link
                    href="/dashboard/bookings"
                    className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--body)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>

                <div className="mt-2 flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold text-[var(--heading)]">
                            Booking {booking.booking_code}
                        </h1>
                        <p className="mt-1 text-sm text-[var(--body-subtle)]">
                            Dibuat {new Date(booking.created_at).toLocaleDateString('id-ID', {
                                year: 'numeric',
                                month: 'long',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                            })}
                        </p>
                    </div>
                    <span className="text-xs text-[var(--body-subtle)]">
                        {SOURCE_LABELS[booking.source] ?? booking.source}
                    </span>
                </div>
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                        Informasi Customer
                    </h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Nama</dt>
                            <dd className="font-medium text-[var(--heading)]">
                                {booking.customer_name}
                            </dd>
                        </div>
                        {booking.customer_phone && (
                            <div className="flex justify-between">
                                <dt className="text-[var(--body-subtle)]">Telepon</dt>
                                <dd className="text-[var(--body)]">
                                    {booking.customer_phone}
                                </dd>
                            </div>
                        )}
                        {booking.customer_email && (
                            <div className="flex justify-between">
                                <dt className="text-[var(--body-subtle)]">Email</dt>
                                <dd className="text-[var(--body)]">
                                    {booking.customer_email}
                                </dd>
                            </div>
                        )}
                        {booking.user && (
                            <div className="flex justify-between">
                                <dt className="text-[var(--body-subtle)]">Akun</dt>
                                <dd className="text-[var(--body)]">
                                    {booking.user.name}
                                </dd>
                            </div>
                        )}
                    </dl>
                </div>

                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                        Informasi Trip
                    </h2>
                    <dl className="space-y-3 text-sm">
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Rute</dt>
                            <dd className="font-medium text-[var(--heading)]">
                                {booking.trip?.route?.name ?? '-'}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Armada</dt>
                            <dd className="text-[var(--body)]">
                                {booking.trip?.bus?.name ?? '-'} (
                                {booking.trip?.bus?.plate_number ?? '-'})
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Rute Dibeli</dt>
                            <dd className="font-medium text-[var(--heading)]">
                                {booking.origin_city?.name} &rarr;{' '}
                                {booking.destination_city?.name}
                            </dd>
                        </div>
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Keberangkatan</dt>
                            <dd className="text-[var(--body)]">
                                {booking.trip?.departure_date}{' '}
                                {booking.trip?.departure_time}
                            </dd>
                        </div>
                        {booking.trip?.estimated_arrival && (
                            <div className="flex justify-between">
                                <dt className="text-[var(--body-subtle)]">
                                    Tiba
                                </dt>
                                <dd className="text-[var(--body)]">
                                    {booking.trip.estimated_arrival}
                                </dd>
                            </div>
                        )}
                        <div className="flex justify-between">
                            <dt className="text-[var(--body-subtle)]">Penumpang</dt>
                            <dd className="text-[var(--body)]">
                                {booking.total_passengers} orang
                            </dd>
                        </div>
                        <div className="flex justify-between border-t border-[var(--border-default)] pt-3">
                            <dt className="font-medium text-[var(--heading)]">
                                Total Harga
                            </dt>
                            <dd className="text-base font-bold text-[var(--heading)]">
                                {formatPrice(booking.total_price)}
                            </dd>
                        </div>
                    </dl>
                </div>
            </div>

            <div className="mt-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                    Data Penumpang
                </h2>

                {booking.passengers.length === 0 && (
                    <p className="text-sm text-[var(--body-subtle)]">
                        Belum ada data penumpang.
                    </p>
                )}

                {booking.passengers.length > 0 && (
                    <div className="overflow-x-auto">
                        <table className="w-full text-left text-sm">
                            <thead>
                                <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                                    <th className="px-4 py-2 font-medium text-[var(--body)]">
                                        NIK
                                    </th>
                                    <th className="px-4 py-2 font-medium text-[var(--body)]">
                                        Nama
                                    </th>
                                    <th className="px-4 py-2 font-medium text-[var(--body)]">
                                        Jenis Kelamin
                                    </th>
                                    <th className="px-4 py-2 font-medium text-[var(--body)]">
                                        Tanggal Lahir
                                    </th>
                                    <th className="px-4 py-2 font-medium text-[var(--body)]">
                                        Kursi
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {booking.passengers.map((p) => (
                                    <tr
                                        key={p.id}
                                        className="border-b border-[var(--border-default)]"
                                    >
                                        <td className="px-4 py-3 font-mono text-xs text-[var(--body)]">
                                            {p.nik ?? '-'}
                                        </td>
                                        <td className="px-4 py-3 font-medium text-[var(--heading)]">
                                            {p.name}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {p.gender === 'L'
                                                ? 'Laki-laki'
                                                : p.gender === 'P'
                                                  ? 'Perempuan'
                                                  : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {p.birth_date
                                                ? new Date(p.birth_date).toLocaleDateString('id-ID', {
                                                      year: 'numeric',
                                                      month: 'long',
                                                      day: 'numeric',
                                                  })
                                                : '-'}
                                        </td>
                                        <td className="px-4 py-3 text-[var(--body)]">
                                            {p.seat_number ?? '-'}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="mt-6 border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                <h2 className="mb-4 text-base font-bold text-[var(--heading)]">
                    Riwayat Pembayaran
                </h2>

                {booking.payments.length === 0 && (
                    <p className="text-sm text-[var(--body-subtle)]">
                        Belum ada pembayaran.
                    </p>
                )}

                <div className="space-y-4">
                    {booking.payments.map((payment) => (
                        <div
                            key={payment.id}
                            className="border border-[var(--border-default)] p-4"
                        >
                            <div className="flex items-start justify-between">
                                <div className="space-y-1">
                                    <div className="flex items-center gap-2">
                                        <span className="font-medium text-[var(--heading)]">
                                            {formatPrice(payment.amount)}
                                        </span>
                                        <span
                                            className={`inline-block px-2 py-0.5 text-xs font-medium ${
                                                PAYMENT_STATUS_COLORS[payment.status] ??
                                                'bg-[var(--neutral-tertiary-soft)] text-[var(--body)]'
                                            }`}
                                        >
                                            {PAYMENT_STATUS_LABELS[payment.status] ??
                                                payment.status}
                                        </span>
                                    </div>
                                    {payment.method && (
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Metode: {payment.method.toUpperCase()}
                                        </p>
                                    )}
                                    <p className="text-xs text-[var(--body-subtle)]">
                                        Dibuat{' '}
                                        {new Date(
                                            payment.created_at,
                                        ).toLocaleDateString('id-ID', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit',
                                        })}
                                    </p>
                                    {payment.validator && (
                                        <p className="text-xs text-[var(--body-subtle)]">
                                            Divalidasi oleh:{' '}
                                            {payment.validator.name}
                                            {payment.validated_at &&
                                                ` (${new Date(payment.validated_at).toLocaleDateString('id-ID', {
                                                    year: 'numeric',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    hour: '2-digit',
                                                    minute: '2-digit',
                                                })})`}
                                        </p>
                                    )}
                                    {payment.notes && (
                                        <p className="mt-1 text-xs italic text-[var(--body-subtle)]">
                                            Catatan: {payment.notes}
                                        </p>
                                    )}
                                </div>

                                <div className="flex items-center gap-2">
                                    {payment.proof_image && (
                                        <a
                                            href={`/storage/${payment.proof_image}`}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            Lihat Bukti
                                        </a>
                                    )}

                                    {canValidate &&
                                        payment.status === 'pending' && (
                                            <div className="flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setApprovePaymentId(payment.uuid)
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 bg-[var(--brand)] px-3 py-1.5 text-xs font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)]"
                                                >
                                                    <CheckCircle size={14} />
                                                    Setujui
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setRejectPaymentId(
                                                            rejectPaymentId ===
                                                                payment.uuid
                                                                ? null
                                                                : payment.uuid,
                                                        )
                                                    }
                                                    className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-danger-subtle)] px-3 py-1.5 text-xs font-medium text-[var(--fg-danger)] transition-colors hover:bg-[var(--danger-soft)]"
                                                >
                                                    <XCircle size={14} />
                                                    Tolak
                                                </button>
                                            </div>
                                        )}
                                </div>
                            </div>

                            {rejectPaymentId === payment.uuid && (
                                <div className="mt-3 border-t border-[var(--border-default)] pt-3">
                                    <textarea
                                        value={rejectNotes}
                                        onChange={(e) =>
                                            setRejectNotes(e.target.value)
                                        }
                                        placeholder="Alasan penolakan (opsional)"
                                        rows={2}
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-2 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                                    />
                                    <div className="mt-2 flex gap-2">
                                        <button
                                            type="button"
                                            onClick={() =>
                                                rejectPayment(payment.uuid)
                                            }
                                            className="cursor-pointer bg-[var(--fg-danger)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                                        >
                                            Konfirmasi Tolak
                                        </button>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setRejectPaymentId(null);
                                                setRejectNotes('');
                                            }}
                                            className="cursor-pointer border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            Batal
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <ConfirmDialog
                open={approvePaymentId !== null}
                title="Setujui Pembayaran"
                message="Yakin ingin menyetujui pembayaran ini? Booking akan otomatis dikonfirmasi."
                confirmLabel="Setujui"
                cancelLabel="Batal"
                variant="default"
                onConfirm={confirmApprove}
                onCancel={() => setApprovePaymentId(null)}
            />
        </DashboardLayout>
    );
}
