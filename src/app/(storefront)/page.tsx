import { notFound } from 'next/navigation'

// Homepage is served from src/app/page.tsx — this file resolves to / also
// but is never reached because app/page.tsx takes priority.
// notFound() ensures it fails gracefully if somehow hit.
export default function StorefrontHomePlaceholder() {
  notFound()
}
