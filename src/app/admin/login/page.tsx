'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const isConfigured = !!(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  )

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    if (!isConfigured) {
      // Dev mode — bypass auth
      router.push('/admin')
      return
    }

    const supabase = createClient()
    const { error: authError } = await supabase.auth.signInWithPassword({ email, password })

    if (authError) {
      setError('Access denied. The archive does not recognize your credentials.')
      setLoading(false)
      return
    }

    router.push('/admin')
    router.refresh()
  }

  const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: '1px solid rgba(250,247,242,0.2)',
    color: 'var(--lithique-warm-white)',
    fontFamily: 'var(--font-serif)',
    fontSize: '1rem',
    padding: '12px 0',
    outline: 'none',
  }

  return (
    <div
      style={{
        minHeight: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        background: 'var(--lithique-obsidian)',
      }}
    >
      <div style={{ width: '100%', maxWidth: '380px' }}>
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '0.9rem',
            letterSpacing: '0.2em',
            color: 'var(--lithique-warm-white)',
            textTransform: 'uppercase',
            marginBottom: '8px',
          }}
        >
          LITHIQUE BY SHWETA
        </p>
        <p
          style={{
            fontFamily: 'var(--font-sans)',
            fontSize: '9px',
            letterSpacing: 'var(--tracking-luxury)',
            color: 'var(--lithique-gold)',
            textTransform: 'uppercase',
            marginBottom: '48px',
            opacity: 0.7,
          }}
        >
          Archive Administration
        </p>

        {!isConfigured && (
          <div
            style={{
              padding: '12px 16px',
              border: '1px solid rgba(201,168,76,0.3)',
              marginBottom: '24px',
            }}
          >
            <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: 'var(--lithique-gold)', opacity: 0.8 }}>
              DEV MODE — Supabase not configured. Click login to proceed.
            </p>
          </div>
        )}

        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
          <div>
            <label
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: 'var(--tracking-luxury)',
                color: 'var(--lithique-gold)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              autoComplete="email"
              style={inputStyle}
            />
          </div>

          <div>
            <label
              style={{
                fontFamily: 'var(--font-sans)',
                fontSize: '10px',
                letterSpacing: 'var(--tracking-luxury)',
                color: 'var(--lithique-gold)',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '6px',
              }}
            >
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              autoComplete="current-password"
              style={inputStyle}
            />
          </div>

          {error && (
            <p
              style={{
                fontFamily: 'var(--font-serif)',
                fontSize: '0.9rem',
                color: '#e06b6b',
                fontStyle: 'italic',
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              padding: '14px 32px',
              border: '1px solid var(--lithique-gold)',
              color: 'var(--lithique-gold)',
              background: 'transparent',
              fontFamily: 'var(--font-sans)',
              fontSize: '11px',
              letterSpacing: 'var(--tracking-luxury)',
              textTransform: 'uppercase',
              cursor: loading ? 'wait' : 'pointer',
              opacity: loading ? 0.6 : 1,
              transition: 'var(--transition-relic)',
            }}
          >
            {loading ? 'VERIFYING...' : 'ACCESS THE ARCHIVE'}
          </button>
        </form>
      </div>
    </div>
  )
}
