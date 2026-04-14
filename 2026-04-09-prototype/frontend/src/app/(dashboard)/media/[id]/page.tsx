'use client'
import { useParams, useRouter } from 'next/navigation'
import { useMediaDetail, useDeleteMedia } from '@/hooks/media/useMediaDetail'
import { MediaStatusBadge } from '@/components/domain/media/MediaStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../media.module.css'

export default function MediaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: media, isLoading, isError } = useMediaDetail(id)
  const deleteMutation = useDeleteMedia()
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (isError || !media) return <p style={{ padding: '24px' }}>매체를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 className={styles.title}>{media.name}</h1>
          <MediaStatusBadge status={media.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push(`/media/${id}/edit`)}>수정</Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(id, {
              onSuccess: () => { add('삭제되었습니다', 'success'); router.push('/media') },
              onError: () => add('삭제 실패', 'error'),
            })}
          >
            삭제
          </Button>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>유형</dt><dd>{media.type}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>위치</dt><dd>{media.location}</dd>
      </dl>
    </div>
  )
}
