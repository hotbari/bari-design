'use client'
import { useSlotRemaining } from '@/hooks/schedules/useSlotRemaining'
import styles from '../schedules.module.css'

export default function SlotRemainingPage() {
  const { data: slots, isLoading } = useSlotRemaining()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>잔여 슬롯 현황</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <div className={styles.slotList}>
          {slots?.map((s) => {
            const pct = Math.round((s.usedSlots / s.totalSlots) * 100)
            const barColor = pct >= 90 ? 'var(--color-error-500)' : pct >= 70 ? 'var(--color-warning-500)' : 'var(--color-primary-500)'
            return (
              <div key={s.mediaId} className={styles.slotCard}>
                <div className={styles.slotCardHeader}>
                  <span className={styles.slotName}>{s.mediaName}</span>
                  <span className={styles.slotCount}>잔여 {s.remainingSlots} / {s.totalSlots}</span>
                </div>
                <div className={styles.progressTrack}>
                  <div className={styles.progressFill} style={{ width: `${pct}%`, background: barColor }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
