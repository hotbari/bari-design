import { MaterialDetail } from '@/types/material'
import styles from './PreviewCard.module.css'

interface Props {
  material: Pick<MaterialDetail, 'name' | 'filename' | 'codec' | 'framerate' | 'fileSize' | 'duration'>
  onDelete: () => void
  onReplace: () => void
}

export function PreviewCard({ material, onDelete, onReplace }: Props) {
  return (
    <div className={styles.card}>
      <div
        className={styles.videoArea}
        role="img"
        aria-label={`${material.name} 소재 미리보기 (16:9)`}
      >
        <button className={styles.playBtn} aria-hidden="true" tabIndex={-1}>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <div className={styles.duration} aria-hidden="true">{material.duration}</div>
      </div>

      <div className={styles.metaList}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>파일명</span>
          <span className={`${styles.metaVal} ${styles.mono}`}>{material.filename}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>코덱</span>
          <span className={styles.metaVal}>{material.codec}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>프레임레이트</span>
          <span className={styles.metaVal}>{material.framerate}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>파일 크기</span>
          <span className={styles.metaVal}>{material.fileSize}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }} onClick={onReplace}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
            <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
          </svg>
          교체
        </button>
        <button className="btn btn-danger" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }} onClick={onDelete}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
          삭제
        </button>
      </div>
    </div>
  )
}
