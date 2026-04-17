# 잔여 27개 화면 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development (recommended) or executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `2026-04-14-html-spec/front/` 프로젝트에 매체 모듈 이외 27개 화면을 8개 도메인 배치 순서로 구현한다.

**Architecture:** Next.js 16 App Router + CSS Modules 패턴을 매체 모듈과 동일하게 적용. 각 도메인은 `types → MSW fixtures/handlers → hooks → components → pages` 순으로 완성한다. 배치간 의존성 없음 — 각 배치는 독립 실행 가능.

**Tech Stack:** Next.js 16, React 19, TypeScript, CSS Modules, TanStack Query v5, React Hook Form v7 + Zod v3, MSW v2, Recharts

**프로젝트 루트:** `D:/2026_cluade_build/bari-design/2026-04-14-html-spec/front/`

**스펙 파일 위치:** `D:/2026_cluade_build/bari-design/docs/design/screen-specs/`

**중요 규칙:**
- 구현 전 반드시 해당 스펙 파일 읽기
- 상태값 rename 금지 (스펙의 CSS 클래스명 = TypeScript 타입 값)
- 각 배치 완료 후 `npx tsc --noEmit` 통과 확인

---

## 스펙에서 확정된 타입 (설계 문서 예비값과 다름 — 이 값이 최종)

```ts
// campaign
type CampaignStatus = 'draft' | 'running' | 'done' | 'canceled'
type CampaignType   = 'direct' | 'own' | 'filler' | 'naver'

// material
type MaterialReviewStatus = 'reviewing' | 'done' | 'failed' | 'manual'
type MaterialOpsStatus    = 'active' | 'scheduled' | 'expired'

// schedule
type ScheduleStatus   = 'active' | 'pending' | 'done'
type SchedulePriority = 'prio-1' | 'prio-2' | 'prio-3'

// report
type ReportStatus = 'generating' | 'done' | 'fail'

// user
type UserRole   = 'admin' | 'media' | 'ops' | 'sales'
type UserStatus = 'active' | 'inactive' | 'invited' | 'expired'
```

---

## Task 0: 공통 UI 컴포넌트 + Recharts 설치

**Files:**
- Create: `src/components/ui/Badge.tsx`
- Create: `src/components/ui/Badge.module.css`
- Create: `src/components/ui/Tabs.tsx`
- Create: `src/components/ui/Tabs.module.css`
- Create: `src/components/ui/EmptyState.tsx`
- Create: `src/components/ui/EmptyState.module.css`
- Create: `src/components/ui/PageHeader.tsx`
- Create: `src/components/ui/PageHeader.module.css`
- Create: `src/components/ui/DateRangePicker.tsx`
- Create: `src/components/ui/DateRangePicker.module.css`
- Create: `src/components/ui/charts/ChartLine.tsx`
- Create: `src/components/ui/charts/ChartBar.tsx`

- [ ] **Step 1: Recharts 설치**

```bash
cd 2026-04-14-html-spec/front
npm install recharts
```

- [ ] **Step 2: Badge 컴포넌트 작성**

```tsx
// src/components/ui/Badge.tsx
'use client'
import styles from './Badge.module.css'

interface BadgeProps {
  variant: string   // CSS 클래스명 그대로 — 예: 'draft', 'running', 'admin'
  label: string
}

export function Badge({ variant, label }: BadgeProps) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{label}</span>
}
```

```css
/* src/components/ui/Badge.module.css */
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 8px;
  border-radius: var(--radius-full);
  font-size: var(--font-size-xs);
  font-weight: 500;
  white-space: nowrap;
}
/* 캠페인 상태 */
.draft    { background: #f3f4f6; color: #6b7280; }
.running  { background: #dcfce7; color: #16a34a; }
.done     { background: #e0e7ff; color: #4338ca; }
.canceled { background: #fee2e2; color: #dc2626; }
/* 캠페인 유형 */
.direct { background: #eff6ff; color: #2563eb; }
.own    { background: #f0fdf4; color: #16a34a; }
.filler { background: #fefce8; color: #ca8a04; }
.naver  { background: #f0fdf4; color: #15803d; }
/* 소재 검수 */
.reviewing { background: #fffbeb; color: #d97706; }
.failed    { background: #fef2f2; color: #dc2626; }
.manual    { background: #faf5ff; color: #9333ea; }
/* 소재 운영 */
.active    { background: #dcfce7; color: #16a34a; }
.scheduled { background: #eff6ff; color: #2563eb; }
.expired   { background: #f3f4f6; color: #6b7280; }
/* 편성 상태 */
.pending { background: #fffbeb; color: #d97706; }
/* 리포트 상태 */
.generating { background: #eff6ff; color: #2563eb; }
.fail       { background: #fef2f2; color: #dc2626; }
/* 사용자 역할 */
.admin { background: #fef3c7; color: #92400e; }
.media { background: #eff6ff; color: #1d4ed8; }
.ops   { background: #f0fdf4; color: #15803d; }
.sales { background: #faf5ff; color: #7c3aed; }
/* 사용자 상태 */
.inactive { background: #f3f4f6; color: #6b7280; }
.invited  { background: #fffbeb; color: #d97706; }
/* 편성 우선순위 */
.prio-1 { background: #fef2f2; color: #dc2626; }
.prio-2 { background: #fffbeb; color: #d97706; }
.prio-3 { background: #f3f4f6; color: #6b7280; }
```

- [ ] **Step 3: Tabs 컴포넌트 작성**

```tsx
// src/components/ui/Tabs.tsx
'use client'
import styles from './Tabs.module.css'

interface Tab { id: string; label: string }

interface TabsProps {
  tabs: Tab[]
  active: string
  onChange: (id: string) => void
}

export function Tabs({ tabs, active, onChange }: TabsProps) {
  return (
    <div className={styles.tabs} role="tablist">
      {tabs.map(tab => (
        <button
          key={tab.id}
          role="tab"
          aria-selected={String(active === tab.id) as 'true' | 'false'}
          aria-controls={`tabpanel-${tab.id}`}
          className={`${styles.tab} ${active === tab.id ? styles.active : ''}`}
          onClick={() => onChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
  )
}

export function TabPanel({ id, active, children }: { id: string; active: string; children: React.ReactNode }) {
  return (
    <div id={`tabpanel-${id}`} role="tabpanel" hidden={active !== id}>
      {children}
    </div>
  )
}
```

```css
/* src/components/ui/Tabs.module.css */
.tabs {
  display: flex;
  border-bottom: 2px solid var(--border-color);
  margin-bottom: 24px;
}
.tab {
  padding: 10px 20px;
  font-size: var(--font-size-base);
  font-weight: 500;
  color: var(--color-neutral-500);
  background: none;
  border: none;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}
.tab:hover { color: var(--color-neutral-700); }
.active { color: var(--color-primary-600); border-bottom-color: var(--color-primary-600); }
```

- [ ] **Step 4: EmptyState 컴포넌트 작성**

```tsx
// src/components/ui/EmptyState.tsx
import styles from './EmptyState.module.css'

interface EmptyStateProps { message?: string }

export function EmptyState({ message = '데이터가 없습니다.' }: EmptyStateProps) {
  return <div className={styles.wrap}><p className={styles.msg}>{message}</p></div>
}
```

```css
/* src/components/ui/EmptyState.module.css */
.wrap { display: flex; align-items: center; justify-content: center; padding: 56px 0; }
.msg { font-size: var(--font-size-base); color: var(--color-neutral-400); }
```

- [ ] **Step 5: PageHeader 컴포넌트 작성**

```tsx
// src/components/ui/PageHeader.tsx
import styles from './PageHeader.module.css'

interface PageHeaderProps {
  title: string
  desc?: string
  actions?: React.ReactNode
}

export function PageHeader({ title, desc, actions }: PageHeaderProps) {
  return (
    <div className={styles.header}>
      <div>
        <h1 className={styles.title}>{title}</h1>
        {desc && <p className={styles.desc}>{desc}</p>}
      </div>
      {actions && <div className={styles.actions}>{actions}</div>}
    </div>
  )
}
```

```css
/* src/components/ui/PageHeader.module.css */
.header { display: flex; align-items: flex-start; justify-content: space-between; margin-bottom: 20px; gap: 16px; }
.title { font-size: var(--font-size-xl); font-weight: 700; color: var(--color-neutral-900); line-height: 1.2; }
.desc { font-size: var(--font-size-sm); color: var(--color-neutral-500); margin-top: 4px; }
.actions { display: flex; gap: 8px; }
```

- [ ] **Step 6: DateRangePicker 컴포넌트 작성**

```tsx
// src/components/ui/DateRangePicker.tsx
'use client'
import styles from './DateRangePicker.module.css'

interface DateRangePickerProps {
  startDate: string
  endDate: string
  onStartChange: (v: string) => void
  onEndChange: (v: string) => void
  label?: string
  required?: boolean
}

export function DateRangePicker({ startDate, endDate, onStartChange, onEndChange, label, required }: DateRangePickerProps) {
  return (
    <div className={styles.wrap}>
      {label && <label className={`${styles.label} ${required ? styles.required : ''}`}>{label}</label>}
      <div className={styles.inputs}>
        <input type="date" className={styles.input} value={startDate} onChange={e => onStartChange(e.target.value)} />
        <span className={styles.sep}>~</span>
        <input type="date" className={styles.input} value={endDate} onChange={e => onEndChange(e.target.value)} />
      </div>
    </div>
  )
}
```

```css
/* src/components/ui/DateRangePicker.module.css */
.wrap { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--font-size-sm); font-weight: 500; color: var(--color-neutral-700); }
.required::after { content: ' *'; color: var(--color-error-500); }
.inputs { display: flex; align-items: center; gap: 8px; }
.input { height: 38px; padding: 0 10px; border: 1px solid var(--border-color); border-radius: var(--radius-md); font-size: var(--font-size-base); outline: none; }
.input:focus { border-color: var(--color-primary-500); }
.sep { color: var(--color-neutral-400); }
```

- [ ] **Step 7: ChartLine / ChartBar 래퍼 작성**

```tsx
// src/components/ui/charts/ChartLine.tsx
'use client'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface ChartLineProps {
  data: Array<Record<string, unknown>>
  xKey: string
  lines: Array<{ key: string; color: string; label: string }>
  height?: number
}

export function ChartLine({ data, xKey, lines, height = 280 }: ChartLineProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        {lines.map(l => (
          <Line key={l.key} type="monotone" dataKey={l.key} stroke={l.color} strokeWidth={2} dot={false} name={l.label} />
        ))}
      </LineChart>
    </ResponsiveContainer>
  )
}
```

```tsx
// src/components/ui/charts/ChartBar.tsx
'use client'
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts'

interface ChartBarProps {
  data: Array<Record<string, unknown>>
  xKey: string
  bars: Array<{ key: string; color: string; label: string }>
  height?: number
}

export function ChartBar({ data, xKey, bars, height = 280 }: ChartBarProps) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey={xKey} tick={{ fontSize: 11 }} />
        <YAxis tick={{ fontSize: 11 }} />
        <Tooltip />
        <Legend />
        {bars.map(b => <Bar key={b.key} dataKey={b.key} fill={b.color} name={b.label} />)}
      </BarChart>
    </ResponsiveContainer>
  )
}
```

- [ ] **Step 8: TypeScript 확인**

```bash
npx tsc --noEmit
```
Expected: 오류 없음

- [ ] **Step 9: 커밋**

```bash
git add src/components/ui/
git commit -m "feat: 공통 UI 컴포넌트 추가 (Badge, Tabs, EmptyState, PageHeader, DateRangePicker, 차트)"
```

---

## Task 1: 배치 1 — 인증 (2화면)

**스펙:** `login.md`, `signup-complete.md`

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/layout.module.css`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/login/login.module.css`
- Create: `src/app/(auth)/signup/complete/page.tsx`
- Create: `src/mocks/handlers/auth.ts`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/login.md
cat docs/design/screen-specs/signup-complete.md
```

- [ ] **Step 2: (auth) 레이아웃 작성**

```tsx
// src/app/(auth)/layout.tsx
import styles from './layout.module.css'

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.wrap}>
      <div className={styles.card}>{children}</div>
    </div>
  )
}
```

```css
/* src/app/(auth)/layout.module.css */
.wrap {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-neutral-50);
}
.card {
  width: 100%;
  max-width: 400px;
  background: var(--color-neutral-0);
  border: 1px solid var(--border-color);
  border-radius: var(--radius-xl);
  padding: 40px;
  box-shadow: var(--shadow-md);
}
```

- [ ] **Step 3: MSW auth 핸들러 작성**

```ts
// src/mocks/handlers/auth.ts
import { http, HttpResponse } from 'msw'

export const authHandlers = [
  http.post('/api/auth/login', async ({ request }) => {
    const body = await request.json() as { email: string; password: string }
    if (body.email === 'admin@bari.com' && body.password === 'password') {
      return HttpResponse.json({ token: 'mock-token', role: 'admin', name: '관리자' })
    }
    return HttpResponse.json({ message: '이메일 또는 비밀번호가 올바르지 않습니다.' }, { status: 401 })
  }),

  http.post('/api/auth/signup', async () => {
    return HttpResponse.json({ ok: true })
  }),
]
```

- [ ] **Step 4: browser.ts에 auth 핸들러 추가**

```ts
// src/mocks/browser.ts 에 추가
import { authHandlers } from './handlers/auth'
// setupWorker(...) 인자에 ...authHandlers 추가
```

- [ ] **Step 5: 로그인 페이지 작성**

스펙(`login.md`) 읽어 필드·유효성 검사 확인 후:

```tsx
// src/app/(auth)/login/page.tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import styles from './login.module.css'

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})

type FormValues = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, setError, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
  })

  const onSubmit = async (data: FormValues) => {
    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    })
    if (!res.ok) {
      const err = await res.json()
      setError('root', { message: err.message })
      return
    }
    router.push('/')
  }

  return (
    <div>
      <div className={styles.logo}>Bari DOOH</div>
      <h1 className={styles.title}>로그인</h1>
      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.field}>
          <label className={styles.label}>이메일</label>
          <input {...register('email')} type="email" className={`${styles.input} ${errors.email ? styles.error : ''}`} placeholder="admin@bari.com" />
          {errors.email && <p className={styles.errMsg}>{errors.email.message}</p>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>비밀번호</label>
          <input {...register('password')} type="password" className={`${styles.input} ${errors.password ? styles.error : ''}`} placeholder="비밀번호" />
          {errors.password && <p className={styles.errMsg}>{errors.password.message}</p>}
        </div>
        {errors.root && <p className={styles.rootErr}>{errors.root.message}</p>}
        <Button type="submit" style={{ width: '100%', marginTop: '8px' }} disabled={isSubmitting}>
          로그인
        </Button>
      </form>
    </div>
  )
}
```

- [ ] **Step 6: 가입 완료 페이지 작성**

스펙(`signup-complete.md`) 읽어 내용 확인 후 작성.

```tsx
// src/app/(auth)/signup/complete/page.tsx
import Link from 'next/link'
import { Button } from '@/components/ui/Button'

export default function SignupCompletePage() {
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontSize: '48px', marginBottom: '16px' }}>✅</div>
      <h1 style={{ fontSize: 'var(--font-size-xl)', fontWeight: 700, marginBottom: '8px' }}>
        가입이 완료되었습니다
      </h1>
      <p style={{ fontSize: 'var(--font-size-sm)', color: 'var(--color-neutral-500)', marginBottom: '24px' }}>
        관리자 승인 후 서비스를 이용하실 수 있습니다.
      </p>
      <Link href="/login"><Button variant="secondary">로그인 페이지로</Button></Link>
    </div>
  )
}
```

- [ ] **Step 7: TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/app/(auth)/ src/mocks/handlers/auth.ts src/mocks/browser.ts
git commit -m "feat(auth): 로그인·가입완료 페이지 구현"
```

---

## Task 2: 배치 2 — 대시보드 (3화면)

**스펙:** `dashboard-admin.md`, `dashboard-media-company.md`, `dashboard-ops-agency.md`

**Files:**
- Create: `src/types/dashboard.ts`
- Create: `src/mocks/fixtures/dashboard.json`
- Create: `src/mocks/handlers/dashboard.ts`
- Create: `src/hooks/dashboard/useDashboard.ts`
- Create: `src/components/domain/dashboard/AdminDashboard.tsx`
- Create: `src/components/domain/dashboard/MediaCompanyDashboard.tsx`
- Create: `src/components/domain/dashboard/OpsAgencyDashboard.tsx`
- Create: `src/components/domain/dashboard/dashboard.module.css`
- Modify: `src/app/(dashboard)/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 3개 읽기**

```bash
cat docs/design/screen-specs/dashboard-admin.md
cat docs/design/screen-specs/dashboard-media-company.md
cat docs/design/screen-specs/dashboard-ops-agency.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/dashboard.ts
export type SystemStatus = 'sys-ok' | 'sys-warn' | 'sys-err'
export type DashboardRole = 'admin' | 'media-company' | 'ops-agency'

export interface AdminDashboardData {
  stats: { totalMedia: number; online: number; error: number; campaigns: number }
  systemStatus: { server: SystemStatus; db: SystemStatus; batch: SystemStatus }
  healthAlerts: Array<{ mediaId: string; mediaName: string; message: string; timestamp: string }>
  recentNotifications: Array<{ id: string; message: string; timestamp: string }>
}

export interface MediaCompanyDashboardData {
  stats: { totalMedia: number; online: number; activeCampaigns: number; monthlyImpressions: number }
  recentMedia: Array<{ id: string; name: string; status: string }>
}

export interface OpsAgencyDashboardData {
  stats: { assignedMedia: number; activeCampaigns: number; pendingMaterials: number }
  assignedMedia: Array<{ id: string; name: string; status: string }>
}
```

- [ ] **Step 3: MSW fixture + handler 작성**

```json
// src/mocks/fixtures/dashboard.json
{
  "admin": {
    "stats": { "totalMedia": 111, "online": 89, "error": 4, "campaigns": 23 },
    "systemStatus": { "server": "sys-ok", "db": "sys-ok", "batch": "sys-warn" },
    "healthAlerts": [
      { "mediaId": "m-003", "mediaName": "여의도 버스 광고", "message": "연결 오류 감지", "timestamp": "2026-04-14T10:15:00" }
    ],
    "recentNotifications": [
      { "id": "n-1", "message": "소재 검수 완료: 봄 시즌 광고", "timestamp": "2026-04-14T09:30:00" }
    ]
  },
  "media-company": {
    "stats": { "totalMedia": 60, "online": 52, "activeCampaigns": 8, "monthlyImpressions": 1240000 },
    "recentMedia": [
      { "id": "m-001", "name": "강남역 1번 출구", "status": "online" }
    ]
  },
  "ops-agency": {
    "stats": { "assignedMedia": 12, "activeCampaigns": 3, "pendingMaterials": 2 },
    "assignedMedia": [
      { "id": "m-001", "name": "강남역 1번 출구", "status": "online" }
    ]
  }
}
```

```ts
// src/mocks/handlers/dashboard.ts
import { http, HttpResponse } from 'msw'
import data from '../fixtures/dashboard.json'

export const dashboardHandlers = [
  http.get('/api/dashboard', ({ request }) => {
    const role = new URL(request.url).searchParams.get('role') || 'admin'
    return HttpResponse.json(data[role as keyof typeof data] || data.admin)
  }),
]
```

- [ ] **Step 4: hook 작성**

```ts
// src/hooks/dashboard/useDashboard.ts
import { useQuery } from '@tanstack/react-query'
import type { DashboardRole } from '@/types/dashboard'

export function useDashboard(role: DashboardRole) {
  return useQuery({
    queryKey: ['dashboard', role],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard?role=${role}`)
      return res.json()
    },
  })
}
```

- [ ] **Step 5: 역할별 Dashboard 컴포넌트 작성**

스펙에서 확인한 레이아웃 기준으로 각 역할별 컴포넌트 작성:
- `AdminDashboard`: 4열 스탯 + 시스템현황(sys-ok/sys-warn/sys-err 배지) + 헬스체크 이상 목록 + 매체 지도 placeholder
- `MediaCompanyDashboard`: 4열 스탯 + 최근 매체 현황
- `OpsAgencyDashboard`: 3열 스탯 + 배정 매체 목록

각 컴포넌트 prop: `data: <역할>DashboardData`

- [ ] **Step 6: 대시보드 page.tsx 교체**

```tsx
// src/app/(dashboard)/page.tsx
'use client'
import { useState } from 'react'
import { AppShell } from '@/components/layout/AppShell'
import { AdminDashboard } from '@/components/domain/dashboard/AdminDashboard'
import { MediaCompanyDashboard } from '@/components/domain/dashboard/MediaCompanyDashboard'
import { OpsAgencyDashboard } from '@/components/domain/dashboard/OpsAgencyDashboard'
import { useDashboard } from '@/hooks/dashboard/useDashboard'
import type { DashboardRole } from '@/types/dashboard'

const ROLES: Array<{ value: DashboardRole; label: string }> = [
  { value: 'admin', label: '어드민' },
  { value: 'media-company', label: '매체사' },
  { value: 'ops-agency', label: '운영대행사' },
]

export default function DashboardPage() {
  const [role, setRole] = useState<DashboardRole>('admin')
  const { data } = useDashboard(role)

  return (
    <AppShell breadcrumbs={[{ label: '대시보드' }]}>
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px' }}>
        {ROLES.map(r => (
          <button
            key={r.value}
            onClick={() => setRole(r.value)}
            style={{
              padding: '6px 14px', borderRadius: '6px', border: '1px solid',
              borderColor: role === r.value ? 'var(--color-primary-600)' : 'var(--border-color)',
              background: role === r.value ? 'var(--color-primary-50)' : '#fff',
              color: role === r.value ? 'var(--color-primary-700)' : 'var(--color-neutral-600)',
              cursor: 'pointer', fontSize: '13px',
            }}
          >{r.label}</button>
        ))}
      </div>
      {data && role === 'admin' && <AdminDashboard data={data} />}
      {data && role === 'media-company' && <MediaCompanyDashboard data={data} />}
      {data && role === 'ops-agency' && <OpsAgencyDashboard data={data} />}
    </AppShell>
  )
}
```

- [ ] **Step 7: browser.ts 업데이트 + TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/dashboard.ts src/mocks/ src/hooks/dashboard/ src/components/domain/dashboard/ src/app/\(dashboard\)/page.tsx
git commit -m "feat(dashboard): 역할별 대시보드 3종 구현"
```

---

## Task 3: 배치 3 — 사용자·설정·알림 (5화면)

**스펙:** `user-list.md`, `user-invite.md`, `my-profile.md`, `notification-center.md`, `system-settings.md`

**Files:**
- Create: `src/types/user.ts`
- Create: `src/mocks/fixtures/users.json`
- Create: `src/mocks/fixtures/notifications.json`
- Create: `src/mocks/handlers/users.ts`
- Create: `src/mocks/handlers/notifications.ts`
- Create: `src/hooks/users/useUsers.ts`
- Create: `src/hooks/notifications/useNotifications.ts`
- Create: `src/components/domain/users/UserTable.tsx`
- Create: `src/app/(dashboard)/users/page.tsx`
- Create: `src/app/(dashboard)/users/invite/page.tsx`
- Create: `src/app/(dashboard)/settings/profile/page.tsx`
- Create: `src/app/(dashboard)/settings/notifications/page.tsx`
- Create: `src/app/(dashboard)/settings/system/page.tsx`
- Create: `src/app/(dashboard)/notifications/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/user-list.md
cat docs/design/screen-specs/user-invite.md
cat docs/design/screen-specs/my-profile.md
cat docs/design/screen-specs/notification-center.md
cat docs/design/screen-specs/system-settings.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/user.ts
export type UserRole   = 'admin' | 'media' | 'ops' | 'sales'
export type UserStatus = 'active' | 'inactive' | 'invited' | 'expired'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  company?: string
  invitedAt?: string
  lastLoginAt?: string
  createdAt: string
}

export interface Notification {
  id: string
  type: string
  title: string
  message: string
  read: boolean
  timestamp: string
  actionLabel?: string
  actionUrl?: string
}
```

- [ ] **Step 3: MSW fixtures 작성**

```json
// src/mocks/fixtures/users.json — 6개, 모든 role+status 커버
[
  { "id": "u-001", "name": "김관리", "email": "admin@bari.com", "role": "admin", "status": "active", "createdAt": "2025-10-01" },
  { "id": "u-002", "name": "이매체", "email": "media@naver.com", "role": "media", "status": "active", "company": "네이버 OOH 미디어", "createdAt": "2025-11-01" },
  { "id": "u-003", "name": "박운영", "email": "ops@agency.com", "role": "ops", "status": "active", "company": "운영대행사", "createdAt": "2025-12-01" },
  { "id": "u-004", "name": "최영업", "email": "sales@agency.com", "role": "sales", "status": "inactive", "createdAt": "2026-01-01" },
  { "id": "u-005", "name": "정초대", "email": "invited@test.com", "role": "media", "status": "invited", "invitedAt": "2026-04-10", "createdAt": "2026-04-10" },
  { "id": "u-006", "name": "한만료", "email": "expired@test.com", "role": "ops", "status": "expired", "createdAt": "2025-06-01" }
]
```

```json
// src/mocks/fixtures/notifications.json — 5개
[
  { "id": "n-001", "type": "material", "title": "소재 검수 완료", "message": "봄 시즌 광고 소재가 검수 완료되었습니다.", "read": false, "timestamp": "2026-04-14T10:30:00" },
  { "id": "n-002", "type": "media", "title": "매체 이상 감지", "message": "여의도 버스 광고에서 연결 오류가 감지되었습니다.", "read": false, "timestamp": "2026-04-14T09:15:00" },
  { "id": "n-003", "type": "campaign", "title": "캠페인 시작", "message": "봄 프로모션 캠페인이 시작되었습니다.", "read": true, "timestamp": "2026-04-13T08:00:00" },
  { "id": "n-004", "type": "system", "title": "배치 경고", "message": "야간 배치 작업이 지연되고 있습니다.", "read": true, "timestamp": "2026-04-12T03:00:00" },
  { "id": "n-005", "type": "user", "title": "초대 수락", "message": "정초대 님이 초대를 수락했습니다.", "read": true, "timestamp": "2026-04-11T14:00:00" }
]
```

- [ ] **Step 4: MSW handlers 작성**

```ts
// src/mocks/handlers/users.ts
import { http, HttpResponse } from 'msw'
import usersFixture from '../fixtures/users.json'
import type { User } from '@/types/user'

let users: User[] = [...usersFixture] as User[]

export const userHandlers = [
  http.get('/api/users', ({ request }) => {
    const url = new URL(request.url)
    const role = url.searchParams.get('role')
    const status = url.searchParams.get('status')
    const q = url.searchParams.get('q')
    let result = [...users]
    if (role) result = result.filter(u => u.role === role)
    if (status) result = result.filter(u => u.status === status)
    if (q) result = result.filter(u => u.name.includes(q) || u.email.includes(q))
    return HttpResponse.json(result)
  }),

  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json() as Partial<User>
    const dup = users.find(u => u.email === body.email)
    if (dup) return HttpResponse.json({ message: '이미 존재하는 이메일입니다.' }, { status: 409 })
    const newUser: User = {
      id: `u-${Date.now()}`, name: '', status: 'invited',
      invitedAt: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString().split('T')[0],
      ...body,
    } as User
    users.push(newUser)
    return HttpResponse.json(newUser, { status: 201 })
  }),

  http.get('/api/me', () => HttpResponse.json(users[0])),
  http.put('/api/me', async ({ request }) => {
    const body = await request.json() as Partial<User>
    users[0] = { ...users[0], ...body }
    return HttpResponse.json(users[0])
  }),

  http.get('/api/settings', () => HttpResponse.json({ slackWebhook: '', systemAlerts: true })),
  http.put('/api/settings', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json(body)
  }),
]
```

```ts
// src/mocks/handlers/notifications.ts
import { http, HttpResponse } from 'msw'
import notiFixture from '../fixtures/notifications.json'
import type { Notification } from '@/types/user'

let notifications: Notification[] = [...notiFixture] as Notification[]

export const notificationHandlers = [
  http.get('/api/notifications', () => HttpResponse.json(notifications)),

  http.patch('/api/notifications/:id/read', ({ params }) => {
    const idx = notifications.findIndex(n => n.id === params.id)
    if (idx !== -1) notifications[idx] = { ...notifications[idx], read: true }
    return HttpResponse.json(notifications[idx])
  }),

  http.post('/api/notifications/read-all', () => {
    notifications = notifications.map(n => ({ ...n, read: true }))
    return HttpResponse.json({ ok: true })
  }),
]
```

- [ ] **Step 5: hooks 작성**

```ts
// src/hooks/users/useUsers.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { User } from '@/types/user'

export function useUsers(params: { role?: string; status?: string; q?: string } = {}) {
  return useQuery<User[]>({
    queryKey: ['users', params],
    queryFn: async () => {
      const url = new URL('/api/users', window.location.origin)
      if (params.role) url.searchParams.set('role', params.role)
      if (params.status) url.searchParams.set('status', params.status)
      if (params.q) url.searchParams.set('q', params.q)
      const res = await fetch(url)
      return res.json()
    },
  })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await fetch('/api/users/invite', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      })
      if (!res.ok) { const e = await res.json(); throw Object.assign(new Error(e.message), { status: res.status }) }
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['users'] }),
  })
}

export function useMe() {
  return useQuery<User>({ queryKey: ['me'], queryFn: () => fetch('/api/me').then(r => r.json()) })
}

export function useUpdateMe() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<User>) => {
      const res = await fetch('/api/me', { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(data) })
      return res.json()
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['me'] }),
  })
}
```

```ts
// src/hooks/notifications/useNotifications.ts
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import type { Notification } from '@/types/user'

export function useNotifications() {
  return useQuery<Notification[]>({ queryKey: ['notifications'], queryFn: () => fetch('/api/notifications').then(r => r.json()) })
}

export function useMarkRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      await fetch(`/api/notifications/${id}/read`, { method: 'PATCH' })
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}

export function useMarkAllRead() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: () => fetch('/api/notifications/read-all', { method: 'POST' }).then(r => r.json()),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['notifications'] }),
  })
}
```

- [ ] **Step 6: user-list / user-invite 페이지 작성**

스펙의 컬럼·필터·탭 기준으로 작성. `Badge` 컴포넌트로 `role`, `status` 표시.

user-list 테이블 컬럼 (스펙 확인 후):
- 이름 / 이메일 / 역할(Badge) / 상태(Badge) / 소속 / 마지막 로그인 / 등록일

user-invite 폼: 이름, 이메일, 역할(radio), 소속 회사 — Zod validation 포함.

- [ ] **Step 7: my-profile / settings / notification-center 페이지 작성**

스펙의 필드와 레이아웃 기준으로 작성.

- [ ] **Step 8: browser.ts 업데이트 + TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/user.ts src/mocks/ src/hooks/users/ src/hooks/notifications/ src/components/domain/users/ "src/app/(dashboard)/users/" "src/app/(dashboard)/settings/" "src/app/(dashboard)/notifications/"
git commit -m "feat(user): 사용자 목록·초대·프로필·설정·알림센터 구현"
```

---

## Task 4: 배치 4 — 소재 (3화면)

**스펙:** `material-list.md`, `material-detail.md`, `material-spec-guide.md`

**Files:**
- Create: `src/types/material.ts`
- Create: `src/mocks/fixtures/materials.json`
- Create: `src/mocks/handlers/materials.ts`
- Create: `src/hooks/materials/useMaterials.ts`
- Create: `src/components/domain/materials/MaterialTable.tsx`
- Create: `src/components/domain/materials/MaterialReviewBadge.tsx`
- Create: `src/app/(dashboard)/materials/page.tsx`
- Create: `src/app/(dashboard)/materials/[id]/page.tsx`
- Create: `src/app/(dashboard)/materials/spec-guide/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/material-list.md
cat docs/design/screen-specs/material-detail.md
cat docs/design/screen-specs/material-spec-guide.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/material.ts
export type MaterialReviewStatus = 'reviewing' | 'done' | 'failed' | 'manual'
export type MaterialOpsStatus    = 'active' | 'scheduled' | 'expired'

export interface Material {
  id: string
  name: string
  type: string            // 영상/이미지
  duration?: number       // 초
  resolution: string
  fileSize: string
  uploader: string
  uploaderCompany: string
  reviewStatus: MaterialReviewStatus
  opsStatus: MaterialOpsStatus
  reviewedAt?: string
  reviewNote?: string
  uploadedAt: string
  thumbnailUrl?: string
}
```

- [ ] **Step 3: MSW fixture 작성 — 6개, 모든 reviewStatus 커버**

```json
// src/mocks/fixtures/materials.json
[
  { "id": "mat-001", "name": "봄 시즌 광고 15초", "type": "영상", "duration": 15, "resolution": "1920×1080", "fileSize": "45MB", "uploader": "이매체", "uploaderCompany": "네이버 OOH 미디어", "reviewStatus": "done", "opsStatus": "active", "uploadedAt": "2026-04-01" },
  { "id": "mat-002", "name": "여름 이벤트 배너", "type": "이미지", "resolution": "1080×1920", "fileSize": "2.3MB", "uploader": "이매체", "uploaderCompany": "네이버 OOH 미디어", "reviewStatus": "reviewing", "opsStatus": "scheduled", "uploadedAt": "2026-04-10" },
  { "id": "mat-003", "name": "신제품 출시 30초", "type": "영상", "duration": 30, "resolution": "1920×1080", "fileSize": "92MB", "uploader": "박운영", "uploaderCompany": "카카오 스크린", "reviewStatus": "failed", "opsStatus": "expired", "reviewNote": "해상도 미달", "uploadedAt": "2026-03-20" },
  { "id": "mat-004", "name": "공익 광고 10초", "type": "영상", "duration": 10, "resolution": "1920×1080", "fileSize": "28MB", "uploader": "김관리", "uploaderCompany": "어드민", "reviewStatus": "manual", "opsStatus": "active", "uploadedAt": "2026-04-05" },
  { "id": "mat-005", "name": "브랜드 슬로건 이미지", "type": "이미지", "resolution": "1920×1080", "fileSize": "1.8MB", "uploader": "이매체", "uploaderCompany": "네이버 OOH 미디어", "reviewStatus": "done", "opsStatus": "active", "uploadedAt": "2026-03-15" },
  { "id": "mat-006", "name": "쇼핑 시즌 프로모션", "type": "영상", "duration": 20, "resolution": "1080×1920", "fileSize": "62MB", "uploader": "박운영", "uploaderCompany": "롯데 광고", "reviewStatus": "reviewing", "opsStatus": "scheduled", "uploadedAt": "2026-04-12" }
]
```

- [ ] **Step 4: MSW handler 작성**

```ts
// src/mocks/handlers/materials.ts
import { http, HttpResponse } from 'msw'
import materialsFixture from '../fixtures/materials.json'
import type { Material } from '@/types/material'

let materials: Material[] = [...materialsFixture] as Material[]

export const materialHandlers = [
  http.get('/api/materials', ({ request }) => {
    const url = new URL(request.url)
    const reviewStatus = url.searchParams.get('reviewStatus')
    const opsStatus = url.searchParams.get('opsStatus')
    const q = url.searchParams.get('q')
    let result = [...materials]
    if (reviewStatus) result = result.filter(m => m.reviewStatus === reviewStatus)
    if (opsStatus) result = result.filter(m => m.opsStatus === opsStatus)
    if (q) result = result.filter(m => m.name.includes(q) || m.uploader.includes(q))
    return HttpResponse.json({ items: result, total: result.length, manualPending: result.filter(m => m.reviewStatus === 'manual').length })
  }),

  http.get('/api/materials/:id', ({ params }) => {
    const m = materials.find(m => m.id === params.id)
    if (!m) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(m)
  }),

  http.patch('/api/materials/:id/review', async ({ params, request }) => {
    const body = await request.json() as { reviewStatus: MaterialReviewStatus; reviewNote?: string }
    const idx = materials.findIndex(m => m.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    materials[idx] = { ...materials[idx], ...body, reviewedAt: new Date().toISOString().split('T')[0] }
    return HttpResponse.json(materials[idx])
  }),
]
```

- [ ] **Step 5: hook + 컴포넌트 + 페이지 작성**

`material-list.md` 기준:
- 테이블 8열 (스펙 컬럼 수 준수)
- GNB에 수동검수대기 N건 배지 (warning)
- 필터: 검수상태, 운영상태, 소속사, 검색

`material-detail.md` 기준:
- 2컬럼 레이아웃: 좌측 미리보기, 우측 정보
- 검수 완료/반려 버튼 (Zod form)

`material-spec-guide.md` 기준:
- 정적 페이지 — API 없음, 규격 표 나열

- [ ] **Step 6: TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/material.ts src/mocks/ src/hooks/materials/ src/components/domain/materials/ "src/app/(dashboard)/materials/"
git commit -m "feat(material): 소재 목록·상세·규격 안내 구현"
```

---

## Task 5: 배치 5 — 캠페인 (3화면)

**스펙:** `campaign-list.md`, `campaign-form.md`, `campaign-detail.md`

**Files:**
- Create: `src/types/campaign.ts`
- Create: `src/mocks/fixtures/campaigns.json`
- Create: `src/mocks/handlers/campaigns.ts`
- Create: `src/hooks/campaigns/useCampaigns.ts`
- Create: `src/components/domain/campaigns/CampaignTable.tsx`
- Create: `src/components/domain/campaigns/CampaignForm.tsx`
- Create: `src/components/domain/campaigns/CampaignForm.module.css`
- Create: `src/app/(dashboard)/campaigns/page.tsx`
- Create: `src/app/(dashboard)/campaigns/new/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/edit/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/campaign-list.md
cat docs/design/screen-specs/campaign-form.md
cat docs/design/screen-specs/campaign-detail.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/campaign.ts
export type CampaignStatus = 'draft' | 'running' | 'done' | 'canceled'
export type CampaignType   = 'direct' | 'own' | 'filler' | 'naver'

export interface Campaign {
  id: string
  name: string
  type: CampaignType
  status: CampaignStatus
  advertiser: string
  startDate: string
  endDate: string
  budget?: number
  mediaIds: string[]
  materialIds: string[]
  createdBy: string
  createdAt: string
  note?: string
}
```

- [ ] **Step 3: MSW fixture — 5개, 모든 status + type 커버**

```json
// src/mocks/fixtures/campaigns.json
[
  { "id": "c-001", "name": "봄 시즌 프로모션", "type": "direct", "status": "running", "advertiser": "네이버", "startDate": "2026-04-01", "endDate": "2026-04-30", "budget": 5000000, "mediaIds": ["m-001", "m-002"], "materialIds": ["mat-001"], "createdBy": "이매체", "createdAt": "2026-03-25" },
  { "id": "c-002", "name": "공익 캠페인 Q2", "type": "own", "status": "draft", "advertiser": "서울시", "startDate": "2026-05-01", "endDate": "2026-05-31", "budget": 0, "mediaIds": [], "materialIds": ["mat-004"], "createdBy": "김관리", "createdAt": "2026-04-10" },
  { "id": "c-003", "name": "롯데 신제품 출시", "type": "direct", "status": "done", "advertiser": "롯데", "startDate": "2026-03-01", "endDate": "2026-03-31", "budget": 8000000, "mediaIds": ["m-004"], "materialIds": ["mat-003"], "createdBy": "박운영", "createdAt": "2026-02-20" },
  { "id": "c-004", "name": "여름 필러 광고", "type": "filler", "status": "draft", "advertiser": "내부", "startDate": "2026-06-01", "endDate": "2026-08-31", "budget": 0, "mediaIds": [], "materialIds": [], "createdBy": "김관리", "createdAt": "2026-04-12" },
  { "id": "c-005", "name": "취소된 캠페인", "type": "naver", "status": "canceled", "advertiser": "카카오", "startDate": "2026-04-05", "endDate": "2026-04-20", "budget": 3000000, "mediaIds": [], "materialIds": [], "createdBy": "이매체", "createdAt": "2026-04-03" }
]
```

- [ ] **Step 4: MSW handler + hook + 컴포넌트 + 페이지 작성**

campaign-list 테이블 (스펙 기준):
- 캠페인명 / 유형(Badge) / 상태(Badge dot+텍스트) / 광고주 / 기간 / 매체수 / 등록일

campaign-form: DateRangePicker 사용. Zod schema 포함.

campaign-detail: 탭 3개 (기본정보 / 소재 / 편성) — `Tabs` 컴포넌트 사용.

- [ ] **Step 5: TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/campaign.ts src/mocks/ src/hooks/campaigns/ src/components/domain/campaigns/ "src/app/(dashboard)/campaigns/"
git commit -m "feat(campaign): 캠페인 목록·등록·상세 구현"
```

---

## Task 6: 배치 6 — 재생목록 (2화면)

**스펙:** `playlist-list.md`, `playlist-edit.md`

**Files:**
- Create: `src/types/playlist.ts`
- Create: `src/mocks/fixtures/playlists.json`
- Create: `src/mocks/handlers/playlists.ts`
- Create: `src/hooks/playlists/usePlaylists.ts`
- Create: `src/components/domain/playlists/PlaylistCard.tsx`
- Create: `src/components/domain/playlists/PlaylistEditor.tsx`
- Create: `src/components/domain/playlists/PlaylistEditor.module.css`
- Create: `src/app/(dashboard)/playlists/page.tsx`
- Create: `src/app/(dashboard)/playlists/[id]/edit/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/playlist-list.md
cat docs/design/screen-specs/playlist-edit.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/playlist.ts
export interface PlaylistItem {
  id: string
  materialId: string
  materialName: string
  duration: number        // 초
  order: number
  deleted?: boolean       // 소재 삭제 여부 — .pl-warning 표시 기준
}

export interface Playlist {
  id: string
  name: string
  totalDuration: number
  itemCount: number
  items: PlaylistItem[]
  hasDeletedMaterial: boolean  // .pl-warning 배지 여부
  createdAt: string
  updatedAt: string
}
```

- [ ] **Step 3: MSW fixture + handler 작성**

```json
// src/mocks/fixtures/playlists.json
[
  { "id": "pl-001", "name": "강남권 기본 재생목록", "totalDuration": 120, "itemCount": 4, "hasDeletedMaterial": false, "items": [
    { "id": "pi-1", "materialId": "mat-001", "materialName": "봄 시즌 광고 15초", "duration": 15, "order": 1 },
    { "id": "pi-2", "materialId": "mat-004", "materialName": "공익 광고 10초", "duration": 10, "order": 2 }
  ], "createdAt": "2026-03-01", "updatedAt": "2026-04-01" },
  { "id": "pl-002", "name": "홍대 특별 편성", "totalDuration": 45, "itemCount": 3, "hasDeletedMaterial": true, "items": [
    { "id": "pi-3", "materialId": "mat-003", "materialName": "신제품 출시 30초", "duration": 30, "order": 1, "deleted": true }
  ], "createdAt": "2026-03-15", "updatedAt": "2026-04-05" }
]
```

- [ ] **Step 4: PlaylistEditor 작성**

```tsx
// 순서 조작: 위/아래 버튼 (드래그 없음)
// 소재 교체: 클릭 → 소재 목록 Drawer
// 소재 삭제: 목록에서 제거
// deleted 소재: 경고 표시 + 교체 유도
```

- [ ] **Step 5: TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/playlist.ts src/mocks/ src/hooks/playlists/ src/components/domain/playlists/ "src/app/(dashboard)/playlists/"
git commit -m "feat(playlist): 재생목록 목록·편집 구현"
```

---

## Task 7: 배치 7 — 편성 (5화면)

**스펙:** `schedule-list.md`, `schedule-form.md`, `emergency-schedule.md`, `sync-schedule.md`, `slot-remaining.md`

**Files:**
- Create: `src/types/schedule.ts`
- Create: `src/mocks/fixtures/schedules.json`
- Create: `src/mocks/handlers/schedules.ts`
- Create: `src/hooks/schedules/useSchedules.ts`
- Create: `src/components/domain/schedules/ScheduleTable.tsx`
- Create: `src/components/domain/schedules/ScheduleForm.tsx`
- Create: `src/components/domain/schedules/ScheduleForm.module.css`
- Create: `src/components/domain/schedules/EmergencyForm.tsx`
- Create: `src/components/domain/schedules/SyncPanel.tsx`
- Create: `src/components/domain/schedules/SlotRemainingTable.tsx`
- Create: `src/app/(dashboard)/schedules/page.tsx`
- Create: `src/app/(dashboard)/schedules/new/page.tsx`
- Create: `src/app/(dashboard)/schedules/[id]/edit/page.tsx`
- Create: `src/app/(dashboard)/schedules/emergency/page.tsx`
- Create: `src/app/(dashboard)/schedules/sync/page.tsx`
- Create: `src/app/(dashboard)/schedules/slot-remaining/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/schedule-list.md
cat docs/design/screen-specs/schedule-form.md
cat docs/design/screen-specs/emergency-schedule.md
cat docs/design/screen-specs/sync-schedule.md
cat docs/design/screen-specs/slot-remaining.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/schedule.ts
export type ScheduleStatus   = 'active' | 'pending' | 'done'
export type SchedulePriority = 'prio-1' | 'prio-2' | 'prio-3'

export interface Schedule {
  id: string
  name: string
  mediaId: string
  mediaName: string
  playlistId: string
  playlistName: string
  status: ScheduleStatus
  priority: SchedulePriority
  startDate: string
  endDate: string
  startTime: string
  endTime: string
  createdAt: string
}

export interface SlotItem {
  mediaId: string
  mediaName: string
  date: string
  totalSlots: number
  usedSlots: number
  publicSlots: number
  remainingSlots: number
}

export interface SyncConfig {
  mediaId: string
  mediaName: string
  syncMode: 'auto' | 'manual'
  syncInterval: number
  lastSyncAt: string
  status: 'synced' | 'delayed' | 'error'
}
```

- [ ] **Step 3: MSW fixture + handler 작성**

schedules.json — 5개, 모든 status + priority 커버.

```ts
// src/mocks/handlers/schedules.ts 핵심 엔드포인트
// GET  /api/schedules
// POST /api/schedules
// GET|PUT /api/schedules/:id
// GET  /api/schedules/slot-remaining
// POST /api/emergency
// GET|POST /api/sync
```

- [ ] **Step 4: 5개 페이지 작성**

각 스펙 기준:
- schedule-list: 컬럼 (편성명/상태/우선순위/매체/기간/재생목록/등록일), 필터
- schedule-form (신규+수정): DateRangePicker + 시간 입력 + 매체/재생목록 select
- emergency-schedule: 긴급 편성 폼 (스펙 필드 기준)
- sync-schedule: 매체별 싱크 설정 패널
- slot-remaining: 요약 스탯 4개 + 필터 + 테이블 (범례 포함)

- [ ] **Step 5: TypeScript 확인 + 커밋**

```bash
npx tsc --noEmit
git add src/types/schedule.ts src/mocks/ src/hooks/schedules/ src/components/domain/schedules/ "src/app/(dashboard)/schedules/"
git commit -m "feat(schedule): 편성표·긴급편성·싱크·잔여구좌 구현"
```

---

## Task 8: 배치 8 — 리포트·연동 (4화면)

**스펙:** `report-list.md`, `report-create.md`, `foot-traffic.md`, `ssp-integration.md`

**Files:**
- Create: `src/types/report.ts`
- Create: `src/mocks/fixtures/reports.json`
- Create: `src/mocks/fixtures/foot-traffic.json`
- Create: `src/mocks/fixtures/ssp.json`
- Create: `src/mocks/handlers/reports.ts`
- Create: `src/hooks/reports/useReports.ts`
- Create: `src/components/domain/reports/ReportTable.tsx`
- Create: `src/components/domain/reports/ReportForm.tsx`
- Create: `src/components/domain/reports/ReportForm.module.css`
- Create: `src/app/(dashboard)/reports/page.tsx`
- Create: `src/app/(dashboard)/reports/new/page.tsx`
- Create: `src/app/(dashboard)/reports/foot-traffic/page.tsx`
- Create: `src/app/(dashboard)/reports/ssp-integration/page.tsx`
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 스펙 파일 읽기**

```bash
cat docs/design/screen-specs/report-list.md
cat docs/design/screen-specs/report-create.md
cat docs/design/screen-specs/foot-traffic.md
cat docs/design/screen-specs/ssp-integration.md
```

- [ ] **Step 2: 타입 정의**

```ts
// src/types/report.ts
export type ReportStatus = 'generating' | 'done' | 'fail'
export type ReportType   = 'impression' | 'play' | 'health'  // 스펙 확인 후 최종 확정

export interface Report {
  id: string
  name: string
  type: ReportType
  status: ReportStatus
  period: { start: string; end: string }
  mediaIds: string[]
  createdBy: string
  createdAt: string
  downloadUrl?: string
}

export interface FootTrafficDataPoint {
  timestamp: string
  count: number
  location: string
}

export interface SspChannel {
  id: string
  name: string
  provider: string
  apiEndpoint: string
  status: 'connected' | 'disconnected' | 'error'
  lastSyncAt: string
  impressions: number
  clicks: number
}
```

- [ ] **Step 3: MSW fixture 작성**

```json
// src/mocks/fixtures/reports.json — 4개, status 커버
[
  { "id": "r-001", "name": "4월 노출 리포트", "type": "impression", "status": "done", "period": { "start": "2026-04-01", "end": "2026-04-14" }, "mediaIds": ["m-001", "m-002"], "createdBy": "김관리", "createdAt": "2026-04-14", "downloadUrl": "/reports/r-001.xlsx" },
  { "id": "r-002", "name": "주간 재생 리포트", "type": "play", "status": "generating", "period": { "start": "2026-04-07", "end": "2026-04-13" }, "mediaIds": [], "createdBy": "이매체", "createdAt": "2026-04-14" },
  { "id": "r-003", "name": "헬스체크 월간", "type": "health", "status": "fail", "period": { "start": "2026-03-01", "end": "2026-03-31" }, "mediaIds": [], "createdBy": "김관리", "createdAt": "2026-04-01" }
]
```

```json
// src/mocks/fixtures/foot-traffic.json
{
  "sources": [
    { "id": "ft-001", "name": "강남역 유동인구", "provider": "KT", "apiEndpoint": "https://api.kt.com/foot-traffic", "status": "connected", "lastSyncAt": "2026-04-14T10:00:00" }
  ],
  "chartData": [
    { "hour": "06:00", "weekday": 1200, "weekend": 450 },
    { "hour": "07:00", "weekday": 3400, "weekend": 680 },
    { "hour": "08:00", "weekday": 5600, "weekend": 820 },
    { "hour": "09:00", "weekday": 4200, "weekend": 1100 },
    { "hour": "12:00", "weekday": 3800, "weekend": 2400 },
    { "hour": "18:00", "weekday": 5200, "weekend": 3100 },
    { "hour": "20:00", "weekday": 2800, "weekend": 3800 },
    { "hour": "22:00", "weekday": 1500, "weekend": 2200 }
  ]
}
```

```json
// src/mocks/fixtures/ssp.json
{
  "channels": [
    { "id": "ssp-001", "name": "카카오 SSP", "provider": "kakao", "apiEndpoint": "https://ssp.kakao.com/api", "status": "connected", "lastSyncAt": "2026-04-14T09:00:00", "impressions": 124000, "clicks": 3200 },
    { "id": "ssp-002", "name": "네이버 SSP", "provider": "naver", "apiEndpoint": "https://ssp.naver.com/api", "status": "disconnected", "lastSyncAt": "2026-04-10T12:00:00", "impressions": 0, "clicks": 0 }
  ],
  "chartData": [
    { "date": "04-08", "impressions": 18400, "clicks": 520 },
    { "date": "04-09", "impressions": 21000, "clicks": 610 },
    { "date": "04-10", "impressions": 19800, "clicks": 480 },
    { "date": "04-11", "impressions": 22400, "clicks": 590 },
    { "date": "04-12", "impressions": 24100, "clicks": 640 },
    { "date": "04-13", "impressions": 23600, "clicks": 620 },
    { "date": "04-14", "impressions": 20800, "clicks": 550 }
  ]
}
```

- [ ] **Step 4: MSW handler 작성**

```ts
// src/mocks/handlers/reports.ts
import { http, HttpResponse } from 'msw'
import reportsFixture from '../fixtures/reports.json'
import ftFixture from '../fixtures/foot-traffic.json'
import sspFixture from '../fixtures/ssp.json'
import type { Report } from '@/types/report'

let reports: Report[] = [...reportsFixture] as Report[]

export const reportHandlers = [
  http.get('/api/reports', () => HttpResponse.json(reports)),
  http.post('/api/reports', async ({ request }) => {
    const body = await request.json() as Partial<Report>
    const newReport: Report = {
      id: `r-${Date.now()}`, status: 'generating',
      createdAt: new Date().toISOString().split('T')[0],
      ...body,
    } as Report
    reports.push(newReport)
    return HttpResponse.json(newReport, { status: 201 })
  }),
  http.get('/api/foot-traffic', () => HttpResponse.json(ftFixture)),
  http.put('/api/foot-traffic/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body })
  }),
  http.get('/api/ssp', () => HttpResponse.json(sspFixture)),
  http.post('/api/ssp', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: `ssp-${Date.now()}`, status: 'disconnected', ...body })
  }),
]
```

- [ ] **Step 5: 4개 페이지 작성**

각 스펙 기준:
- report-list: 테이블 (이름/유형/상태/기간/매체수/생성자/생성일), 다운로드 버튼
- report-create: 정기 발송 토글 + 조건부 필드 (schedule-form의 collapsible 패턴 동일)
- foot-traffic: `ChartLine` 사용 (시간대별 평일/주말 비교), 데이터 소스 카드 목록
- ssp-integration: `ChartBar` 사용 (날짜별 노출/클릭), SSP 채널 카드 목록 (API Key 마스킹)

- [ ] **Step 6: 최종 TypeScript 확인 + Sidebar 링크 점검**

```bash
npx tsc --noEmit
```

Sidebar.tsx에서 현재 emoji placeholder 아이콘 사용 중 — 구현된 모든 라우트가 LNB에 올바르게 연결됐는지 확인. IA 기준으로 depth 점검.

- [ ] **Step 7: 최종 커밋**

```bash
git add src/types/report.ts src/mocks/ src/hooks/reports/ src/components/domain/reports/ "src/app/(dashboard)/reports/"
git commit -m "feat(report): 리포트·유동인구·SSP 연동 구현"
```

---

## 전체 완료 기준

모든 배치 완료 후:

- [ ] `npx tsc --noEmit` — 오류 없음
- [ ] 각 라우트 HTTP 200 응답 확인
- [ ] Sidebar의 LNB 링크가 IA 기준 depth와 일치
- [ ] 각 도메인 스펙의 컬럼 수 · 필터 종류 · 배지 값과 구현 화면 일치
- [ ] `git log --oneline` — 배치별 커밋 8개 이상
