'use client'
import { use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaylistEditor } from '@/components/domain/playlists/PlaylistEditor'
import { usePlaylistDetail, useUpdatePlaylist } from '@/hooks/playlists/usePlaylists'
import { useToast } from '@/components/ui/Toast'

export default function PlaylistEditPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data: playlist, isLoading } = usePlaylistDetail(id)
  const update = useUpdatePlaylist(id)
  const { show } = useToast()

  const BREADCRUMBS = [{ label: '재생목록', href: '/playlists' }, { label: playlist?.name ?? '편집' }]

  if (isLoading) return <AppShell breadcrumbs={BREADCRUMBS}><p>로딩 중...</p></AppShell>
  if (!playlist) return <AppShell breadcrumbs={BREADCRUMBS}><p>재생목록을 찾을 수 없습니다.</p></AppShell>

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title={playlist.name} desc={`매체: ${playlist.mediaName}`} />
      <PlaylistEditor
        initialItems={playlist.items}
        onSave={async items => {
          await update.mutateAsync(items)
          show('재생목록이 저장되었습니다.')
          router.push('/playlists')
        }}
      />
    </AppShell>
  )
}
