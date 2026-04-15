'use client'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useNotifications, useMarkRead, useMarkAllRead } from '@/hooks/notifications/useNotifications'
import { useToast } from '@/components/ui/Toast'
import styles from './notifications.module.css'

const BREADCRUMBS = [{ label: '알림' }]

export default function NotificationsPage() {
  const { data: items = [] } = useNotifications()
  const markRead = useMarkRead()
  const markAllRead = useMarkAllRead()
  const { show } = useToast()

  const unreadCount = items.filter((n: { read: boolean }) => !n.read).length
  const TYPE_ICON: Record<string, string> = { info: 'ℹ️', warning: '⚠️', error: '🔴' }

  const handleMarkAllRead = async () => {
    await markAllRead.mutateAsync()
    show('모든 알림을 읽음 처리했습니다.')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title={`알림 ${unreadCount > 0 ? `(${unreadCount})` : ''}`}
        actions={unreadCount > 0 ? <Button variant="secondary" size="sm" onClick={handleMarkAllRead}>모두 읽음</Button> : undefined}
      />
      <div className={styles.list}>
        {items.length === 0 ? (
          <p className={styles.empty}>알림이 없습니다.</p>
        ) : items.map((n: { id: string; type: string; message: string; timestamp: string; read: boolean }) => (
          <div
            key={n.id}
            className={`${styles.item} ${!n.read ? styles.unread : ''}`}
            onClick={() => !n.read && markRead.mutate(n.id)}
            role="button"
            tabIndex={0}
            onKeyDown={e => e.key === 'Enter' && !n.read && markRead.mutate(n.id)}
          >
            <span className={styles.icon}>{TYPE_ICON[n.type] ?? 'ℹ️'}</span>
            <div className={styles.content}>
              <p className={styles.message}>{n.message}</p>
              <p className={styles.time}>{new Date(n.timestamp).toLocaleString('ko-KR')}</p>
            </div>
            {!n.read && <span className={styles.dot} />}
          </div>
        ))}
      </div>
    </AppShell>
  )
}
