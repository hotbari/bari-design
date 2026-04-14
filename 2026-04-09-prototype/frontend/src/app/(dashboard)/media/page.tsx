'use client'
import { useRouter } from 'next/navigation'
import { useMedia } from '@/hooks/media/useMedia'
import { MediaTable } from '@/components/domain/media/MediaTable'
import { Button } from '@/components/ui/Button'
import styles from './media.module.css'

export default function MediaPage() {
  const router = useRouter()
  const { data: media, isLoading } = useMedia()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>매체 관리</h1>
        <Button onClick={() => router.push('/media/new')}>+ 매체 등록</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <MediaTable media={media ?? []} />}
    </div>
  )
}
