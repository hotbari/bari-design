'use client'
import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { MediaDetail } from '@/types/media'
import { MediaForm } from '@/components/media/MediaForm'
import styles from './page.module.css'

async function fetchMedia(id: string): Promise<MediaDetail> {
  const res = await fetch(`/api/media/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export default function MediaEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useQuery({ queryKey: ['media', id], queryFn: () => fetchMedia(id) })

  async function handleSubmit(body: any) {
    await fetch(`/api/media/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
    router.push(`/media/${id}`)
  }

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return <div className={styles.page}><div className={styles.content}>매체를 찾을 수 없습니다.</div></div>

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <a href={`/media/${id}`}>{data.name}</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>수정</span>
        </nav>
      </header>
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>매체 수정</h1>
        <MediaForm defaultValues={data} onSubmit={handleSubmit} mode="edit" />
      </main>
    </div>
  )
}
