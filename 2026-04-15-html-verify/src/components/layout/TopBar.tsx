'use client'
import Link from 'next/link'
import { useRole, type Role } from '@/hooks/useRole'
import styles from './TopBar.module.css'

const ROLE_LABELS: Record<Role, string> = {
  admin: '어드민',
  media: '매체사',
  ops: '운영대행사',
  sales: '영업대행사',
}

export function TopBar() {
  const [role, setRole] = useRole()

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>DOOH CMS</Link>
        <span className={styles.sub}>Digital Out-of-Home</span>
      </div>
      <div className={styles.right}>
        <select
          className={styles.roleSwitcher}
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          aria-label="역할 전환"
        >
          {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Link href="/notifications" className={styles.bell} aria-label="알림">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </Link>
        <div className={styles.avatar} aria-label="내 계정">관</div>
      </div>
    </header>
  )
}
