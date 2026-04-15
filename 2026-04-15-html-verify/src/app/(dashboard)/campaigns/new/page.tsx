'use client'
import { useRouter } from 'next/navigation'
import { CampaignForm } from '@/components/campaigns/CampaignForm'
import styles from './page.module.css'

export default function CampaignNewPage() {
  const router = useRouter()

  async function handleSubmit(data: any) {
    await fetch('/api/campaigns', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    router.push('/campaigns')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/campaigns" className={styles.breadcrumbParent}>캠페인 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>캠페인 등록</span>
        </nav>
      </header>
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>캠페인 등록</h1>
        <CampaignForm onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
