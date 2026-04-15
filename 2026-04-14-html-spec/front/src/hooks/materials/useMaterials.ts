import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

export function useMaterials(filters?: { reviewStatus?: string; opsStatus?: string; fileType?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.reviewStatus) params.set('reviewStatus', filters.reviewStatus)
  if (filters?.opsStatus) params.set('opsStatus', filters.opsStatus)
  if (filters?.fileType) params.set('fileType', filters.fileType)
  if (filters?.search) params.set('search', filters.search)
  return useQuery({
    queryKey: ['materials', filters],
    queryFn: async () => { const res = await fetch(`/api/materials?${params}`); return res.json() },
  })
}

export function useMaterialDetail(id: string) {
  return useQuery({
    queryKey: ['materials', id],
    queryFn: async () => { const res = await fetch(`/api/materials/${id}`); return res.json() },
  })
}

export function useReviewMaterial(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: { reviewStatus: string; note?: string }) => {
      const res = await fetch(`/api/materials/${id}/review`, { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json()
    },
    onSuccess: () => { qc.invalidateQueries({ queryKey: ['materials'] }) },
  })
}
