'use client'
import styles from './DateRangePicker.module.css'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  label?: string
  required?: boolean
}

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, label, required }: DateRangePickerProps) {
  return (
    <div className={styles.wrap}>
      {label && <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>}
      <div className={styles.inputs}>
        <input type="date" className={styles.input} value={startDate} onChange={e => onStartChange(e.target.value)} />
        <span className={styles.sep}>~</span>
        <input type="date" className={styles.input} value={endDate} onChange={e => onEndChange(e.target.value)} />
      </div>
    </div>
  )
}
