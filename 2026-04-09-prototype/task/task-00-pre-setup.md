# Task 0: 사전 설치 및 공통 설정

**Files:**
- Install: `@dnd-kit/core @dnd-kit/sortable`
- Create: `src/app/(auth)/layout.tsx`
- Create: `src/mocks/fixtures/materials.json`
- Create: `src/mocks/fixtures/reports.json`
- Create: `src/mocks/fixtures/foot-traffic.json`
- Create: `src/mocks/fixtures/ssp.json`
- Create: `src/mocks/handlers/materials.ts`
- Create: `src/mocks/handlers/reports.ts`
- Modify: `src/mocks/browser.ts`

---

- [ ] **Step 1: @dnd-kit 설치**

```bash
cd D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend
npm install @dnd-kit/core @dnd-kit/sortable
```

Expected: `added 2 packages` (billboard.js는 이미 설치됨)

- [ ] **Step 2: (auth) 레이아웃 생성**

`src/app/(auth)/layout.tsx`:
```tsx
export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--color-neutral-50)' }}>
      {children}
    </div>
  )
}
```

- [ ] **Step 3: materials 픽스처 생성**

`src/mocks/fixtures/materials.json`:
```json
[
  {
    "id": "mat-001",
    "name": "갤럭시 S26 15초",
    "advertiser": "삼성전자",
    "mediaId": "med-001",
    "mediaName": "강남대로 전광판",
    "resolution": "1920x1080",
    "duration": 15,
    "reviewStatus": "approved",
    "scheduleLinked": true,
    "status": "active",
    "createdAt": "2026-03-20T10:00:00"
  },
  {
    "id": "mat-002",
    "name": "오휘 봄 30초",
    "advertiser": "LG생활건강",
    "mediaId": "med-003",
    "mediaName": "신촌역 디스플레이",
    "resolution": "1080x1920",
    "duration": 30,
    "reviewStatus": "pending",
    "scheduleLinked": false,
    "status": "inactive",
    "createdAt": "2026-03-25T14:00:00"
  },
  {
    "id": "mat-003",
    "name": "배민 봄맞이 20초",
    "advertiser": "우아한형제들",
    "mediaId": "med-002",
    "mediaName": "홍대입구 사이니지",
    "resolution": "1920x1080",
    "duration": 20,
    "reviewStatus": "rejected",
    "scheduleLinked": false,
    "status": "inactive",
    "createdAt": "2026-03-28T09:00:00"
  }
]
```

- [ ] **Step 4: reports 픽스처 생성**

`src/mocks/fixtures/reports.json`:
```json
[
  {
    "id": "rep-001",
    "name": "강남권 4월 1주 성과 리포트",
    "type": "performance",
    "period": "2026-04-01 ~ 2026-04-07",
    "createdAt": "2026-04-08T09:00:00",
    "status": "ready"
  },
  {
    "id": "rep-002",
    "name": "삼성 갤럭시 S26 캠페인 리포트",
    "type": "campaign",
    "period": "2026-04-01 ~ 2026-04-30",
    "createdAt": "2026-04-09T11:00:00",
    "status": "generating"
  },
  {
    "id": "rep-003",
    "name": "3월 전체 운영 리포트",
    "type": "operations",
    "period": "2026-03-01 ~ 2026-03-31",
    "createdAt": "2026-04-01T08:00:00",
    "status": "ready"
  }
]
```

- [ ] **Step 5: foot-traffic 픽스처 생성**

`src/mocks/fixtures/foot-traffic.json`:
```json
[
  {
    "id": "ft-001",
    "mediaId": "med-001",
    "mediaName": "강남대로 전광판",
    "dataPointId": "DP-GN-001",
    "lastReceived": "2026-04-09T14:55:00",
    "status": "connected"
  },
  {
    "id": "ft-002",
    "mediaId": "med-002",
    "mediaName": "홍대입구 사이니지",
    "dataPointId": "DP-HD-001",
    "lastReceived": "2026-04-09T14:50:00",
    "status": "connected"
  },
  {
    "id": "ft-003",
    "mediaId": "med-005",
    "mediaName": "강남역 스크린",
    "dataPointId": "DP-GN-002",
    "lastReceived": "2026-04-08T10:00:00",
    "status": "error"
  }
]
```

- [ ] **Step 6: ssp 픽스처 생성**

`src/mocks/fixtures/ssp.json`:
```json
[
  {
    "id": "ssp-001",
    "name": "Google Ad Manager",
    "endpoint": "https://admanager.google.com/api",
    "status": "connected",
    "lastSync": "2026-04-09T14:00:00"
  },
  {
    "id": "ssp-002",
    "name": "Index Exchange",
    "endpoint": "https://api.indexexchange.com",
    "status": "disconnected",
    "lastSync": null
  }
]
```

- [ ] **Step 7: materials 핸들러 생성**

`src/mocks/handlers/materials.ts`:
```ts
import { http, HttpResponse } from 'msw'
import materials from '../fixtures/materials.json'

export const materialHandlers = [
  http.get('/api/materials', () => HttpResponse.json(materials)),
  http.get('/api/materials/:id', ({ params }) => {
    const item = materials.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/materials', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `mat-${Date.now()}`, ...body, createdAt: new Date().toISOString() }
    return HttpResponse.json(newItem, { status: 201 })
  }),
]
```

- [ ] **Step 8: reports 핸들러 생성**

`src/mocks/handlers/reports.ts`:
```ts
import { http, HttpResponse } from 'msw'
import reports from '../fixtures/reports.json'
import footTraffic from '../fixtures/foot-traffic.json'
import ssp from '../fixtures/ssp.json'

export const reportHandlers = [
  http.get('/api/reports', () => HttpResponse.json(reports)),
  http.get('/api/reports/:id', ({ params }) => {
    const item = reports.find((r) => r.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/reports', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `rep-${Date.now()}`, ...body, status: 'generating', createdAt: new Date().toISOString() }
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.get('/api/foot-traffic', () => HttpResponse.json(footTraffic)),
  http.get('/api/ssp', () => HttpResponse.json(ssp)),
]
```

- [ ] **Step 9: browser.ts에 새 핸들러 등록**

`src/mocks/browser.ts` 수정:
```ts
import { setupWorker } from 'msw/browser'
import { scheduleHandlers } from './handlers/schedules'
import { playlistHandlers } from './handlers/playlists'
import { mediaHandlers } from './handlers/media'
import { campaignHandlers } from './handlers/campaigns'
import { userHandlers } from './handlers/users'
import { materialHandlers } from './handlers/materials'
import { reportHandlers } from './handlers/reports'

export const browser = setupWorker(
  ...scheduleHandlers,
  ...playlistHandlers,
  ...mediaHandlers,
  ...campaignHandlers,
  ...userHandlers,
  ...materialHandlers,
  ...reportHandlers,
)
```

- [ ] **Step 10: 개발 서버 기동 확인**

```bash
npm run dev
```

브라우저 Network 탭에서 `/api/materials`, `/api/reports` 요청 → MSW가 인터셉트하는지 확인.

- [ ] **Step 11: 커밋**

```bash
git add src/app/(auth)/layout.tsx src/mocks/
git commit -m "feat: Phase2 사전 설정 — (auth) 레이아웃, MSW 픽스처·핸들러 확장"
```
