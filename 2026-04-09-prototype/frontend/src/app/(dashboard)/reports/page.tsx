'use client'
import { useRouter } from 'next/navigation'
import { useReports } from '@/hooks/reports/useReports'
import { ReportTable } from '@/components/domain/reports/ReportTable'
import { Button } from '@/components/ui/Button'
import styles from './reports.module.css'

export default function ReportsPage() {
  const router = useRouter()
  const { data: reports, isLoading } = useReports()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>리포트</h1>
        <Button onClick={() => router.push('/reports/new')}>+ 리포트 생성</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <ReportTable reports={reports ?? []} />}
    </div>
  )
}
