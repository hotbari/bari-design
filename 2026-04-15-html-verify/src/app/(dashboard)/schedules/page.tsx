'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Schedule } from '@/types/schedule'
import styles from './page.module.css'

async function fetchSchedules(): Promise<Schedule[]> {
  const res = await fetch('/api/schedules')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

function calcDday(endDate: string, status: string): string {
  if (status === 'done') return ''
  const today = new Date()
  const end = new Date(endDate)
  const diff = Math.ceil((end.getTime() - today.getTime()) / 86400000)
  if (diff < 0) return '종료'
  if (diff === 0) return 'D-Day'
  return `D-${diff}`
}

const STATUS_LABEL: Record<string, string> = { active: '적용중', pending: '예약됨', done: '종료' }
const PRIO_LABEL: Record<string, string> = { 'prio-1': '1순위', 'prio-2': '2순위', 'prio-3': '3순위' }
const SYNC_LABEL: Record<string, string> = { 'sync-ok': '동기화 완료', 'sync-lag': '동기화 지연', 'sync-none': '미전송' }

export default function ScheduleListPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['schedules'], queryFn: fetchSchedules })
  const [statusFilter, setStatusFilter] = useState('')
  const [mediaFilter, setMediaFilter] = useState('')
  const [prioFilter, setPrioFilter] = useState('')
  const [search, setSearch] = useState('')

  const filtered = data.filter(s => {
    if (statusFilter && s.status !== statusFilter) return false
    if (mediaFilter && s.mediaName !== mediaFilter) return false
    if (prioFilter && s.priority !== `prio-${prioFilter}`) return false
    if (search && !s.name.includes(search)) return false
    return true
  })

  const mediaNames = [...new Set(data.map(s => s.mediaName).filter(Boolean))]

  function resetFilters() {
    setStatusFilter(''); setMediaFilter(''); setPrioFilter(''); setSearch('')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>편성표</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>편성 관리</h1>
          <button className={styles.btnPrimary} onClick={() => router.push('/schedules/new')}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
            새 편성표
          </button>
        </div>

        <div className={styles.filterBar}>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="active">적용중</option>
            <option value="pending">예약됨</option>
            <option value="done">종료</option>
          </select>
          <select className={styles.filterSelect} value={mediaFilter} onChange={e => setMediaFilter(e.target.value)}>
            <option value="">전체 매체</option>
            {mediaNames.map(m => <option key={m} value={m}>{m}</option>)}
          </select>
          <select className={styles.filterSelect} value={prioFilter} onChange={e => setPrioFilter(e.target.value)}>
            <option value="">전체 우선순위</option>
            <option value="1">1순위</option>
            <option value="2">2순위</option>
            <option value="3">3순위 (기본)</option>
          </select>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="편성표명 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          {(statusFilter || mediaFilter || prioFilter || search) && (
            <button className={styles.filterReset} onClick={resetFilters}>초기화</button>
          )}
        </div>

        <div className={styles.tableCard}>
          <div className={styles.toolbar}>
            <span className={styles.count}>총 <strong>{filtered.length}</strong>건</span>
          </div>
          <table className={styles.table} aria-label="편성표 목록">
            <thead>
              <tr>
                <th>편성표명</th>
                <th>상태</th>
                <th>우선순위</th>
                <th>적용 기간</th>
                <th>재생목록</th>
                <th>연결 캠페인</th>
                <th>동기화</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={7} className={styles.empty}>로딩 중...</td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={7} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : filtered.map(s => (
                <tr
                  key={s.id}
                  onClick={() => router.push(`/schedules/${s.id}/edit`)}
                  className={s.status === 'done' ? styles.rowDone : ''}
                >
                  <td>
                    <div className={styles.schName}>
                      {s.name}
                      {s.editingNow && (
                        <span className={styles.editingNow}>
                          <span className={styles.editingDot} />
                          편집중
                        </span>
                      )}
                    </div>
                    {s.mediaName && <div className={styles.schMedia}>{s.mediaName}</div>}
                  </td>
                  <td>
                    <span className={`${styles.schBadge} ${styles[`sch-${s.status}`]}`}>
                      <span className={styles.schDot} />
                      {STATUS_LABEL[s.status]}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.prioBadge} ${styles[s.priority]}`}>
                      {PRIO_LABEL[s.priority]}
                    </span>
                  </td>
                  <td className={styles.tdPeriod}>
                    <div>{s.startDate} ~</div>
                    <div>{s.endDate}</div>
                    {calcDday(s.endDate, s.status) && (
                      <div className={styles.dday}>{calcDday(s.endDate, s.status)}</div>
                    )}
                  </td>
                  <td className={styles.tdMeta}>{s.playlistName}</td>
                  <td className={styles.tdMeta}>{s.campaignName ?? '—'}</td>
                  <td>
                    <span className={`${styles.syncBadge} ${styles[s.sync]}`}>
                      {s.sync === 'sync-ok' && (
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 8l3.5 3.5L13 4.5"/></svg>
                      )}
                      {s.sync === 'sync-lag' && (
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round"><path d="M8 2L2 13h12L8 2z"/><path d="M8 7v3M8 11.5v.5"/></svg>
                      )}
                      {s.sync === 'sync-none' && (
                        <svg width="11" height="11" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><line x1="4" y1="8" x2="12" y2="8"/></svg>
                      )}
                      {SYNC_LABEL[s.sync]}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
