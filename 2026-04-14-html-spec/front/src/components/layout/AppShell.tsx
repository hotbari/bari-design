import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

interface BreadcrumbItem {
  label: string
  href?: string
}

interface AppShellProps {
  breadcrumbs: BreadcrumbItem[]
  children: React.ReactNode
}

export function AppShell({ breadcrumbs, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar breadcrumbs={breadcrumbs} />
        <main className={styles.content}>
          {children}
        </main>
      </div>
    </div>
  )
}
