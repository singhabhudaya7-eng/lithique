interface GoldDividerProps {
  className?: string
  opacity?: number
}

export function GoldDivider({ className = '', opacity = 0.25 }: GoldDividerProps) {
  return (
    <div
      className={className}
      style={{
        width: '100%',
        height: '1px',
        background: 'var(--lithique-gold)',
        opacity,
      }}
    />
  )
}
