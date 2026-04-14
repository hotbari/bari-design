'use client'
import { useRouter } from 'next/navigation'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { ScheduleTable } from '@/components/domain/schedules/ScheduleTable'
import { Button } from '@/components/ui/Button'
import styles from './schedules.module.css'

export default function SchedulesPage() {
  const router = useRouter()
  const { data: schedules, isLoading } = useSchedules()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>편성 관리</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push('/schedules/sync')}>동기화 관리</Button>
          <Button variant="secondary" onClick={() => router.push('/schedules/emergency')}>긴급 편성</Button>
          <Button onClick={() => router.push('/schedules/new')}>+ 편성 등록</Button>
        </div>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <ScheduleTable schedules={schedules ?? []} />}
    </div>
  )
}
