export type ReportStatus = 'generating' | 'done' | 'fail'
export type ReportType = 'campaign' | 'media' | 'schedule'

export interface Report {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  period: string
  createdBy: string
  createdAt: string
  fileSize?: string
  downloadUrl?: string
}
