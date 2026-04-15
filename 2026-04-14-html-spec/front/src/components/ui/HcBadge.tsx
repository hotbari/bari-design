import type { HcResult } from '@/types/media'
import styles from './HcBadge.module.css'

const LABEL_MAP: Record<HcResult, string> = {
  'hc-ok': '정상',
  'hc-warn': '경고',
  'hc-err': '오류',
}

export function HcBadge({ result }: { result: HcResult }) {
  return (
    <span className={`${styles.badge} ${styles[result]}`}>
      {LABEL_MAP[result]}
    </span>
  )
}
