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

- **Entrypoint**: `routes/web.php` (single Inertia route → `welcome`) + `resources/js/app.tsx` (`createInertiaApp`)
- **Frontend pages**: `resources/js/pages/` (currently only `welcome.tsx`)
- **Backend**: `app/Http/Controllers/`, `app/Models/` (only `User` exists), `app/Providers/`
- **Path alias**: `@/*` → `resources/js/*` (tsconfig, ESLint resolver)
- **No domain models exist yet** — only default Laravel users/cache/jobs migrations
- **DB**: MySQL (local, `biwratravel` DB), SQLite (`:memory:` in tests via phpunit.xml)

## Architecture

- **Entrypoint**: `routes/web.php` + `resources/js/app.tsx`
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

### Known issues

- `bg-fixed` (`background-attachment: fixed`) ignored on iOS Safari; falls back to normal scroll. This is a WebKit limitation — no workaround without JS-based parallax.
- Seeder account passwords all use `password` (from UserFactory default hash).
- PHPStan times out in some environments (level 7 on M1/WSL2).
