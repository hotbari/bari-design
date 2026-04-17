# 편성표 목록 (`schedule-list.html`)

## 기본 정보

- **페이지 제목**: 편성 관리
- **브레드크럼**: 편성 관리 › 편성표
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 컨텐츠: 페이지 헤더 → 필터바 → 테이블 → 페이지네이션

## 테이블 컬럼

| # | 헤더 | 표시 데이터 | 보조 텍스트 | 비고 |
|---|------|------------|------------|------|
| 1 | 편성표명 | 편성표명 (font-weight:600) | "편집중" 인디케이터 (pulsing dot) | editing-now 클래스 |
| 2 | 상태 | 상태 배지 (dot + 텍스트) | | active/pending/done |
| 3 | 우선순위 | 우선순위 배지 | | prio-1/prio-2/prio-3 |
| 4 | 적용 기간 | 날짜 범위 | D-day 텍스트 (xs) | |
| 5 | 재생목록 | 재생목록명 | | |
| 6 | 연결 캠페인 | 캠페인명 | | |
| 7 | 동기화 | 동기화 상태 | | sync-ok/sync-lag/sync-none |

## 필터

| 이름 | 타입 | 옵션 (value → 표시명) |
|------|------|----------------------|
| 상태 | select | `''`→전체 상태, `active`→적용중, `pending`→예약됨, `done`→종료 |
| 매체 | select | `''`→전체 매체, (매체 목록) |
| 우선순위 | select | `''`→전체 우선순위, `1`→1순위, `2`→2순위, `3`→3순위 (기본) |
| 검색 | search | placeholder: "편성표명 검색" |

## 상태값/배지

```
// 편성표 상태
status: 'active' | 'pending' | 'done'
// CSS: .sch-active, .sch-pending, .sch-done

// 우선순위
priority: 'prio-1' | 'prio-2' | 'prio-3'
// CSS: .prio-1, .prio-2, .prio-3

// 동기화 상태
sync: 'sync-ok' | 'sync-lag' | 'sync-none'
// CSS: .sync-ok, .sync-lag, .sync-none

// 편집중 인디케이터
// CSS: .editing-now (pulsing dot)
```

## 기타 UI

- **카운터**: 있음 ("총 N건")
- **페이지네이션**: 없음
- **주요 액션**: "새 편성표" 버튼 (→ schedule-form.html)
- **행 클릭**: 있음 (→ schedule-form.html 편집 모드)
