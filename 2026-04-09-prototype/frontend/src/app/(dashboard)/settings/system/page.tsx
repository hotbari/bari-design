import styles from '../settings.module.css'
import { Button } from '@/components/ui/Button'

export default function SystemSettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>시스템 설정</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>일반</h2>
        <div className={styles.field}>
          <label htmlFor="sys-timezone" className={styles.label}>기본 시간대</label>
          <select id="sys-timezone" className={styles.input}>
            <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className={styles.field}>
          <label htmlFor="sys-lang" className={styles.label}>기본 언어</label>
          <select id="sys-lang" className={styles.input}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button>저장</Button>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>동기화</h2>
        <div className={styles.row}>
          <div>
            <p className={styles.rowLabel}>자동 동기화 간격</p>
            <p className={styles.rowSub}>편성 데이터를 매체에 자동 전송하는 주기</p>
          </div>
          <select id="sys-sync" className={styles.input} style={{ width: '120px' }}>
            <option value="5">5분</option>
            <option value="10">10분</option>
            <option value="30">30분</option>
          </select>
        </div>
      </section>
    </div>
  )
}
