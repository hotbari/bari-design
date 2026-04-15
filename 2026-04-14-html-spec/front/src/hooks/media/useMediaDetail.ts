import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MediaDetail } from '@/types/media'

export function useMediaDetail(id: string) {
  return useQuery<MediaDetail>({
    queryKey: ['media', id],
    queryFn: async () => {
      const res = await fetch(`/api/media/${id}`)
      if (!res.ok) throw new Error('Not found')
      return res.json()
    },
    enabled: !!id,
  })
}

export function useToggleMediaStatus(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (status: string) => {
      const res = await fetch(`/api/media/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      })
      return res.json()
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['media', id] })
      qc.invalidateQueries({ queryKey: ['media'] })
    },
  })
}

export function useMediaHealthChecks(id: string, period: number) {
  return useQuery({
    queryKey: ['media-health-checks', id, period],
    queryFn: async () => {
      const res = await fetch(`/api/media/${id}/health-checks?period=${period}`)
      return res.json()
    },
    enabled: !!id,
  })
}
