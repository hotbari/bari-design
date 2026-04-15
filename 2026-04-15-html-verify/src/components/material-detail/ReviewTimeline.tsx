import { TimelineStep, ReviewStatus } from '@/types/material'
import { FailPanel } from './FailPanel'
import styles from './ReviewTimeline.module.css'

interface Props {
  timeline: TimelineStep[]
  reviewStatus: ReviewStatus
  failReason?: string
  fixGuide?: string
}

function TimelineNode({ status }: { status: TimelineStep['status'] }) {
  const nodeClass = {
    done: styles.nodeDone,
    failed: styles.nodeFailed,
    current: styles.nodeCurrent,
    waiting: styles.nodeWaiting,
    pending: styles.nodePending,
  }[status]

  return (
    <div className={`${styles.node} ${nodeClass}`} aria-hidden="true">
      {status === 'done' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {status === 'failed' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
      {status === 'current' && <div className={styles.spinner}/>}
    </div>
  )
}

export function ReviewTimeline({ timeline, reviewStatus, failReason, fixGuide }: Props) {
  return (
    <div>
      <div className={styles.sectionTitle}>검수 타임라인</div>
      <div className={styles.timeline} role="list" aria-label="검수 진행 타임라인">
        <div className={styles.timelineLine} aria-hidden="true"/>
        {timeline.map((step, i) => (
          <div key={i} className={styles.step} role="listitem">
            <TimelineNode status={step.status}/>
            <div className={styles.content}>
              <div className={`${styles.label} ${step.status === 'failed' ? styles.labelFailed : ''} ${step.status === 'pending' || step.status === 'waiting' ? styles.labelFaded : ''}`}>
                {step.label}
                {step.elapsed && <span className={styles.elapsed}>({step.elapsed})</span>}
              </div>
              {step.time && <div className={styles.time}>{step.time}</div>}
              {step.status === 'failed' && failReason && fixGuide && (
                <FailPanel failReason={failReason} fixGuide={fixGuide}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
