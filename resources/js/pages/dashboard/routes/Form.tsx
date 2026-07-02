import { Link, useForm } from '@inertiajs/react';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import type { FormEvent } from 'react';

import DashboardLayout from '@/components/DashboardLayout';

interface City {
    id: number;
    name: string;
}

interface Bus {
    id: number;
    name: string;
    plate_number: string;
}

interface Segment {
    id?: number;
    origin_city_id: number | string;
    destination_city_id: number | string;
    order: number;
    base_price: number | string;
}

interface RouteData {
    id: number;
    bus_id: number;
    name: string;
    origin_city_id: number;
    destination_city_id: number;
    is_active: boolean;
    segments: Segment[];
}

interface RoutesFormProps {
    route?: RouteData;
    buses: Bus[];
    cities: City[];
}

export default function RoutesForm({ route, buses, cities }: RoutesFormProps) {
    const editing = !!route;

    const { data, setData, errors, processing, post, put } = useForm({
        bus_id: route?.bus_id ?? '',
        name: route?.name ?? '',
        origin_city_id: route?.origin_city_id ?? '',
        destination_city_id: route?.destination_city_id ?? '',
        is_active: route?.is_active ?? true,
        segments: (route?.segments ?? [
            {
                origin_city_id: '',
                destination_city_id: '',
                order: 1,
                base_price: '',
            },
        ]) as Segment[],
    });

    function submit(e: FormEvent) {
        e.preventDefault();
        const payload = {
            ...data,
            segments: data.segments.map((s, i) => ({ ...s, order: i + 1 })),
        };

        if (editing) {
            put(
                `/dashboard/routes/${route.id}`,
                payload as unknown as Record<string, unknown>,
            );
        } else {
            post(
                '/dashboard/routes',
                payload as unknown as Record<string, unknown>,
            );
        }
    }

    function addSegment() {
        setData('segments', [
            ...data.segments,
            {
                origin_city_id: '',
                destination_city_id: '',
                order: data.segments.length + 1,
                base_price: '',
            },
        ]);
    }

    function removeSegment(index: number) {
        if (data.segments.length <= 1) {
            return;
        }

        setData(
            'segments',
            data.segments.filter((_, i) => i !== index),
        );
    }

    function updateSegment(
        index: number,
        field: keyof Segment,
        value: unknown,
    ) {
        setData(
            'segments',
            data.segments.map((s, i) =>
                i === index ? { ...s, [field]: value } : s,
            ),
        );
    }

    return (
        <DashboardLayout title={editing ? 'Edit Rute' : 'Tambah Rute'}>
            <div className="mb-6">
                <Link
                    href="/dashboard/routes"
                    className="mb-4 inline-flex items-center gap-1.5 text-sm text-[var(--body-subtle)] no-underline transition-colors hover:text-[var(--heading)]"
                >
                    <ArrowLeft size={16} />
                    Kembali
                </Link>
                <h1 className="text-2xl font-bold text-[var(--heading)]">
                    {editing ? 'Edit Rute' : 'Tambah Rute'}
                </h1>
            </div>

            <form onSubmit={submit} className="max-w-2xl space-y-6">
                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <h2 className="mb-4 text-base font-medium text-[var(--heading)]">
                        Informasi Rute
                    </h2>

                    <div className="mb-5">
                        <label
                            htmlFor="bus_id"
                            className="mb-2 block text-sm font-medium text-[var(--heading)]"
                        >
                            Armada
                        </label>
                        <select
                            id="bus_id"
                            value={data.bus_id}
                            onChange={(e) =>
                                setData('bus_id', Number(e.target.value))
                            }
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.bus_id
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                        >
                            <option value="">Pilih armada</option>
                            {buses.map((b) => (
                                <option key={b.id} value={b.id}>
                                    {b.name} ({b.plate_number})
                                </option>
                            ))}
                        </select>
                        {errors.bus_id && (
                            <p className="mt-1.5 text-xs text-[var(--danger)]">
                                {errors.bus_id}
                            </p>
                        )}
                    </div>

                    <div className="mb-5">
                        <label
                            htmlFor="name"
                            className="mb-2 block text-sm font-medium text-[var(--heading)]"
                        >
                            Nama Rute
                        </label>
                        <input
                            id="name"
                            type="text"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            className={`block w-full border bg-[var(--neutral-tertiary)] px-4 py-3 text-sm text-[var(--heading)] placeholder-[var(--body-subtle)] transition-all duration-200 focus:outline-none dark:bg-white/10 ${
                                errors.name
                                    ? 'border-[var(--danger)] ring-1 ring-[var(--danger)]'
                                    : 'border-[var(--border-default)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] dark:border-white/20'
                            }`}
                            placeholder="Medan – Tanjung Pura"
                        />
                        {errors.name && (
                            <p className="mt-1.5 text-xs text-[var(--danger)]">
                                {errors.name}
                            </p>
                        )}
                    </div>

                    <div className="mb-6">
                        <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--body-subtle)]">
                            <input
                                type="checkbox"
                                checked={data.is_active}
                                onChange={(e) =>
                                    setData('is_active', e.target.checked)
                                }
                                className="size-4 accent-[var(--brand)]"
                            />
                            Aktif
                        </label>
                    </div>
                </div>

                <div className="border border-[var(--border-default)] bg-[var(--neutral-primary)] p-6">
                    <div className="mb-4 flex items-center justify-between">
                        <h2 className="text-base font-medium text-[var(--heading)]">
                            Segmen Rute
                        </h2>
                        <button
                            type="button"
                            onClick={addSegment}
                            className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-default)] px-3 py-1.5 text-xs font-medium text-[var(--body)] transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                        >
                            <Plus size={14} />
                            Tambah Segmen
                        </button>
                    </div>

                    {errors.segments && (
                        <p className="mb-3 text-xs text-[var(--danger)]">
                            {errors.segments}
                        </p>
                    )}

                    <div className="space-y-4">
                        {data.segments.map((segment, index) => (
                            <div
                                key={index}
                                className="flex flex-wrap items-end gap-3 border-b border-[var(--border-default)] pb-4"
                            >
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                        Dari
                                    </label>
                                    <select
                                        value={segment.origin_city_id}
                                        onChange={(e) =>
                                            updateSegment(
                                                index,
                                                'origin_city_id',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2.5 text-sm text-[var(--heading)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none dark:bg-white/10"
                                    >
                                        <option value="">Pilih</option>
                                        {cities.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="flex-1">
                                    <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                        Ke
                                    </label>
                                    <select
                                        value={segment.destination_city_id}
                                        onChange={(e) =>
                                            updateSegment(
                                                index,
                                                'destination_city_id',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2.5 text-sm text-[var(--heading)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none dark:bg-white/10"
                                    >
                                        <option value="">Pilih</option>
                                        {cities.map((c) => (
                                            <option key={c.id} value={c.id}>
                                                {c.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div className="w-28">
                                    <label className="mb-1 block text-xs font-medium text-[var(--body-subtle)]">
                                        Harga (Rp)
                                    </label>
                                    <input
                                        type="number"
                                        value={segment.base_price}
                                        onChange={(e) =>
                                            updateSegment(
                                                index,
                                                'base_price',
                                                Number(e.target.value),
                                            )
                                        }
                                        className="w-full border border-[var(--border-default)] bg-[var(--neutral-tertiary)] px-3 py-2.5 text-sm text-[var(--heading)] focus:border-[var(--brand)] focus:ring-1 focus:ring-[var(--brand)] focus:outline-none dark:bg-white/10"
                                    />
                                </div>
                                <button
                                    type="button"
                                    onClick={() => removeSegment(index)}
                                    disabled={data.segments.length <= 1}
                                    className="inline-flex cursor-pointer items-center gap-1 border border-[var(--border-danger-subtle)] px-2.5 py-2.5 text-xs font-medium text-[var(--fg-danger)] transition-colors hover:bg-[var(--danger-soft)] disabled:cursor-not-allowed disabled:opacity-50"
                                >
                                    <Trash2 size={14} />
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="flex gap-3">
                    <button
                        type="submit"
                        disabled={processing}
                        className="inline-flex items-center gap-2 bg-[var(--brand)] px-6 py-3 text-sm font-medium text-[var(--on-brand)] transition-colors hover:bg-[var(--brand-strong)] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {processing
                            ? 'Menyimpan...'
                            : editing
                              ? 'Perbarui'
                              : 'Simpan'}
                    </button>
                    <Link
                        href="/dashboard/routes"
                        className="inline-flex items-center gap-2 border border-[var(--border-default)] px-6 py-3 text-sm font-medium text-[var(--body)] no-underline transition-colors hover:bg-[var(--neutral-tertiary-soft)]"
                    >
                        Batal
                    </Link>
                </div>
            </form>
        </DashboardLayout>
    );
}
