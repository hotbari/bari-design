'use client'
import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { Dialog } from '@/components/ui/Dialog'
import { useToast } from '@/components/ui/Toast'
import { useCampaignDetail, useUpdateCampaign } from '@/hooks/campaigns/useCampaigns'
import styles from './detail.module.css'

const STATUS_LABELS: Record<string, string> = { draft: '초안', running: '집행중', done: '완료', canceled: '취소' }
const TYPE_LABELS: Record<string, string> = { direct: '직접판매', own: '자사광고', filler: '필러', naver: '네이버' }

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: item, isLoading } = useCampaignDetail(id)
  const update = useUpdateCampaign(id)
  const { show } = useToast()
  const [cancelOpen, setCancelOpen] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  const BREADCRUMBS = [{ label: '캠페인 관리', href: '/campaigns' }, { label: item?.name ?? '캠페인 상세' }]

  if (isLoading) return <AppShell breadcrumbs={[{ label: '캠페인 관리', href: '/campaigns' }, { label: '로딩 중...' }]}><p>로딩 중...</p></AppShell>
  if (!item) return <AppShell breadcrumbs={BREADCRUMBS}><p>캠페인을 찾을 수 없습니다.</p></AppShell>

  const handleCancel = async () => {
    if (!cancelReason.trim()) return
    await update.mutateAsync({ status: 'canceled', note: cancelReason })
    show('캠페인이 취소되었습니다.')
    setCancelOpen(false)
  }

  const TIMELINE_STEPS = ['draft', 'running', 'done']
  const currentStepIdx = TIMELINE_STEPS.indexOf(item.status)

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{item.name}</h1>
          <Badge variant={item.status} label={STATUS_LABELS[item.status] ?? item.status} />
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <Button variant="secondary" onClick={() => router.push(`/campaigns/${id}/edit`)}>수정</Button>
          {item.status !== 'canceled' && item.status !== 'done' && (
            <Button variant="danger" onClick={() => setCancelOpen(true)}>캠페인 취소</Button>
          )}
        </div>
      </div>

      {/* FSM Timeline */}
      {item.status !== 'canceled' && (
        <div className={styles.timeline}>
          {TIMELINE_STEPS.map((s, i) => (
            <div key={s} className={`${styles.timelineStep} ${i <= currentStepIdx ? styles.timelineActive : ''}`}>
              <div className={styles.timelineDot} />
              <span>{STATUS_LABELS[s]}</span>
            </div>
          ))}
        </div>
      )}

      <div className={styles.infoGrid}>
        <div className={styles.infoItem}><span className={styles.infoLabel}>광고주</span><span>{item.advertiser}</span></div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>유형</span><Badge variant={item.type} label={TYPE_LABELS[item.type] ?? item.type} /></div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>집행 기간</span><span>{item.startDate} ~ {item.endDate}</span></div>
        <div className={styles.infoItem}><span className={styles.infoLabel}>예산</span><span>{item.budget ? `${item.budget.toLocaleString()}원` : '-'}</span></div>
        {item.agency && <div className={styles.infoItem}><span className={styles.infoLabel}>광고대행사</span><span>{item.agency}</span></div>}
        {item.note && <div className={styles.infoItem}><span className={styles.infoLabel}>비고</span><span>{item.note}</span></div>}
      </div>

      <Dialog
        open={cancelOpen}
        title="캠페인 취소"
        body={
          <div>
            <p style={{ marginBottom: 12, fontSize: 'var(--font-size-sm)' }}>취소 사유를 입력하세요.</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="취소 사유를 입력하세요"
              style={{ width: '100%', height: 80, padding: 10, border: '1px solid var(--border-color)', borderRadius: 'var(--radius-md)', fontSize: 'var(--font-size-sm)', resize: 'vertical', boxSizing: 'border-box' }}
            />
          </div>
        }
        onClose={() => setCancelOpen(false)}
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelOpen(false)}>닫기</Button>
            <Button variant="danger" onClick={handleCancel} disabled={!cancelReason.trim()}>취소 확정</Button>
          </>
        }
      />
    </AppShell>
  )
}
