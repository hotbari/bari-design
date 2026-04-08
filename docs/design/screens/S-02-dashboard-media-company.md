# S-02: 대시보드 — 매체사

생성일: 2026-04-08
출처 UC: UC-29
접근 역할: 매체사

---

## 0. 매체 상태 열거형 (Canonical Status Enum)

S-02-dashboard-admin.md 섹션 0과 동일한 단일 출처 enum을 따른다. 아래는 참조용 전문 복사본이며, 두 파일 간 불일치 발생 시 admin spec이 정본이다.

| 값 | 표시명 | 색상 토큰 | 의미 |
|----|--------|----------|------|
| `online` | 온라인 | `--color-interactive-hover` (primary-600) | 정상 동작 중 |
| `delayed` | 지연 | `--color-status-warning` (warning-500) | 동기화 지연 또는 응답 지연 |
| `error` | 이상 | `--color-status-error` (error-500) | 오프라인 또는 이상 감지 |
| `offline` | 오프라인 | neutral-400 | 연결 끊김 (에러 아님, 의도적 오프라인 포함) |
| `inactive` | 비활성 | neutral-300 | 운영 중지 매체 |

---

## 1. 개요

매체사 전용 대시보드. **"편성이 현장에 실제로 반영됐나?"** 라는 핵심 불안을 해소하는 것이 주목적. 동기화 현황 도넛이 랜딩 시 첫 시선을 받으며, 미동기화 매체 목록으로 즉시 행동을 유도한다. 소재 검수 현황을 추가해 매체사의 일일 운영 루프(편성 확인 → 소재 상태 확인 → 이상 대응)를 한 화면에서 지원한다.

어드민 대시보드(S-02-dashboard-admin.md)와 레이아웃 패턴을 공유하되 다음을 차별화한다:
- **추가**: 동기화 히어로 섹션, 소재 검수 현황 섹션, 미동기화 매체 섹션
- **제거**: 시스템 상태 섹션, 매체 상태 4카드 섹션, 이상 배너 내 Slack 항목
- **축소**: 지도 비율 40% → 35%, 지도 필터 없음

---

## 2. 레이아웃

**3열 구조:**
- 좌측: 사이드바 (width 240px, 고정 — design-foundation.md 3.1 기준)
- 중앙-좌: 스크롤 패널 (flex: 65%, overflow-y: auto)
- 중앙-우: Naver Maps 패널 (flex: 35%, 고정)

**수직 구조 (중앙 영역):**
- GNB (height 56px, 고정 — design-foundation.md 3.1 기준)
- 바디 (flex: 1, overflow hidden) → 좌 스크롤 + 우 지도 분할

---

## 3. 컴포넌트

### 사이드바 (GNB 역할)

IA 섹션 3의 GNB/LNB 2-depth 구조를 사이드바 단일 패널에서 구현한다.

- 배경: `oklch(0.16 0.02 155)` (다크 그린-틴티드)
- 너비 240px (expanded) / 64px (collapsed), 좌측 고정
- 로고 영역: 28×28 브랜드 마크 + "Bari CMS" (`--text-sm`, 700, white)

**GNB 항목 (매체사 역할 — 7개):**
대시보드 / 매체 관리 / 소재 관리 / 캠페인 관리 / 편성 관리 / 리포트 / 알림 센터

- active: 배경 `oklch(1 0 0 / 0.08)`, 우측 2px border `--color-interactive-primary`
- 비활성: `oklch(1 0 0 / 0.55)` 텍스트
- 알림 센터: 미읽음 뱃지 (빨간 원형, 숫자) — S-26 알림 센터 패널 진입점

**LNB 서브항목 (GNB 항목 선택 시 확장):**
- 대시보드: 서브항목 없음
- 매체 관리: 매체 목록(S-06) / 매체 그룹(S-11) / SSP 연동(S-09)
- 소재 관리: 소재 목록(S-12) / 소재 규격 안내(S-14)
- 캠페인 관리: 캠페인 목록(S-15)
- 편성 관리: 재생목록(S-18) / 편성표(S-20) / 싱크 송출(S-23) / 잔여 구좌 조회(S-25)
- 리포트: 리포트 목록(S-27) / 리포트 생성(S-28)
- 설정(하단): 사용자 관리(S-03) / 사용자 초대(S-04) / 내 정보/알림(S-29)

현재 화면이 대시보드이므로 LNB 서브항목 미표시 (대시보드는 서브항목 없음).

**하단 고정:** 역할명 + 사용자명. 클릭 → S-29 개인 설정

### GNB (상단 바)

- 배경: white, 하단 border `--color-border-default`
- 좌: 페이지 제목 "대시보드" (`--text-md`, 700)
- 우: 날짜 텍스트 | 새로고침 버튼 | 알림 벨 (미읽음 시 빨간 점)

### 이상 감지 배너 (조건부)

- 위치: 좌 패널 최상단 (다크 히어로 위)
- 이상 항목이 없을 때 미표시
- 배경: `--color-status-error-bg`, border 1px `--color-status-error / 20%`, border-radius 8px
- 항목 종류:
  - 동기화 미완료 편성표 N건 → 편성 관리로 딥링크
  - 배치 비정상 캠페인 N건 → 캠페인 관리로 딥링크
  - *(Slack 항목 없음 — 매체사 역할 미노출)*
- `role="alert"` — 실시간 갱신 시 스크린리더 알림

### 동기화 히어로 (실시간)

좌 패널 최상단 핵심 섹션. 배경 `oklch(0.16 0.06 155)` (다크 그린), border-radius 10px, padding `--space-4`.

**구성 (가로 배치):**
- 좌: 도넛 차트 (지름 72px)
  - **4개 세그먼트** (열거형 값별 개별 구분):
    - `online`: primary-500 (정상 반영)
    - `delayed`: warning-500 (반영 지연)
    - `error`: error-500 (이상)
    - `offline` + `inactive`: neutral-400 (미운영)
  - 중앙 텍스트: `online` 대수 (`--text-md`, 800, white) + "대 정상" (`--text-xs`, neutral-300)
  - **색각이상 대응**: 각 세그먼트에 패턴 오버레이 적용 (정상: 없음 / 지연: 사선 stripe / 이상: 점 / 오프라인: 격자). 세그먼트 hover 시 강조 링(2px white) 표시
  - `aria-label`: "편성 동기화 현황: 총 N대 — 정상 N / 지연 N / 이상 N / 오프라인+비활성 N"
  - **세그먼트 클릭**: 각 세그먼트 클릭 → 매체 목록(S-06) 해당 상태 필터 (cursor: pointer, hover 시 강조 링)
- 우: 텍스트 요약
  - 상단: "편성 동기화 현황 — 총 N대" (`--text-xs`, `oklch(1 0 0 / 0.45)`)
  - 중단: "N대 정상 반영 중" (`--text-lg`, 700, primary-300)
  - 하단: 상태별 칩 4개 (정상 N / 지연 N / 이상 N / 오프라인 N)
- 우하단: "마지막 확인 N분 전 · 이상 없음" (`--text-xs`, `oklch(1 0 0 / 0.3)`) — 정상 상태 안심 문구. 미동기화 있으면 "N대 미반영" 으로 대체

**칩 스타일** (`--text-xs`, border-radius 3px, padding 2px 6px):
- 정상: `rgba(3,199,90,0.15)` 배경 + primary-300 텍스트
- 지연: `rgba(232,160,48,0.2)` 배경 + warning-400 텍스트
- 이상: `rgba(230,35,24,0.2)` 배경 + error-300 텍스트
- 오프라인: `rgba(255,255,255,0.08)` 배경 + neutral-300 텍스트

각 칩 클릭 → 매체 목록(S-06) 해당 상태 필터 적용

### 미동기화 매체 섹션 (실시간, 조건부)

- 위치: 히어로 바로 아래
- **표시 대상**: `error`, `delayed`, `offline` 상태 매체 — 세 상태 모두 편성이 현장에 정상 반영되지 않은 상태이므로 포함. `inactive`는 의도적 운영 중지이므로 제외.
- 미동기화 0건이면 **섹션 미표시**
- 좌측 border 3px `--color-status-error`
- 섹션 헤더: "미동기화 매체" (`--text-sm`, 700) + "전체 보기 →" 링크 (매체 목록 해당 상태 필터)

**항목 행:**
- 상태 닷 + 매체명 (`--text-sm`) + 상태 뱃지 + 경과 시간 (`--text-xs`, neutral-500)
- `error` 항목 배경: `--color-status-error-bg` (error-50)
- `delayed` 항목 배경: `--color-status-warning-bg` (warning-50)
- `offline` 항목 배경: neutral-50
- 정렬: 심각도 내림차순 (`error` → `offline` → `delayed`) — 정렬 키는 API 응답의 `severity` 필드 (섹션 8 참조)
- 최대 5건. 초과 시 "N건 더 보기" 링크

### 소재 검수 현황 섹션 (실시간)

- 섹션 헤더: "소재 검수 현황" (`--text-sm`, 700) + "소재 목록 →" 링크 (S-12)

3개 stat-card 가로 배치:

| 카드 | 값 | 숫자 색 | 배경 |
|------|-----|--------|------|
| 검수 대기 | 대기 건수 | warning-500 | warning-50 |
| 검수 중 | 진행 건수 | primary-500 | primary-50 |
| 완료 | 완료 건수 | neutral-400 | neutral-50 |

- 검수 중 소재가 있으면 3카드 아래에 인라인 메시지:
  - 소재 1건: `"검수중 「{소재명}」 — 예상 완료 약 N분"` (`--text-xs`, warning-500 배경 warning-50)
  - 소재 2건 이상: `"검수중 N건 — 가장 오래된 「{소재명}」 약 N분 후 완료"` (동일 스타일)
  - 예상 완료 시간을 제공할 수 없는 경우 (`estimatedMinutes: null`): 시간 표시 생략, "검수중 「{소재명}」" 까지만 표시
- 각 카드 클릭 → S-12 소재 목록 해당 검수 상태 필터

### 캠페인 / 편성 섹션 (기간 필터)

어드민 대시보드와 동일. 섹션 헤더: "캠페인 / 편성" + 기간 선택 드롭다운 (최근 7일 / 최근 30일).

2열 stat-card:
- 캠페인: 총 수 + 집행중/초안/완료 칩
- 편성표: 총 수 + 적용중/예약/종료 칩

### 최근 알림 섹션

어드민 대시보드와 동일. 최대 5건.
- 미읽음 점 (primary-500) / 읽음 점 (neutral-300)
- 알림 내용 텍스트 (`--text-sm`) + 상대 시각 (`--text-xs`, neutral-500)
- 클릭 → 알림 센터(S-26)
- 0건: "최근 알림이 없습니다." (`--text-sm`, neutral-400)

### Naver Maps 패널 (우측 고정)

- 헤더: "매체 위치" (`--text-sm`, 700) + 전체화면 버튼
- 지도 영역: Naver Maps JavaScript API v3
  - 초기 뷰: 자사 매체 위치 기준 `fitBounds` (마커 바운딩 박스). 최대 zoom 15, 최소 zoom 9. 매체 1대이면 zoom 13 고정. 매체 0대이면 서울 중심 fallback (위도 37.5665, 경도 126.9780, zoom 11).
  - 자사 매체만 마커 표시 (타 매체사 미표시)
  - 마커 색상: 섹션 0 enum 기준
  - 마커 클릭 → 인포윈도우: 매체명 + 상태 + 마지막 동기화 (상대 시각)
  - 필터 버튼 없음 (자사 매체 수가 적어 필터 불필요)
- 하단 범례: 온라인 / 지연 / 이상 / 오프라인 색 닷 + 레이블 (`--text-xs`)

---

## 4. 상태 정의

| 상태 | 트리거 | 처리 |
|------|--------|------|
| **정상** | 미동기화 매체 없음, 이상 없음 | 이상 배너·미동기화 섹션 미표시 |
| **이상 있음** | 동기화/배치 이상 | 이상 감지 배너 표시 |
| **미동기화 있음** | error/offline/delayed 매체 존재 | 미동기화 섹션 표시 |
| **로딩** | 페이지 진입 / 새로고침 | 각 섹션 스켈레톤 + 스피너 |
| **데이터 없음** | 매체 0개 등록 | 각 섹션 빈 상태 문구 |

> 소재 검수 상태(`pending` / `inReview` / `completed`)는 이상 배너를 트리거하지 않는다. `inReview` 상태가 오래 지속되는 경우도 포함. 검수 현황은 별도 섹션에서만 표시.

### 새로고침 동작

- GNB 새로고침 버튼: 전체 데이터 재요청. 버튼 스피너 중 disabled. 스탈 데이터 유지 (어드민과 동일)
- 실시간 섹션 (히어로, 미동기화, 소재 검수, 최근 알림): 30초 자동 폴링
- 기간 필터 섹션 (캠페인/편성): 폴링 없음

### 폴링 실패 처리

어드민 대시보드와 동일: 3초 후 재시도 (최대 3회) → 실패 시 섹션 하단 인라인 경고 + 스탈 데이터 dim (opacity 0.5).

---

## 5. 역할 분기 (어드민 대비)

| 항목 | 어드민 | 매체사 |
|------|--------|--------|
| 매체 상태 4카드 섹션 | 표시 | **미표시** (히어로 도넛으로 대체) |
| 동기화 히어로 | 미표시 | **표시** |
| 미동기화 매체 섹션 | 미표시 | **표시** |
| 소재 검수 현황 | 미표시 | **표시** |
| 시스템 상태 섹션 | 표시 | **미표시** |
| 이상 배너 Slack 항목 | 표시 | **미표시** |
| 지도 비율 | 40% | **35%** |
| 지도 필터 | 있음 (6개: 전체+5상태) | **없음** |
| 매체 범위 | 전체 | **자사 매체만** |

---

## 6. 접근성

- 사이드바 `<nav>` 태그, `aria-label="주 메뉴"`
- 현재 활성 항목: `aria-current="page"`
- 이상 감지 배너: `role="alert"` (비어있을 때 DOM 제거 또는 `aria-hidden="true"`)
- 동기화 히어로 도넛: `role="img"`, `aria-label="편성 동기화 현황: 총 N대 — 정상 N / 지연 N / 이상 N / 오프라인+비활성 N"`
- stat-card: `aria-label`으로 컨텍스트 제공. 예: `aria-label="소재 검수 대기: 3건"`
- 지도 패널: `role="region"`, `aria-label="매체 위치 지도"`. 지도 접근 불가 환경용 대체 정보로 미동기화 섹션 활용
- 알림 벨 dot: `aria-label="미읽음 알림 N건"`
- Tab 순서: GNB → 이상 배너 링크 → 히어로 칩 → 미동기화 목록 → 소재 검수 카드 → 캠페인/편성 → 알림 → 지도 전체화면

---

## 7. 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 미동기화 매체 없음 | 미동기화 섹션 미표시. 별도 정상 메시지 불필요 |
| 검수 중 소재 없음 | 예상 완료 시간 인라인 메시지 미표시 |
| 검수 중 소재 2건 이상 | "검수중 N건 — 가장 오래된 「{소재명}」 약 N분 후 완료" |
| `online` 0대 | 히어로 중앙 텍스트: "정상 반영 없음" (`--text-sm`, error-300) |
| `estimatedMinutes: null` | 시간 표시 생략, 소재명만 표시 |
| 매체 0개 | 히어로: "0대 정상 반영 중", 지도: 서울 중심 fallback |
| 자사 매체 1대 | 지도 zoom 13 고정, 단일 마커 중심 표시 |
| API 오류 (폴링 실패) | 섹션별 인라인 경고 + 스탈 데이터 dim. 3회 실패 후 "데이터를 불러오지 못했습니다. 마지막 갱신: {시각}" |
| Naver Maps 로드 실패 | "지도를 불러올 수 없습니다" + 재시도 버튼 |
| 알림 0건 | "최근 알림이 없습니다." (`--text-sm`, neutral-400) |
| 이상 항목 없음 | 이상 배너 미표시. 정상 운영 메시지 불필요 |

---

## 8. 데이터 / API (설계 참조용)

### 편성 동기화 현황

```
GET /api/v1/dashboard/sync-status
응답: {
  total: number,
  byStatus: { online: n, delayed: n, error: n, offline: n, inactive: n }
}
폴링 주기: 30초
```

### 미동기화 매체 목록

```
GET /api/v1/dashboard/unsynced-media?limit=5
응답: [{
  mediaId: string,
  name: string,
  status: "error" | "delayed" | "offline",
  elapsedSeconds: number,
  severity: number   // 정렬용: error > offline > delayed
}]
폴링 주기: 30초
```

### 소재 검수 현황

```
GET /api/v1/dashboard/material-review-status
응답: {
  pending: number,
  inReview: number,
  completed: number,
  inReviewItems: [{          // inReview > 0 일 때만, 배열 (복수 지원)
    name: string,
    estimatedMinutes: number | null,
    createdAt: ISO8601       // 가장 오래된 건 정렬용
  }]
}
폴링 주기: 30초
```

### 캠페인 / 편성 통계

```
GET /api/v1/dashboard/campaign-stats?range=7d|30d
응답: {
  campaigns: { total: n, active: n, draft: n, ended: n },
  schedules: { total: n, applied: n, reserved: n, ended: n }
}
폴링: 없음 (수동 갱신 또는 range 변경 시)
```

### 최근 알림

```
GET /api/v1/notifications?limit=5
응답: [{
  id: string,
  message: string,
  createdAt: ISO8601,
  read: boolean
}]
폴링 주기: 30초
```

### Naver Maps 매체 좌표 (자사만)

```
GET /api/v1/media/locations
응답: [{
  mediaId: string,
  name: string,
  lat: number,
  lng: number,
  status: "online" | "delayed" | "error" | "offline" | "inactive",
  lastSyncAt: ISO8601
}]
폴링 주기: 30초 (마커 색상 갱신)
```
