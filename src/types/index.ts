export type RelicTier = 'ENTRY' | 'COLLECTOR' | 'COMMISSION'
export type InquiryStatus = 'PENDING' | 'REVIEWED' | 'REPLIED' | 'CLOSED'

export interface OwnerChainEntry {
  name: string
  acquiredAt: string // ISO date string
  transferNote?: string
}

export interface Provenance {
  id: string
  relicId: string
  quarryName: string
  quarryRegion: string
  stoneType: string
  artisanName: string
  artisanAtelier?: string | null
  creationDate: string // ISO date string
  ownerChain: OwnerChainEntry[]
  notes?: string | null
  createdAt: string
  updatedAt: string
}

export interface Relic {
  id: string
  slug: string
  name: string
  tagline: string
  description: string
  tier: RelicTier
  priceMin: number
  priceMax?: number | null
  nfcId?: string | null
  modelUrl?: string | null
  imageUrls: string[]
  published: boolean
  inquiryOpen: boolean
  provenance?: Provenance | null
  createdAt: string
  updatedAt: string
}

export interface Inquiry {
  id: string
  relicId: string
  relic?: Pick<Relic, 'id' | 'name' | 'slug'>
  clientName: string
  clientEmail: string
  clientPhone?: string | null
  message: string
  isWaitlist: boolean
  status: InquiryStatus
  createdAt: string
}

export type RelicSummary = Pick<
  Relic,
  'id' | 'slug' | 'name' | 'tagline' | 'tier' | 'priceMin' | 'priceMax' | 'imageUrls' | 'nfcId' | 'inquiryOpen'
>

export interface ProvenanceVerifyResponse {
  relic: Pick<Relic, 'id' | 'name' | 'slug' | 'tagline' | 'tier' | 'imageUrls'>
  provenance: Provenance
}

export interface VerifyErrorResponse {
  code: 'NOT_REGISTERED' | 'NOT_PUBLISHED' | 'INVALID_ID' | 'INTERNAL_ERROR'
  message: string
}
