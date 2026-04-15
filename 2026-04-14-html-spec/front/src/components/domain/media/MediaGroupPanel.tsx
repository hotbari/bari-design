'use client'

import { useState, useRef } from 'react'
import { StatusDot } from '@/components/ui/StatusDot'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useMediaGroups, useCreateMediaGroup, useUpdateMediaGroup, useDeleteMediaGroup } from '@/hooks/media/useMediaGroups'
import { useToast } from '@/components/ui/Toast'
import type { Media, MediaGroup, MediaStatus } from '@/types/media'
import styles from './MediaGroupPanel.module.css'

const GROUP_DOT_STATUSES: MediaStatus[] = ['online', 'error', 'delayed']

export function MediaGroupPanel() {
  const { data } = useMediaGroups()
  const createGroup = useCreateMediaGroup()
  const deleteGroup = useDeleteMediaGroup()
  const { show } = useToast()

  const [selectedId, setSelectedId] = useState<string | null>(null)
  const [addingGroup, setAddingGroup] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<MediaGroup | null>(null)
  const addInputRef = useRef<HTMLInputElement>(null)

  const groups = data?.groups || []
  const allMedia = [...(data?.groups.flatMap(g => {
    // we need all media from fixture; reconstruct from unassigned + assigned
    return []
  }) || []), ...(data?.unassigned || [])]

  // Build full media map from unassigned + find assigned from their IDs
  const unassigned = data?.unassigned || []
  const selectedGroup = groups.find(g => g.id === selectedId)

  const handleAddGroup = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newGroupName.trim()) return
    await createGroup.mutateAsync(newGroupName.trim())
    setNewGroupName('')
    setAddingGroup(false)
    show('그룹이 생성되었습니다.')
  }

  const handleInlineKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setAddingGroup(false)
      setNewGroupName('')
    }
  }

  const handleStartAdd = () => {
    setAddingGroup(true)
    setTimeout(() => addInputRef.current?.focus(), 50)
  }

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return
    await deleteGroup.mutateAsync(deleteTarget.id)
    if (selectedId === deleteTarget.id) setSelectedId(null)
    setDeleteTarget(null)
    show('그룹이 삭제되었습니다.')
  }

  return (
    <>
      <div className={styles.panels}>
        {/* 좌측: 그룹 목록 */}
        <div className={styles.leftPanel}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>그룹 목록</div>
            {!addingGroup && (
              <button className={styles.addGroupBtn} onClick={handleStartAdd}>
                + 새 그룹 추가
              </button>
            )}
            {addingGroup && (
              <form className={styles.inlineForm} onSubmit={handleAddGroup}>
                <input
                  ref={addInputRef}
                  className={styles.inlineInput}
                  value={newGroupName}
                  onChange={e => setNewGroupName(e.target.value)}
                  onKeyDown={handleInlineKeyDown}
                  placeholder="그룹명 입력"
                  autoFocus
                />
                <button type="submit" className={styles.inlineSubmitBtn}>저장</button>
              </form>
            )}
          </div>
          <div className={styles.groupList}>
            {groups.map(g => {
              // dots: show status of assigned media (online/error/delayed only)
              const assignedInUnassigned = unassigned.filter(m => g.assignedMediaIds.includes(m.id))
              const dotStatuses = assignedInUnassigned
                .map(m => m.status)
                .filter(s => GROUP_DOT_STATUSES.includes(s as MediaStatus))
                .slice(0, 3) as MediaStatus[]

              return (
                <div
                  key={g.id}
                  className={`${styles.groupItem} ${selectedId === g.id ? styles.selected : ''}`}
                  onClick={() => setSelectedId(g.id)}
                >
                  <div className={styles.groupDots}>
                    {dotStatuses.map((s, i) => <StatusDot key={i} status={s} size="sm" />)}
                  </div>
                  <span className={styles.groupName}>{g.name}</span>
                  <span style={{ fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-400)' }}>
                    {g.assignedMediaIds.length}개
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* 우측: 그룹 상세 */}
        <div className={styles.rightPanel}>
          {!selectedGroup ? (
            <div className={styles.emptyPanel}>
              <span>좌측에서 그룹을 선택하세요</span>
            </div>
          ) : (
            <GroupDetail
              group={selectedGroup}
              unassigned={unassigned}
              allGroups={groups}
              onDelete={() => setDeleteTarget(selectedGroup)}
            />
          )}
        </div>
      </div>

      {/* 삭제 확인 다이얼로그 */}
      <Dialog
        open={!!deleteTarget}
        title="그룹 삭제"
        body={`"${deleteTarget?.name}" 그룹을 삭제하시겠습니까? 이 작업은 되돌릴 수 없습니다.`}
        onClose={() => setDeleteTarget(null)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setDeleteTarget(null)}>취소</Button>
            <Button variant="danger" onClick={handleDeleteConfirm}>삭제</Button>
          </>
        }
      />
    </>
  )
}

function GroupDetail({
  group,
  unassigned,
  allGroups,
  onDelete,
}: {
  group: MediaGroup
  unassigned: Media[]
  allGroups: MediaGroup[]
  onDelete: () => void
}) {
  const { show } = useToast()
  const updateGroup = useUpdateMediaGroup(group.id)
  const [groupName, setGroupName] = useState(group.name)
  const [assignedIds, setAssignedIds] = useState<string[]>(group.assignedMediaIds)

  // All assigned media across all groups (to show in assigned section)
  const assignedMedia = allGroups
    .flatMap(g => g.assignedMediaIds)
    .filter(id => assignedIds.includes(id))

  const handleNameBlur = async () => {
    if (groupName.trim() === group.name) return
    await updateGroup.mutateAsync({ name: groupName.trim() })
    show('그룹명이 수정되었습니다.')
  }

  const toggleAssign = (mediaId: string) => {
    setAssignedIds(prev =>
      prev.includes(mediaId) ? prev.filter(id => id !== mediaId) : [...prev, mediaId]
    )
  }

  const handleSave = async () => {
    await updateGroup.mutateAsync({ name: groupName, assignedMediaIds: assignedIds })
    show('그룹이 저장되었습니다.')
  }

  const assignedMediaList = unassigned.filter(m => assignedIds.includes(m.id))
  const unassignedMediaList = unassigned.filter(m => !assignedIds.includes(m.id))

  return (
    <>
      <div className={styles.rightPanelHeader}>
        <input
          className={styles.groupNameInput}
          value={groupName}
          onChange={e => setGroupName(e.target.value)}
          onBlur={handleNameBlur}
          aria-label="그룹명 편집"
        />
        <div className={styles.rightHeaderActions}>
          <Button variant="secondary" size="sm" onClick={handleSave}>저장</Button>
          <Button variant="dangerGhost" size="sm" onClick={onDelete}>삭제</Button>
        </div>
      </div>
      <div className={styles.rightPanelBody}>
        {/* 배정된 매체 */}
        <div className={styles.mediaSection}>
          <div className={styles.sectionTitle}>배정된 매체 ({assignedMediaList.length})</div>
          {assignedMediaList.length === 0 ? (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-400)' }}>
              배정된 매체가 없습니다.
            </p>
          ) : assignedMediaList.map(m => (
            <MediaCheckItem
              key={m.id}
              media={m}
              checked={true}
              onChange={() => toggleAssign(m.id)}
            />
          ))}
        </div>

        {/* 미배정 매체 */}
        <div className={styles.mediaSection}>
          <div className={styles.sectionTitle}>미배정 매체 ({unassignedMediaList.length})</div>
          {unassignedMediaList.length === 0 ? (
            <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-400)' }}>
              미배정 매체가 없습니다.
            </p>
          ) : unassignedMediaList.map(m => (
            <MediaCheckItem
              key={m.id}
              media={m}
              checked={false}
              onChange={() => toggleAssign(m.id)}
            />
          ))}
        </div>
      </div>
    </>
  )
}

function MediaCheckItem({
  media,
  checked,
  onChange,
}: {
  media: Media
  checked: boolean
  onChange: () => void
}) {
  const showDot = GROUP_DOT_STATUSES.includes(media.status as MediaStatus)

  return (
    <div className={styles.mediaItem}>
      <label>
        <input type="checkbox" checked={checked} onChange={onChange} />
        {showDot && <StatusDot status={media.status} size="sm" />}
        <div>
          <div className={styles.mediaItemName}>{media.name}</div>
          <div className={styles.mediaItemAddr}>{media.location}</div>
        </div>
      </label>
    </div>
  )
}
