export interface StatItem { label: string; value: number | string; unit?: string }
export interface MediaStatusChip { status: 'online'|'delayed'|'error'|'offline'|'inactive'; count: number }
export interface CampaignStatusChip { status: 'active'|'draft'|'ended'; count: number }
export interface HealthCheckItem { id: string; name: string; status: 'error'|'delayed'|'offline'; detail: string }
export interface SystemStatus { label: string; status: 'sys-ok'|'sys-warn'|'sys-err'; detail: string }
export interface NotifItem { id: string; text: string; time: string; read: boolean }
export interface MapMarker { id: string; name: string; lat: number; lng: number; status: 'online'|'delayed'|'error'|'offline'|'inactive' }

// ── 신규 공통 인터페이스 ──────────────────────────────────────────────────
export interface SyncItem {
  id: string
  name: string
  status: 'synced' | 'delayed' | 'failed'
  detail?: string
}

export interface ScheduleItem {
  id: string
  date: string
  title: string
  status: 'confirmed' | 'reviewing' | 'pending'
}

export interface PendingMaterial {
  id: string
  name: string
  status: 'reviewing' | 'pending'
  progress: number
  eta: string | null
}

export interface ManagedCompany {
  id: string
  name: string
  mediaCount: number
  status: 'ok' | 'warn' | 'error'
  detail?: string
}

export interface TodoTask {
  id: string
  title: string
  priority: 'urgent' | 'today' | 'normal'
  done: boolean
}

export interface RecentSchedule {
  id: string
  title: string
  status: 'done' | 'delayed' | 'pending'
}

// ── 역할별 대시보드 타입 ─────────────────────────────────────────────────
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
  syncStatus: SyncItem[]
  weeklySchedule: ScheduleItem[]
  pendingMaterials: PendingMaterial[]
  notifications: NotifItem[]
}

export interface OpsDashboard {
  stats: StatItem[]
  managedCompanies: ManagedCompany[]
  weeklyScheduleProgress: { done: number; total: number }
  recentSchedules: RecentSchedule[]
  todayTasks: TodoTask[]
  notifications: NotifItem[]
}

export interface SalesDashboard {
  stats: StatItem[]
  campaigns: { id: string; name: string; status: 'active' | 'reviewing' | 'draft' | 'ended' }[]
  pendingMaterials: PendingMaterial[]
  notifications: NotifItem[]
}
