<?php

namespace App\Http\Controllers;

use App\Models\City;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Inertia\Inertia;

class CityController extends Controller
{
    public function index()
    {
        $cities = City::orderBy('name')->paginate(20);

        return Inertia::render('dashboard/cities/Index', [
            'cities' => $cities,
        ]);
    }

    public function create()
    {
        return Inertia::render('dashboard/cities/Form');
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $validated['slug'] = Str::slug($validated['name']);

        City::create($validated);

        return redirect()->route('dashboard.cities.index')
            ->with('success', 'Kota berhasil ditambahkan.');
    }

    public function edit(City $city)
    {
        return Inertia::render('dashboard/cities/Form', [
            'city' => $city,
        ]);
    }

    public function update(Request $request, City $city): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'is_active' => ['boolean'],
        ]);

        $city->update($validated);

        return redirect()->route('dashboard.cities.index')
            ->with('success', 'Kota berhasil diperbarui.');
    }

    public function destroy(City $city): RedirectResponse
    {
        $city->delete();

        return redirect()->route('dashboard.cities.index')
            ->with('success', 'Kota berhasil dihapus.');
    }
}
