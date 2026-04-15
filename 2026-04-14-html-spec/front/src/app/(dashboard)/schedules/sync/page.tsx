'use client'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { SyncBadge } from '@/components/ui/SyncBadge'
import { useSyncStatus, useSyncSchedules } from '@/hooks/schedules/useSchedules'
import { useToast } from '@/components/ui/Toast'
import styles from './sync.module.css'

const BREADCRUMBS = [{ label: '편성 관리' }, { label: '싱크 송출 설정' }]
const SYNC_MAP: Record<string, 'synced' | 'delayed' | 'error' | 'pending'> = {
  'sync-ok': 'synced', 'sync-lag': 'delayed', 'sync-none': 'pending',
}

export default function SyncPage() {
  const { data: items = [] } = useSyncStatus()
  const sync = useSyncSchedules()
  const { show } = useToast()

  const handleSync = async () => {
    await sync.mutateAsync()
    show('전체 동기화가 완료되었습니다.')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="싱크 송출 설정"
        desc="편성표와 매체 동기화 상태를 관리합니다."
        actions={<Button onClick={handleSync} disabled={sync.isPending}>전체 동기화</Button>}
      />
      <div className={styles.list}>
        {items.length === 0 ? (
          <p style={{ color: 'var(--color-neutral-400)', textAlign: 'center', padding: 40 }}>편성표가 없습니다.</p>
        ) : items.map((item: { id: string; name: string; syncStatus: string }) => (
          <div key={item.id} className={styles.item}>
            <span className={styles.name}>{item.name}</span>
            <SyncBadge status={SYNC_MAP[item.syncStatus] ?? null} />
          </div>
        ))}
      </div>
    </AppShell>
  )
}
