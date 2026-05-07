import Link from 'next/link'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: 'var(--lithique-obsidian)' }}>
      {/* Sidebar */}
      <aside
        style={{
          width: '220px',
          flexShrink: 0,
          borderRight: '1px solid rgba(201,168,76,0.1)',
          padding: '32px 0',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}
      >
        <div style={{ padding: '0 24px 32px' }}>
          <p
            style={{
              fontFamily: 'var(--font-serif)',
              fontSize: '0.85rem',
              color: 'var(--lithique-warm-white)',
              opacity: 0.5,
              letterSpacing: '0.05em',
            }}
          >
            LITHIQUE
          </p>
          <p
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '9px',
              letterSpacing: 'var(--tracking-luxury)',
              color: 'var(--lithique-gold)',
              opacity: 0.6,
              textTransform: 'uppercase',
            }}
          >
            Archive Admin
          </p>
        </div>

        <AdminNav href="/admin" label="Dashboard" />
        <AdminNav href="/admin/relics/new" label="New Relic" />
        <AdminNav href="/admin/inquiries" label="Inquiries" />

        <div style={{ marginTop: 'auto', padding: '24px' }}>
          <Link
            href="/"
            style={{
              fontFamily: 'var(--font-sans)',
              fontSize: '10px',
              letterSpacing: 'var(--tracking-luxury)',
              color: 'var(--lithique-warm-white)',
              opacity: 0.3,
              textDecoration: 'none',
              textTransform: 'uppercase',
            }}
          >
            ← View Site
          </Link>
        </div>
      </aside>

      {/* Content */}
      <main style={{ flex: 1, padding: '48px', overflowY: 'auto' }}>
        {children}
      </main>
    </div>
  )
}

function AdminNav({ href, label }: { href: string; label: string }) {
  return (
    <Link
      href={href}
      style={{
        display: 'block',
        padding: '10px 24px',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        letterSpacing: 'var(--tracking-luxury)',
        color: 'var(--lithique-warm-white)',
        opacity: 0.6,
        textDecoration: 'none',
        textTransform: 'uppercase',
        transition: 'opacity 300ms ease',
      }}
      onMouseEnter={e => (e.currentTarget.style.opacity = '1')}
      onMouseLeave={e => (e.currentTarget.style.opacity = '0.6')}
    >
      {label}
    </Link>
  )
}
