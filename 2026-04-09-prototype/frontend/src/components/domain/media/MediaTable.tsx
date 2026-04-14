'use client'
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { MediaStatusBadge } from './MediaStatusBadge'
import type { Media } from '@/types/media'

const columns: Column<Media>[] = [
  { key: 'name', header: '매체명', render: (r) => r.name },
  { key: 'type', header: '유형', render: (r) => r.type },
  { key: 'location', header: '위치', render: (r) => r.location },
  { key: 'status', header: '상태', render: (r) => <MediaStatusBadge status={r.status} />, width: '100px' },
]

export function MediaTable({ media }: { media: Media[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={media}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/media/${r.id}`)}
    />
  )
}
