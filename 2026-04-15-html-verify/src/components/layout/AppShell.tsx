import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
