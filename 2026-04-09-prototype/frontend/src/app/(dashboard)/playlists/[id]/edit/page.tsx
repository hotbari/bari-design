'use client'
import { useParams } from 'next/navigation'
import { usePlaylistDetail, useUpdatePlaylistSlots } from '@/hooks/playlists/usePlaylists'
import { PlaylistEditor } from '@/components/domain/playlists/PlaylistEditor'
import { useToast } from '@/stores/toast'
import styles from '../../playlists.module.css'

export default function PlaylistEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data: playlist, isLoading } = usePlaylistDetail(id)
  const mutation = useUpdatePlaylistSlots(id)
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (!playlist) return <p style={{ padding: '24px' }}>플레이리스트를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{playlist.name}</h1>
      <PlaylistEditor
        initialSlots={playlist.slots ?? []}
        isPending={mutation.isPending}
        onSave={(slots) => mutation.mutate(slots, {
          onSuccess: () => add('순서가 저장되었습니다', 'success'),
          onError: () => add('저장 실패', 'error'),
        })}
      />
    </div>
  )
}
