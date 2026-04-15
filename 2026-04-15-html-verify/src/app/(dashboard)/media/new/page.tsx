'use client'
import { useRouter } from 'next/navigation'
import { MediaForm } from '@/components/media/MediaForm'
import styles from './page.module.css'

export default function MediaNewPage() {
  const router = useRouter()

  async function handleSubmit(data: any) {
    await fetch('/api/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
    router.push('/media')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>매체 등록</span>
        </nav>
      </header>
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>매체 등록</h1>
        <MediaForm onSubmit={handleSubmit} mode="new" />
      </main>
    </div>
  )
}
