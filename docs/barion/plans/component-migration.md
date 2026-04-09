# HTML 프로토타입 → React 전환 Phase 1 구현 계획

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `2026-04-09-prototype/frontend/`에 Next.js App Router + TypeScript 프로젝트를 셋업하고, MSW 더미 데이터, AppShell 레이아웃, 공통 UI 9종을 구현한다.

**Architecture:** create-next-app 스캐폴딩 → CSS 토큰 이전 → 프로바이더 컴포넌트 → MSW 픽스처/핸들러 → Toast 스토어 → 레이아웃 → 공통 UI 9종 → /dev 쇼케이스 순서로 진행. Tailwind 없이 CSS Variables + CSS Modules만 사용.

**Tech Stack:** Next.js 15 (App Router), TypeScript, @tanstack/react-query, Jotai, Zod, react-hook-form, MSW 2.x, Radix UI, CSS Modules, Jest + React Testing Library

---

## 파일 맵

```
2026-04-09-prototype/frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx                        # 루트 레이아웃 (providers + ToastContainer)
│   │   └── (dashboard)/
│   │       ├── layout.tsx                    # 대시보드 레이아웃 (AppShell)
│   │       └── dev/
│   │           └── page.tsx                  # 컴포넌트 쇼케이스
│   ├── components/
│   │   ├── ReactQueryProvider.tsx            # 'use client' QueryClient 래퍼
│   │   ├── MSWProvider.tsx                   # 'use client' MSW 초기화
│   │   ├── layout/
│   │   │   ├── AppShell.tsx                  # 서버 컴포넌트 — flex 래퍼
│   │   │   ├── AppShell.module.css
│   │   │   ├── Sidebar.tsx                   # 'use client' — usePathname 사용
│   │   │   ├── Sidebar.module.css
│   │   │   ├── TopBar.tsx                    # 서버 컴포넌트
│   │   │   └── TopBar.module.css
│   │   └── ui/
│   │       ├── Button.tsx
│   │       ├── Button.module.css
│   │       ├── Badge.tsx
│   │       ├── Badge.module.css
│   │       ├── Card.tsx
│   │       ├── Card.module.css
│   │       ├── Modal.tsx                     # Radix Dialog 래퍼
│   │       ├── Modal.module.css
│   │       ├── Toast.tsx                     # 개별 토스트 아이템
│   │       ├── Toast.module.css
│   │       ├── ToastContainer.tsx            # 'use client' Portal 렌더러
│   │       ├── Toggle.tsx
│   │       ├── Toggle.module.css
│   │       ├── Table.tsx
│   │       ├── Table.module.css
│   │       ├── FilterBar.tsx
│   │       ├── FilterBar.module.css
│   │       ├── Pagination.tsx
│   │       └── Pagination.module.css
│   ├── stores/
│   │   └── toast.ts                          # toastsAtom + useToast 훅
│   ├── mocks/
│   │   ├── browser.ts                        # setupWorker (전체 핸들러 조합)
│   │   ├── handlers/
│   │   │   ├── playlists.ts
│   │   │   ├── schedules.ts
│   │   │   ├── media.ts
│   │   │   ├── campaigns.ts
│   │   │   └── users.ts
│   │   └── fixtures/
│   │       ├── playlists.json
│   │       ├── schedules.json
│   │       ├── media.json
│   │       ├── campaigns.json
│   │       └── users.json
│   └── styles/
│       ├── tokens.css                        # shared/style.css 내용 그대로
│       └── globals.css
└── src/__tests__/
    ├── stores/toast.test.ts
    └── components/ui/
        ├── Button.test.tsx
        └── Badge.test.tsx
```

---

## Task 1: 프로젝트 스캐폴딩

**Files:**
- Create: `2026-04-09-prototype/frontend/` (스캐폴딩)
- Create: `2026-04-09-prototype/frontend/package.json` (의존성 추가)

- [ ] **Step 1: create-next-app 실행**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype
npx create-next-app@latest frontend \
  --typescript \
  --eslint \
  --no-tailwind \
  --src-dir \
  --app \
  --import-alias "@/*" \
  --no-turbopack
```

프롬프트가 나오면: TypeScript Yes, ESLint Yes, Tailwind No, src/ Yes, App Router Yes, alias `@/*` Yes, Turbopack No.

Expected output: `Success! Created frontend`

- [ ] **Step 2: 패키지 설치**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npm install \
  @tanstack/react-query \
  jotai \
  zod \
  react-hook-form \
  @hookform/resolvers \
  date-fns \
  lodash \
  billboard.js \
  socket.io-client \
  msw \
  @radix-ui/react-dialog \
  @radix-ui/react-select \
  @radix-ui/react-dropdown-menu

npm install --save-dev \
  @types/lodash \
  jest \
  jest-environment-jsdom \
  @testing-library/react \
  @testing-library/jest-dom \
  @testing-library/user-event
```

- [ ] **Step 3: MSW service worker 초기화**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npx msw init public/
```

Expected: `public/mockServiceWorker.js` 생성됨.

- [ ] **Step 4: Jest 설정**

`jest.config.ts` 생성:
```ts
import type { Config } from 'jest'
import nextJest from 'next/jest.js'

const createJestConfig = nextJest({ dir: './' })

const config: Config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
}

export default createJestConfig(config)
```

`jest.setup.ts` 생성:
```ts
import '@testing-library/jest-dom'
```

`package.json`의 `scripts`에 추가 (기존 scripts 블록에 병합):
```json
"test": "jest",
"test:watch": "jest --watch"
```

- [ ] **Step 5: 빌드 확인**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npm run build
```

Expected: 에러 없음.

- [ ] **Step 6: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend
git commit -m "chore: Next.js 15 + 의존성 설치 (Phase 1 스캐폴딩)"
```

---

## Task 2: CSS 토큰 이전

**Files:**
- Create: `frontend/src/styles/tokens.css`
- Modify: `frontend/src/styles/globals.css` (또는 `frontend/src/app/globals.css`)
- Modify: `frontend/src/app/layout.tsx` (globals.css import 확인)

- [ ] **Step 1: tokens.css 생성**

`2026-04-08-prototype/shared/style.css` 전체 내용을 `frontend/src/styles/tokens.css`에 복사.

```bash
cp D:/2026_cluade_build/bari-design/2026-04-08-prototype/shared/style.css \
   D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend/src/styles/tokens.css
```

- [ ] **Step 2: globals.css 수정**

`frontend/src/app/globals.css` (create-next-app이 생성한 파일) 전체를 다음으로 교체:

```css
@import '../styles/tokens.css';

*, *::before, *::after {
  box-sizing: border-box;
  margin: 0;
  padding: 0;
}

:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

- [ ] **Step 3: layout.tsx에서 globals.css import 확인**

`frontend/src/app/layout.tsx`를 열어 `import './globals.css'`가 있는지 확인. 없으면 추가. create-next-app이 자동 생성하므로 보통 있음.

- [ ] **Step 4: 개발 서버 확인**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npm run dev
```

브라우저에서 `http://localhost:3000` 열기. body 배경이 `oklch(0.98 0.005 80)` (거의 흰색, 아주 약한 따뜻한 회색)인지 확인.

DevTools Elements 탭 → `:root` 선택 → `--color-primary-500: oklch(0.72 0.19 155)` 등 토큰 변수 확인.

- [ ] **Step 5: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/styles 2026-04-09-prototype/frontend/src/app/globals.css
git commit -m "style: CSS 디자인 토큰 이전 (shared/style.css → tokens.css)"
```

---

## Task 3: 프로바이더 컴포넌트

**Files:**
- Create: `frontend/src/components/ReactQueryProvider.tsx`
- Create: `frontend/src/components/MSWProvider.tsx`

- [ ] **Step 1: ReactQueryProvider 작성**

`frontend/src/components/ReactQueryProvider.tsx`:
```tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient({
    defaultOptions: {
      queries: { retry: 1, staleTime: 30_000 },
    },
  }))
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```

- [ ] **Step 2: MSWProvider 작성**

`frontend/src/components/MSWProvider.tsx`:
```tsx
'use client'
import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('@/mocks/browser').then(({ browser }) =>
        browser.start({ onUnhandledRequest: 'bypass' })
      )
    }
  }, [])
  return <>{children}</>
}
```

- [ ] **Step 3: 루트 layout.tsx 수정**

`frontend/src/app/layout.tsx`를 다음으로 교체:
```tsx
import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { MSWProvider } from '@/components/MSWProvider'

export const metadata: Metadata = {
  title: 'Bari CMS',
  description: 'DOOH 콘텐츠 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <ReactQueryProvider>
          <MSWProvider>
            {children}
          </MSWProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: 빌드 확인**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npm run build
```

Expected: 에러 없음.

- [ ] **Step 5: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components 2026-04-09-prototype/frontend/src/app/layout.tsx
git commit -m "feat: ReactQueryProvider + MSWProvider 추가, 루트 레이아웃 설정"
```

---

## Task 4: MSW 픽스처 + 핸들러

**Files:**
- Create: `frontend/src/mocks/fixtures/schedules.json`
- Create: `frontend/src/mocks/fixtures/playlists.json`
- Create: `frontend/src/mocks/fixtures/media.json`
- Create: `frontend/src/mocks/fixtures/campaigns.json`
- Create: `frontend/src/mocks/fixtures/users.json`
- Create: `frontend/src/mocks/handlers/schedules.ts`
- Create: `frontend/src/mocks/handlers/playlists.ts`
- Create: `frontend/src/mocks/handlers/media.ts`
- Create: `frontend/src/mocks/handlers/campaigns.ts`
- Create: `frontend/src/mocks/handlers/users.ts`
- Create: `frontend/src/mocks/browser.ts`

- [ ] **Step 1: schedules.json 작성**

`frontend/src/mocks/fixtures/schedules.json`:
```json
[
  {
    "id": "sch-001",
    "name": "강남권 4월 운영 편성표",
    "status": "active",
    "priority": 3,
    "mediaNames": ["강남대로 전광판", "홍대입구 사이니지 외 1"],
    "startAt": "2026-04-01T00:00:00",
    "endAt": "2026-04-30T23:59:00",
    "playlistName": "강남권 4월 운영 재생목록",
    "campaignName": "삼성 갤럭시 S26",
    "syncStatus": "ok",
    "syncLagMinutes": null,
    "editingUsers": []
  },
  {
    "id": "sch-002",
    "name": "강남대로 삼성 프로모션 편성",
    "status": "active",
    "priority": 2,
    "mediaNames": ["강남대로 전광판"],
    "startAt": "2026-04-10T09:00:00",
    "endAt": "2026-04-20T18:00:00",
    "playlistName": "강남권 4월 운영 재생목록",
    "campaignName": "삼성 갤럭시 S26",
    "syncStatus": "ok",
    "syncLagMinutes": null,
    "editingUsers": ["박운영"]
  },
  {
    "id": "sch-003",
    "name": "강남역 4월 후반 편성표",
    "status": "pending",
    "priority": 3,
    "mediaNames": ["강남역 스크린"],
    "startAt": "2026-04-15T00:00:00",
    "endAt": "2026-04-30T23:59:00",
    "playlistName": "신촌 스프링 캠페인 재생목록",
    "campaignName": "삼성 갤럭시 S26",
    "syncStatus": "none",
    "syncLagMinutes": null,
    "editingUsers": []
  },
  {
    "id": "sch-004",
    "name": "여의도 4월 편성표",
    "status": "active",
    "priority": 3,
    "mediaNames": ["여의도 IFC 전광판"],
    "startAt": "2026-04-01T00:00:00",
    "endAt": "2026-04-30T23:59:00",
    "playlistName": "공익광고 필러 재생목록",
    "campaignName": null,
    "syncStatus": "lag",
    "syncLagMinutes": 8,
    "editingUsers": []
  },
  {
    "id": "sch-005",
    "name": "신촌 LG 오휘 편성",
    "status": "pending",
    "priority": 2,
    "mediaNames": ["신촌역 디스플레이"],
    "startAt": "2026-04-12T00:00:00",
    "endAt": "2026-04-14T23:59:00",
    "playlistName": "여의도 봄 시즌 재생목록",
    "campaignName": "LG 오휘 봄 신제품",
    "syncStatus": "none",
    "syncLagMinutes": null,
    "editingUsers": []
  },
  {
    "id": "sch-006",
    "name": "강남권 3월 운영 편성표",
    "status": "done",
    "priority": 3,
    "mediaNames": ["강남대로 전광판", "홍대입구 사이니지"],
    "startAt": "2026-03-01T00:00:00",
    "endAt": "2026-03-31T23:59:00",
    "playlistName": "강남권 4월 운영 재생목록",
    "campaignName": "배달의민족 봄맞이",
    "syncStatus": "none",
    "syncLagMinutes": null,
    "editingUsers": []
  }
]
```

- [ ] **Step 2: playlists.json 작성**

`frontend/src/mocks/fixtures/playlists.json`:
```json
[
  { "id": "pl-001", "name": "강남권 4월 운영 재생목록", "slotCount": 12, "duration": 300 },
  { "id": "pl-002", "name": "신촌 스프링 캠페인 재생목록", "slotCount": 8, "duration": 240 },
  { "id": "pl-003", "name": "공익광고 필러 재생목록", "slotCount": 5, "duration": 150 },
  { "id": "pl-004", "name": "여의도 봄 시즌 재생목록", "slotCount": 10, "duration": 280 }
]
```

- [ ] **Step 3: media.json 작성**

`frontend/src/mocks/fixtures/media.json`:
```json
[
  { "id": "med-001", "name": "강남대로 전광판", "status": "active", "type": "billboard", "location": "강남구 강남대로" },
  { "id": "med-002", "name": "홍대입구 사이니지", "status": "active", "type": "signage", "location": "마포구 홍대입구역" },
  { "id": "med-003", "name": "신촌역 디스플레이", "status": "active", "type": "display", "location": "서대문구 신촌역" },
  { "id": "med-004", "name": "여의도 IFC 전광판", "status": "active", "type": "billboard", "location": "영등포구 여의도" },
  { "id": "med-005", "name": "강남역 스크린", "status": "maintenance", "type": "screen", "location": "강남구 강남역" }
]
```

- [ ] **Step 4: campaigns.json 작성**

`frontend/src/mocks/fixtures/campaigns.json`:
```json
[
  { "id": "camp-001", "name": "삼성 갤럭시 S26", "status": "active", "advertiser": "삼성전자" },
  { "id": "camp-002", "name": "LG 오휘 봄 신제품", "status": "active", "advertiser": "LG생활건강" },
  { "id": "camp-003", "name": "배달의민족 봄맞이", "status": "done", "advertiser": "우아한형제들" }
]
```

- [ ] **Step 5: users.json 작성**

`frontend/src/mocks/fixtures/users.json`:
```json
[
  { "id": "usr-001", "name": "김관리", "role": "admin", "email": "kim@bari.io" },
  { "id": "usr-002", "name": "박운영", "role": "operator", "email": "park@bari.io" },
  { "id": "usr-003", "name": "이대행", "role": "agency", "email": "lee@agency.kr" }
]
```

- [ ] **Step 6: 핸들러 5종 작성**

`frontend/src/mocks/handlers/schedules.ts`:
```ts
import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(schedules)),
  http.get('/api/schedules/:id', ({ params }) => {
    const item = schedules.find((s) => s.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
```

`frontend/src/mocks/handlers/playlists.ts`:
```ts
import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(playlists)),
  http.get('/api/playlists/:id', ({ params }) => {
    const item = playlists.find((p) => p.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
```

`frontend/src/mocks/handlers/media.ts`:
```ts
import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(media)),
  http.get('/api/media/:id', ({ params }) => {
    const item = media.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
```

`frontend/src/mocks/handlers/campaigns.ts`:
```ts
import { http, HttpResponse } from 'msw'
import campaigns from '../fixtures/campaigns.json'

export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(campaigns)),
  http.get('/api/campaigns/:id', ({ params }) => {
    const item = campaigns.find((c) => c.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
```

`frontend/src/mocks/handlers/users.ts`:
```ts
import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(users)),
  http.get('/api/users/:id', ({ params }) => {
    const item = users.find((u) => u.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
```

- [ ] **Step 7: browser.ts 작성**

`frontend/src/mocks/browser.ts`:
```ts
import { setupWorker } from 'msw/browser'
import { scheduleHandlers } from './handlers/schedules'
import { playlistHandlers } from './handlers/playlists'
import { mediaHandlers } from './handlers/media'
import { campaignHandlers } from './handlers/campaigns'
import { userHandlers } from './handlers/users'

export const browser = setupWorker(
  ...scheduleHandlers,
  ...playlistHandlers,
  ...mediaHandlers,
  ...campaignHandlers,
  ...userHandlers,
)
```

- [ ] **Step 8: 개발 서버에서 MSW 동작 확인**

```bash
npm run dev
```

브라우저 Console에서 `[MSW] Mocking enabled.` 메시지 확인.
Network 탭에서 `GET /api/schedules` 요청 시 fixtures 데이터 반환 확인 (fetch로 테스트: DevTools Console에서 `fetch('/api/schedules').then(r=>r.json()).then(console.log)` 실행).

- [ ] **Step 9: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/mocks
git commit -m "feat(mock): MSW 픽스처 5종 + 핸들러 작성"
```

---

## Task 5: Toast 스토어

**Files:**
- Create: `frontend/src/stores/toast.ts`
- Create: `frontend/src/__tests__/stores/toast.test.ts`

- [ ] **Step 1: 실패 테스트 작성**

`frontend/src/__tests__/stores/toast.test.ts`:
```ts
import { renderHook, act } from '@testing-library/react'
import { useToast } from '@/stores/toast'

describe('useToast', () => {
  it('토스트를 추가한다', () => {
    const { result } = renderHook(() => useToast())
    act(() => {
      result.current.add('저장됐습니다', 'success')
    })
    expect(result.current.toasts).toHaveLength(1)
    expect(result.current.toasts[0].message).toBe('저장됐습니다')
    expect(result.current.toasts[0].type).toBe('success')
  })

  it('토스트를 id로 삭제한다', () => {
    const { result } = renderHook(() => useToast())
    let id: string
    act(() => {
      id = result.current.add('삭제 테스트', 'info')
    })
    act(() => {
      result.current.remove(id)
    })
    expect(result.current.toasts).toHaveLength(0)
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npx jest src/__tests__/stores/toast.test.ts
```

Expected: FAIL — `Cannot find module '@/stores/toast'`

- [ ] **Step 3: toast.ts 구현**

`frontend/src/stores/toast.ts`:
```ts
import { atom, useAtom } from 'jotai'

export type ToastType = 'success' | 'error' | 'info'

export interface Toast {
  id: string
  message: string
  type: ToastType
}

const toastsAtom = atom<Toast[]>([])

export function useToast() {
  const [toasts, setToasts] = useAtom(toastsAtom)

  function add(message: string, type: ToastType): string {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2)}`
    setToasts((prev) => [...prev, { id, message, type }])
    return id
  }

  function remove(id: string) {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, add, remove }
}
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest src/__tests__/stores/toast.test.ts
```

Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/stores 2026-04-09-prototype/frontend/src/__tests__/stores
git commit -m "feat: Toast Jotai 스토어 + useToast 훅 (TDD)"
```

---

## Task 6: 레이아웃 컴포넌트

**Files:**
- Create: `frontend/src/components/layout/AppShell.tsx`
- Create: `frontend/src/components/layout/AppShell.module.css`
- Create: `frontend/src/components/layout/Sidebar.tsx`
- Create: `frontend/src/components/layout/Sidebar.module.css`
- Create: `frontend/src/components/layout/TopBar.tsx`
- Create: `frontend/src/components/layout/TopBar.module.css`

참조: `2026-04-08-prototype/dashboard-admin.html` + `2026-04-08-prototype/schedule-list.html`

- [ ] **Step 1: AppShell 작성**

`frontend/src/components/layout/AppShell.tsx`:
```tsx
import styles from './AppShell.module.css'

interface AppShellProps {
  sidebar: React.ReactNode
  children: React.ReactNode
}

export function AppShell({ sidebar, children }: AppShellProps) {
  return (
    <div className={styles.shell}>
      {sidebar}
      <div className={styles.main}>{children}</div>
    </div>
  )
}
```

`frontend/src/components/layout/AppShell.module.css`:
```css
.shell {
  display: flex;
  height: 100vh;
  overflow: hidden;
  background: var(--color-neutral-50);
}

.main {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  min-width: 0;
}
```

- [ ] **Step 2: Sidebar 작성**

`frontend/src/components/layout/Sidebar.tsx`:
```tsx
'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import styles from './Sidebar.module.css'

const NAV_ITEMS = [
  {
    href: '/dashboard',
    label: '대시보드',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="6" height="6" rx="1.2"/><rect x="9" y="1" width="6" height="6" rx="1.2"/>
        <rect x="1" y="9" width="6" height="6" rx="1.2"/><rect x="9" y="9" width="6" height="6" rx="1.2"/>
      </svg>
    ),
  },
  {
    href: '/media',
    label: '매체 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="3" width="14" height="10" rx="1.5"/>
        <path d="M5 13v2M11 13v2M3 15h10"/>
      </svg>
    ),
  },
  {
    href: '/materials',
    label: '소재 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="14" height="14" rx="1.5"/>
        <circle cx="6" cy="6" r="2"/>
        <path d="M1 11l4-3 3 2 3-4 4 5"/>
      </svg>
    ),
  },
  {
    href: '/campaigns',
    label: '캠페인 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="8" r="7"/>
        <polygon points="6,5 12,8 6,11" fill="currentColor" stroke="none"/>
      </svg>
    ),
  },
  {
    href: '/schedules',
    label: '편성 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="3" width="14" height="12" rx="1.5"/>
        <path d="M1 7h14M5 1v4M11 1v4"/>
      </svg>
    ),
    subnav: [
      { href: '/playlists', label: '재생목록' },
      { href: '/schedules', label: '편성표' },
      { href: '/slots', label: '잔여 구좌' },
    ],
  },
  {
    href: '/users',
    label: '사용자 관리',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <circle cx="8" cy="5" r="3"/>
        <path d="M2 14c0-3.3 2.7-6 6-6s6 2.7 6 6"/>
      </svg>
    ),
  },
  {
    href: '/reports',
    label: '리포트',
    icon: (
      <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
        <rect x="1" y="1" width="14" height="14" rx="1.5"/>
        <path d="M4 11V8M7 11V6M10 11V9M13 11V5"/>
      </svg>
    ),
  },
]

export function Sidebar() {
  const pathname = usePathname()

  function isActive(href: string) {
    return pathname === href || pathname.startsWith(href + '/')
  }

  return (
    <nav className={styles.sidebar} aria-label="주 내비게이션">
      <div className={styles.logo}>
        <div className={styles.logoMark}>B</div>
        <span className={styles.logoName}>Bari CMS</span>
      </div>

      <div className={styles.nav}>
        {NAV_ITEMS.map((item) => (
          <div key={item.href}>
            <Link
              href={item.href}
              className={`${styles.item} ${isActive(item.href) ? styles.active : ''}`}
              aria-current={isActive(item.href) ? 'page' : undefined}
            >
              {item.icon}
              {item.label}
            </Link>
            {item.subnav && isActive(item.href) && (
              <div className={styles.subnav}>
                {item.subnav.map((sub) => (
                  <Link
                    key={sub.href}
                    href={sub.href}
                    className={`${styles.subitem} ${pathname === sub.href ? styles.subitemActive : ''}`}
                  >
                    {sub.label}
                  </Link>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className={styles.footer} role="button" tabIndex={0} aria-label="내 프로필">
        <div className={styles.footerAvatar}>김</div>
        <div className={styles.footerInfo}>
          <div className={styles.footerRole}>어드민</div>
          <div className={styles.footerName}>김관리</div>
        </div>
      </div>
    </nav>
  )
}
```

`frontend/src/components/layout/Sidebar.module.css`:
```css
.sidebar {
  width: 200px;
  flex-shrink: 0;
  background: oklch(0.16 0.02 155);
  display: flex;
  flex-direction: column;
  border-right: 1px solid oklch(0.12 0.02 155);
}

.logo {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px;
  border-bottom: 1px solid oklch(1 0 0 / 0.08);
  margin-bottom: 6px;
}

.logoMark {
  width: 28px;
  height: 28px;
  background: var(--color-primary-500);
  border-radius: 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  color: white;
  flex-shrink: 0;
}

.logoName {
  font-size: 15px;
  font-weight: 700;
  color: white;
  letter-spacing: -0.3px;
}

.nav {
  flex: 1;
  padding: 4px 8px;
  display: flex;
  flex-direction: column;
  gap: 1px;
  overflow-y: auto;
}

.item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 7px 10px;
  border-radius: 6px;
  font-size: 13px;
  color: oklch(1 0 0 / 0.55);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
  position: relative;
}

.item:hover {
  background: oklch(1 0 0 / 0.06);
  color: oklch(1 0 0 / 0.8);
}

.item.active {
  background: oklch(1 0 0 / 0.08);
  color: white;
  font-weight: 600;
}

.item.active::after {
  content: '';
  position: absolute;
  right: 0;
  top: 4px;
  bottom: 4px;
  width: 2px;
  background: var(--color-primary-400);
  border-radius: 2px;
}

.item:focus-visible {
  outline: 2px solid var(--color-primary-400);
  outline-offset: -2px;
}

.subnav {
  padding: 2px 8px 4px 34px;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.subitem {
  display: block;
  padding: 5px 10px;
  border-radius: 5px;
  font-size: 12px;
  color: oklch(1 0 0 / 0.45);
  text-decoration: none;
  transition: background 0.12s, color 0.12s;
}

.subitem:hover {
  background: oklch(1 0 0 / 0.05);
  color: oklch(1 0 0 / 0.7);
}

.subitem.subitemActive {
  color: oklch(1 0 0 / 0.85);
  font-weight: 500;
}

.footer {
  padding: 12px 14px;
  border-top: 1px solid oklch(1 0 0 / 0.08);
  cursor: pointer;
  transition: background 0.12s;
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer:hover {
  background: oklch(1 0 0 / 0.06);
}

.footerAvatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: oklch(1 0 0 / 0.12);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 600;
  flex-shrink: 0;
}

.footerInfo { flex: 1; min-width: 0; }
.footerRole { font-size: 11px; color: oklch(1 0 0 / 0.4); }
.footerName { font-size: 12px; color: oklch(1 0 0 / 0.7); font-weight: 500; margin-top: 2px; }
```

- [ ] **Step 3: TopBar 작성**

`frontend/src/components/layout/TopBar.tsx`:
```tsx
import styles from './TopBar.module.css'

interface TopBarProps {
  breadcrumb?: { label: string; href?: string }[]
}

export function TopBar({ breadcrumb = [] }: TopBarProps) {
  return (
    <header className={styles.bar}>
      <nav className={styles.breadcrumb} aria-label="이동 경로">
        {breadcrumb.map((item, i) => (
          <span key={i} className={styles.breadcrumbGroup}>
            {i > 0 && <span className={styles.sep} aria-hidden>›</span>}
            <span className={`${styles.crumb} ${i === breadcrumb.length - 1 ? styles.current : ''}`}>
              {item.label}
            </span>
          </span>
        ))}
      </nav>
      <div className={styles.actions}>
        <button className={styles.iconBtn} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round">
            <path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/>
            <path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/>
          </svg>
        </button>
      </div>
    </header>
  )
}
```

`frontend/src/components/layout/TopBar.module.css`:
```css
.bar {
  height: 52px;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid var(--color-border-default);
  display: flex;
  align-items: center;
  padding: 0 var(--space-6);
  gap: 12px;
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  flex: 1;
}

.breadcrumbGroup {
  display: flex;
  align-items: center;
  gap: 6px;
}

.sep {
  font-size: var(--text-sm);
  color: var(--color-neutral-300);
}

.crumb {
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.crumb.current {
  color: var(--color-neutral-900);
  font-weight: 600;
}

.actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.iconBtn {
  width: 34px;
  height: 34px;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-500);
  transition: background 0.12s;
}

.iconBtn:hover { background: var(--color-neutral-100); }
```

- [ ] **Step 4: (dashboard) layout 작성**

`frontend/src/app/(dashboard)/layout.tsx`:
```tsx
import { AppShell } from '@/components/layout/AppShell'
import { Sidebar } from '@/components/layout/Sidebar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<Sidebar />}>
      {children}
    </AppShell>
  )
}
```

- [ ] **Step 5: 임시 dev 페이지로 레이아웃 확인**

`frontend/src/app/(dashboard)/dev/page.tsx` (임시):
```tsx
export default function DevPage() {
  return (
    <div style={{ padding: '24px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700 }}>컴포넌트 쇼케이스</h1>
      <p style={{ marginTop: '8px', color: 'var(--color-neutral-500)', fontSize: '13px' }}>
        레이아웃 확인용 임시 페이지
      </p>
    </div>
  )
}
```

```bash
npm run dev
```

`http://localhost:3000/dev` 방문. 사이드바(어두운 배경, Bari CMS 로고)와 TopBar 없음(아직 추가 전)이 렌더링되는지 확인.

- [ ] **Step 6: TopBar를 dashboard layout에 추가**

`frontend/src/app/(dashboard)/layout.tsx` 수정:
```tsx
import { AppShell } from '@/components/layout/AppShell'
import { Sidebar } from '@/components/layout/Sidebar'
import { TopBar } from '@/components/layout/TopBar'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <AppShell sidebar={<Sidebar />}>
      <TopBar breadcrumb={[{ label: 'Bari CMS' }]} />
      <main style={{ flex: 1, overflowY: 'auto' }}>
        {children}
      </main>
    </AppShell>
  )
}
```

브라우저에서 `http://localhost:3000/dev` 재확인. 사이드바 + TopBar + 콘텐츠 영역이 모두 보이는지 확인.

- [ ] **Step 7: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/layout 2026-04-09-prototype/frontend/src/app
git commit -m "feat: AppShell + Sidebar + TopBar 레이아웃 구현"
```

---

## Task 7: Button 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Button.tsx`
- Create: `frontend/src/components/ui/Button.module.css`
- Create: `frontend/src/__tests__/components/ui/Button.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`frontend/src/__tests__/components/ui/Button.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Button } from '@/components/ui/Button'

describe('Button', () => {
  it('label을 렌더링한다', () => {
    render(<Button>저장</Button>)
    expect(screen.getByRole('button', { name: '저장' })).toBeInTheDocument()
  })

  it('disabled일 때 클릭 이벤트가 발생하지 않는다', async () => {
    const onClick = jest.fn()
    render(<Button disabled onClick={onClick}>저장</Button>)
    await userEvent.click(screen.getByRole('button'))
    expect(onClick).not.toHaveBeenCalled()
  })

  it('variant=secondary 클래스를 적용한다', () => {
    render(<Button variant="secondary">취소</Button>)
    expect(screen.getByRole('button')).toHaveClass('secondary')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest src/__tests__/components/ui/Button.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Button 구현**

`frontend/src/components/ui/Button.tsx`:
```tsx
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger'
type ButtonSize = 'sm' | 'md'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  loading?: boolean
}

export function Button({
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled,
  className = '',
  children,
  ...props
}: ButtonProps) {
  return (
    <button
      className={[styles.btn, styles[variant], styles[size], className].filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && (
        <svg className={styles.spinner} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
        </svg>
      )}
      {children}
    </button>
  )
}
```

`frontend/src/components/ui/Button.module.css`:
```css
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  border-radius: var(--radius-md);
  border: 1px solid transparent;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s, opacity 0.12s;
  text-decoration: none;
  white-space: nowrap;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.btn:disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

/* Sizes */
.md { padding: 9px 18px; }
.sm { padding: 5px 12px; font-size: var(--text-xs); }

/* Variants */
.primary {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
}
.primary:hover:not(:disabled) { background: var(--color-primary-600); border-color: var(--color-primary-600); }

.secondary {
  background: white;
  color: var(--color-neutral-700);
  border-color: var(--color-border-default);
}
.secondary:hover:not(:disabled) { background: var(--color-neutral-50); }

.ghost {
  background: transparent;
  color: var(--color-neutral-600);
  border-color: transparent;
}
.ghost:hover:not(:disabled) { background: var(--color-neutral-100); }

.danger {
  background: var(--color-error-500);
  color: white;
  border-color: var(--color-error-500);
}
.danger:hover:not(:disabled) { opacity: 0.85; }

/* Spinner */
@keyframes spin { to { transform: rotate(360deg); } }
.spinner { animation: spin 0.8s linear infinite; flex-shrink: 0; }
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest src/__tests__/components/ui/Button.test.tsx
```

Expected: PASS (3 tests)

- [ ] **Step 5: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Button* 2026-04-09-prototype/frontend/src/__tests__/components/ui/Button.test.tsx
git commit -m "feat(ui): Button 컴포넌트 (primary/secondary/ghost/danger, loading)"
```

---

## Task 8: Badge 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Badge.tsx`
- Create: `frontend/src/components/ui/Badge.module.css`
- Create: `frontend/src/__tests__/components/ui/Badge.test.tsx`

- [ ] **Step 1: 실패 테스트 작성**

`frontend/src/__tests__/components/ui/Badge.test.tsx`:
```tsx
import { render, screen } from '@testing-library/react'
import { Badge } from '@/components/ui/Badge'

describe('Badge', () => {
  it('텍스트를 렌더링한다', () => {
    render(<Badge>적용중</Badge>)
    expect(screen.getByText('적용중')).toBeInTheDocument()
  })

  it('variant 클래스를 적용한다', () => {
    const { container } = render(<Badge variant="active">적용중</Badge>)
    expect(container.firstChild).toHaveClass('active')
  })
})
```

- [ ] **Step 2: 테스트 실패 확인**

```bash
npx jest src/__tests__/components/ui/Badge.test.tsx
```

Expected: FAIL

- [ ] **Step 3: Badge 구현**

`frontend/src/components/ui/Badge.tsx`:
```tsx
import styles from './Badge.module.css'

type BadgeVariant = 'active' | 'pending' | 'done' | 'error' | 'neutral'

interface BadgeProps {
  variant?: BadgeVariant
  dot?: boolean
  children: React.ReactNode
}

export function Badge({ variant = 'neutral', dot = false, children }: BadgeProps) {
  return (
    <span className={[styles.badge, styles[variant]].join(' ')}>
      {dot && <span className={styles.dot} aria-hidden />}
      {children}
    </span>
  )
}
```

`frontend/src/components/ui/Badge.module.css`:
```css
.badge {
  display: inline-flex;
  align-items: center;
  gap: 5px;
  padding: 3px 9px;
  border-radius: 100px;
  font-size: var(--text-xs);
  font-weight: 600;
  white-space: nowrap;
}

.dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

/* Variants */
.active  { background: var(--color-primary-50);  color: var(--color-primary-700); }
.active  .dot { background: var(--color-primary-500); }

.pending { background: oklch(0.94 0.03 55); color: oklch(0.42 0.10 55); }
.pending .dot { background: oklch(0.68 0.13 55); }

.done    { background: var(--color-neutral-100); color: var(--color-neutral-500); }
.done    .dot { background: var(--color-neutral-400); }

.error   { background: var(--color-error-50);    color: var(--color-error-500); }
.error   .dot { background: var(--color-error-500); }

.neutral { background: var(--color-neutral-100); color: var(--color-neutral-600); }
.neutral .dot { background: var(--color-neutral-400); }
```

- [ ] **Step 4: 테스트 통과 확인**

```bash
npx jest src/__tests__/components/ui/Badge.test.tsx
```

Expected: PASS (2 tests)

- [ ] **Step 5: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Badge* 2026-04-09-prototype/frontend/src/__tests__/components/ui/Badge.test.tsx
git commit -m "feat(ui): Badge 컴포넌트 (active/pending/done/error/neutral)"
```

---

## Task 9: Card 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Card.tsx`
- Create: `frontend/src/components/ui/Card.module.css`

- [ ] **Step 1: Card 구현**

`frontend/src/components/ui/Card.tsx`:
```tsx
import styles from './Card.module.css'

interface CardProps {
  children: React.ReactNode
  className?: string
  onClick?: () => void
}

export function Card({ children, className = '', onClick }: CardProps) {
  return (
    <div
      className={[styles.card, onClick ? styles.clickable : '', className].filter(Boolean).join(' ')}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === 'Enter' || e.key === ' ') onClick() } : undefined}
    >
      {children}
    </div>
  )
}
```

`frontend/src/components/ui/Card.module.css`:
```css
.card {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
}

.clickable {
  cursor: pointer;
  transition: background 0.1s, box-shadow 0.1s;
}

.clickable:hover {
  background: var(--color-neutral-50);
  box-shadow: var(--shadow-md);
}

.clickable:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Card*
git commit -m "feat(ui): Card 컴포넌트"
```

---

## Task 10: Modal 컴포넌트 (Radix Dialog)

**Files:**
- Create: `frontend/src/components/ui/Modal.tsx`
- Create: `frontend/src/components/ui/Modal.module.css`

- [ ] **Step 1: Modal 구현**

`frontend/src/components/ui/Modal.tsx`:
```tsx
'use client'
import * as Dialog from '@radix-ui/react-dialog'
import styles from './Modal.module.css'

interface ModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  footer?: React.ReactNode
}

export function Modal({ open, onOpenChange, title, description, children, footer }: ModalProps) {
  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={styles.overlay} />
        <Dialog.Content className={styles.content}>
          <div className={styles.header}>
            <Dialog.Title className={styles.title}>{title}</Dialog.Title>
            <Dialog.Close className={styles.close} aria-label="닫기">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                <path d="M3 3l10 10M13 3L3 13"/>
              </svg>
            </Dialog.Close>
          </div>
          {description && (
            <Dialog.Description className={styles.description}>{description}</Dialog.Description>
          )}
          <div className={styles.body}>{children}</div>
          {footer && <div className={styles.footer}>{footer}</div>}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  )
}
```

`frontend/src/components/ui/Modal.module.css`:
```css
.overlay {
  position: fixed;
  inset: 0;
  background: oklch(0 0 0 / 0.45);
  animation: overlayIn 0.15s ease;
}

.content {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  border-radius: var(--radius-xl);
  box-shadow: 0 8px 32px oklch(0 0 0 / 0.18);
  width: min(560px, calc(100vw - 32px));
  max-height: calc(100vh - 64px);
  display: flex;
  flex-direction: column;
  animation: contentIn 0.15s ease;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 16px;
  border-bottom: 1px solid var(--color-border-default);
}

.title {
  font-size: var(--text-lg);
  font-weight: 700;
  color: var(--color-neutral-900);
  letter-spacing: -0.03em;
}

.description {
  padding: 12px 24px 0;
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
}

.close {
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  color: var(--color-neutral-400);
  transition: background 0.12s;
}

.close:hover { background: var(--color-neutral-100); color: var(--color-neutral-600); }

.body {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
}

.footer {
  padding: 16px 24px;
  border-top: 1px solid var(--color-border-default);
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}

@keyframes overlayIn { from { opacity: 0; } to { opacity: 1; } }
@keyframes contentIn { from { opacity: 0; transform: translate(-50%, -48%) scale(0.97); } to { opacity: 1; transform: translate(-50%, -50%) scale(1); } }
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Modal*
git commit -m "feat(ui): Modal 컴포넌트 (Radix Dialog)"
```

---

## Task 11: Toast + ToastContainer

**Files:**
- Create: `frontend/src/components/ui/Toast.tsx`
- Create: `frontend/src/components/ui/Toast.module.css`
- Create: `frontend/src/components/ui/ToastContainer.tsx`
- Modify: `frontend/src/app/layout.tsx` (ToastContainer 추가)

- [ ] **Step 1: Toast 아이템 컴포넌트 작성**

`frontend/src/components/ui/Toast.tsx`:
```tsx
import styles from './Toast.module.css'
import type { Toast as ToastType } from '@/stores/toast'

interface ToastProps {
  toast: ToastType
  onClose: (id: string) => void
}

export function Toast({ toast, onClose }: ToastProps) {
  return (
    <div className={[styles.toast, styles[toast.type]].join(' ')} role="alert" aria-live="polite">
      <span className={styles.message}>{toast.message}</span>
      <button
        className={styles.close}
        onClick={() => onClose(toast.id)}
        aria-label="알림 닫기"
      >
        <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
          <path d="M3 3l10 10M13 3L3 13"/>
        </svg>
      </button>
    </div>
  )
}
```

`frontend/src/components/ui/Toast.module.css`:
```css
.toast {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.12);
  font-size: var(--text-sm);
  font-weight: 500;
  min-width: 240px;
  max-width: 400px;
  animation: slideIn 0.2s ease;
}

.message { flex: 1; }

.close {
  flex-shrink: 0;
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;
  cursor: pointer;
  border-radius: var(--radius-sm);
  opacity: 0.6;
  transition: opacity 0.12s;
}

.close:hover { opacity: 1; }

/* Type variants */
.success { background: oklch(0.18 0.04 155); color: oklch(0.92 0.05 155); }
.error   { background: oklch(0.22 0.05 25);  color: oklch(0.92 0.04 25);  }
.info    { background: oklch(0.20 0.01 240);  color: oklch(0.90 0.02 240); }

@keyframes slideIn {
  from { transform: translateX(100%); opacity: 0; }
  to   { transform: translateX(0);    opacity: 1; }
}
```

- [ ] **Step 2: ToastContainer 작성**

`frontend/src/components/ui/ToastContainer.tsx`:
```tsx
'use client'
import { createPortal } from 'react-dom'
import { useToast } from '@/stores/toast'
import { Toast } from './Toast'

export function ToastContainer() {
  const { toasts, remove } = useToast()

  if (toasts.length === 0) return null

  return createPortal(
    <div
      style={{
        position: 'fixed',
        bottom: '24px',
        right: '24px',
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        zIndex: 9999,
      }}
      aria-label="알림 목록"
    >
      {toasts.map((toast) => (
        <Toast key={toast.id} toast={toast} onClose={remove} />
      ))}
    </div>,
    document.body
  )
}
```

- [ ] **Step 3: 루트 layout.tsx에 ToastContainer 추가**

`frontend/src/app/layout.tsx`를 수정해 `</MSWProvider>` 바로 앞에 `<ToastContainer />` 추가:

```tsx
import type { Metadata } from 'next'
import './globals.css'
import { ReactQueryProvider } from '@/components/ReactQueryProvider'
import { MSWProvider } from '@/components/MSWProvider'
import { ToastContainer } from '@/components/ui/ToastContainer'

export const metadata: Metadata = {
  title: 'Bari CMS',
  description: 'DOOH 콘텐츠 관리 시스템',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <head>
        <link rel="preconnect" href="https://cdn.jsdelivr.net" />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css"
        />
      </head>
      <body>
        <ReactQueryProvider>
          <MSWProvider>
            {children}
            <ToastContainer />
          </MSWProvider>
        </ReactQueryProvider>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Toast* 2026-04-09-prototype/frontend/src/app/layout.tsx
git commit -m "feat(ui): Toast + ToastContainer (Jotai Portal)"
```

---

## Task 12: Toggle 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Toggle.tsx`
- Create: `frontend/src/components/ui/Toggle.module.css`

- [ ] **Step 1: Toggle 구현**

`frontend/src/components/ui/Toggle.tsx`:
```tsx
import styles from './Toggle.module.css'

interface ToggleProps {
  checked: boolean
  onChange: (checked: boolean) => void
  label?: string
  disabled?: boolean
  id?: string
}

export function Toggle({ checked, onChange, label, disabled = false, id }: ToggleProps) {
  return (
    <label className={`${styles.wrap} ${disabled ? styles.disabled : ''}`}>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        disabled={disabled}
        id={id}
        className={styles.input}
        aria-checked={checked}
      />
      <span className={`${styles.track} ${checked ? styles.on : ''}`} aria-hidden>
        <span className={styles.thumb} />
      </span>
      {label && <span className={styles.label}>{label}</span>}
    </label>
  )
}
```

`frontend/src/components/ui/Toggle.module.css`:
```css
.wrap {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  user-select: none;
}

.wrap.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.input {
  position: absolute;
  opacity: 0;
  width: 0;
  height: 0;
}

.input:focus-visible + .track {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.track {
  position: relative;
  width: 36px;
  height: 20px;
  border-radius: 10px;
  background: var(--color-neutral-300);
  transition: background 0.2s;
  flex-shrink: 0;
}

.track.on {
  background: var(--color-primary-500);
}

.thumb {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: white;
  box-shadow: 0 1px 3px oklch(0 0 0 / 0.2);
  transition: transform 0.2s;
}

.track.on .thumb {
  transform: translateX(16px);
}

.label {
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
}
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Toggle*
git commit -m "feat(ui): Toggle 컴포넌트"
```

---

## Task 13: Table 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Table.tsx`
- Create: `frontend/src/components/ui/Table.module.css`

- [ ] **Step 1: Table 구현**

`frontend/src/components/ui/Table.tsx`:
```tsx
import styles from './Table.module.css'

export interface Column<T> {
  key: string
  header: string
  render: (row: T) => React.ReactNode
  width?: string
}

interface TableProps<T> {
  columns: Column<T>[]
  rows: T[]
  keyExtractor: (row: T) => string
  onRowClick?: (row: T) => void
  emptyMessage?: string
}

export function Table<T>({ columns, rows, keyExtractor, onRowClick, emptyMessage = '데이터가 없습니다' }: TableProps<T>) {
  return (
    <div className={styles.wrap}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col) => (
              <th key={col.key} style={{ width: col.width }}>{col.header}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.length === 0 ? (
            <tr>
              <td colSpan={columns.length} className={styles.empty}>{emptyMessage}</td>
            </tr>
          ) : (
            rows.map((row) => (
              <tr
                key={keyExtractor(row)}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? styles.clickable : ''}
                tabIndex={onRowClick ? 0 : undefined}
                role={onRowClick ? 'link' : undefined}
                onKeyDown={onRowClick ? (e) => { if (e.key === 'Enter') onRowClick(row) } : undefined}
              >
                {columns.map((col) => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
```

`frontend/src/components/ui/Table.module.css`:
```css
.wrap {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  overflow: hidden;
}

.table {
  width: 100%;
  border-collapse: collapse;
}

.table thead th {
  padding: 10px 14px;
  text-align: left;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-neutral-500);
  background: var(--color-neutral-50);
  border-bottom: 1px solid var(--color-border-default);
  text-transform: uppercase;
  letter-spacing: 0.02em;
  white-space: nowrap;
}

.table tbody tr { transition: background 0.1s; }
.table tbody tr + tr td { border-top: 1px solid var(--color-border-default); }
.table tbody td {
  padding: 12px 14px;
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  vertical-align: middle;
}

.clickable { cursor: pointer; }
.clickable:hover { background: var(--color-neutral-50); }
.clickable:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: -2px; }

.empty {
  text-align: center;
  padding: 40px !important;
  color: var(--color-neutral-400) !important;
  font-size: var(--text-sm) !important;
}
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Table*
git commit -m "feat(ui): Table 컴포넌트 (제네릭, 빈 상태, 행 클릭)"
```

---

## Task 14: FilterBar 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/FilterBar.tsx`
- Create: `frontend/src/components/ui/FilterBar.module.css`

- [ ] **Step 1: FilterBar 구현**

`frontend/src/components/ui/FilterBar.tsx`:
```tsx
'use client'
import * as RadixSelect from '@radix-ui/react-select'
import styles from './FilterBar.module.css'

export interface FilterOption {
  key: string
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
}

interface FilterBarProps {
  filters: FilterOption[]
  searchPlaceholder?: string
  searchValue?: string
  onSearch?: (value: string) => void
  onReset?: () => void
}

export function FilterBar({
  filters,
  searchPlaceholder = '검색',
  searchValue = '',
  onSearch,
  onReset,
}: FilterBarProps) {
  return (
    <div className={styles.bar}>
      {filters.map((filter) => (
        <RadixSelect.Root key={filter.key} value={filter.value} onValueChange={filter.onChange}>
          <RadixSelect.Trigger className={styles.select} aria-label={filter.label}>
            <RadixSelect.Value placeholder={filter.label} />
            <RadixSelect.Icon>
              <svg width="10" height="10" viewBox="0 0 10 6" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round">
                <path d="M1 1l4 4 4-4"/>
              </svg>
            </RadixSelect.Icon>
          </RadixSelect.Trigger>
          <RadixSelect.Portal>
            <RadixSelect.Content className={styles.dropdown} position="popper" sideOffset={4}>
              <RadixSelect.Viewport>
                <RadixSelect.Item value="" className={styles.item}>
                  <RadixSelect.ItemText>{filter.label} (전체)</RadixSelect.ItemText>
                </RadixSelect.Item>
                {filter.options.map((opt) => (
                  <RadixSelect.Item key={opt.value} value={opt.value} className={styles.item}>
                    <RadixSelect.ItemText>{opt.label}</RadixSelect.ItemText>
                  </RadixSelect.Item>
                ))}
              </RadixSelect.Viewport>
            </RadixSelect.Content>
          </RadixSelect.Portal>
        </RadixSelect.Root>
      ))}

      {onSearch && (
        <div className={styles.searchWrap}>
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <circle cx="7" cy="7" r="4.5"/>
            <path d="M10.5 10.5 13 13"/>
          </svg>
          <input
            type="search"
            className={styles.search}
            placeholder={searchPlaceholder}
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
            aria-label={searchPlaceholder}
          />
        </div>
      )}

      {onReset && (
        <button className={styles.reset} onClick={onReset}>초기화</button>
      )}
    </div>
  )
}
```

`frontend/src/components/ui/FilterBar.module.css`:
```css
.bar {
  display: flex;
  align-items: center;
  gap: 8px;
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 12px 16px;
  flex-wrap: wrap;
}

.select {
  height: 32px;
  padding: 0 10px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  background: white;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-family: var(--font-sans);
  color: var(--color-neutral-700);
  transition: border-color 0.12s;
}

.select:hover { border-color: var(--color-neutral-400); }
.select:focus-visible { outline: 2px solid var(--color-primary-500); outline-offset: 2px; border-color: var(--color-primary-400); }

.dropdown {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px oklch(0 0 0 / 0.1);
  overflow: hidden;
  z-index: 100;
  min-width: 160px;
}

.item {
  padding: 8px 12px;
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  cursor: pointer;
  transition: background 0.1s;
  outline: none;
}

.item:hover, .item[data-highlighted] { background: var(--color-primary-50); color: var(--color-primary-700); }
.item[data-state="checked"] { font-weight: 600; color: var(--color-primary-700); }

.searchWrap {
  flex: 1;
  min-width: 160px;
  position: relative;
}

.searchWrap svg {
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  color: var(--color-neutral-400);
  pointer-events: none;
}

.search {
  width: 100%;
  height: 32px;
  padding: 0 10px 0 32px;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  transition: border-color 0.12s;
}

.search:focus { border-color: var(--color-primary-400); outline: none; }

.reset {
  height: 32px;
  padding: 0 12px;
  font-size: var(--text-sm);
  color: var(--color-neutral-500);
  background: none;
  border: none;
  cursor: pointer;
  border-radius: var(--radius-md);
  font-family: var(--font-sans);
  transition: background 0.12s;
}

.reset:hover { background: var(--color-neutral-100); }
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/FilterBar*
git commit -m "feat(ui): FilterBar 컴포넌트 (Radix Select + 검색)"
```

---

## Task 15: Pagination 컴포넌트

**Files:**
- Create: `frontend/src/components/ui/Pagination.tsx`
- Create: `frontend/src/components/ui/Pagination.module.css`

- [ ] **Step 1: Pagination 구현**

`frontend/src/components/ui/Pagination.tsx`:
```tsx
import styles from './Pagination.module.css'

interface PaginationProps {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const pages = Array.from({ length: totalPages }, (_, i) => i + 1)

  return (
    <nav className={styles.nav} aria-label="페이지 이동">
      <button
        className={styles.btn}
        onClick={() => onChange(page - 1)}
        disabled={page <= 1}
        aria-label="이전 페이지"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M10 3L5 8l5 5"/>
        </svg>
      </button>

      {pages.map((p) => (
        <button
          key={p}
          className={`${styles.btn} ${p === page ? styles.active : ''}`}
          onClick={() => onChange(p)}
          aria-current={p === page ? 'page' : undefined}
          aria-label={`${p}페이지`}
        >
          {p}
        </button>
      ))}

      <button
        className={styles.btn}
        onClick={() => onChange(page + 1)}
        disabled={page >= totalPages}
        aria-label="다음 페이지"
      >
        <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
          <path d="M6 3l5 5-5 5"/>
        </svg>
      </button>
    </nav>
  )
}
```

`frontend/src/components/ui/Pagination.module.css`:
```css
.nav {
  display: flex;
  align-items: center;
  gap: 2px;
}

.btn {
  min-width: 32px;
  height: 32px;
  padding: 0 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid transparent;
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  color: var(--color-neutral-600);
  background: none;
  cursor: pointer;
  transition: background 0.12s, border-color 0.12s, color 0.12s;
  font-family: var(--font-sans);
}

.btn:hover:not(:disabled):not(.active) {
  background: var(--color-neutral-100);
  color: var(--color-neutral-900);
}

.btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn:focus-visible {
  outline: 2px solid var(--color-primary-500);
  outline-offset: 2px;
}

.active {
  background: var(--color-primary-500);
  color: white;
  border-color: var(--color-primary-500);
  font-weight: 600;
  cursor: default;
}
```

- [ ] **Step 2: 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/components/ui/Pagination*
git commit -m "feat(ui): Pagination 컴포넌트"
```

---

## Task 16: /dev 쇼케이스 페이지 + 최종 검증

**Files:**
- Modify: `frontend/src/app/(dashboard)/dev/page.tsx`

- [ ] **Step 1: /dev 쇼케이스 페이지 작성**

`frontend/src/app/(dashboard)/dev/page.tsx`:
```tsx
'use client'
import { useState } from 'react'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import { Card } from '@/components/ui/Card'
import { Modal } from '@/components/ui/Modal'
import { Toggle } from '@/components/ui/Toggle'
import { Table, type Column } from '@/components/ui/Table'
import { FilterBar, type FilterOption } from '@/components/ui/FilterBar'
import { Pagination } from '@/components/ui/Pagination'
import { useToast } from '@/stores/toast'

interface SampleRow { id: string; name: string; status: string }
const SAMPLE_ROWS: SampleRow[] = [
  { id: '1', name: '강남대로 전광판', status: 'active' },
  { id: '2', name: '홍대입구 사이니지', status: 'pending' },
  { id: '3', name: '신촌역 디스플레이', status: 'done' },
]

const COLUMNS: Column<SampleRow>[] = [
  { key: 'name', header: '매체명', render: (r) => r.name },
  { key: 'status', header: '상태', render: (r) => (
    <Badge variant={r.status as 'active' | 'pending' | 'done'} dot>
      {{ active: '적용중', pending: '예약됨', done: '종료' }[r.status]}
    </Badge>
  )},
]

export default function DevPage() {
  const [modalOpen, setModalOpen] = useState(false)
  const [toggle, setToggle] = useState(false)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { add } = useToast()

  const filters: FilterOption[] = [
    {
      key: 'status',
      label: '상태',
      value: statusFilter,
      onChange: setStatusFilter,
      options: [
        { value: 'active', label: '적용중' },
        { value: 'pending', label: '예약됨' },
        { value: 'done', label: '종료' },
      ],
    },
  ]

  return (
    <div style={{ padding: '24px', display: 'flex', flexDirection: 'column', gap: '32px' }}>
      <h1 style={{ fontSize: '22px', fontWeight: 700, color: 'var(--color-neutral-900)' }}>
        컴포넌트 쇼케이스
      </h1>

      {/* Button */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Button</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Button>Primary</Button>
          <Button variant="secondary">Secondary</Button>
          <Button variant="ghost">Ghost</Button>
          <Button variant="danger">Danger</Button>
          <Button disabled>Disabled</Button>
          <Button loading>Loading</Button>
          <Button size="sm">Small</Button>
        </div>
      </section>

      {/* Badge */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Badge</h2>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <Badge variant="active" dot>적용중</Badge>
          <Badge variant="pending" dot>예약됨</Badge>
          <Badge variant="done" dot>종료</Badge>
          <Badge variant="error" dot>오류</Badge>
          <Badge variant="neutral">기본</Badge>
        </div>
      </section>

      {/* Card */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Card</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <Card style={{ padding: '16px', width: '200px' } as React.CSSProperties}>정적 카드</Card>
          <Card onClick={() => add('카드 클릭됨', 'info')} style={{ padding: '16px', width: '200px' } as React.CSSProperties}>클릭 가능 카드</Card>
        </div>
      </section>

      {/* Modal */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Modal</h2>
        <Button onClick={() => setModalOpen(true)}>모달 열기</Button>
        <Modal
          open={modalOpen}
          onOpenChange={setModalOpen}
          title="편성표 삭제"
          description="삭제하면 복구할 수 없습니다."
          footer={
            <>
              <Button variant="secondary" onClick={() => setModalOpen(false)}>취소</Button>
              <Button variant="danger" onClick={() => { setModalOpen(false); add('삭제됐습니다', 'error') }}>삭제</Button>
            </>
          }
        >
          <p style={{ fontSize: '14px', color: 'var(--color-neutral-700)' }}>
            강남권 4월 운영 편성표를 삭제하시겠습니까?
          </p>
        </Modal>
      </section>

      {/* Toast */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Toast</h2>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button onClick={() => add('저장됐습니다', 'success')} variant="secondary">Success</Button>
          <Button onClick={() => add('오류가 발생했습니다', 'error')} variant="secondary">Error</Button>
          <Button onClick={() => add('작업이 진행 중입니다', 'info')} variant="secondary">Info</Button>
        </div>
      </section>

      {/* Toggle */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Toggle</h2>
        <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
          <Toggle checked={toggle} onChange={setToggle} label="활성화" />
          <Toggle checked={true} onChange={() => {}} label="On (읽기 전용)" />
          <Toggle checked={false} onChange={() => {}} label="Off (읽기 전용)" />
          <Toggle checked={true} onChange={() => {}} label="Disabled" disabled />
        </div>
      </section>

      {/* FilterBar + Table */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>FilterBar + Table</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <FilterBar
            filters={filters}
            searchPlaceholder="매체명 검색"
            searchValue={search}
            onSearch={setSearch}
            onReset={() => { setSearch(''); setStatusFilter('') }}
          />
          <Table
            columns={COLUMNS}
            rows={SAMPLE_ROWS.filter((r) =>
              (!statusFilter || r.status === statusFilter) &&
              (!search || r.name.includes(search))
            )}
            keyExtractor={(r) => r.id}
            onRowClick={(r) => add(`${r.name} 클릭`, 'info')}
          />
        </div>
      </section>

      {/* Pagination */}
      <section>
        <h2 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--color-neutral-500)', marginBottom: '12px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Pagination</h2>
        <Pagination page={page} totalPages={7} onChange={setPage} />
        <p style={{ marginTop: '8px', fontSize: '13px', color: 'var(--color-neutral-500)' }}>현재 페이지: {page}</p>
      </section>
    </div>
  )
}
```

- [ ] **Step 2: 전체 테스트 실행**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npx jest
```

Expected: 모든 테스트 PASS (toast 2개, Button 3개, Badge 2개 = 7개)

- [ ] **Step 3: 최종 빌드 확인**

```bash
npm run build
```

Expected: 에러 없음. 경고는 무시 가능.

- [ ] **Step 4: /dev 페이지 전체 확인**

```bash
npm run dev
```

`http://localhost:3000/dev` 방문. 체크리스트:
- [ ] 사이드바 렌더링됨 (어두운 배경, 메뉴 7종, 편성 관리 하위 메뉴)
- [ ] TopBar 렌더링됨 (흰 배경, 알림 아이콘)
- [ ] DevTools Elements `:root`에서 `--color-primary-500: oklch(0.72 0.19 155)` 확인
- [ ] Button 7종 렌더링 (primary, secondary, ghost, danger, disabled, loading, small)
- [ ] Badge 5종 렌더링 (active dot, pending dot, done dot, error dot, neutral)
- [ ] Modal 열기/닫기 동작
- [ ] Toast 3종 (success/error/info) 우측 하단 표시, 닫기 버튼 동작
- [ ] Toggle on/off 상태 전환
- [ ] FilterBar 상태 필터 + 검색 → Table 필터링
- [ ] Pagination 페이지 전환

- [ ] **Step 5: 최종 커밋**

```bash
cd D:/2026_cluade_build/bari-design
git add 2026-04-09-prototype/frontend/src/app/\(dashboard\)/dev
git commit -m "feat: /dev 컴포넌트 쇼케이스 페이지 — Phase 1 완료"
```

---

## Phase 1 완료 기준

| 항목 | 확인 방법 |
|---|---|
| `npm run build` 에러 없음 | 빌드 출력 확인 |
| `npx jest` 7개 PASS | 테스트 출력 확인 |
| `/dev` 페이지에서 9종 컴포넌트 렌더링 | 브라우저 직접 확인 |
| DevTools `:root`에 CSS 토큰 노출 | Elements 탭 확인 |
| MSW `[MSW] Mocking enabled.` 콘솔 메시지 | Console 탭 확인 |

## Phase 2 예고

완료 후 → `docs/barion/plans/component-migration-phase2.md` 생성.

대상: 편성 관리(playlist/schedule/slot), 캠페인, 사용자 관리, 대시보드(billboard.js), 리포트.
