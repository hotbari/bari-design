'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

type NotifKey =
  | 'media_offline'
  | 'schedule_conflict'
  | 'campaign_approval'
  | 'new_user'
  | 'sync_complete'
  | 'weekly_report'

interface NotifItem {
  key: NotifKey
  label: string
  desc: string
  defaultOn: boolean
}

const NOTIF_ITEMS: NotifItem[] = [
  { key: 'media_offline',      label: '매체 오프라인 경보',     desc: '매체 장치가 오프라인 상태로 전환될 때',  defaultOn: true },
  { key: 'schedule_conflict',  label: '편성 충돌 감지',         desc: '편성표에 시간 충돌이 발생할 때',         defaultOn: true },
  { key: 'campaign_approval',  label: '캠페인 승인 요청',       desc: '새 캠페인 승인 요청이 접수될 때',        defaultOn: true },
  { key: 'new_user',           label: '신규 사용자 합류',       desc: '새 사용자가 초대를 수락할 때',           defaultOn: true },
  { key: 'sync_complete',      label: '편성표 즉시 반영 완료',  desc: '긴급 편성 즉시 동기화가 완료될 때',      defaultOn: false },
  { key: 'weekly_report',      label: '주간 리포트 이메일',     desc: '매주 월요일 주간 성과 리포트 발송',       defaultOn: true },
]

export default function NotificationsPage() {
  const [notifs, setNotifs] = useState<Record<NotifKey, boolean>>(
    Object.fromEntries(NOTIF_ITEMS.map(n => [n.key, n.defaultOn])) as Record<NotifKey, boolean>
  )
  const [emailEnabled, setEmailEnabled] = useState(true)
  const [inAppEnabled, setInAppEnabled] = useState(true)
  const [changed, setChanged] = useState(false)
  const [toast, setToast] = useState('')

  function toggle(key: NotifKey) {
    setNotifs(prev => ({ ...prev, [key]: !prev[key] }))
    setChanged(true)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setChanged(false)
    setToast('알림 설정이 저장되었습니다.')
    setTimeout(() => setToast(''), 2800)
  }

  return (
    <>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <span className={styles.breadcrumbItem}>설정</span>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>알림 설정</span>
        </nav>
      </header>

      <div className={styles.settingsLayout}>
        <nav className={styles.settingsNav} aria-label="설정 메뉴">
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>내 계정</div>
            <Link href="/settings/profile" className={styles.navItem}>프로필</Link>
            <Link href="/settings/notifications" className={`${styles.navItem} ${styles.navItemActive}`}>알림 설정</Link>
            <Link href="/settings/security" className={styles.navItem}>보안</Link>
          </div>
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>시스템 (어드민)</div>
            <Link href="/settings/system" className={styles.navItem}>시스템 설정</Link>
          </div>
        </nav>

        <div className={styles.content}>
          <form onSubmit={handleSave}>
            {/* Notification channels */}
            <div className={styles.card} style={{ marginBottom: 24 }}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>알림 채널</h2>
                <p className={styles.cardSubtitle}>알림을 받을 채널을 선택합니다</p>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.channelGrid}>
                  <div className={styles.channelCard}>
                    <div className={styles.channelHeader}>
                      <span className={styles.channelName}>이메일</span>
                      <label className={styles.toggle} aria-label="이메일 알림">
                        <input type="checkbox" checked={emailEnabled} onChange={() => { setEmailEnabled(v => !v); setChanged(true) }} />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                    <p className={styles.channelDesc}>kim@bari.io 로 알림 이메일을 발송합니다</p>
                  </div>
                  <div className={styles.channelCard}>
                    <div className={styles.channelHeader}>
                      <span className={styles.channelName}>앱 내 알림</span>
                      <label className={styles.toggle} aria-label="앱 내 알림">
                        <input type="checkbox" checked={inAppEnabled} onChange={() => { setInAppEnabled(v => !v); setChanged(true) }} />
                        <span className={styles.toggleSlider} />
                      </label>
                    </div>
                    <p className={styles.channelDesc}>CMS 상단 알림 벨에 실시간 알림을 표시합니다</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Per-event notifications */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>이벤트별 알림</h2>
                <p className={styles.cardSubtitle}>받고 싶은 이벤트 알림을 개별 설정합니다</p>
              </div>
              <div className={styles.cardBody}>
                {NOTIF_ITEMS.map(item => (
                  <div key={item.key} className={styles.notifRow}>
                    <div className={styles.notifInfo}>
                      <div className={styles.notifLabel}>{item.label}</div>
                      <div className={styles.notifDesc}>{item.desc}</div>
                    </div>
                    <label className={styles.toggle} aria-label={item.label}>
                      <input
                        type="checkbox"
                        checked={notifs[item.key]}
                        onChange={() => toggle(item.key)}
                      />
                      <span className={styles.toggleSlider} />
                    </label>
                  </div>
                ))}
              </div>
            </div>

            {changed && (
              <div className={styles.saveBar}>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setNotifs(Object.fromEntries(NOTIF_ITEMS.map(n => [n.key, n.defaultOn])) as Record<NotifKey, boolean>)
                  setEmailEnabled(true); setInAppEnabled(true); setChanged(false)
                }}>취소</button>
                <button type="submit" className="btn btn-primary">저장</button>
              </div>
            )}
          </form>
        </div>
      </div>

      {toast && (
        <div className={styles.toast} role="status">
          <svg className={styles.toastIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </>
  )
}
