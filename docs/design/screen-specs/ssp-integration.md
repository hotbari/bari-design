# SSP 연동 설정 (`ssp-integration.html`)

## 기본 정보

- **페이지 제목**: SSP 연동 설정
- **브레드크럼**: 매체 관리 › SSP 연동 설정
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠, max-width 800px)

## 레이아웃 구조

- GNB: 브레드크럼 + 날짜 + 알림벨
- 컨텐츠: 페이지 헤더(연동 상태 배지 포함) → SSP 연동 카드 → 매체 매핑 카드 → 이벤트 로그 카드

## 폼 필드 (SSP 연동 카드)

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| Webhook URL | text (readonly) + 복사 버튼 | - | 네이버 SSP에 전달할 URL, 읽기 전용 |
| API Key | password input (toggle 가능) | - | 마스킹, 눈 아이콘으로 토글 |
| 마지막 이벤트 수신 | 읽기 전용 표시 | - | 날짜시간 텍스트 |

## 매체 매핑 테이블

| # | 헤더 | 비고 |
|---|------|------|
| 1 | SSP 매체 ID | monospace font (예: NV_OOH_001) |
| 2 | CMS 매체명 | |
| 3 | 위치 | 주소 (xs, neutral-500) |
| 4 | 상태 | success/error 배지 |
| 5 | (액션) | 수정 버튼 |

## 이벤트 로그

- 최근 10건 Webhook 수신 이력 목록
- 각 항목: 성공/실패 dot + 이벤트명 + 상세(매체ID, 응답코드, 응답시간) + 시각

## 상태값/배지

```
// 연동 상태 (페이지 헤더)
integration_status: 'success' | 'error' | 'pending'
// CSS: .status-badge.success, .status-badge.error, .status-badge.pending

// 이벤트 로그 dot
log_dot: 'success' | 'error'
// CSS: .log-dot.success, .log-dot.error

// 매핑 상태 표시명
// success → 연동 중, error → 연동 오류
```

## 기타 UI

- **Webhook URL 복사**: 복사 버튼 클릭 → 클립보드 복사 + 하단 toast 표시
- **연결 테스트**: 연결 테스트 버튼
- **저장 버튼**: 설정 저장
- **매핑 추가**: "+ 매핑 추가" 버튼 (매체 매핑 카드 헤더)
- **실시간 로그**: aria-live="polite" 로 자동 갱신 지원
