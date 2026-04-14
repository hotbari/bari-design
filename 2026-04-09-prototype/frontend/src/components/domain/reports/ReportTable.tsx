import { Table, type Column } from '@/components/ui/Table'
import { ReportStatusBadge } from './ReportStatusBadge'
import type { Report } from '@/types/report'

const typeLabel: Record<Report['type'], string> = {
  performance: '성과', campaign: '캠페인', operations: '운영',
}

const columns: Column<Report>[] = [
  { key: 'name', header: '리포트명', render: (r) => r.name },
  { key: 'type', header: '유형', render: (r) => typeLabel[r.type], width: '80px' },
  { key: 'period', header: '기간', render: (r) => r.period },
  { key: 'createdAt', header: '생성일', render: (r) => new Date(r.createdAt).toLocaleDateString('ko-KR'), width: '100px' },
  { key: 'status', header: '상태', render: (r) => <ReportStatusBadge status={r.status} />, width: '120px' },
]

export function ReportTable({ reports }: { reports: Report[] }) {
  return <Table columns={columns} rows={reports} keyExtractor={(r) => r.id} />
}
