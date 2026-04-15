'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './page.module.css'

interface MediaGroup {
  id: string
  name: string
  mediaIds: string[]
}

interface MediaItem {
  id: string
  name: string
  address: string
  status: string
}

async function fetchGroups(): Promise<{ groups: MediaGroup[] }> {
  const res = await fetch('/api/media/groups')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

async function fetchMedia(): Promise<MediaItem[]> {
  const res = await fetch('/api/media')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const STATUS_DOT: Record<string, string> = { online: 'online', error: 'error', delayed: 'delayed' }

const SAMPLE_GROUPS: MediaGroup[] = [
  { id: 'g1', name: '강남 지역', mediaIds: ['m1'] },
  { id: 'g2', name: '홍대 지역', mediaIds: ['m2'] },
]

export default function MediaGroupsPage() {
  const { data: groupData } = useQuery({ queryKey: ['media-groups'], queryFn: fetchGroups })
  const { data: mediaList = [] } = useQuery({ queryKey: ['media'], queryFn: fetchMedia })
  const groups = groupData?.groups?.length ? groupData.groups : SAMPLE_GROUPS
  const [selectedId, setSelectedId] = useState(groups[0]?.id ?? '')
  const [localGroups, setLocalGroups] = useState(groups)
  const [newGroupName, setNewGroupName] = useState('')
  const [adding, setAdding] = useState(false)

  const selectedGroup = localGroups.find(g => g.id === selectedId)
  const assignedIds = new Set(selectedGroup?.mediaIds ?? [])
  const assignedMedia = mediaList.filter(m => assignedIds.has(m.id))
  const unassignedMedia = mediaList.filter(m => !assignedIds.has(m.id))

  function toggleMedia(mediaId: string, assigned: boolean) {
    setLocalGroups(gs => gs.map(g => {
      if (g.id !== selectedId) return g
      const ids = assigned
        ? g.mediaIds.filter(id => id !== mediaId)
        : [...g.mediaIds, mediaId]
      return { ...g, mediaIds: ids }
    }))
  }

  function addGroup() {
    if (!newGroupName.trim()) return
    const ng: MediaGroup = { id: `g${Date.now()}`, name: newGroupName.trim(), mediaIds: [] }
    setLocalGroups(gs => [...gs, ng])
    setSelectedId(ng.id)
    setNewGroupName('')
    setAdding(false)
  }

  function deleteGroup() {
    setLocalGroups(gs => gs.filter(g => g.id !== selectedId))
    setSelectedId(localGroups[0]?.id ?? '')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>매체 그룹</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>매체 그룹</h1>
        </div>

        <div className={styles.panels}>
          {/* Left panel */}
          <div className={styles.leftPanel}>
            <div className={styles.panelHeader}>
              <span className={styles.panelTitle}>그룹 목록</span>
              <button className={styles.btnAdd} onClick={() => setAdding(true)}>+ 새 그룹</button>
            </div>
            <div className={styles.groupList}>
              {localGroups.map(g => (
                <div
                  key={g.id}
                  className={`${styles.groupItem} ${g.id === selectedId ? styles.groupItemActive : ''}`}
                  onClick={() => setSelectedId(g.id)}
                >
                  <span className={styles.groupName}>{g.name}</span>
                  <span className={styles.groupCount}>{g.mediaIds.length}</span>
                </div>
              ))}
              {adding && (
                <div className={styles.addForm}>
                  <input
                    className={styles.addInput}
                    placeholder="그룹명 입력 후 Enter"
                    value={newGroupName}
                    onChange={e => setNewGroupName(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') addGroup(); if (e.key === 'Escape') setAdding(false) }}
                    autoFocus
                  />
                </div>
              )}
            </div>
          </div>

          {/* Right panel */}
          <div className={styles.rightPanel}>
            {selectedGroup ? (
              <>
                <div className={styles.panelHeader}>
                  <input className={styles.groupNameInput} defaultValue={selectedGroup.name} />
                  <button className={styles.btnDelete} onClick={deleteGroup}>삭제</button>
                  <button className={styles.btnSave}>저장</button>
                </div>

                <div className={styles.mediaSection}>
                  <h3 className={styles.sectionTitle}>배정된 매체 ({assignedMedia.length})</h3>
                  {assignedMedia.map(m => (
                    <label key={m.id} className={styles.mediaItem}>
                      <input type="checkbox" defaultChecked onChange={() => toggleMedia(m.id, true)} />
                      <span className={`${styles.dot} ${styles[`dot_${STATUS_DOT[m.status] ?? 'offline'}`]}`} />
                      <span className={styles.mediaName}>{m.name}</span>
                      <span className={styles.mediaAddr}>{m.address}</span>
                    </label>
                  ))}
                  {assignedMedia.length === 0 && <p className={styles.emptyHint}>배정된 매체가 없습니다</p>}
                </div>

                <div className={styles.mediaSection}>
                  <h3 className={styles.sectionTitle}>미배정 매체 ({unassignedMedia.length})</h3>
                  {unassignedMedia.map(m => (
                    <label key={m.id} className={styles.mediaItem}>
                      <input type="checkbox" onChange={() => toggleMedia(m.id, false)} />
                      <span className={`${styles.dot} ${styles[`dot_${STATUS_DOT[m.status] ?? 'offline'}`]}`} />
                      <span className={styles.mediaName}>{m.name}</span>
                      <span className={styles.mediaAddr}>{m.address}</span>
                    </label>
                  ))}
                </div>
              </>
            ) : (
              <div className={styles.emptyPanel}>그룹을 선택하거나 새로 추가하세요</div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}
