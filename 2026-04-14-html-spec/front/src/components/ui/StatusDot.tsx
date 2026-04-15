import type { MediaStatus } from '@/types/media'
import styles from './StatusDot.module.css'

const LABEL_MAP: Record<MediaStatus, string> = {
  online: '온라인',
  delayed: '지연',
  error: '이상',
  offline: '오프라인',
  inactive: '비활성',
  unlinked: '미연동',
}

interface StatusDotProps {
  status: MediaStatus
  size?: 'sm' | 'md'
  showLabel?: boolean
}

export function StatusDot({ status, size = 'md', showLabel = false }: StatusDotProps) {
  const dot = (
    <span
      className={`${styles.dot} ${styles[size]} ${styles[status]}`}
      aria-hidden="true"
    />
  )

  if (!showLabel) return dot

  return (
    <span className={styles.wrap}>
      {dot}
      <span className={styles[`label-${status}`]}>{LABEL_MAP[status]}</span>
    </span>
  )
}
