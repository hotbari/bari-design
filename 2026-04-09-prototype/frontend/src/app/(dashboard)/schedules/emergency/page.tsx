'use client'
import { useRouter } from 'next/navigation'
import { useCreateSchedule } from '@/hooks/schedules/useSchedules'
import { ScheduleForm } from '@/components/domain/schedules/ScheduleForm'
import { useToast } from '@/stores/toast'
import styles from '../schedules.module.css'

export default function EmergencySchedulePage() {
  const router = useRouter()
  const mutation = useCreateSchedule()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>긴급 편성</h1>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', margin: 0 }}>
        기존 편성을 즉시 교체합니다. 우선순위 1로 자동 설정됩니다.
      </p>
      <ScheduleForm
        defaultValues={{ priority: 1 }}
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate({ ...data, priority: 1 }, {
          onSuccess: () => { add('긴급 편성이 등록되었습니다', 'success'); router.push('/schedules') },
          onError: () => add('긴급 편성 등록 실패', 'error'),
        })}
      />
    </div>
  )
}
