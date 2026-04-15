'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

type SlackStatus = 'connected' | 'disconnected'

interface ChannelMapping {
  event: string
  tag: 'et-critical' | 'et-warning' | 'et-info'
  tagLabel: string
  channel: string
  options: string[]
}

const CHANNEL_MAPPINGS: ChannelMapping[] = [
  {
    event: '매체 오프라인 / 긴급 편성', tag: 'et-critical', tagLabel: '긴급',
    channel: '#bari-alerts',
    options: ['#bari-alerts', '#bari-critical', '#general', '채널 없음'],
  },
  {
    event: '편성 충돌 / 지연', tag: 'et-warning', tagLabel: '경고',
    channel: '#bari-alerts',
    options: ['#bari-alerts', '#bari-ops', '#general', '채널 없음'],
  },
  {
    event: '캠페인 승인 요청', tag: 'et-info', tagLabel: '정보',
    channel: '#bari-approvals',
    options: ['#bari-approvals', '#bari-ops', '#general', '채널 없음'],
  },
  {
    event: '즉시 반영 완료', tag: 'et-info', tagLabel: '정보',
    channel: '#bari-ops',
    options: ['#bari-ops', '#bari-alerts', '채널 없음'],
  },
  {
    event: '신규 사용자 합류', tag: 'et-info', tagLabel: '정보',
    channel: '#bari-team',
    options: ['#bari-team', '#general', '채널 없음'],
  },
]

const TAG_CLASS: Record<string, string> = {
  'et-critical': styles.etCritical,
  'et-warning':  styles.etWarning,
  'et-info':     styles.etInfo,
}

export default function SystemSettingsPage() {
  const [slackStatus] = useState<SlackStatus>('connected')
  const [channels, setChannels] = useState<string[]>(CHANNEL_MAPPINGS.map(m => m.channel))
  const [changed, setChanged] = useState(false)
  const [toast, setToast] = useState('')

  function handleChannelChange(idx: number, val: string) {
    setChannels(prev => { const next = [...prev]; next[idx] = val; return next })
    setChanged(true)
  }

  function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setChanged(false)
    setToast('시스템 설정이 저장되었습니다.')
    setTimeout(() => setToast(''), 2800)
  }

  function handleTestMessage() {
    setToast('테스트 메시지가 #bari-alerts로 전송되었습니다.')
    setTimeout(() => setToast(''), 2800)
  }

  return (
    <>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <span className={styles.breadcrumbItem}>설정</span>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>시스템 설정</span>
        </nav>
      </header>

      <div className={styles.settingsLayout}>
        <nav className={styles.settingsNav} aria-label="설정 메뉴">
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>내 계정</div>
            <Link href="/settings/profile" className={styles.navItem}>프로필</Link>
            <Link href="/settings/notifications" className={styles.navItem}>알림 설정</Link>
            <Link href="/settings/security" className={styles.navItem}>보안</Link>
          </div>
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>시스템 (어드민)</div>
            <Link href="/settings/system" className={`${styles.navItem} ${styles.navItemActive}`}>시스템 설정</Link>
          </div>
        </nav>

        <div className={styles.content}>
          <div className={styles.pageTitle}>
            <h1 className={styles.pageTitleText}>시스템 설정</h1>
            <span className={styles.adminBadge}>어드민 전용</span>
          </div>

          <form onSubmit={handleSave}>
            {/* Slack integration card */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.cardTitle}>Slack 연동</span>
                <div className={styles.slackStatus}>
                  {slackStatus === 'connected' ? (
                    <span className={styles.slackConnectedBadge}>
                      <span className={styles.slackConnectedDot} />
                      연결됨
                    </span>
                  ) : (
                    <span className={styles.slackDisconnectedBadge}>연결 안됨</span>
                  )}
                </div>
              </div>

              <div className={styles.cardBody}>
                {slackStatus === 'connected' ? (
                  <>
                    <div className={styles.slackInfo}>
                      <div className={styles.slackInfoRow}>
                        <span className={styles.slackInfoLabel}>워크스페이스</span>
                        <span>Bari OOH Team</span>
                      </div>
                      <div className={styles.slackInfoRow}>
                        <span className={styles.slackInfoLabel}>연결일</span>
                        <span>2026-03-01</span>
                      </div>
                      <div className={styles.slackInfoRow}>
                        <span className={styles.slackInfoLabel}>Bot</span>
                        <span>@bari-bot</span>
                      </div>
                      <div style={{ marginTop: 4 }}>
                        <button type="button" className="btn btn-danger" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)' }}>
                          연결 해제
                        </button>
                      </div>
                    </div>

                    {/* Channel mapping table */}
                    <div className={styles.tableWrap}>
                      <div className={styles.tableSectionTitle}>이벤트별 채널 매핑</div>
                      <table className={styles.table} aria-label="이벤트별 채널 매핑">
                        <thead>
                          <tr>
                            <th>이벤트</th>
                            <th>태그</th>
                            <th>채널</th>
                          </tr>
                        </thead>
                        <tbody>
                          {CHANNEL_MAPPINGS.map((mapping, idx) => (
                            <tr key={mapping.event}>
                              <td>{mapping.event}</td>
                              <td>
                                <span className={`${styles.eventTag} ${TAG_CLASS[mapping.tag]}`}>
                                  {mapping.tagLabel}
                                </span>
                              </td>
                              <td>
                                <select
                                  className={styles.channelSelect}
                                  value={channels[idx]}
                                  onChange={e => handleChannelChange(idx, e.target.value)}
                                  aria-label={`${mapping.event} 채널`}
                                >
                                  {mapping.options.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className={styles.testRow}>
                      <p className={styles.testDesc}>
                        <span className={styles.testDescBold}>Bot 연결 테스트</span>&nbsp;—&nbsp;
                        #bari-alerts 채널로 테스트 메시지를 전송합니다
                      </p>
                      <button type="button" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)' }} onClick={handleTestMessage}>
                        테스트 메시지 전송
                      </button>
                    </div>
                  </>
                ) : (
                  <div className={styles.slackDisconnected}>
                    <p className={styles.slackDisconnectedDesc}>
                      Slack 워크스페이스와 연동하면 매체 오프라인, 편성 충돌, 캠페인 승인 등<br />
                      주요 이벤트 알림을 Slack 채널로 즉시 수신할 수 있습니다.
                    </p>
                    <button type="button" className="btn btn-primary">
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                        <path d="M5.042 15.165a2.528 2.528 0 0 1-2.52 2.523A2.528 2.528 0 0 1 0 15.165a2.527 2.527 0 0 1 2.522-2.52h2.52v2.52zM6.313 15.165a2.527 2.527 0 0 1 2.521-2.52 2.527 2.527 0 0 1 2.521 2.52v6.313A2.528 2.528 0 0 1 8.834 24a2.528 2.528 0 0 1-2.521-2.522v-6.313zM8.834 5.042a2.528 2.528 0 0 1-2.521-2.52A2.528 2.528 0 0 1 8.834 0a2.528 2.528 0 0 1 2.521 2.522v2.52H8.834zM8.834 6.313a2.528 2.528 0 0 1 2.521 2.521 2.528 2.528 0 0 1-2.521 2.521H2.522A2.528 2.528 0 0 1 0 8.834a2.528 2.528 0 0 1 2.522-2.521h6.312zM18.956 8.834a2.528 2.528 0 0 1 2.522-2.521A2.528 2.528 0 0 1 24 8.834a2.528 2.528 0 0 1-2.522 2.521h-2.522V8.834zM17.688 8.834a2.528 2.528 0 0 1-2.523 2.521 2.527 2.527 0 0 1-2.52-2.521V2.522A2.527 2.527 0 0 1 15.165 0a2.528 2.528 0 0 1 2.523 2.522v6.312zM15.165 18.956a2.528 2.528 0 0 1 2.523 2.522A2.528 2.528 0 0 1 15.165 24a2.527 2.527 0 0 1-2.52-2.522v-2.522h2.52zM15.165 17.688a2.527 2.527 0 0 1-2.52-2.523 2.526 2.526 0 0 1 2.52-2.52h6.313A2.527 2.527 0 0 1 24 15.165a2.528 2.528 0 0 1-2.522 2.523h-6.313z"/>
                      </svg>
                      Slack으로 연결
                    </button>
                  </div>
                )}
              </div>
            </div>

            {changed && (
              <div className={styles.saveBar}>
                <button type="button" className="btn btn-secondary" onClick={() => {
                  setChannels(CHANNEL_MAPPINGS.map(m => m.channel))
                  setChanged(false)
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
