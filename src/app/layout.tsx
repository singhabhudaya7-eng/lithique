import type { Metadata } from 'next'
import { Cormorant_Garamond } from 'next/font/google'
import './globals.css'

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600'],
  style: ['normal', 'italic'],
  variable: '--font-cormorant',
  display: 'swap',
})

export const metadata: Metadata = {
  title: {
    default: 'LITHIQUE BY SHWETA',
    template: '%s — LITHIQUE BY SHWETA',
  },
  description:
    'Stone relics of enduring permanence. Each piece carries its origin, its maker, and its lineage — inscribed not in paper, but in the immutable record of craft.',
  openGraph: {
    siteName: 'LITHIQUE BY SHWETA',
    type: 'website',
    locale: 'en_IN',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={cormorant.variable}>
      <body>{children}</body>
    </html>
  )
}
