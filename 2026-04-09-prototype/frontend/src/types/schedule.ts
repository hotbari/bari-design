import { z } from 'zod'

export const scheduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'pending', 'done', 'paused']),
  priority: z.number(),
  mediaNames: z.array(z.string()),
  startAt: z.string(),
  endAt: z.string(),
  playlistName: z.string(),
  campaignName: z.string().nullable(),
  syncStatus: z.enum(['ok', 'lag', 'none']),
  syncLagMinutes: z.number().nullable(),
  editingUsers: z.array(z.string()),
})

export const scheduleInputSchema = z.object({
  name: z.string().min(1, '편성명을 입력하세요'),
  priority: z.number().min(1).max(5),
  mediaIds: z.array(z.string()).min(1, '매체를 선택하세요'),
  startAt: z.string().min(1, '시작일을 입력하세요'),
  endAt: z.string().min(1, '종료일을 입력하세요'),
  playlistId: z.string().min(1, '플레이리스트를 선택하세요'),
  campaignId: z.string().optional(),
})

export type Schedule = z.infer<typeof scheduleSchema>
export type ScheduleInput = z.infer<typeof scheduleInputSchema>
