'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

export function Hero() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 200)
    return () => clearTimeout(t)
  }, [])

  return (
    <section
      style={{
        position: 'relative',
        width: '100%',
        height: '100dvh',
        minHeight: '600px',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        overflow: 'hidden',
        background: 'var(--lithique-obsidian)',
      }}
    >
      {/* Stone texture background */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          backgroundImage: 'url(https://images.unsplash.com/photo-1650804068570-7fb2e3dbf888?w=1920&q=80)',
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: 0.45,
        }}
      />

      {/* Gradient overlay — bottom fade to obsidian */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'linear-gradient(to bottom, transparent 40%, var(--lithique-obsidian) 100%)',
        }}
      />

      {/* Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 10,
          textAlign: 'center',
          padding: '0 24px',
          opacity: visible ? 1 : 0,
          transform: visible ? 'translateY(0)' : 'translateY(16px)',
          transition: 'opacity 1200ms cubic-bezier(0.16,1,0.3,1), transform 1200ms cubic-bezier(0.16,1,0.3,1)',
        }}
      >
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '10px',
            letterSpacing: 'var(--tracking-ultra)',
            color: 'var(--lithique-gold)',
            textTransform: 'uppercase',
            marginBottom: '32px',
            opacity: 0.8,
          }}
        >
          Lithique by Shweta
        </p>

        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(2.5rem, 7vw, 5.5rem)',
            fontWeight: 400,
            color: 'var(--lithique-warm-white)',
            lineHeight: 1.05,
            maxWidth: '800px',
            marginBottom: '28px',
          }}
        >
          That which is carved from stone does not merely exist — it persists.
        </h1>

        <div
          style={{
            width: '40px',
            height: '1px',
            background: 'var(--lithique-gold)',
            margin: '0 auto 32px',
            opacity: 0.6,
          }}
        />

        <Link
          href="/relics"
          style={{
            display: 'inline-block',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: 'var(--tracking-luxury)',
            color: 'var(--lithique-gold)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            padding: '14px 36px',
            border: '1px solid var(--lithique-gold)',
            transition: 'var(--transition-relic)',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.background = 'var(--lithique-gold)'
            e.currentTarget.style.color = 'var(--lithique-obsidian)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.background = 'transparent'
            e.currentTarget.style.color = 'var(--lithique-gold)'
          }}
        >
          Enter the Archive
        </Link>
      </div>

      {/* Scroll indicator */}
      <div
        style={{
          position: 'absolute',
          bottom: '40px',
          left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '8px',
          opacity: visible ? 0.4 : 0,
          transition: 'opacity 1800ms ease',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '9px',
            letterSpacing: '0.3em',
            color: 'var(--lithique-warm-white)',
            textTransform: 'uppercase',
          }}
        >
          Scroll
        </span>
        <div
          style={{
            width: '1px',
            height: '40px',
            background: 'var(--lithique-gold)',
            opacity: 0.5,
            animation: 'pulse 2s ease-in-out infinite',
          }}
        />
      </div>
    </section>
  )
}
