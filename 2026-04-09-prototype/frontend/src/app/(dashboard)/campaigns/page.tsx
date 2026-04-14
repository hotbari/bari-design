'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'
import { CampaignTable } from '@/components/domain/campaigns/CampaignTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { Button } from '@/components/ui/Button'
import styles from './campaigns.module.css'

export default function CampaignsPage() {
  const router = useRouter()
  const { data: campaigns, isLoading } = useCampaigns()
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = campaigns
    ? statusFilter ? campaigns.filter((c) => c.status === statusFilter) : campaigns
    : []

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>캠페인</h1>
        <Button onClick={() => router.push('/campaigns/new')}>+ 캠페인 등록</Button>
      </div>
      <FilterBar
        filters={[{
          key: 'status',
          label: '상태',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'active', label: '운영중' },
            { value: 'pending', label: '대기' },
            { value: 'done', label: '완료' },
          ],
        }]}
      />
      {isLoading ? (
        <p style={{ padding: '24px', color: 'var(--color-neutral-500)' }}>불러오는 중...</p>
      ) : (
        <CampaignTable campaigns={filtered} />
      )}
    </div>
  )
}
