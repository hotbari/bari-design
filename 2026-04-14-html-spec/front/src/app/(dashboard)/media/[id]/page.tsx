'use client'

import { useState, use } from 'react'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { StatusDot } from '@/components/ui/StatusDot'
import { SyncBadge } from '@/components/ui/SyncBadge'
import { HcBadge } from '@/components/ui/HcBadge'
import { Button } from '@/components/ui/Button'
import { useMediaDetail, useToggleMediaStatus, useMediaHealthChecks } from '@/hooks/media/useMediaDetail'
import { useToast } from '@/components/ui/Toast'
import styles from './detail.module.css'

export default function MediaDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const { show } = useToast()
  const [activeTab, setActiveTab] = useState<'info' | 'device' | 'health'>('info')
  const [hcPeriod, setHcPeriod] = useState(7)

  const { data: media, isLoading } = useMediaDetail(id)
  const { data: healthChecks } = useMediaHealthChecks(id, hcPeriod)
  const toggleStatus = useToggleMediaStatus(id)

  if (isLoading) return (
    <AppShell breadcrumbs={[{ label: '매체 관리', href: '/media' }, { label: '매체 목록', href: '/media' }, { label: '불러오는 중…' }]}>
      <div className={styles.loading}>불러오는 중…</div>
    </AppShell>
  )

  if (!media) return null

  const isActive = media.status !== 'inactive'

  const handleToggle = () => {
    const next = isActive ? 'inactive' : 'online'
    toggleStatus.mutate(next, {
      onSuccess: () => {
        show(isActive ? '매체가 비활성화되었습니다.' : '매체가 활성화되었습니다.', 2800)
      },
    })
  }

  return (
    <AppShell breadcrumbs={[
      { label: '매체 관리', href: '/media' },
      { label: '매체 목록', href: '/media' },
      { label: media.name },
    ]}>
      {/* 페이지 헤더 */}
      <div className={styles.pageHeader}>
        <div className={styles.headerLeft}>
          <h1 className={styles.title}>{media.name}</h1>
          <StatusDot status={media.status} showLabel />
        </div>
        <div className={styles.headerRight}>
          <label className={styles.toggleWrap} aria-label={isActive ? '매체 비활성' : '매체 활성'}>
            <span className={styles.toggleLabel}>{isActive ? '매체 활성' : '매체 비활성'}</span>
            <div
              className={`${styles.toggle} ${isActive ? styles.toggleOn : ''}`}
              role="switch"
              aria-checked={String(isActive) as 'true' | 'false'}
              tabIndex={0}
              onClick={handleToggle}
              onKeyDown={e => e.key === 'Enter' && handleToggle()}
            >
              <span className={styles.toggleThumb} />
            </div>
          </label>
          <Button variant="secondary" onClick={() => router.push(`/media/${id}/edit`)}>수정</Button>
        </div>
      </div>

      {/* 동기화 상태 바 */}
      <div className={styles.syncBar}>
        <span className={styles.syncLabel}>동기화 상태</span>
        <SyncBadge status={media.status === 'inactive' ? null : media.syncStatus} />
        <span className={styles.syncTime}>마지막 동기화: 2026-04-14 10:30:00</span>
      </div>

      {/* 탭 */}
      <div className={styles.tabs} role="tablist">
        {([
          { id: 'info', label: '기본 정보' },
          { id: 'device', label: '디바이스 연동' },
          { id: 'health', label: '헬스체크 이력' },
        ] as const).map(tab => (
          <button
            key={tab.id}
            role="tab"
            aria-selected={String(activeTab === tab.id) as 'true' | 'false'}
            aria-controls={`tabpanel-${tab.id}`}
            className={`${styles.tab} ${activeTab === tab.id ? styles.tabActive : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 탭 패널: 기본 정보 */}
      <div
        id="tabpanel-info"
        role="tabpanel"
        aria-labelledby="tab-info"
        hidden={activeTab !== 'info'}
        className={styles.tabPanel}
      >
        <div className={styles.infoGrid}>
          <InfoRow label="매체사" value={media.companyName} />
          <InfoRow label="매체 종류" value={media.type} />
          <InfoRow label="설치 형태" value={media.orientation} />
          <InfoRow label="디스플레이 유형" value={media.displayType + (media.displayTypeOther ? ` (${media.displayTypeOther})` : '')} />
          <InfoRow label="해상도" value={media.resolution} />
          <InfoRow label="화면 사이즈" value={media.screenSize} />
          {media.ledPitch && <InfoRow label="LED Pitch" value={media.ledPitch} />}
          <InfoRow label="운영 시간" value={media.operatingHours} />
          <InfoRow label="운영 요일" value={media.operatingDays + (media.operatingDaysCustom ? ` (${media.operatingDaysCustom.join(', ')})` : '')} />
          <InfoRow label="설치 주소" value={media.location} />
          <InfoRow label="등록일" value={media.registeredAt} />
          {media.note && <InfoRow label="비고" value={media.note} />}
        </div>
      </div>

      {/* 탭 패널: 디바이스 연동 */}
      <div
        id="tabpanel-device"
        role="tabpanel"
        aria-labelledby="tab-device"
        hidden={activeTab !== 'device'}
        className={styles.tabPanel}
      >
        {media.device ? (
          <div className={styles.infoGrid}>
            <InfoRow label="디바이스 ID" value={media.device.deviceId} />
            <InfoRow label="OS" value={media.device.os} />
            <InfoRow label="플레이어 버전" value={media.device.appVersion} />
            <InfoRow label="네트워크 유형" value={media.device.networkType} />
            <InfoRow label="IP 주소" value={media.device.ip} />
            <InfoRow label="마지막 통신" value={media.device.lastConnected} />
          </div>
        ) : (
          <div className={styles.empty}>연동된 디바이스가 없습니다.</div>
        )}
      </div>

      {/* 탭 패널: 헬스체크 이력 */}
      <div
        id="tabpanel-health"
        role="tabpanel"
        aria-labelledby="tab-health"
        hidden={activeTab !== 'health'}
        className={styles.tabPanel}
      >
        <div className={styles.hcToolbar}>
          <select
            className={styles.hcPeriodSelect}
            value={hcPeriod}
            onChange={e => setHcPeriod(Number(e.target.value))}
          >
            <option value={7}>최근 7일</option>
            <option value={14}>최근 14일</option>
            <option value={30}>최근 30일</option>
          </select>
        </div>
        <div className={styles.tableWrap}>
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
              {(healthChecks || []).map((hc: { id: string; timestamp: string; result: 'hc-ok' | 'hc-warn' | 'hc-err'; message: string }) => (
                <tr key={hc.id}>
                  <td>{new Date(hc.timestamp).toLocaleString('ko-KR')}</td>
                  <td><HcBadge result={hc.result} /></td>
                  <td>{Math.floor(Math.random() * 300 + 50)}ms</td>
                  <td>{hc.message}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AppShell>
  )
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div className={styles.infoRow}>
      <dt className={styles.infoLabel}>{label}</dt>
      <dd className={styles.infoValue}>{value}</dd>
    </div>
  )
}
