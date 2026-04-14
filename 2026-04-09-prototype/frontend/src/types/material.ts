import { z } from 'zod'

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  advertiser: z.string(),
  mediaId: z.string(),
  mediaName: z.string(),
  resolution: z.string(),
  duration: z.number(),
  reviewStatus: z.enum(['approved', 'pending', 'rejected']),
  scheduleLinked: z.boolean(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
})

export const materialInputSchema = z.object({
  name: z.string().min(1, '소재명을 입력하세요'),
  advertiser: z.string().min(1, '광고주를 입력하세요'),
  mediaId: z.string().min(1, '매체를 선택하세요'),
  resolution: z.string().min(1, '해상도를 입력하세요'),
  duration: z.number().min(1, '재생시간을 입력하세요'),
})

export type Material = z.infer<typeof materialSchema>
export type MaterialInput = z.infer<typeof materialInputSchema>
