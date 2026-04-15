import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Playlist, PlaylistItem } from '@/types/playlist'

export function usePlaylists() {
  return useQuery({ queryKey: ['playlists'], queryFn: async () => { const res = await fetch('/api/playlists'); return res.json() as Promise<Playlist[]> } })
}

export function usePlaylistDetail(id: string) {
  return useQuery({ queryKey: ['playlists', id], queryFn: async () => { const res = await fetch(`/api/playlists/${id}`); return res.json() as Promise<Playlist> }, enabled: !!id })
}

export function useUpdatePlaylist(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (items: PlaylistItem[]) => {
      const res = await fetch(`/api/playlists/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ items }) })
      return res.json() as Promise<Playlist>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['playlists'] }),
  })
}
