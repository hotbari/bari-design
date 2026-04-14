'use client'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { useMaterials } from '@/hooks/materials/useMaterials'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function OpsAgencyDashboard() {
  const { data: schedules } = useSchedules()
  const { data: materials } = useMaterials()

  const pendingSchedules = schedules?.filter((s) => s.status === 'pending').length ?? 0
  const pendingMaterials = materials?.filter((m) => m.reviewStatus === 'pending').length ?? 0
  const rejectedMaterials = materials?.filter((m) => m.reviewStatus === 'rejected').length ?? 0

  return (
    <div className={styles.grid}>
      <DashboardCard label="대기 중 편성" value={pendingSchedules} accent={pendingSchedules > 0} />
      <DashboardCard label="검수 대기 소재" value={pendingMaterials} accent={pendingMaterials > 0} />
      <DashboardCard label="반려된 소재" value={rejectedMaterials} accent={rejectedMaterials > 0} />
    </div>
  )
}
