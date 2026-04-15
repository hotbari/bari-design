'use client'
import { useEffect, useRef } from 'react'
import styles from './DeleteModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  playlistCount: number
}

export function DeleteModal({ isOpen, onClose, onConfirm, playlistCount }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    confirmRef.current?.focus()

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
      aria-hidden={!isOpen}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-modal-title"
      >
        <div className={styles.title} id="delete-modal-title">소재 삭제</div>
        <div className={styles.body}>
          이 소재를 삭제하시겠습니까?<br/><br/>
          <strong>재생목록 {playlistCount}건에서 해당 구좌가 &apos;삭제됨&apos;으로 표시됩니다.</strong><br/>
          삭제된 소재는 복구할 수 없습니다.
        </div>
        <div className={styles.actions}>
          <button className="btn btn-secondary" onClick={onClose}>취소</button>
          <button
            className={styles.btnDestructive}
            ref={confirmRef}
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
