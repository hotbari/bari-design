'use client'

import Link from 'next/link'
import styles from './TopBar.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface TopBarProps {
  breadcrumbs: BreadcrumbItem[]
}

export function TopBar({ breadcrumbs }: TopBarProps) {
  const today = new Date().toLocaleDateString('ko-KR', {
    year: 'numeric', month: 'long', day: 'numeric', weekday: 'short',
  })

  return (
    <header className={styles.topbar}>
      <nav className={styles.breadcrumb} aria-label="breadcrumb">
        {breadcrumbs.map((crumb, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {i > 0 && <span className={styles.sep}>›</span>}
            {crumb.href ? (
              <Link href={crumb.href}>{crumb.label}</Link>
            ) : (
              <span className={styles.current}>{crumb.label}</span>
            )}
          </span>
        ))}
      </nav>
      <div className={styles.right}>
        <span className={styles.date}>{today}</span>
        <button className={styles.bellBtn} aria-label="알림">
          🔔
        </button>
      </div>
    </header>
  )
}
