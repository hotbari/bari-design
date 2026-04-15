export type MaterialReviewStatus = 'reviewing' | 'done' | 'failed' | 'manual'
export type MaterialOpsStatus = 'active' | 'scheduled' | 'expired'
export type MaterialFileType = 'image' | 'video'

export interface Material {
  id: string
  name: string
  fileType: MaterialFileType
  resolution: string
  fileSize: string
  duration?: number  // seconds, for video
  reviewStatus: MaterialReviewStatus
  opsStatus: MaterialOpsStatus
  campaignId?: string
  campaignName?: string
  uploadedBy: string
  uploadedAt: string
  note?: string
}
