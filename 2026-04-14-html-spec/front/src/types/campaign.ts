export type CampaignStatus = 'draft' | 'running' | 'done' | 'canceled'
export type CampaignType = 'direct' | 'own' | 'filler' | 'naver'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  advertiser: string
  agency?: string
  startDate: string
  endDate: string
  billingModel?: 'fixed' | 'daily' | 'none'
  budget?: number
  mediaIds: string[]
  createdAt: string
  note?: string
}
