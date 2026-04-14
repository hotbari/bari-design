'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scheduleInputSchema, type ScheduleInput } from '@/types/schedule'
import { Button } from '@/components/ui/Button'
import styles from './ScheduleForm.module.css'

interface ScheduleFormProps {
  defaultValues?: Partial<ScheduleInput>
  onSubmit: (data: ScheduleInput) => void
  isPending: boolean
}

export function ScheduleForm({ defaultValues, onSubmit, isPending }: ScheduleFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleInputSchema),
    defaultValues: { priority: 3, mediaIds: [], ...defaultValues },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="name" className={styles.label}>편성명 *</label>
        <input id="name" className={styles.input} {...register('name')} placeholder="편성명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="startAt" className={styles.label}>시작일 *</label>
          <input id="startAt" className={styles.input} type="datetime-local" {...register('startAt')} />
          {errors.startAt && <span className={styles.error}>{errors.startAt.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="endAt" className={styles.label}>종료일 *</label>
          <input id="endAt" className={styles.input} type="datetime-local" {...register('endAt')} />
          {errors.endAt && <span className={styles.error}>{errors.endAt.message}</span>}
        </div>
      </div>
      <div className={styles.field}>
        <label htmlFor="priority" className={styles.label}>우선순위</label>
        <input id="priority" className={styles.input} type="number" min={1} max={5} {...register('priority', { valueAsNumber: true })} />
        {errors.priority && <span className={styles.error}>{errors.priority.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="playlistId" className={styles.label}>플레이리스트 ID *</label>
        <input id="playlistId" className={styles.input} {...register('playlistId')} placeholder="pl-001" />
        {errors.playlistId && <span className={styles.error}>{errors.playlistId.message}</span>}
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
