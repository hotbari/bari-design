'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useSspIntegration } from '@/hooks/reports/useReports'
import { useToast } from '@/components/ui/Toast'
import styles from './ssp.module.css'

const BREADCRUMBS = [{ label: '매체 관리' }, { label: 'SSP 연동 설정' }]

function statusBadgeVariant(status: string) {
  if (status === 'success') return 'done'
  if (status === 'error') return 'fail'
  return 'pending'
}

function statusBadgeLabel(status: string) {
  if (status === 'success') return '연동 중'
  if (status === 'error') return '연동 오류'
  return '대기'
}

function integrationBadgeVariant(status: string) {
  if (status === 'success') return 'done'
  if (status === 'error') return 'fail'
  return 'pending'
}

function integrationBadgeLabel(status: string) {
  if (status === 'success') return '연동됨'
  if (status === 'error') return '오류'
  return '대기'
}

export default function SspIntegrationPage() {
  const { data, isLoading } = useSspIntegration()
  const { show } = useToast()
  const [showKey, setShowKey] = useState(false)
  const [apiKey, setApiKey] = useState('')

  const handleCopy = () => {
    if (data?.webhookUrl) {
      navigator.clipboard.writeText(data.webhookUrl)
      show('Webhook URL이 복사되었습니다.')
    }
  }

  const handleSave = () => {
    show('설정이 저장되었습니다.')
  }

  if (isLoading) return <AppShell breadcrumbs={BREADCRUMBS}><p>로딩 중...</p></AppShell>

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="SSP 연동 설정"
        actions={<Badge variant={integrationBadgeVariant(data?.integrationStatus)} label={integrationBadgeLabel(data?.integrationStatus)} />}
      />

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>SSP 연동</span>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Webhook URL</label>
          <div className={styles.copyRow}>
            <input type="text" className={`${styles.input} ${styles.inputReadonly}`} value={data?.webhookUrl ?? ''} readOnly />
            <Button type="button" variant="secondary" onClick={handleCopy}>복사</Button>
          </div>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>API Key</label>
          <div className={styles.passwordWrap}>
            <input
              type={showKey ? 'text' : 'password'}
              className={styles.input}
              value={apiKey}
              onChange={e => setApiKey(e.target.value)}
              placeholder="API 키 입력"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey(v => !v)} aria-label="API 키 표시 전환">
              {showKey ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {data?.lastEventAt && (
          <p className={styles.metaText}>마지막 이벤트 수신: {new Date(data.lastEventAt).toLocaleString('ko-KR')}</p>
        )}
        <div className={styles.footer}>
          <Button type="button" variant="secondary">연결 테스트</Button>
          <Button type="button" onClick={handleSave}>저장</Button>
        </div>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>매체 매핑</span>
          <Button size="sm" variant="secondary">+ 매핑 추가</Button>
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
            {(data?.mappings ?? []).map((m: { sspMediaId: string; cmsMediaName: string; location: string; status: string }) => (
              <tr key={m.sspMediaId}>
                <td className={styles.mono}>{m.sspMediaId}</td>
                <td className={styles.mediaName}>{m.cmsMediaName}</td>
                <td className={styles.location}>{m.location}</td>
                <td>
                  <span className={`${styles.badge} ${m.status === 'success' ? styles.badgeSuccess : styles.badgeError}`}>
                    {statusBadgeLabel(m.status)}
                  </span>
                </td>
                <td>
                  <Button size="sm" variant="secondary">수정</Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>이벤트 로그</span>
        </div>
        <ul className={styles.logList} aria-live="polite">
          {(data?.eventLogs ?? []).map((log: { id: string; status: string; event: string; mediaId: string; responseCode: number; responseTime: number; timestamp: string }) => (
            <li key={log.id} className={styles.logItem}>
              <div className={`${styles.dot} ${log.status === 'success' ? styles.dotSuccess : styles.dotError}`} aria-hidden="true" />
              <div className={styles.logBody}>
                <div className={styles.logEvent}>{log.event}</div>
                <div className={styles.logDetail}>
                  {log.mediaId} · {log.responseCode} · {log.responseTime}ms
                </div>
              </div>
              <time className={styles.logTime}>{new Date(log.timestamp).toLocaleTimeString('ko-KR')}</time>
            </li>
          ))}
        </ul>
      </div>
    </AppShell>
  )
}
