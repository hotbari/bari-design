export type ReviewStatus = 'done' | 'reviewing' | 'failed' | 'manual' | 'on-air' | 'waiting'
export type ScheduleStatus = 'on' | 'wait'
export type TimelineNodeStatus = 'done' | 'failed' | 'current' | 'waiting' | 'pending'

export interface TimelineStep {
  label: string
  status: TimelineNodeStatus
  time?: string
  elapsed?: string
}

export interface ScheduleEntry {
  mediaName: string
  scheduleName: string
  status: ScheduleStatus
  period: string
}

export interface VersionEntry {
  version: number
  isCurrent: boolean
  filename: string
  replacedAt: string
  reviewResult: ReviewStatus
}

export interface MaterialDetail {
  id: string
  name: string
  advertiser: string
  media: string
  resolution: string
  duration: string
  period: string
  reviewStatus: ReviewStatus
  scheduleConnected: boolean
  filename: string
  codec: string
  framerate: string
  fileSize: string
  timeline: TimelineStep[]
  schedules: ScheduleEntry[]
  versions: VersionEntry[]
  failReason?: string
  fixGuide?: string
}
