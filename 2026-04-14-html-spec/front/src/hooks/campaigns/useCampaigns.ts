import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campaign } from '@/types/campaign'

export function useCampaigns(filters?: { status?: string; type?: string; advertiser?: string; search?: string }) {
  const params = new URLSearchParams()
  if (filters?.status) params.set('status', filters.status)
  if (filters?.type) params.set('type', filters.type)
  if (filters?.advertiser) params.set('advertiser', filters.advertiser)
  if (filters?.search) params.set('search', filters.search)
  return useQuery({
    queryKey: ['campaigns', filters],
    queryFn: async () => { const res = await fetch(`/api/campaigns?${params}`); return res.json() as Promise<Campaign[]> },
  })
}

export function useCampaignDetail(id: string) {
  return useQuery({
    queryKey: ['campaigns', id],
    queryFn: async () => { const res = await fetch(`/api/campaigns/${id}`); return res.json() as Promise<Campaign> },
    enabled: !!id,
  })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Omit<Campaign, 'id' | 'createdAt'>) => {
      const res = await fetch('/api/campaigns', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json() as Promise<Campaign>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (body: Partial<Campaign>) => {
      const res = await fetch(`/api/campaigns/${id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
      return res.json() as Promise<Campaign>
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}
