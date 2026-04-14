import Link from 'next/link'
import styles from './complete.module.css'

export default function SignupCompletePage() {
  return (
    <div className={styles.card}>
      <div className={styles.icon}>✓</div>
      <div className={styles.body}>
        <h1 className={styles.title}>가입이 완료되었습니다</h1>
        <p className={styles.sub}>관리자 승인 후 서비스를 이용하실 수 있습니다.</p>
      </div>
      <Link href="/login" className={styles.link}>로그인 화면으로</Link>
    </div>
  )
}
