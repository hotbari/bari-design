# 로그인 (`login.html`)

## 기본 정보

- **페이지 제목**: 로그인
- **레이아웃**: 풀스크린 중앙 정렬 (사이드바 없음)

## 레이아웃 구조

- 배경: neutral-50
- 중앙 카드 (max-width 400px, padding 40px)

## 폼 필드

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 이메일 | email | * | autocomplete="email" |
| 비밀번호 | password | * | 눈 아이콘 토글 |
| 자동 로그인 | checkbox | - | "로그인 상태 유지" |

## 기타 UI

- **브랜드**: Bari CMS 로고 마크 + 이름 (카드 상단)
- **로그인 버튼**: primary, full-width
- **에러 메시지**: 인증 실패 시 인라인 오류 표시
- **Skip 링크**: 접근성용 skip-link (키보드 포커스 시 표시)
- **초대 링크 진입**: URL에 초대 토큰 포함 시 초대 블록 표시 (→ signup-complete.html로 이동)
