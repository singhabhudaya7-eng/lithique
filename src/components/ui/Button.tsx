import { ButtonHTMLAttributes, forwardRef } from 'react'

type Variant = 'gold-outline' | 'ghost' | 'obsidian'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
}

const styles: Record<Variant, React.CSSProperties> = {
  'gold-outline': {
    padding: '12px 32px',
    border: '1px solid var(--lithique-gold)',
    color: 'var(--lithique-gold)',
    background: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '11px',
    letterSpacing: 'var(--tracking-luxury)',
    cursor: 'pointer',
    transition: 'var(--transition-relic)',
  },
  ghost: {
    padding: '12px 32px',
    border: '1px solid rgba(250,247,242,0.2)',
    color: 'var(--lithique-warm-white)',
    background: 'transparent',
    fontFamily: 'var(--font-sans)',
    fontSize: '11px',
    letterSpacing: 'var(--tracking-luxury)',
    cursor: 'pointer',
    transition: 'var(--transition-relic)',
  },
  obsidian: {
    padding: '12px 32px',
    border: '1px solid var(--lithique-gold)',
    color: 'var(--lithique-obsidian)',
    background: 'var(--lithique-gold)',
    fontFamily: 'var(--font-sans)',
    fontSize: '11px',
    letterSpacing: 'var(--tracking-luxury)',
    cursor: 'pointer',
    transition: 'var(--transition-relic)',
  },
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'gold-outline', style, children, ...props }, ref) => (
    <button ref={ref} style={{ ...styles[variant], ...style }} {...props}>
      {children}
    </button>
  )
)

Button.displayName = 'Button'
