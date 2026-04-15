'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { UserTable } from '@/components/domain/users/UserTable'
import { useUsers } from '@/hooks/users/useUsers'

const BREADCRUMBS = [{ label: '사용자 관리' }]

export default function UsersPage() {
  const router = useRouter()
  const [role, setRole] = useState('')
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useUsers({ role: role || undefined, status: status || undefined, search: search || undefined })

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="사용자 목록"
        actions={<Button onClick={() => router.push('/users/invite')}>사용자 초대</Button>}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={role} onChange={e => setRole(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 역할</option>
          <option value="admin">관리자</option>
          <option value="media">매체사</option>
          <option value="ops">운영 대행사</option>
          <option value="sales">영업 대행사</option>
        </select>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 상태</option>
          <option value="active">활성</option>
          <option value="inactive">비활성</option>
          <option value="invited">초대됨</option>
          <option value="expired">만료</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="이름/이메일 검색" style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', minWidth: 200 }} />
        <Button variant="secondary" size="sm" onClick={() => { setRole(''); setStatus(''); setSearch('') }}>초기화</Button>
      </div>
      {isLoading ? <p>로딩 중...</p> : <UserTable items={items} />}
    </AppShell>
  )
}
