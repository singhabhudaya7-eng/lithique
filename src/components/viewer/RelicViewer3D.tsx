'use client'

import { useEffect, useRef } from 'react'

interface RelicViewer3DProps {
  modelUrl: string
  relicName: string
}

export function RelicViewer3D({ modelUrl, relicName }: RelicViewer3DProps) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load model-viewer as a custom element
    import('@google/model-viewer').catch(() => {
      // silently degrade if import fails
    })
  }, [])

  return (
    <div ref={ref} style={{ width: '100%' }}>
      {/* @ts-expect-error — model-viewer is a custom element */}
      <model-viewer
        src={modelUrl}
        alt={`3D model of ${relicName}`}
        camera-controls
        auto-rotate
        auto-rotate-delay="1000"
        rotation-per-second="20deg"
        environment-image="neutral"
        shadow-intensity="1"
        exposure="0.8"
        style={{
          width: '100%',
          aspectRatio: '4/3',
          background: 'var(--lithique-stone-mid)',
          '--progress-bar-color': 'var(--lithique-gold)',
        } as React.CSSProperties}
        camera-orbit="0deg 75deg 105%"
        min-camera-orbit="auto auto 50%"
        max-camera-orbit="auto auto 150%"
      />
      <p
        style={{
          textAlign: 'center',
          fontFamily: 'var(--font-sans)',
          fontSize: '10px',
          letterSpacing: 'var(--tracking-luxury)',
          color: 'var(--lithique-warm-white)',
          opacity: 0.35,
          marginTop: '12px',
          textTransform: 'uppercase',
        }}
      >
        Rotate to observe all facets
      </p>
    </div>
  )
}
