'use client'
import { createPortal } from 'react-dom'
import { useToast } from '@/stores/toast'
import { Toast } from './Toast'

export function ToastContainer() {
  const { toasts, remove } = useToast()

  if (toasts.length === 0) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
      }}
      aria-label="알림 목록"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={remove} />
      ))}
    </div>,
    document.body
  )
}
