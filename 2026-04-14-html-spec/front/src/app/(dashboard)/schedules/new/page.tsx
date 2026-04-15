'use client'
import { useForm } from 'react-hook-form'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { DateRangePicker } from '@/components/ui/DateRangePicker'
import { useCreateSchedule } from '@/hooks/schedules/useSchedules'
import { useToast } from '@/components/ui/Toast'
import styles from './schedule-form.module.css'

const BREADCRUMBS = [{ label: '편성표', href: '/schedules' }, { label: '새 편성표' }]

const DAYS = ['일', '월', '화', '수', '목', '금', '토']

export default function ScheduleNewPage() {
  const router = useRouter()
  const create = useCreateSchedule()
  const { show } = useToast()
  const { register, handleSubmit, watch, setValue } = useForm({
    defaultValues: {
      name: '', mediaId: 'm-001', playlistId: 'pl-001',
      startDate: '', endDate: '', startTime: '09:00', endTime: '18:00',
      priority: 'prio-1' as 'prio-1' | 'prio-2' | 'prio-3',
      daysOfWeek: [1, 2, 3, 4, 5],
    },
  })

  const daysOfWeek = watch('daysOfWeek')
  const toggleDay = (d: number) => {
    setValue('daysOfWeek', daysOfWeek.includes(d) ? daysOfWeek.filter((x: number) => x !== d) : [...daysOfWeek, d])
  }

  type FormValues = { name: string; mediaId: string; playlistId: string; startDate: string; endDate: string; startTime: string; endTime: string; priority: 'prio-1' | 'prio-2' | 'prio-3'; daysOfWeek: number[] }
  const onSubmit = async (data: FormValues) => {
    await create.mutateAsync({
      ...data,
      mediaName: '강남역 1번 출구',
      playlistName: '강남역 1번 출구 재생목록',
      status: 'pending',
      syncStatus: 'sync-none',
    })
    show('편성표가 등록되었습니다.')
    router.push('/schedules')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="새 편성표" />
      <div className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>편성표명</label>
            <input {...register('name', { required: true })} className={styles.input} placeholder="편성표명 입력" />
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>매체</label>
            <select {...register('mediaId')} className={styles.input}>
              <option value="m-001">강남역 1번 출구</option>
              <option value="m-002">홍대입구역 2번 출구</option>
              <option value="m-004">신촌 스크린</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>재생목록</label>
            <select {...register('playlistId')} className={styles.input}>
              <option value="pl-001">강남역 1번 출구 재생목록</option>
              <option value="pl-002">홍대입구역 재생목록</option>
              <option value="pl-003">신촌 스크린 재생목록</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>집행 기간</label>
            <DateRangePicker
              startDate={watch('startDate')}
              endDate={watch('endDate')}
              onStartChange={v => setValue('startDate', v)}
              onEndChange={v => setValue('endDate', v)}
            />
          </div>
          <div className={styles.row}>
            <div className={styles.field}>
              <label className={styles.label}>시작 시간</label>
              <input type="time" {...register('startTime')} className={styles.input} />
            </div>
            <div className={styles.field}>
              <label className={styles.label}>종료 시간</label>
              <input type="time" {...register('endTime')} className={styles.input} />
            </div>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>우선순위</label>
            <select {...register('priority')} className={styles.input}>
              <option value="prio-1">1순위</option>
              <option value="prio-2">2순위</option>
              <option value="prio-3">3순위</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>방영 요일</label>
            <div className={styles.dayButtons}>
              {DAYS.map((label, d) => (
                <button key={d} type="button" className={`${styles.dayBtn} ${daysOfWeek.includes(d) ? styles.dayBtnActive : ''}`} onClick={() => toggleDay(d)}>
                  {label}
                </button>
              ))}
            </div>
          </div>
          <div className={styles.footer}>
            <Button type="button" variant="secondary" onClick={() => router.push('/schedules')}>취소</Button>
            <Button type="submit">등록</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
