'use client'
import { useEffect, useState } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(process.env.NODE_ENV !== 'development')

  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser')
        .then(({ browser }) => browser.start({ onUnhandledRequest: 'bypass' }))
        .then(() => setReady(true))
    }
  }, [])

  if (!ready) return null

  return <>{children}</>
}
