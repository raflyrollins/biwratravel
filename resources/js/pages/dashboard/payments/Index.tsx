import { Link, router } from '@inertiajs/react';
import { CheckCircle, Eye, XCircle } from 'lucide-react';
import { useState } from 'react';

import ConfirmDialog from '@/components/ConfirmDialog';
import DashboardLayout from '@/components/DashboardLayout';

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
    booking: {
        id: number;
        uuid: string;
        booking_code: string;
        customer_name: string;
        total_price: number;
        status: string;
        source: string;
        trip: { departure_date: string; departure_time: string; route: { name: string } };
        origin_city: { name: string };
        destination_city: { name: string };
        user: { id: number; name: string } | null;
    };
    validator: { id: number; name: string } | null;
}

interface PaymentsIndexProps {
    payments: {
        data: Payment[];
        current_page: number;
        last_page: number;
        from: number;
        to: number;
        total: number;
        links: { url: string | null; label: string; active: boolean }[];
    };
    filters: {
        status?: string;
    };
}

const STATUS_LABELS: Record<string, string> = {
    pending: 'Pending',
    approved: 'Disetujui',
    rejected: 'Ditolak',
};

const STATUS_COLORS: Record<string, string> = {
    pending: 'bg-[var(--warning-soft)] text-[var(--fg-warning)]',
    approved: 'bg-[var(--success-soft)] text-[var(--fg-success-strong)]',
    rejected: 'bg-[var(--danger-soft)] text-[var(--fg-danger-strong)]',
};

function formatPrice(amount: number) {
    return `Rp ${amount.toLocaleString('id-ID')}`;
}

function classNames(...classes: (string | false | null | undefined)[]) {
    return classes.filter(Boolean).join(' ');
}

export default function PaymentsIndex({ payments, filters }: PaymentsIndexProps) {
    const [statusFilter, setStatusFilter] = useState(filters.status ?? 'pending');
    const [rejectNotes, setRejectNotes] = useState('');
    const [rejectPaymentId, setRejectPaymentId] = useState<string | null>(null);
    const [approvePaymentId, setApprovePaymentId] = useState<string | null>(null);

    function changeStatus(status: string) {
        setStatusFilter(status);
        router.get(
            '/dashboard/payments',
            { status },
            { preserveState: true },
        );
    }

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
        <DashboardLayout title="Pembayaran">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    Pembayaran
                </h1>
                <p className="mt-1 text-sm text-[var(--body-subtle)]">
                    Validasi pembayaran tiket.
                </p>
            </div>

            <div className="mb-6 flex gap-2">
                {['pending', 'approved', 'rejected'].map((s) => (
                    <button
                        key={s}
                        type="button"
                        onClick={() => changeStatus(s)}
                        className={`cursor-pointer px-4 py-2 text-sm font-medium transition-colors ${
                            statusFilter === s
                                ? 'bg-[var(--brand)] text-[var(--on-brand)]'
                                : 'border border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]'
                        }`}
                    >
                        {STATUS_LABELS[s]}
                    </button>
                ))}
            </div>

            <div className="overflow-x-auto border border-[var(--border-default)] bg-[var(--neutral-primary)]">
                <table className="w-full text-left text-sm">
                    <thead>
                        <tr className="border-b border-[var(--border-default)] bg-[var(--neutral-secondary-soft)]">
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Kode Booking
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Customer
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Trip
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Rute
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Jumlah
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Status
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Tanggal
                            </th>
                            <th className="px-6 py-3 font-medium text-[var(--body)]">
                                Aksi
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.data.length === 0 && (
                            <tr>
                                <td
                                    colSpan={8}
                                    className="px-6 py-12 text-center text-[var(--body-subtle)]"
                                >
                                    Tidak ada pembayaran.
                                </td>
                            </tr>
                        )}
                        {payments.data.map((payment) => (
                            <tr
                                key={payment.id}
                                className="border-b border-[var(--border-default)] transition-colors hover:bg-[var(--neutral-secondary-soft)]"
                            >
                                <td className="px-6 py-4 font-mono text-xs font-medium text-[var(--heading)]">
                                    <Link
                                        href={`/dashboard/bookings/${payment.booking.id}`}
                                        className="text-[var(--fg-brand)] no-underline hover:underline"
                                    >
                                        {payment.booking.booking_code}
                                    </Link>
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    {payment.booking.customer_name}
                                </td>
                                <td className="px-6 py-4 text-[var(--body)]">
                                    <div>
                                        {payment.booking.trip?.route?.name ??
                                            '-'}
                                    </div>
                                    <div className="text-xs text-[var(--body-subtle)]">
                                        {payment.booking.trip?.departure_date}{' '}
                                        {payment.booking.trip?.departure_time}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-[var(--body)]">
                                    {payment.booking.origin_city?.name} &rarr;{' '}
                                    {payment.booking.destination_city?.name}
                                </td>
                                <td className="px-6 py-4 font-medium text-[var(--heading)]">
                                    {formatPrice(payment.amount)}
                                </td>
                                <td className="px-6 py-4">
                                    <span
                                        className={classNames(
                                            'inline-block px-2 py-0.5 text-xs font-medium',
                                            STATUS_COLORS[payment.status] ??
                                                'bg-[var(--neutral-tertiary-soft)] text-[var(--body)]',
                                        )}
                                    >
                                        {STATUS_LABELS[payment.status] ??
                                            payment.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-xs text-[var(--body-subtle)]">
                                    {new Date(
                                        payment.created_at,
                                    ).toLocaleDateString('id-ID', {
                                        year: 'numeric',
                                        month: 'short',
                                        day: 'numeric',
                                        hour: '2-digit',
                                        minute: '2-digit',
                                    })}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="flex gap-2">
                                        <Link
                                            href={`/dashboard/bookings/${payment.booking.uuid}`}
                                            className="inline-flex items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                        >
                                            <Eye size={14} />
                                            Detail
                                        </Link>

                                        {payment.status === 'pending' && (
                                            <>
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        setApprovePaymentId(
                                                            payment.uuid,
                                                        )
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
                                            </>
                                        )}
                                    </div>

                                    {rejectPaymentId === payment.uuid && (
                                        <div className="mt-2 border-t border-[var(--border-default)] pt-2">
                                            <textarea
                                                value={rejectNotes}
                                                onChange={(e) =>
                                                    setRejectNotes(
                                                        e.target.value,
                                                    )
                                                }
                                                placeholder="Alasan penolakan (opsional)"
                                                rows={2}
                                                className="w-full border border-[var(--border-default)] bg-[var(--neutral-secondary-soft)] p-2 text-sm text-[var(--body)] outline-none focus:border-[var(--brand)]"
                                            />
                                            <div className="mt-2 flex gap-2">
                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        rejectPayment(
                                                            payment.uuid,
                                                        )
                                                    }
                                                    className="cursor-pointer bg-[var(--fg-danger)] px-3 py-1.5 text-xs font-medium text-white transition-colors hover:opacity-90"
                                                >
                                                    Konfirmasi Tolak
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setRejectPaymentId(
                                                            null,
                                                        );
                                                        setRejectNotes('');
                                                    }}
                                                    className="cursor-pointer border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                                                >
                                                    Batal
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {payments.last_page > 1 && (
                <div className="mt-6 flex items-center justify-center gap-2">
                    {payments.links.map((link, i) => (
                        <Link
                            key={i}
                            href={link.url ?? '#'}
                            preserveScroll
                            className={classNames(
                                'inline-flex items-center justify-center border px-3 py-2 text-sm no-underline transition-colors',
                                link.active
                                    ? 'border-[var(--brand)] bg-[var(--brand-softer)] text-[var(--fg-brand)]'
                                    : 'border-[var(--border-default)] bg-[var(--neutral-primary)] text-[var(--body)] hover:bg-[var(--neutral-tertiary-soft)]',
                                !link.url && 'pointer-events-none opacity-50',
                            )}
                            dangerouslySetInnerHTML={{ __html: link.label }}
                        />
                    ))}
                </div>
            )}
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
