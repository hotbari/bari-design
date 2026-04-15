import styles from './layout.module.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <a href="#main-content" className="skip-link">본문으로 바로가기</a>
      <div className={styles.card} id="main-content">{children}</div>
    </div>
  )
}
