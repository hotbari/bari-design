'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import styles from './profile.module.css'

const BREADCRUMBS = [{ label: '설정' }, { label: '내 정보' }]

export default function ProfilePage() {
  const { show } = useToast()
  const [name, setName] = useState('김관리')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    show('프로필이 저장되었습니다.')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="내 정보" />
      <div className={styles.card}>
        <form onSubmit={handleSave}>
          <div className={styles.field}>
            <label className={styles.label}>이름</label>
            <input value={name} onChange={e => setName(e.target.value)} className={styles.input} />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>이메일</label>
            <input value="admin@bari.com" disabled className={`${styles.input} ${styles.disabled}`} />
          </div>
          <div className={styles.divider} />
          <div className={styles.sectionTitle}>비밀번호 변경</div>
          <div className={styles.field}>
            <label className={styles.label}>현재 비밀번호</label>
            <input type="password" className={styles.input} placeholder="현재 비밀번호 입력" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>새 비밀번호</label>
            <input type="password" className={styles.input} placeholder="새 비밀번호 입력" />
          </div>
          <div className={styles.field}>
            <label className={styles.label}>비밀번호 확인</label>
            <input type="password" className={styles.input} placeholder="비밀번호 재입력" />
          </div>
          <div className={styles.footer}>
            <Button type="submit">저장</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
