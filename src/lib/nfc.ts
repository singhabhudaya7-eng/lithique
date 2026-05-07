import { randomUUID } from 'crypto'

const UUID_V4_REGEX =
  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export function generateNfcId(): string {
  return randomUUID()
}

export function isValidNfcId(id: string): boolean {
  return UUID_V4_REGEX.test(id)
}

export function buildVerifyUrl(nfcId: string): string {
  return `/verify/${nfcId}`
}

export function buildVerifyAbsoluteUrl(nfcId: string): string {
  const base = process.env.NEXT_PUBLIC_APP_URL ?? 'https://lithique.in'
  return `${base}/verify/${nfcId}`
}
