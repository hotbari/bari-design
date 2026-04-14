'use client'
import { useState } from 'react'
import { Toggle } from '@/components/ui/Toggle'
import styles from '../settings.module.css'

const notificationSettings = [
  { id: 'n1', label: '편성 동기화 오류', sub: '동기화 지연 또는 실패 시 알림', defaultOn: true },
  { id: 'n2', label: '소재 검수 결과', sub: '소재 승인/반려 시 알림', defaultOn: true },
  { id: 'n3', label: '캠페인 상태 변경', sub: '캠페인 시작/종료 시 알림', defaultOn: false },
  { id: 'n4', label: '잔여 슬롯 부족', sub: '잔여 슬롯 10% 미만 시 알림', defaultOn: true },
]

export default function NotificationsPage() {
  const [checked, setChecked] = useState<Record<string, boolean>>(
    Object.fromEntries(notificationSettings.map((n) => [n.id, n.defaultOn]))
  )

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>알림 설정</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>알림 항목</h2>
        {notificationSettings.map((n) => (
          <div key={n.id} className={styles.row}>
            <div>
              <p className={styles.rowLabel}>{n.label}</p>
              <p className={styles.rowSub}>{n.sub}</p>
            </div>
            <Toggle
              checked={checked[n.id]}
              onChange={(val) => setChecked((prev) => ({ ...prev, [n.id]: val }))}
            />
          </div>
        ))}
      </section>
    </div>
  )
}
