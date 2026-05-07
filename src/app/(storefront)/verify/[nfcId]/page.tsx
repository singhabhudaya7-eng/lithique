import type { Metadata } from 'next'
import { verifyRelicByNfcId } from '@/lib/db'
import { ProvenanceCard } from '@/components/provenance/ProvenanceCard'
import { CertificateButton } from '@/components/provenance/CertificateButton'
import { NFCScanner } from '@/components/provenance/NFCScanner'
import Link from 'next/link'

interface Props {
  params: { nfcId: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const result = await verifyRelicByNfcId(params.nfcId)
  if ('code' in result) return { title: 'Relic Verification' }
  return {
    title: result.relic.name,
    description: result.relic.tagline,
  }
}

export default async function VerifyPage({ params }: Props) {
  const result = await verifyRelicByNfcId(params.nfcId)

  if ('code' in result) {
    return (
      <main
        className="min-h-screen flex flex-col items-center justify-center px-6 text-center"
        style={{ background: 'var(--lithique-obsidian)' }}
      >
        <p
          className="text-xs uppercase mb-8"
          style={{ color: 'var(--lithique-gold)', letterSpacing: 'var(--tracking-luxury)', fontFamily: 'var(--font-sans)' }}
        >
          LITHIQUE BY SHWETA — Provenance Archive
        </p>
        <h1
          className="text-3xl md:text-4xl mb-6 max-w-xl"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)' }}
        >
          This relic has not yet crossed into our records.
        </h1>
        <p
          className="text-base max-w-md leading-relaxed mb-12"
          style={{ fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)', opacity: 0.5, fontStyle: 'italic' }}
        >
          Its stone endures; its lineage will follow.
        </p>
        <div
          className="w-16 h-px mb-12"
          style={{ background: 'var(--lithique-gold)', opacity: 0.4 }}
        />
        <NFCScanner />
        <Link
          href="/"
          className="mt-12 text-xs"
          style={{ color: 'var(--lithique-warm-white)', opacity: 0.3, fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-luxury)' }}
        >
          RETURN TO THE ARCHIVE
        </Link>
      </main>
    )
  }

  const { relic, provenance } = result

  return (
    <main
      className="min-h-screen px-6 py-16 md:py-24"
      style={{ background: 'var(--lithique-obsidian)' }}
    >
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <Link
            href={`/relics/${relic.slug}`}
            className="text-xs uppercase block mb-8"
            style={{ color: 'var(--lithique-gold)', letterSpacing: 'var(--tracking-luxury)', fontFamily: 'var(--font-sans)', opacity: 0.7 }}
          >
            ← {relic.name}
          </Link>
          <p
            className="text-xs uppercase mb-3"
            style={{ color: 'var(--lithique-gold)', letterSpacing: 'var(--tracking-luxury)', fontFamily: 'var(--font-sans)' }}
          >
            LITHIQUE BY SHWETA — Provenance Archive
          </p>
          <h1
            className="text-4xl md:text-5xl mb-4"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)' }}
          >
            {relic.name}
          </h1>
          <p
            className="text-lg"
            style={{ fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)', opacity: 0.6, fontStyle: 'italic' }}
          >
            {relic.tagline}
          </p>
        </div>

        {/* Gold divider */}
        <div className="w-full h-px mb-12" style={{ background: 'var(--lithique-gold)', opacity: 0.2 }} />

        {/* Provenance card — server-rendered, no JS required */}
        <ProvenanceCard provenance={provenance} relicName={relic.name} />

        {/* Certificate download — client component */}
        <div className="mt-8 flex flex-col items-start gap-4">
          <CertificateButton nfcId={params.nfcId} />
        </div>

        {/* NFC scanner for re-verification */}
        <div className="mt-16 pt-8" style={{ borderTop: '1px solid rgba(201,168,76,0.1)' }}>
          <p
            className="text-xs uppercase mb-6 text-center"
            style={{ color: 'var(--lithique-gold)', opacity: 0.5, letterSpacing: 'var(--tracking-luxury)', fontFamily: 'var(--font-sans)' }}
          >
            Verify Another Relic
          </p>
          <NFCScanner />
        </div>
      </div>
    </main>
  )
}
