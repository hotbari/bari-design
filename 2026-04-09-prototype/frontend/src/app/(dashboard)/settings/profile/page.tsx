'use client'
import { Button } from '@/components/ui/Button'
import styles from '../settings.module.css'

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>내 프로필</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>기본 정보</h2>
        <div className={styles.field}>
          <label htmlFor="profile-name" className={styles.label}>이름</label>
          <input id="profile-name" className={styles.input} defaultValue="김관리" />
        </div>
        <div className={styles.field}>
          <label htmlFor="profile-email" className={styles.label}>이메일</label>
          <input id="profile-email" className={styles.input} type="email" defaultValue="kim@bari.io" disabled style={{ background: 'var(--color-neutral-50)', color: 'var(--color-neutral-500)' }} />
        </div>
        <div className={styles.actions}>
          <Button>저장</Button>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
        <div className={styles.field}>
          <label htmlFor="profile-current-pw" className={styles.label}>현재 비밀번호</label>
          <input id="profile-current-pw" className={styles.input} type="password" />
        </div>
        <div className={styles.field}>
          <label htmlFor="profile-new-pw" className={styles.label}>새 비밀번호</label>
          <input id="profile-new-pw" className={styles.input} type="password" />
        </div>
        <div className={styles.actions}>
          <Button variant="secondary">비밀번호 변경</Button>
        </div>
      </section>
    </div>
  )
}
