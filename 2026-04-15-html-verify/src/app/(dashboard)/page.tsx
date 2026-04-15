'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRole } from '@/hooks/useRole'
import type { AdminDashboard, MediaDashboard, OpsDashboard } from '@/types/dashboard'
import styles from './page.module.css'

const CHIP_LABEL: Record<string, string> = {
  online: '온라인', delayed: '지연', error: '이상', offline: '오프라인', inactive: '비활성',
  active: '진행중', draft: '초안', ended: '종료',
}
const LEGEND = [
  { status: 'online',  label: '온라인',   color: 'oklch(0.62 0.19 155)' },
  { status: 'delayed', label: '지연',      color: 'var(--color-warning-500)' },
  { status: 'error',   label: '이상',      color: 'var(--color-error-500)' },
  { status: 'offline', label: '오프라인',  color: 'var(--color-neutral-400)' },
]

function nowLabel() {
  return new Date().toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', weekday: 'short' })
}

// ── Admin dashboard ────────────────────────────────────────────────────────
function AdminView({ data }: { data: AdminDashboard }) {
  return (
    <>
      {data.alertBanner && (
        <div className={styles.alertBanner}>
          <span className={styles.alertIcon}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </span>
          <span className={styles.alertMsg}>{data.alertBanner.message}</span>
          <span className={styles.alertLinks}>
            {data.alertBanner.links.map(l => (
              <Link key={l.href} href={l.href} className={styles.alertLink}>{l.label}</Link>
            ))}
          </span>
        </div>
      )}

      <div className={styles.statsGrid}>
        {data.stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>
              {s.value}
              {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.body}>
        <div className={styles.leftPanel}>
          {/* Media status chips */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>매체 상태</div>
            <div className={styles.chipRow}>
              {data.mediaChips.map(c => (
                <span key={c.status} className={`${styles.chip} ${styles[`chip-${c.status}`]}`}>
                  <span className={styles.chipDot} />
                  {CHIP_LABEL[c.status]} {c.count}
                </span>
              ))}
            </div>
          </div>

          {/* Campaign chips */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>캠페인 현황</div>
            <div className={styles.chipRow}>
              {data.campaignChips.map(c => (
                <span key={c.status} className={`${styles.chip} ${styles[`chip-${c.status}`]}`}>
                  <span className={styles.chipDot} />
                  {CHIP_LABEL[c.status]} {c.count}
                </span>
              ))}
            </div>
          </div>

          {/* Health check issues */}
          {data.healthIssues.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>헬스체크 이상 목록</div>
              <div className={styles.healthList}>
                {data.healthIssues.map(item => (
                  <div key={item.id} className={styles.healthItem}>
                    <span className={`${styles.dDot} ${styles[item.status]}`} />
                    <span className={styles.healthName}>{item.name}</span>
                    <span className={styles.healthDetail}>{item.detail}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* System status */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>시스템 현황</div>
            <div className={styles.sysGrid}>
              {data.system.map(s => (
                <div key={s.label} className={`${styles.sysItem} ${styles[s.status]}`}>
                  <span className={styles.sysLabel}>{s.label}</span>
                  <span className={styles.sysDetail}>{s.detail}</span>
                  <span className={styles.sysBadge}>{s.status === 'sys-ok' ? '정상' : s.status === 'sys-warn' ? '경고' : '오류'}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Notifications */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>알림</div>
            <div className={styles.notifList}>
              {data.notifications.map(n => (
                <div key={n.id} className={styles.notifItem}>
                  <span className={`${styles.notifDot} ${n.read ? styles.read : styles.unread}`} />
                  <span className={styles.notifText}>{n.text}</span>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Map panel */}
        <div className={styles.rightPanel}>
          <div className={styles.mapPanel}>
            <div className={styles.mapHeader}>
              <span className={styles.mapTitle}>매체 위치</span>
              {['전체', '온라인', '이상', '오프라인'].map((f, i) => (
                <button key={f} className={`${styles.mapFilterBtn} ${i === 0 ? styles.active : ''}`}>{f}</button>
              ))}
            </div>
            <div className={styles.mapBody}>
              {data.mapMarkers.map(m => {
                // Map lat/lng to approximate % positions within Korea bounding box
                const latMin = 37.45, latMax = 37.60, lngMin = 126.88, lngMax = 127.10
                const x = ((m.lng - lngMin) / (lngMax - lngMin)) * 100
                const y = ((latMax - m.lat) / (latMax - latMin)) * 100
                return (
                  <div key={m.id} className={styles.mapMarkerWrap} style={{ left: `${x}%`, top: `${y}%` }}>
                    <div
                      className={`${styles.mapMarker} ${styles[m.status]}`}
                      data-name={m.name}
                    />
                  </div>
                )
              })}
            </div>
            <div className={styles.mapLegend}>
              {LEGEND.map(l => (
                <div key={l.status} className={styles.legendItem}>
                  <span className={styles.legendDot} style={{ background: l.color }} />
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Media company dashboard ────────────────────────────────────────────────
function MediaView({ data }: { data: MediaDashboard }) {
  return (
    <>
      <div className={styles.statsGrid3}>
        {data.stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}{s.unit && <span className={styles.statUnit}>{s.unit}</span>}</div>
          </div>
        ))}
      </div>

      <div className={styles.bodySimple}>
        <div className={styles.leftPanel}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>캠페인 현황</div>
            <div className={styles.chipRow}>
              {data.campaignChips.map(c => (
                <span key={c.status} className={`${styles.chip} ${styles[`chip-${c.status}`]}`}>
                  <span className={styles.chipDot} />
                  {CHIP_LABEL[c.status]} {c.count}
                </span>
              ))}
            </div>
          </div>

          {data.pendingMaterials.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>검수 대기 소재</div>
              <div className={styles.matList}>
                {data.pendingMaterials.map(m => (
                  <div key={m.id} className={styles.matItem}>
                    <span className={styles.matName}>{m.name}</span>
                    <span className={styles.matStatus}>검수 중</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>알림</div>
            <div className={styles.notifList}>
              {data.notifications.map(n => (
                <div key={n.id} className={styles.notifItem}>
                  <span className={`${styles.notifDot} ${n.read ? styles.read : styles.unread}`} />
                  <span className={styles.notifText}>{n.text}</span>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Ops agency dashboard ───────────────────────────────────────────────────
function OpsView({ data }: { data: OpsDashboard }) {
  return (
    <>
      <div className={styles.statsGrid3}>
        {data.stats.map(s => (
          <div key={s.label} className={styles.statCard}>
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>{s.value}{s.unit && <span className={styles.statUnit}>{s.unit}</span>}</div>
          </div>
        ))}
      </div>

      <div className={styles.bodySimple}>
        <div className={styles.leftPanel}>
          {data.scheduleAlerts.length > 0 && (
            <div className={styles.section}>
              <div className={styles.sectionTitle}>편성 알림</div>
              <div className={styles.alertList}>
                {data.scheduleAlerts.map(a => (
                  <div key={a.id} className={`${styles.alertItem} ${styles[a.severity]}`}>
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                    </svg>
                    {a.message}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className={styles.rightPanel}>
          <div className={styles.section}>
            <div className={styles.sectionTitle}>알림</div>
            <div className={styles.notifList}>
              {data.notifications.map(n => (
                <div key={n.id} className={styles.notifItem}>
                  <span className={`${styles.notifDot} ${n.read ? styles.read : styles.unread}`} />
                  <span className={styles.notifText}>{n.text}</span>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

// ── Main page ──────────────────────────────────────────────────────────────
export default function DashboardPage() {
  const [role] = useRole()

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ['dashboard', role],
    queryFn: () => fetch(`/api/dashboard?role=${role}`).then(r => r.json()),
  })

  return (
    <div className={styles.page}>
      <div className={styles.gnb}>
        <h1 className={styles.gnbTitle}>대시보드</h1>
        <div className={styles.gnbMeta}>
          <span className={styles.gnbDate}>{nowLabel()}</span>
          <button
            className={styles.refreshBtn}
            onClick={() => refetch()}
            disabled={isFetching}
            aria-label="새로고침"
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              style={isFetching ? { animation: 'spin 1s linear infinite' } : undefined}>
              <path d="M23 4v6h-6"/><path d="M1 20v-6h6"/>
              <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
            </svg>
            새로고침
          </button>
        </div>
      </div>

      {isLoading && <div className={styles.loading}>데이터를 불러오는 중...</div>}
      {isError && <div className={styles.loading}>데이터 조회 오류</div>}

      {data && role === 'admin' && <AdminView data={data as AdminDashboard} />}
      {data && role === 'media' && <MediaView data={data as MediaDashboard} />}
      {data && role === 'ops' && <OpsView data={data as OpsDashboard} />}
      {data && role === 'sales' && <OpsView data={data as OpsDashboard} />}
    </div>
  )
}
