'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMedia } from '@/hooks/media/useMedia'
import { MediaTable } from '@/components/domain/media/MediaTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { Button } from '@/components/ui/Button'
import styles from './media.module.css'

export default function MediaPage() {
  const router = useRouter()
  const { data: media, isLoading } = useMedia()
  const [statusFilter, setStatusFilter] = useState('')

  const filtered = media
    ? statusFilter ? media.filter((m) => m.status === statusFilter) : media
    : []

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>매체 관리</h1>
        <Button onClick={() => router.push('/media/new')}>+ 매체 등록</Button>
      </div>
      <FilterBar
        filters={[{
          key: 'status',
          label: '상태',
          value: statusFilter,
          onChange: setStatusFilter,
          options: [
            { value: 'active', label: '운영중' },
            { value: 'maintenance', label: '점검중' },
            { value: 'inactive', label: '비활성' },
          ],
        }]}
      />
      {isLoading ? (
        <p style={{ padding: '24px', color: 'var(--color-neutral-500)' }}>불러오는 중...</p>
      ) : (
        <MediaTable media={filtered} />
      )}
    </div>
  )
}
