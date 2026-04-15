'use client'
import { useRouter } from 'next/navigation'
import { Badge } from '@/components/ui/Badge'
import { SyncBadge } from '@/components/ui/SyncBadge'
import type { Schedule } from '@/types/schedule'
import styles from './ScheduleTable.module.css'

const STATUS_LABELS: Record<string, string> = { active: '적용중', pending: '예약됨', done: '종료' }
const PRIORITY_LABELS: Record<string, string> = { 'prio-1': '1순위', 'prio-2': '2순위', 'prio-3': '3순위' }
const SYNC_MAP: Record<string, 'synced' | 'delayed' | 'error' | 'pending'> = {
  'sync-ok': 'synced', 'sync-lag': 'delayed', 'sync-none': 'pending',
}

function formatDate(d: string) { return d.slice(0, 10) }
function dday(end: string) {
  const diff = Math.ceil((new Date(end).getTime() - Date.now()) / 86400000)
  if (diff < 0) return `D+${Math.abs(diff)}`
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

export function ScheduleTable({ items }: { items: Schedule[] }) {
  const router = useRouter()
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}><span className={styles.count}>총 <strong>{items.length}건</strong></span></div>
      <table className={styles.table}>
        <thead>
          <tr><th>편성표명</th><th>상태</th><th>우선순위</th><th>적용 기간</th><th>재생목록</th><th>연결 캠페인</th><th>동기화</th></tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={7} className={styles.empty}>편성표가 없습니다.</td></tr>
          ) : items.map(s => (
            <tr key={s.id} className={styles.row} onClick={() => router.push(`/schedules/${s.id}/edit`)} onKeyDown={e => e.key === 'Enter' && router.push(`/schedules/${s.id}/edit`)} tabIndex={0} role="row">
              <td className={styles.name}>{s.name}</td>
              <td><Badge variant={s.status} label={STATUS_LABELS[s.status] ?? s.status} /></td>
              <td><Badge variant={s.priority} label={PRIORITY_LABELS[s.priority] ?? s.priority} /></td>
              <td>
                <div className={styles.dateRange}>{formatDate(s.startDate)} ~ {formatDate(s.endDate)}</div>
                <div className={styles.sub}>{dday(s.endDate)}</div>
              </td>
              <td className={styles.meta}>{s.playlistName}</td>
              <td className={styles.meta}>{s.campaignName ?? '-'}</td>
              <td><SyncBadge status={SYNC_MAP[s.syncStatus] ?? null} /></td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
