export type ReportStatus = 'generating' | 'done' | 'fail'
export type ReportType = 'campaign' | 'media' | 'schedule'

export interface Report {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  startDate: string
  endDate: string
  mediaIds: string[]
  createdAt: string
  downloadUrl?: string
}

export interface FootTrafficDataPoint {
  hour: string
  count: number
  baseline: number
}

export interface FootTrafficSeries {
  mediaId: string
  mediaName: string
  data: FootTrafficDataPoint[]
}

export interface SspMapping {
  sspMediaId: string
  cmsMediaName: string
  location: string
  status: 'success' | 'error'
}

export interface SspEventLog {
  id: string
  status: 'success' | 'error'
  event: string
  mediaId: string
  responseCode: number
  responseTime: number
  timestamp: string
}
