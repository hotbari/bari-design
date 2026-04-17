# 매체 목록 (`media-list.html`)

## 기본 정보

- **페이지 제목**: 매체 관리
- **브레드크럼**: 매체 관리 › 매체 목록
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 우측 날짜 + 알림벨
- 컨텐츠: 페이지 헤더 → 필터바 → 툴바(카운터) → 테이블 → 페이지네이션

## 테이블 컬럼

| # | 헤더 | 표시 데이터 | 보조 텍스트 | 비고 |
|---|------|------------|------------|------|
| 1 | 매체명 | 매체명 (font-weight:600) | 설치 주소 (xs, neutral-500) | |
| 2 | 매체사 | 매체사명 | | xs |
| 3 | 유형 | 유형 chip (고정형/이동형) | | |
| 4 | 해상도 | 해상도 (예: 1920×1080) | | xs |
| 5 | 상태 | status-dot + 상태텍스트 | | online/delayed/error/offline/inactive/unlinked |
| 6 | 동기화 | sync-badge | | synced/delayed/error/pending |
| 7 | 운영 시간 | 운영 시간 텍스트 | | xs |
| 8 | 등록일 | 날짜 | | xs, neutral-500 |

## 필터

| 이름 | 타입 | 옵션 (value → 표시명) |
|------|------|----------------------|
| 매체사 | select | `''`→전체 매체사, `네이버 OOH 미디어`→네이버 OOH 미디어, `카카오 스크린`→카카오 스크린, `롯데 광고`→롯데 광고, `서울디지털미디어`→서울디지털미디어, `KIA 미디어`→KIA 미디어 |
| 상태 | select | `''`→전체 상태, `온라인`→온라인, `지연`→지연, `이상`→이상, `오프라인`→오프라인, `미연동`→미연동, `비활성`→비활성 |
| 유형 | select | `''`→전체 유형, `고정형`→고정형, `이동형`→이동형 |
| 검색 | search | placeholder: "매체명·주소 검색" |

## 상태값/배지

```
// 매체 상태 (CSS 클래스)
status: 'online' | 'delayed' | 'error' | 'offline' | 'inactive' | 'unlinked'
// CSS: .status-dot.online, .status-dot.delayed, .status-dot.error,
//      .status-dot.offline, .status-dot.inactive, .status-dot.unlinked

// 동기화 배지
sync: 'synced' | 'delayed' | 'error' | 'pending'
// CSS: .sync-badge.synced, .sync-badge.delayed, .sync-badge.error, .sync-badge.pending

// 유형 chip
type: '고정형' | '이동형'
```

## 기타 UI

- **카운터**: 있음 ("총 8개 매체")
- **페이지네이션**: 있음
- **주요 액션**: "매체 등록" 버튼 (→ media-form.html)
- **행 클릭**: 있음 (→ media-detail.html)
