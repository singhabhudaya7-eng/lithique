import { Nav } from '@/components/storefront/Nav'
import { Footer } from '@/components/storefront/Footer'
import { GrandHero } from '@/components/storefront/GrandHero'
import { ArtistStatement } from '@/components/storefront/ArtistStatement'
import { SilhouetteShowcase } from '@/components/storefront/SilhouetteShowcase'
import { RelicGrid } from '@/components/storefront/RelicGrid'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { getPublishedRelics } from '@/lib/db'

export default async function HomePage() {
  const relics = await getPublishedRelics()

  return (
    <>
      <Nav />
      <GrandHero />
      <ArtistStatement />
      <SilhouetteShowcase />

      {/* The Collection */}
      <section style={{ background: 'var(--obsidian)', paddingBottom: '100px' }}>
        <div style={{
          padding: 'clamp(60px,10vh,120px) var(--pad-x) clamp(32px,5vh,56px)',
          borderTop: '1px solid rgba(184,146,42,0.08)',
        }}>
          <p className="t-label" style={{ marginBottom: '20px', opacity: 0.6 }}>
            Available for Acquisition
          </p>
          <h2 className="t-display" style={{ maxWidth: '560px' }}>
            Works that can be owned.
          </h2>
        </div>
        <GoldDivider opacity={0.06} />
        <RelicGrid relics={relics} />
      </section>

      <Footer />
    </>
  )
}
