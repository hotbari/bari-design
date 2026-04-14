import { Table, type Column } from '@/components/ui/Table'
import { UserRoleBadge } from './UserRoleBadge'
import type { User } from '@/types/user'

const columns: Column<User>[] = [
  { key: 'name', header: '이름', render: (r) => r.name },
  { key: 'email', header: '이메일', render: (r) => r.email },
  { key: 'role', header: '역할', render: (r) => <UserRoleBadge role={r.role} />, width: '90px' },
]

export function UserTable({ users }: { users: User[] }) {
  return <Table columns={columns} rows={users} keyExtractor={(r) => r.id} />
}
