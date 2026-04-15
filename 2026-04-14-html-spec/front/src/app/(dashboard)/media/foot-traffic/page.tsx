'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { useFootTraffic } from '@/hooks/reports/useReports'
import { useToast } from '@/components/ui/Toast'
import styles from './foot-traffic.module.css'

const BREADCRUMBS = [{ label: '매체 관리' }, { label: '유동인구 데이터 연동' }]

const PROVIDER_ENDPOINTS: Record<string, string> = {
  skt: 'https://api.skt.com/foottraffic/v1',
  kt: 'https://api.kt.com/foottraffic/v2',
  custom: '',
}

function mappingBadgeClass(status: string) {
  if (status === 'success') return styles.badgeSuccess
  if (status === 'pending') return styles.badgePending
  return styles.badgeDisconnected
}

function mappingBadgeLabel(status: string) {
  if (status === 'success') return '정상'
  if (status === 'pending') return '지연'
  return '미연결'
}

function connectionBadgeVariant(status: string) {
  if (status === 'success') return 'done'
  if (status === 'error') return 'fail'
  return 'pending'
}

function connectionBadgeLabel(status: string) {
  if (status === 'success') return '연결됨'
  if (status === 'error') return '오류'
  if (status === 'pending') return '연결 중'
  return '미연결'
}

export default function FootTrafficPage() {
  const { data, isLoading } = useFootTraffic()
  const { show } = useToast()
  const [provider, setProvider] = useState(data?.provider ?? 'skt')
  const [endpoint, setEndpoint] = useState(PROVIDER_ENDPOINTS[data?.provider ?? 'skt'] ?? '')
  const [showKey, setShowKey] = useState(false)
  const [authKey, setAuthKey] = useState('')
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'ok' | 'fail' | null>(null)

  const handleProviderChange = (v: string) => {
    setProvider(v)
    setEndpoint(v !== 'custom' ? PROVIDER_ENDPOINTS[v] : '')
    setTestResult(null)
  }

  const handleTest = async () => {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 1200))
    setTestResult('ok')
    setTesting(false)
  }

  const handleSave = () => {
    show('설정이 저장되었습니다.')
  }

  if (isLoading) return <AppShell breadcrumbs={BREADCRUMBS}><p>로딩 중...</p></AppShell>

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader
        title="유동인구 데이터 연동"
        actions={<Badge variant={connectionBadgeVariant(data?.connection)} label={connectionBadgeLabel(data?.connection)} />}
      />

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>데이터 소스 설정</span>
        </div>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>제공사</label>
          <select className={styles.input} value={provider} onChange={e => handleProviderChange(e.target.value)}>
            <option value="skt">SKT</option>
            <option value="kt">KT</option>
            <option value="custom">직접 입력</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={`${styles.label} ${styles.required}`}>API Endpoint</label>
          <input
            type="url"
            className={styles.input}
            value={endpoint}
            onChange={e => setEndpoint(e.target.value)}
            disabled={provider !== 'custom'}
            placeholder="https://"
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>인증 키</label>
          <div className={styles.passwordWrap}>
            <input
              type={showKey ? 'text' : 'password'}
              className={styles.input}
              value={authKey}
              onChange={e => setAuthKey(e.target.value)}
              placeholder="인증 키 입력"
            />
            <button type="button" className={styles.eyeBtn} onClick={() => setShowKey(v => !v)} aria-label="인증 키 표시 전환">
              {showKey ? '🙈' : '👁'}
            </button>
          </div>
        </div>
        {data?.lastSyncAt && (
          <p className={styles.syncMeta}>마지막 동기화: {new Date(data.lastSyncAt).toLocaleString('ko-KR')}</p>
        )}
        <div className={styles.footer}>
          <Button type="button" variant="secondary" onClick={handleTest} disabled={testing}>
            {testing ? '테스트 중...' : '연결 테스트'}
          </Button>
          <Button type="button" onClick={handleSave}>저장</Button>
        </div>
        {testResult && (
          <p className={`${styles.testResult} ${testResult === 'ok' ? styles.testOk : styles.testFail}`}>
            {testResult === 'ok' ? '✓ 연결 성공' : '✗ 연결 실패'}
          </p>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.cardHeader}>
          <span className={styles.cardTitle}>매체 매핑</span>
          <Button size="sm" variant="secondary">+ 매핑 추가</Button>
        </div>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>매체명</th>
              <th>데이터포인트 ID</th>
              <th>최근 수신</th>
              <th>상태</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {(data?.mappings ?? []).map((m: { mediaId: string; mediaName: string; datapointId: string; lastReceived: string | null; status: string }) => (
              <tr key={m.mediaId}>
                <td className={styles.name}>{m.mediaName}</td>
                <td className={styles.mono}>{m.datapointId || '—'}</td>
                <td className={styles.meta}>
                  {m.lastReceived ? new Date(m.lastReceived).toLocaleString('ko-KR') : '—'}
                </td>
                <td>
                  <span className={`${styles.badge} ${mappingBadgeClass(m.status)}`}>
                    {mappingBadgeLabel(m.status)}
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
    </AppShell>
  )
}
