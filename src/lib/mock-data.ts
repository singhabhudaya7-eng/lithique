import type { Relic, Provenance, Inquiry } from '@/types'
import { HER_WORK } from './artwork-images'

export const MOCK_RELICS: Relic[] = [
  {
    id: 'relic-001',
    slug: 'the-river-that-turned-to-stone',
    name: 'The River That Turned to Stone',
    tagline: 'Three panels. One geological memory.',
    description: `There is a moment in the formation of agate when mineral-rich water, moving through volcanic cavities over millions of years, suddenly stops. What was fluid becomes permanent. What was in motion becomes witness.

This triptych was made from that exact memory. Three panels of layered resin — obsidian black, raw amber, bone white — poured and manipulated by hand until the surface resolved into something that has always looked like this. Like it was never made. Like it was always found.

The gold veining is 24-carat. It does not simulate stone. It is what stone wishes it could be.`,
    tier: 'COLLECTOR',
    priceMin: 185000,
    priceMax: 250000,
    nfcId: 'f47ac10b-58cc-4372-a567-0e02b2c3d479',
    modelUrl: null,
    imageUrls: [HER_WORK.triptych],
    published: true,
    inquiryOpen: true,
    provenance: {
      id: 'prov-001',
      relicId: 'relic-001',
      quarryName: 'Studio Shweta',
      quarryRegion: 'Mumbai, Maharashtra',
      stoneType: 'Layered Resin with 24-carat Gold Leaf',
      artisanName: 'Shweta Singh',
      artisanAtelier: 'LITHIQUE Atelier, Mumbai',
      creationDate: '2024-01-15T00:00:00.000Z',
      ownerChain: [
        {
          name: 'LITHIQUE BY SHWETA — Founding Archive',
          acquiredAt: '2024-02-01T00:00:00.000Z',
          transferNote: 'Inaugural work. The piece that defined the collection.',
        },
      ],
      notes: 'Three panels poured across eleven sessions over six weeks. No two layers were planned. Each was a response to the one beneath.',
      createdAt: '2024-02-01T00:00:00.000Z',
      updatedAt: '2024-02-01T00:00:00.000Z',
    },
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2024-02-01T00:00:00.000Z',
  },
  {
    id: 'relic-002',
    slug: 'rose-in-high-relief',
    name: 'Rose in High Relief',
    tagline: 'Sculpted by hand. Impossible to forget.',
    description: `The rose does not grow. It is built — petal by petal, layer by layer — from material that begins as nothing and becomes something that appears to have always existed in this exact form.

Each petal was shaped individually, dried, placed, adjusted, placed again. The process took eleven days. The result looks like it took eleven years, or eleven centuries, or no time at all — because things made with complete attention exist outside of time.

This piece belongs in a room that stops people. It has never failed to do so.`,
    tier: 'COLLECTOR',
    priceMin: 95000,
    priceMax: 130000,
    nfcId: 'a1b2c3d4-e5f6-4372-abcd-ef0123456789',
    modelUrl: null,
    imageUrls: [HER_WORK.sculptureRose],
    published: true,
    inquiryOpen: true,
    provenance: {
      id: 'prov-002',
      relicId: 'relic-002',
      quarryName: 'Studio Shweta',
      quarryRegion: 'Mumbai, Maharashtra',
      stoneType: 'High-Relief Sculpture — Mixed Media on Board',
      artisanName: 'Shweta Singh',
      artisanAtelier: 'LITHIQUE Atelier, Mumbai',
      creationDate: '2024-03-20T00:00:00.000Z',
      ownerChain: [
        {
          name: 'LITHIQUE BY SHWETA — Founding Archive',
          acquiredAt: '2024-04-01T00:00:00.000Z',
          transferNote: 'The piece that established the sculpture language of the collection.',
        },
      ],
      notes: 'Eleven days of work. Each petal shaped from memory — no reference used. The green of the leaves was mixed seventeen times before it was correct.',
      createdAt: '2024-04-01T00:00:00.000Z',
      updatedAt: '2024-04-01T00:00:00.000Z',
    },
    createdAt: '2024-04-01T00:00:00.000Z',
    updatedAt: '2024-04-01T00:00:00.000Z',
  },
  {
    id: 'relic-003',
    slug: 'tanjore-commission',
    name: 'Tanjore — A Private Commission',
    tagline: 'In the tradition of the Chola courts. Gold that will not tarnish.',
    description: `The Tanjore tradition is 1,200 years old. It was born in the ateliers of the Chola empire — commissioned by kings, offered to temples, painted on wood with pigments ground from precious stones and finished with gold leaf pressed by hand against the surface until it became part of the piece rather than applied to it.

Shweta has studied this tradition for over a decade. A Tanjore commission from her is not a reproduction of a form. It is a continuation of one — made with the same gold, the same patience, the same understanding that what is made for permanence must be made slowly.

Each commission begins with a conversation. It ends with something that will outlast both parties.`,
    tier: 'COMMISSION',
    priceMin: 350000,
    priceMax: null,
    nfcId: null,
    modelUrl: null,
    imageUrls: [HER_WORK.tanjoreMockup],
    published: true,
    inquiryOpen: false,
    provenance: null,
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2024-05-01T00:00:00.000Z',
  },
  {
    id: 'relic-004',
    slug: 'the-cosmos-in-resin',
    name: 'The Cosmos in Resin',
    tagline: 'A universe compressed into a circle.',
    description: `Resin, when it moves, behaves like water that has decided to become permanent. You cannot fully control it. You can only create the conditions for something to happen and then watch what emerges.

This piece was poured in a single session that lasted four hours. The reds arrived first. Then the blues claimed their territory. The white refused to be contained. The black came last, as it always does, and settled everything.

The circular form is not decorative. It is cosmological. Everything that exists is circular, eventually.`,
    tier: 'ENTRY',
    priceMin: 45000,
    priceMax: 75000,
    nfcId: 'b2c3d4e5-f6a7-4372-bcde-f01234567890',
    modelUrl: null,
    imageUrls: [HER_WORK.resinCircle],
    published: true,
    inquiryOpen: true,
    provenance: {
      id: 'prov-004',
      relicId: 'relic-004',
      quarryName: 'Studio Shweta',
      quarryRegion: 'Mumbai, Maharashtra',
      stoneType: 'Pigmented Resin on Circular Panel',
      artisanName: 'Shweta Singh',
      artisanAtelier: 'LITHIQUE Atelier, Mumbai',
      creationDate: '2024-06-10T00:00:00.000Z',
      ownerChain: [
        {
          name: 'LITHIQUE BY SHWETA — Founding Archive',
          acquiredAt: '2024-06-15T00:00:00.000Z',
          transferNote: 'First resin work admitted to the collection. Poured in a single continuous session.',
        },
      ],
      notes: 'Poured in one session, four hours. No retouching after the resin set. What you see is what happened.',
      createdAt: '2024-06-15T00:00:00.000Z',
      updatedAt: '2024-06-15T00:00:00.000Z',
    },
    createdAt: '2024-06-15T00:00:00.000Z',
    updatedAt: '2024-06-15T00:00:00.000Z',
  },
]

export const MOCK_INQUIRIES: Inquiry[] = [
  {
    id: 'inq-001',
    relicId: 'relic-001',
    relic: { id: 'relic-001', name: 'The River That Turned to Stone', slug: 'the-river-that-turned-to-stone' },
    clientName: 'Arjun Mehrotra',
    clientEmail: 'arjun@example.com',
    clientPhone: '+91 98765 43210',
    message: 'I have been looking for something of geological scale for my study. This is it. I would like to understand the acquisition process.',
    isWaitlist: false,
    status: 'PENDING',
    createdAt: '2024-08-15T10:30:00.000Z',
  },
]

export function getMockRelicBySlug(slug: string): Relic | null {
  return MOCK_RELICS.find((r) => r.slug === slug) ?? null
}

export function getMockRelicByNfcId(nfcId: string): Relic | null {
  return MOCK_RELICS.find((r) => r.nfcId === nfcId) ?? null
}

export function getPublishedMockRelics(): Relic[] {
  return MOCK_RELICS.filter((r) => r.published)
}
