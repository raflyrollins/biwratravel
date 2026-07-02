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

### Pages built

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

### Design decisions

- **Hero**: single static image, no rotation, no parallax. Content fades in with framer-motion on mount.
- **Gallery**: placed between Features and Parallax. Auto-rotates every 4s, prev/next arrows, dot navigation. Uses `AnimatePresence` for crossfade.
- **Parallax section ("Setiap Perjalanan Punya Cerita")**: uses CSS `background-attachment: fixed` (`bg-fixed` Tailwind class). No JS. Background stays fixed while content scrolls normally. Falls back to normal scroll on iOS Safari (known `bg-fixed` limitation).
- **Password visibility**: Eye/EyeOff icons on both password and password confirmation fields, separate toggle state per field.
- **Page titles**: Dynamic via `app.tsx` title callback → `"Title - Biwratravel"`. Welcome: "Selamat Datang - Biwratravel", Login: "Masuk - Biwratravel", Register: "Daftar - Biwratravel".

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

### Known issues

- `bg-fixed` (`background-attachment: fixed`) ignored on iOS Safari; falls back to normal scroll. This is a WebKit limitation — no workaround without JS-based parallax.
