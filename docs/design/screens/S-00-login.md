# S-00: 로그인

## 출처
- UC-02: 초대받은 사용자가 가입 완료
- IA: 비로그인 시 진입점

## 레이아웃
- 중앙 정렬 카드 (max-width: 400px)
- 배경: --color-bg-primary
- 상단: 로고 + 서비스명

## 컴포넌트
- 이메일 입력 (type=email)
- 비밀번호 입력 (type=password)
- "로그인" btn-primary full-width
- "비밀번호 찾기" 텍스트 링크
- 에러 메시지 영역

## 상태
- **기본**: 폼 입력 대기
- **로딩**: 버튼 disabled + 스피너
- **에러**: 에러 메시지 표시 (잘못된 자격증명 등)

## 접근성
- autofocus on email 필드
- Enter 키로 폼 제출
- 에러 메시지 aria-live="polite"

## 역할 분기
- 전체 동일 (인증 전 화면)
