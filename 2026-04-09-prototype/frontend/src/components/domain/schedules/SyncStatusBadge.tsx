import { Badge } from '@/components/ui/Badge'
import type { Schedule } from '@/types/schedule'

export function SyncStatusBadge({ syncStatus, syncLagMinutes }: { syncStatus: Schedule['syncStatus']; syncLagMinutes: number | null }) {
  if (syncStatus === 'ok') return <Badge variant="active">동기화됨</Badge>
  if (syncStatus === 'lag') return <Badge variant="pending">{syncLagMinutes}분 지연</Badge>
  return <Badge variant="neutral">미동기화</Badge>
}
