# HTML 프로토타입 → React 전환 Phase 1 설계

**날짜:** 2026-04-09
**범위:** 프로젝트 셋업 + MSW + 레이아웃 + 공통 UI
**산출물 경로:** `2026-04-09-prototype/frontend/`
**다음 단계:** Phase 2 (도메인 페이지 — 별도 계획)

---

## 컨텍스트

`2026-04-08-prototype/`에 35개 HTML/CSS/JS 프로토타입 완성. 화면 디자인(레이아웃, 색상, 컴포넌트 배치) 확정. 이제 동작 방식만 교체한다 — 가짜 데이터 → API, 인라인 JS → React 상태, setTimeout → 실제 이벤트.

---

## 확정 스택

| 분류 | 기술 |
|---|---|
| 언어/프레임워크 | TypeScript (TSX), React, Next.js (App Router) |
| 서버 상태 | @tanstack/react-query |
| 클라이언트 상태 | Jotai |
| 폼 | react-hook-form + @hookform/resolvers |
| 스키마 검증 | zod |
| 차트 | billboard.js |
| 날짜 | date-fns |
| 데이터 유틸 | lodash |
| 실시간 통신 | socket.io-client |
| 접근성 원시 | Radix UI (Dialog, Select, Dropdown) |
| 모킹 | MSW (msw) |
| 스타일링 | CSS Modules + CSS Variables (기존 토큰 유지) |
| 품질 | ESLint, Prettier |

---

## Phase 1 단계

### Step 1 — 프로젝트 셋업

**방식:** `create-next-app` CLI

**선택 옵션:**
- TypeScript: Yes
- ESLint: Yes
- Tailwind: No
- `src/` directory: Yes
- App Router: Yes
- import alias: `@/*`

**패키지 설치:**
```
@tanstack/react-query jotai
zod react-hook-form @hookform/resolvers
date-fns lodash @types/lodash
billboard.js socket.io-client
msw
@radix-ui/react-dialog @radix-ui/react-select @radix-ui/react-dropdown-menu
```

**MSW service worker 초기화 (패키지 설치 후):**
```bash
npx msw init public/
```
→ `public/mockServiceWorker.js` 생성됨. 이 파일은 `.gitignore`에서 제외 (커밋 대상).

**CSS 토큰 이전:**
- `2026-04-08-prototype/shared/style.css` → `src/styles/tokens.css` (내용 그대로)
- `src/styles/globals.css`에서 `@import './tokens.css'`

**주의 사항:**
- Tailwind 미사용. CSS Variables만으로 스타일링.
- `next.config.ts`에서 별도 webpack 설정 불필요.

---

### Step 2 — MSW 셋업

**목적:** 백엔드 없이 프론트엔드 개발. 프로덕션에서는 자동으로 꺼짐.

**구조:**
```
src/mocks/
├── handlers/
│   ├── playlists.ts    # GET /api/playlists
│   ├── schedules.ts    # GET /api/schedules
│   ├── media.ts        # GET /api/media
│   ├── campaigns.ts    # GET /api/campaigns
│   └── users.ts        # GET /api/users
├── fixtures/
│   ├── playlists.json
│   ├── schedules.json
│   ├── media.json
│   ├── campaigns.json
│   └── users.json
└── browser.ts          # MSW 브라우저 설정
```

**더미 데이터 출처:** 각 HTML 파일 내 하드코딩된 배열을 JSON으로 추출.

**핸들러 패턴:**
```ts
// handlers/schedules.ts
import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(schedules)),
]
```

**browser.ts 내용:**
```ts
// src/mocks/browser.ts
import { setupWorker } from 'msw/browser'
import { playlistHandlers } from './handlers/playlists'
import { scheduleHandlers } from './handlers/schedules'
import { mediaHandlers } from './handlers/media'
import { campaignHandlers } from './handlers/campaigns'
import { userHandlers } from './handlers/users'

export const browser = setupWorker(
  ...playlistHandlers,
  ...scheduleHandlers,
  ...mediaHandlers,
  ...campaignHandlers,
  ...userHandlers,
)
```

**MSW 브라우저 초기화 진입점:**
`src/components/MSWProvider.tsx` — `'use client'` 컴포넌트. `useEffect` 내에서 `browser.start()`를 비동기 호출. children은 즉시 렌더링(개발 환경에서 첫 요청이 MSW 초기화 전에 발생하는 것은 허용 — React Query의 자동 재시도로 커버됨).

```tsx
// src/components/MSWProvider.tsx
'use client'
import { useEffect } from 'react'

export function MSWProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      import('../mocks/browser').then(({ browser }) => browser.start({ onUnhandledRequest: 'bypass' }))
    }
  }, [])
  return <>{children}</>
}
```

**활성화 조건:** `process.env.NODE_ENV === 'development'`일 때만 `browser.start()` 실행. 프로덕션 빌드에서는 `MSWProvider`가 아무것도 하지 않음.

---

### Step 3 — 레이아웃

**참조 파일:** `2026-04-08-prototype/dashboard-admin.html`

**컴포넌트:**

| 컴포넌트 | 역할 |
|---|---|
| `AppShell` | 전체 페이지 래퍼. Sidebar + 메인 영역 레이아웃 |
| `Sidebar` | GNB (상단 로고/사용자), LNB (네비게이션 메뉴) |
| `TopBar` | 페이지 타이틀, 알림 아이콘, 빠른 액션 |

**파일 구조:**
```
src/
├── app/
│   ├── layout.tsx               # ReactQueryProvider + MSWProvider + 폰트. 서버 컴포넌트.
│   └── (dashboard)/
│       └── layout.tsx           # AppShell 적용. 서버 컴포넌트.
├── components/
│   ├── MSWProvider.tsx          # 'use client'
│   ├── ReactQueryProvider.tsx   # 'use client' — QueryClientProvider 래퍼
│   └── layout/
│       ├── AppShell.tsx
│       ├── AppShell.module.css
│       ├── Sidebar.tsx
│       ├── Sidebar.module.css
│       ├── TopBar.tsx
│       └── TopBar.module.css
```

**ReactQueryProvider 패턴** (App Router 서버 컴포넌트 제약 우회):
```tsx
// src/components/ReactQueryProvider.tsx
'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState } from 'react'

export function ReactQueryProvider({ children }: { children: React.ReactNode }) {
  const [client] = useState(() => new QueryClient())
  return <QueryClientProvider client={client}>{children}</QueryClientProvider>
}
```
`src/app/layout.tsx`의 `<body>` 안에서 `<ReactQueryProvider><MSWProvider>...</MSWProvider></ReactQueryProvider>` 순서로 감쌈.

**SSR 주의:**
- `socket.io-client`: `'use client'` + 커스텀 훅 `useSocket()` 내에서만 사용
- `billboard.js`: `dynamic(() => import(...), { ssr: false })`로 임포트

**검증:** 구현 후 프로토타입 HTML을 브라우저에서 나란히 열어 레이아웃 비교.

---

### Step 4 — 공통 UI 컴포넌트

**목록 (9종):**

| 컴포넌트 | 기반 | 상태 |
|---|---|---|
| `Button` | 네이티브 `<button>` | default / hover / focus / disabled / loading |
| `Badge` | `<span>` | 색상 variant (status별) |
| `Card` | `<div>` | default / hover |
| `Modal` | Radix Dialog | open / closed |
| `Toast` | Jotai atom + React Portal | success / error / info |
| `Toggle` | 네이티브 `<input type="checkbox">` | on / off / disabled |
| `Table` | `<table>` | 정렬 / 선택 / 빈 상태 |
| `FilterBar` | 복합 | Radix Select + 네이티브 `<input type="search">` 조합. props: `filters: FilterOption[]`, `onFilterChange`, `onSearch` |
| `Pagination` | 네이티브 | 이전/다음/번호 |

**파일 위치:** `src/components/ui/{ComponentName}.tsx` + `.module.css`

**Toast 추가 명세:**
- Jotai atom: `toastsAtom = atom<Toast[]>([])` — `src/stores/toast.ts`
- `useToast()` 훅: `add(message, type)`, `remove(id)` 노출
- `<ToastContainer>`: `'use client'`. `createPortal(content, document.body)`로 `document.body`에 직접 렌더링
- `Toast.tsx`는 개별 토스트 아이템 컴포넌트. `ToastContainer.tsx`가 atom을 구독해 목록 렌더링
- `<ToastContainer />`는 `src/app/layout.tsx`의 `<body>` 안에 선언

**쇼케이스 페이지:** `src/app/(dashboard)/dev/page.tsx`
- AppShell 레이아웃 내에서 렌더링 (`(dashboard)` route group 안)
- 9개 컴포넌트 전체 상태 렌더링
- hover/focus/disabled/error 확인용

---

## 디렉토리 구조 (Phase 1 완료 시)

```
frontend/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   └── (dashboard)/
│   │       ├── layout.tsx
│   │       └── dev/
│   │           └── page.tsx
│   ├── components/
│   │   ├── MSWProvider.tsx
│   │   ├── ReactQueryProvider.tsx
│   │   ├── layout/
│   │   │   ├── AppShell.tsx + .module.css
│   │   │   ├── Sidebar.tsx + .module.css
│   │   │   └── TopBar.tsx + .module.css
│   │   └── ui/
│   │       ├── Button.tsx + .module.css
│   │       ├── Badge.tsx + .module.css
│   │       ├── Card.tsx + .module.css
│   │       ├── Modal.tsx + .module.css
│   │       ├── Toast.tsx + .module.css
│   │       ├── ToastContainer.tsx
│   │       ├── Toggle.tsx + .module.css
│   │       ├── Table.tsx + .module.css
│   │       ├── FilterBar.tsx + .module.css
│   │       └── Pagination.tsx + .module.css
│   ├── stores/
│   │   └── toast.ts              # toastsAtom + useToast 훅
│   ├── mocks/
│   │   ├── handlers/          # 5개 도메인 핸들러
│   │   ├── fixtures/          # JSON 더미 데이터
│   │   └── browser.ts
│   └── styles/
│       ├── tokens.css
│       └── globals.css
├── package.json
├── tsconfig.json
└── next.config.ts
```

---

## 검증 기준

1. **레이아웃:** `tokens.css`의 CSS Variable 값이 React 빌드에서도 DevTools Elements 탭 `:root`에 동일하게 노출되는지 확인. `/dev` URL(`(dashboard)/dev/page.tsx`)에서 AppShell이 렌더링됨.
2. **공통 UI:** `/dev` 페이지에서 9개 컴포넌트 전체 상태 렌더링 확인
3. **MSW:** 브라우저 Network 탭에서 `/api/*` 요청 인터셉트 확인
4. **빌드:** `next build` 에러 없음

---

## Phase 2 예고 (별도 계획)

- 편성 관리 (playlist, schedule, slot-remaining)
- 캠페인
- 사용자 관리
- 대시보드 (billboard.js 차트)
- 리포트
