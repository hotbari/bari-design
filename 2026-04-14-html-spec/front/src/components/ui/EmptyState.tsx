import styles from './EmptyState.module.css'

interface EmptyStateProps { message?: string }

export function EmptyState({ message = '데이터가 없습니다.' }: EmptyStateProps) {
  return <div className={styles.wrap}><p className={styles.msg}>{message}</p></div>
}
