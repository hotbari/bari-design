# S-02: 대시보드 — 어드민

생성일: 2026-04-08
출처 UC: UC-01, UC-03
접근 역할: 어드민

---

## 0. 매체 상태 열거형 (Canonical Status Enum)

모든 UI 요소(stat-card / 헬스체크 뱃지 / 지도 마커 / 필터)는 아래 단일 열거형을 따른다.

| 값 | 표시명 | 색상 토큰 | 의미 |
|----|--------|----------|------|
| `online` | 온라인 | `--color-interactive-hover` (primary-600) | 정상 동작 중 |
| `delayed` | 지연 | `--color-status-warning` (warning-500) | 동기화 지연 또는 응답 지연 |
| `error` | 이상 | `--color-status-error` (error-500) | 오프라인 또는 이상 감지 |
| `offline` | 오프라인 | neutral-400 | 연결 끊김 (에러 아님, 의도적 오프라인 포함) |
| `inactive` | 비활성 | neutral-300 | 운영 중지 매체 |

stat-card 내 "전체" 카드는 위 5개 상태의 합산. "온라인" 카드는 `online` + `delayed` 합산 (지연도 연결 중이므로). "오프라인" 카드는 `error` + `offline` 합산. "비활성" 카드는 `inactive`.

---

## 1. 개요

어드민 전용 대시보드. 전체 매체 상태, 캠페인·편성 현황, 헬스체크 이상 목록, 어드민 전용 시스템 상태(동기화·배치·Slack)를 한 화면에서 파악. 우측 Naver Maps로 매체 위치와 상태를 지도 위에서 실시간 확인.

---

## 2. 레이아웃

**3열 구조:**
- 좌측: 사이드바 (width 200px, 고정)
- 중앙-좌: 스크롤 패널 (flex: 60%, overflow-y: auto)
- 중앙-우: Naver Maps 패널 (flex: 40%, 고정)

**수직 구조 (중앙 영역):**
- GNB (height 52px, 고정)
- 바디 (flex: 1, overflow hidden) → 좌 스크롤 + 우 지도 분할

---

## 3. 컴포넌트

### 사이드바

- 배경: `oklch(0.16 0.02 155)` (다크 그린-틴티드)
- 너비 200px, 좌측 고정
- 로고 영역: 28×28 브랜드 마크 + "Bari CMS" (15px, 700, white)
- 네비게이션 항목 (어드민 전용 구성 — 타 역할의 네비게이션은 각 역할 대시보드 명세 참조):
  - 대시보드 (active), 매체 관리, 소재 관리, 캠페인 관리, 편성 관리, 알림 센터, 리포트
  - active: 배경 `oklch(1 0 0 / 0.08)`, 우측 2px border `--color-interactive-primary`
  - 비활성: `oklch(1 0 0 / 0.55)` 텍스트
  - 알림 센터: 미읽음 뱃지 (빨간 원형, 숫자)
- 하단 고정: 역할명 + 사용자명. 클릭 → S-29 개인 설정 페이지로 이동 (전체 영역 클릭 가능, cursor: pointer)

### GNB

- 배경: white, 하단 border `--color-border-default`
- 좌: 페이지 제목 "대시보드" (15px, 700)
- 우: 날짜 텍스트 | 새로고침 버튼 | 알림 벨 (미읽음 시 빨간 점)

### 이상 감지 배너 (조건부)

- 위치: 좌 패널 최상단
- **이상 항목이 없을 때 미표시** (정상 운영 중에는 배너 없음)
- 배경: `--color-status-error-bg`, border 1px `--color-status-error / 20%`, border-radius 8px
- 내용: 제목 "즉시 확인 필요한 이상이 감지됐습니다" + 항목 목록
- 항목 종류:
  - 동기화 미완료 편성표 N건 → 편성 관리로 딥링크
  - 배치 비정상 캠페인 N건 → 캠페인 관리로 딥링크
  - Slack 연동 응답 지연 (마지막 성공 N분 전) → 설정으로 딥링크 **[어드민 전용]**
- 각 항목에 링크 버튼 ("→ 확인" / "→ 설정")
- `role="alert"` — 실시간 갱신 시 스크린리더 알림

### 매체 상태 섹션 (실시간)

섹션 헤더: "매체 상태" + "실시간" 레이블

4개 stat-card 가로 배치:

| 카드 | 값 | 보조 |
|------|-----|------|
| 전체 | 총 매체 수 | 온라인 N 칩 |
| 온라인 | 온라인 수 (primary-600) | 정상 N / 지연 N 칩 |
| 오프라인 | 오프라인 수 (neutral-500) | 이상 N 칩 |
| 비활성 | 비활성 수 (neutral-400) | — |

각 카드 클릭 → 해당 상태로 필터된 매체 목록 페이지

### 캠페인 / 편성 섹션 (기간 필터)

섹션 헤더: "캠페인 / 편성" + 기간 선택 드롭다운 (최근 7일 / 최근 30일)

2열 stat-card:
- 캠페인: 총 수 + 집행중/초안/완료 칩
- 편성표: 총 수 + 적용중/예약/종료 칩

### 헬스체크 이상 섹션 (실시간)

섹션 헤더: "헬스체크 이상" + "전체 보기 →" 링크 (매체 목록으로)

data-card 리스트:
- 상태 닷(빨강/노랑) + 매체명 + 상태 메시지 + 뱃지
- 정렬: 심각도 내림차순 (이상 감지 → 지연 → ...)
- 이상 없으면: "현재 이상 매체가 없습니다." 빈 상태 행
- 최대 5건 표시. 초과 시 "N건 더 보기" 링크

뱃지 종류:
- `이상 감지`: error 색상 (`error` 상태)
- `오프라인`: neutral 색상 (`offline` 상태 — 연결 끊김)
- `지연`: warning 색상 (`delayed` 상태)

### 시스템 상태 섹션 (어드민 전용, 실시간)

섹션 헤더: "시스템 상태" + `어드민` 역할 뱃지

3열 sys-card:
- **편성 동기화**: 마지막 완료 시각 또는 "미완료 N건" (에러 색)
- **배치 실행**: 마지막 실행 N분 전 + 비정상 N건 (경고 색) 또는 "정상"
- **Slack 연동**: 마지막 성공 N분 전 + 지연 여부

각 카드: 상태 아이콘 (● 정상 / ▲ 경고 / ✕ 오류) + 상태 텍스트

### 최근 알림 섹션

섹션 헤더: "최근 알림" + "알림 센터 →" 링크

data-card 리스트, 최대 5건:
- 미읽음 점 (primary-500) / 읽음 점 (neutral-300)
- 알림 내용 텍스트 + 상대 시각 (N분 전 / N시간 전)
- 클릭 → 알림 센터로 이동

### Naver Maps 패널

- 헤더: "매체 위치" + 필터 버튼 + 전체화면 버튼
- 지도 영역: Naver Maps JavaScript API v3
  - 초기 뷰: 서울 중심 (위도 37.5665, 경도 126.9780), zoom 11
  - 매체별 커스텀 마커 (섹션 0 enum 기준: `online` primary-600 / `delayed` warning-500 / `error` error-500 / `offline` neutral-400 / `inactive` neutral-300)
  - 마커 클릭 → 인포윈도우: 매체명 + 상태 + 마지막 동기화 (상대 시각, 예: "14분 전")
- 하단 범례: 온라인 / 지연 / 이상 / 오프라인 / 비활성 색 닷 + 레이블

**필터 기능:**
- 상태별 필터 (전체 / 온라인 / 지연 / 이상 / 오프라인 / 비활성) — 섹션 0 enum 5개 + 전체
- 적용 시 해당 상태 마커만 표시, 나머지 opacity 0.3으로 dim

---

## 4. 상태 정의

| 상태 | 트리거 | 처리 |
|------|--------|------|
| **정상** | 이상 항목 없음 | 이상 감지 배너 미표시 |
| **이상 있음** | 동기화/배치/Slack 이상 | 이상 감지 배너 표시 |
| **로딩** | 페이지 진입 / 새로고침 | 각 섹션 스켈레톤 + 스피너 |
| **데이터 없음** | 매체 0개 등록 | 섹션별 빈 상태 문구 |

### 새로고침 동작

- GNB 새로고침 버튼: 전체 데이터 재요청. 버튼 스피너 표시 중 disabled. **재로딩 중 스탈 데이터는 유지** — 각 섹션 카드 위에 개별 스켈레톤 오버레이 적용, 데이터가 공백이 되지 않음
- 실시간 섹션 (매체 상태, 헬스체크, 시스템 상태, 알림): 30초 자동 폴링
- 기간 필터 섹션 (캠페인/편성): 폴링 없음, 새로고침 또는 필터 변경 시만 재요청

### 폴링 실패 처리

1. 실패 시 3초 후 자동 재시도 (최대 3회)
2. 3회 후에도 실패 → 해당 섹션 하단에 인라인 경고: "데이터를 불러오지 못했습니다. 마지막 갱신: {시각}"
3. 스탈 데이터는 dim 처리 (opacity 0.5)로 유지 — 섹션 공백 없음
4. 수동 새로고침 버튼으로 언제든 재시도 가능

---

## 5. 역할 분기

| 항목 | 어드민 | 타 역할 |
|------|--------|--------|
| 시스템 상태 섹션 | 표시 | 미표시 |
| 이상 감지 배너 내 Slack 항목 | 표시 | 미표시 |
| 매체 수 | 전체 | 담당 매체만 |

---

## 6. 접근성

- 사이드바 `<nav>` 태그, `aria-label="주 메뉴"`
- 현재 활성 항목: `aria-current="page"`
- 이상 감지 배너: `role="alert"` (비어있을 때는 DOM 제거 또는 `aria-hidden="true"`)
- stat-card: 숫자만 있는 경우 시각적 레이블과 `aria-label` 조합으로 컨텍스트 제공
  - 예: `<div aria-label="온라인 매체: 131개">`
- 지도 패널: `role="region"`, `aria-label="매체 위치 지도"`. 지도 접근 불가 환경을 위해 헬스체크 이상 목록으로 대체 정보 제공
- 알림 벨 dot: `aria-label="미읽음 알림 N건"`
- Tab 순서: GNB → 이상 배너 링크 → 매체 상태 카드 → 캠페인/편성 → 헬스체크 → 시스템 상태 → 알림 → 지도 필터/전체화면

---

## 7. 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 이상 항목 없음 | 이상 배너 미표시. 정상 운영 메시지 불필요 |
| 매체 0개 | 매체 상태 카드: "0" + 빈 상태 안내 텍스트 |
| 헬스체크 이상 없음 | "현재 이상 매체가 없습니다." 빈 상태 행 |
| API 오류 (폴링 실패) | 섹션별 인라인 경고 + 스탈 데이터 dim 처리. 재시도 3회 후 "데이터를 불러오지 못했습니다. 마지막 갱신: {시각}" 표시 (Section 4 폴링 실패 처리 참조) |
| Naver Maps 로드 실패 | 지도 영역에 "지도를 불러올 수 없습니다" 메시지 + 재시도 버튼 |
| 알림 0건 | "최근 알림이 없습니다." |
| 매체 148개 이상 (대량 마커) | 지도 클러스터링 적용 (Naver Maps MarkerClustering, 줌 레벨 기반) |

---

## 8. 데이터 / API (설계 참조용)

### 매체 상태 요약

```
GET /api/v1/dashboard/media-status
응답: {
  total: number,
  byStatus: { online: n, delayed: n, error: n, offline: n, inactive: n }
}
폴링 주기: 30초
```

### 헬스체크 이상 목록

```
GET /api/v1/dashboard/health-issues?limit=5
응답: [{
  mediaId: string,
  name: string,
  status: "error" | "offline" | "delayed",  // inactive는 포함 안 함 (헬스체크 대상 아님)
  message: string,       // 예: "오프라인 2h 13m"
  severity: number       // 정렬용: 높을수록 심각 (error > offline > delayed)
}]
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

### 시스템 상태 (어드민 전용)

```
GET /api/v1/dashboard/system-status
응답: {
  sync: { pendingCount: number, lastSuccessAt: ISO8601 },
  batch: { lastRunAt: ISO8601, abnormalCount: number },
  slack: { lastSuccessAt: ISO8601, isDelayed: boolean }
}
폴링 주기: 30초
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

### Naver Maps 매체 좌표

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
