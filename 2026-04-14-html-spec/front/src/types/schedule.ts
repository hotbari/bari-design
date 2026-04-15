export type ScheduleStatus = 'active' | 'pending' | 'done'
export type SchedulePriority = 'prio-1' | 'prio-2' | 'prio-3'
export type ScheduleSyncStatus = 'sync-ok' | 'sync-lag' | 'sync-none'

export interface Schedule {
  id: string
  name: string
  mediaId: string
  mediaName: string
  playlistId: string
  playlistName: string
  campaignId?: string
  campaignName?: string
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  priority: SchedulePriority
  status: ScheduleStatus
  syncStatus: ScheduleSyncStatus
  daysOfWeek: number[]
  createdAt: string
}

export interface SlotRemaining {
  mediaId: string
  mediaName: string
  date: string
  totalSlots: number
  usedSlots: number
  remainingSlots: number
  remainingPct: number
}
