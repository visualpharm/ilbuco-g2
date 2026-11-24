import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Salida tardía | IL BUCO',
  robots: { index: false, follow: false },
}

export default function LateCheckoutLayout({ children }: { children: React.ReactNode }) {
  return children
}
