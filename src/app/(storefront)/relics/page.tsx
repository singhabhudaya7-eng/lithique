import type { Metadata } from 'next'
import { getPublishedRelics } from '@/lib/db'
import { RelicGrid } from '@/components/storefront/RelicGrid'
import { Nav } from '@/components/storefront/Nav'
import { Footer } from '@/components/storefront/Footer'

export const metadata: Metadata = {
  title: 'The Collection',
  description: 'Works by Shweta Singh available for private acquisition.',
}

export default async function RelicsPage() {
  const relics = await getPublishedRelics()

  return (
    <>
      <Nav />
      <main style={{ background: 'var(--obsidian)', minHeight: '100vh' }}>
        {/* Header */}
        <div style={{
          padding: 'clamp(120px,18vh,180px) var(--pad-x) clamp(40px,6vh,80px)',
          borderBottom: '1px solid rgba(184,146,42,0.08)',
        }}>
          <p className="t-label" style={{ marginBottom: 'clamp(16px,3vh,28px)', opacity: 0.7 }}>
            Lithique by Shweta
          </p>
          <h1 className="t-display" style={{ marginBottom: 'clamp(12px,2vh,20px)' }}>
            The Collection
          </h1>
          <p style={{
            fontFamily: 'var(--font-serif)',
            fontSize: 'clamp(0.9rem,1.5vw,1.1rem)',
            color: 'var(--cream)',
            opacity: 0.4,
            fontStyle: 'italic',
          }}>
            {relics.length} work{relics.length !== 1 ? 's' : ''} — available for private acquisition.
          </p>
        </div>

        <RelicGrid relics={relics} />
      </main>
      <Footer />
    </>
  )
}
