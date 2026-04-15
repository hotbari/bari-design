'use client'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { CampaignDetail } from '@/types/campaign'
import styles from './page.module.css'

async function fetchCampaign(id: string): Promise<CampaignDetail> {
  const res = await fetch(`/api/campaigns/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

const STATUS_LABEL: Record<string, string> = {
  draft: '초안', running: '집행중', done: '완료', canceled: '취소',
}
const TYPE_LABEL: Record<string, string> = {
  direct: '직접판매', own: '자사광고', filler: '필러', naver: '네이버',
}
const SCH_STATUS_LABEL: Record<string, string> = {
  active: '집행중', pending: '대기', done: '완료',
}

const FSM_STEPS = ['draft', 'running', 'done']

export default function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useQuery({ queryKey: ['campaign', id], queryFn: () => fetchCampaign(id) })
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState('')

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return <div className={styles.page}><div className={styles.content}>캠페인을 찾을 수 없습니다.</div></div>

  const currentFsmIdx = data.status === 'canceled' ? -1 : FSM_STEPS.indexOf(data.status)

  function handleCancel() {
    if (!cancelReason.trim()) return
    // Would call API in production
    setShowCancelModal(false)
    router.push('/campaigns')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/campaigns" className={styles.breadcrumbParent}>캠페인 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{data.name}</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        {/* Page header */}
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{data.name}</h1>
            <span className={`${styles.statusBadge} ${styles[`status-${data.status}`]}`}>{STATUS_LABEL[data.status]}</span>
          </div>
          <div className={styles.pageHeaderRight}>
            {data.status !== 'done' && data.status !== 'canceled' && (
              <>
                <button className={styles.btnEdit} onClick={() => router.push(`/campaigns/${id}/edit`)}>수정</button>
                <button className={styles.btnCancel} onClick={() => setShowCancelModal(true)}>캠페인 취소</button>
              </>
            )}
          </div>
        </div>

        {/* FSM Timeline */}
        <div className={styles.fsmCard}>
          {data.status === 'canceled' ? (
            <div className={styles.fsmCanceled}>
              <span className={styles.fsmCanceledIcon}>✕</span>
              <span className={styles.fsmCanceledText}>취소된 캠페인</span>
            </div>
          ) : (
            <div className={styles.fsm}>
              {FSM_STEPS.map((s, i) => (
                <div key={s} className={styles.fsmItem}>
                  <div className={`${styles.fsmCircle} ${i <= currentFsmIdx ? styles.fsmCircleActive : ''} ${i < currentFsmIdx ? styles.fsmCircleDone : ''}`}>
                    {i < currentFsmIdx ? '✓' : i + 1}
                  </div>
                  <span className={`${styles.fsmLabel} ${i === currentFsmIdx ? styles.fsmLabelActive : ''}`}>{STATUS_LABEL[s]}</span>
                  {i < FSM_STEPS.length - 1 && (
                    <div className={`${styles.fsmLine} ${i < currentFsmIdx ? styles.fsmLineDone : ''}`} />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Info grid */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>기본 정보</h2>
          <div className={styles.infoGrid}>
            <InfoRow label="광고주" value={data.advertiser} />
            <InfoRow label="유형" value={TYPE_LABEL[data.type]} />
            <InfoRow label="집행 기간" value={`${data.startDate} ~ ${data.endDate}`} />
            <InfoRow label="예산" value={data.budget === 0 ? '-' : `${data.budget.toLocaleString()}원 (${data.priceModel})`} />
            {data.agency && <InfoRow label="광고대행사" value={data.agency} />}
            <InfoRow label="대상 매체" value={data.mediaList?.join(', ') ?? data.targetMedia} />
            {data.description && <InfoRow label="설명" value={data.description} />}
            <InfoRow label="등록일" value={data.registeredAt} />
          </div>
        </div>

        {/* Connected schedules */}
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>연결된 편성표</h2>
          {!data.schedules || data.schedules.length === 0 ? (
            <div className={styles.empty}>연결된 편성표가 없습니다</div>
          ) : (
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>편성표명</th>
                  <th>상태</th>
                  <th>기간</th>
                </tr>
              </thead>
              <tbody>
                {data.schedules.map(sch => (
                  <tr key={sch.id}>
                    <td className={styles.tdName}>{sch.scheduleName}</td>
                    <td>
                      <span className={`${styles.schBadge} ${styles[`sch-${sch.status}`]}`}>{SCH_STATUS_LABEL[sch.status] ?? sch.status}</span>
                    </td>
                    <td className={styles.tdMeta}>{sch.period}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>

      {/* Cancel modal */}
      {showCancelModal && (
        <div className={styles.modalOverlay} onClick={() => setShowCancelModal(false)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()}>
            <h3 className={styles.modalTitle}>캠페인 취소</h3>
            <p className={styles.modalDesc}>취소 후에는 되돌릴 수 없습니다.</p>
            <div className={styles.fieldGroup}>
              <label className={styles.fieldLabel}>취소 사유 <span className={styles.required}>*</span></label>
              <textarea
                className={styles.textarea}
                placeholder="취소 사유를 입력하세요"
                value={cancelReason}
                onChange={e => setCancelReason(e.target.value)}
                rows={4}
              />
            </div>
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setShowCancelModal(false)}>닫기</button>
              <button className={styles.btnDanger} disabled={!cancelReason.trim()} onClick={handleCancel}>취소 확인</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={styles.infoValue}>{value}</span>
    </div>
  )
}
