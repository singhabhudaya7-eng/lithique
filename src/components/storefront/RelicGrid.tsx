'use client'

import type { RelicSummary } from '@/types'
import { RelicCard } from './RelicCard'

export function RelicGrid({ relics }: { relics: RelicSummary[] }) {
  if (!relics.length) {
    return (
      <div style={{ textAlign: 'center', padding: 'var(--space-section) var(--pad-x)' }}>
        <p className="t-sub" style={{ opacity: 0.3 }}>The archive is being assembled.</p>
      </div>
    )
  }

  return (
    <div className="relic-grid">
      {relics.map((relic, i) => (
        <RelicCard key={relic.id} relic={relic} />
      ))}
    </div>
  )
}
