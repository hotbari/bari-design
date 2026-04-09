# S-00: 로그인

생성일: 2026-04-08
출처 UC: UC-02
접근 역할: 전체 (인증 전 화면)

---

## 1. 개요

CMS 진입점. 이메일/비밀번호 단일 인증. 초대 기반 가입 전용이므로 회원가입 링크 없음. 세션은 브라우저 종료 시까지 자동 유지 (Remember me 체크박스 없음).

---

## 2. 레이아웃

- 전체 배경: `--color-bg-primary` (neutral-50)
- 중앙 정렬 카드: max-width 400px, padding 40px
- 카드 배경: `--color-bg-elevated` (순백), border-radius 12px, 1px border `--color-border-default`
- 카드 구조 (위→아래): 브랜드 영역 → 에러 배너(조건부) → 이메일 필드 → 비밀번호 필드 → 로그인 버튼 → 푸터

---

## 3. 컴포넌트

### 브랜드 영역
- 로고 아이콘 (40×40px, primary-500 배경, border-radius 10px)
- 서비스명: "Bari CMS", 20px 700
- 부제: "DOOH 광고 관리 플랫폼", 13px secondary

### 이메일 필드
- label: "이메일"
- input type=email, autofocus
- placeholder: "example@company.com"
- 에러 시: border-color `--color-status-error`

### 비밀번호 필드
- label 행: 좌측 "비밀번호" + 우측 "비밀번호 찾기" 링크 (12px, `--color-interactive-primary`)
- input type=password
- 에러 시: border-color `--color-status-error`

### 에러 배너 (조건부)
- 위치: 브랜드 영역 바로 아래
- 배경: `--color-status-error-bg` (error-50), border 1px error/30%
- 메시지: "이메일 또는 비밀번호가 올바르지 않습니다."
- 필드별 에러 표시 안 함 (어느 필드가 틀렸는지 노출 방지)
- 렌더링: DOM에 `aria-hidden="true"`로 미리 존재. 에러 발생 시 `aria-hidden="false"`로 전환 (동적 삽입이 아닌 토글 방식 — 스크린리더 중복 읽기 방지)

### 비밀번호 show/hide 토글
- 제공하지 않음. B2B 운영 환경(사무실/고정 디바이스)에서 필요성 낮음. 추후 모바일 대응 시 재검토.

### 로그인 버튼
- btn-primary, full-width, height 40px
- 텍스트: "로그인"

### 푸터
- 12px, tertiary
- "계정 문의: 관리자에게 연락하세요"

---

## 4. 상태 전이

| 상태 | 설명 |
|------|------|
| **기본** | 이메일 필드 autofocus. 버튼 활성 |
| **로딩** | 버튼 disabled + 스피너 + "로그인 중…". 모든 입력 필드 disabled. 중복 제출 방지 |
| **에러** | 에러 배너 표시. 두 필드 모두 error 테두리. 비밀번호 필드 초기화 |

---

## 5. 비밀번호 재설정 플로우 (별도 페이지)

"비밀번호 찾기" 링크 클릭 시 `/forgot-password` 페이지로 이동. 3단계.

### Step 1 — 이메일 입력
- 제목: "비밀번호 재설정"
- 설명: "가입하신 이메일 주소를 입력하면 재설정 링크를 보내드립니다."
- 이메일 입력 필드
- "재설정 링크 발송" btn-primary
- "← 로그인으로 돌아가기" ghost 버튼

### Step 2 — 발송 완료
- 미가입 이메일 포함 동일 메시지 표시 (계정 존재 여부 노출 방지)
- "이메일을 확인하세요" 제목
- 성공 배너: `{이메일}`로 재설정 링크를 발송했습니다. 스팸함 확인 안내
- 유효시간 안내: "링크는 30분간 유효합니다"
- "← 로그인으로 돌아가기" ghost 버튼

### Step 3 — 새 비밀번호 설정 (링크 클릭 후)
- 새 비밀번호 입력 + 확인 입력
- 정책 안내: "8자 이상, 영문+숫자+특수문자"
- "비밀번호 변경" btn-primary

---

## 6. 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 미가입 이메일로 재설정 요청 | Step 2와 동일 메시지 (계정 존재 여부 비노출) |
| 재설정 링크 만료 (30분 초과) | "링크가 만료됐습니다" + Step 1 재시작 유도 |
| 비활성화된 계정 로그인 시도 | 일반 인증 실패 메시지와 동일("이메일 또는 비밀번호가 올바르지 않습니다.") — 계정 존재 여부 비노출. 비활성화 안내는 인증 성공 후 별도 처리 |
| 재설정 링크 이미 사용됨 | "이미 사용된 링크입니다. 비밀번호 찾기를 다시 시도해주세요" + Step 1 재시작 유도 |
| 재설정 링크 위조/유효하지 않은 토큰 | 만료 케이스와 동일 메시지 처리 |
| 연속 로그인 실패 | UI 잠금 없음. Rate limiting은 서버 레벨에서 처리 |

---

## 7. 접근성

- 이메일 필드 autofocus
- Enter 키로 폼 제출
- Tab 순서: 이메일 → 비밀번호 → 로그인 버튼 → 비밀번호 찾기 링크. "비밀번호 찾기"는 DOM 순서상 비밀번호 input 뒤에 위치 (시각 배치는 label 우측이나 `tabindex`로 보정 불필요 — DOM 순서와 일치시킬 것)
- 에러 배너: `role="alert"`, `aria-hidden` 토글 방식 (DOM 미리 존재, 에러 시 `aria-hidden="false"` 전환)
- 입력 필드 에러 시: `aria-invalid="true"` + `aria-describedby` 에러 배너 ID 연결
- 포커스 링: 2px solid `--color-focus-ring` (primary-400)
- 로딩 스피너: `aria-label="로그인 중"`, `role="status"`

---

## 8. 역할 분기

없음 — 인증 전 화면으로 모든 역할 동일.
