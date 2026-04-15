export type ScheduleStatus = 'active' | 'pending' | 'done'
export type SchedulePriority = 'prio-1' | 'prio-2' | 'prio-3'
export type ScheduleSync = 'sync-ok' | 'sync-lag' | 'sync-none'

export interface Schedule {
  id: string
  name: string
  status: ScheduleStatus
  priority: SchedulePriority
  startDate: string
  endDate: string
  playlistName: string
  playlistId: string
  campaignName?: string
  campaignId?: string
  sync: ScheduleSync
  editingNow: boolean
  mediaId?: string
  mediaName?: string
}

export interface ScheduleDetail extends Schedule {
  slots: ScheduleSlot[]
}

export interface ScheduleSlot {
  dayOfWeek: string
  startTime: string
  endTime: string
  duration: number
}
