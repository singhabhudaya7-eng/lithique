/**
 * Data access layer.
 * Currently serves mock data — zero Prisma imports.
 * When DATABASE_URL is wired in, swap these implementations for Prisma queries.
 */
import type { Relic, ProvenanceVerifyResponse, VerifyErrorResponse } from '@/types'
import { isValidNfcId } from './nfc'
import {
  getMockRelicByNfcId,
  getMockRelicBySlug,
  getPublishedMockRelics,
  MOCK_RELICS,
} from './mock-data'

export async function verifyRelicByNfcId(
  nfcId: string
): Promise<ProvenanceVerifyResponse | VerifyErrorResponse> {
  if (!isValidNfcId(nfcId)) {
    return {
      code: 'INVALID_ID',
      message: 'The identifier provided does not correspond to a known relic format.',
    }
  }

  const relic = getMockRelicByNfcId(nfcId)
  if (!relic) return { code: 'NOT_REGISTERED', message: 'not registered' }
  if (!relic.published) return { code: 'NOT_PUBLISHED', message: 'not published' }
  if (!relic.provenance) return { code: 'NOT_REGISTERED', message: 'no provenance' }

  return {
    relic: {
      id: relic.id,
      name: relic.name,
      slug: relic.slug,
      tagline: relic.tagline,
      tier: relic.tier,
      imageUrls: relic.imageUrls,
    },
    provenance: relic.provenance,
  }
}

export async function getRelicBySlug(slug: string): Promise<Relic | null> {
  return getMockRelicBySlug(slug)
}

export async function getPublishedRelics(): Promise<Relic[]> {
  return getPublishedMockRelics()
}

export async function getAllRelics(): Promise<Relic[]> {
  return MOCK_RELICS
}
