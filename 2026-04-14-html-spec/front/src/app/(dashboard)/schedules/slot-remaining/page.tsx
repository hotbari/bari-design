'use client'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { useSlotRemaining } from '@/hooks/schedules/useSchedules'
import styles from './slot-remaining.module.css'

const BREADCRUMBS = [{ label: '편성 관리' }, { label: '잔여 구좌' }]

function pctClass(pct: number) {
  if (pct < 20) return styles.low
  if (pct < 50) return styles.mid
  return styles.high
}

export default function SlotRemainingPage() {
  const { data: items = [], isLoading } = useSlotRemaining()

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="잔여 구좌" desc="매체별 오늘 잔여 편성 슬롯 현황입니다." />
      {isLoading ? <p>로딩 중...</p> : (
        <div className={styles.wrap}>
          <table className={styles.table}>
            <thead>
              <tr><th>매체</th><th>날짜</th><th>전체 구좌</th><th>사용</th><th>잔여</th><th>잔여율</th></tr>
            </thead>
            <tbody>
              {items.map((s: { mediaId: string; mediaName: string; date: string; totalSlots: number; usedSlots: number; remainingSlots: number; remainingPct: number }) => (
                <tr key={s.mediaId}>
                  <td className={styles.name}>{s.mediaName}</td>
                  <td className={styles.meta}>{s.date}</td>
                  <td className={styles.meta}>{s.totalSlots}</td>
                  <td className={styles.meta}>{s.usedSlots}</td>
                  <td className={styles.meta}>{s.remainingSlots}</td>
                  <td>
                    <div className={styles.pctCell}>
                      <span className={`${styles.pct} ${pctClass(s.remainingPct)}`}>{s.remainingPct}%</span>
                      <div className={styles.bar}>
                        <div className={`${styles.barFill} ${pctClass(s.remainingPct)}`} style={{ width: `${s.remainingPct}%` }} />
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </AppShell>
  )
}
