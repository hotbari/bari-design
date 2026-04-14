'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaInputSchema, type MediaInput } from '@/types/media'
import { Button } from '@/components/ui/Button'
import styles from './MediaForm.module.css'

interface MediaFormProps {
  defaultValues?: Partial<MediaInput>
  onSubmit: (data: MediaInput) => void
  isPending: boolean
}

export function MediaForm({ defaultValues, onSubmit, isPending }: MediaFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MediaInput>({
    resolver: zodResolver(mediaInputSchema),
    defaultValues: defaultValues ?? { status: 'active', type: 'billboard' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label htmlFor="media-name" className={styles.label}>매체명 *</label>
        <input id="media-name" className={styles.input} {...register('name')} placeholder="매체명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="media-type" className={styles.label}>유형</label>
        <select id="media-type" className={styles.input} {...register('type')}>
          <option value="billboard">빌보드</option>
          <option value="signage">사이니지</option>
          <option value="display">디스플레이</option>
          <option value="screen">스크린</option>
        </select>
      </div>
      <div className={styles.field}>
        <label htmlFor="media-location" className={styles.label}>위치 *</label>
        <input id="media-location" className={styles.input} {...register('location')} placeholder="위치 입력" />
        {errors.location && <span className={styles.error}>{errors.location.message}</span>}
      </div>
      <div className={styles.field}>
        <label htmlFor="media-status" className={styles.label}>상태</label>
        <select id="media-status" className={styles.input} {...register('status')}>
          <option value="active">운영중</option>
          <option value="maintenance">점검중</option>
          <option value="inactive">비활성</option>
        </select>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
