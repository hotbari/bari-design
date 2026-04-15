'use client'
import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Notification, NotifCategory, NotifPriority } from '@/types/notification'
import styles from './page.module.css'

async function fetchNotifications(): Promise<Notification[]> {
  const res = await fetch('/api/notifications')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

async function markRead(id: string) {
  const res = await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
  if (!res.ok) throw new Error('failed')
  return res.json()
}

async function markAllRead() {
  const res = await fetch('/api/notifications/read-all', { method: 'POST' })
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const TAB_LABELS: { value: NotifCategory; label: string }[] = [
  { value: 'all', label: '전체' },
  { value: 'critical', label: '긴급' },
  { value: 'schedule', label: '편성' },
  { value: 'campaign', label: '캠페인' },
  { value: 'system', label: '시스템' },
]

const PRIORITY_ICON: Record<NotifPriority, React.ReactNode> = {
  critical: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 1L1 14h14L8 1z"/><path d="M8 6v4M8 11.5v.5"/></svg>,
  warning: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 10.5v.5"/></svg>,
  info: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="8" cy="8" r="7"/><path d="M8 7v5M8 5v.5"/></svg>,
  success: <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="8" cy="8" r="7"/><path d="M5 8l2 2 4-4"/></svg>,
}

const TAG_LABEL: Record<string, string> = {
  critical: '긴급',
  schedule: '편성',
  campaign: '캠페인',
  system: '시스템',
}

export default function NotificationsPage() {
  const router = useRouter()
  const qc = useQueryClient()
  const { data = [], isLoading } = useQuery({ queryKey: ['notifications'], queryFn: fetchNotifications })
  const [activeTab, setActiveTab] = useState<NotifCategory>('all')
  const [selected, setSelected] = useState<Notification | null>(null)
  const [dismissed, setDismissed] = useState<Set<string>>(new Set())
  const [localRead, setLocalRead] = useState<Set<string>>(new Set())

  const readMutation = useMutation({
    mutationFn: markRead,
    onSuccess: (_, id) => {
      setLocalRead(prev => new Set([...prev, id]))
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  const readAllMutation = useMutation({
    mutationFn: markAllRead,
    onSuccess: () => {
      const allIds = data.map(n => n.id)
      setLocalRead(new Set(allIds))
      qc.invalidateQueries({ queryKey: ['notifications'] })
    },
  })

  function isRead(n: Notification) {
    return n.read || localRead.has(n.id)
  }

  const visible = data.filter(n => {
    if (dismissed.has(n.id)) return false
    if (activeTab === 'all') return true
    return n.type === activeTab
  })

  const unreadCount = data.filter(n => !n.read && !localRead.has(n.id) && !dismissed.has(n.id)).length

  const unreadItems = visible.filter(n => !isRead(n))
  const readItems = visible.filter(n => isRead(n))

  function handleNotifClick(n: Notification) {
    setSelected(n)
    if (!isRead(n)) {
      readMutation.mutate(n.id)
    }
  }

  function dismiss(e: React.MouseEvent, id: string) {
    e.stopPropagation()
    setDismissed(prev => new Set([...prev, id]))
    if (selected?.id === id) setSelected(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbCurrent}>알림 센터</span>
        </nav>
        <button className={`${styles.gnbBell} ${unreadCount > 0 ? styles.gnbBellActive : ''}`} aria-label="알림">
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
          {unreadCount > 0 && <span className={styles.notifBadge} aria-label={`읽지 않은 알림 ${unreadCount}개`}>{unreadCount}</span>}
        </button>
      </header>

      <div className={styles.pageBody}>
        {/* Left: notification list */}
        <div className={styles.pageList}>
          <div className={styles.panelHeader}>
            <div className={styles.panelTitle}>알림</div>
            <div className={styles.panelHeaderActions}>
              <button
                className={styles.markAllBtn}
                onClick={() => readAllMutation.mutate()}
                disabled={readAllMutation.isPending}
              >
                모두 읽음 처리
              </button>
            </div>
          </div>

          <div className={styles.filterTabs} role="tablist" aria-label="알림 필터">
            {TAB_LABELS.map(tab => {
              const count = tab.value === 'all'
                ? data.filter(n => !n.read && !localRead.has(n.id) && !dismissed.has(n.id)).length
                : tab.value === 'critical'
                ? data.filter(n => n.type === 'critical' && !n.read && !localRead.has(n.id) && !dismissed.has(n.id)).length
                : 0
              return (
                <button
                  key={tab.value}
                  className={`${styles.filterTab} ${activeTab === tab.value ? styles.filterTabActive : ''}`}
                  role="tab"
                  aria-selected={activeTab === tab.value}
                  onClick={() => setActiveTab(tab.value)}
                >
                  {tab.label}
                  {count > 0 && (
                    <span className={`${styles.tabCount} ${tab.value === 'critical' ? styles.tabCountCritical : ''}`}>
                      {count}
                    </span>
                  )}
                </button>
              )
            })}
          </div>

          <div className={styles.notifList} id="notif-list">
            {isLoading ? (
              <div className={styles.emptyState}>
                <p className={styles.emptyTitle}>로딩 중...</p>
              </div>
            ) : visible.length === 0 ? (
              <div className={styles.emptyState}>
                <svg viewBox="0 0 40 40" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><path d="M20 4a12 12 0 0 1 12 12v6l3 4H5l3-4v-6a12 12 0 0 1 12-12z"/><path d="M16 34a4 4 0 0 0 8 0"/></svg>
                <p className={styles.emptyTitle}>알림이 없습니다</p>
                <p className={styles.emptyDesc}>선택한 카테고리에 알림이 없습니다.</p>
              </div>
            ) : (
              <>
                {unreadItems.length > 0 && (
                  <div className={styles.notifSection}>
                    <div className={styles.sectionLabel}>읽지 않음</div>
                    {unreadItems.map(n => (
                      <NotifItem key={n.id} n={n} read={false} selected={selected?.id === n.id} onClick={() => handleNotifClick(n)} onDismiss={e => dismiss(e, n.id)} />
                    ))}
                  </div>
                )}
                {readItems.length > 0 && (
                  <div className={styles.notifSection}>
                    <div className={styles.sectionLabel}>이전 알림</div>
                    {readItems.map(n => (
                      <NotifItem key={n.id} n={n} read={true} selected={selected?.id === n.id} onClick={() => handleNotifClick(n)} onDismiss={e => dismiss(e, n.id)} />
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* Right: detail panel */}
        <div className={`${styles.detailPanel} ${selected ? styles.detailPanelOpen : ''}`} role="region" aria-label="알림 상세">
          {selected && (
            <>
              <div className={styles.detailHeader}>
                <button className={styles.detailBack} onClick={() => setSelected(null)} aria-label="닫기">
                  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M10 3L5 8l5 5"/></svg>
                </button>
                <div className={styles.detailTitle}>알림 상세</div>
              </div>
              <div className={styles.detailBody}>
                <div className={styles.detailFullTitle}>{selected.title}</div>
                <div className={styles.detailMetaGrid}>
                  <div className={styles.detailMetaRow}>
                    <span className={styles.detailMetaKey}>시각</span>
                    <span className={styles.detailMetaVal}>{selected.time}</span>
                  </div>
                  <div className={styles.detailMetaRow}>
                    <span className={styles.detailMetaKey}>분류</span>
                    <span className={styles.detailMetaVal}>{TAG_LABEL[selected.type] ?? selected.type}</span>
                  </div>
                </div>
                <div className={styles.detailFullDesc}>{selected.desc}</div>
              </div>
              <div className={styles.detailActions}>
                {selected.link && (
                  <button className={styles.btnPrimary} onClick={() => { router.push(selected.link!); setSelected(null) }}>
                    바로가기
                  </button>
                )}
                <button className={`${styles.btnGhost} ${!selected.link ? '' : styles.btnGhostMl}`} onClick={() => setSelected(null)}>닫기</button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function NotifItem({ n, read, selected, onClick, onDismiss }: {
  n: Notification
  read: boolean
  selected: boolean
  onClick: () => void
  onDismiss: (e: React.MouseEvent) => void
}) {
  return (
    <div
      className={`${styles.notifItem} ${!read ? styles.notifItemUnread : ''} ${selected ? styles.notifItemSelected : ''}`}
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') onClick() }}
      aria-selected={selected}
    >
      <div className={read ? styles.readDot : styles.unreadDot} aria-hidden="true" />
      <div className={`${styles.notifIcon} ${styles[`icon-${n.priority}`]}`}>
        {PRIORITY_ICON[n.priority]}
      </div>
      <div className={styles.notifBody}>
        <div className={styles.notifTitle}>{n.title}</div>
        <div className={styles.notifDesc}>{n.desc}</div>
        <div className={styles.notifMeta}>
          <span className={styles.notifTime}>{n.time}</span>
          <span className={`${styles.notifTag} ${styles[`tag-${n.type}`]}`}>{TAG_LABEL[n.type] ?? n.type}</span>
        </div>
      </div>
      <button className={styles.notifDismiss} onClick={onDismiss} aria-label="알림 삭제" tabIndex={-1}>
        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
      </button>
    </div>
  )
}
