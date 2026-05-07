import { MOCK_INQUIRIES } from '@/lib/mock-data'

const STATUS_COLORS: Record<string, string> = {
  PENDING: 'var(--lithique-gold)',
  REVIEWED: 'rgba(250,247,242,0.5)',
  REPLIED: 'rgba(120,200,120,0.8)',
  CLOSED: 'rgba(250,247,242,0.2)',
}

export default function InquiriesPage() {
  // Uses mock data until DB is connected
  const inquiries = MOCK_INQUIRIES

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
          Inquiries
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
          {inquiries.filter(i => i.status === 'PENDING').length} pending
        </p>
      </div>

      {inquiries.length === 0 ? (
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            color: 'var(--lithique-warm-white)',
            opacity: 0.4,
            fontStyle: 'italic',
          }}
        >
          The archive awaits its first inquiry.
        </p>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {inquiries.map(inquiry => (
            <div
              key={inquiry.id}
              style={{
                padding: '24px',
                background: 'var(--lithique-stone-mid)',
                border: '1px solid rgba(201,168,76,0.08)',
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', gap: '16px', flexWrap: 'wrap' }}>
                <div>
                  <p style={{ fontFamily: 'var(--font-serif)', fontSize: '1.1rem', color: 'var(--lithique-warm-white)', marginBottom: '4px' }}>
                    {inquiry.clientName}
                  </p>
                  <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', opacity: 0.7, letterSpacing: '0.05em' }}>
                    {inquiry.relic?.name ?? 'Unknown Relic'} · {inquiry.clientEmail}
                    {inquiry.clientPhone && ` · ${inquiry.clientPhone}`}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <span
                    style={{
                      fontFamily: 'var(--font-sans)',
                      fontSize: '9px',
                      letterSpacing: 'var(--tracking-luxury)',
                      textTransform: 'uppercase',
                      color: STATUS_COLORS[inquiry.status],
                    }}
                  >
                    {inquiry.status}
                  </span>
                  <span style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'rgba(250,247,242,0.3)' }}>
                    {new Date(inquiry.createdAt).toLocaleDateString('en-IN')}
                  </span>
                </div>
              </div>

              {!inquiry.isWaitlist && (
                <p
                  style={{
                    fontFamily: 'var(--font-serif)',
                    fontSize: '0.95rem',
                    color: 'var(--lithique-warm-white)',
                    opacity: 0.6,
                    fontStyle: 'italic',
                    lineHeight: 1.6,
                  }}
                >
                  &ldquo;{inquiry.message}&rdquo;
                </p>
              )}
              {inquiry.isWaitlist && (
                <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', opacity: 0.5, letterSpacing: '0.1em', textTransform: 'uppercase' }}>
                  Waitlist Registration
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
