'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRole, type Role } from '@/hooks/useRole'
import styles from './Sidebar.module.css'

interface MenuItem {
  id: string
  label: string
  href: string
  roles: Role[]
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard',       label: '대시보드',   href: '/',                       roles: ['admin','media','ops'] },
  { id: 'media-companies', label: '매체사 관리', href: '/media/companies',        roles: ['admin'] },
  { id: 'media',           label: '매체 관리',  href: '/media',                  roles: ['admin','media','ops'] },
  { id: 'materials',       label: '소재 관리',  href: '/materials',              roles: ['admin','media','ops','sales'] },
  { id: 'campaigns',       label: '캠페인 관리', href: '/campaigns',              roles: ['admin','media','ops'] },
  { id: 'schedules',       label: '편성 관리',  href: '/schedules',              roles: ['admin','media','ops'] },
  { id: 'notifications',   label: '알림 센터',  href: '/notifications',          roles: ['admin','media','ops','sales'] },
  { id: 'users',           label: '사용자 관리', href: '/settings/users',         roles: ['admin','media'] },
  { id: 'reports',         label: '리포트',     href: '/reports',                roles: ['admin','media','ops'] },
  { id: 'notif-settings',  label: '알림 설정',  href: '/settings/notifications', roles: ['admin','media','ops','sales'] },
]

export function Sidebar() {
  const [role] = useRole()
  const pathname = usePathname()
  const visible = MENU_ITEMS.filter(item => item.roles.includes(role))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuLabel}>메뉴</div>
      <nav>
        {visible.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
