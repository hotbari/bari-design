'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

const navItems = [
  { label: '대시보드', href: '/', icon: '⬛' },
  {
    group: '매체 관리',
    items: [
      { label: '매체사 관리', href: '/media/companies', icon: '🏢' },
      { label: '매체 목록', href: '/media', icon: '📺' },
      { label: '매체 그룹', href: '/media/groups', icon: '🗂️' },
      { label: 'SSP 연동', href: '/media/ssp-integration', icon: '🔗' },
      { label: '유동인구 연결', href: '/media/foot-traffic', icon: '👥' },
    ],
  },
  {
    group: '소재 관리',
    items: [
      { label: '소재 목록', href: '/materials', icon: '🖼️' },
      { label: '소재 규격 안내', href: '/materials/spec-guide', icon: '📋' },
    ],
  },
  {
    group: '캠페인 관리',
    items: [
      { label: '캠페인 목록', href: '/campaigns', icon: '📣' },
    ],
  },
  {
    group: '편성 관리',
    items: [
      { label: '재생목록', href: '/playlists', icon: '▶️' },
      { label: '편성표', href: '/schedules', icon: '📅' },
      { label: '긴급 편성', href: '/schedules/emergency', icon: '🚨' },
      { label: '잔여 구좌', href: '/schedules/slot-remaining', icon: '📊' },
    ],
  },
  {
    group: '리포트',
    items: [
      { label: '리포트 목록', href: '/reports', icon: '📈' },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === '/') return pathname === '/'
    return pathname.startsWith(href)
  }

  return (
    <aside className={styles.sidebar}>
      <div className={styles.logo}>
        <div className={styles.logoText}>Bari DOOH</div>
        <div className={styles.logoSub}>매체 관리 플랫폼</div>
      </div>
      <nav className={styles.nav}>
        {navItems.map((item, i) => {
          if ('href' in item && item.href) {
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navItem} ${isActive(item.href) ? styles.active : ''}`}
              >
                <span className={styles.navIcon}>{item.icon}</span>
                {item.label}
              </Link>
            )
          }
          return (
            <div key={item.group} className={styles.navGroup}>
              {i > 0 && <div className={styles.divider} />}
              <div className={styles.navGroupLabel}>{item.group}</div>
              {(item.items || []).map(sub => (
                <Link
                  key={sub.href}
                  href={sub.href}
                  className={`${styles.navItem} ${styles.sub} ${isActive(sub.href) ? styles.active : ''}`}
                >
                  <span className={styles.navIcon}>{sub.icon}</span>
                  {sub.label}
                </Link>
              ))}
            </div>
          )
        })}
      </nav>
    </aside>
  )
}
