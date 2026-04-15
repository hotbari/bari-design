export interface StatItem { label: string; value: number | string; unit?: string }
export interface MediaStatusChip { status: 'online'|'delayed'|'error'|'offline'|'inactive'; count: number }
export interface CampaignStatusChip { status: 'active'|'draft'|'ended'; count: number }
export interface HealthCheckItem { id: string; name: string; status: 'error'|'delayed'|'offline'; detail: string }
export interface SystemStatus { label: string; status: 'sys-ok'|'sys-warn'|'sys-err'; detail: string }
export interface NotifItem { id: string; text: string; time: string; read: boolean }
export interface MapMarker { id: string; name: string; lat: number; lng: number; status: 'online'|'delayed'|'error'|'offline'|'inactive' }

export interface AdminDashboard {
  stats: StatItem[]
  mediaChips: MediaStatusChip[]
  campaignChips: CampaignStatusChip[]
  healthIssues: HealthCheckItem[]
  system: SystemStatus[]
  notifications: NotifItem[]
  alertBanner?: { message: string; links: { label: string; href: string }[] }
  mapMarkers: MapMarker[]
}

export interface MediaDashboard {
  stats: StatItem[]
  campaignChips: CampaignStatusChip[]
  notifications: NotifItem[]
  pendingMaterials: { id: string; name: string; status: string }[]
}

export interface OpsDashboard {
  stats: StatItem[]
  scheduleAlerts: { id: string; message: string; severity: 'error'|'warn' }[]
  notifications: NotifItem[]
}
