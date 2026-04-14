# 잔여 화면 구현 설계

**날짜:** 2026-04-14
**대상 스펙:** `docs/design/screen-specs/` — 아래 5개 이미 구현 제외한 27개 화면
**이미 구현된 화면 (제외):**
- `/media` (media-list)
- `/media/[id]` (media-detail)
- `/media/new`, `/media/[id]/edit` (media-form)
- `/media/companies` (media-company-mgmt)
- `/media/groups` (media-group)
**구현 위치:** `2026-04-14-html-spec/front/`
**접근 방식:** 도메인 배치 순차 (business flow order)

---

## 1. 기술 스택

기존 매체 모듈과 동일 (변경 없음)

| 항목 | 선택 |
|---|---|
| Framework | Next.js 16 (App Router) + React + TypeScript |
| 스타일 | CSS Modules + CSS 변수 (design tokens) |
| 서버 상태 | TanStack Query v5 |
| 폼 | React Hook Form v7 + Zod v3 |
| Mock API | MSW v2 |
| 차트 | Recharts |
| 제외 | Tailwind, UI 라이브러리(MUI/shadcn/Radix), Redux/Zustand |

---

## 2. 라우트 구조

```
src/app/
├── (auth)/
│   ├── layout.tsx              # 사이드바 없는 인증 레이아웃
│   ├── login/page.tsx
│   └── signup/complete/page.tsx
└── (dashboard)/
    ├── page.tsx                # 대시보드 (역할별 분기)
    ├── notifications/page.tsx  # 알림 센터
    ├── users/
    │   ├── page.tsx            # 사용자 목록
    │   └── invite/page.tsx     # 사용자 초대
    ├── settings/
    │   ├── profile/page.tsx    # 내 정보
    │   ├── notifications/page.tsx  # 알림 설정
    │   └── system/page.tsx     # 시스템 설정
    ├── materials/
    │   ├── page.tsx            # 소재 목록
    │   ├── [id]/page.tsx       # 소재 상세
    │   └── spec-guide/page.tsx # 소재 규격 안내
    ├── campaigns/
    │   ├── page.tsx            # 캠페인 목록
    │   ├── new/page.tsx        # 캠페인 등록
    │   ├── [id]/page.tsx       # 캠페인 상세
    │   └── [id]/edit/page.tsx  # 캠페인 수정
    ├── playlists/
    │   ├── page.tsx            # 재생목록 목록
    │   └── [id]/edit/page.tsx  # 재생목록 편집
    ├── schedules/
    │   ├── page.tsx            # 편성표 목록
    │   ├── new/page.tsx        # 편성표 생성
    │   ├── [id]/edit/page.tsx  # 편성표 수정
    │   ├── emergency/page.tsx  # 긴급 편성
    │   ├── sync/page.tsx       # 싱크 송출 설정
    │   └── slot-remaining/page.tsx  # 잔여 구좌
    └── reports/
        ├── page.tsx            # 리포트 목록
        ├── new/page.tsx        # 리포트 생성
        ├── foot-traffic/page.tsx    # 유동인구 연결
        └── ssp-integration/page.tsx # SSP 연동
```

총 27페이지 + 인증 레이아웃 1개.

---

## 3. 공통 컴포넌트 추가

기존 `StatusDot`, `SyncBadge`, `Button`, `Drawer`, `Dialog`, `Toast` 외 추가:

| 컴포넌트 | 위치 | 용도 |
|---|---|---|
| `Badge` | `components/ui/Badge` | 상태 배지 범용 (색상·텍스트 props) |
| `DateRangePicker` | `components/ui/DateRangePicker` | 시작~종료 날짜 입력 |
| `Tabs` | `components/ui/Tabs` | 탭 공통화 (detail 페이지들) |
| `EmptyState` | `components/ui/EmptyState` | 빈 목록 공통 표시 |
| `PageHeader` | `components/ui/PageHeader` | 제목+설명+액션버튼 패턴 |
| `ChartLine` | `components/ui/charts/ChartLine` | Recharts LineChart 래퍼 |
| `ChartBar` | `components/ui/charts/ChartBar` | Recharts BarChart 래퍼 |

---

## 4. 도메인별 상태값 (스펙 그대로, rename 금지)

각 상태값은 구현 직전 해당 스펙 파일을 읽어 최종 확정한다.
아래는 스펙 예비 조사 기준이며, 스펙 파일이 우선한다.

```ts
type CampaignStatus  = 'draft' | 'pending' | 'running' | 'paused' | 'ended'
type MaterialStatus  = 'pending' | 'approved' | 'rejected'
type ScheduleStatus  = 'active' | 'inactive' | 'conflict'
type ReportStatus    = 'ready' | 'generating' | 'failed'
type UserRole        = 'admin' | 'media-company' | 'ops-agency' | 'sales-agency'
```

---

## 5. 구현 배치 순서 (business flow)

### 배치 1 — 인증 (2화면)
**화면:** login, signup-complete
**MSW:** `POST /api/auth/login`, `POST /api/auth/signup`
**컴포넌트:** LoginForm
**특이사항:** `(auth)` 레이아웃 — 사이드바 없음, 중앙 정렬 카드 레이아웃

### 배치 2 — 대시보드 (3화면)
**화면:** dashboard-admin, dashboard-media-company, dashboard-ops-agency
**MSW:** `GET /api/dashboard?role=admin|media-company|ops-agency`
**fixtures:** `dashboard.json` (역할별 통계·알림·상태 데이터)
**handlers:** `dashboard.ts`
**컴포넌트:** 역할별 DashboardView 3종, 통계 카드 위젯
**특이사항:** admin 대시보드는 매체 상태 카운트·헬스체크 이상 목록·시스템 상태 포함

### 배치 3 — 사용자·설정 (5화면)
**화면:** user-list, user-invite, my-profile, notification-center, system-settings
**MSW:** `GET /api/users`, `POST /api/users/invite`, `GET|PUT /api/me`, `GET|PUT /api/settings`, `GET /api/notifications`, `PATCH /api/notifications/:id/read`, `POST /api/notifications/read-all`
**fixtures:** `users.json`, `notifications.json`
**handlers:** `users.ts`, `notifications.ts`
**컴포넌트:** UserTable, UserRoleBadge, InviteForm, ProfileForm, NotificationToggles
**특이사항:** notification-center는 전용 페이지 (`/notifications`) — 스펙 기준 확인 필요

### 배치 4 — 소재 (3화면)
**화면:** material-list, material-detail, material-spec-guide
**MSW:** `GET /api/materials`, `GET /api/materials/:id`, `PATCH /api/materials/:id/review`
**컴포넌트:** MaterialTable, MaterialReviewBadge, MaterialPreview
**특이사항:** material-spec-guide는 정적 안내 페이지 (API 없음)

### 배치 5 — 캠페인 (3화면)
**화면:** campaign-list, campaign-form (신규+수정), campaign-detail
**MSW:** `GET /api/campaigns`, `POST /api/campaigns`, `GET|PUT /api/campaigns/:id`
**컴포넌트:** CampaignTable, CampaignForm (DateRangePicker 포함), CampaignStatusBadge
**특이사항:** campaign-detail은 탭 구조 (기본정보 / 소재 / 편성)

### 배치 6 — 재생목록 (2화면)
**화면:** playlist-list, playlist-edit
**MSW:** `GET /api/playlists`, `GET|PUT /api/playlists/:id`
**컴포넌트:** PlaylistTable, PlaylistEditor (순서 조작 — 드래그 없이 위/아래 버튼)
**특이사항:** 편집 화면은 소재 배정 + 순서 변경

### 배치 7 — 편성 (5화면)
**화면:** schedule-list, schedule-form (신규+수정), emergency-schedule, sync-schedule, slot-remaining
**MSW:** `GET /api/schedules`, `POST /api/schedules`, `GET|PUT /api/schedules/:id`, `GET /api/schedules/slot-remaining`, `POST /api/emergency`, `GET|POST /api/sync`
**컴포넌트:** ScheduleTable, ScheduleForm, EmergencyForm, SyncPanel, SlotRemainingTable
**특이사항:** slot-remaining은 매체×시간 그리드 또는 테이블 — 스펙 기준 결정

### 배치 8 — 리포트·연동 (4화면)
**화면:** report-list, report-create, foot-traffic, ssp-integration
**MSW:** `GET /api/reports`, `POST /api/reports`, `GET /api/foot-traffic`, `GET /api/ssp`
**컴포넌트:** ReportTable, ReportForm, FootTrafficChart(LineChart), SspChart(BarChart)
**차트 라이브러리:** Recharts

---

## 6. 각 배치 완료 기준

- 해당 도메인 스펙 파일의 컬럼·필터·배지 값과 구현 화면 일치
- TypeScript 오류 없음 (`npx tsc --noEmit`)
- MSW를 통한 CRUD 동작 확인
- 스펙 대비 누락 항목 없음

---

## 7. 파일 추가 목록 (신규)

```
src/
├── types/
│   ├── user.ts
│   ├── material.ts
│   ├── campaign.ts
│   ├── playlist.ts
│   ├── schedule.ts
│   └── report.ts
├── mocks/
│   ├── fixtures/
│   │   ├── dashboard.json      # 역할별 대시보드 통계
│   │   ├── users.json
│   │   ├── notifications.json  # 알림 센터
│   │   ├── materials.json
│   │   ├── campaigns.json
│   │   ├── playlists.json
│   │   ├── schedules.json
│   │   ├── reports.json
│   │   ├── foot-traffic.json
│   │   └── ssp.json
│   └── handlers/
│       ├── auth.ts
│       ├── dashboard.ts        # GET /api/dashboard?role=
│       ├── users.ts
│       ├── notifications.ts    # GET, PATCH, POST read-all
│       ├── materials.ts
│       ├── campaigns.ts
│       ├── playlists.ts
│       ├── schedules.ts
│       └── reports.ts
├── hooks/
│   ├── auth/useAuth.ts
│   ├── users/useUsers.ts
│   ├── materials/useMaterials.ts
│   ├── campaigns/useCampaigns.ts
│   ├── playlists/usePlaylists.ts
│   ├── schedules/useSchedules.ts
│   └── reports/useReports.ts
└── components/
    ├── ui/
    │   ├── Badge.tsx / .module.css
    │   ├── DateRangePicker.tsx / .module.css
    │   ├── Tabs.tsx / .module.css
    │   ├── EmptyState.tsx / .module.css
    │   ├── PageHeader.tsx / .module.css
    │   └── charts/
    │       ├── ChartLine.tsx
    │       └── ChartBar.tsx
    └── domain/
        ├── users/
        ├── materials/
        ├── campaigns/
        ├── playlists/
        ├── schedules/
        └── reports/
```
