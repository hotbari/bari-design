import { AdminDashboard } from '@/components/domain/dashboard/AdminDashboard'
import { MediaCompanyDashboard } from '@/components/domain/dashboard/MediaCompanyDashboard'
import { OpsAgencyDashboard } from '@/components/domain/dashboard/OpsAgencyDashboard'
import styles from '@/components/domain/dashboard/dashboard.module.css'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role = 'admin' } = await searchParams

  const titleMap: Record<string, string> = {
    admin: '어드민 대시보드',
    'media-company': '미디어사 대시보드',
    'ops-agency': '운영 대행사 대시보드',
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{titleMap[role] ?? '대시보드'}</h1>
      {role === 'media-company' ? <MediaCompanyDashboard /> :
       role === 'ops-agency' ? <OpsAgencyDashboard /> :
       <AdminDashboard />}
    </div>
  )
}
