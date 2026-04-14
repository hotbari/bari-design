'use client'
import { useRouter } from 'next/navigation'
import { useCreateMedia } from '@/hooks/media/useMedia'
import { MediaForm } from '@/components/domain/media/MediaForm'
import { useToast } from '@/stores/toast'
import styles from '../media.module.css'

export default function MediaNewPage() {
  const router = useRouter()
  const mutation = useCreateMedia()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>매체 등록</h1>
      <MediaForm
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('매체가 등록되었습니다', 'success'); router.push('/media') },
            onError: () => add('등록에 실패했습니다', 'error'),
          })
        }
      />
    </div>
  )
}
