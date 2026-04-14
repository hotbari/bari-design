'use client'
import { useSchedules, useSyncSchedule } from '@/hooks/schedules/useSchedules'
import { SyncStatusBadge } from '@/components/domain/schedules/SyncStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../schedules.module.css'

export default function SyncSchedulePage() {
  const { data: schedules, isLoading } = useSchedules()
  const syncMutation = useSyncSchedule()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>동기화 관리</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
              {['편성명', '동기화 상태', ''].map((h) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules?.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
                <td style={{ padding: '10px 12px' }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>
                  <SyncStatusBadge syncStatus={s.syncStatus} syncLagMinutes={s.syncLagMinutes} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={syncMutation.isPending && syncMutation.variables === s.id}
                    onClick={() => syncMutation.mutate(s.id, {
                      onSuccess: () => add(`${s.name} 동기화 완료`, 'success'),
                      onError: () => add('동기화 실패', 'error'),
                    })}
                  >
                    동기화
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
