'use client'
import styles from './Tabs.module.css'

interface Tab { id: string; label: string }

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={active === tab.id}
          aria-controls={`tabpanel-${tab.id}`}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ id, active, children }: { id: string; active: string; children: React.ReactNode }) {
  return (
    <div id={`tabpanel-${id}`} role="tabpanel" hidden={active !== id}>
      {children}
    </div>
  )
}
