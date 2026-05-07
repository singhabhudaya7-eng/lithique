'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import type { RelicSummary } from '@/types'

function formatPrice(min: number, max?: number | null) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
  if (!max) return `From ${fmt(min)}`
  return `${fmt(min)} — ${fmt(max)}`
}

export function RelicCard({ relic, wide = false }: { relic: RelicSummary; wide?: boolean }) {
  const [hovered, setHovered] = useState(false)

  return (
    <Link
      href={`/relics/${relic.slug}`}
      style={{ display: 'block', textDecoration: 'none' }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <article style={{ position: 'relative', background: 'var(--stone)', overflow: 'hidden' }}>
        {/* Image */}
        <div style={{
          position: 'relative',
          aspectRatio: wide ? '21/9' : '2/3',
          overflow: 'hidden',
        }}>
          {relic.imageUrls[0] && (
            <Image
              src={relic.imageUrls[0]}
              alt={relic.name}
              fill
              sizes={wide ? '100vw' : '(max-width: 560px) 100vw, (max-width: 900px) 50vw, 33vw'}
              style={{
                objectFit: 'cover',
                transform: hovered ? 'scale(1.04)' : 'scale(1)',
                transition: 'transform 1200ms var(--ease-luxury)',
                opacity: hovered ? 0.8 : 0.65,
              }}
            />
          )}
          {/* Subtle bottom gradient */}
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.8) 0%, rgba(0,0,0,0.05) 55%, transparent 100%)',
          }} />

          {/* Hovered state — show tagline */}
          {hovered && (
            <div style={{
              position: 'absolute', inset: 0,
              background: 'rgba(0,0,0,0.25)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '20px',
            }}>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.85rem,1.5vw,1rem)',
                color: 'var(--cream)',
                fontStyle: 'italic',
                textAlign: 'center',
                opacity: 0.85,
                lineHeight: 1.6,
              }}>
                {relic.tagline}
              </p>
            </div>
          )}
        </div>

        {/* Card text — below image */}
        <div style={{ padding: 'clamp(16px,2.5vw,24px) clamp(16px,2.5vw,24px) clamp(20px,3vw,32px)' }}>
          <h3 style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1rem,1.8vw,1.3rem)',
            color: 'var(--cream)',
            fontWeight: 400,
            lineHeight: 1.2,
            marginBottom: '10px',
          }}>
            {relic.name}
          </h3>
          <p className="t-label" style={{ opacity: 0.5, fontSize: '9px' }}>
            {relic.inquiryOpen ? formatPrice(relic.priceMin, relic.priceMax) : 'Commission — Inquire'}
          </p>
        </div>
      </article>
    </Link>
  )
}
