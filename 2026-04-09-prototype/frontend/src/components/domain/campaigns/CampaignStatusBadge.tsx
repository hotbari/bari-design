import { Badge } from '@/components/ui/Badge'
import type { Campaign } from '@/types/campaign'

const labelMap: Record<Campaign['status'], string> = {
  active: '운영중',
  done: '완료',
  pending: '대기',
  paused: '일시정지',
}

// Badge variants: 'active' | 'pending' | 'done' | 'error' | 'neutral'
const variantMap: Record<Campaign['status'], 'active' | 'done' | 'pending' | 'error' | 'neutral'> = {
  active: 'active',
  done: 'done',
  pending: 'pending',
  paused: 'error',
}

export function CampaignStatusBadge({ status }: { status: Campaign['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
