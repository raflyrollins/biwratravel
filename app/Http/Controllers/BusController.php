<?php

namespace App\Http\Controllers;

use App\Models\Bus;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class BusController extends Controller
{
    public function index()
    {
        $buses = Bus::withCount('routes')->orderBy('name')->paginate(20);

        return Inertia::render('dashboard/buses/Index', [
            'buses' => $buses,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/buses/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'plate_number' => ['required', 'string', 'max:20', 'unique:buses'],
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        Bus::create($validated);

        return redirect()->route('dashboard.buses.index')
            ->with('success', 'Armada berhasil ditambahkan.');
    }

    public function edit(Bus $bus)
    {
        return Inertia::render('dashboard/buses/Form', [
            'bus' => $bus,
        ]);
    }

    public function update(Request $request, Bus $bus): RedirectResponse
    {
        $validated = $request->validate([
            'plate_number' => ['required', 'string', 'max:20', 'unique:buses,plate_number,'.$bus->id],
            'name' => ['required', 'string', 'max:255'],
            'capacity' => ['required', 'integer', 'min:1'],
            'is_active' => ['boolean'],
        ]);

        $bus->update($validated);

        return redirect()->route('dashboard.buses.index')
            ->with('success', 'Armada berhasil diperbarui.');
    }

    public function destroy(Bus $bus): RedirectResponse
    {
        $bus->delete();

        return redirect()->route('dashboard.buses.index')
            ->with('success', 'Armada berhasil dihapus.');
    }
}
