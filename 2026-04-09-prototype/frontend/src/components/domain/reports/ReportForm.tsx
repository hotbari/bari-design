'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportInputSchema, type ReportInput } from '@/types/report'
import { Button } from '@/components/ui/Button'
import styles from './ReportForm.module.css'

interface ReportFormProps {
  onSubmit: (data: ReportInput) => void
  isPending: boolean
}

export function ReportForm({ onSubmit, isPending }: ReportFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportInput>({
    resolver: zodResolver(reportInputSchema),
    defaultValues: { type: 'performance' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="report-name" className={styles.label}>리포트명 *</label>
        <input id="report-name" className={styles.input} {...register('name')} placeholder="리포트명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="report-type" className={styles.label}>유형</label>
        <select id="report-type" className={styles.input} {...register('type')}>
          <option value="performance">성과</option>
          <option value="campaign">캠페인</option>
          <option value="operations">운영</option>
        </select>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label htmlFor="report-start" className={styles.label}>시작일 *</label>
          <input id="report-start" className={styles.input} type="date" {...register('startDate')} />
          {errors.startDate && <span className={styles.error}>{errors.startDate.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="report-end" className={styles.label}>종료일 *</label>
          <input id="report-end" className={styles.input} type="date" {...register('endDate')} />
          {errors.endDate && <span className={styles.error}>{errors.endDate.message}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>리포트 생성</Button>
      </div>
    </form>
  )
}
