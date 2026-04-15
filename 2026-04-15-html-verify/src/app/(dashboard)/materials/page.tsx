'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

interface MaterialItem {
  id: string
  name: string
  advertiser: string
  media: string
  resolution: string
  duration: string
  period: string
  reviewStatus: 'done' | 'reviewing' | 'failed' | 'manual'
  scheduleStatus: 'on-air' | 'none' | 'waiting' | 'ended'
  opsStatus: 'active' | 'scheduled' | 'expired'
  scheduleConnected: boolean
  uploadedAt: string
}

async function fetchMaterials(): Promise<MaterialItem[]> {
  const res = await fetch('/api/materials')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const REVIEW_LABEL: Record<string, string> = {
  done: '검수완료', reviewing: '검수중', failed: '검수실패', manual: '수동검수대기',
}
const SCHEDULE_LABEL: Record<string, string> = {
  'on-air': '온에어', none: '미연결', waiting: '대기', ended: '종료',
}
const OPS_LABEL: Record<string, string> = {
  active: '진행중', scheduled: '예정', expired: '만료',
}

export default function MaterialsPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['materials'], queryFn: fetchMaterials })

  const [reviewFilter, setReviewFilter] = useState('')
  const [opsFilter, setOpsFilter] = useState('')
  const [mediaFilter, setMediaFilter] = useState('')
  const [advertiserFilter, setAdvertiserFilter] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = data.filter(m => {
    if (reviewFilter && m.reviewStatus !== reviewFilter) return false
    if (opsFilter && m.opsStatus !== opsFilter) return false
    if (mediaFilter && m.media !== mediaFilter) return false
    if (advertiserFilter && m.advertiser !== advertiserFilter) return false
    if (search && !m.name.includes(search)) return false
    return true
  })
  const total = filtered.length
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))
  const manualCount = data.filter(m => m.reviewStatus === 'manual').length

  const hasFilter = reviewFilter || opsFilter || mediaFilter || advertiserFilter || search

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>소재 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>소재 목록</span>
        </nav>
        <div className={styles.gnbRight}>
          {manualCount > 0 && (
            <button
              className={styles.manualBadge}
              onClick={() => { setReviewFilter('manual'); setPage(1) }}
            >
              수동검수대기 {manualCount}건
            </button>
          )}
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>소재 관리</h1>
          <button className={styles.btnPrimary}>소재 업로드</button>
        </div>

        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>필터</span>
          <select className={styles.filterSelect} value={reviewFilter} onChange={e => { setReviewFilter(e.target.value); setPage(1) }}>
            <option value="">전체</option>
            <option value="reviewing">검수중</option>
            <option value="done">검수완료</option>
            <option value="failed">검수실패</option>
            <option value="manual">수동검수대기</option>
          </select>
          <select className={styles.filterSelect} value={opsFilter} onChange={e => { setOpsFilter(e.target.value); setPage(1) }}>
            <option value="">전체</option>
            <option value="active">진행중</option>
            <option value="scheduled">예정</option>
            <option value="expired">만료</option>
          </select>
          <select className={styles.filterSelect} value={mediaFilter} onChange={e => { setMediaFilter(e.target.value); setPage(1) }}>
            <option value="">전체 매체</option>
            <option value="강남역 빌보드">강남역 빌보드</option>
            <option value="코엑스 아트리움">코엑스 아트리움</option>
            <option value="홍대 미디어폴">홍대 미디어폴</option>
            <option value="잠실 롯데타운">잠실 롯데타운</option>
          </select>
          <select className={styles.filterSelect} value={advertiserFilter} onChange={e => { setAdvertiserFilter(e.target.value); setPage(1) }}>
            <option value="">전체</option>
            <option value="삼성전자">삼성전자</option>
            <option value="현대자동차">현대자동차</option>
            <option value="LG화학">LG화학</option>
            <option value="카카오">카카오</option>
          </select>
          <div className={styles.filterDivider} />
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className={styles.searchInput} placeholder="소재명 검색" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          {hasFilter && (
            <button className={styles.filterReset} onClick={() => { setReviewFilter(''); setOpsFilter(''); setMediaFilter(''); setAdvertiserFilter(''); setSearch(''); setPage(1) }}>초기화</button>
          )}
        </div>

        <div className={styles.toolbar}>
          <span className={styles.count}>총 {total}건</span>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th className={styles.thThumb}></th>
                <th>소재명 / 광고주</th>
                <th>매체</th>
                <th>해상도</th>
                <th>재생시간</th>
                <th>검수 상태</th>
                <th>편성 연결</th>
                <th>운영 상태</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={9} className={styles.empty}>로딩 중...</td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={9} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : pageData.map(m => (
                <tr
                  key={m.id}
                  className={m.opsStatus === 'expired' ? styles.expiredRow : ''}
                  onClick={() => router.push(`/materials/${m.id}`)}
                >
                  <td>
                    <div className={styles.thumb} />
                  </td>
                  <td>
                    <div className={styles.tdName}>{m.name}</div>
                    <div className={styles.tdSub}>{m.advertiser}</div>
                  </td>
                  <td className={styles.tdMeta}>{m.media}</td>
                  <td className={styles.tdMeta}>{m.resolution}</td>
                  <td className={styles.tdMeta}>{m.duration}</td>
                  <td>
                    <span className={`${styles['badge-review']} ${styles[m.reviewStatus]}`}>
                      {REVIEW_LABEL[m.reviewStatus]}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles['badge-schedule']} ${styles[m.scheduleStatus]}`}>
                      {SCHEDULE_LABEL[m.scheduleStatus]}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles['badge-ops']} ${styles[m.opsStatus]}`}>
                      {OPS_LABEL[m.opsStatus]}
                    </span>
                  </td>
                  <td className={styles.tdDate}>{m.uploadedAt}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className={styles.pagination}>
            <button className={styles.pageBtn} disabled={page === 1} onClick={() => setPage(p => p - 1)}>‹</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
              <button key={p} className={`${styles.pageBtn} ${p === page ? styles.pageBtnActive : ''}`} onClick={() => setPage(p)}>{p}</button>
            ))}
            <button className={styles.pageBtn} disabled={page === totalPages} onClick={() => setPage(p => p + 1)}>›</button>
          </div>
        )}
      </main>
    </div>
  )
}
