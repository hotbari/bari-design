import { Badge } from '@/components/ui/Badge'
import type { Schedule } from '@/types/schedule'

const labelMap: Record<Schedule['status'], string> = {
  active: '운영중',
  pending: '대기',
  done: '완료',
  paused: '일시정지',
}

const variantMap: Record<Schedule['status'], 'active' | 'pending' | 'done' | 'error' | 'neutral'> = {
  active: 'active',
  pending: 'pending',
  done: 'done',
  paused: 'error',
}

export function ScheduleStatusBadge({ status }: { status: Schedule['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
