'use client'
import { useState, useEffect } from 'react'
import { useQuery, useMutation } from '@tanstack/react-query'
import { useRouter, useParams } from 'next/navigation'
import { PlaylistDetail, PlaylistSlot, PickerMaterial } from '@/types/playlist'
import styles from './page.module.css'

async function fetchPlaylist(id: string): Promise<PlaylistDetail | null> {
  if (id === 'new') return null
  const res = await fetch(`/api/playlists/${id}`)
  if (!res.ok) return null
  return res.json()
}

async function fetchMaterials(): Promise<PickerMaterial[]> {
  const res = await fetch('/api/playlists/materials')
  if (!res.ok) return []
  return res.json()
}

function formatSec(s: number): string {
  if (s === 0) return '-'
  const m = Math.floor(s / 60)
  const sec = s % 60
  return m > 0 ? `${m}분 ${sec}초` : `${sec}초`
}

let idCounter = 1000

export default function PlaylistEditPage() {
  const router = useRouter()
  const params = useParams()
  const id = params.id as string

  const { data: pl } = useQuery({ queryKey: ['playlist', id], queryFn: () => fetchPlaylist(id) })
  const { data: materials = [] } = useQuery({ queryKey: ['playlist-materials'], queryFn: fetchMaterials })

  const [name, setName] = useState('')
  const [slots, setSlots] = useState<PlaylistSlot[]>([])
  const [pickerSearch, setPickerSearch] = useState('')
  const [changed, setChanged] = useState(false)
  const [toastMsg, setToastMsg] = useState('')
  const [dragIdx, setDragIdx] = useState<number | null>(null)

  useEffect(() => {
    if (pl) {
      setName(pl.name)
      setSlots(pl.slots ?? [])
    }
  }, [pl])

  const mutation = useMutation({
    mutationFn: async (body: object) => {
      const res = await fetch(`/api/playlists/${id === 'new' ? '' : id}`, {
        method: id === 'new' ? 'POST' : 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      })
      return res.json()
    },
  })

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  function markChanged() { setChanged(true) }

  function addMaterial(mat: PickerMaterial) {
    idCounter++
    const newSlot: PlaylistSlot = {
      id: `sl-new-${idCounter}`,
      materialId: mat.id,
      materialName: mat.name,
      duration: mat.duration,
      order: slots.length + 1,
      type: 'normal',
    }
    setSlots(prev => [...prev, newSlot])
    markChanged()
    showToast(`'${mat.name}'을 구좌 ${slots.length + 1}에 추가했습니다.`)
  }

  function addDummy() {
    idCounter++
    const newSlot: PlaylistSlot = {
      id: `sl-dummy-${idCounter}`,
      materialId: null,
      materialName: '더미 (스킵)',
      duration: 0,
      order: slots.length + 1,
      type: 'dummy',
    }
    setSlots(prev => [...prev, newSlot])
    markChanged()
  }

  function removeSlot(idx: number) {
    setSlots(prev => prev.filter((_, i) => i !== idx).map((s, i) => ({ ...s, order: i + 1 })))
    markChanged()
  }

  function onDragStart(idx: number) { setDragIdx(idx) }

  function onDrop(targetIdx: number) {
    if (dragIdx === null || dragIdx === targetIdx) return
    setSlots(prev => {
      const next = [...prev]
      const [moved] = next.splice(dragIdx, 1)
      next.splice(targetIdx, 0, moved)
      return next.map((s, i) => ({ ...s, order: i + 1 }))
    })
    setDragIdx(null)
    markChanged()
  }

  function handleSave() {
    const realSlots = slots.filter(s => s.type !== 'dummy' && s.type !== 'deleted')
    if (realSlots.length === 0) { showToast('최소 1개의 소재를 추가해주세요'); return }
    mutation.mutate({ name, slots })
    setChanged(false)
    showToast('재생목록이 저장되었습니다.')
    setTimeout(() => router.push('/playlists'), 1200)
  }

  const totalDuration = slots.reduce((s, sl) => s + sl.duration, 0)
  const realCount = slots.filter(s => s.type === 'normal').length
  const dummyCount = slots.filter(s => s.type === 'dummy').length
  const deletedCount = slots.filter(s => s.type === 'deleted').length

  const filteredMaterials = materials.filter(m =>
    !pickerSearch || m.name.toLowerCase().includes(pickerSearch.toLowerCase())
  )

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <button className={styles.breadcrumbLink} onClick={() => router.push('/playlists')}>재생목록</button>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{name || '새 재생목록'}</span>
        </nav>
      </header>

      <main className={styles.pageContent}>
        <div className={styles.toolbar}>
          <input
            className={styles.nameInput}
            value={name}
            onChange={e => { setName(e.target.value); markChanged() }}
            placeholder="재생목록 이름"
            aria-label="재생목록 이름"
          />
          <div className={styles.toolbarRight}>
            {changed && <span className={styles.unsaved}>저장되지 않은 변경 있음</span>}
            <button className={styles.btnInstant} onClick={() => showToast('재생목록이 편성표에 즉시 반영되었습니다.')}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 2v8M4 7l4 4 4-4"/><path d="M2 13h12"/></svg>
              즉시 반영
            </button>
            <button className={styles.btnSecondary} onClick={() => router.push('/playlists')}>취소</button>
            <button className={styles.btnPrimary} onClick={handleSave}>저장</button>
          </div>
        </div>

        <div className={styles.editArea}>
          {/* Slot canvas */}
          <div className={styles.slotCanvas} aria-label="재생목록 구좌">
            <div className={styles.canvasHeader}>
              <span className={styles.canvasTitle}>구좌 목록</span>
              <span className={styles.slotStats}>
                구좌 {slots.length}개 · 소재 {realCount}개 · 더미 {dummyCount}개
                {deletedCount > 0 ? ` · 삭제됨 ${deletedCount}개` : ''}
                {totalDuration > 0 ? ` · 총 ${formatSec(totalDuration)}` : ''}
              </span>
            </div>

            <div className={styles.slotsContainer}>
              {slots.map((slot, idx) => (
                <div
                  key={slot.id}
                  className={`${styles.slotItem} ${slot.type === 'deleted' ? styles.slotDeleted : ''} ${slot.type === 'dummy' ? styles.slotDummy : ''} ${dragIdx === idx ? styles.slotDragging : ''}`}
                  draggable
                  onDragStart={() => onDragStart(idx)}
                  onDragOver={e => e.preventDefault()}
                  onDrop={() => onDrop(idx)}
                >
                  <div className={styles.dragHandle} aria-hidden="true">
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.5"><circle cx="5.5" cy="5" r="1"/><circle cx="10.5" cy="5" r="1"/><circle cx="5.5" cy="9" r="1"/><circle cx="10.5" cy="9" r="1"/><circle cx="5.5" cy="13" r="1"/><circle cx="10.5" cy="13" r="1"/></svg>
                  </div>
                  <div className={`${styles.slotNum} ${slot.type === 'deleted' ? styles.slotNumDeleted : ''} ${slot.type === 'dummy' ? styles.slotNumDummy : ''}`}>{idx + 1}</div>
                  {slot.type === 'dummy' ? (
                    <div className={styles.thumbDummy}><span>더미</span></div>
                  ) : slot.type === 'deleted' ? (
                    <div className={styles.thumbDeleted}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="var(--color-error-400)" strokeWidth="2" strokeLinecap="round"><path d="M3 3l10 10M13 3L3 13"/></svg>
                    </div>
                  ) : (
                    <div className={styles.slotThumb}>
                      <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1.5"/><polygon points="6,5 12,8 6,11" fill="rgba(255,255,255,0.6)" stroke="none"/></svg>
                    </div>
                  )}
                  <div className={styles.slotInfo}>
                    <div className={`${styles.slotName} ${slot.type !== 'normal' ? styles.slotNameMuted : ''}`}>{slot.materialName}</div>
                    {slot.type === 'normal' && (
                      <div className={styles.slotMeta}>{slot.duration}초</div>
                    )}
                    {slot.type === 'dummy' && (
                      <div className={styles.slotMeta}>재생 시 이 구좌를 건너뜁니다</div>
                    )}
                    {slot.type === 'deleted' && (
                      <div className={styles.slotDeletedLabel}>
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 12v.01"/></svg>
                        소재 삭제됨 — 재생 시 스킵
                      </div>
                    )}
                  </div>
                  <div className={styles.slotActions}>
                    {slot.type === 'deleted' && (
                      <button className={styles.slotBtnReplace} onClick={() => showToast('소재 선택 패널에서 교체할 소재를 선택하세요')}>교체</button>
                    )}
                    <button className={`${styles.slotBtn} ${styles.slotBtnDanger}`} aria-label="구좌 삭제" onClick={() => removeSlot(idx)}>
                      <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><path d="M3 4h10M5 4V2h6v2M6 7v5M10 7v5M4 4l1 10h6l1-10"/></svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.dropZone}>
              소재를 여기에 드래그하거나 오른쪽 패널에서 추가하세요
            </div>
          </div>

          {/* Picker panel */}
          <div className={styles.pickerPanel}>
            <div className={styles.pickerHeader}>
              <div className={styles.pickerTitle}>소재 선택</div>
              <div className={styles.pickerSearch}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
                <input
                  type="search"
                  placeholder="소재명 검색"
                  aria-label="소재 검색"
                  value={pickerSearch}
                  onChange={e => setPickerSearch(e.target.value)}
                />
              </div>
            </div>
            <div className={styles.pickerList}>
              {filteredMaterials.map(mat => (
                <div key={mat.id} className={styles.pickerItem}>
                  <div className={styles.pickerThumb}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5"><rect x="1" y="1" width="14" height="14" rx="1.5"/><polygon points="6,5 12,8 6,11" fill="rgba(255,255,255,0.6)" stroke="none"/></svg>
                  </div>
                  <div className={styles.pickerInfo}>
                    <div className={styles.pickerName}>{mat.name}</div>
                    <div className={styles.pickerMeta}>{mat.duration}초 · {mat.resolution}</div>
                  </div>
                  <button className={styles.pickerAddBtn} aria-label="구좌에 추가" onClick={() => addMaterial(mat)}>
                    <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                  </button>
                </div>
              ))}
              {filteredMaterials.length === 0 && (
                <div className={styles.pickerEmpty}>검색 결과 없음</div>
              )}
            </div>
            <div className={styles.pickerFooter}>
              <button className={styles.addDummyBtn} onClick={addDummy}>+ 더미(스킵) 구좌 추가</button>
            </div>
          </div>
        </div>
      </main>

      {toastMsg && (
        <div className={styles.toast} role="status" aria-live="polite">{toastMsg}</div>
      )}
    </div>
  )
}
