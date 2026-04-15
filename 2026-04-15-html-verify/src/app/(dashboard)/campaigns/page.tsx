'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Campaign } from '@/types/campaign'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch('/api/campaigns')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const STATUS_LABEL: Record<string, string> = {
  draft: '초안', running: '집행중', done: '완료', canceled: '취소',
}
const TYPE_LABEL: Record<string, string> = {
  direct: '직접판매', own: '자사광고', filler: '필러', naver: '네이버',
}

function calcDday(startDate: string, endDate: string, status: string): string {
  if (status === 'done' || status === 'canceled') return ''
  const today = new Date()
  const end = new Date(endDate)
  const start = new Date(startDate)
  if (today < start) {
    const diff = Math.ceil((start.getTime() - today.getTime()) / 86400000)
    return `D-${diff}`
  }
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return '종료'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

export default function CampaignListPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['campaigns'], queryFn: fetchCampaigns })
  const [statusFilter, setStatusFilter] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [advertiserFilter, setAdvertiserFilter] = useState('')
  const [startFrom, setStartFrom] = useState('')
  const [startTo, setStartTo] = useState('')
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState('registeredAt')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = data.filter(c => {
    if (statusFilter && c.status !== statusFilter) return false
    if (typeFilter && c.type !== typeFilter) return false
    if (advertiserFilter && c.advertiser !== advertiserFilter) return false
    if (startFrom && c.startDate < startFrom) return false
    if (startTo && c.endDate > startTo) return false
    if (search && !c.name.includes(search)) return false
    return true
  })

  const sorted = [...filtered].sort((a, b) => {
    if (sort === 'startDate') return a.startDate.localeCompare(b.startDate)
    if (sort === 'endDate') return a.endDate.localeCompare(b.endDate)
    if (sort === 'name') return a.name.localeCompare(b.name)
    return b.registeredAt.localeCompare(a.registeredAt)
  })

  const total = sorted.length
  const pageData = sorted.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  const hasFilter = statusFilter || typeFilter || advertiserFilter || startFrom || startTo || search

  function resetFilters() {
    setStatusFilter(''); setTypeFilter(''); setAdvertiserFilter('')
    setStartFrom(''); setStartTo(''); setSearch(''); setPage(1)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>캠페인 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>캠페인 목록</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>캠페인 관리</h1>
          <button className={styles.btnPrimary} onClick={() => router.push('/campaigns/new')}>캠페인 등록</button>
        </div>

        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>필터</span>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1) }}>
            <option value="">전체 상태</option>
            <option value="draft">초안</option>
            <option value="running">집행중</option>
            <option value="done">완료</option>
            <option value="canceled">취소</option>
          </select>
          <select className={styles.filterSelect} value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1) }}>
            <option value="">전체 유형</option>
            <option value="direct">직접판매</option>
            <option value="own">자사광고</option>
            <option value="filler">필러</option>
            <option value="naver">네이버</option>
          </select>
          <select className={styles.filterSelect} value={advertiserFilter} onChange={e => { setAdvertiserFilter(e.target.value); setPage(1) }}>
            <option value="">전체 광고주</option>
            <option value="삼성전자">삼성전자</option>
            <option value="현대자동차">현대자동차</option>
            <option value="LG생활건강">LG생활건강</option>
            <option value="배달의민족">배달의민족</option>
          </select>
          <div className={styles.filterDivider} />
          <div className={styles.dateRange}>
            <input type="date" className={styles.dateInput} value={startFrom} onChange={e => { setStartFrom(e.target.value); setPage(1) }} />
            <span className={styles.dateSep}>~</span>
            <input type="date" className={styles.dateInput} value={startTo} onChange={e => { setStartTo(e.target.value); setPage(1) }} />
          </div>
          <div className={styles.filterDivider} />
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className={styles.searchInput} placeholder="캠페인명 검색" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          {hasFilter && (
            <button className={styles.filterReset} onClick={resetFilters}>초기화</button>
          )}
        </div>

        <div className={styles.toolbar}>
          <span className={styles.count}>총 {total}건</span>
          <select className={styles.sortSelect} value={sort} onChange={e => setSort(e.target.value)}>
            <option value="registeredAt">등록일 최신순</option>
            <option value="startDate">시작일 순</option>
            <option value="endDate">종료일 순</option>
            <option value="name">캠페인명 순</option>
          </select>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>캠페인</th>
                <th>유형</th>
                <th>상태</th>
                <th>집행기간</th>
                <th>대상 매체</th>
                <th>예산</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className={styles.empty}>로딩 중...</td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : pageData.map(c => (
                <tr key={c.id} onClick={() => router.push(`/campaigns/${c.id}`)}>
                  <td>
                    <div className={styles.tdName}>{c.name}</div>
                    <div className={styles.tdSub}>{c.advertiser}</div>
                  </td>
                  <td>
                    <span className={`${styles.typeBadge} ${styles[`type-${c.type}`]}`}>{TYPE_LABEL[c.type]}</span>
                  </td>
                  <td>
                    <div className={styles.statusCell}>
                      <span className={`${styles.statusDot} ${styles[`cam-${c.status}`]}`} />
                      <span className={`${styles.statusText} ${styles[`cam-${c.status}`]}`}>{STATUS_LABEL[c.status]}</span>
                    </div>
                  </td>
                  <td>
                    <div className={styles.tdPeriod}>{c.startDate} ~ {c.endDate}</div>
                    {calcDday(c.startDate, c.endDate, c.status) && (
                      <div className={styles.tdSub}>{calcDday(c.startDate, c.endDate, c.status)}</div>
                    )}
                  </td>
                  <td className={styles.tdMeta}>{c.targetMedia}</td>
                  <td>
                    <div className={styles.tdBudget}>{c.budget === 0 ? '-' : c.budget.toLocaleString() + '원'}</div>
                    <div className={styles.tdSub}>{c.priceModel}</div>
                  </td>
                  <td className={styles.tdDate}>{c.registeredAt}</td>
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
