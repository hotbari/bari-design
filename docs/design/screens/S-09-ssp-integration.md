# S-09: SSP 연동 설정

## 출처
- UC-09: 네이버 SSP Webhook / 매체 매핑

## 레이아웃
- 설정 페이지 (form-card 기반)

## 컴포넌트
- form-card "SSP 연동"
  - Webhook URL (readonly + 복사 버튼)
  - API Key (type=password + 표시/숨김 토글)
  - 연동 상태 badge
- form-card "매체 매핑"
  - data-table (SSP 매체 ID ↔ CMS 매체명)
  - btn-primary "매핑 추가"
- form-card "이벤트 로그"
  - 최근 Webhook 수신 이력 목록

## 상태
- **기본**: 설정값 표시
- **연동 성공**: badge 성공
- **연동 실패**: badge 실패 + 에러 상세

## 접근성
- 복사 버튼 클릭 시 aria-live 피드백
- API Key 토글 상태 aria-label

## 역할 분기
- 어드민: 전체 설정 관리
- 매체사: 자사 매핑 조회
- 운영대행사: 부여 매체 매핑 조회
