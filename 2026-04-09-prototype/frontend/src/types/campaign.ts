import { z } from 'zod'

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'done', 'pending', 'paused']),
  advertiser: z.string(),
})

export const campaignInputSchema = z.object({
  name: z.string().min(1, '캠페인명을 입력하세요'),
  advertiser: z.string().min(1, '광고주를 입력하세요'),
  status: z.enum(['active', 'pending', 'paused']),
})

export type Campaign = z.infer<typeof campaignSchema>
export type CampaignInput = z.infer<typeof campaignInputSchema>
