export type MediaStatus = 'online' | 'delayed' | 'error' | 'offline' | 'inactive' | 'unlinked'
export type SyncStatus = 'synced' | 'delayed' | 'error' | 'pending'
export type MediaType = '고정형' | '이동형'
export type DisplayType = 'LCD' | 'LED' | '기타'
export type Orientation = '가로형' | '세로형'
export type OperatingDays = '매일' | '평일' | '주말' | '직접선택'
export type OperatingHours = '24시간' | '직접입력'
export type HcResult = 'hc-ok' | 'hc-warn' | 'hc-err'

export interface Media {
  id: string
  name: string
  location: string
  companyId: string
  companyName: string
  type: MediaType
  displayType: DisplayType
  displayTypeOther?: string
  orientation: Orientation
  resolution: string
  screenSize: string
  ledPitch?: string
  operatingDays: OperatingDays
  operatingDaysCustom?: string[]
  operatingHoursType: OperatingHours
  operatingHoursStart?: string
  operatingHoursEnd?: string
  operatingHours: string
  status: MediaStatus
  syncStatus: SyncStatus
  registeredAt: string
  note?: string
}

export interface MediaDevice {
  deviceId: string
  os: string
  appVersion: string
  networkType: string
  ip: string
  lastConnected: string
}

export interface HealthCheck {
  id: string
  timestamp: string
  result: HcResult
  message: string
}

export interface MediaDetail extends Media {
  device?: MediaDevice
  healthChecks: HealthCheck[]
}

export interface MediaCompany {
  id: string
  name: string
  regNumber: string
  representative: string
  phone?: string
  address?: string
  mediaCount: number
  registeredAt: string
}

export interface MediaGroup {
  id: string
  name: string
  assignedMediaIds: string[]
}

export interface MediaListParams {
  status?: string
  type?: string
  company?: string
  q?: string
  page?: number
}
