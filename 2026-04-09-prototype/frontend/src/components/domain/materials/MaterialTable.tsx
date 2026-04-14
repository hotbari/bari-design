'use client'
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { MaterialReviewBadge } from './MaterialReviewBadge'
import type { Material } from '@/types/material'

const columns: Column<Material>[] = [
  { key: 'name', header: '소재명', render: (r) => r.name },
  { key: 'advertiser', header: '광고주', render: (r) => r.advertiser },
  { key: 'mediaName', header: '매체', render: (r) => r.mediaName },
  { key: 'resolution', header: '해상도', render: (r) => r.resolution },
  { key: 'duration', header: '재생시간', render: (r) => `${r.duration}초` },
  { key: 'reviewStatus', header: '검수 상태', render: (r) => <MaterialReviewBadge status={r.reviewStatus} />, width: '90px' },
  { key: 'scheduleLinked', header: '편성 연결', render: (r) => r.scheduleLinked ? '연결됨' : '-', width: '80px' },
]

export function MaterialTable({ materials }: { materials: Material[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={materials}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/materials/${r.id}`)}
    />
  )
}
