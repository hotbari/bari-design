import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  desc?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, desc, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
