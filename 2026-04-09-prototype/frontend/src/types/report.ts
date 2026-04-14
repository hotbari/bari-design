import { z } from 'zod'

export const reportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['performance', 'campaign', 'operations']),
  period: z.string(),
  createdAt: z.string(),
  status: z.enum(['ready', 'generating', 'error']),
})

export const reportInputSchema = z.object({
  name: z.string().min(1, '리포트명을 입력하세요'),
  type: z.enum(['performance', 'campaign', 'operations']),
  startDate: z.string().min(1, '시작일을 입력하세요'),
  endDate: z.string().min(1, '종료일을 입력하세요'),
})

export const footTrafficSchema = z.object({
  id: z.string(),
  mediaId: z.string(),
  mediaName: z.string(),
  dataPointId: z.string(),
  lastReceived: z.string().nullable(),
  status: z.enum(['connected', 'error', 'disconnected']),
})

export const sspSchema = z.object({
  id: z.string(),
  name: z.string(),
  endpoint: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']),
  lastSync: z.string().nullable(),
})

export type Report = z.infer<typeof reportSchema>
export type ReportInput = z.infer<typeof reportInputSchema>
export type FootTraffic = z.infer<typeof footTrafficSchema>
export type Ssp = z.infer<typeof sspSchema>
