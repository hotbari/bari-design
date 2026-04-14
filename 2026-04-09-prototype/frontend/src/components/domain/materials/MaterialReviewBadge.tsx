import { Badge } from '@/components/ui/Badge'
import type { Material } from '@/types/material'

const labelMap: Record<Material['reviewStatus'], string> = {
  approved: '승인', pending: '검수중', rejected: '반려',
}

// Badge only supports: 'active' | 'pending' | 'done' | 'error' | 'neutral'
const variantMap: Record<Material['reviewStatus'], 'active' | 'pending' | 'error'> = {
  approved: 'active', pending: 'pending', rejected: 'error',
}

export function MaterialReviewBadge({ status }: { status: Material['reviewStatus'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
