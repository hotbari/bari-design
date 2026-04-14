'use client'
import { useSlotRemaining } from '@/hooks/schedules/useSlotRemaining'
import styles from '../schedules.module.css'

export default function SlotRemainingPage() {
  const { data: slots, isLoading } = useSlotRemaining()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>잔여 슬롯 현황</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slots?.map((s) => {
            const pct = Math.round((s.usedSlots / s.totalSlots) * 100)
            const barColor = pct >= 90 ? 'var(--color-error-500)' : pct >= 70 ? 'var(--color-warning-500)' : 'var(--color-primary-500)'
            return (
              <div key={s.mediaId} style={{ padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-neutral-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.mediaName}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                    잔여 {s.remainingSlots} / {s.totalSlots}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
