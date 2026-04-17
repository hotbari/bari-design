# 소재 상세 (`material-detail.html`)

## 레이아웃 구조

- **GNB**: 브레드크럼 (소재 관리 › {소재명}) + 우측 날짜 표시 + 알림벨
- **바디 상단**: 2컬럼 그리드 (5fr : 7fr)
  - 좌: 미리보기 카드
  - 우: 소재 정보 + 검수 타임라인 카드
- **바디 하단**: 편성 연결 정보 섹션 카드 (편성 테이블 + 버전 이력 접기/펼치기)
- **참조용 섹션**: 검수 실패 상태 UI 미리보기 (별도 섹션 카드)

---

## 좌측: 미리보기 카드

### 영상 영역

| 요소 | 내용 |
|------|------|
| 비율 | 16:9 (`aspect-ratio: 16/9`) |
| 배경 | 어두운 배경 (`oklch(0.12 0.015 80)`) |
| 재생 버튼 | 중앙 원형 플레이 버튼 (hover 시 밝아짐) |
| 재생 시간 | 우하단 오버레이 배지 (예: `0:30`) |

### 파일 메타 목록 (key-value 행)

| 키 | 표시 데이터 | 비고 |
|----|------------|------|
| 파일명 | 파일명 (monospace) | |
| 코덱 | 코덱 정보 (예: H.264 / AAC) | |
| 프레임레이트 | fps 값 (예: 30fps) | |
| 파일 크기 | 크기 (예: 12.4 MB) | |

- 키 너비: 100px 고정, `neutral-500`, xs, font-weight:500
- 값: `neutral-800`, sm, font-weight:500

### 액션 버튼

| 버튼 | 스타일 | 동작 |
|------|--------|------|
| 교체 | `btn btn-secondary` (xs) | 교체 업로드 드로어 열기 |
| 삭제 | `btn btn-danger` (xs) | 삭제 확인 모달 열기 |

---

## 우측: 소재 정보 + 검수 타임라인 카드

### 소재 정보 그리드 (2컬럼)

| 레이블 | 표시 데이터 | 비고 |
|--------|------------|------|
| 소재명 | 소재명 텍스트 | font-weight:600 |
| 광고주 | 광고주명 | font-weight:600 |
| 매체 | 매체명 | font-weight:600 |
| 해상도 | 해상도 (예: 1920 × 1080 px) | monospace |
| 재생 시간 | 재생 시간 (예: 30초) | font-weight:600 |
| 운영 기간 | 날짜 범위 (예: 04.01 – 04.30) | font-weight:600 |
| 검수 상태 | 검수 상태 배지 | 배지 참조 |
| 편성 연결 | 편성 연결 상태 배지 | 배지 참조 |

- 레이블: 11px, `neutral-400`, font-weight:500
- 값: sm, `neutral-900`, font-weight:600
- 섹션 타이틀: xs, font-weight:700, `neutral-500`, uppercase, letter-spacing:0.06em

### 검수 타임라인

타임라인 노드 상태별 스타일:

| 상태 | 노드 스타일 |
|------|-----------|
| `done` | 채워진 원 (`primary-500`), 흰색 체크 아이콘 |
| `failed` | 채워진 원 (`error-500`), 흰색 X 아이콘 |
| `current` | 흰 원 + 파란 테두리 (`oklch(0.55 0.15 220)`), 스피너 |
| `waiting` | 흰 원 + 노란 테두리 (`warning-500`) |
| `pending` | 흰 원 + 회색 테두리 (`rgba(0,0,0,0.15)`) |

타임라인 단계 (정상 완료 시):
1. 업로드 완료 — `done`
2. 자동 검수 — `done` (소요 시간 표시: `neutral-400`, xs)
3. 검수 완료 — `done`

각 단계: 레이블 (sm, font-weight:600) + 시각 (xs, `neutral-500`)

---

## 편성 연결 정보 테이블

섹션 헤더: 제목 "편성 연결 정보" + 건수 카운터 (예: "2건")

### 테이블 컬럼

| # | 헤더 | 표시 데이터 | 비고 |
|---|------|------------|------|
| 1 | 매체명 | 매체명 텍스트 | |
| 2 | 편성표명 | 편성표명 링크 | `primary-600`, font-weight:600, hover underline |
| 3 | 편성 상태 | 편성 상태 배지 | `badge-schedule-on` / `badge-schedule-wait` |
| 4 | 기간 | 날짜 범위 (예: 04.01 – 04.07) | xs, `neutral-600` |

### 편성 상태 배지

| 값 | 스타일 | 아이콘 |
|----|--------|--------|
| 송출중 | `badge-schedule-on`: `primary-50` bg, `primary-700` 텍스트, `primary` 테두리 | 전파 아이콘 |
| 편성대기 | `badge-schedule-wait`: `neutral-100` bg, `neutral-600` 텍스트 | 없음 |

---

## 버전 이력 (접기/펼치기)

- 기본 상태: 접힘 (`aria-expanded="false"`)
- 헤더: "버전 이력" + 버전 수 (예: "(2버전)") + chevron 아이콘
- 토글 시 `grid-template-rows` 애니메이션으로 펼침

### 버전 이력 테이블 컬럼

| # | 헤더 | 표시 데이터 | 비고 |
|---|------|------------|------|
| 1 | 버전 | v{N} + "(현재)" 텍스트 | 현재 버전에만 "(현재)" 표시 |
| 2 | 파일명 | 파일명 | monospace, xs |
| 3 | 교체일 | 날짜 (예: 04.03) | xs, `neutral-500` |
| 4 | 검수 결과 | 검수 상태 배지 | 10px, padding:2px 7px |
| 5 | (액션) | 되돌리기 버튼 또는 — | 현재 버전 제외, `btn btn-secondary` |

---

## 검수 실패 패널 (fail-panel)

검수 실패(`failed`) 단계에서 타임라인 아래 인라인 표시:

| 요소 | 내용 |
|------|------|
| 실패 사유 레이블 | xs, font-weight:700, `error-500` |
| 실패 사유 본문 | sm, `neutral-800`, line-height:1.5 — 규격 불일치 등 상세 설명 |
| 수정 가이드 레이블 | xs, font-weight:700, `neutral-700` |
| 수정 가이드 본문 | sm, `neutral-700`, line-height:1.5 |
| 수정 가이드 복사 버튼 | `btn-copy-guide`: 흰 배경, 테두리, xs, 클립보드 복사 아이콘 |
| 재업로드 버튼 | `btn-reupload`: `error-500` bg, 흰 텍스트, xs |

패널 스타일: `error-50` bg, `oklch(0.88 0.05 25)` 테두리, `radius-md`

---

## 삭제 확인 모달

| 요소 | 내용 |
|------|------|
| 제목 | "소재 삭제" |
| 본문 | 삭제 확인 메시지 + `error-500` 강조 텍스트 ("재생목록 N건에서 해당 구좌가 '삭제됨'으로 표시됩니다.") |
| 취소 버튼 | `btn btn-secondary` |
| 삭제 버튼 | `btn-destructive`: `error-500` bg, 흰 텍스트 |

- ESC 키 / 배경 클릭 시 닫힘
- 모달 열리면 삭제 버튼에 포커스

---

## 배지 열거값

```
// 검수 상태 배지
review: 'done' | 'reviewing' | 'failed' | 'manual' | 'on-air' | 'waiting'

// CSS 클래스
.badge-done      — primary-50 bg, primary-700 텍스트
.badge-reviewing — oklch(0.95 0.03 220) bg, oklch(0.40 0.12 220) 텍스트
.badge-failed    — error-50 bg, error-500 텍스트
.badge-manual    — warning-50 bg, warning-600 텍스트
.badge-on-air    — primary-50 bg, primary-600 텍스트, font-weight:700
.badge-waiting   — neutral-100 bg, neutral-600 텍스트

// 편성 상태 배지
schedule: 'on' | 'wait'
.badge-schedule-on   — primary-50 bg, primary-700 텍스트
.badge-schedule-wait — neutral-100 bg, neutral-600 텍스트
```

---

## 기타 UI

- **토스트**: 하단 중앙 고정, 2.8초 후 자동 닫힘 (`role="status"`, `aria-live="polite"`)
- **교체 업로드**: 드로어 형태 (프로토타입에서는 toast로 대체)
- **버전 되돌리기**: 재검수 후 자동 적용 (toast 안내)
- **행 클릭**: 없음 (편성표명 링크만 클릭 가능)
- **페이지네이션**: 없음 (상세 페이지)
- **주요 액션**: 교체(btn-secondary), 삭제(btn-danger) — 미리보기 카드 하단
