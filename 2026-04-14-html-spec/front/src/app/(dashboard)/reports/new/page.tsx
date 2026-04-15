'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { useCreateReport } from '@/hooks/reports/useReports'
import { useToast } from '@/components/ui/Toast'
import styles from './report-create.module.css'

const BREADCRUMBS = [{ label: '리포트', href: '/reports' }, { label: '리포트 생성' }]
const MEDIA_OPTIONS = [
  { id: 'm-001', name: '강남역 1번 출구' },
  { id: 'm-002', name: '홍대입구역 2번 출구' },
  { id: 'm-004', name: '신촌 스크린' },
]

const schema = z.object({
  name: z.string().min(1, '리포트명을 입력하세요'),
  type: z.enum(['campaign', 'media', 'schedule']),
  startDate: z.string().min(1, '시작일을 선택하세요'),
  endDate: z.string().min(1, '종료일을 선택하세요'),
})
type FormValues = z.infer<typeof schema>

export default function ReportCreatePage() {
  const router = useRouter()
  const create = useCreateReport()
  const { show } = useToast()
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [schedule, setSchedule] = useState(false)
  const { register, handleSubmit, watch, setValue, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { type: 'campaign' },
  })

  const toggleMedia = (id: string) => setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])

  const onSubmit = async (data: FormValues) => {
    await create.mutateAsync({ ...data, mediaIds: selectedMedia })
    show('리포트 생성이 시작되었습니다.')
    router.push('/reports')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="리포트 생성" />
      <div className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>리포트명</label>
            <input {...register('name')} className={`${styles.input} ${errors.name ? styles.err : ''}`} placeholder="리포트명 입력" />
            {errors.name && <p className={styles.errMsg}>{errors.name.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>리포트 유형</label>
            <select {...register('type')} className={styles.input}>
              <option value="campaign">캠페인 성과</option>
              <option value="media">매체 상태</option>
              <option value="schedule">편성 현황</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>기간</label>
            <DateRangePicker
              startDate={watch('startDate') ?? ''}
              endDate={watch('endDate') ?? ''}
              onStartChange={v => setValue('startDate', v)}
              onEndChange={v => setValue('endDate', v)}
            />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>대상 매체</label>
            <div className={styles.mediaGrid}>
              {MEDIA_OPTIONS.map(m => (
                <label key={m.id} className={`${styles.mediaItem} ${selectedMedia.includes(m.id) ? styles.mediaItemActive : ''}`}>
                  <input type="checkbox" checked={selectedMedia.includes(m.id)} onChange={() => toggleMedia(m.id)} style={{ display: 'none' }} />
                  {m.name}
                </label>
              ))}
            </div>
            <button type="button" className={styles.selectAllBtn} onClick={() => setSelectedMedia(MEDIA_OPTIONS.map(m => m.id))}>전체 선택</button>
          </div>
          <div className={styles.field}>
            <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer', fontSize: 'var(--font-size-sm)', fontWeight: 500 }}>
              <input type="checkbox" checked={schedule} onChange={e => setSchedule(e.target.checked)} />
              정기 발송
            </label>
          </div>
          {schedule && (
            <div className={styles.scheduleFields}>
              <div className={styles.field}>
                <label className={styles.label}>발송 주기</label>
                <select className={styles.input}>
                  <option value="weekly">주간</option>
                  <option value="monthly">월간</option>
                </select>
              </div>
              <div className={styles.field}>
                <label className={styles.label}>수신자 이메일</label>
                <input type="email" className={styles.input} placeholder="이메일 입력 후 Enter" />
              </div>
            </div>
          )}
          <div className={styles.footer}>
            <Button type="button" variant="secondary" onClick={() => router.push('/reports')}>취소</Button>
            <Button type="submit" disabled={isSubmitting}>{isSubmitting ? '생성 중...' : '생성'}</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
