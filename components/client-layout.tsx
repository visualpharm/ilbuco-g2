'use client'

import { useEffect } from 'react'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove the attribute after hydration
    document.body.removeAttribute('data-extension-installed')
  }, [])

  return <>{children}</>
}
