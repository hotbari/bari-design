import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Playlist, PlaylistSlot } from '@/types/playlist'

const QUERY_KEY = ['playlists'] as const
const detailKey = (id: string) => ['playlists', id] as const

async function fetchPlaylists(): Promise<Playlist[]> {
  const res = await fetch('/api/playlists')
  if (!res.ok) throw new Error('플레이리스트 목록 조회 실패')
  return res.json()
}

async function fetchPlaylistDetail(id: string): Promise<Playlist> {
  const res = await fetch(`/api/playlists/${id}`)
  if (!res.ok) throw new Error('플레이리스트 조회 실패')
  return res.json()
}

async function updatePlaylistSlots(id: string, slots: PlaylistSlot[]): Promise<void> {
  const res = await fetch(`/api/playlists/${id}/slots`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slots }),
  })
  if (!res.ok) throw new Error('슬롯 저장 실패')
}

export function usePlaylists() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchPlaylists })
}

export function usePlaylistDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchPlaylistDetail(id) })
}

export function useUpdatePlaylistSlots(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slots: PlaylistSlot[]) => updatePlaylistSlots(id, slots),
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(id) }),
  })
}
