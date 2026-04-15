'use client'

import { useDashboard } from '@/hooks/dashboard/useDashboard'
import { StatusDot } from '@/components/ui/StatusDot'
import type { MediaCompanyDashboardData } from '@/types/dashboard'
import type { MediaStatus } from '@/types/media'
import styles from './dashboard.module.css'

export function MediaCompanyDashboard() {
  const { data, isLoading } = useDashboard('media-company')
  const d = data as MediaCompanyDashboardData | undefined

  if (isLoading || !d) return <div className={styles.empty}>로딩 중...</div>

  return (
    <div>
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.totalMedia}</div>
          <div className={styles.statLabel}>총 매체</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.online}</div>
          <div className={styles.statLabel}>온라인</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.activeCampaigns}</div>
          <div className={styles.statLabel}>활성 캠페인</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.monthlyImpressions.toLocaleString()}</div>
          <div className={styles.statLabel}>월 노출수</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>최근 매체 현황</div>
        {d.recentMedia.length === 0 ? (
          <div className={styles.empty}>매체 없음</div>
        ) : (
          d.recentMedia.map((m) => (
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
