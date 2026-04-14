'use client'
import { useRouter } from 'next/navigation'
import { useCreateReport } from '@/hooks/reports/useReports'
import { ReportForm } from '@/components/domain/reports/ReportForm'
import { useToast } from '@/stores/toast'
import styles from '../reports.module.css'

export default function ReportNewPage() {
  const router = useRouter()
  const mutation = useCreateReport()
  const { add } = useToast()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>리포트 생성</h1>
      <ReportForm
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data, {
          onSuccess: () => { add('리포트 생성이 요청되었습니다', 'success'); router.push('/reports') },
          onError: () => add('생성 실패', 'error'),
        })}
      />
    </div>
  )
}
