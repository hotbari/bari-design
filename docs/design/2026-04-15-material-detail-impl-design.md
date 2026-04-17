# material-detail 구현 설계

**날짜:** 2026-04-15
**목표:** `2026-04-15-html-verify`에 material-detail 단독 Next.js 앱을 구축하여 `/html-verify` 파이프라인 검증 기반을 마련한다.

---

## 프로젝트 스펙

- **작업위치:** `2026-04-15-html-verify/`
- **스캐폴드:** 신규 create-next-app (기존 프로젝트 비복사)
- **스택:** Next.js 16 + React 19 + TypeScript + TanStack Query v5 + MSW v2 + zod
- **구현 범위:** material-detail 페이지 1개

---

## 파일 구조

```
2026-04-15-html-verify/
├── package.json
├── tsconfig.json
├── next.config.ts
├── public/
│   └── mockServiceWorker.js
└── src/
    ├── app/
    │   ├── globals.css               ← CSS 토큰 (oklch 기반)
    │   ├── layout.tsx                ← minimal root layout
    │   └── (dashboard)/
    │       └── materials/
    │           └── [id]/
    │               └── page.tsx      ← fetch + state orchestration
    ├── components/
    │   └── material-detail/
    │       ├── PreviewCard.tsx
    │       ├── MaterialInfoGrid.tsx
    │       ├── ReviewTimeline.tsx
    │       ├── ScheduleTable.tsx
    │       ├── VersionHistory.tsx
    │       ├── FailPanel.tsx
    │       └── DeleteModal.tsx
    ├── mocks/
    │   ├── browser.ts
    │   ├── handlers/materials.ts
    │   └── fixtures/material-detail.json
    └── providers.tsx                 ← ReactQueryProvider + MSWProvider
```

---

## 데이터 모델

```typescript
interface MaterialDetail {
  id: string;
  name: string;
  advertiser: string;
  media: string;
  resolution: string;
  duration: string;
  period: string;
  reviewStatus: 'done' | 'reviewing' | 'failed' | 'manual' | 'on-air' | 'waiting';
  scheduleConnected: boolean;

  // 파일 메타
  filename: string;
  codec: string;
  framerate: string;
  fileSize: string;

  // 검수 타임라인
  timeline: Array<{
    label: string;
    status: 'done' | 'failed' | 'current' | 'waiting' | 'pending';
    time?: string;
    elapsed?: string;
  }>;

  // 편성 연결
  schedules: Array<{
    mediaName: string;
    scheduleName: string;
    status: 'on' | 'wait';
    period: string;
  }>;

  // 버전 이력
  versions: Array<{
    version: number;
    isCurrent: boolean;
    filename: string;
    replacedAt: string;
    reviewResult: 'done' | 'reviewing' | 'failed' | 'manual' | 'on-air' | 'waiting';
  }>;

  // 검수 실패 시만 존재
  failReason?: string;
  fixGuide?: string;
}
```

---

## 컴포넌트 책임

| 컴포넌트 | 담당 | Props |
|---------|------|-------|
| `page.tsx` | MSW fetch + deleteModal open state | — |
| `PreviewCard` | 영상 영역 + 파일 메타 4개 + 교체/삭제 버튼 | `filename, codec, framerate, fileSize, onDelete` |
| `MaterialInfoGrid` | 소재 정보 8개 키-값 그리드 | `material: MaterialDetail` |
| `ReviewTimeline` | 타임라인 노드 5종 + FailPanel 조건부 렌더 | `timeline, reviewStatus, failReason?, fixGuide?` |
| `ScheduleTable` | 편성 연결 테이블 4컬럼 + 건수 헤더 | `schedules` |
| `VersionHistory` | 접기/펼치기 + 버전 테이블 5컬럼 (내부 state) | `versions` |
| `FailPanel` | 실패 패널 (failed 상태일 때만) | `failReason, fixGuide` |
| `DeleteModal` | 삭제 확인 모달 + ESC/배경클릭 닫힘 + 포커스 | `isOpen, onClose, onConfirm` |

---

## 상태 관리

- `isDeleteModalOpen: boolean` — page.tsx에서 관리, PreviewCard → DeleteModal로 전달
- `isVersionHistoryOpen: boolean` — VersionHistory 내부 state

---

## CSS 전략

- `globals.css`에 CSS 커스텀 프로퍼티 토큰 정의 (spec의 `oklch` 값 그대로)
- 컴포넌트별 CSS Modules 사용
- 클래스명은 spec의 `.badge-done`, `.badge-reviewing` 등 그대로 사용

---

## 레이아웃

- **바디 상단:** 2컬럼 그리드 `5fr : 7fr` (좌: PreviewCard, 우: MaterialInfoGrid + ReviewTimeline)
- **바디 하단:** ScheduleTable + VersionHistory (단일 카드)
- GNB: 브레드크럼 (소재 관리 › {소재명})

---

## Spec 참조

- `docs/design/screen-specs/material-detail.md`
- `2026-04-08-prototype/material-detail.html` (충돌 시 HTML 우선)
