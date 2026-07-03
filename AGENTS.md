# biwratravel — Agent Guidance

Bus ticket booking platform (Indonesia). Backend: Laravel 13 + PHP 8.4. Frontend: Inertia 3 + React 19 + TypeScript 5.7 + Tailwind CSS 4. Build: Vite 8. Test: Pest 4. WebSockets: Reverb + Echo.

## Commands

| Command | What it runs |
|---|---|
| `composer dev` | `php artisan serve` + `queue:listen --tries=1` + `vite` (concurrently) |
| `composer test` | `pint --parallel --test` → `phpstan analyse` → `php artisan test` |
| `composer lint` | `pint --parallel` (auto-fix PHP) |
| `composer ci:check` | npm lint:check → npm format:check → npm types:check → composer test |
| `npm run format` | `prettier --write resources/` |
| `npm run lint` | `eslint . --fix` |
| `npm run types:check` | `tsc --noEmit` |
| `composer types:check` | `phpstan analyse` (level 7) |

PHP CS fixer: Pint (Laravel preset). JS formatter: Prettier + Tailwind plugin. JS linter: ESLint with `@stylistic/brace-style` (1tbs, no single-line), `padding-line-between-statements` around control flow, `import/order` sorted + alpha, `consistent-type-imports`. Generated files in `resources/js/{actions,routes,wayfinder}` and `resources/js/components/ui/*` are **ignored** from linting.

## Architecture

- **Entrypoint**: `routes/web.php` + `resources/js/app.tsx` (`createInertiaApp`)
- **Frontend pages**: `resources/js/pages/`
- **Backend**: `app/Http/Controllers/`, `app/Models/`
- **Path alias**: `@/*` → `resources/js/*`
- **DB**: MySQL (local, `biwratravel` DB), SQLite (`:memory:` in tests via phpunit.xml)

## Models

| Model | Table | Key Relationships |
|---|---|---|
| `User` | `users` | Has role enum (`UserRole`): superadmin, admin_penjualan, admin_charter, driver, petugas_loket, customer |
| `City` | `cities` | - |
| `Bus` | `buses` | HasMany Route, HasMany Trip |
| `Route` | `routes` | BelongsTo Bus, HasMany Segment, HasMany Trip |
| `Segment` | `segments` | BelongsTo Route (ordered by `order`), mileage & pricing unit |
| `Trip` | `trips` | BelongsTo Route + Bus, HasMany Booking |
| `Booking` | `bookings` | BelongsTo Trip + User, HasMany Payment + BookingPassenger |
| `Payment` | `payments` | BelongsTo Booking (N attempts per booking), validated_by admin |
| `BookingPassenger` | `booking_passengers` | BelongsTo Booking, NIK-based passenger identity |
| `Charter` | `charters` | Separate flow from regular tickets, multi-stage status |

## Dashboard

| Route | Page | Access |
|---|---|---|
| `/dashboard` | `dashboard/Index` | All auth roles (stats per role) |
| `/dashboard/cities` | `dashboard/cities/{Index,Form}` | Superadmin |
| `/dashboard/buses` | `dashboard/buses/{Index,Form}` | Superadmin |
| `/dashboard/routes` | `dashboard/routes/{Index,Form}` | Superadmin |
| `/dashboard/trips` | `dashboard/trips/{Index,Form}` | Superadmin |

### Sidebar role-based menu filtering

- **superadmin**: Umum, Master Data, Transaksi, Lainnya
- **admin_penjualan**: Umum, Transaksi
- **admin_charter**: Umum
- **driver**: Umum
- **petugas_loket**: Umum, Transaksi
- **customer**: Umum

## Design System

Read `DESIGN.md` before any UI work. Key constraints:
- **Zero border radius** on all components (see `radius.md`)
- **Buttons**: only white or brand fill, no borders/shadows (see `buttons.md`)
- **Font**: Gabarito (set at app level; `vite.config.ts` imports via bunny CDN)
- **Design tokens** (`neutral-primary-soft`, `heading`, etc.) are CSS custom properties, **not** Tailwind classes — implement the mapping
- **Dark mode** automatic via `@media (prefers-color-scheme: dark)` — never swap manually
- Semantic rules: all tokens from `DESIGN.md` modules, no raw hex in components

## Business Logic

Read `LOGIC.md` before work on domain features. Key model concepts:
- **Trip** = route + date/time (what's sold)
- **Segment** = pair of adjacent cities in a route (pricing unit)
- **Capacity** = per-segment, computed from overlapping bookings
- **Booking & Payment** = separate entities (1 booking : N payment attempts)
- **Charter** = separate flow from regular tickets
- **Driver scheduling** = hybrid (recurring default + manual override)
- **Roles**: Superadmin, Admin Penjualan, Admin Charter, Driver, Petugas Loket, Customer
- Branding: lowercase `biwratravel` in UI, "Biwratravel" in browser `<title>`

## MCP

Laravel Boost (`opencode.json`) runs via `php artisan boost:mcp`. Use it for:
- `laravel-boost_database-schema`, `_query`, `_application-info`
- `laravel-boost_search-docs` for package docs
- `laravel-boost_last-error`, `_read-log-entries`, `_browser-logs` for debugging

## Testing

- Pest 4 with `pest-plugin-laravel`, phpunit.xml sets SQLite `:memory:`
- Suites: `tests/Unit/`, `tests/Feature/`
- Run focused: `php artisan test --filter=ClassName`

## CI

Workflows: `lint.yml` (push/PR to develop/main/master) + `tests.yml` (matrix PHP 8.3/8.4/8.5). CI runs `composer ci:check`.

## Build Session (Jul 2026)

### Pages built — Session 1

| File | What |
|---|---|
| `resources/js/pages/welcome.tsx` | Landing page: Hero (static bg, no parallax), Features, Gallery (auto-slider w/ nav), Parallax (bg-fixed CSS), How It Works (4 steps w/ connector lines), CTA, Footer |
| `resources/js/pages/auth/Auth.tsx` | Login/Register with animated panel swap (framer-motion), responsive (mobile stacked, desktop side-by-side) |
| `resources/js/components/LoginForm.tsx` | Login form (email, password w/ eye toggle, remember me) |
| `resources/js/components/RegisterForm.tsx` | Register form (name, email, password w/ eye toggle, confirm password w/ eye toggle) |
| `resources/js/components/Button.tsx` | Reusable button component (brand/white variants, sizes) |
| `resources/js/components/Navbar.tsx` | Top navigation bar |
| `resources/js/components/ThemeToggle.tsx` | Dark/light toggle (SSR-safe with `typeof document` guard) |
| `resources/js/components/Container.tsx` | Max-width layout wrapper |
| `resources/js/components/Footer.tsx` | Page footer |
| `app/Http/Controllers/AuthController.php` | Register, login, logout API endpoints |
| `routes/auth.php` | Auth routes (guest/auth middleware) |
| `tests/Feature/AuthTest.php` | Pest feature tests for auth |

### Pages built — Session 2

| File | What |
|---|---|
| `app/Enums/UserRole.php` | Backed string enum: superadmin, admin_penjualan, admin_charter, driver, petugas_loket, customer |
| `app/Models/User.php` | Updated with `UserRole` cast + `hasRole()`/`isSuperadmin()` methods |
| `database/migrations/..._add_role_to_users_table.php` | Adds `role` string column to users |
| `app/Models/{City,Bus,Route,Segment,Trip,Booking,Payment,BookingPassenger,Charter}.php` | Full domain models with relationships |
| `database/migrations/..._create_{cities,buses,routes,segments,trips,bookings,payments,booking_passengers,charters}_table.php` | All domain tables |
| `database/seeders/DatabaseSeeder.php` | 6 role-based accounts + 8 cities + 2 buses + 2 routes + 6 segments |
| `app/Http/Controllers/{Dashboard,City,Bus,Route,Trip}Controller.php` | Dashboard stats (per role) + CRUD controllers |
| `routes/web.php` | Updated with `/dashboard/*` route group (auth middleware) |
| `resources/js/components/DashboardLayout.tsx` | Dashboard shell with header + sidebar + mobile toggle |
| `resources/js/components/Sidebar.tsx` | Role-filtered sidebar menus, active link highlighting |
| `resources/js/components/DatePicker.tsx` | Custom calendar datepicker with month nav, today highlight, theme tokens |
| `resources/js/pages/dashboard/Index.tsx` | Dashboard home with stats cards per role |
| `resources/js/pages/dashboard/{cities,buses,routes,trips}/{Index,Form}.tsx` | CRUD pages: list + create/edit (with segments for routes) |

### Design decisions (Session 2)

- **Role enum**: PHP 8.4 native backed string enum, casts automatically via Laravel.
- **Sidebar menus**: Defined centrally in `ALL_MENUS` groups, filtered by `ROLE_MENUS[role]` mapping. Active link detected by `url.startsWith(href)`.
- **Datepicker**: Zero-radius design tokens, month/year navigation, today highlight, selected highlight in brand color. Month picker (no year dropdown for simplicity).
- **Dashboard stats**: Each role sees different stats cards (superadmin → totals, admin_penjualan → pending payments, etc.).
- **Route form**: Dynamic segment rows with add/remove, auto-assigns `bus_id` from selected route on trip form.

### Config changes

| Key | Value |
|---|---|
| `.env` `APP_LOCALE` | `id` |
| `.env` `APP_FALLBACK_LOCALE` | `id` |
| `.env` `APP_FAKER_LOCALE` | `id_ID` |
| `.env` `APP_NAME` | `Biwratravel` |
| `.env` `VITE_APP_NAME` | `Biwratravel` |
| `config/app.php` locale default | `id` (env override removed) |

### Bug fixes applied

1. **ThemeToggle SSR crash**: `useState` lazy initializer accessed `document` during SSR → added `typeof document === 'undefined'` guard.
2. **AnimatePresence routing**: `AnimatePresence` was outside `<Routes>` → moved inside so exit animations work on route change.
3. **Form scroll**: Added `window.scrollTo(0, 0)` on mount to reset scroll position on auth page load.
4. **Dark/light tokens**: Removed invalid `var(--canvas)` reference, mapped to `neutral-primary` / `neutral-secondary-soft`.
5. **Sidebar type error**: `usePage()` returns `url` at top level, not in `props` — destructured separately.
6. **Sidebar useMemo deps**: `allowedGroups` moved inside the memo callback to prevent re-render loops.

### Pages built — Session 3

| File | What |
|---|---|
| `app/Http/Controllers/BookingController.php` | List bookings with filters (status, source, date), show detail, destroy |
| `app/Http/Controllers/PaymentController.php` | List payments (default pending), approve/reject with notes |
| `resources/js/pages/dashboard/bookings/Index.tsx` | Booking list with filter panel (status, source, date range), pagination, status badges |
| `resources/js/pages/dashboard/bookings/Show.tsx` | Booking detail: customer info, trip info, passengers table, payment timeline with approve/reject inline |
| `resources/js/pages/dashboard/payments/Index.tsx` | Payment list with status tabs (pending/approved/rejected), inline approve/reject with notes input |
| `resources/js/components/Sidebar.tsx` | Added "Pembayaran" link under Transaksi group |

### Design decisions (Session 3)

- **Booking filters**: Filter panel is collapsible via toggle button. Filters preserved across pagination via `withQueryString()`.
- **Payment validation flow**: Approve + Reject actions available directly on both the Booking Show page (payment timeline) and the Payment Index list. Reject opens an inline textarea for optional notes.
- **Booking status sync**: When a payment is approved, the parent booking status automatically updates to `confirmed` (in `PaymentController::approve()`).
- **Route structure**: Booking uses resource routes (index, show, destroy). Payment uses custom POST routes (`{payment}/approve`, `{payment}/reject`) under a `payments` prefix.
- **Menu visibility**: "Pembayaran" link appears for roles with "Transaksi" group access (superadmin, admin_penjualan, petugas_loket).

### Bug fixes applied (Session 3)

1. **AuthTest login redirect**: Test expected redirect to `home` but controller redirects to `dashboard.index` — updated test to match actual behavior.
2. **Unused imports**: Removed unused `auth`/`usePage` in BookingIndex, removed unused `Clock` icon in BookingShow.

### Pages built — Session 4

| File | What |
|---|---|
| `resources/js/pages/dashboard/customer/BookingsIndex.tsx` | "Pemesanan Saya" — customer booking list with status badges, pagination, empty state |
| `app/Console/Commands/CancelExpiredBookings.php` | Scheduler command: batch-update `awaiting_payment` bookings older than 30 min to `cancelled` |
| `database/migrations/..._create_saved_passengers_table.php` | `saved_passengers` table (`user_id`, `nik`, `name`, `gender`, `birth_date`, unique per user+nik) |
| `app/Models/SavedPassenger.php` | Model for saved passengers with `user()` BelongsTo |

### Changes to existing files (Session 4)

| File | What changed |
|---|---|
| `app/Http/Controllers/BookingFlowController.php` | Added `index()` (my bookings list), `cancel()` (with graceful non-422), `create()` now passes `saved_passengers`, `store()` auto-saves passengers via `updateOrCreate` |
| `app/Models/User.php` | Added `savedPassengers()` HasMany relationship |
| `routes/web.php` | Added `GET /bookings` → `index`, `POST /booking/{booking}/cancel` → `cancel` |
| `routes/console.php` | Registered `bookings:cancel-expired` → `everyMinute()` |
| `resources/js/components/DatePicker.tsx` | Added `className` prop on trigger button for custom styling |
| `resources/js/pages/dashboard/customer/BookingCreate.tsx` | Added `saved_passengers` prop + dropdown "Penumpang Tersimpan" with auto-fill |
| `resources/js/pages/dashboard/customer/BookingPayment.tsx` | Timer: removed frontend cancel POST, shows "Waktu habis" only. Backend scheduler handles cancel. Timer stops when `booking.status !== 'awaiting_payment'` |

### Design decisions (Session 4)

- **Cancel flow**: Frontend timer is purely a display. Cancel of expired bookings is handled exclusively by the backend scheduler (`bookings:cancel-expired`, every minute). Single batch `UPDATE` query — no loops, no JOINs, no overhead. This eliminates all race conditions between frontend/backend cancel requests.
- **Cancel endpoint kept but graceful**: `POST /booking/{booking}/cancel` still exists for potential manual cancel button later. If booking is already in a final state, returns `->with('info')` instead of `abort(422)`.
- **Saved passengers**: `updateOrCreate` by `['user_id', 'nik']` unique constraint. Auto-saved when a booking is created via `store()`. Pre-filled into the first empty passenger row when selected.
- **My Bookings page**: Shows effective status (detects `pending` payment from `payments[]`). `awaiting_payment` bookings link directly to payment page.
- **Timer server-side**: Deadline = `$booking->created_at->addMinutes(30)`, sent as ISO8601 string. Consistent across page refreshes since it derives from the DB `created_at` timestamp.

### Bug fixes applied (Session 4)

1. **DatePicker year-picker overflow**: Grid all years (1950-2036) overflowed container. Fixed: decade-based 4×3 grid (12 years/page), fixed height 216px, `«`/`»` navigation.
2. **DatePicker flip flicker**: Dropdown appeared at bottom then flipped up. Fixed: pre-calculate position via `ESTIMATED_PANEL_HEIGHT` before `setOpen(true)`, so first render uses correct direction.
3. **DatePicker alignment in form**: Birth date field had no label and different height compared to other inputs. Fixed: added matching label + `className` prop to match form input styles.
4. **Pemesanan Saya menu not found**: Sidebar had menu entry but no route/page existed. Fixed: added controller method + route + page.

### Known issues

- `bg-fixed` (`background-attachment: fixed`) ignored on iOS Safari; falls back to normal scroll. This is a WebKit limitation — no workaround without JS-based parallax.
- Seeder account passwords all use `password` (from UserFactory default hash).
- PHPStan times out in some environments (level 7 on M1/WSL2).
- Payment proof image viewer links to `/storage/{proof_image}` — storage link must be configured (`php artisan storage:link`) for production.
- `routes/Form.tsx:72` — pre-existing TypeScript error (arg type `"_method"` not assignable), unrelated to session 4.
