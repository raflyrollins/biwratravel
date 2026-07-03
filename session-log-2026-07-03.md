# Session Log — 3 Jul 2026

## Goal
Bangun fitur manajemen loket + user management.

---

## Bug Fixes

### 1. "POST data is too large" (413)
- Herd PHP ini `post_max_size=8M` → 20M, `upload_max_filesize=2M` → 20M
- File: `C:\Users\EJ\.config\herd\bin\php84\php.ini`
- Perlu restart Herd dari tray icon agar FPM生效

### 2. Frontend file size validation
- `BookingPayment.tsx` — validasi client-side max 2MB, pesan "Ukuran file maksimal 2MB"

### 3. BookingPassenger birth_date cast error
- Cast dari `date:Y-m-d` → `date` agar `fromDateTime()` terpanggil, format tersimpan `Y-m-d H:i:s` sesuai MySQL

### 4. DatePicker NaN saat value ISO format
- `DatePicker.tsx` — deteksi format ISO (`includes('T')`) sebelum parsing
- Tambah `useEffect` untuk sinkron viewMonth/viewYear saat value berubah

### 5. Gender display di admin Booking Show
- Dari `'male'/'female'` → `'L'/'P'` sesuai DB

### 6. Birth date display di admin Booking Show
- Format ISO jadi `toLocaleDateString('id-ID', ...)`

---

## Feature: Loket Management

### Files Created

| File | Description |
|---|---|
| `database/migrations/2026_07_03_100000_create_lokets_table.php` | Table: name, address, city_id (FK), is_active |
| `database/migrations/2026_07_03_100001_add_loket_id_to_users_table.php` | FK `loket_id` di users |
| `database/migrations/2026_07_03_100002_add_loket_id_to_bookings_table.php` | FK `loket_id` di bookings |
| `app/Models/Loket.php` | Relasi: city(), petugas(), bookings() |
| `app/Http/Controllers/LoketController.php` | CRUD standar |
| `resources/js/pages/dashboard/lokets/Index.tsx` | Daftar loket |
| `resources/js/pages/dashboard/lokets/Form.tsx` | Form tambah/edit loket |

### Files Modified

| File | Change |
|---|---|
| `app/Models/User.php` | Fillable + `loket_id`, relasi `loket()` BelongsTo |
| `app/Models/Booking.php` | Fillable + `loket_id`, relasi `loket()` BelongsTo |
| `routes/web.php` | `Route::resource('lokets', ...)` di group superadmin |
| `resources/js/components/Sidebar.tsx` | Menu "Loket" di Master Data (icon Building2) |
| `database/seeders/DatabaseSeeder.php` | 3 loket (Medan Pusat, Binjai, Kualanamu), petugas_loket assigned ke Loket Medan Pusat |

### Seed Data
```sql
Loket Medan Pusat  → Jl. Stasiun No. 1, Medan        → city: Medan
Loket Binjai       → Jl. Merdeka No. 10, Binjai       → city: Binjai
Loket Kualanamu    → Bandara Kualanamu, Deli Serdang   → city: Kualanamu

Petugas Loket (loket@biwratravel.com) → loket_id = 1 (Loket Medan Pusat)
```

### Key Decisions
- `users.loket_id` nullable — hanya role `petugas_loket` diisi
- `bookings.loket_id` nullable — diisi jika `source = 'offline'`
- Route key pakai `id` (bukan uuid) mengikuti pola City

---

## Feature: User Management

### Files Created

| File | Description |
|---|---|
| `app/Http/Controllers/UserController.php` | CRUD dengan role + loket assignment |
| `resources/js/pages/dashboard/users/Index.tsx` | Daftar user (Nama, Email, Peran, Loket, Aksi) |
| `resources/js/pages/dashboard/users/Form.tsx` | Form tambah/edit user |

### Files Modified

| File | Change |
|---|---|
| `routes/web.php` | `Route::resource('users', ...)` di group superadmin |
| `resources/js/components/Sidebar.tsx` | Menu "Pengguna" pindah dari Lainnya → Master Data |

### Form Behavior
- Role dropdown: semua role dari `UserRole` enum
- Loket dropdown: **muncul hanya** saat role = `petugas_loket`, otomatis di-null jika role lain
- Password: required saat create, opsional saat edit (placeholder "Kosongkan jika tidak diubah")
- Eye toggle pada password field
- Proteksi hapus akun sendiri (redirect dengan error flash)
- `Password::defaults()` untuk validation rules
- `Rule::unique()->ignore(...)` untuk email saat edit

```
Nama     → text
Email    → email, unique
Password → required (create) / nullable (edit)
Role     → select dari UserRole enum
Loket    → select dari lokets aktif (hanya jika role=petugas_loket)
```

### Known Issues
- Pre-existing TS error di `routes/Form.tsx:72` (tidak terkait)
- `bg-fixed` ignored on iOS Safari (WebKit limitation)
- PHPStan timeout di beberapa environment
- Payment proof butuh `php artisan storage:link` untuk production
