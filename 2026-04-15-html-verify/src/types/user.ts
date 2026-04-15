export type UserRole = 'admin' | 'media' | 'ops' | 'sales'
export type UserStatus = 'active' | 'inactive' | 'invited' | 'expired'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  scope: string
  invitedAt?: string
  lastLogin?: string
}
