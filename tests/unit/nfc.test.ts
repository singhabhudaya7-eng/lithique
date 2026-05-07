import { generateNfcId, isValidNfcId, buildVerifyUrl, buildVerifyAbsoluteUrl } from '@/lib/nfc'

describe('NFC utilities', () => {
  describe('generateNfcId', () => {
    it('returns a valid UUID v4', () => {
      const id = generateNfcId()
      expect(isValidNfcId(id)).toBe(true)
    })

    it('returns a unique value each call', () => {
      const ids = new Set(Array.from({ length: 100 }, generateNfcId))
      expect(ids.size).toBe(100)
    })
  })

  describe('isValidNfcId', () => {
    it('accepts a valid UUID v4', () => {
      expect(isValidNfcId('6ba7b810-9dad-11d1-80b4-00c04fd430c8')).toBe(false) // v1 — version digit is '1'
      expect(isValidNfcId('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(true)
    })

    it('rejects an empty string', () => {
      expect(isValidNfcId('')).toBe(false)
    })

    it('rejects a plain string', () => {
      expect(isValidNfcId('not-a-uuid')).toBe(false)
    })

    it('rejects a SQL injection attempt', () => {
      expect(isValidNfcId("'; DROP TABLE relics; --")).toBe(false)
    })
  })

  describe('buildVerifyUrl', () => {
    it('builds the correct relative URL', () => {
      expect(buildVerifyUrl('f47ac10b-58cc-4372-a567-0e02b2c3d479')).toBe(
        '/verify/f47ac10b-58cc-4372-a567-0e02b2c3d479'
      )
    })
  })

  describe('buildVerifyAbsoluteUrl', () => {
    it('uses NEXT_PUBLIC_APP_URL when set', () => {
      process.env.NEXT_PUBLIC_APP_URL = 'https://lithique.in'
      expect(buildVerifyAbsoluteUrl('abc-123')).toBe('https://lithique.in/verify/abc-123')
    })

    it('falls back to lithique.in when env not set', () => {
      delete process.env.NEXT_PUBLIC_APP_URL
      expect(buildVerifyAbsoluteUrl('abc-123')).toBe('https://lithique.in/verify/abc-123')
    })
  })
})
