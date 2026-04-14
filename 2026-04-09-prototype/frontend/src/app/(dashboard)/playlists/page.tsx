'use client'
import { useRouter } from 'next/navigation'
import { usePlaylists } from '@/hooks/playlists/usePlaylists'
import { Table, type Column } from '@/components/ui/Table'
import type { Playlist } from '@/types/playlist'
import styles from './playlists.module.css'

const columns: Column<Playlist>[] = [
  { key: 'name', header: '플레이리스트명', render: (r) => r.name },
  { key: 'slotCount', header: '슬롯 수', render: (r) => `${r.slotCount}개`, width: '80px' },
  { key: 'duration', header: '총 재생시간', render: (r) => `${r.duration}초`, width: '100px' },
]

export default function PlaylistsPage() {
  const router = useRouter()
  const { data: playlists, isLoading } = usePlaylists()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>플레이리스트</h1>
      </div>
      {isLoading ? <p>불러오는 중...</p> : (
        <Table
          columns={columns}
          rows={playlists ?? []}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => router.push(`/playlists/${r.id}/edit`)}
        />
      )}
    </div>
  )
}
