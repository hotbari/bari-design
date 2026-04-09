'use client'
import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      // Dynamic import via variable prevents TypeScript from resolving
      // the module at compile time (mocks/browser is created in Task 4)
      const path = '../mocks/browser'
      import(/* webpackIgnore: true */ path as string).catch(() => {})
    }
  }, [])
  return <>{children}</>
}
