export type NotifCategory = 'all' | 'critical' | 'schedule' | 'campaign' | 'system'
export type NotifPriority = 'critical' | 'warning' | 'info' | 'success'

export interface Notification {
  id: string
  type: Exclude<NotifCategory, 'all'>
  priority: NotifPriority
  title: string
  desc: string
  time: string
  read: boolean
  link?: string
}
