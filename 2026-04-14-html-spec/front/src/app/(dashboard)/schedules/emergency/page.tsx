'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useEmergencySchedule } from '@/hooks/schedules/useSchedules'
import { useToast } from '@/components/ui/Toast'
import styles from './emergency.module.css'

const BREADCRUMBS = [{ label: '편성 관리' }, { label: '긴급 편성' }]

const schema = z.object({
  mediaId: z.string().min(1, '매체를 선택하세요'),
  playlistId: z.string().min(1, '재생목록을 선택하세요'),
  duration: z.number().min(1, '방영 시간을 입력하세요'),
  reason: z.string().min(1, '긴급 사유를 입력하세요'),
})
type FormValues = z.infer<typeof schema>

export default function EmergencySchedulePage() {
  const router = useRouter()
  const emergency = useEmergencySchedule()
  const { show } = useToast()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { mediaId: '', playlistId: '', duration: 5, reason: '' },
  })

  const onSubmit = async (data: FormValues) => {
    await emergency.mutateAsync(data)
    show('긴급 편성이 등록되었습니다.')
    router.push('/schedules')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="긴급 편성" desc="즉시 방영할 콘텐츠를 설정합니다." />
      <div className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>매체</label>
            <select {...register('mediaId')} className={`${styles.input} ${errors.mediaId ? styles.err : ''}`}>
              <option value="">매체 선택</option>
              <option value="m-001">강남역 1번 출구</option>
              <option value="m-002">홍대입구역 2번 출구</option>
              <option value="m-004">신촌 스크린</option>
            </select>
            {errors.mediaId && <p className={styles.errMsg}>{errors.mediaId.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>재생목록</label>
            <select {...register('playlistId')} className={`${styles.input} ${errors.playlistId ? styles.err : ''}`}>
              <option value="">재생목록 선택</option>
              <option value="pl-001">강남역 1번 출구 재생목록</option>
              <option value="pl-002">홍대입구역 재생목록</option>
            </select>
            {errors.playlistId && <p className={styles.errMsg}>{errors.playlistId.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>방영 시간 (분)</label>
            <input type="number" {...register('duration', { valueAsNumber: true })} className={`${styles.input} ${errors.duration ? styles.err : ''}`} min="1" />
            {errors.duration && <p className={styles.errMsg}>{errors.duration.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>긴급 사유</label>
            <textarea {...register('reason')} className={`${styles.textarea} ${errors.reason ? styles.err : ''}`} placeholder="긴급 편성 사유를 입력하세요" rows={3} />
            {errors.reason && <p className={styles.errMsg}>{errors.reason.message}</p>}
          </div>
          <div className={styles.footer}>
            <Button type="button" variant="secondary" onClick={() => router.push('/schedules')}>취소</Button>
            <Button type="submit" variant="danger" disabled={isSubmitting}>긴급 편성 등록</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
