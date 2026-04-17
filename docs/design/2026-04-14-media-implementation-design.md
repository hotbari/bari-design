# 매체 관리 모듈 구현 설계

**날짜:** 2026-04-14
**대상 스펙:** `docs/design/screen-specs/media-*.md` (5개 화면)
**구현 위치:** `2026-04-14-html-spec/front/`
**접근 방식:** 화면 단위 (screen-by-screen) — 한 화면씩 완성 후 스펙 대조

---

## 1. 기술 스택

| 항목 | 선택 |
|---|---|
| Framework | Next.js 15 (App Router) + React 19 + TypeScript 5 |
| 스타일 | CSS Modules + CSS 변수 (design tokens) |
| 서버 상태 | TanStack Query v5 |
| 폼 | React Hook Form v7 + Zod v3 |
| Mock API | MSW v2 |
| 제외 | Tailwind, UI 라이브러리(MUI/shadcn/Radix), Redux/Zustand |

---

## 2. 파일 구조

```
2026-04-14-html-spec/front/
├── src/
│   ├── app/
│   │   ├── layout.tsx
│   │   ├── (dashboard)/
│   │   │   ├── layout.tsx
│   │   │   ├── page.tsx                        # ComingSoon
│   │   │   ├── media/
│   │   │   │   ├── page.tsx                    # 매체 목록
│   │   │   │   ├── new/page.tsx                # 매체 등록
│   │   │   │   ├── [id]/page.tsx               # 매체 상세
│   │   │   │   ├── [id]/edit/page.tsx          # 매체 수정
│   │   │   │   ├── companies/page.tsx          # 매체사 관리
│   │   │   │   └── groups/page.tsx             # 매체 그룹
│   │   │   └── [domain]/page.tsx               # 나머지 도메인 → ComingSoon
│   ├── components/
│   │   ├── layout/
│   │   │   ├── AppShell.tsx / .module.css
│   │   │   ├── Sidebar.tsx / .module.css
│   │   │   └── TopBar.tsx / .module.css
│   │   ├── ui/
│   │   │   ├── StatusDot.tsx / .module.css
│   │   │   ├── SyncBadge.tsx / .module.css
│   │   │   ├── TypeChip.tsx / .module.css
│   │   │   ├── HcBadge.tsx / .module.css
│   │   │   ├── Toast.tsx / .module.css
│   │   │   ├── Drawer.tsx / .module.css
│   │   │   ├── Dialog.tsx / .module.css
│   │   │   ├── Tabs.tsx / .module.css
│   │   │   └── ComingSoon.tsx
│   │   └── domain/media/
│   │       ├── MediaTable.tsx
│   │       ├── MediaFilterBar.tsx
│   │       ├── MediaCompanyTable.tsx
│   │       ├── MediaCompanyDrawer.tsx
│   │       ├── MediaGroupPanel.tsx
│   │       └── MediaForm.tsx / .module.css
│   ├── hooks/media/
│   │   ├── useMedia.ts
│   │   ├── useMediaDetail.ts
│   │   ├── useMediaCompanies.ts
│   │   └── useMediaGroups.ts
│   ├── types/
│   │   └── media.ts
│   ├── mocks/
│   │   ├── browser.ts
│   │   ├── fixtures/
│   │   │   ├── media.json
│   │   │   ├── media-companies.json
│   │   │   └── media-groups.json
│   │   └── handlers/
│   │       ├── media.ts
│   │       ├── media-companies.ts
│   │       └── media-groups.ts
│   └── styles/
│       └── tokens.css
```

---

## 3. 라우트 매핑

| Next.js 라우트 | HTML 원본 |
|---|---|
| `/media` | `media-list.html` |
| `/media/new` | `media-form.html` (신규) |
| `/media/[id]` | `media-detail.html` |
| `/media/[id]/edit` | `media-form.html?edit=1` |
| `/media/companies` | `media-company-mgmt.html` |
| `/media/groups` | `media-group.html` |

---

## 4. 타입 정의

```ts
// 상태값 — HTML 클래스명과 1:1, rename 금지
type MediaStatus  = 'online' | 'delayed' | 'error' | 'offline' | 'inactive' | 'unlinked'
type SyncStatus   = 'synced' | 'delayed' | 'error' | 'pending'
type MediaType    = '고정형' | '이동형'
type DisplayType  = 'LCD' | 'LED' | '기타'
type Orientation  = '가로형' | '세로형'
type OperatingDays = '매일' | '평일' | '주말' | '직접선택'
type OperatingHours = '24시간' | '직접입력'
type HcResult     = 'hc-ok' | 'hc-warn' | 'hc-err'  // 스펙 값 그대로, rename 금지

interface Media {
  id, name, location, companyId, companyName, type, displayType,
  orientation, resolution, screenSize, ledPitch?, operatingDays,
  operatingHours, status, syncStatus, registeredAt, note?
}

interface MediaDetail extends Media {
  device?: MediaDevice
  healthChecks: HealthCheck[]
}

interface MediaCompany {
  id, name, regNumber, representative, phone?, address?, mediaCount, registeredAt
}

interface MediaGroup {
  id, name, assignedMediaIds: string[]
}
```

---

## 5. MSW Fixtures & Handlers

### Fixtures

**media.json — 6개, 모든 상태값 커버**

| id | status | syncStatus | type |
|---|---|---|---|
| m-001 | online | synced | 고정형 |
| m-002 | delayed | delayed | 고정형 |
| m-003 | error | error | 이동형 |
| m-004 | offline | pending | 고정형 |
| m-005 | inactive | pending | 이동형 |
| m-006 | unlinked | pending | 고정형 |

**media-companies.json — 4개**

| id | name | regNumber | mediaCount |
|---|---|---|---|
| c-001 | 네이버 OOH 미디어 | 209-81-57890 | 60 |
| c-002 | 카카오 스크린 | 120-81-47832 | 24 |
| c-003 | 롯데 광고 | 114-81-23456 | 18 |
| c-004 | 서울디지털미디어 | 220-87-00123 | 9 |

> c-001의 사업자번호(`209-81-57890`)는 중복 검증 시뮬레이션에 사용 (409 응답)

**media-groups.json — 3개, 그룹 패널 dot 3종(online/error/delayed)만 사용**

| id | name | assignedMediaIds |
|---|---|---|
| g-001 | 강남권 | [m-001, m-002] |
| g-002 | 홍대·마포 | [m-003] |
| g-003 | 여의도 | [] |

> 그룹 패널에 배정되는 매체는 status가 online/error/delayed인 것만 (스펙 기준 3종)

### API 엔드포인트

```
# 매체
GET    /api/media                       목록 (status, type, companyId, q 필터)
GET    /api/media/:id                   상세
GET    /api/media/:id/health-checks     헬스체크 이력 (?period=7|14|30)
POST   /api/media                       등록
PUT    /api/media/:id                   수정
PATCH  /api/media/:id/status            활성/비활성 토글

# 매체사
GET    /api/media-companies             목록 (q 필터)
POST   /api/media-companies             등록 (중복 사업자번호 → 409)
PUT    /api/media-companies/:id         수정

# 그룹
GET    /api/media-groups                목록 + 미배정 매체
POST   /api/media-groups                생성
PUT    /api/media-groups/:id            그룹명 + 배정 업데이트
DELETE /api/media-groups/:id            삭제
```

---

## 6. 컴포넌트 설계

### UI 공통

**StatusDot**
- `unlinked`만 `box-shadow: 0 0 0 2px var(--color-neutral-300)` (background 아님)
- `size: 'sm'(6px) | 'md'(8px)` — sm은 그룹 패널용
- 그룹 패널에서는 `online | error | delayed` 3종만 사용 (스펙 기준); `offline/inactive/unlinked` 매체는 그룹에 배정하지 않음

**SyncBadge**
- `status: SyncStatus | null` — null이면 `—` 텍스트 (inactive 매체)

**Drawer**
- 포커스 트랩 내장 (Tab/Shift+Tab 순환)
- 열기 전 `previousFocus` 저장 → 닫을 때 복원
- `requestAnimationFrame(() => firstInput.focus())`
- backdrop + drawer 별도 애니메이션 (backdrop: 200ms fade, drawer: 250ms slide)
- `document.body.style.overflow = 'hidden'` on open

**Dialog**
- z-index: 200 (Drawer 101 위)
- `scale(0.96) → scale(1)` 애니메이션
- 열릴 때 취소 버튼에 포커스

**Tabs**
- `tabpanel`에 `hidden` attribute 사용 (CSS `display:none` 금지)
- `aria-selected`: 문자열 `'true'` / `'false'`

**Toast (useToast hook)**
- `show(message, duration?)` — duration 기본 2500ms
- detail 페이지에서 호출 시 2800ms 명시

### Domain 컴포넌트

**MediaTable** — 8열, 순서 고정
```
매체명+주소 | 매체사 | 유형 | 해상도 | 상태 | 동기화 | 운영시간 | 등록일
```
- 행 클릭: `router.push('/media/[id]')`
- `onKeyDown` Enter → click (키보드 접근성)
- `inactive` 행: `<SyncBadge status={null} />`

**MediaFilterBar** — 4개 필터
- 매체사 select | 상태 select (7옵션) | 유형 select (3옵션) | 검색 text
- 상태 옵션 value(스펙 기준 한글): `''`→전체, `온라인`, `지연`, `이상`, `오프라인`, `미연동`, `비활성`
- API 쿼리 파라미터에 한글 value 그대로 전달, handler에서 영문 status로 매핑
  - `온라인`→online, `지연`→delayed, `이상`→error, `오프라인`→offline, `미연동`→unlinked, `비활성`→inactive
- onChange → React Query 쿼리 파라미터 업데이트

**MediaForm** — 등록/수정 공용, 조건부 필드
- `watch('type') === '이동형'` → location 레이블 "거점 주소"로 변경 (별표 보존)
- `watch('displayType') === 'LED'` → ledPitch + 비정형 사이즈 필드 (grid-template-rows 애니메이션)
- `watch('displayType') === '기타'` → 기타명 입력 필드
- `watch('operatingDays') === '직접선택'` → 요일 버튼 7개 (프리셋: 매일/평일/주말 자동 선택)
- `watch('operatingHours') === '직접입력'` → 시작/종료 시간 입력
- 액션 버튼 3개: 등록/수정(primary), **임시 저장**(secondary, toast만 표시), 취소
- 등록 성공: toast → 1500ms → `router.push('/media/[id]')`

**MediaCompanyDrawer** — mode: 'create' | 'edit'
- 사업자번호 onChange: 실시간 `000-00-00000` 포맷
- 409 응답 → 사업자번호 필드 에러 표시

**MediaGroupPanel** — 2패널
- Left: 그룹 카드 목록, 인라인 추가 폼 (Enter 저장 / Escape 취소)
- Right: 그룹명 inline 편집 (blur → 저장), 배정/미배정 매체 체크박스
- 삭제 → Dialog (z-index 200)

---

## 7. HTML → React 전환 주요 규약

| HTML 패턴 | React 구현 |
|---|---|
| `style="display:none"` 토글 | 조건부 렌더링 또는 `hidden` attribute |
| JS class 토글 (`.open`) | React state + CSS Modules |
| `document.activeElement` 저장/복원 | `useRef<HTMLElement>` |
| `grid-template-rows: 0fr → 1fr` | CSS Modules 클래스 토글 유지 |
| `aria-selected="true"/"false"` | 문자열 그대로 (`String(bool)`) |
| `hidden` attribute on tabpanel | `hidden={activeTab !== id}` |
| `setTimeout 1500ms` 후 이동 | `setTimeout(() => router.push(...), 1500)` |
| `event.stopPropagation()` in row | onClick에 `e.stopPropagation()` |

---

## 8. 누락 위험 체크리스트 (화면별)

| 화면 | 체크 항목 |
|---|---|
| media-list | unlinked dot box-shadow, inactive sync `—`, 키보드 Enter 행 이동 |
| media-detail | hidden attribute 탭, 토글 라벨 ("매체 활성"↔"매체 비활성"), 2800ms 토스트 |
| media-form | LED grid 애니메이션, 비정형 사이즈 필드, 임시 저장 버튼, 요일 프리셋 3종, 레이블 동적 변경, 1500ms 이동 |
| media-company-mgmt | 포커스 트랩, 포커스 복원, 사업자번호 포맷, 드로어 모드 분기, 409 처리 |
| media-group | 2패널 연동, 인라인 편집 blur 저장, 삭제 다이얼로그 z-index 200 |

---

## 9. 구현 순서

1. **프로젝트 셋업** — Next.js 15 초기화, 토큰/레이아웃
2. **타입 + MSW** — `media.ts`, fixtures, handlers 전체
3. **media-list** — 8열 테이블, 4필터
4. **media-detail** — 3탭, 헬스체크, 상태 토글
5. **media-form** — 3카드, 조건부 필드
6. **media-company-mgmt** — 드로어, 포커스 관리
7. **media-group** — 2패널, 인라인 편집

각 화면 완성 후 스펙 문서와 컬럼·필터·배지 대조 확인.
