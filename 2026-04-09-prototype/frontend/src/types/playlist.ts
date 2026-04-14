import { z } from 'zod'

export const playlistSlotSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  materialName: z.string(),
  duration: z.number(),
  order: z.number(),
})

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  slotCount: z.number(),
  duration: z.number(),
  slots: z.array(playlistSlotSchema).optional(),
})

export const playlistInputSchema = z.object({
  name: z.string().min(1, '플레이리스트명을 입력하세요'),
})

export type PlaylistSlot = z.infer<typeof playlistSlotSchema>
export type Playlist = z.infer<typeof playlistSchema>
export type PlaylistInput = z.infer<typeof playlistInputSchema>
