'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import styles from './page.module.css'

interface FtData {
  connection: 'success' | 'error' | 'pending' | 'disconnected'
  provider: string
  apiEndpoint: string
  lastSyncAt: string
  mappings: { id: string; mediaName: string; datapointId: string; lastReceived: string; status: 'success' | 'pending' | 'disconnected' }[]
}

async function fetchFt(): Promise<FtData> {
  const res = await fetch('/api/media/foot-traffic')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const ENDPOINT_MAP: Record<string, string> = {
  skt: 'https://api.skt-data.com/v2/foot-traffic',
  kt: 'https://api.kt-bigdata.com/foot-traffic/v1',
}

const CONNECTION_LABEL: Record<string, string> = {
  success: '연결됨', error: '오류', pending: '연결 중', disconnected: '미연결',
}

const MAPPING_LABEL: Record<string, string> = {
  success: '정상', pending: '지연', disconnected: '미연결',
}

export default function FootTrafficPage() {
  const { data, isLoading } = useQuery({ queryKey: ['foot-traffic'], queryFn: fetchFt })
  const [provider, setProvider] = useState(data?.provider ?? 'skt')
  const [endpoint, setEndpoint] = useState(data?.apiEndpoint ?? ENDPOINT_MAP['skt'])
  const [showKey, setShowKey] = useState(false)
  const [testing, setTesting] = useState(false)
  const [testResult, setTestResult] = useState<'success' | 'error' | null>(null)

  function handleProviderChange(v: string) {
    setProvider(v)
    if (v !== 'custom') setEndpoint(ENDPOINT_MAP[v] ?? '')
  }

  async function handleTest() {
    setTesting(true)
    setTestResult(null)
    await new Promise(r => setTimeout(r, 1200))
    setTesting(false)
    setTestResult('success')
  }

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return null

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>유동인구 데이터 연동</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>유동인구 데이터 연동</h1>
          <span className={`${styles.statusBadge} ${styles[`badge_${data.connection}`]}`}>{CONNECTION_LABEL[data.connection]}</span>
        </div>

        {/* 데이터 소스 카드 */}
        <div className={styles.card}>
          <h2 className={styles.cardTitle}>데이터 소스</h2>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>제공사 *</label>
            <select className={styles.select} value={provider} onChange={e => handleProviderChange(e.target.value)}>
              <option value="skt">SKT</option>
              <option value="kt">KT</option>
              <option value="custom">직접 입력</option>
            </select>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>API Endpoint *</label>
            <input
              className={styles.input}
              type="url"
              value={endpoint}
              onChange={e => setEndpoint(e.target.value)}
              readOnly={provider !== 'custom'}
            />
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>인증 키</label>
            <div className={styles.fieldWithBtn}>
              <input className={styles.input} type={showKey ? 'text' : 'password'} defaultValue="sk_live_key_abc123" />
              <button className={styles.btnIcon} onClick={() => setShowKey(v => !v)}>{showKey ? '🙈' : '👁'}</button>
            </div>
          </div>
          <div className={styles.fieldRow}>
            <label className={styles.fieldLabel}>마지막 동기화</label>
            <span className={styles.readonlyText}>{data.lastSyncAt}</span>
          </div>
          <div className={styles.cardActions}>
            <button className={styles.btnSecondary} onClick={handleTest} disabled={testing}>
              {testing ? '테스트 중...' : '연결 테스트'}
            </button>
            {testResult === 'success' && <span className={styles.testOk}>연결 성공</span>}
            {testResult === 'error' && <span className={styles.testErr}>연결 실패</span>}
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
                <th>매체명</th>
                <th>데이터포인트 ID</th>
                <th>최근 수신</th>
                <th>상태</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {data.mappings.map(m => (
                <tr key={m.id}>
                  <td className={styles.tdName}>{m.mediaName}</td>
                  <td className={styles.mono}>{m.datapointId}</td>
                  <td className={styles.tdSub}>{m.lastReceived}</td>
                  <td>
                    <span className={`${styles.mapBadge} ${styles[`map_${m.status}`]}`}>{MAPPING_LABEL[m.status]}</span>
                  </td>
                  <td><button className={styles.btnEdit}>수정 / 매핑</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
