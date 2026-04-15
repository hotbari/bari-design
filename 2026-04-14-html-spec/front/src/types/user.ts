export type UserRole = 'admin' | 'media' | 'ops' | 'sales'
export type UserStatus = 'active' | 'inactive' | 'invited' | 'expired'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  company?: string
  registeredAt: string
  lastLoginAt?: string
}

export interface Notification {
  id: string
  message: string
  type: 'info' | 'warning' | 'error'
  read: boolean
  timestamp: string
}
