import type { Metadata } from 'next'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getRelicBySlug } from '@/lib/db'
import { buildVerifyUrl } from '@/lib/nfc'
import { InquireForm } from '@/components/commerce/InquireForm'
import { ReserveButton } from '@/components/commerce/ReserveButton'
import { GoldDivider } from '@/components/ui/GoldDivider'
import { Caption } from '@/components/ui/Typography'

const RelicViewer3D = dynamic(
  () => import('@/components/viewer/RelicViewer3D').then(m => m.RelicViewer3D),
  { ssr: false, loading: () => <ViewerPlaceholder /> }
)

const TIER_LABELS: Record<string, string> = {
  ENTRY: 'Entry Relic',
  COLLECTOR: 'Collector Piece',
  COMMISSION: 'Maison Commission',
}

function formatPrice(min: number, max?: number | null) {
  const fmt = (n: number) =>
    new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n)
  if (!max) return `From ${fmt(min)}`
  return `${fmt(min)} — ${fmt(max)}`
}

function ViewerPlaceholder() {
  return (
    <div
      style={{
        width: '100%', aspectRatio: '4/3',
        background: 'var(--lithique-stone-mid)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <span style={{ color: 'var(--lithique-gold)', opacity: 0.4, fontFamily: 'var(--font-sans)', fontSize: '10px', letterSpacing: 'var(--tracking-luxury)' }}>
        LOADING RELIC...
      </span>
    </div>
  )
}

interface Props { params: { slug: string } }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const relic = await getRelicBySlug(params.slug)
  if (!relic) return { title: 'Relic Not Found' }
  return {
    title: relic.name,
    description: relic.tagline,
    openGraph: {
      title: relic.name,
      description: relic.tagline,
      images: relic.imageUrls[0] ? [relic.imageUrls[0]] : [],
    },
  }
}

export default async function RelicDetailPage({ params }: Props) {
  const relic = await getRelicBySlug(params.slug)
  if (!relic) notFound()

  const heroImage = relic.imageUrls[0] ?? '/textures/relic-placeholder.jpg'

  return (
    <main style={{ background: 'var(--lithique-obsidian)', minHeight: '100vh' }}>
      {/* Full-bleed hero */}
      <div style={{ position: 'relative', height: '70vh', minHeight: '500px' }}>
        <Image
          src={heroImage}
          alt={relic.name}
          fill
          priority
          style={{ objectFit: 'cover', opacity: 0.5 }}
          sizes="100vw"
        />
        <div
          style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to bottom, rgba(10,10,10,0.2) 0%, var(--lithique-obsidian) 100%)',
          }}
        />
        <div
          style={{
            position: 'absolute', bottom: '48px', left: '0', right: '0',
            padding: '0 40px', maxWidth: '800px', margin: '0 auto',
          }}
        >
          <Caption style={{ color: 'var(--lithique-gold)', display: 'block', marginBottom: '16px' }}>
            {TIER_LABELS[relic.tier]}
          </Caption>
          <h1
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(2.5rem, 5vw, 4rem)',
              color: 'var(--lithique-warm-white)',
              fontWeight: 400,
              lineHeight: 1.05,
            }}
          >
            {relic.name}
          </h1>
        </div>
      </div>

      {/* Body */}
      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 40px 80px' }}>

        {/* Tagline + investment */}
        <div style={{ padding: '48px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '32px', flexWrap: 'wrap' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)', fontSize: '1.35rem', fontStyle: 'italic',
              color: 'var(--lithique-warm-white)', opacity: 0.7, maxWidth: '560px', lineHeight: 1.4,
            }}
          >
            {relic.tagline}
          </p>
          <div style={{ textAlign: 'right' }}>
            <Caption style={{ color: 'var(--lithique-gold)', opacity: 0.6, display: 'block', marginBottom: '8px' }}>
              Investment
            </Caption>
            <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.5rem', color: 'var(--lithique-warm-white)' }}>
              {formatPrice(relic.priceMin, relic.priceMax)}
            </p>
          </div>
        </div>

        <GoldDivider opacity={0.15} />

        {/* Description */}
        <div style={{ padding: '48px 0', maxWidth: '680px' }}>
          {relic.description.split('\n\n').map((para, i) => (
            <p
              key={i}
              style={{
                fontFamily: 'var(--font-serif)', fontSize: '1.1rem',
                color: 'var(--lithique-warm-white)', opacity: 0.8,
                lineHeight: 1.8, marginBottom: '20px',
              }}
            >
              {para}
            </p>
          ))}
        </div>

        <GoldDivider opacity={0.15} />

        {/* 3D viewer + provenance teaser side by side */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: relic.modelUrl ? '1fr 1fr' : '1fr',
            gap: '48px',
            padding: '48px 0',
            alignItems: 'start',
          }}
        >
          {relic.modelUrl && (
            <div>
              <Caption style={{ color: 'var(--lithique-gold)', display: 'block', marginBottom: '20px' }}>
                Observe the Relic
              </Caption>
              <RelicViewer3D modelUrl={relic.modelUrl} relicName={relic.name} />
            </div>
          )}

          {relic.provenance && (
            <div>
              <Caption style={{ color: 'var(--lithique-gold)', display: 'block', marginBottom: '20px' }}>
                Provenance
              </Caption>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <ProvenanceItem label="Stone" value={relic.provenance.stoneType} />
                <ProvenanceItem label="Origin" value={`${relic.provenance.quarryName}, ${relic.provenance.quarryRegion}`} />
                <ProvenanceItem label="Artisan" value={relic.provenance.artisanName} />
              </div>

              {relic.nfcId && (
                <Link
                  href={buildVerifyUrl(relic.nfcId)}
                  style={{
                    display: 'inline-block', marginTop: '24px',
                    fontFamily: 'var(--font-sans)', fontSize: '11px',
                    letterSpacing: 'var(--tracking-luxury)', color: 'var(--lithique-gold)',
                    textDecoration: 'none', textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(201,168,76,0.4)',
                    paddingBottom: '2px',
                  }}
                >
                  View Full Lineage →
                </Link>
              )}
            </div>
          )}
        </div>

        <GoldDivider opacity={0.15} />

        {/* Commerce */}
        <div style={{ padding: '64px 0', maxWidth: '560px' }}>
          {relic.inquiryOpen ? (
            <>
              <Caption style={{ color: 'var(--lithique-gold)', display: 'block', marginBottom: '12px' }}>
                Inquire for Acquisition
              </Caption>
              <p
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: '0.95rem',
                  color: 'var(--lithique-warm-white)', opacity: 0.5, fontStyle: 'italic',
                  marginBottom: '40px', lineHeight: 1.6,
                }}
              >
                All acquisitions are handled with the discretion and patience the relic deserves.
              </p>
              <InquireForm relicId={relic.id} relicName={relic.name} relicSlug={relic.slug} />
            </>
          ) : (
            <>
              <Caption style={{ color: 'var(--lithique-gold)', display: 'block', marginBottom: '12px' }}>
                Private Consideration
              </Caption>
              <p
                style={{
                  fontFamily: 'var(--font-serif)', fontSize: '1rem',
                  color: 'var(--lithique-warm-white)', opacity: 0.6,
                  fontStyle: 'italic', lineHeight: 1.6, marginBottom: '32px',
                }}
              >
                This relic is currently in private consideration. Register your name to be informed
                when its future is determined.
              </p>
              <ReserveButton relicId={relic.id} relicName={relic.name} relicSlug={relic.slug} />
            </>
          )}
        </div>
      </div>
    </main>
  )
}

function ProvenanceItem({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ borderBottom: '1px solid rgba(250,247,242,0.06)', paddingBottom: '16px' }}>
      <Caption style={{ color: 'var(--lithique-gold)', opacity: 0.6, display: 'block', marginBottom: '6px' }}>
        {label}
      </Caption>
      <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1rem', color: 'var(--lithique-warm-white)' }}>
        {value}
      </p>
    </div>
  )
}
