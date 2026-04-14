'use client'
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'
import { useMedia } from '@/hooks/media/useMedia'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function AdminDashboard() {
  const { data: campaigns } = useCampaigns()
  const { data: media } = useMedia()
  const { data: schedules } = useSchedules()

  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0
  const activeMedia = media?.filter((m) => m.status === 'active').length ?? 0
  const activeSchedules = schedules?.filter((s) => s.status === 'active').length ?? 0
  const lagSchedules = schedules?.filter((s) => s.syncStatus === 'lag').length ?? 0

  return (
    <div className={styles.grid}>
      <DashboardCard label="운영중 캠페인" value={activeCampaigns} accent />
      <DashboardCard label="운영중 매체" value={activeMedia} />
      <DashboardCard label="활성 편성" value={activeSchedules} />
      <DashboardCard label="동기화 지연" value={lagSchedules} sub="즉시 확인 필요" accent={lagSchedules > 0} />
    </div>
  )
}
