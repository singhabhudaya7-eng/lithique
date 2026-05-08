'use client'

import Image from 'next/image'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { HER_WORK } from '@/lib/artwork-images'

interface SilhouettePanelProps {
  bgImage: string
  revealImage?: string
  bgPosition?: string
  index: number
  medium: string
  title: string
  line: string
  href: string
}

function SilhouettePanel({ bgImage, revealImage, bgPosition = 'center', index, medium, title, line, href }: SilhouettePanelProps) {
  const [hovered, setHovered] = useState(false)
  const [inView, setInView] = useState(false)
  const [isTouch, setIsTouch] = useState(false)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setIsTouch(window.matchMedia('(hover: none)').matches)
  }, [])

  useEffect(() => {
    if (!panelRef.current) return
    const observer = new IntersectionObserver(
      ([entry]) => setInView(entry.intersectionRatio >= 0.55),
      { threshold: 0.55 }
    )
    observer.observe(panelRef.current)
    return () => observer.disconnect()
  }, [])

  const revealed = isTouch ? inView : hovered

  return (
    <div
      ref={panelRef}
      onMouseEnter={() => !isTouch && setHovered(true)}
      onMouseLeave={() => !isTouch && setHovered(false)}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        minHeight: '560px',
        overflow: 'hidden',
        background: '#030303',
      }}
    >
      {/* === SILHOUETTE LAYER === */}
      <div style={{
        position: 'absolute', inset: 0,
        opacity: revealed && revealImage ? 0 : 1,
        transition: 'opacity 1000ms cubic-bezier(0.16,1,0.3,1)',
      }}>
        <Image
          src={bgImage}
          alt=""
          fill
          style={{
            objectFit: 'cover',
            objectPosition: bgPosition,
            filter: 'brightness(0.38) contrast(1.5) saturate(0.45)',
          }}
          sizes="100vw"
        />
        {/* Radial spotlight — centre slightly brighter than edges */}
        <div style={{
          position: 'absolute', inset: 0,
          background: `radial-gradient(
            ellipse 48% 48% at 50% 42%,
            rgba(0,0,0,0.0)  0%,
            rgba(0,0,0,0.55) 50%,
            rgba(0,0,0,0.93) 100%
          )`,
          pointerEvents: 'none',
        }} />
      </div>

      {/* === REVEAL LAYER — her actual artwork === */}
      {revealImage && (
        <div style={{
          position: 'absolute', inset: 0,
          opacity: revealed ? 1 : 0,
          transition: 'opacity 900ms cubic-bezier(0.16,1,0.3,1)',
        }}>
          <Image
            src={revealImage}
            alt={title}
            fill
            style={{
              objectFit: 'cover',
              objectPosition: bgPosition,
              filter: 'brightness(0.6) contrast(1.1)',
            }}
            sizes="100vw"
          />
          <div style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.05) 45%, rgba(0,0,0,0.3) 100%)',
          }} />
        </div>
      )}

      {/* Thin gold vertical line — left or right */}
      <div style={{
        position: 'absolute',
        top: '15%', bottom: '15%',
        [index % 2 === 0 ? 'left' : 'right']: 0,
        width: '1px',
        background: 'linear-gradient(to bottom, transparent, rgba(184,146,42,0.5), transparent)',
        opacity: revealed ? 0.2 : 0.5,
        transition: 'opacity 600ms ease',
      }} />

      {/* Content — always at bottom */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-end',
        padding: 'clamp(24px,5vw,72px)',
        alignItems: index % 2 === 0 ? 'flex-start' : 'flex-end',
        textAlign: index % 2 === 0 ? 'left' : 'right',
      }}>
        <p className="t-label" style={{
          marginBottom: '12px',
          opacity: 0.6,
          fontSize: '9px',
          letterSpacing: '0.26em',
        }}>
          {medium}
        </p>

        <h3 style={{
          fontFamily: 'var(--font-serif)',
          fontWeight: 300,
          fontSize: 'clamp(1.6rem, 3.2vw, 3rem)',
          color: 'var(--cream)',
          lineHeight: 1.06,
          marginBottom: '14px',
          maxWidth: '500px',
        }}>
          {title}
        </h3>

        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(0.82rem, 1.2vw, 1rem)',
          color: 'var(--cream)',
          opacity: 0.42,
          fontStyle: 'italic',
          lineHeight: 1.75,
          maxWidth: '380px',
          marginBottom: 'clamp(18px,3.5vh,32px)',
        }}>
          {line}
        </p>

        <Link href={href} style={{
          fontFamily: 'var(--font-sans)',
          fontSize: '9px',
          letterSpacing: '0.22em',
          color: 'var(--gold)',
          textDecoration: 'none',
          textTransform: 'uppercase',
          borderBottom: '1px solid rgba(184,146,42,0.3)',
          paddingBottom: '2px',
          display: 'inline-block',
        }}>
          Inquire for Acquisition →
        </Link>
      </div>

      {/* Reveal instruction — desktop: hover, mobile: scroll */}
      {revealImage && !revealed && (
        <p style={{
          position: 'absolute',
          top: 'clamp(80px,10vh,100px)',
          [index % 2 === 0 ? 'right' : 'left']: 'clamp(20px,4vw,48px)',
          fontFamily: 'var(--font-sans)',
          fontSize: '8px',
          letterSpacing: '0.2em',
          color: 'var(--cream)',
          opacity: 0.18,
          textTransform: 'uppercase',
          pointerEvents: 'none',
        }}>
          {isTouch ? 'Scroll to reveal' : 'Hover to reveal'}
        </p>
      )}
    </div>
  )
}

const WORKS: Array<Omit<SilhouettePanelProps, 'index'>> = [
  {
    // Tanjore diptych — crop to just the top deity face (upper-left of the image)
    bgImage: HER_WORK.tanjoureDiptych,
    revealImage: HER_WORK.tanjoureDiptych,
    bgPosition: '18% 22%',
    medium: 'Tanjore Gold-Leaf · Deity Portrait · Chola Tradition',
    title: 'The Deity in Gold',
    line: 'Gold leaf pressed until it becomes the face, not the frame. Each feature built from Tanjore tradition handed down across centuries.',
    href: '/relics/tanjore-commission',
  },
  {
    bgImage: HER_WORK.tanjoreMockup,
    revealImage: HER_WORK.tanjoreMockup,
    medium: 'Tanjore Gold-Leaf · Chola Tradition · 9th Century',
    title: 'Tanjore — Private Commission',
    line: 'Gold pressed by hand until it becomes the surface, not a layer upon it. Conceived for the Chola court.',
    href: '/relics/tanjore-commission',
  },
  {
    bgImage: HER_WORK.triptych,
    revealImage: HER_WORK.triptych,
    medium: 'Layered Resin · 24-carat Gold Leaf · Triptych',
    title: 'The River That Turned to Stone',
    line: 'What looks geological is entirely handmade. Eleven sessions. No two layers planned.',
    href: '/relics/the-river-that-turned-to-stone',
  },
  {
    bgImage: HER_WORK.resinCircle,
    revealImage: HER_WORK.resinCircle,
    medium: 'Pigmented Resin · Circular Panel',
    title: 'The Cosmos in Resin',
    line: 'Poured in one session. Four hours. You cannot control resin — you create conditions and watch.',
    href: '/relics/the-cosmos-in-resin',
  },
  {
    bgImage: HER_WORK.decoupage,
    revealImage: HER_WORK.decoupage,
    medium: 'Decoupage · Surface Transformation',
    title: 'The Ornamented Object',
    line: 'Every surface is a canvas. Every object a candidate for permanence.',
    href: '/relics',
  },
  {
    bgImage: HER_WORK.canvas,
    revealImage: HER_WORK.canvas,
    medium: 'Canvas Painting · Figurative',
    title: 'The Figure',
    line: 'Paint does not record — it remembers. Every stroke is a decision that cannot be untaken.',
    href: '/relics',
  },
]

export function SilhouetteShowcase() {
  return (
    <section>
      <div style={{
        background: 'var(--obsidian)',
        padding: 'clamp(60px,10vh,120px) var(--pad-x) clamp(40px,7vh,80px)',
        borderTop: '1px solid rgba(184,146,42,0.08)',
      }}>
        <p className="t-label" style={{ marginBottom: 'clamp(14px,2.5vh,24px)', opacity: 0.55 }}>
          The Mediums
        </p>
        <h2 className="t-display" style={{ maxWidth: '620px', marginBottom: '18px' }}>
          Six mediums. One hand.<br />Form emerging from darkness.
        </h2>
        <p style={{
          fontFamily: 'var(--font-serif)',
          fontSize: 'clamp(0.85rem,1.3vw,1rem)',
          color: 'var(--cream)',
          opacity: 0.32,
          fontStyle: 'italic',
        }}>
          Hover each panel to reveal the work beneath.
        </p>
      </div>

      {WORKS.map((w, i) => (
        <SilhouettePanel key={w.title} {...w} index={i} />
      ))}
    </section>
  )
}
