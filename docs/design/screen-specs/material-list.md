# 소재 목록 (`material-list.html`)

## 기본 정보

- **페이지 제목**: 소재 관리
- **브레드크럼**: 소재 관리 › 소재 목록
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 수동검수대기 N건 배지(warning) + 날짜 + 알림벨
- 컨텐츠: 페이지 헤더 → 필터바 → 툴바(카운터 + 정렬 + 뷰 토글) → 테이블/그리드 → 페이지네이션
- 뷰 토글: 리스트 보기 / 썸네일 보기 (2가지 모드)

## 테이블 컬럼 (리스트 뷰)

| # | 헤더 | 표시 데이터 | 보조 텍스트 | 비고 |
|---|------|------------|------------|------|
| 1 | (썸네일) | 64×36px 썸네일 | | |
| 2 | 소재명 / 광고주 | 소재명 (font-weight:600) | 광고주명 (xs, neutral-500) | |
| 3 | 매체 | 매체명 | | xs |
| 4 | 해상도 | 해상도 (예: 1920×1080) | | xs |
| 5 | 재생시간 | 재생시간 (예: 30초) | | xs |
| 6 | 검수 상태 | 검수 상태 배지 | | reviewing/done/failed/manual |
| 7 | 편성 연결 | 편성 연결 상태 | | on-air/none/waiting/ended |
| 8 | 운영 상태 | 운영 상태 배지 | | active/scheduled/expired |
| 9 | 등록일 | 날짜 | | xs |

## 필터

| 이름 | 타입 | 옵션 (value → 표시명) |
|------|------|----------------------|
| 검수 | select | `''`→전체, `reviewing`→검수중, `done`→검수완료, `failed`→검수실패, `manual`→수동검수대기 |
| 운영 | select | `''`→전체, `active`→진행중, `scheduled`→예정, `expired`→만료 |
| 매체 | select | `''`→전체 매체, `강남역 빌보드`→강남역 빌보드, `코엑스 아트리움`→코엑스 아트리움, `홍대 미디어폴`→홍대 미디어폴, `잠실 롯데타운`→잠실 롯데타운 |
| 광고주 | select | `''`→전체, `삼성전자`→삼성전자, `현대자동차`→현대자동차, `LG화학`→LG화학, `카카오`→카카오 |
| 검색 | search | placeholder: "소재명 검색" |

초기화 버튼 있음

## 상태값/배지

```
// 검수 상태
review: 'reviewing' | 'done' | 'failed' | 'manual'
// CSS: .badge-review.reviewing, .badge-review.done, .badge-review.failed, .badge-review.manual

// 편성 연결 상태
schedule: 'on-air' | 'none' | 'waiting' | 'ended'
// CSS: .badge-schedule.on-air, .badge-schedule.none, .badge-schedule.waiting, .badge-schedule.ended

// 운영 상태
ops: 'active' | 'scheduled' | 'expired'
// CSS: .badge-ops.active, .badge-ops.scheduled, .badge-ops.expired
```

## 기타 UI

- **카운터**: 있음 ("총 6건")
- **정렬**: 최신순 / 소재명순 / 검수상태순 / 운영상태순
- **뷰 토글**: 리스트 보기 / 썸네일 보기
- **페이지네이션**: 있음
- **주요 액션**: "소재 업로드" 버튼 → 우측 Drawer 열림
- **행 클릭**: 있음 (→ material-detail.html)
- **GNB 수동검수 배지**: 수동검수대기 N건, 클릭 시 해당 필터 적용
- **만료 행**: `.expired` 클래스로 opacity 0.5 처리

## 소재 업로드 Drawer

| 섹션 | 내용 |
|------|------|
| 파일 업로드 | 드래그앤드롭 or 파일 선택 (drop-zone) |
| 소재명 | text input * |
| 광고주 | select * |
| 매체 | select * |
| 기간 | date-range (시작일 ~ 종료일) |
