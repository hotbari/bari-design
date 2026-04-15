'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Report } from '@/types/report'
import styles from './page.module.css'

async function fetchReports(): Promise<Report[]> {
  const res = await fetch('/api/reports')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const TYPE_LABEL: Record<string, string> = {
  campaign: '캠페인 성과',
  media: '매체 상태',
  schedule: '편성 현황',
}

const STATUS_LABEL: Record<string, string> = {
  generating: '생성중',
  done: '완료',
  fail: '실패',
}

export default function ReportListPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['reports'], queryFn: fetchReports })
  const [typeFilter, setTypeFilter] = useState('')
  const [mediaFilter, setMediaFilter] = useState('')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [drawerReport, setDrawerReport] = useState<Report | null>(null)

  const filtered = data.filter(r => {
    if (typeFilter && r.type !== typeFilter) return false
    return true
  })

  function resetFilters() {
    setTypeFilter(''); setMediaFilter(''); setDateFrom(''); setDateTo('')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>리포트</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>리포트 목록</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>리포트 목록</h1>
            <p className={styles.pageDesc}>생성된 캠페인 성과 리포트를 조회하고 다운로드합니다.</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => router.push('/reports/new')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
            리포트 생성
          </button>
        </div>

        <div className={styles.filterBar} role="search" aria-label="리포트 필터">
          <span className={styles.filterLabel}>유형</span>
          <select className={styles.filterSelect} value={typeFilter} onChange={e => setTypeFilter(e.target.value)} aria-label="리포트 유형 선택">
            <option value="">전체</option>
            <option value="campaign">캠페인 성과</option>
            <option value="media">매체 상태</option>
            <option value="schedule">편성 현황</option>
          </select>

          <div className={styles.filterDivider} aria-hidden="true" />

          <span className={styles.filterLabel}>기간</span>
          <input type="date" className={styles.filterDate} value={dateFrom} onChange={e => setDateFrom(e.target.value)} aria-label="시작일" />
          <span className={styles.filterDateSep}>–</span>
          <input type="date" className={styles.filterDate} value={dateTo} onChange={e => setDateTo(e.target.value)} aria-label="종료일" />

          <div className={styles.filterDivider} aria-hidden="true" />

          <span className={styles.filterLabel}>매체</span>
          <select className={styles.filterSelect} value={mediaFilter} onChange={e => setMediaFilter(e.target.value)} aria-label="매체 선택">
            <option value="">전체 매체</option>
            <option value="lotteworld">롯데월드 타워</option>
            <option value="coex">코엑스 아트리움</option>
            <option value="gangnam">강남역 빌보드</option>
          </select>

          <button className={styles.filterReset} onClick={resetFilters}>초기화</button>
        </div>

        <div className={styles.tableCard} role="region" aria-label="리포트 목록">
          <div className={styles.toolbar}>
            <span className={styles.count} aria-live="polite">총 <strong>{filtered.length}</strong>개 리포트</span>
          </div>
          <table className={styles.table} aria-label="리포트 목록">
            <thead>
              <tr>
                <th>리포트명</th>
                <th>유형</th>
                <th>기간</th>
                <th>생성일</th>
                <th>상태</th>
                <th aria-label="액션" />
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} className={styles.empty}>로딩 중...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : filtered.map(r => (
                <tr key={r.id} onClick={() => setDrawerReport(r)}>
                  <td className={styles.tdName}>{r.name}</td>
                  <td>{TYPE_LABEL[r.type] ?? r.type}</td>
                  <td className={styles.tdPeriod}>{r.period}</td>
                  <td className={styles.tdDate}>{r.createdAt}</td>
                  <td>
                    <span className={`${styles.badge} ${styles[`badge-${r.status}`]}`} role="status">
                      <span className={styles.badgeDot} aria-hidden="true" />
                      {STATUS_LABEL[r.status]}
                    </span>
                  </td>
                  <td onClick={e => e.stopPropagation()}>
                    {r.status === 'done' ? (
                      <button
                        className={styles.btnIcon}
                        aria-label={`${r.name} 다운로드`}
                        onClick={() => {/* download */}}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>
                    ) : r.status === 'fail' ? (
                      <button className={styles.btnRetry} aria-label={`${r.name} 재생성`}>재생성</button>
                    ) : (
                      <button className={styles.btnIcon} disabled aria-label="생성 중 — 비활성">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>

      {/* Drawer */}
      {drawerReport && (
        <>
          <div className={styles.drawerBackdrop} onClick={() => setDrawerReport(null)} aria-hidden="true" />
          <div className={styles.drawer} role="dialog" aria-modal="true" aria-label="리포트 미리보기">
            <div className={styles.drawerHeader}>
              <h2 className={styles.drawerTitle}>{drawerReport.name}</h2>
              <button className={styles.drawerClose} onClick={() => setDrawerReport(null)} aria-label="닫기">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
              </button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.sectionTitle}>기본 정보</div>
              <div className={styles.metaGrid}>
                <div>
                  <div className={styles.metaLabel}>유형</div>
                  <div className={styles.metaValue}>{TYPE_LABEL[drawerReport.type]}</div>
                </div>
                <div>
                  <div className={styles.metaLabel}>상태</div>
                  <div className={styles.metaValue}>
                    <span className={`${styles.badge} ${styles[`badge-${drawerReport.status}`]}`} role="status">
                      <span className={styles.badgeDot} aria-hidden="true" />
                      {STATUS_LABEL[drawerReport.status]}
                    </span>
                  </div>
                </div>
                <div>
                  <div className={styles.metaLabel}>기간</div>
                  <div className={styles.metaValue}>{drawerReport.period}</div>
                </div>
                <div>
                  <div className={styles.metaLabel}>생성일</div>
                  <div className={styles.metaValue}>{drawerReport.createdAt}</div>
                </div>
              </div>
              <div className={styles.sectionTitle}>미리보기</div>
              <div className={styles.chartPlaceholder}>
                {drawerReport.status === 'done' ? (
                  <>
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>
                    <span>차트 미리보기는 다운로드 후 확인 가능합니다</span>
                  </>
                ) : drawerReport.status === 'generating' ? (
                  <>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className={styles.spin}><path d="M21 12a9 9 0 11-6.219-8.56"/></svg>
                    <span>리포트 생성 중입니다...</span>
                  </>
                ) : (
                  <span className={styles.chartError}>데이터 수집 중 오류가 발생했습니다. 재생성을 시도하세요.</span>
                )}
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.btnPrimary}
                disabled={drawerReport.status !== 'done'}
                aria-label={drawerReport.status !== 'done' ? '생성 완료 후 다운로드 가능합니다' : `${drawerReport.name} 다운로드`}
              >
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
                다운로드
              </button>
              <button className={styles.btnSecondary} onClick={() => setDrawerReport(null)}>닫기</button>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
