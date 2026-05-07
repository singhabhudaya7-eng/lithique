'use client'

import { useState } from 'react'

export function CertificateButton({ nfcId }: { nfcId: string }) {
  const [state, setState] = useState<'idle' | 'loading' | 'error'>('idle')

  async function download() {
    setState('loading')
    try {
      const res = await fetch(`/api/certificate/${nfcId}`)
      if (!res.ok) throw new Error('Failed')
      const blob = await res.blob()
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `lithique-certificate-${nfcId.slice(0, 8)}.pdf`
      a.click()
      URL.revokeObjectURL(url)
      setState('idle')
    } catch {
      setState('error')
      setTimeout(() => setState('idle'), 3000)
    }
  }

  return (
    <button
      onClick={download}
      disabled={state === 'loading'}
      style={{
        display: 'inline-flex',
        alignItems: 'center',
        gap: '8px',
        padding: '10px 24px',
        border: '1px solid rgba(201,168,76,0.4)',
        color: state === 'error' ? '#e06b6b' : 'var(--lithique-gold)',
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        letterSpacing: 'var(--tracking-luxury)',
        background: 'transparent',
        cursor: state === 'loading' ? 'wait' : 'pointer',
        opacity: state === 'loading' ? 0.6 : 1,
        transition: 'var(--transition-relic)',
      }}
    >
      {state === 'loading' && (
        <span
          style={{
            display: 'inline-block',
            width: '10px',
            height: '10px',
            border: '1px solid var(--lithique-gold)',
            borderTopColor: 'transparent',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      )}
      {state === 'error'
        ? 'GENERATION FAILED — RETRY'
        : state === 'loading'
        ? 'PREPARING CERTIFICATE...'
        : 'DOWNLOAD CERTIFICATE OF PERMANENCE'}
    </button>
  )
}
