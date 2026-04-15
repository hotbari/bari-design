'use client'
import { useRouter, useParams } from 'next/navigation'
import { useQuery } from '@tanstack/react-query'
import { ScheduleDetail } from '@/types/schedule'
import { ScheduleForm } from '@/components/schedules/ScheduleForm'
import styles from './page.module.css'

async function fetchSchedule(id: string): Promise<ScheduleDetail> {
  const res = await fetch(`/api/schedules/${id}`)
  if (!res.ok) throw new Error('failed')
  return res.json()
}

export default function ScheduleEditPage() {
  const router = useRouter()
  const { id } = useParams<{ id: string }>()
  const { data, isLoading } = useQuery({
    queryKey: ['schedule', id],
    queryFn: () => fetchSchedule(id),
  })

  async function handleSubmit(formData: any) {
    const res = await fetch(`/api/schedules/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    if (res.ok) router.push('/schedules')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.breadcrumbParent}>편성표</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>편성표 수정</span>
        </nav>
      </header>
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>편성표 수정</h1>
        </div>
        {isLoading ? (
          <div className={styles.loading}>로딩 중...</div>
        ) : (
          <ScheduleForm defaultValues={data} onSubmit={handleSubmit} isEdit />
        )}
      </main>
    </div>
  )
}
