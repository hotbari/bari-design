'use client'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { MediaDetail } from '@/types/media'
import styles from './page.module.css'

async function fetchMedia(id: string): Promise<MediaDetail> {
  const res = await fetch(`/api/media/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

const STATUS_LABEL: Record<string, string> = {
  online: '온라인', delayed: '지연', error: '이상',
  offline: '오프라인', inactive: '비활성', unlinked: '미연동',
}

const HC_LABEL: Record<string, string> = { 'hc-ok': '정상', 'hc-warn': '경고', 'hc-err': '오류' }

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { data, isLoading } = useQuery({ queryKey: ['media', id], queryFn: () => fetchMedia(id) })
  const [activeTab, setActiveTab] = useState<'info' | 'device' | 'health'>('info')
  const [hcPeriod, setHcPeriod] = useState('7')
  const [active, setActive] = useState(true)

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return <div className={styles.page}><div className={styles.content}>매체를 찾을 수 없습니다.</div></div>

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <a href="/media">매체 관리</a>
          <span className={styles.sep}>›</span>
          <a href="/media">매체 목록</a>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>{data.name}</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div className={styles.pageHeaderLeft}>
            <h1 className={styles.pageTitle}>{data.name}</h1>
            <span className={`${styles.statusBadge} ${styles[`status_${data.status}`]}`}>{STATUS_LABEL[data.status]}</span>
          </div>
          <div className={styles.pageHeaderRight}>
            <label className={styles.toggleWrap}>
              <span className={styles.toggleLabel}>{active ? '활성' : '비활성'}</span>
              <div className={`${styles.toggle} ${active ? styles.toggleOn : ''}`} onClick={() => setActive(a => !a)}>
                <div className={styles.toggleThumb} />
              </div>
            </label>
            <button className={styles.btnEdit} onClick={() => router.push(`/media/${id}/edit`)}>수정</button>
          </div>
        </div>

        <div className={styles.syncBar}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
          <span>마지막 동기화: {data.lastContact ?? '알 수 없음'}</span>
        </div>

        <div className={styles.tabs}>
          {(['info', 'device', 'health'] as const).map(tab => (
            <button key={tab} className={`${styles.tab} ${activeTab === tab ? styles.tabActive : ''}`} onClick={() => setActiveTab(tab)}>
              {tab === 'info' ? '기본 정보' : tab === 'device' ? '디바이스 연동' : '헬스체크 이력'}
            </button>
          ))}
        </div>

        {activeTab === 'info' && (
          <div className={styles.card}>
            <div className={styles.infoGrid}>
              <InfoRow label="매체사" value={data.company} />
              <InfoRow label="매체 종류" value={data.type} />
              <InfoRow label="설치 형태" value={data.orientation ?? '-'} />
              <InfoRow label="디스플레이 유형" value={data.displayType ?? '-'} />
              <InfoRow label="해상도" value={data.resolution} />
              <InfoRow label="화면 사이즈" value={data.screenSize ?? '-'} />
              {data.ledPitch && <InfoRow label="LED Pitch" value={data.ledPitch} />}
              <InfoRow label="운영 시간" value={data.operatingHours} />
              <InfoRow label="등록일" value={data.registeredAt} />
              {data.description && <InfoRow label="비고" value={data.description} />}
            </div>
          </div>
        )}

        {activeTab === 'device' && (
          <div className={styles.card}>
            <div className={styles.infoGrid}>
              <InfoRow label="디바이스 ID" value={data.deviceId ?? '미연동'} mono />
              <InfoRow label="연동일" value={data.linkedAt ?? '-'} />
              <InfoRow label="플레이어 버전" value={data.playerVersion ?? '-'} />
              <InfoRow label="마지막 통신" value={data.lastContact ?? '-'} />
            </div>
          </div>
        )}

        {activeTab === 'health' && (
          <div className={styles.card}>
            <div className={styles.hcFilter}>
              <label className={styles.filterLabel}>기간</label>
              <select className={styles.filterSelect} value={hcPeriod} onChange={e => setHcPeriod(e.target.value)}>
                <option value="7">최근 7일</option>
                <option value="14">최근 14일</option>
                <option value="30">최근 30일</option>
              </select>
            </div>
            <table className={styles.hcTable}>
              <thead>
                <tr>
                  <th>시각</th>
                  <th>결과</th>
                  <th>응답 시간</th>
                  <th>세부 내용</th>
                </tr>
              </thead>
              <tbody>
                {(data.healthHistory ?? []).length === 0 ? (
                  <tr><td colSpan={4} className={styles.empty}>이력이 없습니다</td></tr>
                ) : (data.healthHistory ?? []).map((h, i) => (
                  <tr key={i}>
                    <td className={styles.tdDate}>{h.datetime}</td>
                    <td><span className={`${styles.hcBadge} ${styles[h.result.replace('-', '_')]}`}>{HC_LABEL[h.result]}</span></td>
                    <td>{h.responseTime > 0 ? `${h.responseTime}ms` : '-'}</td>
                    <td className={styles.tdMeta}>{h.detail}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  )
}

function InfoRow({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div className={styles.infoRow}>
      <span className={styles.infoLabel}>{label}</span>
      <span className={`${styles.infoValue} ${mono ? styles.mono : ''}`}>{value}</span>
    </div>
  )
}
