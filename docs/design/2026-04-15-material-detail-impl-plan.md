# material-detail 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** `2026-04-15-html-verify`에 Next.js 앱을 스캐폴드하고 material-detail 페이지를 `material-detail.md` spec + `material-detail.html` 원본에 충실하게 구현한다.

**Architecture:** Fresh Next.js App Router app. `providers.tsx`에서 MSW v2 + TanStack Query 초기화. `(dashboard)/materials/[id]/page.tsx`가 데이터를 fetch하고 7개 컴포넌트에 props를 분배한다. CSS Modules + `globals.css` 토큰.

**Tech Stack:** Next.js 16 (latest 16.x), React 19, TypeScript, TanStack Query v5, MSW v2

---

## 파일 구조

| 파일 | 역할 |
|------|------|
| `src/app/globals.css` | CSS 토큰 + 전역 스타일 + .btn 유틸리티 |
| `src/app/layout.tsx` | Root layout (html/body + Providers) |
| `src/app/(dashboard)/layout.tsx` | Dashboard layout (no-op pass-through) |
| `src/app/(dashboard)/materials/[id]/page.tsx` | 페이지 orchestration — fetch + state + layout |
| `src/app/(dashboard)/materials/[id]/page.module.css` | 페이지 레이아웃 CSS |
| `src/app/providers.tsx` | MSW + QueryClientProvider (`'use client'`) |
| `src/types/material.ts` | MaterialDetail 타입 정의 |
| `src/mocks/browser.ts` | MSW worker 설정 |
| `src/mocks/fixtures/material-detail.json` | Mock 데이터 |
| `src/mocks/handlers/materials.ts` | MSW handler |
| `src/components/material-detail/PreviewCard.tsx` | 영상 미리보기 + 파일 메타 + 교체/삭제 버튼 |
| `src/components/material-detail/PreviewCard.module.css` | |
| `src/components/material-detail/MaterialInfoGrid.tsx` | 소재 정보 8-key 그리드 |
| `src/components/material-detail/MaterialInfoGrid.module.css` | |
| `src/components/material-detail/FailPanel.tsx` | 검수 실패 인라인 패널 |
| `src/components/material-detail/FailPanel.module.css` | |
| `src/components/material-detail/ReviewTimeline.tsx` | 검수 타임라인 (FailPanel 포함) |
| `src/components/material-detail/ReviewTimeline.module.css` | |
| `src/components/material-detail/ScheduleTable.tsx` | 편성 연결 테이블 4컬럼 |
| `src/components/material-detail/ScheduleTable.module.css` | |
| `src/components/material-detail/VersionHistory.tsx` | 버전 이력 접기/펼치기 테이블 |
| `src/components/material-detail/VersionHistory.module.css` | |
| `src/components/material-detail/DeleteModal.tsx` | 삭제 확인 모달 |
| `src/components/material-detail/DeleteModal.module.css` | |

---

### Task 1: 프로젝트 스캐폴드 및 의존성 설치

**Files:**
- Create: `2026-04-15-html-verify/` (전체 프로젝트)

- [ ] **Step 1: create-next-app 실행**

```bash
cd "D:/2026_cluade_build/bari-design/2026-04-15-html-verify"
npx create-next-app@16 . --typescript --no-tailwind --src-dir --app --import-alias "@/*" --eslint --yes
```

Expected: Next.js 16 프로젝트 생성 완료

- [ ] **Step 2: 추가 의존성 설치**

```bash
npm install @tanstack/react-query@^5 msw@^2
```

- [ ] **Step 3: MSW 서비스 워커 초기화**

```bash
npx msw init public/ --save
```

Expected: `public/mockServiceWorker.js` 생성됨

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 빌드 성공 (경고는 무시)

- [ ] **Step 5: 커밋**

```bash
git add -A
git commit -m "chore: 2026-04-15-html-verify Next.js 앱 스캐폴드"
```

---

### Task 2: CSS 토큰 및 전역 스타일

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: globals.css 전체 교체**

`src/app/globals.css`를 다음 내용으로 교체한다:

```css
@import url('https://cdn.jsdelivr.net/gh/orioncactus/pretendard/dist/web/static/pretendard.min.css');

/* ── Design Tokens ── */
:root {
  /* Primary (H 155) */
  --color-primary-50:  oklch(0.97 0.03 155);
  --color-primary-100: oklch(0.93 0.06 155);
  --color-primary-500: oklch(0.72 0.19 155);
  --color-primary-600: oklch(0.62 0.17 155);
  --color-primary-700: oklch(0.52 0.14 155);

  /* Neutral (H 80) */
  --color-neutral-50:  oklch(0.98 0.005 80);
  --color-neutral-100: oklch(0.95 0.008 80);
  --color-neutral-200: oklch(0.90 0.01 80);
  --color-neutral-300: oklch(0.82 0.01 80);
  --color-neutral-400: oklch(0.72 0.01 80);
  --color-neutral-500: oklch(0.62 0.01 80);
  --color-neutral-600: oklch(0.55 0.01 80);
  --color-neutral-700: oklch(0.45 0.01 80);
  --color-neutral-800: oklch(0.35 0.01 80);
  --color-neutral-900: oklch(0.20 0.02 80);

  /* Error (H 25) */
  --color-error-50:  oklch(0.97 0.02 25);
  --color-error-500: oklch(0.55 0.24 25);

  /* Warning (H 55) */
  --color-warning-50:  oklch(0.97 0.03 55);
  --color-warning-500: oklch(0.70 0.15 55);
  --color-warning-600: oklch(0.62 0.13 55);

  /* Radius */
  --radius-sm: 4px;
  --radius-md: 6px;
  --radius-lg: 10px;
  --radius-xl: 12px;

  /* Typography */
  --text-xs:   11px;
  --text-sm:   13px;
  --text-base: 14px;
  --text-md:   16px;

  /* Spacing */
  --space-6: 24px;

  /* Shadows */
  --shadow-sm: 0 1px 2px rgba(0,0,0,0.04);
}

/* ── Reset ── */
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { height: 100%; }

body {
  font-family: 'Pretendard', -apple-system, sans-serif;
  font-size: var(--text-base);
  color: var(--color-neutral-900);
  background: var(--color-neutral-50);
  -webkit-font-smoothing: antialiased;
}

a { color: inherit; text-decoration: none; }
button { cursor: pointer; font-family: inherit; font-size: inherit; }

/* ── Button utilities (shared) ── */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 9px 18px;
  font-size: var(--text-sm);
  font-weight: 600;
  letter-spacing: -0.01em;
  border-radius: var(--radius-md);
  border: none;
  cursor: pointer;
  transition: all 0.15s ease;
}
.btn-secondary {
  background: white;
  color: var(--color-neutral-900);
  border: 1px solid rgba(0,0,0,0.12);
  box-shadow: var(--shadow-sm);
}
.btn-secondary:hover { background: var(--color-neutral-50); }
.btn-danger {
  background: white;
  color: var(--color-error-500);
  border: 1px solid rgba(230,35,24,0.25);
}
.btn-danger:hover { background: oklch(0.97 0.02 25); }
```

- [ ] **Step 2: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 3: 커밋**

```bash
git add src/app/globals.css
git commit -m "style: CSS 토큰 및 전역 스타일 설정"
```

---

### Task 3: MSW 설정 (browser, fixture, handler)

**Files:**
- Create: `src/mocks/browser.ts`
- Create: `src/mocks/fixtures/material-detail.json`
- Create: `src/mocks/handlers/materials.ts`

- [ ] **Step 1: fixture JSON 생성**

`src/mocks/fixtures/material-detail.json` 생성:

```json
{
  "id": "mat-001",
  "name": "삼성 갤럭시 S25 런칭 캠페인",
  "advertiser": "삼성전자",
  "media": "강남역 출구 빌보드",
  "resolution": "1920 × 1080 px",
  "duration": "30초",
  "period": "04.01 – 04.30",
  "reviewStatus": "done",
  "scheduleConnected": true,
  "filename": "ad_samsung_s25_v2.mp4",
  "codec": "H.264 / AAC",
  "framerate": "30fps",
  "fileSize": "12.4 MB",
  "timeline": [
    { "label": "업로드 완료", "status": "done", "time": "2026.04.01 14:32" },
    { "label": "자동 검수", "status": "done", "time": "2026.04.01 14:32 → 14:35", "elapsed": "3분 소요" },
    { "label": "검수 완료", "status": "done", "time": "2026.04.01 14:35" }
  ],
  "schedules": [
    { "mediaName": "강남역 출구 빌보드", "scheduleName": "4월 1주차 편성표", "status": "on", "period": "04.01 – 04.07" },
    { "mediaName": "강남역 출구 빌보드", "scheduleName": "4월 광고 편성", "status": "wait", "period": "04.08 – 04.30" }
  ],
  "versions": [
    { "version": 2, "isCurrent": true, "filename": "ad_samsung_s25_v2.mp4", "replacedAt": "04.03", "reviewResult": "done" },
    { "version": 1, "isCurrent": false, "filename": "ad_samsung_s25_v1.mp4", "replacedAt": "04.01", "reviewResult": "done" }
  ]
}
```

- [ ] **Step 2: MSW handler 생성**

`src/mocks/handlers/materials.ts` 생성:

```typescript
import { http, HttpResponse } from 'msw'
import fixture from '../fixtures/material-detail.json'

export const materialHandlers = [
  http.get('/api/materials/:id', () => {
    return HttpResponse.json(fixture)
  }),
]
```

- [ ] **Step 3: MSW browser worker 생성**

`src/mocks/browser.ts` 생성:

```typescript
import { setupWorker } from 'msw/browser'
import { materialHandlers } from './handlers/materials'

export const worker = setupWorker(...materialHandlers)
```

- [ ] **Step 4: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 5: 커밋**

```bash
git add src/mocks/
git commit -m "feat: MSW mock 설정 (fixture, handler, browser worker)"
```

---

### Task 4: 타입 정의 + Providers + 레이아웃

**Files:**
- Create: `src/types/material.ts`
- Create: `src/app/providers.tsx`
- Modify: `src/app/layout.tsx`
- Create: `src/app/(dashboard)/layout.tsx`

- [ ] **Step 1: 타입 정의 생성**

`src/types/material.ts` 생성:

```typescript
export type ReviewStatus = 'done' | 'reviewing' | 'failed' | 'manual' | 'on-air' | 'waiting'
export type ScheduleStatus = 'on' | 'wait'
export type TimelineNodeStatus = 'done' | 'failed' | 'current' | 'waiting' | 'pending'

export interface TimelineStep {
  label: string
  status: TimelineNodeStatus
  time?: string
  elapsed?: string
}

export interface ScheduleEntry {
  mediaName: string
  scheduleName: string
  status: ScheduleStatus
  period: string
}

export interface VersionEntry {
  version: number
  isCurrent: boolean
  filename: string
  replacedAt: string
  reviewResult: ReviewStatus
}

export interface MaterialDetail {
  id: string
  name: string
  advertiser: string
  media: string
  resolution: string
  duration: string
  period: string
  reviewStatus: ReviewStatus
  scheduleConnected: boolean
  filename: string
  codec: string
  framerate: string
  fileSize: string
  timeline: TimelineStep[]
  schedules: ScheduleEntry[]
  versions: VersionEntry[]
  failReason?: string
  fixGuide?: string
}
```

- [ ] **Step 2: providers.tsx 생성**

`src/app/providers.tsx` 생성:

```typescript
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useEffect, useState } from 'react'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, staleTime: 30_000 } },
})

export function Providers({ children }: { children: React.ReactNode }) {
  const [ready, setReady] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    import('../mocks/browser').then(({ worker }) =>
      worker.start({ onUnhandledRequest: 'bypass' })
    ).finally(() => setReady(true))
  }, [])

  if (!ready) return null

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

- [ ] **Step 3: root layout 수정**

`src/app/layout.tsx`를 다음으로 교체:

```typescript
import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = { title: 'Bari CMS — material-detail 검증' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko">
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
```

- [ ] **Step 4: dashboard layout 생성**

`src/app/(dashboard)/layout.tsx` 생성:

```typescript
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}
```

- [ ] **Step 5: root page.tsx를 materials/1로 리디렉트**

`src/app/page.tsx`를 다음으로 교체 (개발 편의용):

```typescript
import { redirect } from 'next/navigation'

export default function Home() {
  redirect('/materials/mat-001')
}
```

- [ ] **Step 6: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 7: 커밋**

```bash
git add src/types/ src/app/providers.tsx src/app/layout.tsx src/app/(dashboard)/layout.tsx src/app/page.tsx
git commit -m "feat: 타입 정의, Providers, 레이아웃 설정"
```

---

### Task 5: FailPanel 컴포넌트

**Files:**
- Create: `src/components/material-detail/FailPanel.tsx`
- Create: `src/components/material-detail/FailPanel.module.css`

- [ ] **Step 1: FailPanel CSS 생성**

`src/components/material-detail/FailPanel.module.css` 생성:

```css
.panel {
  margin-top: 8px;
  padding: 14px 16px;
  background: var(--color-error-50);
  border: 1px solid oklch(0.88 0.05 25);
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.reasonLabel {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-error-500);
}
.reasonText {
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  line-height: 1.5;
}
.guideLabel {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-neutral-700);
  margin-top: 4px;
}
.guideText {
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  line-height: 1.5;
}
.actions {
  display: flex;
  gap: 8px;
}
.btnCopy {
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(0,0,0,0.12);
  background: white;
  color: var(--color-neutral-700);
  cursor: pointer;
  transition: background 0.1s;
  display: flex;
  align-items: center;
  gap: 5px;
}
.btnCopy:hover { background: var(--color-neutral-50); }
.btnReupload {
  padding: 6px 12px;
  font-size: var(--text-xs);
  font-weight: 600;
  border-radius: var(--radius-sm);
  border: none;
  background: var(--color-error-500);
  color: white;
  cursor: pointer;
  transition: filter 0.1s;
}
.btnReupload:hover { filter: brightness(1.08); }
```

- [ ] **Step 2: FailPanel 컴포넌트 생성**

`src/components/material-detail/FailPanel.tsx` 생성:

```tsx
'use client'
import styles from './FailPanel.module.css'

interface Props {
  failReason: string
  fixGuide: string
}

export function FailPanel({ failReason, fixGuide }: Props) {
  const handleCopy = () => {
    navigator.clipboard.writeText(fixGuide)
  }

  return (
    <div className={styles.panel} role="alert">
      <div>
        <div className={styles.reasonLabel}>실패 사유</div>
        <div className={styles.reasonText}>{failReason}</div>
      </div>
      <div>
        <div className={styles.guideLabel}>수정 가이드</div>
        <div className={styles.guideText}>{fixGuide}</div>
      </div>
      <div className={styles.actions}>
        <button className={styles.btnCopy} onClick={handleCopy}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <rect x="9" y="9" width="13" height="13" rx="2"/>
            <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"/>
          </svg>
          수정 가이드 복사
        </button>
        <button className={styles.btnReupload}>재업로드</button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/FailPanel.tsx src/components/material-detail/FailPanel.module.css
git commit -m "feat(material-detail): FailPanel 컴포넌트 구현"
```

---

### Task 6: ReviewTimeline 컴포넌트

**Files:**
- Create: `src/components/material-detail/ReviewTimeline.tsx`
- Create: `src/components/material-detail/ReviewTimeline.module.css`

- [ ] **Step 1: ReviewTimeline CSS 생성**

`src/components/material-detail/ReviewTimeline.module.css` 생성:

```css
.sectionTitle {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.timeline {
  position: relative;
  padding-left: 24px;
}
.timelineLine {
  position: absolute;
  left: 7px;
  top: 8px;
  bottom: 8px;
  width: 2px;
  background: rgba(0,0,0,0.08);
  border-radius: 1px;
}
.step {
  position: relative;
}
.step + .step {
  margin-top: 4px;
}
.node {
  position: absolute;
  left: -24px;
  top: 3px;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  z-index: 1;
}
.nodeDone { background: var(--color-primary-500); }
.nodeFailed { background: var(--color-error-500); }
.nodeCurrent { background: white; border: 2px solid oklch(0.55 0.15 220); }
.nodeWaiting { background: white; border: 2px solid var(--color-warning-500); }
.nodePending { background: white; border: 2px solid rgba(0,0,0,0.15); }
.content {
  padding: 2px 0 10px 4px;
}
.label {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-900);
  display: flex;
  align-items: center;
  gap: 8px;
}
.labelFailed { color: var(--color-error-500); }
.labelFaded { color: var(--color-neutral-400); font-weight: 400; }
.time {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  margin-top: 2px;
}
.elapsed {
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
  font-weight: 400;
}

@keyframes spin { to { transform: rotate(360deg); } }
.spinner {
  width: 10px;
  height: 10px;
  border: 1.5px solid oklch(0.75 0.12 220);
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}
```

- [ ] **Step 2: ReviewTimeline 컴포넌트 생성**

`src/components/material-detail/ReviewTimeline.tsx` 생성:

```tsx
import { TimelineStep, ReviewStatus } from '@/types/material'
import { FailPanel } from './FailPanel'
import styles from './ReviewTimeline.module.css'

interface Props {
  timeline: TimelineStep[]
  reviewStatus: ReviewStatus
  failReason?: string
  fixGuide?: string
}

function TimelineNode({ status }: { status: TimelineStep['status'] }) {
  const nodeClass = {
    done: styles.nodeDone,
    failed: styles.nodeFailed,
    current: styles.nodeCurrent,
    waiting: styles.nodeWaiting,
    pending: styles.nodePending,
  }[status]

  return (
    <div className={`${styles.node} ${nodeClass}`} aria-hidden="true">
      {status === 'done' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <polyline points="20 6 9 17 4 12"/>
        </svg>
      )}
      {status === 'failed' && (
        <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round">
          <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      )}
      {status === 'current' && <div className={styles.spinner}/>}
    </div>
  )
}

export function ReviewTimeline({ timeline, reviewStatus, failReason, fixGuide }: Props) {
  return (
    <div>
      <div className={styles.sectionTitle}>검수 타임라인</div>
      <div className={styles.timeline} role="list" aria-label="검수 진행 타임라인">
        <div className={styles.timelineLine} aria-hidden="true"/>
        {timeline.map((step, i) => (
          <div key={i} className={styles.step} role="listitem">
            <TimelineNode status={step.status}/>
            <div className={styles.content}>
              <div className={`${styles.label} ${step.status === 'failed' ? styles.labelFailed : ''} ${step.status === 'pending' || step.status === 'waiting' ? styles.labelFaded : ''}`}>
                {step.label}
                {step.elapsed && <span className={styles.elapsed}>({step.elapsed})</span>}
              </div>
              {step.time && <div className={styles.time}>{step.time}</div>}
              {step.status === 'failed' && failReason && fixGuide && (
                <FailPanel failReason={failReason} fixGuide={fixGuide}/>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/ReviewTimeline.tsx src/components/material-detail/ReviewTimeline.module.css
git commit -m "feat(material-detail): ReviewTimeline 컴포넌트 구현 (5종 노드 + FailPanel)"
```

---

### Task 7: MaterialInfoGrid 컴포넌트

**Files:**
- Create: `src/components/material-detail/MaterialInfoGrid.tsx`
- Create: `src/components/material-detail/MaterialInfoGrid.module.css`

- [ ] **Step 1: MaterialInfoGrid CSS 생성**

`src/components/material-detail/MaterialInfoGrid.module.css` 생성:

```css
.sectionTitle {
  font-size: var(--text-xs);
  font-weight: 700;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 10px;
}
.grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}
.item {}
.label {
  font-size: 11px;
  color: var(--color-neutral-400);
  font-weight: 500;
  margin-bottom: 3px;
}
.value {
  font-size: var(--text-sm);
  color: var(--color-neutral-900);
  font-weight: 600;
}
.mono { font-family: monospace; letter-spacing: 0.02em; }

/* 배지 */
.badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}
.badgeDone      { background: var(--color-primary-50); color: var(--color-primary-700); border: 1px solid oklch(0.87 0.10 155); }
.badgeReviewing { background: oklch(0.95 0.03 220); color: oklch(0.40 0.12 220); border: 1px solid oklch(0.85 0.06 220); }
.badgeFailed    { background: var(--color-error-50); color: var(--color-error-500); border: 1px solid oklch(0.88 0.05 25); }
.badgeManual    { background: var(--color-warning-50); color: var(--color-warning-600); border: 1px solid oklch(0.88 0.08 55); }
.badgeOnAir     { background: var(--color-primary-50); color: var(--color-primary-600); border: 1px solid oklch(0.87 0.10 155); font-weight: 700; }
.badgeWaiting   { background: var(--color-neutral-100); color: var(--color-neutral-600); border: 1px solid rgba(0,0,0,0.08); }
.badgeScheduleOn   { background: var(--color-primary-50); color: var(--color-primary-700); border: 1px solid oklch(0.87 0.10 155); }
.badgeScheduleWait { background: var(--color-neutral-100); color: var(--color-neutral-600); border: 1px solid rgba(0,0,0,0.08); }
```

- [ ] **Step 2: MaterialInfoGrid 컴포넌트 생성**

`src/components/material-detail/MaterialInfoGrid.tsx` 생성:

```tsx
import { MaterialDetail, ReviewStatus, ScheduleStatus } from '@/types/material'
import styles from './MaterialInfoGrid.module.css'

const REVIEW_BADGE_CLASS: Record<ReviewStatus, string> = {
  'done':      styles.badgeDone,
  'reviewing': styles.badgeReviewing,
  'failed':    styles.badgeFailed,
  'manual':    styles.badgeManual,
  'on-air':    styles.badgeOnAir,
  'waiting':   styles.badgeWaiting,
}

const REVIEW_LABEL: Record<ReviewStatus, string> = {
  'done': '검수완료', 'reviewing': '검수중', 'failed': '검수실패',
  'manual': '수동승인', 'on-air': '송출중', 'waiting': '대기중',
}

const SCHEDULE_BADGE_CLASS: Record<ScheduleStatus, string> = {
  'on': styles.badgeScheduleOn,
  'wait': styles.badgeScheduleWait,
}

const SCHEDULE_LABEL: Record<ScheduleStatus, string> = { 'on': '송출중', 'wait': '편성대기' }

interface Props {
  material: Pick<MaterialDetail, 'name' | 'advertiser' | 'media' | 'resolution' | 'duration' | 'period' | 'reviewStatus' | 'scheduleConnected'>
}

export function MaterialInfoGrid({ material }: Props) {
  const scheduleStatus: ScheduleStatus = material.scheduleConnected ? 'on' : 'wait'

  return (
    <div>
      <div className={styles.sectionTitle}>소재 정보</div>
      <div className={styles.grid}>
        <div className={styles.item}>
          <div className={styles.label}>소재명</div>
          <div className={styles.value}>{material.name}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>광고주</div>
          <div className={styles.value}>{material.advertiser}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>매체</div>
          <div className={styles.value}>{material.media}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>해상도</div>
          <div className={`${styles.value} ${styles.mono}`}>{material.resolution}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>재생 시간</div>
          <div className={styles.value}>{material.duration}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>운영 기간</div>
          <div className={styles.value}>{material.period}</div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>검수 상태</div>
          <div className={styles.value}>
            <span className={`${styles.badge} ${REVIEW_BADGE_CLASS[material.reviewStatus]}`} role="status">
              {material.reviewStatus === 'done' && (
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
              {REVIEW_LABEL[material.reviewStatus]}
            </span>
          </div>
        </div>
        <div className={styles.item}>
          <div className={styles.label}>편성 연결</div>
          <div className={styles.value}>
            <span className={`${styles.badge} ${SCHEDULE_BADGE_CLASS[scheduleStatus]}`} role="status">
              {SCHEDULE_LABEL[scheduleStatus]}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/MaterialInfoGrid.tsx src/components/material-detail/MaterialInfoGrid.module.css
git commit -m "feat(material-detail): MaterialInfoGrid 컴포넌트 구현 (8-key 그리드 + 배지)"
```

---

### Task 8: PreviewCard 컴포넌트

**Files:**
- Create: `src/components/material-detail/PreviewCard.tsx`
- Create: `src/components/material-detail/PreviewCard.module.css`

- [ ] **Step 1: PreviewCard CSS 생성**

`src/components/material-detail/PreviewCard.module.css` 생성:

```css
.card {
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.videoArea {
  width: 100%;
  aspect-ratio: 16/9;
  background: oklch(0.12 0.015 80);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  cursor: pointer;
}
.playBtn {
  width: 52px;
  height: 52px;
  background: rgba(255,255,255,0.15);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.15s;
  border: none;
}
.videoArea:hover .playBtn { background: rgba(255,255,255,0.25); }
.duration {
  position: absolute;
  bottom: 10px;
  right: 10px;
  background: rgba(0,0,0,0.6);
  color: white;
  font-size: 11px;
  font-weight: 600;
  padding: 2px 7px;
  border-radius: 4px;
}
.metaList {
  padding: 16px 20px;
  display: flex;
  flex-direction: column;
}
.metaRow {
  display: flex;
  align-items: center;
  padding: 7px 0;
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.metaRow:last-child { border-bottom: none; }
.metaKey {
  width: 100px;
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  font-weight: 500;
  flex-shrink: 0;
}
.metaVal {
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  font-weight: 500;
}
.mono { font-family: monospace; }
.actions {
  padding: 12px 20px;
  border-top: 1px solid rgba(0,0,0,0.05);
  display: flex;
  gap: 8px;
}
```

- [ ] **Step 2: PreviewCard 컴포넌트 생성**

`src/components/material-detail/PreviewCard.tsx` 생성:

```tsx
import { MaterialDetail } from '@/types/material'
import styles from './PreviewCard.module.css'

interface Props {
  material: Pick<MaterialDetail, 'name' | 'filename' | 'codec' | 'framerate' | 'fileSize' | 'duration'>
  onDelete: () => void
}

export function PreviewCard({ material, onDelete }: Props) {
  return (
    <div className={styles.card}>
      <div
        className={styles.videoArea}
        role="img"
        aria-label={`${material.name} 소재 미리보기 (16:9)`}
      >
        <button className={styles.playBtn} aria-hidden="true">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
            <polygon points="5 3 19 12 5 21 5 3"/>
          </svg>
        </button>
        <div className={styles.duration} aria-hidden="true">{material.duration}</div>
      </div>

      <div className={styles.metaList}>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>파일명</span>
          <span className={`${styles.metaVal} ${styles.mono}`}>{material.filename}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>코덱</span>
          <span className={styles.metaVal}>{material.codec}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>프레임레이트</span>
          <span className={styles.metaVal}>{material.framerate}</span>
        </div>
        <div className={styles.metaRow}>
          <span className={styles.metaKey}>파일 크기</span>
          <span className={styles.metaVal}>{material.fileSize}</span>
        </div>
      </div>

      <div className={styles.actions}>
        <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <path d="M21 2v6h-6"/><path d="M3 12a9 9 0 0115-6.7L21 8"/>
            <path d="M3 22v-6h6"/><path d="M21 12a9 9 0 01-15 6.7L3 16"/>
          </svg>
          교체
        </button>
        <button className="btn btn-danger" style={{ fontSize: 'var(--text-xs)', padding: '6px 12px' }} onClick={onDelete}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"/>
            <path d="M10 11v6M14 11v6"/>
          </svg>
          삭제
        </button>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/PreviewCard.tsx src/components/material-detail/PreviewCard.module.css
git commit -m "feat(material-detail): PreviewCard 컴포넌트 구현"
```

---

### Task 9: DeleteModal 컴포넌트

**Files:**
- Create: `src/components/material-detail/DeleteModal.tsx`
- Create: `src/components/material-detail/DeleteModal.module.css`

- [ ] **Step 1: DeleteModal CSS 생성**

`src/components/material-detail/DeleteModal.module.css` 생성:

```css
.backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.3);
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
  z-index: 200;
  display: flex;
  align-items: center;
  justify-content: center;
}
.backdropOpen {
  opacity: 1;
  pointer-events: auto;
}
.modal {
  background: white;
  border-radius: var(--radius-xl);
  padding: 24px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 8px 40px rgba(0,0,0,0.15);
  transform: scale(0.96);
  transition: transform 0.15s cubic-bezier(0.16,1,0.3,1);
}
.backdropOpen .modal {
  transform: scale(1);
}
.title {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-neutral-900);
  margin-bottom: 10px;
}
.body {
  font-size: var(--text-sm);
  color: var(--color-neutral-700);
  line-height: 1.6;
  margin-bottom: 20px;
}
.body strong { color: var(--color-error-500); }
.actions {
  display: flex;
  gap: 8px;
  justify-content: flex-end;
}
.btnDestructive {
  padding: 8px 18px;
  font-size: var(--text-sm);
  font-weight: 600;
  border-radius: var(--radius-md);
  border: none;
  background: var(--color-error-500);
  color: white;
  cursor: pointer;
  transition: filter 0.1s;
}
.btnDestructive:hover { filter: brightness(1.08); }
```

- [ ] **Step 2: DeleteModal 컴포넌트 생성**

`src/components/material-detail/DeleteModal.tsx` 생성:

```tsx
'use client'
import { useEffect, useRef } from 'react'
import styles from './DeleteModal.module.css'

interface Props {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteModal({ isOpen, onClose, onConfirm }: Props) {
  const confirmRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!isOpen) return
    confirmRef.current?.focus()

    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', handleEsc)
    return () => document.removeEventListener('keydown', handleEsc)
  }, [isOpen, onClose])

  return (
    <div
      className={`${styles.backdrop} ${isOpen ? styles.backdropOpen : ''}`}
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className={styles.modal}>
        <div className={styles.title} id="delete-modal-title">소재 삭제</div>
        <div className={styles.body}>
          이 소재를 삭제하시겠습니까?<br/><br/>
          <strong>재생목록 2건에서 해당 구좌가 '삭제됨'으로 표시됩니다.</strong><br/>
          삭제된 소재는 복구할 수 없습니다.
        </div>
        <div className={styles.actions}>
          <button className="btn btn-secondary" onClick={onClose}>취소</button>
          <button
            className={styles.btnDestructive}
            ref={confirmRef}
            onClick={onConfirm}
          >
            삭제
          </button>
        </div>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/DeleteModal.tsx src/components/material-detail/DeleteModal.module.css
git commit -m "feat(material-detail): DeleteModal 컴포넌트 구현 (ESC/배경클릭 닫힘 + 포커스)"
```

---

### Task 10: ScheduleTable 컴포넌트

**Files:**
- Create: `src/components/material-detail/ScheduleTable.tsx`
- Create: `src/components/material-detail/ScheduleTable.module.css`

- [ ] **Step 1: ScheduleTable CSS 생성**

`src/components/material-detail/ScheduleTable.module.css` 생성:

```css
.card {
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  border-bottom: 1px solid rgba(0,0,0,0.05);
}
.title {
  font-size: var(--text-md);
  font-weight: 700;
  color: var(--color-neutral-900);
}
.count {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
}
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  padding: 9px 16px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-neutral-500);
  text-align: left;
  background: var(--color-neutral-50);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.table td {
  padding: 11px 16px;
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.table tr:last-child td { border-bottom: none; }
.link {
  color: var(--color-primary-600);
  font-weight: 600;
  text-decoration: none;
}
.link:hover { text-decoration: underline; }
.periodCell {
  font-size: var(--text-xs);
  color: var(--color-neutral-600);
}
.badgeScheduleOn {
  background: var(--color-primary-50);
  color: var(--color-primary-700);
  border: 1px solid oklch(0.87 0.10 155);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 600;
}
.badgeScheduleWait {
  background: var(--color-neutral-100);
  color: var(--color-neutral-600);
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: var(--radius-sm);
  font-size: var(--text-xs);
  font-weight: 500;
}
```

- [ ] **Step 2: ScheduleTable 컴포넌트 생성**

`src/components/material-detail/ScheduleTable.tsx` 생성:

```tsx
import { ScheduleEntry } from '@/types/material'
import styles from './ScheduleTable.module.css'

interface Props {
  schedules: ScheduleEntry[]
}

export function ScheduleTable({ schedules }: Props) {
  return (
    <div>
      <div className={styles.header}>
        <h2 className={styles.title}>편성 연결 정보</h2>
        <span className={styles.count}>{schedules.length}건</span>
      </div>
      <table className={styles.table} aria-label="편성 연결 정보">
        <thead>
          <tr>
            <th scope="col">매체명</th>
            <th scope="col">편성표명</th>
            <th scope="col">편성 상태</th>
            <th scope="col">기간</th>
          </tr>
        </thead>
        <tbody>
          {schedules.map((s, i) => (
            <tr key={i}>
              <td>{s.mediaName}</td>
              <td>
                <a href="#" className={styles.link}>{s.scheduleName}</a>
              </td>
              <td>
                {s.status === 'on' ? (
                  <span className={styles.badgeScheduleOn} role="status">
                    <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                      <circle cx="12" cy="12" r="2"/>
                      <path d="M16.24 7.76a6 6 0 010 8.49M7.76 16.24a6 6 0 010-8.49"/>
                    </svg>
                    송출중
                  </span>
                ) : (
                  <span className={styles.badgeScheduleWait} role="status">편성대기</span>
                )}
              </td>
              <td className={styles.periodCell}>{s.period}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/ScheduleTable.tsx src/components/material-detail/ScheduleTable.module.css
git commit -m "feat(material-detail): ScheduleTable 컴포넌트 구현 (4컬럼 + 배지)"
```

---

### Task 11: VersionHistory 컴포넌트

**Files:**
- Create: `src/components/material-detail/VersionHistory.tsx`
- Create: `src/components/material-detail/VersionHistory.module.css`

- [ ] **Step 1: VersionHistory CSS 생성**

`src/components/material-detail/VersionHistory.module.css` 생성:

```css
.toggle {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  cursor: pointer;
  border-top: 1px solid rgba(0,0,0,0.05);
  background: none;
  width: 100%;
  text-align: left;
  border-left: none;
  border-right: none;
  border-bottom: none;
}
.toggle:hover { background: var(--color-neutral-50); }
.toggleLabel {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-neutral-700);
  display: flex;
  align-items: center;
  gap: 6px;
}
.versionCount {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  font-weight: 400;
}
.chevron {
  transition: transform 0.2s cubic-bezier(0.16,1,0.3,1);
  color: var(--color-neutral-400);
}
.chevronOpen { transform: rotate(180deg); }
.body {
  overflow: hidden;
  display: grid;
  grid-template-rows: 0fr;
  transition: grid-template-rows 0.2s cubic-bezier(0.16,1,0.3,1);
}
.bodyOpen { grid-template-rows: 1fr; }
.bodyInner { overflow: hidden; }
.table {
  width: 100%;
  border-collapse: collapse;
}
.table th {
  padding: 9px 16px;
  font-size: var(--text-xs);
  font-weight: 600;
  color: var(--color-neutral-500);
  text-align: left;
  background: var(--color-neutral-50);
  border-bottom: 1px solid rgba(0,0,0,0.06);
}
.table td {
  padding: 11px 16px;
  font-size: var(--text-sm);
  color: var(--color-neutral-800);
  border-bottom: 1px solid rgba(0,0,0,0.04);
}
.table tr:last-child td { border-bottom: none; }
.current { font-size: 10px; color: var(--color-neutral-400); font-weight: 400; }
.mono { font-family: monospace; font-size: var(--text-xs); }
.dateCell { font-size: var(--text-xs); color: var(--color-neutral-500); }
.badge {
  display: inline-flex;
  align-items: center;
  padding: 2px 7px;
  border-radius: var(--radius-sm);
  font-size: 10px;
  font-weight: 600;
}
.badgeDone      { background: var(--color-primary-50); color: var(--color-primary-700); border: 1px solid oklch(0.87 0.10 155); }
.badgeReviewing { background: oklch(0.95 0.03 220); color: oklch(0.40 0.12 220); border: 1px solid oklch(0.85 0.06 220); }
.badgeFailed    { background: var(--color-error-50); color: var(--color-error-500); border: 1px solid oklch(0.88 0.05 25); }
.badgeManual    { background: var(--color-warning-50); color: var(--color-warning-600); border: 1px solid oklch(0.88 0.08 55); }
.badgeOnAir     { background: var(--color-primary-50); color: var(--color-primary-600); border: 1px solid oklch(0.87 0.10 155); font-weight: 700; }
.badgeWaiting   { background: var(--color-neutral-100); color: var(--color-neutral-600); border: 1px solid rgba(0,0,0,0.08); }
```

- [ ] **Step 2: VersionHistory 컴포넌트 생성**

`src/components/material-detail/VersionHistory.tsx` 생성:

```tsx
'use client'
import { useState } from 'react'
import { VersionEntry, ReviewStatus } from '@/types/material'
import styles from './VersionHistory.module.css'

const BADGE_CLASS: Record<ReviewStatus, string> = {
  'done':      styles.badgeDone,
  'reviewing': styles.badgeReviewing,
  'failed':    styles.badgeFailed,
  'manual':    styles.badgeManual,
  'on-air':    styles.badgeOnAir,
  'waiting':   styles.badgeWaiting,
}

const REVIEW_LABEL: Record<ReviewStatus, string> = {
  'done': '검수완료', 'reviewing': '검수중', 'failed': '검수실패',
  'manual': '수동승인', 'on-air': '송출중', 'waiting': '대기중',
}

interface Props {
  versions: VersionEntry[]
}

export function VersionHistory({ versions }: Props) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <button
        className={styles.toggle}
        onClick={() => setIsOpen(v => !v)}
        aria-expanded={isOpen}
        aria-controls="version-history-body"
      >
        <span className={styles.toggleLabel}>
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
            <polyline points="1 4 1 10 7 10"/>
            <path d="M3.51 15a9 9 0 102.13-9.36L1 10"/>
          </svg>
          버전 이력
          <span className={styles.versionCount}>({versions.length}버전)</span>
        </span>
        <svg
          className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
          width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"
          aria-hidden="true"
        >
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      <div
        className={`${styles.body} ${isOpen ? styles.bodyOpen : ''}`}
        id="version-history-body"
      >
        <div className={styles.bodyInner}>
          <table className={styles.table} aria-label="버전 이력">
            <thead>
              <tr>
                <th scope="col">버전</th>
                <th scope="col">파일명</th>
                <th scope="col">교체일</th>
                <th scope="col">검수 결과</th>
                <th scope="col"></th>
              </tr>
            </thead>
            <tbody>
              {versions.map((v) => (
                <tr key={v.version}>
                  <td>
                    <strong>v{v.version}</strong>
                    {v.isCurrent && <span className={styles.current}> (현재)</span>}
                  </td>
                  <td className={styles.mono}>{v.filename}</td>
                  <td className={styles.dateCell}>{v.replacedAt}</td>
                  <td>
                    <span className={`${styles.badge} ${BADGE_CLASS[v.reviewResult]}`}>
                      {REVIEW_LABEL[v.reviewResult]}
                    </span>
                  </td>
                  <td>
                    {v.isCurrent ? (
                      <span>—</span>
                    ) : (
                      <button className="btn btn-secondary" style={{ fontSize: '11px', padding: '3px 10px' }}>
                        되돌리기
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 커밋**

```bash
git add src/components/material-detail/VersionHistory.tsx src/components/material-detail/VersionHistory.module.css
git commit -m "feat(material-detail): VersionHistory 컴포넌트 구현 (접기/펼치기 + 5컬럼)"
```

---

### Task 12: page.tsx — 페이지 orchestration

**Files:**
- Create: `src/app/(dashboard)/materials/[id]/page.tsx`
- Create: `src/app/(dashboard)/materials/[id]/page.module.css`

- [ ] **Step 1: page.module.css 생성**

`src/app/(dashboard)/materials/[id]/page.module.css` 생성:

```css
.page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

/* GNB */
.gnb {
  height: 52px;
  flex-shrink: 0;
  background: white;
  border-bottom: 1px solid rgba(0,0,0,0.06);
  display: flex;
  align-items: center;
  padding: 0 24px;
  gap: 12px;
}
.breadcrumb {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: var(--text-sm);
  color: var(--color-neutral-400);
}
.breadcrumb a { color: inherit; text-decoration: none; }
.breadcrumb a:hover { color: var(--color-neutral-700); }
.breadcrumbSep { font-size: 10px; color: var(--color-neutral-300); }
.breadcrumbCurrent {
  color: var(--color-neutral-900);
  font-weight: 600;
  max-width: 240px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.gnbRight {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  flex-shrink: 0;
}
.gnbDate { font-size: var(--text-xs); color: var(--color-neutral-400); }

/* Content */
.content {
  flex: 1;
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* 2-column top section */
.detailTop {
  display: grid;
  grid-template-columns: 5fr 7fr;
  gap: 20px;
  align-items: start;
}

/* Right meta card */
.metaCard {
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

/* Bottom section card */
.sectionCard {
  background: white;
  border: 1px solid rgba(0,0,0,0.06);
  border-radius: var(--radius-lg);
  box-shadow: var(--shadow-sm);
  overflow: hidden;
}
```

- [ ] **Step 2: page.tsx 생성**

`src/app/(dashboard)/materials/[id]/page.tsx` 생성:

```tsx
'use client'
import { use, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { MaterialDetail } from '@/types/material'
import { PreviewCard } from '@/components/material-detail/PreviewCard'
import { MaterialInfoGrid } from '@/components/material-detail/MaterialInfoGrid'
import { ReviewTimeline } from '@/components/material-detail/ReviewTimeline'
import { ScheduleTable } from '@/components/material-detail/ScheduleTable'
import { VersionHistory } from '@/components/material-detail/VersionHistory'
import { DeleteModal } from '@/components/material-detail/DeleteModal'
import styles from './page.module.css'

async function fetchMaterial(id: string): Promise<MaterialDetail> {
  const res = await fetch(`/api/materials/${id}`)
  if (!res.ok) throw new Error('Not found')
  return res.json()
}

export default function MaterialDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const { data, isLoading } = useQuery({
    queryKey: ['material', id],
    queryFn: () => fetchMaterial(id),
  })
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (isLoading) return <div className={styles.page}><div className={styles.content}>로딩 중...</div></div>
  if (!data) return <div className={styles.page}><div className={styles.content}>소재를 찾을 수 없습니다.</div></div>

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="브레드크럼">
          <a href="/materials">소재 관리</a>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>{data.name}</span>
        </nav>
        <div className={styles.gnbRight}>
          <span className={styles.gnbDate}>2026.04.09</span>
        </div>
      </header>

      <main className={styles.content}>
        {/* Top: 2-column */}
        <div className={styles.detailTop}>
          <PreviewCard material={data} onDelete={() => setIsDeleteOpen(true)}/>

          <div className={styles.metaCard}>
            <MaterialInfoGrid material={data}/>
            <ReviewTimeline
              timeline={data.timeline}
              reviewStatus={data.reviewStatus}
              failReason={data.failReason}
              fixGuide={data.fixGuide}
            />
          </div>
        </div>

        {/* Bottom: schedule + version */}
        <section className={styles.sectionCard} aria-labelledby="sched-title">
          <ScheduleTable schedules={data.schedules}/>
          <VersionHistory versions={data.versions}/>
        </section>
      </main>

      <DeleteModal
        isOpen={isDeleteOpen}
        onClose={() => setIsDeleteOpen(false)}
        onConfirm={() => setIsDeleteOpen(false)}
      />
    </div>
  )
}
```

- [ ] **Step 3: 빌드 확인**

```bash
npm run build
```

Expected: 성공

- [ ] **Step 4: 브라우저 확인**

```bash
npm run dev
```

브라우저에서 `http://localhost:3000` 접속 → `/materials/mat-001`으로 리디렉트 확인.
다음 항목 육안 확인:
- 2컬럼 레이아웃 (5fr:7fr)
- 소재 정보 그리드 8개 필드
- 타임라인 3단계 모두 `done` 상태
- 편성 연결 테이블 2행 (송출중 / 편성대기)
- 버전 이력 토글 버튼 클릭 → 테이블 펼침
- 삭제 버튼 클릭 → 모달 열림 / ESC 닫힘

- [ ] **Step 5: 커밋**

```bash
git add src/app/(dashboard)/
git commit -m "feat(material-detail): page.tsx orchestration 구현 — 구현 완료"
```

---

## 셀프 리뷰

**Spec 커버리지:**
- ✅ 레이아웃 2컬럼 (5fr:7fr) — Task 12
- ✅ 미리보기 카드 (영상 + 파일 메타 4개 + 교체/삭제) — Task 8
- ✅ 소재 정보 그리드 8개 키 — Task 7
- ✅ 검수 타임라인 5종 노드 상태 — Task 6
- ✅ FailPanel (실패 사유 + 수정 가이드 + 복사 + 재업로드) — Task 5
- ✅ 편성 연결 테이블 4컬럼 — Task 10
- ✅ 편성 상태 배지 2종 (송출중/편성대기) — Task 10
- ✅ 버전 이력 접기/펼치기 + 테이블 5컬럼 — Task 11
- ✅ 삭제 확인 모달 (ESC/배경클릭/포커스) — Task 9
- ✅ 배지 열거값 6종 (검수) + 2종 (편성) — Task 7, 10, 11

**타입 일관성:**
- `ReviewStatus`, `ScheduleStatus`, `TimelineNodeStatus` — Task 4에서 정의, 이후 모든 컴포넌트에서 동일하게 import

**플레이스홀더 없음** — 모든 스텝에 실제 코드 포함.
