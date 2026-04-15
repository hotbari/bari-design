'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Dialog.module.css'

interface DialogProps {
  open: boolean
  title: string
  body: React.ReactNode
  footer: React.ReactNode
  onClose: () => void
}

export function Dialog({ open, title, body, footer, onClose }: DialogProps) {
  const cancelRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => cancelRef.current?.focus())
    }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <div className={styles.backdrop} onClick={onClose} aria-hidden="false">
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="dialog-title"
        className={styles.dialog}
        onClick={e => e.stopPropagation()}
      >
        <h2 id="dialog-title" className={styles.title}>{title}</h2>
        <div className={styles.body}>{body}</div>
        <div className={styles.footer}>
          {/* cancelRef is injected via cloneElement pattern — pass ref down */}
          {footer}
        </div>
      </div>
    </div>,
    document.body,
  )
}
