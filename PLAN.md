# Implementation Plan: LITHIQUE BY SHWETA — High-Fidelity MVP

## Overview

Six milestones delivered as vertical slices. Each milestone ships working, testable functionality.
Dependency order: Foundation → Provenance Engine → Admin Panel → Design System →
Relic Detail + Commerce → Polish + Ship.

---

## Architecture Decisions

- **Supabase Auth** handles admin sessions via server-side cookies (Next.js middleware).
  NFC IDs are generated server-side as UUIDs and never exposed in client JS bundles.
- **Prisma** sits in front of Supabase Postgres for type-safe queries. Supabase RLS provides
  a second layer of access control.
- **NFC URL scheme:** `https://lithique.in/verify/{uuid-v4}` — the UUID is the NFC chip payload.
  QR codes point to the same URL (future sprint).
- **`@google/model-viewer`** is loaded as a custom element via dynamic import to avoid SSR issues.
- **PDF generation** runs in a Next.js API route (Node.js runtime), not edge runtime.
- **Resend** sends admin email on each inquiry submission (fire-and-forget, non-blocking).

---

## Dependency Graph

```
[M1] Foundation (schema, types, env, tooling)
        │
        ├── [M2] Provenance Engine (verify API + page + PDF)
        │           │
        │           └── [M3] Admin Panel (auth + relic CRUD + inquiry inbox)
        │                       │
        │                       ├── [M4] Design System (tokens + hero + catalog)
        │                       │               │
        │                       └───────────────┴── [M5] Relic Detail + Commerce
        │                                                       │
        └───────────────────────────────────────────────── [M6] Polish + Ship
```

---

## Milestone 1: Foundation

Project scaffolding, database schema, shared types, environment wiring.
Everything after this depends on this being solid.

---

### Task 1.1 — Scaffold Next.js 14 project with full toolchain

**Description:** Initialize the Next.js 14 App Router project with TypeScript strict mode,
Tailwind CSS, ESLint, Prettier, and Jest. Configure path aliases and verify the dev server starts.

**Acceptance criteria:**
- [ ] `npm run dev` starts without errors at `localhost:3000`
- [ ] `npm run type-check` passes with zero errors
- [ ] `npm run lint` passes with zero warnings
- [ ] `tsconfig.json` has `"strict": true` and `"@/*": ["./src/*"]` path alias
- [ ] Tailwind configured with `content` pointing to `src/**`

**Verification:**
- [ ] `npm run build` produces a clean build
- [ ] `npm test` runs (0 tests, but no errors)

**Dependencies:** None

**Files likely touched:**
- `package.json`, `tsconfig.json`, `tailwind.config.ts`
- `next.config.js`, `.eslintrc.json`, `prettier.config.js`
- `jest.config.ts`, `jest.setup.ts`

**Estimated scope:** M

---

### Task 1.2 — Design token layer (CSS variables + Tailwind extension)

**Description:** Establish the complete luxury token system in `globals.css` and extend Tailwind
with `lithique-*` color/font tokens so every component uses variables, never hardcoded hex values.

**Acceptance criteria:**
- [ ] All six `--lithique-*` CSS variables defined in `:root`
- [ ] Tailwind `theme.extend` maps `obsidian`, `gold`, `warm-white`, `stone-mid` to variables
- [ ] Font face declarations for Cormorant Garamond (self-hosted from `public/fonts/`)
- [ ] `--tracking-luxury` and `--transition-relic` variables defined
- [ ] A `<body>` default of `background: var(--lithique-obsidian); color: var(--lithique-warm-white)`

**Verification:**
- [ ] Root page renders with obsidian background and warm-white text
- [ ] `npm run type-check` still passes

**Dependencies:** Task 1.1

**Files likely touched:**
- `src/app/globals.css`, `tailwind.config.ts`
- `src/app/layout.tsx`, `public/fonts/` (font files)

**Estimated scope:** S

---

### Task 1.3 — Prisma schema + Supabase connection

**Description:** Write the full Prisma schema (Relic, Provenance, Inquiry, enums), configure
the Supabase Postgres connection string, run the initial migration, and create the Prisma
singleton client.

**Acceptance criteria:**
- [ ] `prisma/schema.prisma` matches the data model in SPEC.md exactly
- [ ] `npx prisma migrate dev --name init` runs without errors
- [ ] `src/lib/prisma.ts` exports a singleton `prisma` client
- [ ] `npx prisma studio` opens and shows all three tables
- [ ] `.env.local` has `DATABASE_URL` and `DIRECT_URL` (Supabase pooled + direct)

**Verification:**
- [ ] `npx prisma validate` passes
- [ ] `npm run type-check` passes (Prisma client generated)

**Dependencies:** Task 1.1

**Files likely touched:**
- `prisma/schema.prisma`, `src/lib/prisma.ts`
- `.env.local` (not committed), `.env.example` (committed, values redacted)

**Estimated scope:** S

---

### Task 1.4 — Shared TypeScript types + NFC utility

**Description:** Define all shared types in `src/types/index.ts` (derived from Prisma but
framework-agnostic). Write the NFC utility — `generateNfcId()` (UUID v4, server-only) and
`buildVerifyUrl(nfcId)` — with unit tests.

**Acceptance criteria:**
- [ ] `Relic`, `Provenance`, `Inquiry`, `OwnerChainEntry` types exported from `src/types/index.ts`
- [ ] `generateNfcId()` returns a UUID v4 string
- [ ] `buildVerifyUrl('abc-123')` returns `'/verify/abc-123'`
- [ ] Unit tests for both NFC utility functions pass

**Verification:**
- [ ] `npm test -- --testPathPattern=nfc` passes
- [ ] `npm run type-check` passes

**Dependencies:** Task 1.3

**Files likely touched:**
- `src/types/index.ts`, `src/lib/nfc.ts`
- `tests/unit/nfc.test.ts`

**Estimated scope:** S

---

### Checkpoint: Milestone 1

- [ ] `npm run dev` — app loads, obsidian background visible
- [ ] `npm run build` — clean, zero TS errors
- [ ] `npx prisma studio` — three tables visible with correct schema
- [ ] `npm test` — NFC utility tests pass

---

## Milestone 2: Provenance Engine

The core value proposition. A client scans a chip → lands on `/verify/[nfcId]` → sees the
full lineage of their relic. Must work server-rendered (no JS required for the data display).

---

### Task 2.1 — `/api/verify/[nfcId]` route

**Description:** API route that accepts an NFC ID, queries Prisma for the relic + provenance,
and returns structured JSON. Returns 404 with a specific `{ code: 'NOT_REGISTERED' }` body for
unknown IDs, and 404 `{ code: 'NOT_PUBLISHED' }` for unpublished relics.

**Acceptance criteria:**
- [ ] `GET /api/verify/abc-123` returns relic + provenance JSON for a valid, published relic
- [ ] Returns `{ code: 'NOT_REGISTERED' }` + 404 for an unknown nfcId
- [ ] Returns `{ code: 'NOT_PUBLISHED' }` + 404 for an unpublished relic
- [ ] NFC ID is validated server-side (UUID v4 format check before DB query)
- [ ] No PII in error messages or logs
- [ ] Integration test covers all three cases

**Verification:**
- [ ] `npm test -- --testPathPattern=verify` passes all three cases

**Dependencies:** Task 1.3, Task 1.4

**Files likely touched:**
- `src/app/api/verify/[nfcId]/route.ts`
- `tests/unit/api-verify.test.ts`

**Estimated scope:** S

---

### Task 2.2 — Provenance display components

**Description:** Build `ProvenanceCard` (lineage timeline: quarry → artisan → owner chain) and
`NFCScanner` (Web NFC API scanner with graceful degradation message for unsupported browsers).
Both use luxury design tokens exclusively.

**Acceptance criteria:**
- [ ] `ProvenanceCard` renders quarry region, stone type, artisan name, creation date, owner chain
- [ ] Owner chain renders as a vertical timeline with gold connector lines
- [ ] `NFCScanner` calls `NDEFReader` when Web NFC is available
- [ ] When Web NFC unavailable, renders: "To verify this relic, scan the NFC medallion with an
  Android device running Chrome, or visit the URL inscribed on your Certificate of Permanence."
- [ ] No hardcoded colors — all `var(--lithique-*)` tokens
- [ ] Component tests for ProvenanceCard rendering pass

**Verification:**
- [ ] `npm test -- --testPathPattern=ProvenanceCard` passes
- [ ] Manual: component renders correctly in Storybook or dev page

**Dependencies:** Task 1.2, Task 1.4

**Files likely touched:**
- `src/components/provenance/ProvenanceCard.tsx`
- `src/components/provenance/NFCScanner.tsx`
- `tests/unit/ProvenanceCard.test.tsx`

**Estimated scope:** M

---

### Task 2.3 — `/verify/[nfcId]` page (server-rendered)

**Description:** Server Component page that calls the verify API internally, renders
`ProvenanceCard` with the relic data, and handles both error states (NOT_REGISTERED,
NOT_PUBLISHED) with elegant copy. Page must render complete provenance without JavaScript.

**Acceptance criteria:**
- [ ] Valid NFC ID → full provenance rendered server-side
- [ ] Unknown NFC ID → renders: "This relic has not yet crossed into our records.
  Its stone endures; its lineage will follow."
- [ ] Unpublished → same graceful state (no information leak)
- [ ] Page title is the relic name + "— LITHIQUE BY SHWETA"
- [ ] OpenGraph meta includes relic name and first image
- [ ] Provenance data visible with JS disabled (test in browser devtools)

**Verification:**
- [ ] `npm run build && npm start` — page loads, no hydration errors
- [ ] Disable JS in browser → provenance still visible

**Dependencies:** Task 2.1, Task 2.2

**Files likely touched:**
- `src/app/(storefront)/verify/[nfcId]/page.tsx`

**Estimated scope:** S

---

### Task 2.4 — Certificate of Permanence PDF

**Description:** API route at `/api/certificate/[nfcId]` that generates a branded PDF using
`@react-pdf/renderer`. The PDF includes relic name, provenance lineage, NFC ID, generation
date, and LITHIQUE BY SHWETA branding. `CertificateButton` client component triggers download.

**Acceptance criteria:**
- [ ] `GET /api/certificate/abc-123` returns a PDF with `Content-Type: application/pdf`
- [ ] PDF contains: relic name, stone type, quarry origin, artisan name, NFC ID, creation date
- [ ] PDF uses gold accent color (`#C9A84C`) and serif typography
- [ ] `CertificateButton` triggers download via fetch + blob URL
- [ ] Returns 404 for unknown or unpublished NFC IDs
- [ ] No client PII stored in PDF generation logs

**Verification:**
- [ ] Manual: download PDF, verify content and styling
- [ ] `npm run type-check` passes

**Dependencies:** Task 2.1

**Files likely touched:**
- `src/app/api/certificate/[nfcId]/route.ts`
- `src/lib/pdf.ts`
- `src/components/provenance/CertificateButton.tsx`

**Estimated scope:** M

---

### Checkpoint: Milestone 2

- [ ] Seed a test relic + provenance record via `prisma studio`
- [ ] Visit `/verify/{nfcId}` — full lineage renders server-side
- [ ] Visit `/verify/invalid-id` — graceful error copy renders
- [ ] Click "Certificate of Permanence" — PDF downloads with correct data
- [ ] All Milestone 2 unit tests pass

---

## Milestone 3: Admin Panel

Protected area for Shweta to manage relics, assign NFC IDs, and review inquiries.
Auth guard must be airtight — no unauthenticated access to any `/admin/*` route.

---

### Task 3.1 — Supabase Auth + admin middleware

**Description:** Configure Supabase Auth for email/password login. Write Next.js middleware
that protects all `/admin/*` routes, redirecting unauthenticated users to `/admin/login`.
Write the login page.

**Acceptance criteria:**
- [ ] `src/middleware.ts` redirects unauthenticated requests from `/admin/*` to `/admin/login`
- [ ] Login page submits email/password to Supabase Auth
- [ ] Successful login redirects to `/admin`
- [ ] Failed login shows: "Access denied. The archive does not recognize your credentials."
- [ ] Session stored in HTTP-only cookie (Supabase SSR helper)
- [ ] Logout clears session and redirects to homepage
- [ ] Direct navigation to `/admin` while unauthenticated → redirect to login (test manually)

**Verification:**
- [ ] Navigate to `/admin` unauthenticated → redirected to `/admin/login`
- [ ] Log in with valid credentials → reach dashboard
- [ ] `npm run type-check` passes

**Dependencies:** Task 1.1

**Files likely touched:**
- `src/middleware.ts`
- `src/app/admin/layout.tsx`
- `src/app/admin/login/page.tsx`
- `src/lib/supabase/client.ts`, `src/lib/supabase/server.ts`

**Estimated scope:** M

---

### Task 3.2 — Admin relic list dashboard

**Description:** Admin homepage showing all relics (published + draft) in a table with status,
tier, NFC assignment status, and action links. Includes summary counts: total relics, pending
inquiries, unassigned NFC IDs.

**Acceptance criteria:**
- [ ] Table columns: Name, Tier, Status (Published/Draft), NFC Assigned (Yes/No), Actions
- [ ] "New Relic" CTA links to `/admin/relics/new`
- [ ] Each row has Edit and View links
- [ ] Summary bar shows count of pending inquiries
- [ ] Empty state: "No relics have been committed to the archive yet."

**Verification:**
- [ ] Log in as admin → dashboard renders with seeded test relic
- [ ] `npm run type-check` passes

**Dependencies:** Task 3.1, Task 1.3

**Files likely touched:**
- `src/app/admin/page.tsx`
- `src/app/api/admin/relics/route.ts`

**Estimated scope:** S

---

### Task 3.3 — Create + edit relic form

**Description:** Form for creating a new relic (name, slug, tagline, description, tier, price
range, images) and a separate provenance section (quarry name, region, stone type, artisan,
creation date). NFC ID field is a separate action: "Assign NFC Chip" generates a UUID and
displays it for encoding onto the physical chip.

**Acceptance criteria:**
- [ ] All fields from the Prisma schema are editable
- [ ] "Assign NFC Chip" button calls `generateNfcId()` server-side, saves to DB, displays UUID
- [ ] NFC ID field is read-only after assignment (cannot be changed via UI)
- [ ] Slug auto-generated from name, editable
- [ ] "Publish" toggle — defaults to draft
- [ ] Server-side validation: required fields, slug uniqueness, price min ≤ max
- [ ] Success redirects to `/admin/relics/{id}` with "Relic committed to the archive." toast

**Verification:**
- [ ] Create a relic end-to-end: fill form → assign NFC → publish → verify in DB
- [ ] Try submitting with empty required fields → validation errors shown
- [ ] `npm run type-check` passes

**Dependencies:** Task 3.2

**Files likely touched:**
- `src/app/admin/relics/new/page.tsx`
- `src/app/admin/relics/[id]/page.tsx`
- `src/app/api/admin/relics/route.ts`

**Estimated scope:** L (complex form — worth the size, no good split)

---

### Task 3.4 — Inquiry inbox

**Description:** Admin page listing all acquisition inquiries with client name, email, relic
name, submission date, and status. Admin can update status (PENDING → REVIEWED → REPLIED →
CLOSED). Clicking a row expands the full message.

**Acceptance criteria:**
- [ ] All inquiries listed, newest first
- [ ] Filterable by status via tab nav
- [ ] Status dropdown per row updates via PATCH `/api/admin/inquiries/[id]`
- [ ] Expanded row shows full client message
- [ ] Client phone shown if provided
- [ ] Empty state: "The archive awaits its first inquiry."

**Verification:**
- [ ] Submit a test inquiry via the public form → appears in inbox
- [ ] Update status → persists on refresh
- [ ] `npm run type-check` passes

**Dependencies:** Task 3.1

**Files likely touched:**
- `src/app/admin/inquiries/page.tsx`
- `src/app/api/admin/inquiries/route.ts`
- `src/app/api/admin/inquiries/[id]/route.ts`

**Estimated scope:** M

---

### Checkpoint: Milestone 3

- [ ] Full admin flow: log in → create relic → assign NFC → fill provenance → publish
- [ ] Visit `/verify/{nfcId}` with newly published relic → provenance renders
- [ ] Unauthenticated `/admin` access → redirect confirmed
- [ ] Inquiry inbox shows and updates status correctly

---

## Milestone 4: Luxury Design System

Storefront shell, cinematic hero, catalog grid, and scroll animations.
This is the face of LITHIQUE — every pixel must feel deliberate and permanent.

---

### Task 4.1 — Global layout: nav + footer

**Description:** Storefront layout with a minimal navigation (LITHIQUE BY SHWETA wordmark,
"The Archive" link to `/relics`, thin gold underline on hover) and a footer with the brand
philosophy statement. No hamburger menu — desktop-first for private clients.

**Acceptance criteria:**
- [ ] Nav: LITHIQUE BY SHWETA wordmark (serif, tracked), "The Archive" nav item
- [ ] Nav background: transparent over hero, obsidian after scroll (Framer Motion `useScroll`)
- [ ] Footer: "Stone endures. All else is commentary." in small tracked serif
- [ ] No mobile hamburger in MVP (single nav item, collapses gracefully at 375px)
- [ ] Layout wraps all `(storefront)` pages

**Verification:**
- [ ] `npm run build` — no hydration mismatch on nav scroll behavior
- [ ] Manual: scroll homepage → nav transitions correctly

**Dependencies:** Task 1.2

**Files likely touched:**
- `src/app/(storefront)/layout.tsx`
- `src/components/storefront/Nav.tsx`
- `src/components/storefront/Footer.tsx`

**Estimated scope:** M

---

### Task 4.2 — Cinematic homepage hero

**Description:** Full-screen hero with a stone texture background (image or looping video),
the LITHIQUE BY SHWETA wordmark revealed with a slow fade, and a single line of philosophy
copy beneath. "Enter the Archive" CTA scrolls to the relic grid or links to `/relics`.

**Acceptance criteria:**
- [ ] Hero is 100vh, edge-to-edge, no overflow
- [ ] Stone texture background (use a high-res stone image from `public/textures/` for MVP)
- [ ] Wordmark fades in over 1200ms on mount (Framer Motion)
- [ ] Philosophy copy: "That which is carved from stone does not merely exist — it persists."
- [ ] "Enter the Archive" CTA in aged-gold, letter-spaced, with a thin gold underline hover
- [ ] LCP element (the background image) has `priority` on Next.js `<Image>`

**Verification:**
- [ ] Lighthouse: LCP < 2.5s with image pre-optimized
- [ ] Manual: hero renders at 1920px, 1440px, 375px

**Dependencies:** Task 4.1

**Files likely touched:**
- `src/app/(storefront)/page.tsx`
- `src/components/storefront/Hero.tsx`
- `public/textures/hero-stone.jpg`

**Estimated scope:** M

---

### Task 4.3 — Relic catalog grid with scroll reveals

**Description:** `/relics` page rendering all published relics in a brutalist-luxury asymmetric
grid. Each `RelicCard` shows image, name, tier badge, and tagline. Cards reveal with staggered
Framer Motion scroll animations as they enter the viewport.

**Acceptance criteria:**
- [ ] Grid: 3-column desktop, 2-column tablet, 1-column mobile
- [ ] Asymmetric layout: every 5th card spans 2 columns (brutalist rhythm)
- [ ] `RelicCard`: relic image (Next.js `<Image>`), name in serif, tier badge in gold
- [ ] Tagline appears on hover with a 400ms opacity transition
- [ ] Each card links to `/relics/{slug}`
- [ ] Cards animate in with `y: 40 → 0, opacity: 0 → 1` staggered by 100ms
- [ ] Empty state if no published relics: "The archive is being assembled. Return when the stone speaks."

**Verification:**
- [ ] Seed 6+ relics → grid renders with asymmetric layout
- [ ] Scroll down → cards animate in correctly
- [ ] `npm run build` — no errors

**Dependencies:** Task 4.1, Task 1.3

**Files likely touched:**
- `src/app/(storefront)/relics/page.tsx`
- `src/components/storefront/RelicGrid.tsx`
- `src/components/storefront/RelicCard.tsx`

**Estimated scope:** M

---

### Task 4.4 — Core UI primitive components

**Description:** Build the reusable UI primitives: `Button` (variants: `gold-outline`,
`ghost`, `obsidian`), `GoldDivider`, `PatinaSurface` (CSS stone texture overlay),
`Typography` components (Display, Heading, Body, Caption with luxury tracking).

**Acceptance criteria:**
- [ ] `<Button variant="gold-outline">Inquire for Acquisition</Button>` renders correctly
- [ ] `<GoldDivider />` renders a 1px `--lithique-gold` horizontal rule with side margins
- [ ] `<PatinaSurface>` applies a CSS `::before` overlay with stone noise texture
- [ ] Typography scale: Display (72px), Heading (48px), Subheading (32px), Body (18px), Caption (13px)
- [ ] All use `--font-serif` and `--tracking-luxury`
- [ ] Zero hardcoded hex values in any component

**Verification:**
- [ ] `npm test -- --testPathPattern=Button` passes
- [ ] Visual check: render each component on a test page

**Dependencies:** Task 1.2

**Files likely touched:**
- `src/components/ui/Button.tsx`
- `src/components/ui/GoldDivider.tsx`
- `src/components/ui/PatinaSurface.tsx`
- `src/components/ui/Typography.tsx`
- `tests/unit/Button.test.tsx`

**Estimated scope:** M

---

### Checkpoint: Milestone 4

- [ ] Homepage hero loads with stone texture, wordmark animates in
- [ ] `/relics` grid shows relics with staggered scroll reveal
- [ ] Nav transitions from transparent to obsidian on scroll
- [ ] All UI primitive variants render correctly
- [ ] `npm run build` — clean

---

## Milestone 5: Relic Detail Page + Commerce Layer

The relic detail page is where acquisition intent is formed. The 3D viewer and inquiry form
must feel like a private gallery, not a product page.

---

### Task 5.1 — Relic detail page layout

**Description:** Full relic detail page at `/relics/[slug]` with: full-bleed hero image,
relic name + tagline, philosophy description, tier + investment range display, provenance
teaser (links to full verify page), and the 3D viewer + inquiry form sections.

**Acceptance criteria:**
- [ ] Full-bleed hero image with `object-fit: cover`
- [ ] Name in Display typography, tagline in Caption tracked gold
- [ ] Description renders as rich paragraphs (no markdown parser needed — plain text with `<br>`)
- [ ] Investment range: "From ₹15,000" or "₹50,000 — ₹5,00,000" (formatted in INR, no "Price:")
- [ ] Provenance teaser: stone type + quarry region + "View Full Lineage →" link to `/verify/{nfcId}`
- [ ] "View Full Lineage" only shown if relic has an assigned NFC ID
- [ ] `<GoldDivider />` between sections
- [ ] Page fully renders server-side

**Verification:**
- [ ] `npm run build` — no errors
- [ ] Manual: page renders at 1440px and 375px

**Dependencies:** Task 4.4, Task 2.2

**Files likely touched:**
- `src/app/(storefront)/relics/[slug]/page.tsx`
- `src/components/storefront/RelicDetail.tsx`

**Estimated scope:** M

---

### Task 5.2 — 3D relic viewer

**Description:** `RelicViewer3D` client component wrapping `@google/model-viewer`. Loads the
`.glb` model from Supabase Storage URL. Uses `lighting-estimation` + `environment-image` set
to a neutral museum preset. Includes rotation controls and a fullscreen toggle.

**Acceptance criteria:**
- [ ] Component loads dynamically (no SSR) via `next/dynamic` with a stone-texture placeholder
- [ ] 360° rotation works with touch and mouse drag
- [ ] Camera orbit bounds prevent model from going below ground plane
- [ ] "Rotate to observe all facets" caption beneath viewer in Caption typography
- [ ] Graceful fallback if no `.glb` model assigned: displays first relic image in a styled frame
- [ ] Viewer width: 100% of container, aspect ratio 4:3

**Verification:**
- [ ] Upload a test `.glb` file → model loads and rotates
- [ ] Remove model URL → fallback image renders
- [ ] `npm run build` — no SSR errors

**Dependencies:** Task 5.1

**Files likely touched:**
- `src/components/viewer/RelicViewer3D.tsx`

**Estimated scope:** M

---

### Task 5.3 — "Inquire for Acquisition" form + API

**Description:** `InquireForm` client component with fields: name, email, phone (optional),
message. Submits to `/api/inquire`. Server validates, saves to DB, sends Resend email to admin.
Form uses luxury styling — no visible form borders, only gold underlines on inputs.

**Acceptance criteria:**
- [ ] Fields: Full Name, Email Address, Phone (optional), "Your intent regarding this relic" (textarea)
- [ ] Submit button: "Inquire for Acquisition" (gold-outline variant)
- [ ] Client-side: required field validation before submit
- [ ] Server-side: email format, text sanitization, relicId validation
- [ ] On success: form replaced by: "Your inquiry has been received and shall be treated with
  the discretion it deserves. Expect correspondence."
- [ ] Admin receives Resend email with client name, email, relic name, and message
- [ ] No "price", "buy", "cart", or "checkout" appears in this component

**Verification:**
- [ ] Submit valid form → success message shown + inquiry in admin inbox + admin email received
- [ ] Submit with empty email → validation error shown
- [ ] `npm test -- --testPathPattern=InquireForm` passes

**Dependencies:** Task 3.4, Task 5.1

**Files likely touched:**
- `src/components/commerce/InquireForm.tsx`
- `src/app/api/inquire/route.ts`
- `src/lib/email.ts`
- `tests/unit/InquireForm.test.tsx`

**Estimated scope:** M

---

### Task 5.4 — "Reserve a Relic" waitlist CTA

**Description:** For relics not yet available for inquiry (e.g., COMMISSION tier or unavailable
pieces), a `ReserveButton` opens a minimal modal with name + email only. Saves to a
`waitlist` field on the Inquiry model (add `isWaitlist: Boolean` to schema).

**Acceptance criteria:**
- [ ] `ReserveButton` shown only when relic is published but `inquiryOpen: false` (new field)
- [ ] Modal copy: "This relic is reserved for private consideration. Leave your name and we
  will reach out when its future becomes clear."
- [ ] Submits name + email only, saved with `isWaitlist: true`
- [ ] Success: "Your name has been committed to the stone's record."
- [ ] Schema migration adds `isWaitlist Boolean @default(false)` to Inquiry

**Verification:**
- [ ] Set a relic to `inquiryOpen: false` → ReserveButton shown, InquireForm hidden
- [ ] Submit waitlist → entry in DB with `isWaitlist: true`
- [ ] `npx prisma migrate dev` runs clean

**Dependencies:** Task 5.3

**Files likely touched:**
- `src/components/commerce/ReserveButton.tsx`
- `prisma/schema.prisma` (migration)
- `src/app/api/inquire/route.ts`

**Estimated scope:** S

---

### Checkpoint: Milestone 5

- [ ] Full client journey: `/relics` grid → relic detail → 3D viewer rotates → "Inquire for Acquisition" submits
- [ ] Admin receives email notification
- [ ] Inquiry appears in admin inbox
- [ ] "View Full Lineage" on detail page → `/verify/{nfcId}` → full provenance
- [ ] Download Certificate of Permanence from verify page

---

## Milestone 6: Polish + Security + Ship

Harden the application, hit Core Web Vitals targets, run the security checklist, deploy.

---

### Task 6.1 — Security hardening

**Description:** Audit and fix all security concerns identified in the spec boundaries.

**Acceptance criteria:**
- [ ] Supabase RLS policies: `relics` readable by all (published only), writable by admin only;
  `inquiries` readable + writable by admin only; `provenance` readable by all, writable by admin
- [ ] All API route inputs validated with `zod` schemas
- [ ] Inquiry form text sanitized (strip HTML tags) before DB write
- [ ] `Content-Security-Policy` header set in `next.config.js`
- [ ] `X-Frame-Options: DENY` header set
- [ ] No NFC IDs in client-side JS bundles (verify with `npm run build` bundle analysis)
- [ ] `.env.example` documents all required vars; `.env.local` in `.gitignore`

**Verification:**
- [ ] `npm run build` — bundle analysis shows no secrets
- [ ] Test RLS: direct Supabase query without auth → only published relics visible
- [ ] `npm run type-check` passes

**Dependencies:** All previous milestones

**Files likely touched:**
- `next.config.js`, `src/app/api/*/route.ts`
- Supabase dashboard (RLS policies)

**Estimated scope:** M

---

### Task 6.2 — Performance optimization + Core Web Vitals

**Description:** Optimize for LCP < 2.5s and CLS < 0.1. Focus on hero image, relic images,
font loading, and 3D viewer deferred loading.

**Acceptance criteria:**
- [ ] Hero image: Next.js `<Image priority>` with explicit `width` + `height` (no CLS)
- [ ] All relic grid images: `loading="lazy"` + explicit dimensions
- [ ] Fonts: `font-display: swap` + preload in `<head>`
- [ ] `model-viewer` script loaded only on relic detail pages (not globally)
- [ ] Framer Motion: `LazyMotion` + `domAnimation` feature set only (not full bundle)
- [ ] `next/dynamic` for `RelicViewer3D`, `NFCScanner`, `InquireForm`
- [ ] Lighthouse score ≥ 90 on `/relics/[slug]` (Performance)

**Verification:**
- [ ] Run Lighthouse on relic detail page in incognito → Performance ≥ 90
- [ ] Verify LCP < 2.5s, CLS < 0.1 in Lighthouse report

**Dependencies:** Milestones 4 + 5

**Files likely touched:**
- `src/components/storefront/Hero.tsx`
- `src/components/storefront/RelicCard.tsx`
- `src/app/(storefront)/relics/[slug]/page.tsx`
- `src/app/layout.tsx`

**Estimated scope:** M

---

### Task 6.3 — Seed data + demo content

**Description:** Create a seed script with 3 demo relics (one per tier) with realistic
philosophy-voice copy, provenance data, and placeholder images. NFC IDs pre-assigned so
the verify flow can be demoed end-to-end.

**Acceptance criteria:**
- [ ] `npx prisma db seed` creates 3 published relics with full provenance
- [ ] Each relic has copy in the philosophy voice (meditation on permanence)
- [ ] Each has a pre-assigned NFC ID for demo scanning
- [ ] Tier coverage: one ENTRY, one COLLECTOR, one COMMISSION
- [ ] Seed is idempotent (safe to run multiple times)

**Verification:**
- [ ] Run seed → `/relics` shows 3 relics
- [ ] Visit `/verify/{nfcId}` for each → full provenance renders
- [ ] Run seed again → no duplicate records

**Dependencies:** Task 1.3

**Files likely touched:**
- `prisma/seed.ts`, `package.json` (`prisma.seed` config)

**Estimated scope:** S

---

### Task 6.4 — Vercel deployment + environment configuration

**Description:** Deploy to Vercel. Configure all environment variables in Vercel dashboard.
Verify production build works, Supabase connection is live, and email sends correctly.

**Acceptance criteria:**
- [ ] Production URL accessible
- [ ] `npm run build` passes in Vercel CI (no local-only env vars hardcoded)
- [ ] Supabase DB connection works from Vercel (connection pooling configured)
- [ ] Test inquiry submission in production → admin email received
- [ ] Test NFC verify flow in production with a seeded NFC ID
- [ ] Vercel Analytics enabled (Core Web Vitals tracking)

**Verification:**
- [ ] Open production URL → homepage loads
- [ ] End-to-end journey works in production

**Dependencies:** All previous milestones

**Files likely touched:**
- `vercel.json` (if custom config needed)
- `.env.example` (document all vars)

**Estimated scope:** S

---

### Checkpoint: Final — MVP Complete

- [ ] All 11 success criteria from SPEC.md are met
- [ ] Lighthouse Performance ≥ 90 on relic detail page
- [ ] Zero instances of "cart", "buy", "shop", "checkout" in rendered HTML
- [ ] Admin can complete full relic lifecycle: create → NFC assign → publish → receive inquiry
- [ ] Client can complete full journey: browse → detail → 3D view → inquire → verify provenance → download certificate
- [ ] Production deployment live and stable

---

## Risks and Mitigations

| Risk | Impact | Mitigation |
|---|---|---|
| Web NFC API not supported on iOS | High | QR fallback URL planned; verify page works without NFC scan |
| `@google/model-viewer` SSR issues | Medium | Wrapped in `next/dynamic` with `ssr: false` |
| Supabase connection pooling on Vercel | Medium | Use `DIRECT_URL` for migrations, `DATABASE_URL` (pooled) for runtime |
| `@react-pdf/renderer` edge runtime incompatibility | Medium | PDF route uses `export const runtime = 'nodejs'` |
| Large `.glb` files impacting LCP | Low | `model-viewer` deferred; never blocks page render |
| Framer Motion bundle size | Low | `LazyMotion` + `domAnimation` reduces to ~18kb |

---

## Implementation Order Summary

```
M1: Foundation          ← Start here (2-3 tasks, ~1 session)
M2: Provenance Engine   ← Core value prop, verify first
M3: Admin Panel         ← Auth gate + content management
M4: Design System       ← Storefront shell + visual language
M5: Relic Detail        ← Commerce + 3D viewer + inquiry
M6: Polish + Ship       ← Harden + optimize + deploy
```

Total tasks: **22 discrete tasks** across 6 milestones.
