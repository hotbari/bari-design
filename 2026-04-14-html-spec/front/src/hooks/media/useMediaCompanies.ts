import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { MediaCompany } from '@/types/media'

export function useMediaCompanies(q?: string) {
  return useQuery<MediaCompany[]>({
    queryKey: ['media-companies', q],
    queryFn: async () => {
      const url = new URL('/api/media-companies', window.location.origin)
      if (q) url.searchParams.set('q', q)
      const res = await fetch(url)
      return res.json()
    },
  })
}

export function useCreateMediaCompany() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<MediaCompany>) => {
      const res = await fetch('/api/media-companies', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw Object.assign(new Error(err.message), { status: res.status })
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-companies'] }),
  })
}

export function useUpdateMediaCompany(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<MediaCompany>) => {
      const res = await fetch(`/api/media-companies/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) {
        const err = await res.json()
        throw Object.assign(new Error(err.message), { status: res.status })
      }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['media-companies'] }),
  })
}
