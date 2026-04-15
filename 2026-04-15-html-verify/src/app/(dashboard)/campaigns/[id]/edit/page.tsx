'use client'
import { use } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CampaignDetail } from '@/types/campaign'
import { CampaignForm } from '@/components/campaigns/CampaignForm'
import styles from './page.module.css'

async function fetchCampaign(id: string): Promise<CampaignDetail> {
  const res = await fetch(`/api/campaigns/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export default function CampaignEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useQuery({ queryKey: ['campaign', id], queryFn: () => fetchCampaign(id) })

  async function handleSubmit(formData: any) {
    await fetch(`/api/campaigns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData),
    })
    router.push(`/campaigns/${id}`)
  }

  if (isLoading) return (
    <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  )

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/campaigns" className={styles.breadcrumbParent}>캠페인 관리</a>
          <span className={styles.sep}>›</span>
          <a href={`/campaigns/${id}`} className={styles.breadcrumbParent}>{data?.name ?? id}</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>캠페인 수정</span>
        </nav>
      </header>
      <main className={styles.content}>
        <h1 className={styles.pageTitle}>캠페인 수정</h1>
        <CampaignForm defaultValues={data} onSubmit={handleSubmit} />
      </main>
    </div>
  )
}
