import type { Provenance, OwnerChainEntry } from '@/types'

interface ProvenanceCardProps {
  provenance: Provenance
  relicName: string
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

function ProvenanceRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-1 py-4 border-b border-stone-mid/40 last:border-0">
      <span
        className="text-xs font-luxury-tracking uppercase"
        style={{ color: 'var(--lithique-gold)', fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-luxury)' }}
      >
        {label}
      </span>
      <span
        className="text-lg"
        style={{ color: 'var(--lithique-warm-white)', fontFamily: 'var(--font-serif)' }}
      >
        {value}
      </span>
    </div>
  )
}

function OwnerChainTimeline({ chain }: { chain: OwnerChainEntry[] }) {
  if (!chain.length) return null

  return (
    <div className="mt-6">
      <p
        className="text-xs uppercase mb-4"
        style={{ color: 'var(--lithique-gold)', letterSpacing: 'var(--tracking-luxury)', fontFamily: 'var(--font-sans)' }}
      >
        Chain of Custody
      </p>
      <div className="relative">
        {chain.map((entry, i) => (
          <div key={i} className="relative pl-6 pb-6 last:pb-0">
            {/* Gold connector line */}
            {i < chain.length - 1 && (
              <div
                className="absolute left-[7px] top-3 bottom-0 w-px"
                style={{ background: 'var(--lithique-gold)', opacity: 0.3 }}
              />
            )}
            {/* Gold dot */}
            <div
              className="absolute left-0 top-1.5 w-3.5 h-3.5 rounded-full border"
              style={{ borderColor: 'var(--lithique-gold)', background: 'var(--lithique-obsidian)' }}
            />
            <p style={{ color: 'var(--lithique-warm-white)', fontFamily: 'var(--font-serif)', fontSize: '1rem' }}>
              {entry.name}
            </p>
            <p
              className="text-xs mt-0.5"
              style={{ color: 'var(--lithique-gold)', opacity: 0.7, fontFamily: 'var(--font-sans)' }}
            >
              {formatDate(entry.acquiredAt)}
            </p>
            {entry.transferNote && (
              <p
                className="text-sm mt-1 italic"
                style={{ color: 'var(--lithique-warm-white)', opacity: 0.6, fontFamily: 'var(--font-serif)' }}
              >
                {entry.transferNote}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}

export function ProvenanceCard({ provenance, relicName }: ProvenanceCardProps) {
  return (
    <div
      className="rounded-sm p-8"
      style={{ background: 'var(--lithique-stone-mid)', border: '1px solid rgba(201,168,76,0.15)' }}
    >
      <h2
        className="text-2xl mb-1"
        style={{ fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)' }}
      >
        Lineage of {relicName}
      </h2>
      <p
        className="text-sm mb-6"
        style={{ color: 'var(--lithique-gold)', opacity: 0.7, fontFamily: 'var(--font-sans)', letterSpacing: 'var(--tracking-luxury)' }}
      >
        CERTIFICATE OF PERMANENCE
      </p>

      <div>
        <ProvenanceRow label="Stone" value={provenance.stoneType} />
        <ProvenanceRow label="Quarry" value={`${provenance.quarryName}, ${provenance.quarryRegion}`} />
        <ProvenanceRow
          label="Artisan"
          value={provenance.artisanAtelier
            ? `${provenance.artisanName} — ${provenance.artisanAtelier}`
            : provenance.artisanName}
        />
        <ProvenanceRow label="Creation" value={formatDate(provenance.creationDate)} />
        {provenance.notes && (
          <div className="pt-4">
            <p
              className="text-sm italic leading-relaxed"
              style={{ color: 'var(--lithique-warm-white)', opacity: 0.7, fontFamily: 'var(--font-serif)' }}
            >
              {provenance.notes}
            </p>
          </div>
        )}
      </div>

      <OwnerChainTimeline chain={provenance.ownerChain} />
    </div>
  )
}
