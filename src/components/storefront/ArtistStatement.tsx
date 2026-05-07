import Image from 'next/image'
import { HER_WORK } from '@/lib/artwork-images'

export function ArtistStatement() {
  return (
    <section style={{ background: 'var(--obsidian)', padding: 'var(--space-section) var(--pad-x)' }}>
      <div className="statement-grid" style={{ maxWidth: '1400px', margin: '0 auto' }}>

        {/* Image */}
        <div className="statement-image-wrap" style={{ position: 'relative', aspectRatio: '3/4', overflow: 'hidden' }}>
          {/* Thin gold frame */}
          <div style={{
            position: 'absolute', inset: '-8px',
            border: '1px solid rgba(184,146,42,0.18)', zIndex: 0,
            pointerEvents: 'none',
          }} />
          <Image
            src={HER_WORK.sculptureRose}
            alt="Rose in High Relief — Shweta Singh"
            fill
            style={{ objectFit: 'cover', objectPosition: 'center 20%', zIndex: 1 }}
            sizes="(max-width: 900px) 100vw, 50vw"
          />
          {/* Bottom fade */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0, height: '35%', zIndex: 2,
            background: 'linear-gradient(to top, rgba(8,8,8,0.7), transparent)',
          }} />
          <div style={{ position: 'absolute', bottom: '24px', left: '24px', zIndex: 3 }}>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: 'clamp(0.85rem,1.5vw,1rem)', color: 'var(--cream)', fontStyle: 'italic' }}>
              Rose in High Relief
            </p>
            <p className="t-label" style={{ marginTop: '4px', fontSize: '9px', opacity: 0.5 }}>
              Sculpture · Eleven days
            </p>
          </div>
        </div>

        {/* Text */}
        <div style={{ padding: 'clamp(0px,3vw,40px) 0' }}>
          <p className="t-label" style={{ marginBottom: 'clamp(20px,4vh,40px)' }}>The Artist</p>

          <h2 className="t-display" style={{ marginBottom: 'clamp(20px,4vh,36px)' }}>
            Shweta studied philosophy before she studied art.
          </h2>

          <div className="gold-rule" style={{ marginBottom: 'clamp(20px,4vh,36px)' }} />

          <blockquote style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(1rem,1.6vw,1.2rem)',
            color: 'var(--cream)',
            opacity: 0.65,
            lineHeight: 1.9,
            fontStyle: 'italic',
            marginBottom: 'clamp(16px,3vh,28px)',
          }}>
            "Every material has a question inside it. Stone asks: how long?
            Gold asks: what survives? Resin asks: what happens when something
            is interrupted mid-motion and preserved forever?
            I have spent my life answering these questions with my hands."
          </blockquote>

          <p className="t-label" style={{ opacity: 0.5 }}>— Shweta Singh</p>

          {/* Mediums */}
          <div style={{
            marginTop: 'clamp(32px,6vh,60px)',
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: 'clamp(10px,2vh,16px) clamp(16px,4vw,40px)',
          }}>
            {[
              'High-Relief Sculpture',
              'Tanjore Gold-Leaf',
              'Layered Resin',
              'Decoupage',
              'Canvas Painting',
              'Clay & Relief',
            ].map(m => (
              <p key={m} style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: '0.1em',
                color: 'var(--cream)',
                opacity: 0.4,
                textTransform: 'uppercase',
                paddingBottom: '10px',
                borderBottom: '1px solid rgba(245,240,232,0.07)',
              }}>{m}</p>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
