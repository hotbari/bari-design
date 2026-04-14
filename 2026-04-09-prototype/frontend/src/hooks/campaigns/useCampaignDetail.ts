import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campaign, CampaignInput } from '@/types/campaign'

const listKey = ['campaigns'] as const
const detailKey = (id: string) => ['campaigns', id] as const

async function fetchCampaignDetail(id: string): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${id}`)
  if (!res.ok) throw new Error('캠페인 조회 실패')
  return res.json()
}

async function updateCampaign(id: string, input: CampaignInput): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('캠페인 수정 실패')
  return res.json()
}

async function deleteCampaign(id: string): Promise<void> {
  const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('캠페인 삭제 실패')
}

export function useCampaignDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchCampaignDetail(id) })
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CampaignInput) => updateCampaign(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: detailKey(id) })
    },
  })
}

export function useDeleteCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  })
}
