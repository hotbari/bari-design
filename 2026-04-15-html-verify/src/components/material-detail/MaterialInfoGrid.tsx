import { MaterialDetail, ReviewStatus, ScheduleStatus } from '@/types/material'
import styles from './MaterialInfoGrid.module.css'

const REVIEW_BADGE_CLASS: Record<ReviewStatus, string> = {
  'done':      styles.badgeDone,
  'reviewing': styles.badgeReviewing,
  'failed':    styles.badgeFailed,
  'manual':    styles.badgeManual,
  'on-air':    styles.badgeOnAir,
  'waiting':   styles.badgeWaiting,
}

const REVIEW_LABEL: Record<ReviewStatus, string> = {
  'done': '검수완료', 'reviewing': '검수중', 'failed': '검수실패',
  'manual': '수동승인', 'on-air': '송출중', 'waiting': '대기중',
}

const SCHEDULE_BADGE_CLASS: Record<ScheduleStatus, string> = {
  'on': styles.badgeScheduleOn,
  'wait': styles.badgeScheduleWait,
}

const SCHEDULE_LABEL: Record<ScheduleStatus, string> = { 'on': '송출중', 'wait': '편성대기' }

interface Props {
  material: Pick<MaterialDetail, 'name' | 'advertiser' | 'media' | 'resolution' | 'duration' | 'period' | 'reviewStatus' | 'scheduleConnected'>
}

export function MaterialInfoGrid({ material }: Props) {
  const scheduleStatus: ScheduleStatus = material.scheduleConnected ? 'on' : 'wait'

  return (
    <div>
      <div className={styles.sectionTitle}>소재 정보</div>
      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.label}>소재명</div>
          <div className={styles.value}>{material.name}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>광고주</div>
          <div className={styles.value}>{material.advertiser}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>매체</div>
          <div className={styles.value}>{material.media}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>해상도</div>
          <div className={`${styles.value} ${styles.mono}`}>{material.resolution}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>재생 시간</div>
          <div className={styles.value}>{material.duration}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>운영 기간</div>
          <div className={styles.value}>{material.period}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>검수 상태</div>
          <div className={styles.value}>
            <span className={`${styles.badge} ${REVIEW_BADGE_CLASS[material.reviewStatus]}`} aria-label={REVIEW_LABEL[material.reviewStatus]}>
              {material.reviewStatus === 'done' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {REVIEW_LABEL[material.reviewStatus]}
            </span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>편성 연결</div>
          <div className={styles.value}>
            <span className={`${styles.badge} ${SCHEDULE_BADGE_CLASS[scheduleStatus]}`} aria-label={SCHEDULE_LABEL[scheduleStatus]}>
              {SCHEDULE_LABEL[scheduleStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
