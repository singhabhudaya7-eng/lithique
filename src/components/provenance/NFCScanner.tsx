'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

type ScanState = 'idle' | 'scanning' | 'error'

export function NFCScanner() {
  const [state, setState] = useState<ScanState>('idle')
  const [errorMsg, setErrorMsg] = useState('')
  const router = useRouter()

  const isNFCSupported = typeof window !== 'undefined' && 'NDEFReader' in window

  async function startScan() {
    if (!isNFCSupported) return
    setState('scanning')
    setErrorMsg('')

    try {
      // @ts-expect-error — NDEFReader is not yet in TS lib
      const reader = new NDEFReader()
      await reader.scan()

      reader.onreadingerror = () => {
        setState('error')
        setErrorMsg('The relic could not be read. Ensure the NFC medallion is held steady.')
      }

      reader.onreading = ({ message }: any) => {
        for (const record of message.records) {
          if (record.recordType === 'url') {
            const url = new TextDecoder().decode(record.data)
            const nfcId = url.split('/verify/')[1]
            if (nfcId) {
              router.push(`/verify/${nfcId}`)
              return
            }
          }
        }
        setState('error')
        setErrorMsg('This does not appear to be a LITHIQUE relic. The inscription was not recognised.')
      }
    } catch {
      setState('error')
      setErrorMsg('Scanning was interrupted. Please try again.')
    }
  }

  if (!isNFCSupported) {
    return (
      <div
        className="rounded-sm p-6 text-center"
        style={{ border: '1px solid rgba(201,168,76,0.2)', background: 'rgba(42,37,32,0.5)' }}
      >
        <p
          className="text-sm leading-relaxed"
          style={{ color: 'var(--lithique-warm-white)', opacity: 0.7, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
        >
          To verify this relic, scan the NFC medallion with an Android device running Chrome,
          or visit the URL inscribed on your Certificate of Permanence.
        </p>
      </div>
    )
  }

  return (
    <div className="text-center">
      {state === 'idle' && (
        <button
          onClick={startScan}
          className="px-8 py-3 text-sm transition-all duration-500"
          style={{
            border: '1px solid var(--lithique-gold)',
            color: 'var(--lithique-gold)',
            fontFamily: 'var(--font-sans)',
            letterSpacing: 'var(--tracking-luxury)',
            background: 'transparent',
            cursor: 'pointer',
          }}
        >
          SCAN NFC MEDALLION
        </button>
      )}

      {state === 'scanning' && (
        <div>
          <div
            className="inline-block w-12 h-12 rounded-full border-2 animate-spin mb-4"
            style={{ borderColor: 'var(--lithique-gold)', borderTopColor: 'transparent' }}
          />
          <p
            className="text-sm"
            style={{ color: 'var(--lithique-warm-white)', opacity: 0.6, fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
          >
            Hold the relic&apos;s medallion near your device...
          </p>
        </div>
      )}

      {state === 'error' && (
        <div>
          <p
            className="text-sm mb-4"
            style={{ color: 'var(--lithique-gold)', fontFamily: 'var(--font-serif)', fontStyle: 'italic' }}
          >
            {errorMsg}
          </p>
          <button
            onClick={() => setState('idle')}
            className="text-xs underline"
            style={{ color: 'var(--lithique-warm-white)', opacity: 0.5, cursor: 'pointer', background: 'none', border: 'none' }}
          >
            Try again
          </button>
        </div>
      )}
    </div>
  )
}
