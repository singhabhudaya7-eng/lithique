import { Nav } from '@/components/storefront/Nav'
import { Footer } from '@/components/storefront/Footer'

export default function StorefrontLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Nav />
      <div style={{ paddingTop: 0 }}>{children}</div>
      <Footer />
    </>
  )
}
