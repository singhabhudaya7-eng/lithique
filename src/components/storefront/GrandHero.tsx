'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { HER_WORK, SILHOUETTE_IMAGES } from '@/lib/artwork-images'

export function GrandHero() {
  const [on, setOn] = useState(false)
  useEffect(() => { const t = setTimeout(() => setOn(true), 80); return () => clearTimeout(t) }, [])

  return (
    <section className="fullscreen" style={{ background: '#000' }}>
      {/* Background image */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: on ? 0.72 : 0,
        transition: 'opacity 2400ms ease',
      }}>
        {/* Her triptych — slightly silhouetted so text reads clean */}
        <Image
          src={HER_WORK.triptych}
          alt="LITHIQUE BY SHWETA"
          fill priority
          style={{
            objectFit: 'cover',
            objectPosition: 'center 40%',
            filter: 'brightness(0.55) contrast(1.1) saturate(0.85)',
          }}
          sizes="100vw"
        />
      </div>

      {/* Vignette */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(to bottom, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.05) 40%, rgba(0,0,0,0.05) 60%, rgba(0,0,0,0.72) 100%)',
      }} />

      {/* Content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        textAlign: 'center',
        padding: 'clamp(80px, 12vw, 160px) clamp(20px, 6vw, 100px) clamp(20px, 5vw, 60px)',
        opacity: on ? 1 : 0,
        transform: on ? 'none' : 'translateY(20px)',
        transition: 'opacity 1800ms var(--ease-luxury) 500ms, transform 1800ms var(--ease-luxury) 500ms',
      }}>
        <p className="t-label" style={{ marginBottom: 'clamp(20px, 4vh, 40px)', opacity: 0.8 }}>
          Mumbai · Delhi-NCR · Est. 2017  
        </p>

        <h1 className="t-hero" style={{ maxWidth: '960px', marginBottom: 'clamp(24px, 5vh, 48px)' }}>
          Art made to<br />outlast the moment<br />it was made in.
        </h1>

        <div className="gold-rule" style={{ margin: '0 auto clamp(24px, 5vh, 44px)' }} />

        <div className="hero-cta-row" style={{ display: 'flex', gap: '16px', justifyContent: 'center' }}>
          <Link href="/relics" className="btn-ghost">
            Enter the Collection
          </Link>
        </div>
      </div>

      {/* Bottom-left label */}
      <div style={{
        position: 'absolute', bottom: 'clamp(20px, 4vh, 40px)', left: 'var(--pad-x)',
        opacity: on ? 0.55 : 0,
        transition: 'opacity 2s ease 2s',
      }}>
        <p className="t-label" style={{ marginBottom: '6px', opacity: 0.7 }}>Featured</p>
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(0.75rem, 1.5vw, 0.9rem)', color: 'var(--gold)', fontStyle: 'italic' }}>
          The River That Turned to Stone
        </p>
        <p className="t-label" style={{ marginTop: '4px', opacity: 0.4, fontSize: '9px' }}>
          Resin · Gold leaf · Triptych
        </p>
      </div>

      {/* Scroll line */}
      <div style={{
        position: 'absolute', bottom: 'clamp(20px, 4vh, 40px)', right: 'var(--pad-x)',
        display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px',
        opacity: on ? 0.35 : 0, transition: 'opacity 2s ease 2.5s',
      }}>
        <span className="t-label" style={{ writingMode: 'vertical-rl', fontSize: '8px', letterSpacing: '0.25em' }}>
          Scroll
        </span>
        <div style={{ width: '1px', height: '50px', background: 'linear-gradient(to bottom, var(--gold), transparent)' }} />
      </div>
    </section>
  )
}
