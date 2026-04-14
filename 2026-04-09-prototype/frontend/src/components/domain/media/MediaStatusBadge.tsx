import { Badge } from '@/components/ui/Badge'
import type { Media } from '@/types/media'

const labelMap: Record<Media['status'], string> = {
  active: '운영중',
  maintenance: '점검중',
  inactive: '비활성',
}
const variantMap: Record<Media['status'], 'active' | 'pending' | 'done' | 'error' | 'neutral'> = {
  active: 'active',
  maintenance: 'pending',
  inactive: 'neutral',
}

export function MediaStatusBadge({ status }: { status: Media['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
