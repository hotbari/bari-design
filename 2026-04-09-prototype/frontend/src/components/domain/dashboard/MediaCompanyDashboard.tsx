'use client'
import { useMedia } from '@/hooks/media/useMedia'
import { useSlotRemaining } from '@/hooks/schedules/useSlotRemaining'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function MediaCompanyDashboard() {
  const { data: media } = useMedia()
  const { data: slots } = useSlotRemaining()

  const totalMedia = media?.length ?? 0
  const maintenanceMedia = media?.filter((m) => m.status === 'maintenance').length ?? 0
  const avgUsage = slots && slots.length > 0
    ? Math.round(slots.reduce((sum, s) => sum + (s.usedSlots / s.totalSlots) * 100, 0) / slots.length)
    : 0

  return (
    <div className={styles.grid}>
      <DashboardCard label="총 매체 수" value={totalMedia} />
      <DashboardCard label="점검중 매체" value={maintenanceMedia} accent={maintenanceMedia > 0} />
      <DashboardCard label="평균 슬롯 사용률" value={`${avgUsage}%`} sub="전체 매체 기준" />
    </div>
  )
}
