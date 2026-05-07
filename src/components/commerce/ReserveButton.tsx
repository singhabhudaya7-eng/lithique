'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface ReserveButtonProps {
  relicId: string
  relicName: string
  relicSlug: string
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

export function ReserveButton({ relicId, relicName, relicSlug }: ReserveButtonProps) {
  const [open, setOpen] = useState(false)
  const [state, setState] = useState<'idle' | 'submitting' | 'success'>('idle')
  const [form, setForm] = useState({ clientName: '', clientEmail: '' })

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.clientName || !form.clientEmail) return
    setState('submitting')
    try {
      await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          relicId, relicName, relicSlug,
          clientName: form.clientName,
          clientEmail: form.clientEmail,
          message: 'Waitlist registration.',
          isWaitlist: true,
        }),
      })
      setState('success')
    } catch {
      setState('success') // still show success — don't expose errors
    }
  }

  return (
    <>
      <Button variant="ghost" onClick={() => setOpen(true)}>
        RESERVE A RELIC
      </Button>

      {open && (
        <div
          style={{
            position: 'fixed', inset: 0, zIndex: 100,
            background: 'rgba(10,10,10,0.9)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            padding: '24px',
          }}
          onClick={e => { if (e.target === e.currentTarget) setOpen(false) }}
        >
          <div
            style={{
              background: 'var(--lithique-stone-mid)',
              border: '1px solid rgba(201,168,76,0.2)',
              padding: '48px',
              maxWidth: '480px',
              width: '100%',
            }}
          >
            {state === 'success' ? (
              <p
                style={{
                  fontFamily: 'var(--font-serif)',
                  fontSize: '1.1rem',
                  color: 'var(--lithique-warm-white)',
                  lineHeight: 1.6,
                }}
              >
                Your name has been committed to the stone&apos;s record.
              </p>
            ) : (
              <>
                <p
                  style={{
                    fontFamily: 'var(--font-sans)', fontSize: '10px',
                    letterSpacing: 'var(--tracking-luxury)', color: 'var(--lithique-gold)',
                    textTransform: 'uppercase', marginBottom: '20px',
                  }}
                >
                  {relicName}
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-serif)', fontSize: '1rem',
                    color: 'var(--lithique-warm-white)', opacity: 0.7,
                    lineHeight: 1.6, marginBottom: '32px', fontStyle: 'italic',
                  }}
                >
                  This relic is reserved for private consideration. Leave your name and we will
                  reach out when its future becomes clear.
                </p>
                <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                  <input
                    required placeholder="Your name"
                    value={form.clientName}
                    onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                    style={inputStyle}
                  />
                  <input
                    required type="email" placeholder="Your email"
                    value={form.clientEmail}
                    onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                    style={inputStyle}
                  />
                  <Button type="submit" variant="gold-outline" disabled={state === 'submitting'}>
                    {state === 'submitting' ? 'REGISTERING...' : 'RESERVE A RELIC'}
                  </Button>
                </form>
              </>
            )}
            <button
              onClick={() => setOpen(false)}
              style={{
                marginTop: '24px', background: 'none', border: 'none',
                color: 'var(--lithique-warm-white)', opacity: 0.3,
                fontFamily: 'var(--font-sans)', fontSize: '10px',
                letterSpacing: 'var(--tracking-luxury)', cursor: 'pointer',
                textTransform: 'uppercase',
              }}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  )
}
