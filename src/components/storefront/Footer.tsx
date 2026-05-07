import Link from 'next/link'

export function Footer() {
  return (
    <footer style={{
      background: 'var(--obsidian)',
      borderTop: '1px solid rgba(184,146,42,0.1)',
      padding: 'clamp(48px,8vh,80px) var(--pad-x)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: 'clamp(16px,3vh,24px)',
      textAlign: 'center',
    }}>
      <p style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(0.85rem,1.5vw,1rem)',
        color: 'var(--cream)',
        opacity: 0.25,
        fontStyle: 'italic',
        maxWidth: '400px',
        lineHeight: 1.7,
      }}>
        Stone endures. All else is commentary.
      </p>

      <div style={{ display: 'flex', gap: 'clamp(20px,4vw,40px)', flexWrap: 'wrap', justifyContent: 'center' }}>
        <Link href="/relics" className="t-label" style={{ textDecoration: 'none', opacity: 0.2, fontSize: '9px' }}>
          The Collection
        </Link>
        <span className="t-label" style={{ opacity: 0.12, fontSize: '9px' }}>
          © {new Date().getFullYear()} LITHIQUE BY SHWETA · MUMBAI
        </span>
      </div>
    </footer>
  )
}
