import Link from 'next/link'
import { getPublishedRelics } from '@/lib/db'
import { MOCK_RELICS, MOCK_INQUIRIES } from '@/lib/mock-data'

const TIER_LABELS: Record<string, string> = {
  ENTRY: 'Entry',
  COLLECTOR: 'Collector',
  COMMISSION: 'Commission',
}

export default async function AdminDashboard() {
  // Use mock data in dev, real data when DB is connected
  const relics = process.env.DATABASE_URL
    ? await getPublishedRelics()
    : MOCK_RELICS

  const pendingInquiries = MOCK_INQUIRIES.filter(i => i.status === 'PENDING').length

  return (
    <div>
      <div style={{ marginBottom: '48px' }}>
        <h1
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '2.5rem',
            color: 'var(--lithique-warm-white)',
            marginBottom: '8px',
          }}
        >
          The Archive
        </h1>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: 'var(--tracking-luxury)',
            color: 'var(--lithique-gold)',
            opacity: 0.6,
            textTransform: 'uppercase',
          }}
        >
          {relics.length} Relics · {pendingInquiries} Pending {pendingInquiries === 1 ? 'Inquiry' : 'Inquiries'}
        </p>
      </div>

      {/* Actions */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '48px' }}>
        <Link
          href="/admin/relics/new"
          style={{
            padding: '10px 24px',
            border: '1px solid var(--lithique-gold)',
            color: 'var(--lithique-gold)',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: 'var(--tracking-luxury)',
            textDecoration: 'none',
            textTransform: 'uppercase',
          }}
        >
          + New Relic
        </Link>
        <Link
          href="/admin/inquiries"
          style={{
            padding: '10px 24px',
            border: '1px solid rgba(250,247,242,0.2)',
            color: 'var(--lithique-warm-white)',
            fontFamily: 'var(--font-sans)',
            fontSize: '11px',
            letterSpacing: 'var(--tracking-luxury)',
            textDecoration: 'none',
            textTransform: 'uppercase',
            opacity: 0.7,
          }}
        >
          View Inquiries
        </Link>
      </div>

      {/* Relics table */}
      {relics.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--lithique-warm-white)',
            opacity: 0.4,
            fontStyle: 'italic',
          }}
        >
          No relics have been committed to the archive yet.
        </p>
      ) : (
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead>
            <tr>
              {['Name', 'Tier', 'Status', 'NFC', 'Actions'].map(h => (
                <th
                  key={h}
                  style={{
                    textAlign: 'left',
                    padding: '12px 16px',
                    fontFamily: 'var(--font-sans)',
                    fontSize: '9px',
                    letterSpacing: 'var(--tracking-luxury)',
                    color: 'var(--lithique-gold)',
                    opacity: 0.7,
                    textTransform: 'uppercase',
                    borderBottom: '1px solid rgba(201,168,76,0.15)',
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {relics.map(relic => (
              <tr
                key={relic.id}
                style={{ borderBottom: '1px solid rgba(250,247,242,0.05)' }}
              >
                <td style={{ padding: '16px', fontFamily: 'var(--font-serif)', color: 'var(--lithique-warm-white)' }}>
                  {relic.name}
                </td>
                <td style={{ padding: '16px', fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', opacity: 0.7, textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {TIER_LABELS[relic.tier]}
                </td>
                <td style={{ padding: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '9px',
                      letterSpacing: '0.1em',
                      textTransform: 'uppercase',
                      padding: '3px 8px',
                      border: `1px solid ${relic.published ? 'rgba(201,168,76,0.4)' : 'rgba(250,247,242,0.2)'}`,
                      color: relic.published ? 'var(--lithique-gold)' : 'rgba(250,247,242,0.4)',
                    }}
                  >
                    {relic.published ? 'Published' : 'Draft'}
                  </span>
                </td>
                <td style={{ padding: '16px', fontFamily: 'var(--font-sans)', fontSize: '10px', color: relic.nfcId ? 'var(--lithique-gold)' : 'rgba(250,247,242,0.25)', textTransform: 'uppercase', letterSpacing: '0.1em' }}>
                  {relic.nfcId ? '✓ Assigned' : 'Unassigned'}
                </td>
                <td style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', gap: '16px' }}>
                    <Link
                      href={`/admin/relics/${relic.id}`}
                      style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-warm-white)', opacity: 0.5, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      Edit
                    </Link>
                    <Link
                      href={`/relics/${relic.slug}`}
                      target="_blank"
                      style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', opacity: 0.5, textDecoration: 'none', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                    >
                      View ↗
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
