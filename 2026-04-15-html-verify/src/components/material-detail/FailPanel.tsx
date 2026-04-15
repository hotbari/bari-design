'use client'
import styles from './FailPanel.module.css'

interface Props {
  failReason: string
  fixGuide: string
}

export function FailPanel({ failReason, fixGuide }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(fixGuide)
  }

  return (
    <div className={styles.panel} role="alert">
      <div>
        <div className={styles.reasonLabel}>실패 사유</div>
        <div className={styles.reasonText}>{failReason}</div>
      </div>
      <div>
        <div className={styles.guideLabel}>수정 가이드</div>
        <div className={styles.guideText}>{fixGuide}</div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnCopy} onClick={handleCopy}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          수정 가이드 복사
        </button>
        <button className={styles.btnReupload}>재업로드</button>
      </div>
    </div>
  )
}
