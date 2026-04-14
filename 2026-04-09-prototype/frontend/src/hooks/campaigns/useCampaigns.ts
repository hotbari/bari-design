import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campaign, CampaignInput } from '@/types/campaign'

const QUERY_KEY = ['campaigns'] as const

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch('/api/campaigns')
  if (!res.ok) throw new Error('캠페인 목록 조회 실패')
  return res.json()
}

async function createCampaign(input: CampaignInput): Promise<Campaign> {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('캠페인 생성 실패')
  return res.json()
}

export function useCampaigns() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchCampaigns })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
