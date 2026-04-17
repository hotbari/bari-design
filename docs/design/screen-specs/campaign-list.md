# 캠페인 목록 (`campaign-list.html`)

## 기본 정보

- **페이지 제목**: 캠페인 관리
- **브레드크럼**: 캠페인 관리 › 캠페인 목록
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 컨텐츠: 페이지 헤더 → 필터바 → 툴바(카운터 + 정렬) → 테이블 → 페이지네이션

## 테이블 컬럼

| # | 헤더 | 표시 데이터 | 보조 텍스트 | 비고 |
|---|------|------------|------------|------|
| 1 | 캠페인 | 캠페인명 (font-weight:600, color:neutral-900) | 광고주명 (xs, neutral-500) | min-width:160px |
| 2 | 유형 | type-badge | | direct/own/filler/naver |
| 3 | 상태 | 상태 배지 (dot + 텍스트) | | draft/running/done/canceled |
| 4 | 집행기간 | 날짜 범위 (YYYY-MM-DD ~ YYYY-MM-DD) | D-day 텍스트 (xs, neutral-500) | |
| 5 | 대상 매체 | 매체명 요약 | | |
| 6 | 예산 | 금액 (font-weight:600) | 가격모델 (xs, neutral-400) | |
| 7 | 등록일 | 날짜 | | xs, neutral-500 |

## 필터

| 이름 | 타입 | 옵션 (value → 표시명) |
|------|------|----------------------|
| 상태 | select | `''`→전체 상태, `draft`→초안, `running`→집행중, `done`→완료, `canceled`→취소 |
| 유형 | select | `''`→전체 유형, `direct`→직접판매, `own`→자사광고, `filler`→필러, `naver`→네이버 |
| 광고주 | select | `''`→전체 광고주, `삼성전자`→삼성전자, `현대자동차`→현대자동차, `LG생활건강`→LG생활건강, `배달의민족`→배달의민족 |
| 집행기간 | date-range | 시작일 ~ 종료일 |
| 검색 | search | placeholder: "캠페인명 검색" |

초기화 버튼 있음

## 상태값/배지

```
// 상태 (CSS 클래스 → HTML 값)
status: 'draft' | 'running' | 'done' | 'canceled'
// CSS: .cam-draft, .cam-running, .cam-done, .cam-canceled

// 유형 (CSS 클래스)
type: 'direct' | 'own' | 'filler' | 'naver'
// CSS: .type-direct, .type-own, .type-filler, .type-naver
```

## 기타 UI

- **카운터**: 있음 ("총 N건")
- **정렬**: 등록일 최신순 / 시작일 순 / 종료일 순 / 캠페인명 순
- **페이지네이션**: 있음
- **주요 액션**: "캠페인 등록" 버튼 (→ campaign-form.html)
- **행 클릭**: 있음 (→ campaign-detail.html)
