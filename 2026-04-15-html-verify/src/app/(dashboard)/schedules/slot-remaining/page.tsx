'use client'
import { useState } from 'react'
import styles from './page.module.css'

interface SlotData {
  id: string
  name: string
  location: string
  total: number
  used: number
  pub: number
  status: 'status-ok' | 'status-limited' | 'status-full'
}

const SLOTS: SlotData[] = [
  { id: 'm-001', name: '강남대로 전광판',   location: '서울 강남구 강남대로', total: 300, used: 240, pub: 36,  status: 'status-ok' },
  { id: 'm-002', name: '홍대입구 사이니지', location: '서울 마포구 홍대입구역', total: 240, used: 220, pub: 18, status: 'status-limited' },
  { id: 'm-003', name: '신촌역 디스플레이', location: '서울 서대문구 신촌역',  total: 200, used: 200, pub: 0,  status: 'status-full' },
  { id: 'm-004', name: '여의도 IFC 전광판', location: '서울 영등포구 IFC',     total: 360, used: 198, pub: 54, status: 'status-ok' },
  { id: 'm-005', name: '이태원 사이니지',   location: '서울 용산구 이태원',    total: 140, used: 34,  pub: 28, status: 'status-ok' },
]

const STATUS_LABEL: Record<string, string> = { 'status-ok': '여유', 'status-limited': '부족', 'status-full': '매진' }

export default function SlotRemainingPage() {
  const [statusFilter, setStatusFilter] = useState('')
  const [pciFilter, setPciFilter] = useState('')
  const [search, setSearch] = useState('')

  const totalSlots = SLOTS.reduce((s, d) => s + d.total, 0)
  const totalUsed = SLOTS.reduce((s, d) => s + d.used, 0)
  const totalPub = SLOTS.reduce((s, d) => s + d.pub, 0)
  const totalFree = totalSlots - totalUsed - totalPub
  const occupancyPct = (totalUsed / totalSlots * 100).toFixed(1)
  const freePct = (totalFree / totalSlots * 100).toFixed(1)
  const pubPct = (totalPub / totalSlots * 100).toFixed(1)

  const filtered = SLOTS.filter(d => {
    const pciPass = d.pub / d.total >= 0.10
    if (statusFilter && d.status !== statusFilter) return false
    if (pciFilter === 'pass' && !pciPass) return false
    if (pciFilter === 'fail' && pciPass) return false
    if (search && !d.name.includes(search)) return false
    return true
  })

  function resetFilters() {
    setStatusFilter(''); setPciFilter(''); setSearch('')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>잔여 구좌</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>잔여 구좌</h1>
        </div>

        {/* Summary stat cards */}
        <div className={styles.statRow}>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>전체 구좌</div>
            <div className={styles.statValue}>{totalSlots.toLocaleString()}</div>
            <div className={styles.statSub}>{SLOTS.length}개 매체 합산</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>사용 중</div>
            <div className={`${styles.statValue} ${styles.statAccent}`}>{totalUsed.toLocaleString()}</div>
            <div className={styles.statSub}>{occupancyPct}% 점유율</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>잔여 (판매 가능)</div>
            <div className={styles.statValue}>{totalFree.toLocaleString()}</div>
            <div className={styles.statSub}>전체의 {freePct}%</div>
          </div>
          <div className={styles.statCard}>
            <div className={styles.statLabel}>공익광고 의무 비율</div>
            <div className={`${styles.statValue} ${styles.statPub}`}>{totalPub.toLocaleString()}</div>
            <div className={styles.statSub}>전체의 {pubPct}% (기준: ≥10%)</div>
          </div>
        </div>

        {/* Filter bar */}
        <div className={styles.filterBar}>
          <select className={styles.filterSelect} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="">전체 상태</option>
            <option value="status-ok">여유</option>
            <option value="status-limited">부족</option>
            <option value="status-full">매진</option>
          </select>
          <select className={styles.filterSelect} value={pciFilter} onChange={e => setPciFilter(e.target.value)}>
            <option value="">공익광고 기준</option>
            <option value="pass">기준 충족</option>
            <option value="fail">기준 미충족</option>
          </select>
          <div className={styles.searchWrap}>
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
            <input
              className={styles.searchInput}
              type="search"
              placeholder="매체명 검색"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <button className={styles.filterReset} onClick={resetFilters}>초기화</button>
          <div className={styles.legend}>
            <div className={styles.legendItem}><div className={`${styles.legendSwatch} ${styles.swUsed}`} />사용 중</div>
            <div className={styles.legendItem}><div className={`${styles.legendSwatch} ${styles.swPublic}`} />공익광고</div>
            <div className={styles.legendItem}><div className={`${styles.legendSwatch} ${styles.swFree}`} />잔여</div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <div className={styles.toolbar}>
            <span className={styles.count}>매체 <strong>{filtered.length}</strong>개</span>
          </div>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>매체명</th>
                <th>구좌 현황</th>
                <th>상태</th>
                <th className={styles.right}>점유율</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan={4} className={styles.empty}>데이터가 없습니다</td></tr>
              ) : filtered.map(d => {
                const free = d.total - d.used - d.pub
                const usedPct = (d.used / d.total * 100).toFixed(1)
                const pubPct = (d.pub / d.total * 100).toFixed(1)
                const freePctVal = (free / d.total * 100).toFixed(1)
                const occupancy = ((d.used + d.pub) / d.total * 100).toFixed(1)
                const pctClass = parseFloat(occupancy) >= 95 ? styles.pctDanger : parseFloat(occupancy) >= 80 ? styles.pctWarn : styles.pctOk

                return (
                  <tr key={d.id}>
                    <td>
                      <div className={styles.mediaName}>{d.name}</div>
                      <div className={styles.mediaSub}>{d.location}</div>
                    </td>
                    <td style={{ minWidth: 160 }}>
                      <div className={styles.slotBarWrap}>
                        <div className={styles.slotBar}>
                          <div className={`${styles.slotSeg} ${styles.segUsed}`} style={{ width: `${usedPct}%` }} />
                          <div className={`${styles.slotSeg} ${styles.segPublic}`} style={{ width: `${pubPct}%` }} />
                          <div className={`${styles.slotSeg} ${styles.segFree}`} style={{ width: `${freePctVal}%` }} />
                        </div>
                        <div className={styles.slotBarLabels}>
                          <div className={styles.slotBarLabel}><div className={`${styles.slotDot} ${styles.dotUsed}`} />{usedPct}% 사용</div>
                          <div className={styles.slotBarLabel}><div className={`${styles.slotDot} ${styles.dotPublic}`} />{pubPct}% 공익</div>
                          <div className={styles.slotBarLabel}><div className={`${styles.slotDot} ${styles.dotFree}`} />{freePctVal}% 잔여</div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className={`${styles.statusBadge} ${styles[d.status]}`}>
                        <span className={styles.statusDot} />
                        {STATUS_LABEL[d.status]}
                      </span>
                    </td>
                    <td className={styles.right}>
                      <span className={`${styles.pctValue} ${pctClass}`}>{occupancy}%</span>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  )
}
