import { Badge } from '@/components/ui/Badge'
import type { Report } from '@/types/report'

const labelMap: Record<Report['status'], string> = {
  ready: '다운로드 가능', generating: '생성중', error: '오류',
}
const variantMap: Record<Report['status'], 'active' | 'pending' | 'error'> = {
  ready: 'active', generating: 'pending', error: 'error',
}

export function ReportStatusBadge({ status }: { status: Report['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
