import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Media, MediaGroup } from '@/types/media'

interface GroupsResponse {
  groups: MediaGroup[]
  unassigned: Media[]
}

export function useMediaGroups() {
  return useQuery<GroupsResponse>({
    queryKey: ['media-groups'],
    queryFn: async () => {
      const res = await fetch('/api/media-groups')
      return res.json()
    },
  })
}

export function useCreateMediaGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (name: string) => {
      const res = await fetch('/api/media-groups', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name }),
      })
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-groups'] }),
  })
}

export function useUpdateMediaGroup(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<MediaGroup>) => {
      const res = await fetch(`/api/media-groups/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-groups'] }),
  })
}

export function useDeleteMediaGroup() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/media-groups/${id}`, { method: 'DELETE' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-groups'] }),
  })
}
