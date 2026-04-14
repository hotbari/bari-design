import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'maintenance', 'inactive']),
  type: z.enum(['billboard', 'signage', 'display', 'screen']),
  location: z.string(),
})

export const mediaInputSchema = z.object({
  name: z.string().min(1, '매체명을 입력하세요'),
  type: z.enum(['billboard', 'signage', 'display', 'screen']),
  location: z.string().min(1, '위치를 입력하세요'),
  status: z.enum(['active', 'maintenance', 'inactive']),
})

export type Media = z.infer<typeof mediaSchema>
export type MediaInput = z.infer<typeof mediaInputSchema>
