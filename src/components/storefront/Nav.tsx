'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

export function Nav() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', fn, { passive: true })
    return () => window.removeEventListener('scroll', fn)
  }, [])

  return (
    <nav className={`nav${scrolled ? ' nav--scrolled' : ''}`}>
      <Link href="/" className="nav__logo">Lithique by Shweta</Link>
      <div className="nav__links">
        <Link href="/relics" className="nav__link">The Collection</Link>
        <Link href="/admin" className="nav__link nav__link--secondary" style={{ opacity: 0.25 }}>Admin</Link>
      </div>
    </nav>
  )
}
