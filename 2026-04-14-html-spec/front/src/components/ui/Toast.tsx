'use client'

import { createContext, useCallback, useContext, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import styles from './Toast.module.css'

interface ToastItem { id: number; message: string }

interface ToastCtx {
  show: (message: string, duration?: number) => void
}

const ToastContext = createContext<ToastCtx>({ show: () => {} })

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([])
  const counter = useRef(0)

  const show = useCallback((message: string, duration = 2500) => {
    const id = ++counter.current
    setToasts(prev => [...prev, { id, message }])
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id))
    }, duration)
  }, [])

  return (
    <ToastContext.Provider value={{ show }}>
      {children}
      {typeof document !== 'undefined' && createPortal(
        <div className={styles.container} role="status" aria-live="polite">
          {toasts.map(t => (
            <div key={t.id} className={styles.toast}>{t.message}</div>
          ))}
        </div>,
        document.body,
      )}
    </ToastContext.Provider>
  )
}

export function useToast() {
  return useContext(ToastContext)
}
