'use client'
import styles from './Badge.module.css'

interface BadgeProps {
  variant: string
  label: string
}

export function Badge({ variant, label }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant] ?? ''}`}>{label}</span>
}
