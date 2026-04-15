export type SystemStatus = 'sys-ok' | 'sys-warn' | 'sys-err'
export type DashboardRole = 'admin' | 'media-company' | 'ops-agency'

export interface AdminDashboardData {
  stats: { totalMedia: number; online: number; error: number; campaigns: number }
  systemStatus: { server: SystemStatus; db: SystemStatus; batch: SystemStatus }
  healthAlerts: Array<{ mediaId: string; mediaName: string; message: string; timestamp: string }>
  recentNotifications: Array<{ id: string; message: string; timestamp: string }>
}

export interface MediaCompanyDashboardData {
  stats: { totalMedia: number; online: number; activeCampaigns: number; monthlyImpressions: number }
  recentMedia: Array<{ id: string; name: string; status: string }>
}

export interface OpsAgencyDashboardData {
  stats: { assignedMedia: number; activeCampaigns: number; pendingMaterials: number }
  assignedMedia: Array<{ id: string; name: string; status: string }>
}
