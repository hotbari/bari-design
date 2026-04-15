'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Media } from '@/types/media'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

async function fetchMedia(): Promise<Media[]> {
  const res = await fetch('/api/media')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

const STATUS_LABEL: Record<string, string> = {
  online: '온라인', delayed: '지연', error: '이상',
  offline: '오프라인', inactive: '비활성', unlinked: '미연동',
}
const SYNC_LABEL: Record<string, string> = {
  synced: '동기화됨', delayed: '지연', error: '오류', pending: '대기',
}

export default function MediaListPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['media'], queryFn: fetchMedia })
  const [company, setCompany] = useState('')
  const [status, setStatus] = useState('')
  const [type, setType] = useState('')
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(1)
  const PER_PAGE = 10

  const filtered = data.filter(m => {
    if (company && m.company !== company) return false
    if (status && m.status !== statusValueMap[status]) return false
    if (type && m.type !== type) return false
    if (search && !m.name.includes(search) && !m.address.includes(search)) return false
    return true
  })
  const total = filtered.length
  const pageData = filtered.slice((page - 1) * PER_PAGE, page * PER_PAGE)
  const totalPages = Math.max(1, Math.ceil(total / PER_PAGE))

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>매체 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>매체 목록</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.15</span>
        </div>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>매체 관리</h1>
            <p className={styles.pageDesc}>등록된 디지털 사이니지 매체를 관리합니다</p>
          </div>
          <button className={styles.btnPrimary} onClick={() => router.push('/media/new')}>매체 등록</button>
        </div>

        <div className={styles.filterBar}>
          <span className={styles.filterLabel}>필터</span>
          <select className={styles.filterSelect} value={company} onChange={e => { setCompany(e.target.value); setPage(1) }}>
            <option value="">전체 매체사</option>
            <option>네이버 OOH 미디어</option>
            <option>카카오 스크린</option>
            <option>롯데 광고</option>
            <option>서울디지털미디어</option>
            <option>KIA 미디어</option>
          </select>
          <select className={styles.filterSelect} value={status} onChange={e => { setStatus(e.target.value); setPage(1) }}>
            <option value="">전체 상태</option>
            <option value="온라인">온라인</option>
            <option value="지연">지연</option>
            <option value="이상">이상</option>
            <option value="오프라인">오프라인</option>
            <option value="미연동">미연동</option>
            <option value="비활성">비활성</option>
          </select>
          <select className={styles.filterSelect} value={type} onChange={e => { setType(e.target.value); setPage(1) }}>
            <option value="">전체 유형</option>
            <option>고정형</option>
            <option>이동형</option>
          </select>
          <div className={styles.filterDivider} />
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
            <input className={styles.searchInput} placeholder="매체명·주소 검색" value={search} onChange={e => { setSearch(e.target.value); setPage(1) }} />
          </div>
          {(company || status || type || search) && (
            <button className={styles.filterReset} onClick={() => { setCompany(''); setStatus(''); setType(''); setSearch(''); setPage(1) }}>초기화</button>
          )}
        </div>

        <div className={styles.toolbar}>
          <span className={styles.count}>총 {total}개 매체</span>
        </div>

        <div className={styles.tableCard}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>매체명</th>
                <th>매체사</th>
                <th>유형</th>
                <th>해상도</th>
                <th>상태</th>
                <th>동기화</th>
                <th>운영 시간</th>
                <th>등록일</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={8} className={styles.empty}>로딩 중...</td></tr>
              ) : pageData.length === 0 ? (
                <tr><td colSpan={8} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : pageData.map(m => (
                <tr key={m.id} onClick={() => router.push(`/media/${m.id}`)}>
                  <td>
                    <div className={styles.tdName}>{m.name}</div>
                    <div className={styles.tdSub}>{m.address}</div>
                  </td>
                  <td className={styles.tdMeta}>{m.company}</td>
                  <td><span className={styles.typeChip}>{m.type}</span></td>
                  <td className={styles.tdMeta}>{m.resolution}</td>
                  <td>
                    <div className={styles.statusCell}>
                      <span className={`${styles['status-dot']} ${styles[`status${capitalize(m.status)}`]}`} />
                      <span className={`${styles.statusLabel} ${styles[`statusLabel${capitalize(m.status)}`]}`}>{STATUS_LABEL[m.status]}</span>
                    </div>
                  </td>
                  <td>
                    <span className={`${styles['sync-badge']} ${styles[`sync${capitalize(m.sync)}`]}`}>{SYNC_LABEL[m.sync]}</span>
                  </td>
                  <td className={styles.tdMeta}>{m.operatingHours}</td>
                  <td className={styles.tdDate}>{m.registeredAt}</td>
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

const statusValueMap: Record<string, string> = {
  '온라인': 'online', '지연': 'delayed', '이상': 'error',
  '오프라인': 'offline', '미연동': 'unlinked', '비활성': 'inactive',
}

function capitalize(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1)
}
