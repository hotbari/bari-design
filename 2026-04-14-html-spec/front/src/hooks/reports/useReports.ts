import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Report } from '@/types/report'

export function useReports(filters?: { type?: string; status?: string }) {
  const params = new URLSearchParams()
  if (filters?.type) params.set('type', filters.type)
  if (filters?.status) params.set('status', filters.status)
  return useQuery({
    queryKey: ['reports', filters],
    queryFn: async () => { const res = await fetch(`/api/reports?${params}`); return res.json() as Promise<Report[]> },
  })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Omit<Report, 'id' | 'status' | 'createdAt'>) => {
      const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json() as Promise<Report>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['reports'] }),
  })
}

export function useFootTraffic() {
  return useQuery({ queryKey: ['foot-traffic'], queryFn: async () => { const res = await fetch('/api/foot-traffic'); return res.json() } })
}

export function useSspIntegration() {
  return useQuery({ queryKey: ['ssp'], queryFn: async () => { const res = await fetch('/api/ssp'); return res.json() } })
}
