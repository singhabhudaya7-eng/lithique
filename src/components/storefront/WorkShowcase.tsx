import Image from 'next/image'
import Link from 'next/link'
import { HER_WORK } from '@/lib/artwork-images'

const WORKS = [
  {
    image: HER_WORK.triptych,
    title: 'The River That Turned to Stone',
    medium: 'Layered Resin · 24-carat Gold Leaf · Triptych',
    line: 'What looks geological is entirely handmade.',
    href: '/relics/the-river-that-turned-to-stone',
    pos: 'center 40%',
  },
  {
    image: HER_WORK.sculptureRose,
    title: 'Rose in High Relief',
    medium: 'High-Relief Sculpture · Mixed Media',
    line: 'Petal by petal. Eleven days. Built to last centuries.',
    href: '/relics/rose-in-high-relief',
    pos: 'center 25%',
  },
  {
    image: HER_WORK.tanjoreMockup,
    title: 'Tanjore — Private Commission',
    medium: 'Gold-Leaf on Wood · Chola Tradition · 9th Century',
    line: 'An art form conceived for kings. Gold that will not tarnish.',
    href: '/relics/tanjore-commission',
    pos: 'center 15%',
  },
  {
    image: HER_WORK.resinCircle,
    title: 'The Cosmos in Resin',
    medium: 'Pigmented Resin · Circular Panel',
    line: 'Poured in one continuous session. Four hours. Unrepeatable.',
    href: '/relics/the-cosmos-in-resin',
    pos: 'center',
  },
]

export function WorkShowcase() {
  return (
    <section>
      {/* Label */}
      <div style={{
        background: 'var(--obsidian)',
        padding: 'clamp(60px,10vh,120px) var(--pad-x) clamp(40px,6vh,80px)',
        borderTop: '1px solid rgba(184,146,42,0.1)',
      }}>
        <p className="t-label" style={{ marginBottom: 'clamp(16px,3vh,28px)', opacity: 0.7 }}>
          Selected Works
        </p>
        <h2 className="t-display" style={{ maxWidth: '700px' }}>
          Eight mediums.<br />One unbroken commitment to permanence.
        </h2>
      </div>

      {/* Panels */}
      {WORKS.map((w, i) => (
        <div key={w.title} className="showcase-panel">
          {/* Image — full bleed */}
          <div className="showcase-panel__image" style={{ position: 'absolute', inset: 0 }}>
            <Image
              src={w.image}
              alt={w.title}
              fill
              style={{ objectFit: 'cover', objectPosition: w.pos, opacity: 0.6 }}
              sizes="100vw"
            />
          </div>

          {/* Vignette */}
          <div className="showcase-panel__vignette" style={{
            position: 'absolute', inset: 0,
            background: i % 2 === 0
              ? 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)'
              : 'linear-gradient(to left,  rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.2) 60%, rgba(0,0,0,0.4) 100%)',
          }} />

          {/* Content */}
          <div className="showcase-panel__content" style={{
            position: 'relative',
            width: '100%',
            padding: 'clamp(32px,6vw,80px)',
            display: 'flex',
            justifyContent: i % 2 === 0 ? 'flex-start' : 'flex-end',
          }}>
            <div style={{ maxWidth: '520px', textAlign: i % 2 === 0 ? 'left' : 'right' }}>
              <p className="t-label" style={{ marginBottom: 'clamp(10px,2vh,16px)', opacity: 0.8 }}>
                {w.medium}
              </p>
              <h3 className="t-heading" style={{ marginBottom: 'clamp(10px,2vh,20px)' }}>
                {w.title}
              </h3>
              <p style={{
                fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.9rem,1.4vw,1.1rem)',
                color: 'var(--cream)',
                opacity: 0.6,
                fontStyle: 'italic',
                lineHeight: 1.7,
                marginBottom: 'clamp(20px,4vh,36px)',
              }}>
                {w.line}
              </p>
              <Link href={w.href} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: 'var(--track-wide)',
                color: 'var(--gold)',
                textDecoration: 'none',
                textTransform: 'uppercase',
                borderBottom: '1px solid rgba(184,146,42,0.4)',
                paddingBottom: '3px',
                display: 'inline-block',
              }}>
                Inquire for Acquisition →
              </Link>
            </div>
          </div>
        </div>
      ))}
    </section>
  )
}
