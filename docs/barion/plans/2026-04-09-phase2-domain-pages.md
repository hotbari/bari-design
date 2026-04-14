# Phase 2: 도메인 페이지 React 전환 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 34 routes / 32 HTML 프로토타입 페이지를 Next.js 15 App Router + React Query + Zod로 전환

**Architecture:** 도메인 완결형 순서(캠페인→미디어→소재→스케줄링→플레이리스트→리포트→유저/시스템→인증→대시보드). 각 도메인은 MSW 픽스처 → Zod 타입 → React Query 훅 → 도메인 컴포넌트 → 페이지 순서로 구현. 첫 도메인(캠페인)이 이후 모든 도메인의 패턴 템플릿.

**Tech Stack:** Next.js 15 App Router, TypeScript, CSS Modules, Jotai, React Query v5, MSW v2, Zod v4, react-hook-form v7, @dnd-kit/core + @dnd-kit/sortable, billboard.js (이미 설치됨)

**작업 디렉토리:** `D:/2026_cluade_build/bari-design/2026-04-09-prototype/frontend/`

**각 태스크 상세:** `D:/2026_cluade_build/bari-design/2026-04-09-prototype/task/`

---

## 파일 구조 (Phase 2 완료 시)

```
src/
├── app/
│   ├── (auth)/
│   │   ├── layout.tsx                    # Task 0
│   │   ├── login/page.tsx                # Task 9
│   │   └── signup/complete/page.tsx      # Task 9
│   └── (dashboard)/
│       ├── page.tsx                      # Task 10 (대시보드, ?role=)
│       ├── campaigns/                    # Task 2 (4 routes)
│       ├── media/                        # Task 3 (6 routes)
│       ├── materials/                    # Task 4 (3 routes)
│       ├── schedules/                    # Task 5 (5 routes)
│       ├── playlists/                    # Task 6 (2 routes)
│       ├── reports/                      # Task 7 (4 routes)
│       ├── users/                        # Task 8 (2 routes)
│       └── settings/                    # Task 8 (3 routes)
├── hooks/
│   ├── campaigns/                        # Task 2
│   ├── media/                            # Task 3
│   ├── materials/                        # Task 4
│   ├── schedules/                        # Task 5
│   ├── playlists/                        # Task 6
│   ├── reports/                          # Task 7
│   └── users/                            # Task 8
├── types/                                # Task 1 (7 파일)
├── components/
│   ├── layout/                           # Phase 1 (TopBar 수정: Task 10)
│   ├── ui/                               # Phase 1
│   └── domain/
│       ├── campaigns/                    # Task 2
│       ├── media/                        # Task 3
│       ├── materials/                    # Task 4
│       ├── schedules/                    # Task 5
│       ├── playlists/                    # Task 6
│       ├── reports/                      # Task 7
│       ├── users/                        # Task 8
│       └── dashboard/                   # Task 10
└── mocks/
    ├── fixtures/                         # Task 0: materials, reports, foot-traffic, ssp 추가
    └── handlers/                         # Task 0: materials, reports 추가
```

---

## HTML → Route 커버리지 (32 HTML → 34 routes)

| HTML 파일 | Route | Task |
|-----------|-------|------|
| dashboard-admin.html | `/?role=admin` | 10 |
| dashboard-media-company.html | `/?role=media-company` | 10 |
| dashboard-ops-agency.html | `/?role=ops-agency` | 10 |
| campaign-list.html | `/campaigns` | 2 |
| campaign-detail.html | `/campaigns/[id]` | 2 |
| campaign-form.html | `/campaigns/new` + `/campaigns/[id]/edit` | 2 |
| media-list.html | `/media` | 3 |
| media-detail.html | `/media/[id]` | 3 |
| media-form.html | `/media/new` + `/media/[id]/edit` | 3 |
| media-group.html | `/media/groups` | 3 |
| media-company-mgmt.html | `/media/companies` | 3 |
| material-list.html | `/materials` | 4 |
| material-detail.html | `/materials/[id]` | 4 |
| material-spec-guide.html | `/materials/spec-guide` | 4 |
| schedule-list.html | `/schedules` | 5 |
| schedule-form.html | `/schedules/new` | 5 |
| sync-schedule.html | `/schedules/sync` | 5 |
| emergency-schedule.html | `/schedules/emergency` | 5 |
| slot-remaining.html | `/schedules/slot-remaining` | 5 |
| playlist-list.html | `/playlists` | 6 |
| playlist-edit.html | `/playlists/[id]/edit` | 6 |
| report-list.html | `/reports` | 7 |
| report-create.html | `/reports/new` | 7 |
| foot-traffic.html | `/reports/foot-traffic` | 7 |
| ssp-integration.html | `/reports/ssp-integration` | 7 |
| user-list.html | `/users` | 8 |
| user-invite.html | `/users/invite` | 8 |
| my-profile.html | `/settings/profile` | 8 |
| notification-center.html | `/settings/notifications` | 8 |
| system-settings.html | `/settings/system` | 8 |
| login.html | `/login` | 9 |
| signup-complete.html | `/signup/complete` | 9 |

**총: 32 HTML → 34 routes (campaign-form, media-form 각 2개로 분리)**

---

## Task 0: 사전 설치 및 공통 설정

**상세:** `task/task-00-pre-setup.md`

요약:
- `npm install @dnd-kit/core @dnd-kit/sortable`
- `src/app/(auth)/layout.tsx` 생성 (인증 전용 셸, 사이드바 없음)
- MSW 픽스처 4개 추가: materials, reports, foot-traffic, ssp
- MSW 핸들러 2개 추가: materials, reports
- `src/mocks/browser.ts` 업데이트

---

## Task 1: 타입 정의 (7개 도메인)

**상세:** `task/task-01-types.md`

요약:
- `src/types/` 에 campaign, media, material, schedule, playlist, report, user 7개 파일
- 각 파일: zod 스키마 → `z.infer<>` 타입. API 응답 타입 + 폼 입력 타입 분리

---

## Task 2: 캠페인 도메인 (4 routes)

**상세:** `task/task-02-campaign.md`

요약:
- MSW 핸들러에 POST/PUT/DELETE 추가
- `hooks/campaigns/useCampaigns.ts` + `useCampaignDetail.ts`
- `components/domain/campaigns/` — CampaignStatusBadge, CampaignTable, CampaignForm
- `/campaigns`, `/campaigns/new`, `/campaigns/[id]`, `/campaigns/[id]/edit`

---

## Task 3: 미디어 도메인 (6 routes)

**상세:** `task/task-03-media.md`

요약:
- `hooks/media/useMedia.ts` + `useMediaDetail.ts`
- `components/domain/media/` — MediaStatusBadge, MediaTable, MediaForm
- `/media`, `/media/new`, `/media/groups`, `/media/companies`, `/media/[id]`, `/media/[id]/edit`

---

## Task 4: 소재 도메인 (3 routes)

**상세:** `task/task-04-materials.md`

요약:
- `hooks/materials/useMaterials.ts`
- `components/domain/materials/` — MaterialReviewBadge, MaterialTable
- `/materials`, `/materials/[id]`, `/materials/spec-guide` (정적 페이지)

---

## Task 5: 스케줄링 도메인 (5 routes)

**상세:** `task/task-05-schedules.md`

요약:
- `hooks/schedules/useSchedules.ts` + `useSlotRemaining.ts`
- `components/domain/schedules/` — ScheduleStatusBadge, SyncStatusBadge, ScheduleTable, ScheduleForm
- `/schedules`, `/schedules/new`, `/schedules/sync`, `/schedules/emergency`, `/schedules/slot-remaining`

---

## Task 6: 플레이리스트 도메인 (2 routes)

**상세:** `task/task-06-playlists.md`

요약:
- `hooks/playlists/usePlaylists.ts`
- `components/domain/playlists/PlaylistEditor.tsx` — @dnd-kit 드래그 앤 드롭
- `/playlists`, `/playlists/[id]/edit`

---

## Task 7: 리포트 도메인 (4 routes)

**상세:** `task/task-07-reports.md`

요약:
- `hooks/reports/useReports.ts` — reports, foot-traffic, ssp 훅
- `components/domain/reports/` — ReportStatusBadge, ReportTable, ReportForm
- `/reports`, `/reports/new`, `/reports/foot-traffic`, `/reports/ssp-integration`
- foot-traffic은 유동인구 연동 설정 페이지 (차트 없음)

---

## Task 8: 유저/시스템 도메인 (5 routes)

**상세:** `task/task-08-users-system.md`

요약:
- `hooks/users/useUsers.ts`
- `components/domain/users/` — UserRoleBadge, UserTable
- `/users`, `/users/invite`
- `/settings/profile`, `/settings/notifications` (Toggle 컴포넌트), `/settings/system`

---

## Task 9: 인증 도메인 (2 routes)

**상세:** `task/task-09-auth.md`

요약:
- `/login` — zod + react-hook-form 폼, 제출 시 `/` 이동 (MSW auth 미구현)
- `/signup/complete` — 정적 완료 카드

---

## Task 10: 대시보드 (1 route, 3 컴포넌트)

**상세:** `task/task-10-dashboard.md`

요약:
- `components/domain/dashboard/` — AdminDashboard, MediaCompanyDashboard, OpsAgencyDashboard, DashboardCard
- `/` (app/(dashboard)/page.tsx) — Next.js 15 async searchParams, `?role=` 분기
- TopBar에 역할 셀렉터 추가

---

## 검증 기준 (전체)

- **HTML 비교**: 각 도메인 완료 후 `2026-04-08-prototype/*.html`과 레이아웃·컬럼·데이터 비교
- **MSW 확인**: Network 탭 → `/api/*` 요청 MSW 인터셉트 확인
- **폼 검증**: 필수 필드 빈 채 제출 → Zod 에러 메시지 표시
- **역할 전환**: `?role=` 변경 → 대시보드 컴포넌트 교체
- **드래그**: `/playlists/pl-001/edit` → 슬롯 순서 드래그 후 저장 → 토스트
