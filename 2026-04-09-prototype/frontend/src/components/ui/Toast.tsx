import styles from './Toast.module.css'
import type { Toast as ToastType } from '@/stores/toast'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <div className={[styles.toast, styles[toast.type]].join(' ')} role="alert" aria-live="polite">
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.close}
        onClick={() => onClose(toast.id)}
        aria-label="알림 닫기"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 3l10 10M13 3L3 13"/>
        </svg>
      </button>
    </div>
  )
}
