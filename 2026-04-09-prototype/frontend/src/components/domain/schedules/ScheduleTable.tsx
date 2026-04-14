'use client'
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { ScheduleStatusBadge } from './ScheduleStatusBadge'
import { SyncStatusBadge } from './SyncStatusBadge'
import type { Schedule } from '@/types/schedule'

const columns: Column<Schedule>[] = [
  { key: 'name', header: '편성명', render: (r) => r.name },
  { key: 'media', header: '매체', render: (r) => r.mediaNames.join(', ') },
  { key: 'period', header: '기간', render: (r) => `${r.startAt.slice(0, 10)} ~ ${r.endAt.slice(0, 10)}` },
  { key: 'status', header: '상태', render: (r) => <ScheduleStatusBadge status={r.status} />, width: '90px' },
  { key: 'sync', header: '동기화', render: (r) => <SyncStatusBadge syncStatus={r.syncStatus} syncLagMinutes={r.syncLagMinutes} />, width: '100px' },
]

export function ScheduleTable({ schedules }: { schedules: Schedule[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={schedules}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/schedules/${r.id}`)}
    />
  )
}
