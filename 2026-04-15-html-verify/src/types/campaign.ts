export type CampaignStatus = 'draft' | 'running' | 'done' | 'canceled'
export type CampaignType = 'direct' | 'own' | 'filler' | 'naver'
export type PriceModel = 'CPM' | 'CPD' | 'fixed'

export interface Campaign {
  id: string
  name: string
  advertiser: string
  type: CampaignType
  status: CampaignStatus
  startDate: string
  endDate: string
  targetMedia: string
  budget: number
  priceModel: PriceModel
  registeredAt: string
}

export interface CampaignDetail extends Campaign {
  description?: string
  agency?: string
  mediaList: string[]
  schedules: { id: string; scheduleName: string; period: string; status: string }[]
  materials: { id: string; materialName: string; reviewStatus: string }[]
}
