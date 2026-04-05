# S-10: 유동인구 데이터 연동

## 출처
- UC-10: 외부 유동인구 데이터 소스 매핑

## 레이아웃
- 설정 페이지 (form-card 기반)

## 컴포넌트
- form-card "데이터 소스"
  - 제공사 select (SKT / KT / 직접입력)
  - API Endpoint 입력
  - 인증 키 (type=password)
  - btn-secondary "연결 테스트"
  - 연결 상태 badge
- form-card "매체 매핑"
  - data-table (매체명 ↔ 데이터포인트 ID)
- 최종 동기화 시각 표시

## 상태
- **기본**: 설정값 표시
- **연결 테스트 중**: 버튼 로딩
- **연결 성공**: badge 성공
- **연결 실패**: badge 실패 + 에러 상세

## 접근성
- 연결 테스트 결과 aria-live 피드백
- 제공사 변경 시 관련 필드 동적 표시 안내

## 역할 분기
- 어드민 전용
