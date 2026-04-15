export type MediaStatus = 'online' | 'delayed' | 'error' | 'offline' | 'inactive' | 'unlinked'
export type MediaSync = 'synced' | 'delayed' | 'error' | 'pending'
export type MediaType = '고정형' | '이동형'

export interface Media {
  id: string
  name: string
  address: string
  company: string
  companyId: string
  type: MediaType
  resolution: string
  status: MediaStatus
  sync: MediaSync
  operatingHours: string
  registeredAt: string
}

export interface MediaDetail extends Media {
  description?: string
  displayType: string
  screenSize: string
  ledPitch?: string
  orientation: string
  operatingDays: string
  deviceId?: string
  linkedAt?: string
  playerVersion?: string
  lastContact?: string
  healthHistory: { datetime: string; result: 'hc-ok' | 'hc-warn' | 'hc-err'; responseTime: number; detail: string }[]
}
