'use client'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { PlaylistTable } from '@/components/domain/playlists/PlaylistTable'
import { usePlaylists } from '@/hooks/playlists/usePlaylists'

const BREADCRUMBS = [{ label: '편성 관리' }, { label: '재생목록' }]

export default function PlaylistsPage() {
  const { data: items = [], isLoading } = usePlaylists()
  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="재생목록" />
      {isLoading ? <p>로딩 중...</p> : <PlaylistTable items={items} />}
    </AppShell>
  )
}
