'use client'
import { use } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import { useMaterialDetail, useReviewMaterial } from '@/hooks/materials/useMaterials'
import styles from './detail.module.css'

const REVIEW_LABELS: Record<string, string> = { reviewing: '검수 중', done: '완료', failed: '반려', manual: '수동 승인' }
const OPS_LABELS: Record<string, string> = { active: '운영 중', scheduled: '예약됨', expired: '만료' }

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data: item, isLoading } = useMaterialDetail(id)
  const review = useReviewMaterial(id)
  const { show } = useToast()

  const BREADCRUMBS = [
    { label: '소재 관리', href: '/materials' },
    { label: item?.name ?? '소재 상세' },
  ]

  if (isLoading) return <AppShell breadcrumbs={[{ label: '소재 관리', href: '/materials' }, { label: '로딩 중...' }]}><p>로딩 중...</p></AppShell>
  if (!item) return <AppShell breadcrumbs={BREADCRUMBS}><p>소재를 찾을 수 없습니다.</p></AppShell>

  const handleReview = async (reviewStatus: string) => {
    await review.mutateAsync({ reviewStatus })
    show(`검수 상태가 "${REVIEW_LABELS[reviewStatus]}"로 변경되었습니다.`)
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{item.name}</h1>
          <div className={styles.badges}>
            <Badge variant={item.reviewStatus} label={REVIEW_LABELS[item.reviewStatus] ?? item.reviewStatus} />
            <Badge variant={item.opsStatus} label={OPS_LABELS[item.opsStatus] ?? item.opsStatus} />
          </div>
        </div>
      </div>

      <div className={styles.grid}>
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>파일 정보</h2>
          <dl className={styles.dl}>
            <dt>파일 유형</dt><dd>{item.fileType === 'video' ? '영상' : '이미지'}</dd>
            <dt>해상도</dt><dd>{item.resolution}</dd>
            <dt>파일 크기</dt><dd>{item.fileSize}</dd>
            {item.duration != null && <><dt>재생 시간</dt><dd>{item.duration}초</dd></>}
            <dt>업로더</dt><dd>{item.uploadedBy}</dd>
            <dt>업로드일</dt><dd>{item.uploadedAt.slice(0, 10)}</dd>
            {item.campaignName && <><dt>연결 캠페인</dt><dd>{item.campaignName}</dd></>}
          </dl>
        </div>

        <div className={styles.card}>
          <h2 className={styles.cardTitle}>검수 처리</h2>
          <p className={styles.currentStatus}>현재 검수 상태: <Badge variant={item.reviewStatus} label={REVIEW_LABELS[item.reviewStatus] ?? item.reviewStatus} /></p>
          <div className={styles.reviewBtns}>
            <Button variant="primary" size="sm" onClick={() => handleReview('done')} disabled={item.reviewStatus === 'done'}>승인</Button>
            <Button variant="secondary" size="sm" onClick={() => handleReview('manual')} disabled={item.reviewStatus === 'manual'}>수동 승인</Button>
            <Button variant="danger" size="sm" onClick={() => handleReview('failed')} disabled={item.reviewStatus === 'failed'}>반려</Button>
          </div>
          {item.note && <p className={styles.note}>{item.note}</p>}
        </div>
      </div>
    </AppShell>
  )
}
