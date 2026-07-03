<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Models\Loket;
use App\Models\User;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class UserController extends Controller
{
    public function index()
    {
        $users = User::with('loket')
            ->orderBy('name')
            ->paginate(20);

        return Inertia::render('dashboard/users/Index', [
            'users' => $users,
        ]);
    }

    public function create()
    {
        $roles = collect(UserRole::cases())->map(fn (UserRole $role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        $lokets = Loket::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('dashboard/users/Form', [
            'roles' => $roles,
            'lokets' => $lokets,
        ]);
    }

    public function store(Request $request): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:users,email'],
            'password' => ['required', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'loket_id' => ['nullable', 'exists:lokets,id'],
        ]);

        if ($validated['role'] !== UserRole::PetugasLoket->value) {
            $validated['loket_id'] = null;
        }

        User::create($validated);

        return redirect()->route('dashboard.users.index')
            ->with('success', 'Pengguna berhasil ditambahkan.');
    }

    public function edit(User $user)
    {
        $roles = collect(UserRole::cases())->map(fn (UserRole $role) => [
            'value' => $role->value,
            'label' => $role->label(),
        ]);

        $lokets = Loket::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name']);

        return Inertia::render('dashboard/users/Form', [
            'user' => $user->load('loket'),
            'roles' => $roles,
            'lokets' => $lokets,
        ]);
    }

    public function update(Request $request, User $user): RedirectResponse
    {
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users', 'email')->ignore($user->id)],
            'password' => ['nullable', Password::defaults()],
            'role' => ['required', Rule::enum(UserRole::class)],
            'loket_id' => ['nullable', 'exists:lokets,id'],
        ]);

        if ($validated['role'] !== UserRole::PetugasLoket->value) {
            $validated['loket_id'] = null;
        }

        if (blank($validated['password'])) {
            unset($validated['password']);
        }

        $user->update($validated);

        return redirect()->route('dashboard.users.index')
            ->with('success', 'Pengguna berhasil diperbarui.');
    }

    public function destroy(User $user): RedirectResponse
    {
        if ($user->is(auth()->user())) {
            return redirect()->route('dashboard.users.index')
                ->with('error', 'Tidak dapat menghapus akun sendiri.');
        }

        $user->delete();

        return redirect()->route('dashboard.users.index')
            ->with('success', 'Pengguna berhasil dihapus.');
    }
}
