<?php

namespace App\Http\Controllers;

use App\Models\City;
use App\Models\Loket;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LoketController extends Controller
{
    public function index()
    {
        $lokets = Loket::with('city')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('dashboard/lokets/Index', [
            'lokets' => $lokets,
        ]);
    }

    public function create()
    {
        $cities = City::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('dashboard/lokets/Form', [
            'cities' => $cities,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_active' => ['boolean'],
        ]);

        Loket::create($validated);

        return redirect()->route('dashboard.lokets.index')
            ->with('success', 'Loket berhasil ditambahkan.');
    }

    public function edit(Loket $loket)
    {
        $cities = City::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('dashboard/lokets/Form', [
            'loket' => $loket,
            'cities' => $cities,
        ]);
    }

    public function update(Request $request, Loket $loket): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:500'],
            'city_id' => ['nullable', 'exists:cities,id'],
            'is_active' => ['boolean'],
        ]);

        $loket->update($validated);

        return redirect()->route('dashboard.lokets.index')
            ->with('success', 'Loket berhasil diperbarui.');
    }

    public function destroy(Loket $loket): RedirectResponse
    {
        $loket->delete();

        return redirect()->route('dashboard.lokets.index')
            ->with('success', 'Loket berhasil dihapus.');
    }
}
