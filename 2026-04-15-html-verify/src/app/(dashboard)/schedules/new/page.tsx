'use client'
import { useRouter } from 'next/navigation'
import { ScheduleForm } from '@/components/schedules/ScheduleForm'
import styles from './page.module.css'

export default function ScheduleNewPage() {
  const router = useRouter()

  async function handleSubmit(data: any) {
    const res = await fetch('/api/schedules', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
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
          <span className={styles.current}>새 편성표</span>
        </nav>
      </header>
      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>새 편성표</h1>
        </div>
        <ScheduleForm onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
