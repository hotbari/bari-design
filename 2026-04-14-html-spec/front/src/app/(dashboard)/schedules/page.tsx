'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { ScheduleTable } from '@/components/domain/schedules/ScheduleTable'
import { useSchedules } from '@/hooks/schedules/useSchedules'

const BREADCRUMBS = [{ label: '편성 관리' }, { label: '편성표' }]

export default function SchedulesPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useSchedules({ status: status || undefined, search: search || undefined })

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="편성표" actions={<Button onClick={() => router.push('/schedules/new')}>새 편성표</Button>} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 상태</option>
          <option value="active">적용중</option>
          <option value="pending">예약됨</option>
          <option value="done">종료</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="편성표명 검색" style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', minWidth: 200 }} />
        <Button variant="secondary" size="sm" onClick={() => { setStatus(''); setSearch('') }}>초기화</Button>
      </div>
      {isLoading ? <p>로딩 중...</p> : <ScheduleTable items={items} />}
    </AppShell>
  )
}
