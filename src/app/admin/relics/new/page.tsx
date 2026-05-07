'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { generateNfcId, buildVerifyAbsoluteUrl } from '@/lib/nfc'

const TIERS = [
  { value: 'ENTRY', label: 'Entry Relic (₹15K–50K)' },
  { value: 'COLLECTOR', label: 'Collector Piece (₹50K–5L)' },
  { value: 'COMMISSION', label: 'Maison Commission (₹5L+)' },
]

const inputStyle: React.CSSProperties = {
  width: '100%',
  background: 'rgba(42,37,32,0.5)',
  border: '1px solid rgba(201,168,76,0.15)',
  color: 'var(--lithique-warm-white)',
  fontFamily: 'var(--font-serif)',
  fontSize: '1rem',
  padding: '10px 14px',
  outline: 'none',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '10px',
  letterSpacing: 'var(--tracking-luxury)',
  color: 'var(--lithique-gold)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px',
  opacity: 0.8,
}

export default function NewRelicPage() {
  const router = useRouter()
  const [nfcId, setNfcId] = useState<string | null>(null)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    slug: '',
    tagline: '',
    description: '',
    tier: 'COLLECTOR',
    priceMin: '',
    priceMax: '',
    published: false,
    inquiryOpen: true,
    // Provenance
    quarryName: '',
    quarryRegion: '',
    stoneType: '',
    artisanName: '',
    artisanAtelier: '',
    creationDate: '',
    notes: '',
  })

  function handleNameChange(name: string) {
    setForm(f => ({
      ...f,
      name,
      slug: f.slug || name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''),
    }))
  }

  function assignNfc() {
    const id = generateNfcId()
    setNfcId(id)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)

    const payload = {
      ...form,
      priceMin: parseInt(form.priceMin) || 0,
      priceMax: form.priceMax ? parseInt(form.priceMax) : null,
      nfcId,
      imageUrls: [],
    }

    if (process.env.NODE_ENV === 'development' && !process.env.DATABASE_URL) {
      console.log('[DEV] Would save relic:', payload)
      setTimeout(() => {
        alert('DEV MODE: Relic logged to console. Connect DB to persist.')
        router.push('/admin')
      }, 500)
      return
    }

    const res = await fetch('/api/admin/relics', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    if (res.ok) {
      router.push('/admin')
    } else {
      setSaving(false)
      alert('Failed to save. Please try again.')
    }
  }

  return (
    <div style={{ maxWidth: '720px' }}>
      <h1 style={{ fontFamily: 'var(--font-serif)', fontSize: '2rem', color: 'var(--lithique-warm-white)', marginBottom: '8px' }}>
        Commit a New Relic
      </h1>
      <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: 'var(--tracking-luxury)', color: 'var(--lithique-gold)', opacity: 0.5, textTransform: 'uppercase', marginBottom: '48px' }}>
        to the permanent archive
      </p>

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>

        {/* Basic info */}
        <SectionTitle>Identity</SectionTitle>

        <Field label="Name *">
          <input required style={inputStyle} value={form.name} onChange={e => handleNameChange(e.target.value)} placeholder="The name of this relic" />
        </Field>

        <Field label="Slug *">
          <input required style={inputStyle} value={form.slug} onChange={e => setForm(f => ({ ...f, slug: e.target.value }))} placeholder="url-friendly-name" />
        </Field>

        <Field label="Tagline *">
          <input required style={inputStyle} value={form.tagline} onChange={e => setForm(f => ({ ...f, tagline: e.target.value }))} placeholder="A meditation on permanence — one sentence" />
        </Field>

        <Field label="Description *">
          <textarea required rows={6} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.7 }} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Write as though the stone itself were speaking through philosophy..." />
        </Field>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
          <Field label="Tier *">
            <select required style={{ ...inputStyle, cursor: 'pointer' }} value={form.tier} onChange={e => setForm(f => ({ ...f, tier: e.target.value }))}>
              {TIERS.map(t => <option key={t.value} value={t.value}>{t.label}</option>)}
            </select>
          </Field>
          <Field label="Price Min (₹) *">
            <input required type="number" style={inputStyle} value={form.priceMin} onChange={e => setForm(f => ({ ...f, priceMin: e.target.value }))} placeholder="15000" />
          </Field>
          <Field label="Price Max (₹)">
            <input type="number" style={inputStyle} value={form.priceMax} onChange={e => setForm(f => ({ ...f, priceMax: e.target.value }))} placeholder="Optional" />
          </Field>
        </div>

        <div style={{ display: 'flex', gap: '32px' }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.published} onChange={e => setForm(f => ({ ...f, published: e.target.checked }))} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--lithique-warm-white)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Publish immediately</span>
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
            <input type="checkbox" checked={form.inquiryOpen} onChange={e => setForm(f => ({ ...f, inquiryOpen: e.target.checked }))} />
            <span style={{ fontFamily: 'var(--font-sans)', fontSize: '11px', color: 'var(--lithique-warm-white)', letterSpacing: '0.1em', textTransform: 'uppercase' }}>Open for inquiry</span>
          </label>
        </div>

        {/* NFC Assignment */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '28px' }}>
          <SectionTitle>NFC Chip Assignment</SectionTitle>
          {nfcId ? (
            <div style={{ padding: '20px', border: '1px solid rgba(201,168,76,0.3)', background: 'rgba(201,168,76,0.05)' }}>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', letterSpacing: '0.1em', textTransform: 'uppercase', marginBottom: '8px' }}>
                NFC ID — Encode this onto the chip
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '0.85rem', color: 'var(--lithique-warm-white)', fontFeatureSettings: '"tnum"', marginBottom: '8px' }}>
                {nfcId}
              </p>
              <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-warm-white)', opacity: 0.4 }}>
                URL: {buildVerifyAbsoluteUrl(nfcId)}
              </p>
            </div>
          ) : (
            <div>
              <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: 'var(--lithique-warm-white)', opacity: 0.5, fontStyle: 'italic', marginBottom: '16px' }}>
                Assign an NFC ID once the physical relic is complete. This ID will be encoded onto the chip.
              </p>
              <button
                type="button"
                onClick={assignNfc}
                style={{
                  padding: '10px 24px',
                  border: '1px solid rgba(201,168,76,0.4)',
                  color: 'var(--lithique-gold)',
                  background: 'transparent',
                  fontFamily: 'var(--font-sans)',
                  fontSize: '11px',
                  letterSpacing: 'var(--tracking-luxury)',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                }}
              >
                Assign NFC Chip
              </button>
            </div>
          )}
        </div>

        {/* Provenance */}
        <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '28px' }}>
          <SectionTitle>Provenance</SectionTitle>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Stone Type *">
                <input required style={inputStyle} value={form.stoneType} onChange={e => setForm(f => ({ ...f, stoneType: e.target.value }))} placeholder="White Marble" />
              </Field>
              <Field label="Quarry Name *">
                <input required style={inputStyle} value={form.quarryName} onChange={e => setForm(f => ({ ...f, quarryName: e.target.value }))} placeholder="Makrana Marble Quarry" />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Quarry Region *">
                <input required style={inputStyle} value={form.quarryRegion} onChange={e => setForm(f => ({ ...f, quarryRegion: e.target.value }))} placeholder="Rajasthan, India" />
              </Field>
              <Field label="Creation Date *">
                <input required type="date" style={inputStyle} value={form.creationDate} onChange={e => setForm(f => ({ ...f, creationDate: e.target.value }))} />
              </Field>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <Field label="Artisan Name *">
                <input required style={inputStyle} value={form.artisanName} onChange={e => setForm(f => ({ ...f, artisanName: e.target.value }))} placeholder="Ustad Farid Khan" />
              </Field>
              <Field label="Atelier">
                <input style={inputStyle} value={form.artisanAtelier} onChange={e => setForm(f => ({ ...f, artisanAtelier: e.target.value }))} placeholder="Khan Atelier, Agra" />
              </Field>
            </div>
            <Field label="Archive Notes">
              <textarea rows={3} style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }} value={form.notes} onChange={e => setForm(f => ({ ...f, notes: e.target.value }))} placeholder="Any notes about this stone's history..." />
            </Field>
          </div>
        </div>

        <div style={{ borderTop: '1px solid rgba(201,168,76,0.1)', paddingTop: '28px' }}>
          <button
            type="submit"
            disabled={saving}
            style={{
              padding: '14px 40px',
              border: '1px solid var(--lithique-gold)',
              color: 'var(--lithique-gold)',
              background: 'transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: 'var(--tracking-luxury)',
              textTransform: 'uppercase',
              cursor: saving ? 'wait' : 'pointer',
              opacity: saving ? 0.6 : 1,
            }}
          >
            {saving ? 'COMMITTING TO ARCHIVE...' : 'COMMIT TO ARCHIVE'}
          </button>
        </div>
      </form>
    </div>
  )
}

function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: 'var(--tracking-luxury)', color: 'var(--lithique-gold)', textTransform: 'uppercase', marginBottom: '20px', opacity: 0.8 }}>
      {children}
    </p>
  )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={labelStyle}>{label}</label>
      {children}
    </div>
  )
}
