# Phase 2: 도메인 페이지 React 전환 설계

**날짜**: 2026-04-09
**범위**: `2026-04-09-prototype/frontend/` — 32개 HTML 프로토타입 → Next.js App Router 전환
**전제**: Phase 1(셋업·레이아웃·공통 UI 9종) 완료

---

## 1. 라우팅 구조

HTML 1:1 매핑 원칙. campaign-form.html·media-form.html은 new/edit 2개 route로 분리. 총 34 routes (32 HTML + 2 분리).

`(auth)/layout.tsx` — 사이드바·TopBar 없는 인증 전용 셸. `(dashboard)/layout.tsx`와 별개.

```
app/
├── (auth)/
│   ├── layout.tsx                        # 인증 전용 레이아웃 (사이드바 없음)
│   ├── login/page.tsx
│   └── signup/complete/page.tsx
│
└── (dashboard)/
    ├── page.tsx                          # dashboard-*.html (?role=)
    ├── campaigns/
    │   ├── page.tsx                      # campaign-list.html
    │   ├── new/page.tsx                  # campaign-form.html (생성)
    │   └── [id]/
    │       ├── page.tsx                  # campaign-detail.html
    │       └── edit/page.tsx             # campaign-form.html (편집)
    ├── media/
    │   ├── page.tsx                      # media-list.html
    │   ├── new/page.tsx                  # media-form.html (생성)
    │   ├── companies/page.tsx            # media-company-mgmt.html
    │   ├── groups/page.tsx               # media-group.html
    │   └── [id]/
    │       ├── page.tsx                  # media-detail.html
    │       └── edit/page.tsx             # media-form.html (편집)
    ├── materials/
    │   ├── page.tsx                      # material-list.html
    │   ├── spec-guide/page.tsx           # material-spec-guide.html
    │   └── [id]/page.tsx                 # material-detail.html
    ├── schedules/
    │   ├── page.tsx                      # schedule-list.html
    │   ├── new/page.tsx                  # schedule-form.html
    │   ├── sync/page.tsx                 # sync-schedule.html
    │   ├── emergency/page.tsx            # emergency-schedule.html
    │   └── slot-remaining/page.tsx       # slot-remaining.html
    ├── playlists/
    │   ├── page.tsx                      # playlist-list.html
    │   └── [id]/edit/page.tsx            # playlist-edit.html
    ├── reports/
    │   ├── page.tsx                      # report-list.html
    │   ├── new/page.tsx                  # report-create.html
    │   ├── foot-traffic/page.tsx         # foot-traffic.html
    │   └── ssp-integration/page.tsx      # ssp-integration.html
    ├── users/
    │   ├── page.tsx                      # user-list.html
    │   └── invite/page.tsx              # user-invite.html
    └── settings/
        ├── profile/page.tsx             # my-profile.html
        ├── notifications/page.tsx       # notification-center.html
        └── system/page.tsx             # system-settings.html
```

---

## 2. 데이터 레이어

### 2-1. 훅 구조

`hooks/` 디렉토리에 도메인별 React Query 훅 중앙화. 뮤테이션(생성/수정/삭제)은 같은 파일에 함께 정의.

```
hooks/
├── campaigns/
│   ├── useCampaigns.ts        # useCampaigns, useCreateCampaign
│   └── useCampaignDetail.ts   # useCampaignDetail, useUpdateCampaign, useDeleteCampaign
├── media/
│   ├── useMedia.ts
│   └── useMediaDetail.ts
├── materials/
│   └── useMaterials.ts
├── schedules/
│   ├── useSchedules.ts
│   └── useSlotRemaining.ts
├── playlists/
│   └── usePlaylists.ts
├── reports/
│   └── useReports.ts
└── users/
    └── useUsers.ts
```

훅 예시:
```ts
// hooks/campaigns/useCampaigns.ts
export function useCampaigns() {
  return useQuery({ queryKey: ['campaigns'], queryFn: () => fetch('/api/campaigns').then(r => r.json()) })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: CampaignInput) => fetch('/api/campaigns', { method: 'POST', body: JSON.stringify(data) }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['campaigns'] }),
  })
}
```

### 2-2. 타입 정의

HTML 더미 데이터 → zod 스키마 → `z.infer<>` 타입 추론.

```
types/
├── campaign.ts    # z.object({ id, name, status, startDate, endDate, budget, ... })
├── media.ts
├── material.ts
├── schedule.ts
├── playlist.ts
├── report.ts
└── user.ts
```

폼 입력 타입(`CampaignInput`)과 API 응답 타입(`Campaign`)을 같은 파일에서 분리 정의.

### 2-3. MSW 픽스처 확장

기존 5개(campaigns, media, playlists, schedules, users)에 추가:
- `mocks/fixtures/materials.json` — CRUD
- `mocks/fixtures/reports.json` — CRUD
- `mocks/fixtures/foot-traffic.json` — 차트용 시계열 데이터 (날짜별 유동인구)
- `mocks/fixtures/ssp.json` — SSP 연동 상태 데이터
- 핸들러: `mocks/handlers/materials.ts`, `mocks/handlers/reports.ts`
- foot-traffic·ssp는 GET only (비CRUD). 핸들러도 `GET /api/foot-traffic`, `GET /api/ssp` 형태로 단순화

---

## 3. 도메인 컴포넌트

페이지 파일은 훅 호출 + 레이아웃 조합만. 복잡한 UI는 `components/domain/`으로 분리.

```
components/domain/
├── campaigns/
│   ├── CampaignTable.tsx
│   ├── CampaignStatusBadge.tsx
│   └── CampaignForm.tsx
├── media/
│   ├── MediaGrid.tsx
│   └── MediaForm.tsx
├── materials/
│   └── MaterialTable.tsx
├── schedules/
│   ├── ScheduleCalendar.tsx
│   └── ScheduleForm.tsx
├── playlists/
│   └── PlaylistEditor.tsx
├── reports/
│   ├── ReportTable.tsx
│   └── ChartContainer.tsx    # billboard.js 래퍼
└── users/
    └── UserTable.tsx
```

---

## 4. 폼 패턴

전 도메인 공통 패턴:

```tsx
// zod 스키마 정의 (types/ 파일)
const campaignSchema = z.object({ name: z.string().min(1), ... })
type CampaignInput = z.infer<typeof campaignSchema>

// 폼 컴포넌트
const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
  resolver: zodResolver(campaignSchema),
  defaultValues: existing ?? {},
})

const mutation = useCreateCampaign()

return <form onSubmit={handleSubmit(data => mutation.mutate(data))}>...</form>
```

new/edit 폼은 같은 `CampaignForm` 컴포넌트 재사용. `defaultValues` 유무로 생성/편집 분기.

---

## 5. 역할 전환 (대시보드)

Next.js 15에서 `searchParams`는 Promise — async/await 필수.

```tsx
// app/(dashboard)/page.tsx
export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role = 'admin' } = await searchParams
  if (role === 'media-company') return <MediaCompanyDashboard />
  if (role === 'ops-agency') return <OpsAgencyDashboard />
  return <AdminDashboard />
}
```

TopBar에 역할 셀렉터 추가:
```tsx
<select onChange={e => router.push(`/?role=${e.target.value}`)} value={currentRole}>
  <option value="admin">어드민</option>
  <option value="media-company">미디어사</option>
  <option value="ops-agency">운영 대행사</option>
</select>
```

---

## 6. 구현 순서

도메인 완결형 — 한 도메인의 훅·타입·컴포넌트·페이지를 전부 끝낸 후 다음 도메인으로.

| 순서 | 도메인 | HTML 파일 수 | Routes | 비고 |
|------|--------|------------|--------|------|
| 1 | 캠페인 | 3 | 4 | 훅·폼·타입 패턴 정립. 이후 도메인 템플릿 |
| 2 | 미디어 | 5 | 6 | media-group.html → groups/page.tsx 포함 |
| 3 | 소재 | 3 | 3 | spec-guide 정적 페이지 포함 |
| 4 | 스케줄링 | 5 | 5 | sync·emergency·slot 특수 페이지 |
| 5 | 플레이리스트 | 2 | 2 | `@dnd-kit/core` 사용, 시작 전 설치 필요 |
| 6 | 리포트 | 4 | 4 | `billboard.js` 시작 전 설치 필요 (`npm i billboard.js`) |
| 7 | 유저/시스템 | 5 | 5 | settings/ 그룹 포함 |
| 8 | 인증 | 2 | 2 | `(auth)/layout.tsx` 별도 셸 |
| 9 | 대시보드 | 3 | 1 | 역할별 3종 컴포넌트, 단일 route |

**총 34 routes, 32 HTML 파일, 9개 도메인**

추가 패키지 (Phase 2 시작 전 설치):
```bash
npm i @dnd-kit/core @dnd-kit/sortable billboard.js
```

---

## 7. 검증 기준

- **HTML 비교**: 각 도메인 완료 후 HTML 프로토타입과 레이아웃·데이터 표시 비교
- **MSW 확인**: Network 탭에서 `/api/*` 요청 인터셉트 확인
- **폼 검증**: 필수 필드 누락 시 zod 에러 메시지 표시
- **역할 전환**: `?role=` 쿼리 변경 시 대시보드 컴포넌트 교체 확인
