'use client'
import { useRouter } from 'next/navigation'
import { useCreateSchedule } from '@/hooks/schedules/useSchedules'
import { ScheduleForm } from '@/components/domain/schedules/ScheduleForm'
import { useToast } from '@/stores/toast'
import styles from '../schedules.module.css'

export default function ScheduleNewPage() {
  const router = useRouter()
  const mutation = useCreateSchedule()
  const { add } = useToast()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>편성 등록</h1>
      <ScheduleForm
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data, {
          onSuccess: () => { add('편성이 등록되었습니다', 'success'); router.push('/schedules') },
          onError: () => add('등록 실패', 'error'),
        })}
      />
    </div>
  )
}
