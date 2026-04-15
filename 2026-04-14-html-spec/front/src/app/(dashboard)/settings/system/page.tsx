'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/components/ui/Toast'
import styles from './system.module.css'

const BREADCRUMBS = [{ label: '설정' }, { label: '시스템 설정' }]

export default function SystemSettingsPage() {
  const { show } = useToast()
  const [syncInterval, setSyncInterval] = useState('10')
  const [logRetention, setLogRetention] = useState('30')
  const [timezone, setTimezone] = useState('Asia/Seoul')
  const [emailFrom, setEmailFrom] = useState('noreply@bari.com')

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    show('시스템 설정이 저장되었습니다.')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="시스템 설정" />
      <form onSubmit={handleSave}>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>동기화 설정</h2>
          <div className={styles.field}>
            <label className={styles.label}>동기화 주기 (분)</label>
            <input type="number" value={syncInterval} onChange={e => setSyncInterval(e.target.value)} className={styles.input} min="1" max="60" />
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>데이터 보관</h2>
          <div className={styles.field}>
            <label className={styles.label}>로그 보관 기간 (일)</label>
            <input type="number" value={logRetention} onChange={e => setLogRetention(e.target.value)} className={styles.input} min="7" />
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>국제화 설정</h2>
          <div className={styles.field}>
            <label className={styles.label}>타임존</label>
            <select value={timezone} onChange={e => setTimezone(e.target.value)} className={styles.input}>
              <option value="Asia/Seoul">Asia/Seoul (KST, UTC+9)</option>
              <option value="UTC">UTC</option>
            </select>
          </div>
        </div>
        <div className={styles.card}>
          <h2 className={styles.sectionTitle}>이메일 설정</h2>
          <div className={styles.field}>
            <label className={styles.label}>발신자 이메일</label>
            <input type="email" value={emailFrom} onChange={e => setEmailFrom(e.target.value)} className={styles.input} />
          </div>
        </div>
        <div className={styles.footer}>
          <Button type="submit">저장</Button>
        </div>
      </form>
    </AppShell>
  )
}
