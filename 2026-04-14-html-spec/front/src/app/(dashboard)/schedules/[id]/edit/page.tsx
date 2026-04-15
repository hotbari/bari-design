'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useScheduleDetail, useUpdateSchedule } from '@/hooks/schedules/useSchedules'
import { useToast } from '@/components/ui/Toast'

const STATUS_LABELS: Record<string, string> = { active: '적용중', pending: '예약됨', done: '종료' }

export default function ScheduleEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: item, isLoading } = useScheduleDetail(id)
  const update = useUpdateSchedule(id)
  const { show } = useToast()

  const BREADCRUMBS = [{ label: '편성표', href: '/schedules' }, { label: item?.name ?? '수정' }]

  if (isLoading) return <AppShell breadcrumbs={BREADCRUMBS}><p>로딩 중...</p></AppShell>
  if (!item) return <AppShell breadcrumbs={BREADCRUMBS}><p>편성표를 찾을 수 없습니다.</p></AppShell>

  const infoStyle = { fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)' }
  const labelStyle = { fontSize: 'var(--font-size-xs)', color: 'var(--color-neutral-500)', display: 'block' as const, marginBottom: 2 }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title={item.name}
        actions={
          <div style={{ display: 'flex', gap: 8 }}>
            <Button variant="secondary" onClick={() => router.push('/schedules')}>목록</Button>
            <Button onClick={async () => { await update.mutateAsync(item); show('편성표가 저장되었습니다.') }}>저장</Button>
          </div>
        }
      />
      <div style={{ background: '#fff', border: '1px solid var(--border-color)', borderRadius: 'var(--radius-lg)', padding: 20 }}>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
          <div><span style={labelStyle}>상태</span><Badge variant={item.status} label={STATUS_LABELS[item.status]} /></div>
          <div><span style={labelStyle}>우선순위</span><Badge variant={item.priority} label={item.priority} /></div>
          <div><span style={labelStyle}>매체</span><span style={infoStyle}>{item.mediaName}</span></div>
          <div><span style={labelStyle}>재생목록</span><span style={infoStyle}>{item.playlistName}</span></div>
          <div><span style={labelStyle}>기간</span><span style={infoStyle}>{item.startDate} ~ {item.endDate}</span></div>
          <div><span style={labelStyle}>시간대</span><span style={infoStyle}>{item.startTime} ~ {item.endTime}</span></div>
        </div>
        {item.campaignName && (
          <div style={{ padding: '12px 16px', background: 'var(--color-neutral-50)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-600)' }}>
            연결 캠페인: <strong>{item.campaignName}</strong>
          </div>
        )}
      </div>
    </AppShell>
  )
}
