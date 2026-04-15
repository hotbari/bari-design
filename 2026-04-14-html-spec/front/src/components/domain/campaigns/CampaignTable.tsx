'use client'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import type { Campaign } from '@/types/campaign'
import styles from './CampaignTable.module.css'

const STATUS_LABELS: Record<string, string> = { draft: '초안', running: '집행중', done: '완료', canceled: '취소' }
const TYPE_LABELS: Record<string, string> = { direct: '직접판매', own: '자사광고', filler: '필러', naver: '네이버' }

function formatDate(d: string) { return d.slice(0, 10) }
function dday(end: string) {
  const diff = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `D+${Math.abs(diff)}`
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}
function formatBudget(n?: number) { return n != null ? n.toLocaleString('ko-KR') + '원' : '-' }

export function CampaignTable({ items }: { items: Campaign[] }) {
  const router = useRouter()
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}><span className={styles.count}>총 <strong>{items.length}건</strong></span></div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>캠페인</th><th>유형</th><th>상태</th><th>집행기간</th><th>예산</th><th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6} className={styles.empty}>캠페인이 없습니다.</td></tr>
          ) : items.map(c => (
            <tr key={c.id} className={styles.row} onClick={() => router.push(`/campaigns/${c.id}`)} onKeyDown={e => e.key === 'Enter' && router.push(`/campaigns/${c.id}`)} tabIndex={0} role="row">
              <td>
                <div className={styles.name}>{c.name}</div>
                <div className={styles.sub}>{c.advertiser}</div>
              </td>
              <td><Badge variant={c.type} label={TYPE_LABELS[c.type] ?? c.type} /></td>
              <td><Badge variant={c.status} label={STATUS_LABELS[c.status] ?? c.status} /></td>
              <td>
                <div className={styles.dateRange}>{formatDate(c.startDate)} ~ {formatDate(c.endDate)}</div>
                <div className={styles.sub}>{dday(c.endDate)}</div>
              </td>
              <td className={styles.budget}>{formatBudget(c.budget)}</td>
              <td className={styles.meta}>{formatDate(c.createdAt)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
