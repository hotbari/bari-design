import { Suspense } from 'react'
import { RoleSelector } from './RoleSelector'
import styles from './TopBar.module.css'

interface TopBarProps {
  breadcrumb?: { label: string; href?: string }[]
}

export function TopBar({ breadcrumb = [] }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <nav className={styles.breadcrumb} aria-label="이동 경로">
        {breadcrumb.map((item, i) => (
          <span key={i} className={styles.breadcrumbGroup}>
            {i > 0 && <span className={styles.sep} aria-hidden>›</span>}
            <span className={`${styles.crumb} ${i === breadcrumb.length - 1 ? styles.current : ''}`}>
              {item.label}
            </span>
          </span>
        ))}
      </nav>
      <div className={styles.actions}>
        <Suspense fallback={null}>
          <RoleSelector />
        </Suspense>
        <button className={styles.iconBtn} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/>
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
