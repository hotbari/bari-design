# All Screens Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use subagent-driven-development to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Implement all 33 screens from `2026-04-08-prototype/` into `2026-04-15-html-verify` Next.js project.

**Architecture:** AppShell (Sidebar + TopBar) lives in `(dashboard)/layout.tsx` and wraps every dashboard page. `(auth)` route group has no AppShell. Each domain gets its own types file, MSW fixture, and MSW handler.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, TanStack Query v5, MSW v2, CSS Modules

**Spec files:** `docs/design/screen-specs/{name}.md` — read alongside HTML prototype. HTML wins on conflict.

**Project root:** `D:/2026_cluade_build/bari-design/2026-04-15-html-verify`

---

## File Map

```
src/
  app/
    globals.css                          [modify Task 1]
    (auth)/
      layout.tsx                         [create Task 3]
      login/page.tsx + page.module.css   [create Task 3]
      signup/complete/page.tsx + css     [create Task 4]
    (dashboard)/
      layout.tsx                         [modify Task 2]
      page.tsx                           [create Task 5, DELETE src/app/page.tsx]
      settings/
        users/page.tsx                   [create Task 6]
        users/invite/page.tsx            [create Task 7]
        profile/page.tsx                 [create Task 26]
        system/page.tsx                  [create Task 26]
        notifications/page.tsx           [create Task 26]
      media/
        companies/page.tsx               [create Task 8]
        page.tsx                         [create Task 9]
        new/page.tsx                     [create Task 10]
        [id]/edit/page.tsx               [create Task 10]
        [id]/page.tsx                    [create Task 11]
        groups/page.tsx                  [create Task 12]
        ssp/page.tsx                     [create Task 12]
        foot-traffic/page.tsx            [create Task 12]
      materials/
        page.tsx                         [create Task 13]
        spec-guide/page.tsx              [create Task 14]
        [id]/page.tsx                    [already done]
      campaigns/
        page.tsx                         [create Task 16]
        new/page.tsx                     [create Task 17]
        [id]/edit/page.tsx               [create Task 17]
        [id]/page.tsx                    [create Task 18]
      playlists/
        page.tsx                         [create Task 19]
        [id]/edit/page.tsx               [create Task 19]
      schedules/
        page.tsx                         [create Task 21]
        new/page.tsx                     [create Task 22]
        [id]/edit/page.tsx               [create Task 22]
        emergency/page.tsx               [create Task 23]
        sync/page.tsx                    [create Task 23]
        slot-remaining/page.tsx          [create Task 23]
      reports/
        page.tsx                         [create Task 24]
        new/page.tsx                     [create Task 24]
      notifications/
        page.tsx                         [create Task 25]
  components/
    layout/
      AppShell.tsx + .module.css         [create Task 2]
      Sidebar.tsx + .module.css          [create Task 2]
      TopBar.tsx + .module.css           [create Task 2]
    media/
      MediaForm.tsx + .module.css        [create Task 10]
    campaigns/
      CampaignForm.tsx + .module.css     [create Task 17]
    schedules/
      ScheduleForm.tsx + .module.css     [create Task 22]
  hooks/
    useRole.ts                           [create Task 2]
  types/
    material.ts                          [exists]
    dashboard.ts                         [create Task 5]
    user.ts                              [create Task 6]
    media-company.ts                     [create Task 8]
    media.ts                             [create Task 9]
    campaign.ts                          [create Task 15]
    playlist.ts                          [create Task 19]
    schedule.ts                          [create Task 20]
    report.ts                            [create Task 24]
    notification.ts                      [create Task 25]
  mocks/
    browser.ts                           [modify Task 27]
    handlers/
      materials.ts                       [exists]
      dashboard.ts                       [create Task 5]
      users.ts                           [create Task 6]
      media-companies.ts                 [create Task 8]
      media.ts                           [create Task 9]
      media-sub.ts                       [create Task 12]
      campaigns.ts                       [create Task 15]
      playlists.ts                       [create Task 19]
      schedules.ts                       [create Task 20]
      reports.ts                         [create Task 24]
      notifications.ts                   [create Task 25]
    fixtures/
      materials.json                     [create Task 13]
      dashboard.json                     [create Task 5]
      users.json                         [create Task 6]
      media-companies.json               [create Task 8]
      media.json                         [create Task 9]
      ssp.json                           [create Task 12]
      foot-traffic.json                  [create Task 12]
      campaigns.json                     [create Task 15]
      playlists.json                     [create Task 19]
      schedules.json                     [create Task 20]
      reports.json                       [create Task 24]
      notifications.json                 [create Task 25]
```

---

## Task 1: globals.css 토큰 보완

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: 누락 토큰 추가**

`src/app/globals.css`의 `:root` 블록에 추가 (primary-700 바로 아래):

```css
  /* Primary extended */
  --color-primary-900: oklch(0.30 0.07 155);
  --color-primary-800: oklch(0.38 0.09 155);
  --color-primary-400: oklch(0.82 0.14 155);
  --color-primary-300: oklch(0.88 0.10 155);

  /* Typography extended */
  --text-lg:  18px;
  --text-xl:  20px;
  --text-2xl: 24px;

  /* Semantic */
  --color-border-default: rgba(0,0,0,0.06);
  --shadow-md: 0 4px 12px rgba(0,0,0,0.08);
```

그리고 `.btn-danger` 아래에 추가:

```css
.btn-primary {
  background: var(--color-primary-500);
  color: white;
}
.btn-primary:hover { background: var(--color-primary-600); }
```

- [ ] **Step 2: 커밋**

```bash
git add src/app/globals.css
git commit -m "feat: globals.css 누락 토큰 보완 (primary-900/800/400/300, text-lg/xl/2xl, btn-primary)"
```

---

## Task 2: AppShell (Sidebar + TopBar + layout 연결)

**Files:**
- Create: `src/hooks/useRole.ts`
- Create: `src/components/layout/Sidebar.tsx`
- Create: `src/components/layout/Sidebar.module.css`
- Create: `src/components/layout/TopBar.tsx`
- Create: `src/components/layout/TopBar.module.css`
- Create: `src/components/layout/AppShell.tsx`
- Create: `src/components/layout/AppShell.module.css`
- Modify: `src/app/(dashboard)/layout.tsx`
- Modify: `src/app/(dashboard)/materials/[id]/page.module.css`

- [ ] **Step 1: useRole hook 작성**

`src/hooks/useRole.ts`:

```typescript
'use client'
import { useState, useEffect } from 'react'

export type Role = 'admin' | 'media' | 'ops' | 'sales'
const KEY = 'dooh-role'

export function useRole(): [Role, (r: Role) => void] {
  const [role, setRoleState] = useState<Role>('admin')

  useEffect(() => {
    const stored = localStorage.getItem(KEY) as Role | null
    if (stored) setRoleState(stored)
  }, [])

  function setRole(r: Role) {
    localStorage.setItem(KEY, r)
    setRoleState(r)
  }

  return [role, setRole]
}
```

- [ ] **Step 2: Sidebar 작성**

`src/components/layout/Sidebar.tsx`:

```typescript
'use client'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useRole, type Role } from '@/hooks/useRole'
import styles from './Sidebar.module.css'

interface MenuItem {
  id: string
  label: string
  href: string
  roles: Role[]
}

const MENU_ITEMS: MenuItem[] = [
  { id: 'dashboard',        label: '대시보드',   href: '/',                       roles: ['admin','media','ops'] },
  { id: 'media-companies',  label: '매체사 관리', href: '/media/companies',        roles: ['admin'] },
  { id: 'media',            label: '매체 관리',  href: '/media',                  roles: ['admin','media','ops'] },
  { id: 'materials',        label: '소재 관리',  href: '/materials',              roles: ['admin','media','ops','sales'] },
  { id: 'campaigns',        label: '캠페인 관리', href: '/campaigns',              roles: ['admin','media','ops'] },
  { id: 'schedules',        label: '편성 관리',  href: '/schedules',              roles: ['admin','media','ops'] },
  { id: 'notifications',    label: '알림 센터',  href: '/notifications',          roles: ['admin','media','ops','sales'] },
  { id: 'users',            label: '사용자 관리', href: '/settings/users',         roles: ['admin','media'] },
  { id: 'reports',          label: '리포트',     href: '/reports',                roles: ['admin','media','ops'] },
  { id: 'notif-settings',   label: '알림 설정',  href: '/settings/notifications', roles: ['admin','media','ops','sales'] },
]

export function Sidebar() {
  const [role] = useRole()
  const pathname = usePathname()
  const visible = MENU_ITEMS.filter(item => item.roles.includes(role))

  return (
    <aside className={styles.sidebar}>
      <div className={styles.menuLabel}>메뉴</div>
      <nav>
        {visible.map(item => {
          const isActive = item.href === '/'
            ? pathname === '/'
            : pathname.startsWith(item.href)
          return (
            <Link
              key={item.id}
              href={item.href}
              className={`${styles.item} ${isActive ? styles.active : ''}`}
            >
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
```

`src/components/layout/Sidebar.module.css`:

```css
.sidebar {
  width: 200px;
  min-width: 200px;
  background: var(--color-primary-900);
  height: 100%;
  padding: 12px 8px;
  overflow-y: auto;
  flex-shrink: 0;
}
.menuLabel {
  padding: 0 10px 8px;
  font-size: 10px;
  color: rgba(255,255,255,0.4);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 10px;
  border-radius: var(--radius-md);
  font-size: 12px;
  color: rgba(255,255,255,0.7);
  text-decoration: none;
  margin-bottom: 1px;
  transition: background 0.1s;
}
.item:hover { background: var(--color-primary-800); color: white; }
.active { color: #03C75A !important; background: rgba(3,199,90,0.1); }
```

- [ ] **Step 3: TopBar 작성**

`src/components/layout/TopBar.tsx`:

```typescript
'use client'
import Link from 'next/link'
import { useRole, type Role } from '@/hooks/useRole'
import styles from './TopBar.module.css'

const ROLE_LABELS: Record<Role, string> = {
  admin: '어드민',
  media: '매체사',
  ops: '운영대행사',
  sales: '영업대행사',
}

export function TopBar() {
  const [role, setRole] = useRole()

  return (
    <header className={styles.topbar}>
      <div className={styles.left}>
        <Link href="/" className={styles.logo}>DOOH CMS</Link>
        <span className={styles.sub}>Digital Out-of-Home</span>
      </div>
      <div className={styles.right}>
        <select
          className={styles.roleSwitcher}
          value={role}
          onChange={e => setRole(e.target.value as Role)}
          aria-label="역할 전환"
        >
          {(Object.entries(ROLE_LABELS) as [Role, string][]).map(([k, v]) => (
            <option key={k} value={k}>{v}</option>
          ))}
        </select>
        <Link href="/notifications" className={styles.bell} aria-label="알림">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>
        </Link>
        <div className={styles.avatar} aria-label="내 계정">관</div>
      </div>
    </header>
  )
}
```

`src/components/layout/TopBar.module.css`:

```css
.topbar {
  height: 56px;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid var(--color-border-default);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 24px;
}
.left { display: flex; align-items: center; gap: 10px; }
.logo { font-size: 16px; font-weight: 700; color: var(--color-neutral-900); }
.sub { font-size: 11px; color: var(--color-neutral-400); }
.right { display: flex; align-items: center; gap: 16px; }
.roleSwitcher {
  font-size: 12px; font-weight: 500;
  padding: 4px 10px; border-radius: 20px;
  border: 1px solid rgba(0,0,0,0.12); cursor: pointer;
  background: white; color: var(--color-neutral-700);
}
.bell { color: var(--color-neutral-500); display: flex; position: relative; }
.avatar {
  width: 32px; height: 32px;
  background: var(--color-neutral-900); border-radius: 50%;
  display: flex; align-items: center; justify-content: center;
  font-size: 12px; font-weight: 600; color: white; cursor: pointer;
}
```

- [ ] **Step 4: AppShell 작성**

`src/components/layout/AppShell.tsx`:

```typescript
import { Sidebar } from './Sidebar'
import { TopBar } from './TopBar'
import styles from './AppShell.module.css'

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className={styles.shell}>
      <Sidebar />
      <div className={styles.main}>
        <TopBar />
        <div className={styles.content}>{children}</div>
      </div>
    </div>
  )
}
```

`src/components/layout/AppShell.module.css`:

```css
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
}
.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
}
.content {
  flex: 1;
  overflow-y: auto;
}
```

- [ ] **Step 5: (dashboard)/layout.tsx 업데이트**

```typescript
import { AppShell } from '@/components/layout/AppShell'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>
}
```

- [ ] **Step 6: material-detail page.module.css 수정**

`src/app/(dashboard)/materials/[id]/page.module.css`:
`.page { min-height: 100vh }` → `.page { min-height: 100% }`

- [ ] **Step 7: 브라우저에서 확인**

`http://localhost:3000/materials/mat-001` 접속 → AppShell 사이드바와 TopBar가 보이고, material-detail 콘텐츠가 스크롤 영역에 정상 표시되는지 확인.

- [ ] **Step 8: 커밋**

```bash
git add src/hooks/useRole.ts src/components/layout/ src/app/(dashboard)/layout.tsx src/app/(dashboard)/materials/[id]/page.module.css
git commit -m "feat: AppShell 구현 (Sidebar + TopBar) + (dashboard) layout 연결"
```

---

## Task 3: (auth) layout + 로그인 페이지

**Files:**
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/login/page.module.css`

**Spec:** `docs/design/screen-specs/login.md` + `2026-04-08-prototype/login.html`

- [ ] **Step 1: (auth) layout 작성**

`src/app/(auth)/layout.tsx`:

```typescript
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-neutral-50)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 2: Login page 작성**

Read `2026-04-08-prototype/login.html` and `docs/design/screen-specs/login.md` for exact field/layout details, then implement `src/app/(auth)/login/page.tsx` + `page.module.css`.

Key requirements from spec:
- Card: max-width 400px, padding 40px, white bg, border-radius var(--radius-xl), shadow-md
- Brand: "Bari CMS" (font-size 24px, font-weight 700) at top of card
- Fields: email (type=email, autocomplete=email), password (type=password + eye toggle button), remember checkbox "로그인 상태 유지"
- Submit: `.btn .btn-primary` full-width "로그인"
- Error state: red inline message below password field
- Skip link: `<a href="#main" className={styles.skipLink}>본문으로 건너뛰기</a>` (visible on focus only)
- Invite token: if `?token=` in URL, show invite info block above form

- [ ] **Step 3: 브라우저 확인**

`http://localhost:3000/login` → 카드 중앙 정렬, 필드, 버튼 확인.

- [ ] **Step 4: 커밋**

```bash
git add src/app/(auth)/
git commit -m "feat(auth): (auth) layout + 로그인 페이지 구현"
```

---

## Task 4: 회원가입 완료 페이지

**Files:**
- Create: `src/app/(auth)/signup/complete/page.tsx`
- Create: `src/app/(auth)/signup/complete/page.module.css`

**Spec:** `docs/design/screen-specs/signup-complete.md` + `2026-04-08-prototype/signup-complete.html` (or `user-invite.html`)

- [ ] **Step 1: 구현**

Read `docs/design/screen-specs/signup-complete.md` and source HTML for exact UI. Implement page within (auth) layout (no AppShell, centered card).

- [ ] **Step 2: 커밋**

```bash
git add src/app/(auth)/signup/
git commit -m "feat(auth): 회원가입 완료 페이지 구현"
```

---

## Task 5: 대시보드 + 루트 page.tsx 삭제

**Files:**
- Delete: `src/app/page.tsx`
- Create: `src/types/dashboard.ts`
- Create: `src/mocks/fixtures/dashboard.json`
- Create: `src/mocks/handlers/dashboard.ts`
- Create: `src/app/(dashboard)/page.tsx`

**Specs:** `docs/design/screen-specs/dashboard-admin.md`, `dashboard-media-company.md`, `dashboard-ops-agency.md`

- [ ] **Step 1: src/app/page.tsx 삭제**

```bash
rm src/app/page.tsx
```

- [ ] **Step 2: dashboard types 작성**

`src/types/dashboard.ts`:

```typescript
export interface StatItem { label: string; value: number; unit?: string }
export interface MediaStatusChip { status: 'online'|'delayed'|'error'|'offline'|'inactive'; count: number }
export interface CampaignStatusChip { status: 'active'|'draft'|'ended'; count: number }
export interface HealthCheckItem { name: string; status: 'error'|'delayed'|'offline'; detail: string }
export interface SystemStatus { label: string; status: 'sys-ok'|'sys-warn'|'sys-err'; detail: string }
export interface NotifItem { id: string; text: string; time: string; read: boolean }
export interface AdminDashboard {
  stats: StatItem[]
  mediaChips: MediaStatusChip[]
  campaignChips: CampaignStatusChip[]
  healthIssues: HealthCheckItem[]
  system: SystemStatus[]
  notifications: NotifItem[]
  alertBanner?: { message: string; links: { label: string; href: string }[] }
}
```

- [ ] **Step 3: fixture + handler 작성**

`src/mocks/fixtures/dashboard.json` — admin, media, ops variant 데이터 포함.

`src/mocks/handlers/dashboard.ts`:

```typescript
import { http, HttpResponse } from 'msw'
import data from '../fixtures/dashboard.json'

export const dashboardHandlers = [
  http.get('/api/dashboard', ({ request }) => {
    const role = new URL(request.url).searchParams.get('role') || 'admin'
    return HttpResponse.json(data[role as keyof typeof data] ?? data.admin)
  }),
]
```

- [ ] **Step 4: 대시보드 page 작성**

`src/app/(dashboard)/page.tsx`:

Read `docs/design/screen-specs/dashboard-admin.md`, `dashboard-media-company.md`, `dashboard-ops-agency.md` and implement role-aware dashboard. Use `useRole()` to get role, pass to query. Render role-specific component.

- [ ] **Step 5: 커밋**

```bash
git add src/types/dashboard.ts src/mocks/fixtures/dashboard.json src/mocks/handlers/dashboard.ts src/app/(dashboard)/page.tsx
git commit -m "feat(dashboard): 역할별 대시보드 3종 구현"
```

---

## Task 6: 사용자 목록

**Files:**
- Create: `src/types/user.ts`
- Create: `src/mocks/fixtures/users.json`
- Create: `src/mocks/handlers/users.ts`
- Create: `src/app/(dashboard)/settings/users/page.tsx`
- Create: `src/app/(dashboard)/settings/users/page.module.css`

**Spec:** `docs/design/screen-specs/user-list.md`

- [ ] **Step 1: user types**

`src/types/user.ts`:

```typescript
export type UserRole = 'admin' | 'media' | 'ops' | 'sales'
export type UserStatus = 'active' | 'inactive' | 'invited' | 'expired'

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  status: UserStatus
  scope: string
  invitedAt?: string
}
```

- [ ] **Step 2: fixture (3건 이상)**

`src/mocks/fixtures/users.json` — admin/active, media/active, ops/invited 등 다양한 상태 포함.

- [ ] **Step 3: MSW handler**

```typescript
import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(users)),
]
```

- [ ] **Step 4: page 구현**

Read spec for exact columns (5개) + filters (역할 select, 검색) + 탭 (all/active/invited) + badges (role, status). 비활성화 모달 포함.

CSS 클래스: `.role-admin`, `.role-media`, `.role-ops`, `.role-sales`, `.status-active`, `.status-inactive`, `.status-invited`, `.status-expired`, `.avatar-admin`, etc.

- [ ] **Step 5: 커밋**

```bash
git add src/types/user.ts src/mocks/fixtures/users.json src/mocks/handlers/users.ts src/app/(dashboard)/settings/users/
git commit -m "feat(user): 사용자 목록 페이지 구현"
```

---

## Task 7: 사용자 초대

**Files:**
- Create: `src/app/(dashboard)/settings/users/invite/page.tsx`
- Create: `src/app/(dashboard)/settings/users/invite/page.module.css`

**Spec:** `docs/design/screen-specs/user-invite.md`

- [ ] **Step 1: 구현**

Read spec + HTML for exact form fields. Implement invite form (email, role select, scope, 초대 메시지 textarea). Submit calls `POST /api/users/invite`.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/settings/users/invite/
git commit -m "feat(user): 사용자 초대 페이지 구현"
```

---

## Task 8: 매체사 관리

**Files:**
- Create: `src/types/media-company.ts`
- Create: `src/mocks/fixtures/media-companies.json`
- Create: `src/mocks/handlers/media-companies.ts`
- Create: `src/app/(dashboard)/media/companies/page.tsx`
- Create: `src/app/(dashboard)/media/companies/page.module.css`

**Spec:** `docs/design/screen-specs/media-company-mgmt.md`

- [ ] **Step 1: 구현**

Read spec for columns + filters + badge types. Create types, fixture (3건), handler, page.

- [ ] **Step 2: 커밋**

```bash
git add src/types/media-company.ts src/mocks/fixtures/media-companies.json src/mocks/handlers/media-companies.ts src/app/(dashboard)/media/companies/
git commit -m "feat(media): 매체사 관리 페이지 구현"
```

---

## Task 9: 매체 목록

**Files:**
- Create: `src/types/media.ts`
- Create: `src/mocks/fixtures/media.json`
- Create: `src/mocks/handlers/media.ts`
- Create: `src/app/(dashboard)/media/page.tsx`
- Create: `src/app/(dashboard)/media/page.module.css`

**Spec:** `docs/design/screen-specs/media-list.md`

- [ ] **Step 1: media types**

`src/types/media.ts`:

```typescript
export type MediaStatus = 'online' | 'delayed' | 'error' | 'offline' | 'inactive' | 'unlinked'
export type MediaSync = 'synced' | 'delayed' | 'error' | 'pending'
export type MediaType = '고정형' | '이동형'

export interface Media {
  id: string
  name: string
  address: string
  company: string
  type: MediaType
  resolution: string
  status: MediaStatus
  sync: MediaSync
  operatingHours: string
  registeredAt: string
}
```

- [ ] **Step 2: fixture (5건 이상, 다양한 상태)**

- [ ] **Step 3: MSW handler**

```typescript
import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(media)),
  http.get('/api/media/:id', ({ params }) =>
    HttpResponse.json(media.find((m: any) => m.id === params.id) ?? null)
  ),
]
```

- [ ] **Step 4: page 구현**

8컬럼 테이블, 4개 필터 (매체사/상태/유형/검색), 카운터, 페이지네이션, 행 클릭 → `/media/{id}`.

CSS: `.status-dot.online`, `.status-dot.delayed`, `.status-dot.error`, `.status-dot.offline`, `.status-dot.inactive`, `.status-dot.unlinked`, `.sync-badge.synced`, etc.

- [ ] **Step 5: 커밋**

```bash
git add src/types/media.ts src/mocks/fixtures/media.json src/mocks/handlers/media.ts src/app/(dashboard)/media/page.tsx src/app/(dashboard)/media/page.module.css
git commit -m "feat(media): 매체 목록 페이지 구현"
```

---

## Task 10: 매체 등록/수정 폼

**Files:**
- Create: `src/components/media/MediaForm.tsx`
- Create: `src/components/media/MediaForm.module.css`
- Create: `src/app/(dashboard)/media/new/page.tsx`
- Create: `src/app/(dashboard)/media/[id]/edit/page.tsx`

**Spec:** `docs/design/screen-specs/media-form.md`

- [ ] **Step 1: 구현**

Read spec for form sections + fields. MediaForm component accepts `defaultValues?` prop. new/page.tsx renders `<MediaForm />`, edit/page.tsx fetches data then renders `<MediaForm defaultValues={data} />`.

- [ ] **Step 2: 커밋**

```bash
git add src/components/media/ src/app/(dashboard)/media/new/ src/app/(dashboard)/media/\[id\]/edit/
git commit -m "feat(media): 매체 등록/수정 폼 구현"
```

---

## Task 11: 매체 상세

**Files:**
- Create: `src/app/(dashboard)/media/[id]/page.tsx`
- Create: `src/app/(dashboard)/media/[id]/page.module.css`

**Spec:** `docs/design/screen-specs/media-detail.md`

- [ ] **Step 1: 구현**

Read spec for info grid + sections. `useQuery` fetches `/api/media/{id}`.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/media/\[id\]/page.tsx src/app/(dashboard)/media/\[id\]/page.module.css
git commit -m "feat(media): 매체 상세 페이지 구현"
```

---

## Task 12: 매체 서브페이지 (그룹 + SSP + 유동인구)

**Files:**
- Create: `src/mocks/fixtures/ssp.json`
- Create: `src/mocks/fixtures/foot-traffic.json`
- Create: `src/mocks/handlers/media-sub.ts`
- Create: `src/app/(dashboard)/media/groups/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/media/ssp/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/media/foot-traffic/page.tsx` + `page.module.css`

**Specs:** `media-group.md`, `ssp-integration.md`, `foot-traffic.md`

- [ ] **Step 1: 구현**

각 spec 파일 읽어 구현. 3개 페이지 각각 독립 구현.

MSW handler:
```typescript
export const mediaSubHandlers = [
  http.get('/api/media/groups', () => HttpResponse.json(groups)),
  http.get('/api/media/ssp', () => HttpResponse.json(ssp)),
  http.get('/api/media/foot-traffic', () => HttpResponse.json(footTraffic)),
]
```

- [ ] **Step 2: 커밋**

```bash
git add src/mocks/fixtures/ssp.json src/mocks/fixtures/foot-traffic.json src/mocks/handlers/media-sub.ts src/app/(dashboard)/media/groups/ src/app/(dashboard)/media/ssp/ src/app/(dashboard)/media/foot-traffic/
git commit -m "feat(media): 매체 그룹·SSP 연동·유동인구 페이지 구현"
```

---

## Task 13: 소재 목록

**Files:**
- Create: `src/mocks/fixtures/materials.json`
- Create: `src/app/(dashboard)/materials/page.tsx`
- Create: `src/app/(dashboard)/materials/page.module.css`

**Spec:** `docs/design/screen-specs/material-list.md`

Note: `src/types/material.ts` already exists — do NOT modify unless a type is genuinely missing.

- [ ] **Step 1: fixture 작성**

`src/mocks/fixtures/materials.json` — 5건, 다양한 reviewStatus 포함.

Note: `src/mocks/handlers/materials.ts` already exists. Check if `GET /api/materials` list endpoint is present; if not, add it.

- [ ] **Step 2: page 구현**

Read spec for exact columns + filters + badge CSS classes. Link rows to `/materials/{id}`.

- [ ] **Step 3: 커밋**

```bash
git add src/mocks/fixtures/materials.json src/app/(dashboard)/materials/page.tsx src/app/(dashboard)/materials/page.module.css
git commit -m "feat(material): 소재 목록 페이지 구현"
```

---

## Task 14: 소재 규격 안내

**Files:**
- Create: `src/app/(dashboard)/materials/spec-guide/page.tsx`
- Create: `src/app/(dashboard)/materials/spec-guide/page.module.css`

**Spec:** `docs/design/screen-specs/material-spec-guide.md`

- [ ] **Step 1: 구현**

Read spec. Static content page (no API call needed).

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/materials/spec-guide/
git commit -m "feat(material): 소재 규격 안내 페이지 구현"
```

---

## Task 15: 캠페인 타입 + MSW

**Files:**
- Create: `src/types/campaign.ts`
- Create: `src/mocks/fixtures/campaigns.json`
- Create: `src/mocks/handlers/campaigns.ts`

**Specs:** `campaign-list.md`, `campaign-form.md`, `campaign-detail.md`

- [ ] **Step 1: types**

`src/types/campaign.ts`:

```typescript
export type CampaignStatus = 'draft' | 'running' | 'done' | 'canceled'
export type CampaignType = 'direct' | 'own' | 'filler' | 'naver'
export type PriceModel = 'CPM' | 'CPD' | 'fixed'

export interface Campaign {
  id: string
  name: string
  advertiser: string
  type: CampaignType
  status: CampaignStatus
  startDate: string
  endDate: string
  targetMedia: string
  budget: number
  priceModel: PriceModel
  registeredAt: string
}

export interface CampaignDetail extends Campaign {
  description?: string
  mediaList: string[]
  schedules: { scheduleName: string; period: string; status: string }[]
  materials: { materialName: string; reviewStatus: string }[]
}
```

- [ ] **Step 2: fixture + handler**

5건 캠페인 데이터. Handler:
```typescript
export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(campaigns)),
  http.get('/api/campaigns/:id', ({ params }) =>
    HttpResponse.json(campaigns.find((c: any) => c.id === params.id) ?? null)
  ),
  http.post('/api/campaigns', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-1', ...body }, { status: 201 })
  }),
]
```

- [ ] **Step 3: 커밋**

```bash
git add src/types/campaign.ts src/mocks/fixtures/campaigns.json src/mocks/handlers/campaigns.ts
git commit -m "feat(campaign): 캠페인 타입·MSW fixture·handler 작성"
```

---

## Task 16: 캠페인 목록

**Files:**
- Create: `src/app/(dashboard)/campaigns/page.tsx`
- Create: `src/app/(dashboard)/campaigns/page.module.css`

**Spec:** `docs/design/screen-specs/campaign-list.md`

- [ ] **Step 1: 구현**

7컬럼, 5개 필터 (상태/유형/광고주/집행기간 date-range/검색), 정렬 select, 카운터, 페이지네이션.

CSS: `.cam-draft`, `.cam-running`, `.cam-done`, `.cam-canceled`, `.type-direct`, `.type-own`, `.type-filler`, `.type-naver`.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/campaigns/page.tsx src/app/(dashboard)/campaigns/page.module.css
git commit -m "feat(campaign): 캠페인 목록 페이지 구현"
```

---

## Task 17: 캠페인 등록/수정

**Files:**
- Create: `src/components/campaigns/CampaignForm.tsx`
- Create: `src/components/campaigns/CampaignForm.module.css`
- Create: `src/app/(dashboard)/campaigns/new/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/edit/page.tsx`

**Spec:** `docs/design/screen-specs/campaign-form.md`

- [ ] **Step 1: 구현**

Read spec for form sections + fields. CampaignForm accepts `defaultValues?`.

- [ ] **Step 2: 커밋**

```bash
git add src/components/campaigns/ src/app/(dashboard)/campaigns/new/ src/app/(dashboard)/campaigns/\[id\]/edit/
git commit -m "feat(campaign): 캠페인 등록/수정 폼 구현"
```

---

## Task 18: 캠페인 상세

**Files:**
- Create: `src/app/(dashboard)/campaigns/[id]/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/page.module.css`

**Spec:** `docs/design/screen-specs/campaign-detail.md`

- [ ] **Step 1: 구현**

Read spec. Fetch `/api/campaigns/{id}`. Render info sections + sub-tables.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/campaigns/\[id\]/page.tsx src/app/(dashboard)/campaigns/\[id\]/page.module.css
git commit -m "feat(campaign): 캠페인 상세 페이지 구현"
```

---

## Task 19: 재생목록 (타입 + MSW + 목록 + 편집)

**Files:**
- Create: `src/types/playlist.ts`
- Create: `src/mocks/fixtures/playlists.json`
- Create: `src/mocks/handlers/playlists.ts`
- Create: `src/app/(dashboard)/playlists/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/playlists/[id]/edit/page.tsx` + `page.module.css`

**Specs:** `playlist-list.md`, `playlist-edit.md`

- [ ] **Step 1: types**

```typescript
export interface Playlist {
  id: string
  name: string
  mediaCount: number
  duration: number
  updatedAt: string
}
```

- [ ] **Step 2: fixture + handler + pages 구현**

Read both specs. List page + edit page (drag-and-drop slot editor 또는 ordered list editor).

- [ ] **Step 3: 커밋**

```bash
git add src/types/playlist.ts src/mocks/fixtures/playlists.json src/mocks/handlers/playlists.ts src/app/(dashboard)/playlists/
git commit -m "feat(playlist): 재생목록 목록·편집 페이지 구현"
```

---

## Task 20: 편성 타입 + MSW

**Files:**
- Create: `src/types/schedule.ts`
- Create: `src/mocks/fixtures/schedules.json`
- Create: `src/mocks/handlers/schedules.ts`

**Specs:** `schedule-list.md`, `schedule-form.md`, `emergency-schedule.md`, `sync-schedule.md`, `slot-remaining.md`

- [ ] **Step 1: types**

```typescript
export type ScheduleStatus = 'active' | 'pending' | 'done'
export type SchedulePriority = 'prio-1' | 'prio-2' | 'prio-3'
export type ScheduleSync = 'sync-ok' | 'sync-lag' | 'sync-none'

export interface Schedule {
  id: string
  name: string
  status: ScheduleStatus
  priority: SchedulePriority
  startDate: string
  endDate: string
  playlistName: string
  campaignName: string
  sync: ScheduleSync
  editingNow: boolean
}
```

- [ ] **Step 2: fixture + handler**

5건 데이터. Handler: GET /api/schedules, GET/PUT /api/schedules/:id, POST /api/schedules.

- [ ] **Step 3: 커밋**

```bash
git add src/types/schedule.ts src/mocks/fixtures/schedules.json src/mocks/handlers/schedules.ts
git commit -m "feat(schedule): 편성 타입·MSW fixture·handler 작성"
```

---

## Task 21: 편성표 목록

**Files:**
- Create: `src/app/(dashboard)/schedules/page.tsx`
- Create: `src/app/(dashboard)/schedules/page.module.css`

**Spec:** `docs/design/screen-specs/schedule-list.md`

- [ ] **Step 1: 구현**

7컬럼, 4개 필터 (상태/매체/우선순위/검색), 카운터. editing-now pulsing dot.

CSS: `.sch-active`, `.sch-pending`, `.sch-done`, `.prio-1`, `.prio-2`, `.prio-3`, `.sync-ok`, `.sync-lag`, `.sync-none`, `.editing-now`.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/schedules/page.tsx src/app/(dashboard)/schedules/page.module.css
git commit -m "feat(schedule): 편성표 목록 페이지 구현"
```

---

## Task 22: 편성표 생성/수정

**Files:**
- Create: `src/components/schedules/ScheduleForm.tsx`
- Create: `src/components/schedules/ScheduleForm.module.css`
- Create: `src/app/(dashboard)/schedules/new/page.tsx`
- Create: `src/app/(dashboard)/schedules/[id]/edit/page.tsx`

**Spec:** `docs/design/screen-specs/schedule-form.md`

- [ ] **Step 1: 구현**

Read spec for form sections. ScheduleForm accepts `defaultValues?`.

- [ ] **Step 2: 커밋**

```bash
git add src/components/schedules/ src/app/(dashboard)/schedules/new/ src/app/(dashboard)/schedules/\[id\]/edit/
git commit -m "feat(schedule): 편성표 생성/수정 폼 구현"
```

---

## Task 23: 편성 서브페이지 (긴급편성 + 싱크 + 잔여구좌)

**Files:**
- Create: `src/app/(dashboard)/schedules/emergency/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/schedules/sync/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/schedules/slot-remaining/page.tsx` + `page.module.css`

**Specs:** `emergency-schedule.md`, `sync-schedule.md`, `slot-remaining.md`

- [ ] **Step 1: 구현**

각 spec 파일 읽어 구현. MSW handler는 Task 20의 `schedules.ts`에 엔드포인트 추가.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/schedules/emergency/ src/app/(dashboard)/schedules/sync/ src/app/(dashboard)/schedules/slot-remaining/
git commit -m "feat(schedule): 긴급편성·동기화·잔여구좌 페이지 구현"
```

---

## Task 24: 리포트 (타입 + MSW + 목록 + 생성)

**Files:**
- Create: `src/types/report.ts`
- Create: `src/mocks/fixtures/reports.json`
- Create: `src/mocks/handlers/reports.ts`
- Create: `src/app/(dashboard)/reports/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/reports/new/page.tsx` + `page.module.css`

**Specs:** `report-list.md`, `report-create.md`

- [ ] **Step 1: types + fixture + handler + pages 구현**

Read both specs. Types, fixture, handler, list page, create page (form).

- [ ] **Step 2: 커밋**

```bash
git add src/types/report.ts src/mocks/fixtures/reports.json src/mocks/handlers/reports.ts src/app/(dashboard)/reports/
git commit -m "feat(report): 리포트 목록·생성 페이지 구현"
```

---

## Task 25: 알림 센터

**Files:**
- Create: `src/types/notification.ts`
- Create: `src/mocks/fixtures/notifications.json`
- Create: `src/mocks/handlers/notifications.ts`
- Create: `src/app/(dashboard)/notifications/page.tsx`
- Create: `src/app/(dashboard)/notifications/page.module.css`

**Spec:** `docs/design/screen-specs/notification-center.md`

- [ ] **Step 1: types**

```typescript
export type NotifCategory = 'all' | 'media' | 'material' | 'campaign' | 'schedule' | 'system'
export type NotifSeverity = 'info' | 'warn' | 'error'

export interface Notification {
  id: string
  category: NotifCategory
  severity: NotifSeverity
  title: string
  body: string
  time: string
  read: boolean
  link?: string
}
```

- [ ] **Step 2: fixture + handler + page 구현**

Read spec for exact layout + badge CSS classes. Category filter tabs + unread filter toggle.

- [ ] **Step 3: 커밋**

```bash
git add src/types/notification.ts src/mocks/fixtures/notifications.json src/mocks/handlers/notifications.ts src/app/(dashboard)/notifications/
git commit -m "feat(notification): 알림 센터 페이지 구현"
```

---

## Task 26: 설정 페이지 3종

**Files:**
- Create: `src/app/(dashboard)/settings/profile/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/settings/system/page.tsx` + `page.module.css`
- Create: `src/app/(dashboard)/settings/notifications/page.tsx` + `page.module.css`

**Specs:** `my-profile.md`, `system-settings.md` + notif-settings

- [ ] **Step 1: 구현**

Read each spec. Profile: 내 정보 편집 폼. System: 시스템 설정 토글/입력 폼. Notifications: 알림 수신 토글 목록.

- [ ] **Step 2: 커밋**

```bash
git add src/app/(dashboard)/settings/profile/ src/app/(dashboard)/settings/system/ src/app/(dashboard)/settings/notifications/
git commit -m "feat(settings): 내 정보·시스템 설정·알림 설정 페이지 구현"
```

---

## Task 27: MSW browser.ts 최종 통합

**Files:**
- Modify: `src/mocks/browser.ts`

- [ ] **Step 1: 모든 handler 통합**

`src/mocks/browser.ts`:

```typescript
import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'
import { dashboardHandlers } from './handlers/dashboard'
import { userHandlers } from './handlers/users'
import { mediaCompanyHandlers } from './handlers/media-companies'
import { mediaHandlers } from './handlers/media'
import { mediaSubHandlers } from './handlers/media-sub'
import { campaignHandlers } from './handlers/campaigns'
import { playlistHandlers } from './handlers/playlists'
import { scheduleHandlers } from './handlers/schedules'
import { reportHandlers } from './handlers/reports'
import { notificationHandlers } from './handlers/notifications'

export const worker = setupWorker(
  ...materialHandlers,
  ...dashboardHandlers,
  ...userHandlers,
  ...mediaCompanyHandlers,
  ...mediaHandlers,
  ...mediaSubHandlers,
  ...campaignHandlers,
  ...playlistHandlers,
  ...scheduleHandlers,
  ...reportHandlers,
  ...notificationHandlers,
)
```

- [ ] **Step 2: 전체 빌드 확인**

```bash
npm run build
```

빌드 에러 없으면 통과.

- [ ] **Step 3: 커밋**

```bash
git add src/mocks/browser.ts
git commit -m "feat: MSW browser.ts 전체 handler 통합"
```

---

## 구현 완료 기준

- [ ] `npm run build` 에러 없음
- [ ] `http://localhost:3000` → 대시보드 (역할별 3종)
- [ ] `/login` → 로그인 페이지 (AppShell 없음)
- [ ] AppShell 사이드바: 역할 switcher 변경 시 메뉴 항목 자동 필터
- [ ] `/materials/mat-001` → 기존 material-detail 정상 표시 (AppShell 안에서)
- [ ] 모든 목록 페이지: 필터 작동, 테이블 컬럼 수 spec과 일치
