'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import Link from 'next/link'
import { Button } from '@/components/ui/Button'
import { MaterialTable } from '@/components/domain/materials/MaterialTable'
import { useMaterials } from '@/hooks/materials/useMaterials'

const BREADCRUMBS = [{ label: '소재 관리' }]

export default function MaterialsPage() {
  const [reviewStatus, setReviewStatus] = useState('')
  const [opsStatus, setOpsStatus] = useState('')
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useMaterials({ reviewStatus: reviewStatus || undefined, opsStatus: opsStatus || undefined, search: search || undefined })

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="소재 목록"
        actions={<Link href="/materials/spec-guide"><Button variant="secondary" type="button">규격 안내</Button></Link>}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={reviewStatus} onChange={e => setReviewStatus(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 검수</option>
          <option value="reviewing">검수 중</option>
          <option value="done">완료</option>
          <option value="failed">반려</option>
          <option value="manual">수동 승인</option>
        </select>
        <select value={opsStatus} onChange={e => setOpsStatus(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 운영</option>
          <option value="active">운영 중</option>
          <option value="scheduled">예약됨</option>
          <option value="expired">만료</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="소재명 검색" style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', minWidth: 200 }} />
        <Button variant="secondary" size="sm" onClick={() => { setReviewStatus(''); setOpsStatus(''); setSearch('') }}>초기화</Button>
      </div>
      {isLoading ? <p>로딩 중...</p> : <MaterialTable items={items} />}
    </AppShell>
  )
}
