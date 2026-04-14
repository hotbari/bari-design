'use client'
import { useParams } from 'next/navigation'
import { useMaterialDetail } from '@/hooks/materials/useMaterials'
import { MaterialReviewBadge } from '@/components/domain/materials/MaterialReviewBadge'
import { Badge } from '@/components/ui/Badge'
import styles from '../materials.module.css'

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: material, isLoading, isError } = useMaterialDetail(id)

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (isError || !material) return <p style={{ padding: '24px' }}>소재를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 className={styles.title}>{material.name}</h1>
          <MaterialReviewBadge status={material.reviewStatus} />
          <Badge variant={material.status === 'active' ? 'active' : 'neutral'}>
            {material.status === 'active' ? '운영중' : '비활성'}
          </Badge>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>광고주</dt><dd>{material.advertiser}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>매체</dt><dd>{material.mediaName}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>해상도</dt><dd>{material.resolution}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>재생시간</dt><dd>{material.duration}초</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>편성 연결</dt>
        <dd>{material.scheduleLinked ? '연결됨' : '미연결'}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>등록일</dt>
        <dd>{new Date(material.createdAt).toLocaleDateString('ko-KR')}</dd>
      </dl>
    </div>
  )
}
