'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('../mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' })
    ).finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
