'use client'

import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import styles from './Drawer.module.css'

interface DrawerProps {
  open: boolean
  title: string
  onClose: () => void
  footer?: React.ReactNode
  children: React.ReactNode
}

export function Drawer({ open, title, onClose, footer, children }: DrawerProps) {
  const previousFocusRef = useRef<HTMLElement | null>(null)
  const drawerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      requestAnimationFrame(() => {
        const first = drawerRef.current?.querySelector<HTMLElement>(
          'input, select, textarea, button, [tabindex]:not([tabindex="-1"])'
        )
        first?.focus()
      })
    } else {
      document.body.style.overflow = ''
      previousFocusRef.current?.focus()
    }
    return () => { document.body.style.overflow = '' }
  }, [open])

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') onClose()
    if (e.key === 'Tab') {
      const focusable = drawerRef.current?.querySelectorAll<HTMLElement>(
        'input:not([disabled]), select:not([disabled]), textarea:not([disabled]), button:not([disabled]), [tabindex]:not([tabindex="-1"])'
      )
      if (!focusable || focusable.length === 0) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first.focus()
      }
    }
  }

  if (!open || typeof document === 'undefined') return null

  return createPortal(
    <>
      <div className={styles.backdrop} onClick={onClose} aria-hidden="true" />
      <div
        ref={drawerRef}
        role="dialog"
        aria-modal="true"
        aria-label={title}
        className={styles.drawer}
        onKeyDown={handleKeyDown}
      >
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">×</button>
        </div>
        <div className={styles.body}>{children}</div>
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </>,
    document.body,
  )
}
