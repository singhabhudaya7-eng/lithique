import { HTMLAttributes } from 'react'

type TypographyProps = HTMLAttributes<HTMLElement>

export function Display({ children, style, ...props }: TypographyProps) {
  return (
    <h1
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(3rem, 7vw, 5rem)',
        fontWeight: 400,
        color: 'var(--lithique-warm-white)',
        lineHeight: 1.05,
        letterSpacing: '-0.01em',
        ...style,
      }}
      {...props}
    >
      {children}
    </h1>
  )
}

export function Heading({ children, style, ...props }: TypographyProps) {
  return (
    <h2
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(2rem, 4vw, 3rem)',
        fontWeight: 400,
        color: 'var(--lithique-warm-white)',
        lineHeight: 1.1,
        ...style,
      }}
      {...props}
    >
      {children}
    </h2>
  )
}

export function Subheading({ children, style, ...props }: TypographyProps) {
  return (
    <h3
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: 'clamp(1.25rem, 2.5vw, 2rem)',
        fontWeight: 400,
        color: 'var(--lithique-warm-white)',
        lineHeight: 1.2,
        ...style,
      }}
      {...props}
    >
      {children}
    </h3>
  )
}

export function Body({ children, style, ...props }: TypographyProps) {
  return (
    <p
      style={{
        fontFamily: 'var(--font-serif)',
        fontSize: '1.125rem',
        lineHeight: 1.7,
        color: 'var(--lithique-warm-white)',
        ...style,
      }}
      {...props}
    >
      {children}
    </p>
  )
}

export function Caption({ children, style, ...props }: TypographyProps) {
  return (
    <span
      style={{
        fontFamily: 'var(--font-sans)',
        fontSize: '11px',
        letterSpacing: 'var(--tracking-luxury)',
        color: 'var(--lithique-warm-white)',
        textTransform: 'uppercase' as const,
        ...style,
      }}
      {...props}
    >
      {children}
    </span>
  )
}
