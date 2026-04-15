import type { SyncStatus } from '@/types/media'
import styles from './SyncBadge.module.css'

const LABEL_MAP: Record<SyncStatus, string> = {
  synced: '동기화됨',
  delayed: '지연',
  error: '오류',
  pending: '대기중',
}

interface SyncBadgeProps {
  status: SyncStatus | null
}

export function SyncBadge({ status }: SyncBadgeProps) {
  if (status === null) return <span className={styles.none}>—</span>
  return (
    <span className={`${styles.badge} ${styles[status]}`}>
      {LABEL_MAP[status]}
    </span>
  )
}
