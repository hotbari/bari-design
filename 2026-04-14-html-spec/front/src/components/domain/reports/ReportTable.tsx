'use client'
import { Badge } from '@/components/ui/Badge'
import type { Report } from '@/types/report'
import styles from './ReportTable.module.css'

const STATUS_LABELS: Record<string, string> = { generating: '생성 중', done: '완료', fail: '실패' }
const TYPE_LABELS: Record<string, string> = { campaign: '캠페인 성과', media: '매체 상태', schedule: '편성 현황' }
function formatDate(d: string) { return d.slice(0, 10) }

export function ReportTable({ items }: { items: Report[] }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}><span className={styles.count}>총 <strong>{items.length}개</strong> 리포트</span></div>
      <table className={styles.table}>
        <thead>
          <tr><th>리포트명</th><th>유형</th><th>기간</th><th>생성일</th><th>상태</th><th>액션</th></tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6} className={styles.empty}>리포트가 없습니다.</td></tr>
          ) : items.map(r => (
            <tr key={r.id} className={styles.row}>
              <td className={styles.name}>{r.name}</td>
              <td className={styles.meta}>{TYPE_LABELS[r.type] ?? r.type}</td>
              <td className={styles.meta}>{formatDate(r.startDate)} ~ {formatDate(r.endDate)}</td>
              <td className={styles.meta}>{formatDate(r.createdAt)}</td>
              <td><Badge variant={r.status} label={STATUS_LABELS[r.status] ?? r.status} /></td>
              <td>
                {r.status === 'done' && r.downloadUrl && (
                  <a href={r.downloadUrl} className={styles.dlBtn} download>다운로드</a>
                )}
                {r.status === 'fail' && (
                  <button className={styles.retryBtn}>재시도</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
