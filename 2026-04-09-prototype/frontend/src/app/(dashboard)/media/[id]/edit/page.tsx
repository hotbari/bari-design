'use client'
import { useParams, useRouter } from 'next/navigation'
import { useMediaDetail, useUpdateMedia } from '@/hooks/media/useMediaDetail'
import { MediaForm } from '@/components/domain/media/MediaForm'
import { useToast } from '@/stores/toast'
import styles from '../../media.module.css'

export default function MediaEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: media, isLoading, isError } = useMediaDetail(id)
  const mutation = useUpdateMedia(id)
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (isError || !media) return <p style={{ padding: '24px' }}>매체를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>매체 수정</h1>
      <MediaForm
        key={media.id}
        defaultValues={media}
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('수정되었습니다', 'success'); router.push(`/media/${id}`) },
            onError: () => add('수정 실패', 'error'),
          })
        }
      />
    </div>
  )
}
