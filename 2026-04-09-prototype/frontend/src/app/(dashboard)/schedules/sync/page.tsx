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
        <table className={styles.syncTable}>
          <thead className={styles.syncThead}>
            <tr>
              {['편성명', '동기화 상태', ''].map((h, i) => (
                <th key={i} className={styles.syncTh}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules?.map((s) => (
              <tr key={s.id} className={styles.syncTr}>
                <td className={styles.syncTd}>{s.name}</td>
                <td className={styles.syncTd}>
                  <SyncStatusBadge syncStatus={s.syncStatus} syncLagMinutes={s.syncLagMinutes} />
                </td>
                <td className={styles.syncTdRight}>
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
