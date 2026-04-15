'use client'

import { useDashboard } from '@/hooks/dashboard/useDashboard'
import { StatusDot } from '@/components/ui/StatusDot'
import type { OpsAgencyDashboardData } from '@/types/dashboard'
import type { MediaStatus } from '@/types/media'
import styles from './dashboard.module.css'

export function OpsAgencyDashboard() {
  const { data, isLoading } = useDashboard('ops-agency')
  const d = data as OpsAgencyDashboardData | undefined

  if (isLoading || !d) return <div className={styles.empty}>로딩 중...</div>

  return (
    <div>
      <div className={styles.grid3}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.assignedMedia}</div>
          <div className={styles.statLabel}>배정 매체</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.activeCampaigns}</div>
          <div className={styles.statLabel}>활성 캠페인</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.pendingMaterials}</div>
          <div className={styles.statLabel}>검수 대기 소재</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>배정 매체 현황</div>
        {d.assignedMedia.length === 0 ? (
          <div className={styles.empty}>배정 매체 없음</div>
        ) : (
          d.assignedMedia.map((m) => (
            <div key={m.id} className={styles.mediaItem}>
              <StatusDot status={m.status as MediaStatus} />
              <span className={styles.mediaName}>{m.name}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
