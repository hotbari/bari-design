# Dashboard Role Improvement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 매체사·운영대행사·영업대행사 역할 대시보드에 페르소나 기반 정보 섹션을 추가하고 시각 품질을 어드민 수준으로 맞춘다.

**Architecture:** `src/types/dashboard.ts`에 신규 타입 추가 → `dashboard.json` 픽스처 데이터 교체 → `page.tsx`의 각 Role View 컴포넌트 고도화 → `page.module.css`에 신규 위젯 스타일 추가. MSW 핸들러(`dashboard.ts`)는 변경 없음 (role별 JSON 슬라이싱만 하므로).

**Tech Stack:** Next.js 14, TypeScript, CSS Modules, MSW (Mock Service Worker)

---

## File Map

| 파일 | 작업 |
|------|------|
| `src/types/dashboard.ts` | 신규 인터페이스 추가, `MediaDashboard`·`OpsDashboard` 필드 확장, `SalesDashboard` 신규 |
| `src/mocks/fixtures/dashboard.json` | `media`·`ops`·`sales` 섹션 픽스처 교체 |
| `src/app/(dashboard)/page.tsx` | `MediaView`·`OpsView` 고도화, `SalesView` 신규 |
| `src/app/(dashboard)/page.module.css` | 신규 위젯 클래스 추가 |

> 경로 기준: `d:/2026_cluade_build/bari-design/2026-04-15-html-verify/`

---

## Task 1: 타입 확장

**Files:**
- Modify: `src/types/dashboard.ts`

- [ ] **Step 1: 파일 전체를 아래 내용으로 교체**

```typescript
export interface StatItem { label: string; value: number | string; unit?: string }
export interface MediaStatusChip { status: 'online'|'delayed'|'error'|'offline'|'inactive'; count: number }
export interface CampaignStatusChip { status: 'active'|'draft'|'ended'; count: number }
export interface HealthCheckItem { id: string; name: string; status: 'error'|'delayed'|'offline'; detail: string }
export interface SystemStatus { label: string; status: 'sys-ok'|'sys-warn'|'sys-err'; detail: string }
export interface NotifItem { id: string; text: string; time: string; read: boolean }
export interface MapMarker { id: string; name: string; lat: number; lng: number; status: 'online'|'delayed'|'error'|'offline'|'inactive' }

// ── 신규 공통 인터페이스 ──────────────────────────────────────────────────
export interface SyncItem {
  id: string
  name: string
  status: 'synced' | 'delayed' | 'failed'
  detail?: string
}

export interface ScheduleItem {
  id: string
  date: string
  title: string
  status: 'confirmed' | 'reviewing' | 'pending'
}

export interface PendingMaterial {
  id: string
  name: string
  status: 'reviewing' | 'pending'
  progress: number
  eta: string | null
}

export interface ManagedCompany {
  id: string
  name: string
  mediaCount: number
  status: 'ok' | 'warn' | 'error'
  detail?: string
}

export interface TodoTask {
  id: string
  title: string
  priority: 'urgent' | 'today' | 'normal'
  done: boolean
}

export interface RecentSchedule {
  id: string
  title: string
  status: 'done' | 'delayed' | 'pending'
}

// ── 역할별 대시보드 타입 ─────────────────────────────────────────────────
export interface AdminDashboard {
  stats: StatItem[]
  mediaChips: MediaStatusChip[]
  campaignChips: CampaignStatusChip[]
  healthIssues: HealthCheckItem[]
  system: SystemStatus[]
  notifications: NotifItem[]
  alertBanner?: { message: string; links: { label: string; href: string }[] }
  mapMarkers: MapMarker[]
}

export interface MediaDashboard {
  stats: StatItem[]
  campaignChips: CampaignStatusChip[]
  syncStatus: SyncItem[]
  weeklySchedule: ScheduleItem[]
  pendingMaterials: PendingMaterial[]
  notifications: NotifItem[]
}

export interface OpsDashboard {
  stats: StatItem[]
  managedCompanies: ManagedCompany[]
  weeklyScheduleProgress: { done: number; total: number }
  recentSchedules: RecentSchedule[]
  todayTasks: TodoTask[]
  notifications: NotifItem[]
}

export interface SalesDashboard {
  stats: StatItem[]
  campaigns: { id: string; name: string; status: 'active' | 'reviewing' | 'draft' | 'ended' }[]
  pendingMaterials: PendingMaterial[]
  notifications: NotifItem[]
}
```

- [ ] **Step 2: 타입 오류 확인**

```bash
cd d:/2026_cluade_build/bari-design/2026-04-15-html-verify
npx tsc --noEmit 2>&1 | head -30
```

Expected: `page.tsx`에서 `OpsDashboard` 관련 오류 발생 (아직 픽스처/컴포넌트 미수정). 타입 파일 자체 오류는 없어야 함.

- [ ] **Step 3: 커밋**

```bash
git add src/types/dashboard.ts
git commit -m "feat(dashboard): 역할별 대시보드 타입 확장 — SalesDashboard 신규, Media/Ops 필드 추가"
```

---

## Task 2: 픽스처 데이터 교체

**Files:**
- Modify: `src/mocks/fixtures/dashboard.json`

- [ ] **Step 1: `media` 섹션 교체**

`dashboard.json`의 `"media"` 값을 아래로 교체:

```json
"media": {
  "stats": [
    { "label": "보유 매체", "value": 8 },
    { "label": "진행 캠페인", "value": 5 },
    { "label": "동기화 미완료", "value": 1 },
    { "label": "검수 대기", "value": 1 }
  ],
  "campaignChips": [
    { "status": "active", "count": 5 },
    { "status": "draft", "count": 2 },
    { "status": "ended", "count": 1 }
  ],
  "syncStatus": [
    { "id": "m1", "name": "강남역 출구 빌보드", "status": "synced" },
    { "id": "m2", "name": "코엑스 외벽 광고", "status": "synced" },
    { "id": "m3", "name": "홍대입구 디지털 보드", "status": "delayed", "detail": "지연 3분" },
    { "id": "m4", "name": "신촌역 스크린", "status": "failed" }
  ],
  "weeklySchedule": [
    { "id": "s1", "date": "오늘", "title": "삼성 갤럭시 S25 소재 교체", "status": "reviewing" },
    { "id": "s2", "date": "목요일", "title": "현대카드 캠페인 시작", "status": "confirmed" },
    { "id": "s3", "date": "금요일", "title": "SK텔레콤 신규 편성", "status": "pending" }
  ],
  "pendingMaterials": [
    { "id": "mat1", "name": "삼성 갤럭시 S25 소재", "status": "reviewing", "progress": 60, "eta": "약 2시간 후" }
  ],
  "notifications": [
    { "id": "n1", "text": "소재 검수 완료", "time": "30분 전", "read": false }
  ]
}
```

- [ ] **Step 2: `ops` 섹션 교체** (`scheduleAlerts` 제거, 신규 필드 추가)

`dashboard.json`의 `"ops"` 값을 아래로 교체:

```json
"ops": {
  "stats": [
    { "label": "관리 매체사", "value": 3 },
    { "label": "진행 캠페인", "value": 12 },
    { "label": "이번주 편성", "value": 7 },
    { "label": "미처리 알림", "value": 3 }
  ],
  "managedCompanies": [
    { "id": "c1", "name": "시티미디어", "mediaCount": 8, "status": "ok" },
    { "id": "c2", "name": "스크린에이드", "mediaCount": 5, "status": "warn", "detail": "편성 지연" },
    { "id": "c3", "name": "아웃도어플러스", "mediaCount": 12, "status": "ok" }
  ],
  "weeklyScheduleProgress": { "done": 5, "total": 7 },
  "recentSchedules": [
    { "id": "sch1", "title": "현대카드 4월 편성", "status": "done" },
    { "id": "sch2", "title": "4월 2주차 동기화", "status": "delayed" }
  ],
  "todayTasks": [
    { "id": "t1", "title": "스크린에이드 편성 동기화 확인", "priority": "urgent", "done": false },
    { "id": "t2", "title": "삼성전자 캠페인 편성표 제출", "priority": "today", "done": false },
    { "id": "t3", "title": "SK 5월 캠페인 초안 작성", "priority": "normal", "done": true }
  ],
  "notifications": [
    { "id": "n1", "text": "편성표 승인 요청", "time": "1시간 전", "read": false },
    { "id": "n2", "text": "4월 2주차 편성 동기화 지연 — 스크린에이드", "time": "2시간 전", "read": false }
  ]
}
```

- [ ] **Step 3: `sales` 섹션 교체** (`scheduleAlerts` 제거, 역할 특화)

`dashboard.json`의 `"sales"` 값을 아래로 교체:

```json
"sales": {
  "stats": [
    { "label": "담당 캠페인", "value": 9 },
    { "label": "검수 대기 소재", "value": 2 },
    { "label": "이번달 집행", "value": 5 }
  ],
  "campaigns": [
    { "id": "cp1", "name": "삼성전자 갤럭시 S25", "status": "active" },
    { "id": "cp2", "name": "현대카드 ZERO", "status": "reviewing" },
    { "id": "cp3", "name": "LG전자 올레드 TV", "status": "draft" }
  ],
  "pendingMaterials": [
    { "id": "mat1", "name": "현대카드 ZERO 15초", "status": "reviewing", "progress": 60, "eta": "오후 3시경" },
    { "id": "mat2", "name": "LG 올레드 30초", "status": "pending", "progress": 0, "eta": null }
  ],
  "notifications": [
    { "id": "n1", "text": "캠페인 승인 요청", "time": "2시간 전", "read": false }
  ]
}
```

- [ ] **Step 4: JSON 유효성 확인**

```bash
node -e "require('./src/mocks/fixtures/dashboard.json'); console.log('OK')"
```

Expected: `OK`

- [ ] **Step 5: 커밋**

```bash
git add src/mocks/fixtures/dashboard.json
git commit -m "feat(dashboard): 역할별 픽스처 데이터 교체 — media/ops/sales 페르소나 기반 데이터"
```

---

## Task 3: CSS 스타일 추가

**Files:**
- Modify: `src/app/(dashboard)/page.module.css`

신규 위젯에 필요한 클래스를 파일 끝에 추가한다.

- [ ] **Step 1: `page.module.css` 끝에 아래 스타일 추가**

```css
/* ── 2×2 그리드 레이아웃 (media/ops/sales 공통) ── */
.bodyGrid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--space-5);
  align-items: start;
}

/* stats 4-col */
.statsGrid4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: var(--space-4); }

/* stat card 상태 색상 변형 */
.statCard.warn {
  border-color: var(--color-warning-500);
  background: var(--color-warning-50);
}
.statCard.error {
  border-color: var(--color-error-500);
  background: var(--color-error-50);
}

/* ── 섹션 헤더 (제목 + 링크) ── */
.sectionHead {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 12px;
}
.sectionLink {
  font-size: var(--text-xs);
  color: var(--color-primary-500);
  font-weight: 600;
}

/* ── 동기화 상태 행 ── */
.syncList { display: flex; flex-direction: column; gap: 0; }
.syncItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}
.syncItem:last-child { border-bottom: none; }
.syncItem.syncDelayed {
  background: var(--color-warning-50);
  margin: 0 -20px;
  padding: 8px 20px;
}
.syncItem.syncFailed {
  background: var(--color-error-50);
  margin: 0 -20px;
  padding: 8px 20px;
}
.syncName { flex: 1; }
.syncDetail { font-size: var(--text-xs); color: var(--color-neutral-500); }

/* 상태 점 */
.statusDot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  flex-shrink: 0;
}
.dotSynced  { background: var(--color-primary-500); }
.dotDelayed { background: var(--color-warning-500); }
.dotFailed  { background: var(--color-error-500); }
.dotOk      { background: var(--color-primary-500); }
.dotWarn    { background: var(--color-warning-500); }
.dotDone    { background: var(--color-primary-500); }
.dotPending { background: var(--color-neutral-300); }

/* ── 범례 ── */
.syncLegend {
  display: flex;
  gap: 12px;
  margin-top: 8px;
  flex-wrap: wrap;
}
.legendEntry {
  display: flex;
  align-items: center;
  gap: 5px;
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}

/* ── 타임라인 (이번주 편성 일정) ── */
.timeline { display: flex; flex-direction: column; gap: 0; }
.tlItem {
  display: flex;
  align-items: flex-start;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}
.tlItem:last-child { border-bottom: none; }
.tlDate {
  min-width: 52px;
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  padding-top: 2px;
}
.tlTitle { flex: 1; }

/* ── 진행률 바 (소재 검수) ── */
.matProgress { display: flex; flex-direction: column; gap: 8px; }
.matProgressItem { display: flex; flex-direction: column; gap: 6px; }
.matProgressHeader {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: var(--text-sm);
}
.matEta { font-size: var(--text-xs); color: var(--color-neutral-500); }
.progressBarWrap { position: relative; }
.progressBar {
  height: 6px;
  background: var(--color-neutral-200);
  border-radius: 3px;
  overflow: hidden;
}
.progressFill {
  height: 100%;
  border-radius: 3px;
  background: var(--color-primary-500);
  transition: width 0.3s ease;
}
.progressFill.reviewing { background: var(--color-warning-500); }

/* ── 담당 매체사 목록 (ops) ── */
.companyList { display: flex; flex-direction: column; gap: 0; }
.companyItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 9px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}
.companyItem:last-child { border-bottom: none; }
.companyItem.companyWarn {
  background: var(--color-warning-50);
  margin: 0 -20px;
  padding: 9px 20px;
}
.companyItem.companyError {
  background: var(--color-error-50);
  margin: 0 -20px;
  padding: 9px 20px;
}
.companyName { flex: 1; font-weight: 600; }
.companyMediaCount { font-size: var(--text-xs); color: var(--color-neutral-500); margin-right: 8px; }

/* ── 진행률 + 최근 편성 (ops) ── */
.scheduleProgress { display: flex; flex-direction: column; gap: 12px; }
.scheduleProgressLabel {
  display: flex;
  justify-content: space-between;
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  margin-bottom: 4px;
}

/* ── 오늘 할 일 (ops) ── */
.taskList { display: flex; flex-direction: column; gap: 0; }
.taskItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}
.taskItem:last-child { border-bottom: none; }
.taskItem input[type="checkbox"] {
  flex-shrink: 0;
  width: 15px;
  height: 15px;
  accent-color: var(--color-primary-500);
  cursor: default;
}
.taskTitle { flex: 1; }
.taskTitle.done { text-decoration: line-through; color: var(--color-neutral-400); }

/* ── 캠페인 목록 (sales) ── */
.campaignList { display: flex; flex-direction: column; gap: 0; }
.campaignItem {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 0;
  border-bottom: 1px solid var(--color-border-default);
  font-size: var(--text-sm);
}
.campaignItem:last-child { border-bottom: none; }
.campaignName { flex: 1; }

/* ── 상태 배지 (소형) ── */
.badge {
  display: inline-flex;
  align-items: center;
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 100px;
}
.badgeOk      { background: oklch(0.93 0.06 155); color: oklch(0.42 0.14 155); }
.badgeWarn    { background: var(--color-warning-50); color: var(--color-warning-600); }
.badgeError   { background: var(--color-error-50); color: var(--color-error-500); }
.badgeGray    { background: var(--color-neutral-100); color: var(--color-neutral-500); }
.badgeActive  { background: oklch(0.93 0.06 155); color: oklch(0.42 0.14 155); }
.badgeReviewing { background: var(--color-warning-50); color: var(--color-warning-600); }
.badgeDraft   { background: var(--color-neutral-100); color: var(--color-neutral-500); }
.badgeEnded   { background: oklch(0.95 0.015 240); color: oklch(0.50 0.02 240); }
.badgeSynced  { background: oklch(0.93 0.06 155); color: oklch(0.42 0.14 155); }
.badgeDelayed { background: var(--color-warning-50); color: var(--color-warning-600); }
.badgeFailed  { background: var(--color-error-50); color: var(--color-error-500); }
.badgeUrgent  { background: var(--color-error-50); color: var(--color-error-500); }
.badgeToday   { background: var(--color-warning-50); color: var(--color-warning-600); }
.badgeDone    { background: var(--color-neutral-100); color: var(--color-neutral-500); }

/* ── 빈 상태 ── */
.emptyState {
  font-size: var(--text-sm);
  color: var(--color-neutral-400);
  text-align: center;
  padding: 20px 0;
}
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/\(dashboard\)/page.module.css
git commit -m "style(dashboard): 역할별 대시보드 신규 위젯 CSS 추가"
```

---

## Task 4: MediaView 고도화

**Files:**
- Modify: `src/app/(dashboard)/page.tsx` — `MediaView` 함수

- [ ] **Step 1: `page.tsx`의 `MediaView` 함수 전체를 아래로 교체**

`import` 문 상단에 신규 타입 임포트 추가 (`SyncItem`, `ScheduleItem`, `PendingMaterial`, `SalesDashboard` 추가):

```typescript
import type { AdminDashboard, MediaDashboard, OpsDashboard, SalesDashboard } from '@/types/dashboard'
```

그 다음, 헬퍼 함수 추가 (기존 `CHIP_LABEL`, `LEGEND` 상수 블록 아래):

```typescript
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
```

`MediaView` 함수 교체:

```typescript
function MediaView({ data }: { data: MediaDashboard }) {
  const syncFailCount = data.syncStatus.filter(s => s.status !== 'synced').length

  return (
    <>
      <div className={styles.statsGrid4}>
        {data.stats.map((s, i) => (
          <div
            key={s.label}
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
```

- [ ] **Step 2: 개발 서버에서 media 롤로 확인**

```bash
cd d:/2026_cluade_build/bari-design/2026-04-15-html-verify
npm run dev
```

브라우저에서 `http://localhost:3000` 열기 → 우상단 Role Selector에서 `media` 선택 → 4개 통계 카드, 편성 동기화 섹션, 이번주 편성 일정, 소재 검수 섹션 확인.

- [ ] **Step 3: TypeScript 오류 없음 확인**

```bash
npx tsc --noEmit 2>&1 | grep -i error | head -20
```

Expected: `OpsDashboard` 관련 오류만 남아 있어야 함 (Task 5에서 처리).

- [ ] **Step 4: 커밋**

```bash
git add src/app/\(dashboard\)/page.tsx
git commit -m "feat(dashboard): 매체사 대시보드 — 편성 동기화·일정·소재 검수 섹션 추가"
```

---

## Task 5: OpsView 고도화

**Files:**
- Modify: `src/app/(dashboard)/page.tsx` — `OpsView` 함수

- [ ] **Step 1: `OpsView` 함수 전체를 아래로 교체**

```typescript
function OpsView({ data }: { data: OpsDashboard }) {
  const unreadCount = data.notifications.filter(n => !n.read).length

  return (
    <>
      <div className={styles.statsGrid4}>
        {data.stats.map((s, i) => (
          <div
            key={s.label}
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
                  style={{ width: `${Math.round((data.weeklyScheduleProgress.done / data.weeklyScheduleProgress.total) * 100)}%` }}
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
          <div className={styles.sectionTitle}>알림</div>
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
```

- [ ] **Step 2: `ops` 롤로 확인**

브라우저에서 Role Selector → `ops` → 4개 통계 카드, 담당 매체사 현황, 편성 처리 진행률, 오늘 할 일, 알림 섹션 확인.

- [ ] **Step 3: 커밋**

```bash
git add src/app/\(dashboard\)/page.tsx
git commit -m "feat(dashboard): 운영대행사 대시보드 — 매체사 현황·편성 진행률·오늘 할 일 섹션 추가"
```

---

## Task 6: SalesView 신규 + 연결

**Files:**
- Modify: `src/app/(dashboard)/page.tsx` — `SalesView` 신규, `DashboardPage` 내 sales 분기 수정

- [ ] **Step 1: `OpsView` 함수 바로 아래에 `SalesView` 추가**

```typescript
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
          <div className={styles.sectionTitle}>알림</div>
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
```

- [ ] **Step 2: `DashboardPage` 내 sales 분기 교체**

기존:
```typescript
{data && role === 'sales' && <OpsView data={data as OpsDashboard} />}
```

교체:
```typescript
{data && role === 'sales' && <SalesView data={data as SalesDashboard} />}
```

- [ ] **Step 3: TypeScript 오류 0건 확인**

```bash
npx tsc --noEmit 2>&1
```

Expected: 출력 없음 (오류 0건)

- [ ] **Step 4: `sales` 롤로 확인**

브라우저 Role Selector → `sales` → 3개 통계 카드, 담당 캠페인 현황, 소재 검수 현황(진행률 바 포함), 알림 섹션 확인.

- [ ] **Step 5: 전체 커밋**

```bash
git add src/app/\(dashboard\)/page.tsx
git commit -m "feat(dashboard): 영업대행사 SalesView 신규 — OpsView 공유 분리"
```

---

## Task 7: 최종 검증

- [ ] **Step 1: 4개 역할 전환 확인**

브라우저 Role Selector에서 `admin` → `media` → `ops` → `sales` 순서로 전환하며 각 대시보드가 오류 없이 렌더링되는지 확인. 콘솔 오류 없어야 함.

- [ ] **Step 2: 빈 상태 확인**

`dashboard.json`에서 `media.pendingMaterials`를 `[]`로 임시 변경 → "검수 중인 소재가 없습니다" 메시지 표시 확인 → 원상 복구.

- [ ] **Step 3: TypeScript 최종 확인**

```bash
npx tsc --noEmit
```

Expected: 출력 없음

- [ ] **Step 4: ESLint 확인**

```bash
npx eslint src/app/\(dashboard\)/page.tsx --max-warnings=0
```

Expected: 경고 0건 (또는 기존과 동일한 수준)

- [ ] **Step 5: 최종 커밋**

```bash
git add -A
git status  # 변경된 파일 확인
git commit -m "feat(dashboard): 역할별 대시보드 UI 개선 완료 — 페르소나 기반 섹션 추가"
```
