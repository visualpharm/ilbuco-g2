'use client'

import { useEffect } from 'react'
import { ChatWidget } from './chat-widget'

export function ClientLayout({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Remove the attribute after hydration
    document.body.removeAttribute('data-extension-installed')
  }, [])

  return (
    <>
      {children}
      <ChatWidget />
    </>
  )
}
