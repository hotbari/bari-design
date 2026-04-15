'use client'
import { useQuery } from '@tanstack/react-query'
import Link from 'next/link'
import { useRole } from '@/hooks/useRole'
import type { AdminDashboard, MediaDashboard, OpsDashboard, SalesDashboard } from '@/types/dashboard'
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

const SYNC_STATUS_BADGE: Record<string, string> = { synced: 'badgeSynced', delayed: 'badgeDelayed', failed: 'badgeFailed' }
const SYNC_STATUS_LABEL: Record<string, string> = { synced: '동기화 완료', delayed: '지연', failed: '미완료' }
const SYNC_DOT: Record<string, string> = { synced: 'dotSynced', delayed: 'dotDelayed', failed: 'dotFailed' }
const SCHEDULE_BADGE: Record<string, string> = { confirmed: 'badgeOk', reviewing: 'badgeReviewing', pending: 'badgeGray' }
const SCHEDULE_LABEL: Record<string, string> = { confirmed: '확정', reviewing: '검수중', pending: '미확정' }
const SCHEDULE_DOT: Record<string, string> = { confirmed: 'dotSynced', reviewing: 'dotDelayed', pending: 'dotPending' }
const CAMPAIGN_BADGE: Record<string, string> = { active: 'badgeActive', reviewing: 'badgeReviewing', draft: 'badgeDraft', ended: 'badgeEnded' }
const CAMPAIGN_LABEL: Record<string, string> = { active: '진행중', reviewing: '검수중', draft: '초안', ended: '종료' }
const COMPANY_STATUS_BADGE: Record<string, string> = { ok: 'badgeOk', warn: 'badgeWarn', error: 'badgeError' }
const COMPANY_STATUS_LABEL: Record<string, string> = { ok: '정상', warn: '주의', error: '오류' }
const TASK_BADGE: Record<string, string> = { urgent: 'badgeUrgent', today: 'badgeWarn', normal: 'badgeGray' }
const TASK_BADGE_LABEL: Record<string, string> = { urgent: '긴급', today: '오늘', normal: '일반' }
const RECENT_SCH_DOT: Record<string, string> = { done: 'dotDone', delayed: 'dotDelayed', pending: 'dotPending' }

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
  const syncFailCount = data.syncStatus.filter(s => s.status !== 'synced').length

  return (
    <>
      <div className={styles.statsGrid4}>
        {data.stats.map((s, i) => (
          <div
            key={s.label}
            // intentional: index 2 is "동기화 미완료" — tied to fixture stats order
            className={`${styles.statCard} ${i === 2 && syncFailCount > 0 ? styles.warn : ''}`}
          >
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>
              {s.value}
              {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bodyGrid}>
        {/* 편성 동기화 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>편성 동기화 현황</div>
            <a href="/schedules" className={styles.sectionLink}>편성관리 →</a>
          </div>
          <div className={styles.syncList}>
            {data.syncStatus.map(item => (
              <div
                key={item.id}
                className={`${styles.syncItem}${item.status === 'delayed' ? ` ${styles.syncDelayed}` : item.status === 'failed' ? ` ${styles.syncFailed}` : ''}`}
              >
                <span className={`${styles.statusDot} ${styles[SYNC_DOT[item.status]]}`} />
                <span className={styles.syncName}>{item.name}</span>
                {item.detail && <span className={styles.syncDetail}>{item.detail}</span>}
                <span className={`${styles.badge} ${styles[SYNC_STATUS_BADGE[item.status]]}`}>
                  {SYNC_STATUS_LABEL[item.status]}
                </span>
              </div>
            ))}
          </div>
          <div className={styles.syncLegend}>
            <div className={styles.legendEntry}>
              <span className={`${styles.statusDot} ${styles.dotSynced}`} />완료
            </div>
            <div className={styles.legendEntry}>
              <span className={`${styles.statusDot} ${styles.dotDelayed}`} />지연
            </div>
            <div className={styles.legendEntry}>
              <span className={`${styles.statusDot} ${styles.dotFailed}`} />미완료
            </div>
          </div>
        </div>

        {/* 이번주 편성 일정 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>이번주 편성 일정</div>
            <a href="/schedules" className={styles.sectionLink}>전체 보기 →</a>
          </div>
          {data.weeklySchedule.length === 0 ? (
            <div className={styles.emptyState}>예정된 편성 일정이 없습니다</div>
          ) : (
            <div className={styles.timeline}>
              {data.weeklySchedule.map(item => (
                <div key={item.id} className={styles.tlItem}>
                  <span className={styles.tlDate}>{item.date}</span>
                  <span className={`${styles.statusDot} ${styles[SCHEDULE_DOT[item.status]]}`} />
                  <span className={styles.tlTitle}>{item.title}</span>
                  <span className={`${styles.badge} ${styles[SCHEDULE_BADGE[item.status]]}`}>
                    {SCHEDULE_LABEL[item.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 캠페인 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>캠페인 현황</div>
            <a href="/campaigns" className={styles.sectionLink}>캠페인 →</a>
          </div>
          <div className={styles.chipRow}>
            {data.campaignChips.map(c => (
              <span key={c.status} className={`${styles.chip} ${styles[`chip-${c.status}`]}`}>
                <span className={styles.chipDot} />
                {CHIP_LABEL[c.status]} {c.count}
              </span>
            ))}
          </div>
        </div>

        {/* 소재 검수 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>소재 검수 현황</div>
            <a href="/materials" className={styles.sectionLink}>소재 →</a>
          </div>
          {data.pendingMaterials.length === 0 ? (
            <div className={styles.emptyState}>검수 중인 소재가 없습니다</div>
          ) : (
            <div className={styles.matProgress}>
              {data.pendingMaterials.map(m => (
                <div key={m.id} className={styles.matProgressItem}>
                  <div className={styles.matProgressHeader}>
                    <span>{m.name}</span>
                    <span className={`${styles.badge} ${styles[m.status === 'reviewing' ? 'badgeReviewing' : 'badgeGray']}`}>
                      {m.status === 'reviewing' ? '검수중' : '대기중'}
                    </span>
                  </div>
                  {m.status === 'reviewing' && (
                    <>
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${styles.reviewing}`}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      {m.eta && <div className={styles.matEta}>예상 완료: {m.eta}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

// ── Ops agency dashboard ───────────────────────────────────────────────────
function OpsView({ data }: { data: OpsDashboard }) {
  const unreadCount = data.notifications.filter(n => !n.read).length

  return (
    <>
      <div className={styles.statsGrid4}>
        {data.stats.map((s, i) => (
          <div
            key={s.label}
            // intentional: index 3 is "미처리 알림" — tied to fixture stats order
            className={`${styles.statCard} ${i === 3 && unreadCount > 0 ? styles.error : ''}`}
          >
            <div className={styles.statLabel}>{s.label}</div>
            <div className={styles.statValue}>
              {s.value}
              {s.unit && <span className={styles.statUnit}>{s.unit}</span>}
            </div>
          </div>
        ))}
      </div>

      <div className={styles.bodyGrid}>
        {/* 담당 매체사 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>담당 매체사 현황</div>
            <a href="/media" className={styles.sectionLink}>매체 →</a>
          </div>
          <div className={styles.companyList}>
            {data.managedCompanies.map(c => (
              <div
                key={c.id}
                className={`${styles.companyItem}${c.status === 'warn' ? ` ${styles.companyWarn}` : c.status === 'error' ? ` ${styles.companyError}` : ''}`}
              >
                <span className={`${styles.statusDot} ${styles[c.status === 'ok' ? 'dotOk' : c.status === 'warn' ? 'dotWarn' : 'dotFailed']}`} />
                <span className={styles.companyName}>{c.name}</span>
                <span className={styles.companyMediaCount}>매체 {c.mediaCount}대</span>
                <span className={`${styles.badge} ${styles[COMPANY_STATUS_BADGE[c.status]]}`}>
                  {COMPANY_STATUS_LABEL[c.status]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* 이번주 편성 처리 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>이번주 편성 처리 현황</div>
            <a href="/schedules" className={styles.sectionLink}>편성관리 →</a>
          </div>
          <div className={styles.scheduleProgress}>
            <div>
              <div className={styles.scheduleProgressLabel}>
                <span>완료 / 전체</span>
                <span>{data.weeklyScheduleProgress.done} / {data.weeklyScheduleProgress.total}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={styles.progressFill}
                  style={{ width: `${data.weeklyScheduleProgress.total === 0 ? 0 : Math.round((data.weeklyScheduleProgress.done / data.weeklyScheduleProgress.total) * 100)}%` }}
                />
              </div>
            </div>
            <div className={styles.syncList}>
              {data.recentSchedules.map(s => (
                <div key={s.id} className={styles.syncItem}>
                  <span className={`${styles.statusDot} ${styles[RECENT_SCH_DOT[s.status]]}`} />
                  <span className={styles.syncName}>{s.title}</span>
                  <span className={`${styles.badge} ${s.status === 'done' ? styles.badgeOk : s.status === 'delayed' ? styles.badgeDelayed : styles.badgeGray}`}>
                    {s.status === 'done' ? '완료' : s.status === 'delayed' ? '지연' : '대기'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* 오늘 할 일 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>오늘 처리할 항목</div>
          </div>
          {data.todayTasks.length === 0 ? (
            <div className={styles.emptyState}>처리할 항목이 없습니다</div>
          ) : (
            <div className={styles.taskList}>
              {data.todayTasks.map(t => (
                <div key={t.id} className={styles.taskItem}>
                  <input type="checkbox" defaultChecked={t.done} readOnly />
                  <span className={`${styles.taskTitle} ${t.done ? styles.done : ''}`}>{t.title}</span>
                  {!t.done && (
                    <span className={`${styles.badge} ${styles[TASK_BADGE[t.priority]]}`}>
                      {TASK_BADGE_LABEL[t.priority]}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 알림 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>알림</div>
            <a href="/notifications" className={styles.sectionLink}>전체 →</a>
          </div>
          {data.notifications.length === 0 ? (
            <div className={styles.emptyState}>새 알림이 없습니다</div>
          ) : (
            <div className={styles.notifList}>
              {data.notifications.map(n => (
                <div key={n.id} className={styles.notifItem}>
                  <span className={`${styles.notifDot} ${n.read ? styles.read : styles.unread}`} />
                  <span className={styles.notifText}>{n.text}</span>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  )
}

function SalesView({ data }: { data: SalesDashboard }) {
  return (
    <>
      <div className={styles.statsGrid3}>
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

      <div className={styles.bodyGrid}>
        {/* 담당 캠페인 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>담당 캠페인 현황</div>
            <a href="/campaigns" className={styles.sectionLink}>캠페인 →</a>
          </div>
          {data.campaigns.length === 0 ? (
            <div className={styles.emptyState}>담당 캠페인이 없습니다</div>
          ) : (
            <div className={styles.campaignList}>
              {data.campaigns.map(c => (
                <div key={c.id} className={styles.campaignItem}>
                  <span className={`${styles.statusDot} ${c.status === 'active' ? styles.dotSynced : c.status === 'reviewing' ? styles.dotDelayed : styles.dotPending}`} />
                  <span className={styles.campaignName}>{c.name}</span>
                  <span className={`${styles.badge} ${styles[CAMPAIGN_BADGE[c.status]]}`}>
                    {CAMPAIGN_LABEL[c.status]}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 소재 검수 현황 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>소재 검수 현황</div>
            <a href="/materials" className={styles.sectionLink}>소재 →</a>
          </div>
          {data.pendingMaterials.length === 0 ? (
            <div className={styles.emptyState}>검수 중인 소재가 없습니다</div>
          ) : (
            <div className={styles.matProgress}>
              {data.pendingMaterials.map(m => (
                <div key={m.id} className={styles.matProgressItem}>
                  <div className={styles.matProgressHeader}>
                    <span>{m.name}</span>
                    <span className={`${styles.badge} ${m.status === 'reviewing' ? styles.badgeReviewing : styles.badgeGray}`}>
                      {m.status === 'reviewing' ? '검수중' : '대기중'}
                    </span>
                  </div>
                  {m.status === 'reviewing' && (
                    <>
                      <div className={styles.progressBar}>
                        <div
                          className={`${styles.progressFill} ${styles.reviewing}`}
                          style={{ width: `${m.progress}%` }}
                        />
                      </div>
                      {m.eta && <div className={styles.matEta}>예상 완료: {m.eta}</div>}
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 알림 */}
        <div className={styles.section}>
          <div className={styles.sectionHead}>
            <div className={styles.sectionTitle}>알림</div>
            <a href="/notifications" className={styles.sectionLink}>전체 →</a>
          </div>
          {data.notifications.length === 0 ? (
            <div className={styles.emptyState}>새 알림이 없습니다</div>
          ) : (
            <div className={styles.notifList}>
              {data.notifications.map(n => (
                <div key={n.id} className={styles.notifItem}>
                  <span className={`${styles.notifDot} ${n.read ? styles.read : styles.unread}`} />
                  <span className={styles.notifText}>{n.text}</span>
                  <span className={styles.notifTime}>{n.time}</span>
                </div>
              ))}
            </div>
          )}
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
      {data && role === 'sales' && <SalesView data={data as SalesDashboard} />}
    </div>
  )
}
