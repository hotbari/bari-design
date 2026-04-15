import type { MediaType } from '@/types/media'
import styles from './TypeChip.module.css'

export function TypeChip({ type }: { type: MediaType }) {
  return (
    <span className={`${styles.chip} ${type === '고정형' ? styles.fixed : styles.mobile}`}>
      {type}
    </span>
  )
}
