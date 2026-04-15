'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './page.module.css'

interface SspData {
  integrationStatus: 'success' | 'error' | 'pending'
  webhookUrl: string
  apiKey: string
  lastEventAt: string
  mappings: { id: string; sspMediaId: string; cmsMediaName: string; location: string; status: 'success' | 'error' }[]
  eventLogs: { id: string; status: 'success' | 'error'; eventName: string; detail: string; time: string }[]
}

async function fetchSsp(): Promise<SspData> {
  const res = await fetch('/api/media/ssp')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const STATUS_LABEL: Record<string, string> = { success: '연동 중', error: '연동 오류', pending: '대기 중' }

export default function SspPage() {
  const { data, isLoading } = useQuery({ queryKey: ['ssp'], queryFn: fetchSsp })
  const [showApiKey, setShowApiKey] = useState(false)
  const [copied, setCopied] = useState(false)

  function copyWebhook() {
    navigator.clipboard.writeText(data?.webhookUrl ?? '')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return null

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>SSP 연동 설정</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>SSP 연동 설정</h1>
          <span className={`${styles.statusBadge} ${styles[`badge_${data.integrationStatus}`]}`}>{STATUS_LABEL[data.integrationStatus]}</span>
        </div>

        {/* SSP 연동 카드 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>SSP 연동</h2>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>Webhook URL</label>
            <div className={styles.fieldWithBtn}>
              <input className={styles.fieldInput} value={data.webhookUrl} readOnly />
              <button className={styles.btnCopy} onClick={copyWebhook}>{copied ? '복사됨' : '복사'}</button>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>API Key</label>
            <div className={styles.fieldWithBtn}>
              <input className={styles.fieldInput} type={showApiKey ? 'text' : 'password'} defaultValue={data.apiKey} />
              <button className={styles.btnIcon} onClick={() => setShowApiKey(v => !v)}>
                {showApiKey ? '🙈' : '👁'}
              </button>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>마지막 이벤트 수신</label>
            <span className={styles.readonlyText}>{data.lastEventAt}</span>
          </div>
          <div className={styles.cardActions}>
            <button className={styles.btnSecondary}>연결 테스트</button>
            <button className={styles.btnPrimary}>저장</button>
          </div>
        </div>

        {/* 매체 매핑 카드 */}
        <div className={styles.card}>
          <div className={styles.cardHeaderRow}>
            <h2 className={styles.cardTitle}>매체 매핑</h2>
            <button className={styles.btnAdd}>+ 매핑 추가</button>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>SSP 매체 ID</th>
                <th>CMS 매체명</th>
                <th>위치</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.mappings.map(m => (
                <tr key={m.id}>
                  <td className={styles.mono}>{m.sspMediaId}</td>
                  <td>{m.cmsMediaName}</td>
                  <td className={styles.tdSub}>{m.location}</td>
                  <td>
                    <span className={`${styles.mapBadge} ${m.status === 'success' ? styles.mapSuccess : styles.mapError}`}>
                      {m.status === 'success' ? '연동 중' : '연동 오류'}
                    </span>
                  </td>
                  <td><button className={styles.btnEdit}>수정</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 이벤트 로그 카드 */}
        <div className={styles.card} aria-live="polite">
          <h2 className={styles.cardTitle}>이벤트 로그 (최근 10건)</h2>
          <div className={styles.logList}>
            {data.eventLogs.map(log => (
              <div key={log.id} className={styles.logItem}>
                <span className={`${styles.logDot} ${log.status === 'success' ? styles.logDotSuccess : styles.logDotError}`} />
                <span className={styles.logEvent}>{log.eventName}</span>
                <span className={styles.logDetail}>{log.detail}</span>
                <span className={styles.logTime}>{log.time}</span>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  )
}
