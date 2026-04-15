'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { CampaignTable } from '@/components/domain/campaigns/CampaignTable'
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'

const BREADCRUMBS = [{ label: '캠페인 관리' }, { label: '캠페인 목록' }]

export default function CampaignsPage() {
  const router = useRouter()
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const { data: items = [], isLoading } = useCampaigns({ status: status || undefined, type: type || undefined, search: search || undefined })

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="캠페인 목록"
        actions={<Button onClick={() => router.push('/campaigns/new')}>캠페인 등록</Button>}
      />
      <div style={{ display: 'flex', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        <select value={status} onChange={e => setStatus(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 상태</option>
          <option value="draft">초안</option>
          <option value="running">집행중</option>
          <option value="done">완료</option>
          <option value="canceled">취소</option>
        </select>
        <select value={type} onChange={e => setType(e.target.value)} style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)' }}>
          <option value="">전체 유형</option>
          <option value="direct">직접판매</option>
          <option value="own">자사광고</option>
          <option value="filler">필러</option>
          <option value="naver">네이버</option>
        </select>
        <input value={search} onChange={e => setSearch(e.target.value)} placeholder="캠페인명 검색" style={{ height: 36, padding: '0 10px', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', minWidth: 200 }} />
        <Button variant="secondary" size="sm" onClick={() => { setStatus(''); setType(''); setSearch('') }}>초기화</Button>
      </div>
      {isLoading ? <p>로딩 중...</p> : <CampaignTable items={items} />}
    </AppShell>
  )
}
