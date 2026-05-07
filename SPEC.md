# Spec: LITHIQUE BY SHWETA — Luxury Flagship (High-Fidelity MVP)

## Objective

Build the digital flagship for **LITHIQUE BY SHWETA** — a luxury brand where stone is the medium
and permanence is the philosophy. Every relic carries a unique NFC chip; the site is its living
record of origin, craft, and ownership.

**Target users:**
- **Private clients** — high-net-worth collectors who discover relics and submit acquisition
  inquiries through an intentionally unhurried, non-transactional interface.
- **Admin (Shweta / team)** — manages the relic catalog, assigns NFC chip IDs to finished pieces,
  records provenance lineage, and reviews acquisition inquiries.

**Success looks like:**
- A client scans an NFC chip (or visits a URL) and sees the relic's full provenance in under 2s.
- A client can submit an "Inquire for Acquisition" form without ever seeing the word "cart."
- Admin can log in, create a relic, assign an NFC ID, fill provenance fields, and publish — all
  in a single flow.
- Core Web Vitals pass (LCP < 2.5s, CLS < 0.1, FID/INP < 200ms) on a 4G connection.

---

## Tech Stack

| Layer | Choice | Reason |
|---|---|---|
| Framework | Next.js 14 (App Router) | Specified; RSC for performance |
| Database | Supabase (PostgreSQL) | Hosted Postgres + Auth + Storage + RLS in one |
| Auth | Supabase Auth (email/password) | Admin-only; no public sign-up |
| ORM | Prisma | Type-safe queries, easy migrations |
| Styling | Tailwind CSS + CSS Variables | Utility-first with luxury token layer |
| Animations | Framer Motion | TypeScript-native, scroll triggers, layout animations |
| 3D Viewer | `@google/model-viewer` | Zero-config `.glb` viewer; upgradable to Three.js |
| PDF | `@react-pdf/renderer` | Server-side Certificate of Permanence generation |
| NFC | Web NFC API (`NDEFReader`) | Native browser API; graceful degradation to QR |
| Email | Resend | Admin notification on inquiry submission |
| Deployment | Vercel | Next.js native, edge functions |

---

## Commands

```bash
# Development
npm run dev              # Start dev server at localhost:3000

# Build & type-check
npm run build            # Production build
npm run type-check       # tsc --noEmit

# Database
npx prisma migrate dev   # Apply migrations + regenerate client
npx prisma studio        # Browse DB locally

# Testing
npm test                 # Jest unit tests
npm run test:e2e         # Playwright end-to-end tests
npm run test:coverage    # Jest with coverage report

# Linting
npm run lint             # ESLint
npm run lint:fix         # ESLint --fix
npm run format           # Prettier --write
```

---

## Project Structure

```
C:\lss\
├── src/
│   ├── app/
│   │   ├── (storefront)/           # Public-facing pages (layout, nav, footer)
│   │   │   ├── page.tsx            # Homepage — cinematic hero
│   │   │   ├── relics/
│   │   │   │   ├── page.tsx        # Catalog grid
│   │   │   │   └── [slug]/
│   │   │   │       └── page.tsx    # Individual relic page + 3D viewer + inquiry
│   │   │   └── verify/
│   │   │       └── [nfcId]/
│   │   │           └── page.tsx    # NFC/QR provenance verification page
│   │   ├── admin/                  # Protected admin area
│   │   │   ├── layout.tsx          # Auth guard wrapper
│   │   │   ├── page.tsx            # Dashboard — relics list + inquiries
│   │   │   ├── relics/
│   │   │   │   ├── new/page.tsx    # Create relic + assign NFC ID
│   │   │   │   └── [id]/page.tsx   # Edit relic, update provenance
│   │   │   └── inquiries/
│   │   │       └── page.tsx        # Acquisition inquiry inbox
│   │   ├── api/
│   │   │   ├── verify/[nfcId]/route.ts     # NFC lookup endpoint
│   │   │   ├── inquire/route.ts            # Acquisition form submission
│   │   │   ├── certificate/[nfcId]/route.ts # PDF generation endpoint
│   │   │   └── admin/
│   │   │       ├── relics/route.ts
│   │   │       └── inquiries/route.ts
│   │   └── layout.tsx              # Root layout + font + theme tokens
│   ├── components/
│   │   ├── ui/                     # Design system primitives
│   │   │   ├── Button.tsx          # "Inquire for Acquisition" / "Reserve a Relic"
│   │   │   ├── Typography.tsx      # Serif headings, spaced tracking
│   │   │   ├── GoldDivider.tsx     # Decorative aged-gold rule
│   │   │   └── PatinaSurface.tsx   # CSS aged-stone texture overlay
│   │   ├── provenance/
│   │   │   ├── NFCScanner.tsx      # Web NFC API scanner UI
│   │   │   ├── ProvenanceCard.tsx  # Lineage display (origin → artisan → owners)
│   │   │   └── CertificateButton.tsx # Trigger PDF download
│   │   ├── viewer/
│   │   │   └── RelicViewer3D.tsx   # model-viewer wrapper + lighting preset
│   │   ├── commerce/
│   │   │   ├── InquireForm.tsx     # "Inquire for Acquisition" form
│   │   │   └── ReserveButton.tsx   # Waitlist / reserve CTA
│   │   └── storefront/
│   │       ├── Hero.tsx            # Fullscreen cinematic hero
│   │       ├── RelicGrid.tsx       # Brutalist catalog grid
│   │       └── RelicCard.tsx       # Relic thumbnail with hover reveal
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   └── server.ts           # Server Supabase client (RSC / API routes)
│   │   ├── prisma.ts               # Prisma singleton
│   │   ├── nfc.ts                  # NFC URL generation + validation utilities
│   │   ├── pdf.ts                  # Certificate of Permanence template
│   │   └── email.ts                # Resend email helpers
│   └── types/
│       └── index.ts                # Shared TypeScript types (Relic, Provenance, Inquiry)
├── prisma/
│   └── schema.prisma               # DB schema
├── public/
│   ├── models/                     # .glb 3D model files
│   ├── textures/                   # Stone texture images/video
│   └── fonts/                      # Local serif font files
├── tests/
│   └── unit/                       # Jest unit tests
└── e2e/
    └── provenance.spec.ts          # Playwright: NFC verify flow
```

---

## Data Model (Prisma Schema)

```prisma
model Relic {
  id            String      @id @default(cuid())
  slug          String      @unique
  name          String
  tagline       String      # Philosophy-voice one-liner
  description   String      # Meditation on permanence copy
  tier          RelicTier   # ENTRY | COLLECTOR | COMMISSION
  priceMin      Int         # In INR paise
  priceMax      Int?
  nfcId         String?     @unique  # Assigned when physical relic is finished
  modelUrl      String?     # .glb file path in Supabase Storage
  imageUrls     String[]
  published     Boolean     @default(false)
  provenance    Provenance?
  inquiries     Inquiry[]
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Provenance {
  id            String      @id @default(cuid())
  relicId       String      @unique
  relic         Relic       @relation(fields: [relicId], references: [id])
  quarryName    String
  quarryRegion  String
  stoneType     String
  artisanName   String
  artisanAtelier String?
  creationDate  DateTime
  ownerChain    Json        # [{ name, acquiredAt, transferNote }]
  notes         String?
  createdAt     DateTime    @default(now())
  updatedAt     DateTime    @updatedAt
}

model Inquiry {
  id            String        @id @default(cuid())
  relicId       String
  relic         Relic         @relation(fields: [relicId], references: [id])
  clientName    String
  clientEmail   String
  clientPhone   String?
  message       String
  status        InquiryStatus @default(PENDING)
  createdAt     DateTime      @default(now())
}

enum RelicTier {
  ENTRY       # ₹15K–50K
  COLLECTOR   # ₹50K–5L
  COMMISSION  # ₹5L+
}

enum InquiryStatus {
  PENDING
  REVIEWED
  REPLIED
  CLOSED
}
```

---

## Code Style

**Language:** TypeScript strict mode (`"strict": true`).

**Component pattern — server-first, client when necessary:**
```tsx
// Server Component (default — no 'use client')
import { prisma } from '@/lib/prisma'

export default async function RelicPage({ params }: { params: { slug: string } }) {
  const relic = await prisma.relic.findUniqueOrThrow({
    where: { slug: params.slug, published: true },
    include: { provenance: true },
  })
  return <RelicView relic={relic} />
}

// Client Component (only when browser API needed)
'use client'
export function NFCScanner({ onVerified }: { onVerified: (nfcId: string) => void }) {
  // Web NFC API lives here
}
```

**Naming conventions:**
- Components: `PascalCase` files + exports
- Utilities: `camelCase` files + exports
- API routes: `kebab-case` directories
- Database fields: `camelCase` (Prisma default)
- CSS variables: `--lithique-obsidian`, `--lithique-gold`, `--lithique-warm-white`

**Design tokens (globals.css):**
```css
:root {
  --lithique-obsidian:    #0A0A0A;
  --lithique-gold:        #C9A84C;
  --lithique-warm-white:  #FAF7F2;
  --lithique-stone-mid:   #2A2520;
  --font-serif:           'Cormorant Garamond', Georgia, serif;
  --font-sans:            'Neue Haas Grotesk', system-ui, sans-serif;
  --tracking-luxury:      0.15em;
  --transition-relic:     600ms cubic-bezier(0.16, 1, 0.3, 1);
}
```

**Copy voice rule — enforced in JSX, not just docs:**
```tsx
// WRONG
<p>Smells like Sandalwood</p>

// CORRECT
<p>A scent-relic that anchors the ephemeral present within the immortal weight of stone.</p>
```
No "Add to Cart", "Buy Now", "Shop", "Price", or "Checkout" in any UI string.
Use: "Inquire for Acquisition", "Reserve a Relic", "Investment", "From ₹XX,XXX".

---

## Testing Strategy

| Level | Tool | What it covers |
|---|---|---|
| Unit | Jest + Testing Library | Utility functions (NFC URL gen, price formatting, PDF template) |
| Component | Jest + Testing Library | Form validation, ProvenanceCard rendering |
| Integration | Jest + Prisma mock | API route handlers (verify, inquire, certificate) |
| E2E | Playwright | Full NFC verify flow, inquiry submission, admin relic creation |

**Coverage target:** 80% on `src/lib/` and `src/app/api/`.

**Test locations:**
- Unit/component: `tests/unit/[module].test.ts`
- E2E: `e2e/[flow].spec.ts`

---

## Boundaries

**Always do:**
- Run `npm run type-check` before considering any feature complete
- Use `--lithique-*` CSS variables; never hardcode hex colors in components
- All client form inputs must be server-validated before DB write
- NFC IDs must be validated as existing, active relics before showing provenance
- Strip and sanitize all user-submitted text (inquiry forms) before storage
- Relic pages must work without JavaScript (provenance data server-rendered)

**Ask first:**
- Adding any new npm dependency
- Changing the Prisma schema (migrations affect prod data)
- Enabling public sign-up or any non-admin auth flow
- Integrating a payment gateway (out of MVP scope)
- Sending automated emails to clients
- Changing the NFC ID format/structure (affects physical chip encoding)

**Never do:**
- Use the word "cart", "buy", "shop", "checkout", or "price" in client-facing UI strings
- Store raw client PII in logs or error messages
- Commit `.env` or `.env.local` files
- Skip Row Level Security on Supabase tables that hold provenance or inquiry data
- Generate or expose NFC IDs in client-side JavaScript (must come from server)
- Use `any` TypeScript type without a comment explaining why

---

## Success Criteria (MVP)

- [ ] Admin can log in, create a relic with provenance fields, assign an NFC ID, and publish it
- [ ] Visiting `/verify/[nfcId]` displays full provenance lineage for a valid chip ID
- [ ] Invalid or unregistered NFC ID shows a graceful "This relic has not yet been registered" state
- [ ] "Inquire for Acquisition" form submits successfully and appears in admin inquiry inbox
- [ ] "Certificate of Permanence" PDF downloads with correct relic data
- [ ] 3D model viewer loads and allows 360° rotation on relic detail page
- [ ] Homepage hero and relic grid render with correct luxury design tokens
- [ ] Framer Motion scroll-reveal animations play on relic catalog page
- [ ] Admin area is fully inaccessible to unauthenticated users (returns 401/redirect)
- [ ] Core Web Vitals: LCP < 2.5s, CLS < 0.1 on relic detail page (Vercel analytics)
- [ ] Zero instances of "Add to Cart", "Buy", "Shop" in rendered HTML

---

## Open Questions (Resolved)

| Question | Answer |
|---|---|
| Preferred database | Supabase (PostgreSQL) — chosen for built-in auth + storage |
| NFC chip timing | Chips assigned to physical relics post-creation by admin |
| iOS NFC support | QR code fallback to be added in a later sprint |
| Automated emails to clients | Not in MVP scope |
| Payment processing | Not in MVP scope — inquiry-only commerce |
| Admin users | Single admin (Shweta / team), email/password auth |
| Scope | High-fidelity demo MVP |
