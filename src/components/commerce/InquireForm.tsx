'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/Button'

interface InquireFormProps {
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
  transition: 'border-color 400ms ease',
}

const labelStyle: React.CSSProperties = {
  fontFamily: 'var(--font-sans)',
  fontSize: '10px',
  letterSpacing: 'var(--tracking-luxury)',
  color: 'var(--lithique-gold)',
  textTransform: 'uppercase',
  display: 'block',
  marginBottom: '6px',
}

export function InquireForm({ relicId, relicName, relicSlug }: InquireFormProps) {
  const [state, setState] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [form, setForm] = useState({
    clientName: '',
    clientEmail: '',
    clientPhone: '',
    message: '',
  })

  function validate() {
    const errs: Record<string, string> = {}
    if (!form.clientName.trim()) errs.clientName = 'Your name is required.'
    if (!form.clientEmail.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.clientEmail))
      errs.clientEmail = 'A valid email address is required.'
    if (!form.message.trim()) errs.message = 'Please share your intent.'
    return errs
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault()
    const errs = validate()
    if (Object.keys(errs).length) { setErrors(errs); return }
    setErrors({})
    setState('submitting')

    try {
      const res = await fetch('/api/inquire', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ relicId, relicName, relicSlug, ...form, isWaitlist: false }),
      })
      if (!res.ok) throw new Error()
      setState('success')
    } catch {
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div style={{ padding: '40px 0' }}>
        <div style={{ width: '32px', height: '1px', background: 'var(--lithique-gold)', marginBottom: '24px' }} />
        <p
          style={{
            fontFamily: 'var(--font-serif)',
            fontSize: '1.2rem',
            color: 'var(--lithique-warm-white)',
            lineHeight: 1.6,
            maxWidth: '480px',
          }}
        >
          Your inquiry has been received and shall be treated with the discretion it deserves.
          Expect correspondence.
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={submit} noValidate style={{ display: 'flex', flexDirection: 'column', gap: '28px' }}>
      <div>
        <label style={labelStyle}>Full Name</label>
        <input
          type="text"
          placeholder="As you would like to be addressed"
          value={form.clientName}
          onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
          style={inputStyle}
        />
        {errors.clientName && <FieldError>{errors.clientName}</FieldError>}
      </div>

      <div>
        <label style={labelStyle}>Email Address</label>
        <input
          type="email"
          placeholder="For private correspondence"
          value={form.clientEmail}
          onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
          style={inputStyle}
        />
        {errors.clientEmail && <FieldError>{errors.clientEmail}</FieldError>}
      </div>

      <div>
        <label style={labelStyle}>Phone <span style={{ opacity: 0.4 }}>(Optional)</span></label>
        <input
          type="tel"
          placeholder="If you prefer a direct conversation"
          value={form.clientPhone}
          onChange={e => setForm(f => ({ ...f, clientPhone: e.target.value }))}
          style={inputStyle}
        />
      </div>

      <div>
        <label style={labelStyle}>Your intent regarding this relic</label>
        <textarea
          placeholder="What draws you to this piece. Any context you choose to share."
          value={form.message}
          onChange={e => setForm(f => ({ ...f, message: e.target.value }))}
          rows={4}
          style={{ ...inputStyle, resize: 'vertical', lineHeight: 1.6 }}
        />
        {errors.message && <FieldError>{errors.message}</FieldError>}
      </div>

      {state === 'error' && (
        <p style={{ fontFamily: 'var(--font-serif)', fontSize: '0.9rem', color: '#e06b6b', fontStyle: 'italic' }}>
          The archive encountered a difficulty. Please try again.
        </p>
      )}

      <div>
        <Button
          type="submit"
          variant="gold-outline"
          disabled={state === 'submitting'}
          style={{ opacity: state === 'submitting' ? 0.6 : 1 }}
        >
          {state === 'submitting' ? 'TRANSMITTING...' : 'INQUIRE FOR ACQUISITION'}
        </Button>
      </div>
    </form>
  )
}

function FieldError({ children }: { children: React.ReactNode }) {
  return (
    <p style={{ fontFamily: 'var(--font-sans)', fontSize: '10px', color: '#e06b6b', marginTop: '6px', letterSpacing: '0.05em' }}>
      {children}
    </p>
  )
}
