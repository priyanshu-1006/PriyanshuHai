# Washtro

**Garment-level chain-of-custody platform for a quick-laundry chain.**

The moat: Washtro tracks every **individual garment** (not just the order) end-to-end via a unique,
signed "Washtro ID" QR tag. Every state change is timestamped and actor-stamped in an append-only
audit log — so custody, billing, stain disputes, and delivery-window enforcement are provable, not
guessed. Built to beat order-level competitors on custody, dispute resolutions, and auto-stain economics.

---

## The pipeline

An order can only be placed against a pincode on the admin's serviceable allow-list (fail-closed —
an unlisted pin shows "coming soon" and routes into the waitlist instead of checkout). Past that
gate, every garment walks a single, no-skip status pipeline. Each transition goes through one
guarded `applyEvent()` function and appends an immutable audit record (who + when + from→to):

```
Order Placed → Picked Up → At Center (Queued) → Stain Check → In Wash → Ironing →
Scanned & Billed → Packed → Hold / Staged → Loaded → Out for Delivery → Delivered
```

## Architecture invariants (the product — never violated)

1. **Every** garment state change goes through the single guarded `applyEvent()`. No status writes outside it; no skipping stages.
2. `GarmentEvent` is **append-only** — it is the audit trail. Never updated or deleted.
3. Every event carries `actorId` + `actorRole` + timestamp. A transition with no actor is rejected.
4. Offline safety: every field action carries a client-generated UUIDv7 `clientEventId`; a DB unique constraint makes replays idempotent no-ops.
5. Money is **always integer paise** — no floats anywhere near money.
6. Hard business rules are enforced **server-side**: declared-types-only at pickup · pickup set can't close until `scanned == declared` · stain top-up is automatic (no approval) · delivery window enforced at **two** checkpoints (packing + loading) · vehicle loading locks at capacity · rate-card writes are admin-only.
7. Capacity is a Redis counter, never `COUNT(*)` on the request path.
8. The Washtro ID is signed/opaque; clients validate format locally, the server verifies the HMAC.
9. Structured addresses only (flat/building/area/city/pin) — routing depends on it.
10. Pincode serviceability is an allow-list, fail-closed: an address with no matching row is treated as not serviceable, never as "unknown and allowed."

> Full requirements & design: `docs/00_…v2.pdf` (spec) · `docs/01_washtro_master_plan.md` ·
> `docs/02_washtro_tech_impl.md` · `docs/SECURITY_AUDIT.md` · `docs/PROJECT_AUDIT.md`.

---

## Feature surface

**Customer (`web-customer`)** — a two-step order builder (select garments, then one combined
cart step for wash/fold service type, stain declarations, pickup address, receipt, and payment);
live garment-level order tracking; saved addresses with a pincode-serviceability check before
checkout; COD or Razorpay pay-now; email+password login with email-OTP-verified signup (mobile
number and an optional referral code collected up front, pincode/address deferred to post-login);
self-service display-name rename; an in-app notification bell; order reviews; a support chat; and
a mandatory one-time onboarding survey shown until answered.

**Delivery agent (`web-agent`)** — an installable, offline-first PWA for the pickup and delivery
custody loop, backed by an IndexedDB durable outbox that replays idempotently once back online.

**Washing center (`web-wc`)** — intake and stain-check scanning, a post-iron keyboard-wedge
scanner flow, and a WC-owner read-only pipeline/earnings view.

**Ops admin (`web-admin`)** — live pipeline and capacity gauges, priority-breach alerts, a live
agent map, a garment-level dispute lookup (full custody chain by Washtro ID), rate-card and GST
settings, trip/vehicle-loading management, a Locations page for the pincode-serviceability
allow-list and pre-launch waitlist (with referral tracking and pin-goes-live notifications over
email/WhatsApp/in-app), partner-application review, and the onboarding survey's response table.

**Cross-cutting** — a shared light/dark theme (CSS custom properties, no flash-of-wrong-theme) and
a two-ink logo asset pair across every surface; a sanitizing global error boundary that never
leaks stack traces, URLs, or tokens into the UI.

---

## Monorepo layout

pnpm workspaces + Turborepo.

### Apps
| App | Role | Stack |
|---|---|---|
| `apps/api` | **Backend** — FSM, event store, all domain modules, REST + WebSocket | NestJS · Prisma · PostgreSQL · Redis |
| `apps/web-customer` | Customer — order builder + live garment-level tracking | Next.js (App Router) |
| `apps/web-agent` | Delivery agent — offline-first pickup + delivery custody loop | Next.js **PWA** |
| `apps/web-wc` | Washing center — intake/stain check + post-iron keyboard-wedge scanner | Next.js |
| `apps/web-admin` | Ops dashboard + dispute tool + WC-owner read-only view | Next.js |
| `apps/web-site`, `web-landing`, `web-pitch` | Public marketing site, landing, and pitch deck | React + Vite |
| `apps/mobile-agent` | Expo RN agent app (on hold — the web-agent PWA replaces it for now) | Expo RN |

### Packages
| Package | Purpose |
|---|---|
| `packages/domain` | **SACRED** — FSM, status enum, event types, Zod schemas, Washtro-ID codec. Zero runtime deps; shared by server **and** clients. |
| `packages/sync-engine` | Durable offline outbox + idempotent sync loop (IndexedDB on web, expo-sqlite for mobile). |
| `packages/api-client` | Typed client generated from the API's OpenAPI spec. |
| `packages/ui-core` | Shared design tokens. |
| `packages/config` | Shared tsconfig / ESLint / Prettier. |

---

## Tech stack

- **Backend:** TypeScript · NestJS (modular monolith) · Prisma + PostgreSQL · Redis (capacity counter, OTP, realtime pub/sub).
- **Web:** Next.js (App Router); the agent surface is an installable PWA with an IndexedDB outbox.
- **Auth:** customers via email + password (signup is verified once via a one-time email OTP); delivery agents via phone-OTP; ops/admin/WC staff via password (TOTP scaffolded, currently disabled). JWT access (15 min) + rotating refresh in an **httpOnly cookie**; Argon2id password hashing.
- **Integrations behind provider interfaces:** Razorpay (pay) · WhatsApp BSP + Resend email (notify) · Mappls/Google (routing) · S3/R2 (stain photos). All have working stubs for local dev; swap to real by binding/env — no product-code change.

---

## Getting started

**Prerequisites:** Node 20.19+, pnpm 10+ (`corepack enable pnpm`), and a PostgreSQL 16 + Redis 7 for the API.

```bash
pnpm install                                   # installs all; generates the Prisma client

# 1) bring up Postgres + Redis (Docker example)
docker compose -f infra/docker-compose.dev.yml up -d

# 2) create apps/api/.env from apps/api/.env.example and fill the secrets (see below)

# 3) create the database schema + seed starter data
pnpm --filter @washtro/api db:push
pnpm --filter @washtro/api db:seed
```

**Required env** (`apps/api/.env`): `DATABASE_URL`, `DIRECT_URL`, `REDIS_URL`, and three secrets —
`JWT_SECRET` (≥32 chars), `JWT_REFRESH_SECRET` (≥32), `WASHTRO_ID_SECRET` (≥16). Generate one with:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```
The API validates env at boot and refuses to start if misconfigured. Razorpay/WhatsApp/Mappls/S3 keys
are **optional** — every integration has a working stub.

### Run (dev)

```bash
pnpm dev                       # turbo runs the dev servers
```
Or run one surface at a time (recommended to avoid port clashes):
```bash
pnpm --filter @washtro/api          dev   # http://localhost:4000/v1  (Swagger at /v1/docs in non-prod)
pnpm --filter @washtro/web-customer dev   # :3001
pnpm --filter @washtro/web-admin    dev   # :3002
pnpm --filter @washtro/web-agent    dev   # :3003
pnpm --filter @washtro/web-wc       dev   # :3004
```
The web apps proxy `/v1/*` to the API same-origin in dev (Next `rewrites`), so no CORS is needed locally.

---

## Commands

```bash
pnpm typecheck     # all packages (tsc)
pnpm lint          # ESLint
pnpm test          # unit tests (Vitest, no DB needed)
pnpm test:int      # integration tests — spins up its own embedded Postgres (no Docker needed)
pnpm build         # production build of the API + web apps + libs
pnpm format        # Prettier
```

**Quality gate before any change:** `pnpm typecheck && pnpm lint && pnpm test`.
Money/audit-critical paths (FSM, `applyEvent` + stage guards, billing, sync engine, Washtro-ID codec,
auth) are unit/integration tested — never ship them untested.

---

## Security

- `.env` is gitignored (only `.env.example` placeholders are committed).
- Helmet security headers, per-IP rate limiting (`@nestjs/throttler`, strict on `/v1/auth/*`), CORS allowlist, Swagger gated to non-prod, 1 MB JSON body cap.
- Refresh token in an httpOnly/SameSite/Secure cookie (never in JS-readable storage); the HMAC signing secret never ships to the browser.
- Parameterized Prisma queries; a global exception filter that never leaks stack traces; client error UIs sanitized so no URLs/tokens surface.

See `docs/SECURITY_AUDIT.md` for the full findings + remediation.

---

## Deployment (Vercel + a Node host for the API)

Each Next.js app deploys independently from this Turborepo.

**Web apps (e.g. `apps/web-agent`):**
- Import the repo in Vercel; it auto-detects Next.js.
- **Build Command:** `npx turbo run build --filter=@washtro/web-agent`
- **Install Command:** `pnpm install` · **Output Directory:** `apps/web-agent/.next`
- **Env:** `NEXT_PUBLIC_API_URL` → your deployed API. Repeat per app, substituting the filter and output dir.

**API (`apps/api`)** — deploy the NestJS app to Render/Railway/Fly (or Vercel functions):
- **Build:** `pnpm --filter @washtro/api build` · **Output:** `apps/api/dist` · **Start:** `node apps/api/dist/main.js`
- **Env:** `DATABASE_URL` + `DIRECT_URL` (Postgres/Supabase), `REDIS_URL`, the three secrets, `NODE_ENV=production`, and `CORS_ORIGINS` (comma-separated allowlist of your web-app origins). Optional: Razorpay/WhatsApp/Mappls/S3 keys to switch the stubs to real provider.
