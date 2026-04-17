# 유동인구 데이터 연동 (`foot-traffic.html`)

## 기본 정보

- **페이지 제목**: 유동인구 데이터 연동
- **브레드크럼**: 매체 관리 › 유동인구 데이터 연동
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠, max-width 800px)

## 레이아웃 구조

- GNB: 브레드크럼 + 날짜 + 알림벨
- 컨텐츠: 페이지 헤더(연결 상태 배지 포함) → 데이터 소스 카드 → 매체 매핑 카드

## 폼 필드 (데이터 소스 카드)

| 필드 | 타입 | 필수 | 옵션/비고 |
|------|------|------|----------|
| 제공사 | select | * | `skt`→SKT, `kt`→KT, `custom`→직접 입력; 변경 시 엔드포인트 자동 변경 |
| API Endpoint | url input | * | 제공사에 따라 자동 채움, custom 선택 시만 직접 입력 가능 |
| 인증 키 | password input (toggle 가능) | - | 마스킹, 눈 아이콘으로 토글 |

마지막 동기화 시각 표시 (읽기 전용)

## 매체 매핑 테이블

| # | 헤더 | 비고 |
|---|------|------|
| 1 | 매체명 | font-weight:600 |
| 2 | 데이터포인트 ID | monospace font |
| 3 | 최근 수신 | 상대 시간 |
| 4 | 상태 | success/pending/disconnected 배지 |
| 5 | (액션) | 수정 / 매핑 버튼 |

## 상태값/배지

```
// 연결 상태 (페이지 헤더)
connection: 'success' | 'error' | 'pending' | 'disconnected'
// CSS: .status-badge.success, .status-badge.error, .status-badge.pending, .status-badge.disconnected

// 데이터포인트 상태 표시명
// success → 정상, pending → 지연, disconnected → 미연결
```

## 기타 UI

- **연결 테스트 버튼**: 테스트 중 loading 상태, 결과 인라인 표시 (success/error)
- **저장 버튼**: 설정 저장
- **매핑 추가**: "+ 매핑 추가" 버튼 (매체 매핑 카드 헤더)
