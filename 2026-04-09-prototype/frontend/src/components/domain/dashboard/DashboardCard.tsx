import { Card } from '@/components/ui/Card'
import styles from './dashboard.module.css'

interface DashboardCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export function DashboardCard({ label, value, sub, accent }: DashboardCardProps) {
  return (
    <Card className={accent ? styles.accentCard : ''}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
      {sub && <p className={styles.cardSub}>{sub}</p>}
    </Card>
  )
}
