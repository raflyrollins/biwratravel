<?php

namespace App\Http\Controllers;

use App\Models\SavedPassenger;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SavedPassengerController extends Controller
{
    public function index(Request $request)
    {
        $passengers = $request->user()
            ->savedPassengers()
            ->orderBy('name')
            ->get();

        return Inertia::render('dashboard/customer/SavedPassengers', [
            'passengers' => $passengers,
        ]);
    }

    public function update(Request $request, SavedPassenger $savedPassenger)
    {
        abort_if($savedPassenger->user_id !== $request->user()->id, 403);

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'gender' => ['required', 'in:L,P'],
            'birth_date' => ['required', 'date'],
        ]);

        $savedPassenger->update($validated);

        return redirect()->back()->with('success', 'Data penumpang berhasil diperbarui.');
    }

    public function destroy(Request $request, SavedPassenger $savedPassenger)
    {
        abort_if($savedPassenger->user_id !== $request->user()->id, 403);

        $savedPassenger->delete();

        return redirect()->back()->with('success', 'Data penumpang berhasil dihapus.');
    }
}
