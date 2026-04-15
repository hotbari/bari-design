'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import type { PlaylistItem } from '@/types/playlist'
import styles from './PlaylistEditor.module.css'

interface PlaylistEditorProps {
  initialItems: PlaylistItem[]
  onSave: (items: PlaylistItem[]) => Promise<void>
}

export function PlaylistEditor({ initialItems, onSave }: PlaylistEditorProps) {
  const [items, setItems] = useState(initialItems)
  const [saving, setSaving] = useState(false)

  const moveUp = (i: number) => {
    if (i === 0) return
    const next = [...items]
    ;[next[i - 1], next[i]] = [next[i], next[i - 1]]
    setItems(next.map((it, idx) => ({ ...it, order: idx + 1 })))
  }
  const moveDown = (i: number) => {
    if (i === items.length - 1) return
    const next = [...items]
    ;[next[i], next[i + 1]] = [next[i + 1], next[i]]
    setItems(next.map((it, idx) => ({ ...it, order: idx + 1 })))
  }
  const remove = (i: number) => {
    setItems(items.filter((_, idx) => idx !== i).map((it, idx) => ({ ...it, order: idx + 1 })))
  }
  const totalDuration = items.reduce((s, it) => s + it.duration, 0)
  const formatDuration = (s: number) => `${Math.floor(s / 60)}분 ${s % 60}초`

  const handleSave = async () => {
    setSaving(true)
    try { await onSave(items) } finally { setSaving(false) }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <span className={styles.count}>{items.length}개 소재</span>
        <span className={styles.total}>총 재생시간: {formatDuration(totalDuration)}</span>
      </div>
      {items.length === 0 ? (
        <p className={styles.empty}>소재가 없습니다.</p>
      ) : (
        <div className={styles.list}>
          {items.map((item, i) => (
            <div key={item.materialId} className={styles.item}>
              <span className={styles.order}>{item.order}</span>
              <div className={styles.info}>
                <div className={styles.itemName}>{item.materialName}</div>
                <div className={styles.duration}>{item.duration}초</div>
              </div>
              <div className={styles.actions}>
                <button className={styles.btn} onClick={() => moveUp(i)} disabled={i === 0} title="위로">▲</button>
                <button className={styles.btn} onClick={() => moveDown(i)} disabled={i === items.length - 1} title="아래로">▼</button>
                <button className={`${styles.btn} ${styles.remove}`} onClick={() => remove(i)} title="삭제">✕</button>
              </div>
            </div>
          ))}
        </div>
      )}
      <div className={styles.footer}>
        <Button onClick={handleSave} disabled={saving}>저장</Button>
      </div>
    </div>
  )
}
