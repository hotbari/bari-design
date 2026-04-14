import { Badge } from '@/components/ui/Badge'
import type { User } from '@/types/user'

const labelMap: Record<User['role'], string> = {
  admin: '관리자', operator: '운영자', agency: '대행사',
}
const variantMap: Record<User['role'], 'active' | 'pending' | 'neutral'> = {
  admin: 'active', operator: 'pending', agency: 'neutral',
}

export function UserRoleBadge({ role }: { role: User['role'] }) {
  return <Badge variant={variantMap[role]}>{labelMap[role]}</Badge>
}
