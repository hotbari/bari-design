import styles from './Toggle.module.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Toggle({ checked, onChange, label, disabled = false, id }: ToggleProps) {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        id={id}
        className={styles.input}
      />
      <span className={`${styles.track} ${checked ? styles.on : ''}`} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
