<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $query = Payment::with([
            'booking.trip.route.bus',
            'booking.originCity',
            'booking.destinationCity',
            'booking.user',
            'validator',
        ])->orderBy('created_at', 'desc');

        if ($request->filled('status')) {
            $query->where('status', $request->status);
        } else {
            $query->where('status', 'pending');
        }

        $payments = $query->paginate(20)->withQueryString();

        return Inertia::render('dashboard/payments/Index', [
            'payments' => $payments,
            'filters' => $request->only(['status']),
        ]);
    }

    public function approve(Payment $payment): RedirectResponse
    {
        $payment->update([
            'status' => 'approved',
            'validated_by' => request()->user()->id,
            'validated_at' => now(),
        ]);

        $payment->booking->update(['status' => 'confirmed']);

        return redirect()->back()
            ->with('success', 'Pembayaran berhasil divalidasi.');
    }

    public function reject(Request $request, Payment $payment): RedirectResponse
    {
        $validated = $request->validate([
            'notes' => ['nullable', 'string', 'max:1000'],
        ]);

        $payment->update([
            'status' => 'rejected',
            'validated_by' => $request->user()->id,
            'validated_at' => now(),
            'notes' => $validated['notes'] ?? null,
        ]);

        return redirect()->back()
            ->with('success', 'Pembayaran ditolak.');
    }
}
