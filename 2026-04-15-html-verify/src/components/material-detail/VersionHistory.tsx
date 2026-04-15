'use client'
import { useState } from 'react'
import { VersionEntry, ReviewStatus } from '@/types/material'
import styles from './VersionHistory.module.css'

const BADGE_CLASS: Record<ReviewStatus, string> = {
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

interface Props {
  versions: VersionEntry[]
}

export function VersionHistory({ versions }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-controls="version-history-body"
      >
        <span className={styles.toggleLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          버전 이력
          <span className={styles.versionCount}>({versions.length}버전)</span>
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div
        className={`${styles.body} ${isOpen ? styles.bodyOpen : ''}`}
        id="version-history-body"
      >
        <div className={styles.bodyInner}>
          <table className={styles.table} aria-label="버전 이력">
            <thead>
              <tr>
                <th scope="col">버전</th>
                <th scope="col">파일명</th>
                <th scope="col">교체일</th>
                <th scope="col">검수 결과</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.version}>
                  <td>
                    <strong>v{v.version}</strong>
                    {v.isCurrent && <span className={styles.current}> (현재)</span>}
                  </td>
                  <td className={styles.mono}>{v.filename}</td>
                  <td className={styles.dateCell}>{v.replacedAt}</td>
                  <td>
                    <span className={`${styles.badge} ${BADGE_CLASS[v.reviewResult]}`}>
                      {REVIEW_LABEL[v.reviewResult]}
                    </span>
                  </td>
                  <td>
                    {v.isCurrent ? (
                      <span>—</span>
                    ) : (
                      <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '3px 10px' }}>
                        되돌리기
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
