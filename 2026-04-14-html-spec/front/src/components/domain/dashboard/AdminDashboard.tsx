'use client'

import { useDashboard } from '@/hooks/dashboard/useDashboard'
import type { AdminDashboardData, SystemStatus } from '@/types/dashboard'
import styles from './dashboard.module.css'

const SYS_LABEL: Record<SystemStatus, string> = {
  'sys-ok': '정상',
  'sys-warn': '주의',
  'sys-err': '오류',
}

function formatTimestamp(ts: string) {
  const d = new Date(ts)
  return d.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })
}

export function AdminDashboard() {
  const { data, isLoading } = useDashboard('admin')
  const d = data as AdminDashboardData | undefined

  if (isLoading || !d) return <div className={styles.empty}>로딩 중...</div>

  return (
    <div>
      <div className={styles.grid}>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.totalMedia}</div>
          <div className={styles.statLabel}>전체 매체</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.online}</div>
          <div className={styles.statLabel}>온라인</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.error}</div>
          <div className={styles.statLabel}>이상</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statValue}>{d.stats.campaigns}</div>
          <div className={styles.statLabel}>캠페인</div>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>시스템 현황</div>
        <div className={styles.sysRow}>
          <span className={styles.sysName}>서버</span>
          <span className={`${styles.sysStatus} ${styles[d.systemStatus.server]}`}>
            {SYS_LABEL[d.systemStatus.server]}
          </span>
        </div>
        <div className={styles.sysRow}>
          <span className={styles.sysName}>DB</span>
          <span className={`${styles.sysStatus} ${styles[d.systemStatus.db]}`}>
            {SYS_LABEL[d.systemStatus.db]}
          </span>
        </div>
        <div className={styles.sysRow}>
          <span className={styles.sysName}>배치</span>
          <span className={`${styles.sysStatus} ${styles[d.systemStatus.batch]}`}>
            {SYS_LABEL[d.systemStatus.batch]}
          </span>
        </div>
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>헬스체크 이상 목록</div>
        {d.healthAlerts.length === 0 ? (
          <div className={styles.empty}>이상 없음</div>
        ) : (
          d.healthAlerts.map((alert) => (
            <div key={alert.mediaId} className={styles.alertItem}>
              <div className={styles.alertText}>
                <strong>{alert.mediaName}</strong> — {alert.message}
              </div>
              <div className={styles.alertMeta}>{formatTimestamp(alert.timestamp)}</div>
            </div>
          ))
        )}
      </div>

      <div className={styles.section}>
        <div className={styles.sectionTitle}>최근 알림</div>
        {d.recentNotifications.length === 0 ? (
          <div className={styles.empty}>알림 없음</div>
        ) : (
          d.recentNotifications.map((n) => (
            <div key={n.id} className={styles.notifItem}>
              <span className={styles.notifDot} />
              <span className={styles.notifText}>{n.message}</span>
              <span className={styles.notifTime}>{formatTimestamp(n.timestamp)}</span>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
