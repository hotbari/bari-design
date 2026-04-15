# 대시보드 개선 설계

**날짜**: 2026-04-15
**대상**: `2026-04-15-html-verify` 프로젝트 대시보드 (`/src/app/(dashboard)/page.tsx`)
**범위**: 매체사·운영대행사·영업대행사 역할 대시보드 — 페르소나 기반 정보 추가 + 시각 품질 개선

---

## 1. 문제 정의

어드민 대시보드는 시스템 관제 관점으로 정보가 풍부하게 구성되어 있으나, 나머지 역할은 페르소나의 실제 업무 니즈를 반영하지 못하고 있다.

| 역할 | 현재 위젯 수 | 핵심 문제 |
|------|------------|---------|
| 어드민 | 8개 | 없음 (변경 없음) |
| 매체사 | 4개 | 편성·동기화 확인이 핵심 업무인데 관련 정보 전무 |
| 운영대행사 | 3개 | 담당 매체사 현황 없음, "빈 화면"처럼 보임 |
| 영업대행사 | 3개 | 운영대행사 뷰 그대로 복사 — 역할 특화 없음 |

---

## 2. 페르소나별 핵심 니즈

### 매체사 (김서영)
- "CMS에서 보이는 상태가 현장과 같다"는 확신 필요
- **핵심 업무**: 편성 변경 후 현장 반영 여부 확인, 소재 검수 진행 추적

### 운영대행사 (이준혁)
- 3개 매체사 150대 매체 동시 관리, 실수 공포가 큼
- **핵심 업무**: 담당 매체사별 이상 여부 파악, 이번 주 편성 처리 현황 확인

### 영업대행사 (최유진)
- 소재 도메인만 접근, CMS에 상주하지 않음
- **핵심 업무**: 담당 캠페인 상태 확인, 소재 검수 진행 상황 파악

---

## 3. 개선 내용

### 3-1. 매체사 대시보드

**변경 사항:**

1. **통계 카드**: 3개 → 4개 (`동기화 미완료` 카드 추가)
   - 보유 매체 / 진행 캠페인 / 동기화 미완료 / 검수 대기
   - `동기화 미완료 > 0`이면 카드 배경 경고색 적용

2. **편성 동기화 현황** (신규 섹션)
   - 보유 매체별 동기화 상태 목록 표시
   - 상태값: `synced`(완료) / `delayed`(지연) / `failed`(미완료)
   - 미완료·지연 행은 배경색으로 강조
   - 우상단 "편성관리 →" 링크

3. **이번주 편성 일정** (신규 섹션)
   - 타임라인 형태, 오늘~이번 주 편성 이벤트 최대 5건
   - 상태값: `confirmed`(확정) / `reviewing`(검수중) / `pending`(미확정)
   - 우상단 "전체 보기 →" 링크

4. **소재 검수 현황** (기존 "검수 대기 소재" → 고도화)
   - 진행률 바 + 예상 완료 시간 표시
   - 검수 중인 소재가 없으면 빈 상태 메시지 표시

5. **레이아웃**: `bodySimple` (65/35 2컬럼) → 2×2 그리드로 변경

**픽스처 추가** (`dashboard.json` > `media`):
```json
"stats": [
  { "label": "보유 매체", "value": 8 },
  { "label": "진행 캠페인", "value": 5 },
  { "label": "동기화 미완료", "value": 1 },
  { "label": "검수 대기", "value": 1 }
],
"syncStatus": [
  { "id": "m1", "name": "강남역 출구 빌보드", "status": "synced" },
  { "id": "m2", "name": "코엑스 외벽 광고", "status": "synced" },
  { "id": "m3", "name": "홍대입구 디지털 보드", "status": "delayed", "detail": "지연 3분" },
  { "id": "m4", "name": "신촌역 스크린", "status": "failed" }
],
"weeklySchedule": [
  { "id": "s1", "date": "오늘", "title": "삼성 갤럭시 S25 소재 교체", "status": "reviewing" },
  { "id": "s2", "date": "목요일", "title": "현대카드 캠페인 시작", "status": "confirmed" },
  { "id": "s3", "date": "금요일", "title": "SK텔레콤 신규 편성", "status": "pending" }
],
"pendingMaterials": [
  { "id": "mat1", "name": "삼성 갤럭시 S25 소재", "status": "reviewing", "progress": 60, "eta": "약 2시간 후" }
]
```

---

### 3-2. 운영대행사 대시보드

**변경 사항:**

1. **통계 카드**: 3개 → 4개 (`관리 매체사` 카드 추가)
   - 관리 매체사 / 진행 캠페인 / 이번주 편성 / 미처리 알림
   - `미처리 알림 > 0`이면 에러색 적용

2. **담당 매체사 현황** (신규 섹션)
   - 매체사별 이름 + 매체 수 + 종합 상태 배지
   - 이상 있는 매체사 행 배경 강조

3. **이번주 편성 처리 현황** (신규 섹션)
   - 전체 진행률 바 (완료 n / 전체 n)
   - 최근 2~3건 상태 인라인 표시

4. **오늘 할 일** (신규 섹션)
   - 긴급도 기반 정렬 (긴급 → 오늘 → 일반)
   - 체크박스 UI (인터랙션은 모킹 상태)

5. **알림**: 기존 유지 + 매체사 출처 정보 추가 (`매체사명 · n시간 전`)

6. **`scheduleAlerts` 제거**: 기존 ops 픽스처의 `scheduleAlerts` 필드와 타입은 삭제. 해당 위젯은 신규 섹션들로 대체됨.

7. **레이아웃**: `bodySimple` → 2×2 그리드로 변경

**픽스처 수정** (`dashboard.json` > `ops` — 전체 교체):
```json
"stats": [
  { "label": "관리 매체사", "value": 3 },
  { "label": "진행 캠페인", "value": 12 },
  { "label": "이번주 편성", "value": 7 },
  { "label": "미처리 알림", "value": 3 }
],
"managedCompanies": [
  { "id": "c1", "name": "시티미디어", "mediaCount": 8, "status": "ok" },
  { "id": "c2", "name": "스크린에이드", "mediaCount": 5, "status": "warn", "detail": "편성 지연" },
  { "id": "c3", "name": "아웃도어플러스", "mediaCount": 12, "status": "ok" }
],
"weeklyScheduleProgress": { "done": 5, "total": 7 },
"recentSchedules": [
  { "id": "sch1", "title": "현대카드 4월 편성", "status": "done" },
  { "id": "sch2", "title": "4월 2주차 동기화", "status": "delayed" }
],
"todayTasks": [
  { "id": "t1", "title": "스크린에이드 편성 동기화 확인", "priority": "urgent", "done": false },
  { "id": "t2", "title": "삼성전자 캠페인 편성표 제출", "priority": "today", "done": false },
  { "id": "t3", "title": "SK 5월 캠페인 초안 작성", "priority": "normal", "done": true }
]
```

---

### 3-3. 영업대행사 대시보드

**변경 사항:**

1. **뷰 분리**: `OpsView` 공유 → `SalesView` 컴포넌트 신규 생성

2. **통계 카드**: 관리 캠페인 / 검수 대기 소재 / 이번달 집행 (3개, 역할 특화)

3. **담당 캠페인 현황** (신규 섹션, 역할 특화)
   - 캠페인명 + 상태 배지 목록
   - 우상단 "캠페인 →" 링크

4. **소재 검수 현황** (신규 섹션)
   - 매체사 뷰와 동일 컴포넌트 재사용 가능
   - 진행률 바 + 예상 완료 시간

5. **편성 알림 제거**: 영업대행사는 편성 접근 권한 없음

**픽스처 수정** (`dashboard.json` > `sales`):
기존 `scheduleAlerts` 필드 제거. `notifications`는 유지.

```json
"stats": [
  { "label": "담당 캠페인", "value": 9 },
  { "label": "검수 대기 소재", "value": 2 },
  { "label": "이번달 집행", "value": 5 }
],
"campaigns": [
  { "id": "cp1", "name": "삼성전자 갤럭시 S25", "status": "active" },
  { "id": "cp2", "name": "현대카드 ZERO", "status": "reviewing" },
  { "id": "cp3", "name": "LG전자 올레드 TV", "status": "draft" }
],
"pendingMaterials": [
  { "id": "mat1", "name": "현대카드 ZERO 15초", "status": "reviewing", "progress": 60, "eta": "오후 3시경" },
  { "id": "mat2", "name": "LG 올레드 30초", "status": "pending", "progress": 0, "eta": null }
],
"notifications": [
  { "id": "n1", "text": "캠페인 승인 요청", "time": "2시간 전", "read": false }
]
```

---

## 4. 타입 변경

`src/types/dashboard.ts`에 신규 필드 추가:

```typescript
// 공통
interface SyncItem { id: string; name: string; status: 'synced' | 'delayed' | 'failed'; detail?: string }
interface ScheduleItem { id: string; date: string; title: string; status: 'confirmed' | 'reviewing' | 'pending' }
interface PendingMaterial { id: string; name: string; status: 'reviewing' | 'pending'; progress: number; eta: string | null }

// MediaDashboard 추가
syncStatus: SyncItem[]
weeklySchedule: ScheduleItem[]
// pendingMaterials: 기존 타입 → PendingMaterial[]로 교체

// OpsDashboard 추가
interface ManagedCompany { id: string; name: string; mediaCount: number; status: 'ok' | 'warn' | 'error'; detail?: string }
interface TodoTask { id: string; title: string; priority: 'urgent' | 'today' | 'normal'; done: boolean }
managedCompanies: ManagedCompany[]
weeklyScheduleProgress: { done: number; total: number }
recentSchedules: { id: string; title: string; status: 'done' | 'delayed' | 'pending' }[]
todayTasks: TodoTask[]

// SalesDashboard (신규)
interface SalesDashboard {
  stats: { label: string; value: number; unit?: string }[]
  campaigns: { id: string; name: string; status: 'active' | 'reviewing' | 'draft' | 'ended' }[]
  pendingMaterials: PendingMaterial[]
  notifications: { id: string; text: string; time: string; read: boolean }[]
}
```

---

## 5. 시각 품질 개선 원칙

어드민 스타일을 기준으로 나머지 역할도 동일한 수준으로 맞춘다.

- **카드**: `background: white`, `border: 1px solid var(--color-border-default)`, `border-radius: var(--radius-lg)`, `box-shadow: var(--shadow-sm)` — 현재 `bodySimple`의 `.section`이 이미 적용 중이므로 그대로 유지
- **섹션 헤더**: `font-size: var(--text-base)`, `font-weight: 700` — 현재보다 통일
- **상태 강조 행**: 경고·이상 항목은 배경색(`warning-50` / `error-50`)으로 인라인 강조, 별도 아이콘 없이 색으로만 표현
- **빈 상태**: 데이터 없을 때 "없음" 문자열 대신 `font-size: var(--text-sm); color: var(--color-neutral-400)` 안내 문구 표시
- **섹션 내 링크**: 우상단 `font-size: var(--text-xs); color: var(--color-primary-500)` 패턴 통일

---

## 6. 변경 파일 목록

| 파일 | 변경 유형 |
|------|---------|
| `src/types/dashboard.ts` | 타입 추가 |
| `src/mocks/fixtures/dashboard.json` | 픽스처 데이터 추가 |
| `src/mocks/handlers/dashboard.ts` | 필요시 핸들러 수정 |
| `src/app/(dashboard)/page.tsx` | MediaView·OpsView 고도화, SalesView 신규 |
| `src/app/(dashboard)/page.module.css` | 신규 위젯 스타일 추가 |

---

## 7. 범위 외

- 어드민 대시보드: 변경 없음
- 편성관리 화면 UI 개선: 별도 작업으로 분리
- 실제 API 연동: 모킹 범위 내 구현만
