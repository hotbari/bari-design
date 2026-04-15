'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { ReportTable } from '@/components/domain/reports/ReportTable'
import { useReports } from '@/hooks/reports/useReports'

const BREADCRUMBS = [{ label: '리포트' }, { label: '리포트 목록' }]

export default function ReportsPage() {
  const router = useRouter()
  const [type, setType] = useState('')
  const { data: items = [], isLoading } = useReports({ type: type || undefined })

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="리포트 목록" actions={<Button onClick={() => router.push('/reports/new')}>리포트 생성</Button>} />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <select value={type} onChange={e => setType(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체</option>
          <option value="campaign">캠페인 성과</option>
          <option value="media">매체 상태</option>
          <option value="schedule">편성 현황</option>
        </select>
        <Button variant="secondary" size="sm" onClick={() => setType('')}>초기화</Button>
      </div>
      {isLoading ? <p>로딩 중...</p> : <ReportTable items={items} />}
    </AppShell>
  )
}
