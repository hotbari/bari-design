'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: '대시보드',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="6" height="6" rx="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.2"/>
        <rect x="1" y="9" width="6" height="6" rx="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.2"/>
      </svg>
    ),
  },
  {
    href: '/media',
    label: '매체 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="3" width="14" height="10" rx="1.5"/>
        <path d="M5 13v2M11 13v2M3 15h10"/>
      </svg>
    ),
  },
  {
    href: '/materials',
    label: '소재 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="14" height="14" rx="1.5"/>
        <circle cx="6" cy="6" r="2"/>
        <path d="M1 11l4-3 3 2 3-4 4 5"/>
      </svg>
    ),
  },
  {
    href: '/campaigns',
    label: '캠페인 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="8" r="7"/>
        <polygon points="6,5 12,8 6,11" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: '/schedules',
    label: '편성 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="3" width="14" height="12" rx="1.5"/>
        <path d="M1 7h14M5 1v4M11 1v4"/>
      </svg>
    ),
    subnav: [
      { href: '/playlists', label: '재생목록' },
      { href: '/schedules', label: '편성표' },
      { href: '/slots', label: '잔여 구좌' },
    ],
  },
  {
    href: '/users',
    label: '사용자 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="5" r="3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      </svg>
    ),
  },
  {
    href: '/reports',
    label: '리포트',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="14" height="14" rx="1.5"/>
        <path d="M4 11V8M7 11V6M10 11V9M13 11V5"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className={styles.sidebar} aria-label="주 내비게이션">
      <div className={styles.logo}>
        <div className={styles.logoMark}>B</div>
        <span className={styles.logoName}>Bari CMS</span>
      </div>

      <div className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
            {item.subnav && isActive(item.href) && (
              <div className={styles.subnav}>
                {item.subnav.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`${styles.subitem} ${pathname === sub.href ? styles.subitemActive : ''}`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer} role="button" tabIndex={0} aria-label="내 프로필">
        <div className={styles.footerAvatar}>김</div>
        <div className={styles.footerInfo}>
          <div className={styles.footerRole}>어드민</div>
          <div className={styles.footerName}>김관리</div>
        </div>
      </div>
    </nav>
  )
}
