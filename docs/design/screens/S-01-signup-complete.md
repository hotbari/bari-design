# S-01: 가입 완료

생성일: 2026-04-08
출처 UC: UC-02
접근 역할: 전체 (초대 링크 기반, 인증 전 화면)

---

## 1. 개요

초대 이메일의 링크를 클릭한 사용자가 이름·비밀번호를 설정하고 계정을 완성하는 화면. 공개 가입 없음 — 초대 토큰이 있어야 진입 가능. 이용약관 동의 체크박스 없음 (가입 완료 시 동의로 간주).

---

## 2. 레이아웃

S-00과 동일한 중앙 정렬 카드 (max-width 420px, padding 40px). 카드 구조 (위→아래):
브랜드 영역 → 초대 정보 블록 → 폼 (이름·비밀번호·확인) → 가입 완료 버튼

---

## 3. 컴포넌트

### 브랜드 영역
S-00과 동일. 로고 + "Bari CMS" 텍스트.

### 초대 정보 블록
- 배경: `--color-status-success-bg` (primary-50), border 1px `--color-interactive-primary / 15%`, border-radius `--radius-md`
- padding 14px 16px, margin-bottom 28px
- 내용:
  - **`{초대자 이름}`님이 회원님을 초대했습니다** + 역할 뱃지
  - 역할 뱃지: white 배경, `--color-interactive-primary / 20%` border, `--color-interactive-active` 텍스트, 12px 600
  - 역할값: "어드민" | "매체사 담당자" | "운영대행사" | "영업대행사"
  - 초대 이메일: 12px, `--color-text-secondary`, "초대 이메일: {email}" (읽기 전용 표시)

### 이름 필드
- label: "이름 *"
- input type=text, autofocus, autocomplete=name
- placeholder: "홍길동"
- required

### 비밀번호 필드
- label: "비밀번호 *"
- input type=password, autocomplete=new-password
- placeholder: "8자 이상, 영문·숫자·특수문자"
- 아래: 강도 표시 (텍스트 레이블)
  - 입력 전: 표시 없음
  - "약함": `--color-status-error`
  - "보통": `--color-status-warning`
  - "강함": `--color-interactive-hover`
  - `aria-live="polite"`, `aria-atomic="true"`
- show/hide 토글 없음 (S-00과 동일. B2B 운영 환경 기준 불필요. 추후 모바일 대응 시 재검토)

### 비밀번호 확인 필드
- label: "비밀번호 확인 *"
- input type=password, autocomplete=new-password
- `aria-describedby="pw-confirm-error"`
- 불일치 시:
  - border `--color-status-error`
  - `aria-invalid="true"`
  - `<span id="pw-confirm-error" aria-live="polite">비밀번호가 일치하지 않습니다.</span>` (12px, `--color-status-error`, min-height 유지로 레이아웃 시프트 방지)

### 가입 완료 버튼
- btn-primary, full-width, height 40px
- 텍스트: "가입 완료"
- 토큰 만료 상태에서는 **버튼 숨김** (disabled 유지 아님 — 만료 시 액션 경로 없음)

---

## 4. 비밀번호 강도 판정 기준

| 조건 충족 수 | 강도 |
|------------|------|
| 1–2개 | 약함 |
| 3개 | 보통 |
| 4개 모두 | 강함 |

조건: 8자 이상 / 영문 포함 / 숫자 포함 / 특수문자 포함

---

## 5. 비밀번호 정책 클라이언트 검증

제출 시 클라이언트에서 먼저 검증:
- 8자 미만: "비밀번호는 8자 이상이어야 합니다." (인라인, 비밀번호 필드 아래)
- 정책 미충족 (영문/숫자/특수문자 중 하나 이상 누락): "영문·숫자·특수문자를 모두 포함해야 합니다."
- 강도 "약함" 상태에서도 제출 가능 — 위 두 조건을 통과하면 제출 허용. 서버에서 최종 검증 후 실패 시 에러 배너로 표시 ("비밀번호 설정에 실패했습니다. 다시 시도해주세요.")

---

## 6. 상태 전이

| 상태 | 설명 |
|------|------|
| **기본** | 이름 필드 autofocus. 강도 레이블 미표시 |
| **입력 중** | 비밀번호 타이핑 시 강도 레이블 실시간 갱신 (keyup 즉시) |
| **불일치** | 확인 필드 blur 또는 제출 시 검사. 에러 인라인 표시 |
| **로딩** | 버튼 disabled + 스피너. 모든 입력 disabled |
| **토큰 만료** | 폼 + 버튼 숨김. 만료 배너 표시. focus → 만료 배너 heading |
| **완료** | 폼 + 가입 완료 버튼 숨김. 성공 배너 + "로그인 화면으로" 버튼 표시. focus → "로그인 화면으로" 버튼 |

---

## 7. 만료 상태 레이아웃

폼 영역 + 가입 완료 버튼 숨김. 배너만 표시:
- 배경: `--color-status-error-bg`, border 1px `--color-status-error / 20%`
- `role="alert"`, `tabindex="-1"` (focus 수신용)
- 제목 (`h2`): "초대 링크가 만료됐습니다" (15px, 700)
- 설명: "초대 링크는 발송 후 7일간 유효합니다. 초대를 다시 요청해주세요."
- 재발급 버튼 없음 — 관리자에게 연락 안내

---

## 8. 완료 상태 레이아웃

폼 영역 + 가입 완료 버튼 숨김. 성공 배너 + 이동 버튼 표시:
- 배경: `--color-status-success-bg`, border 1px `--color-status-success / 20%`
- `role="status"`, `aria-live="polite"`
- 체크 아이콘 (`--color-interactive-hover`)
- 제목: "가입이 완료됐습니다"
- 설명: "{이름}님, Bari CMS에 오신 걸 환영합니다." + "{역할} 권한으로 로그인하세요."
- "로그인 화면으로" btn-primary → `/login`
- 상태 전환 시 focus → "로그인 화면으로" 버튼

---

## 9. 엣지 케이스

| 케이스 | 처리 |
|--------|------|
| 초대 토큰 만료 (7일 초과) | 만료 상태 렌더링. focus → 만료 배너 |
| 이미 가입 완료된 토큰 재방문 | "이미 가입이 완료된 링크입니다." + 로그인 페이지 링크 |
| 비밀번호 정책 미충족 | 클라이언트 검증 후 인라인 에러 (섹션 5 참조) |
| 이름 공백만 입력 | trim() 후 빈 값 → "이름을 입력해주세요" 에러 (이름 필드 아래) |
| 서버 검증 실패 | 에러 배너 (`--color-status-error-bg`) — "가입 처리에 실패했습니다. 다시 시도해주세요." |

---

## 10. 접근성

- 이름 필드 autofocus (페이지 로드 시)
- Tab 순서: 이름 → 비밀번호 → 비밀번호 확인 → 가입 완료 버튼
- 비밀번호 강도: `aria-live="polite"`, `aria-atomic="true"`
- 비밀번호 확인 에러 span: `id="pw-confirm-error"`, `aria-live="polite"` — 확인 필드 `aria-describedby="pw-confirm-error"` + `aria-invalid="true"` 조합
- 로딩 스피너: `role="status"`, `aria-label="가입 처리 중"`
- 만료 배너: `role="alert"`, `tabindex="-1"`. 상태 진입 시 JS로 `.focus()` 호출
- 성공 후 "로그인 화면으로" 버튼: 상태 진입 시 JS로 `.focus()` 호출
- 포커스 링: 2px solid `--color-focus-ring` (S-00과 동일)

---

## 11. 역할 분기

없음 — 인증 전 화면. 초대 시 지정된 역할은 읽기 전용으로 초대 블록에 표시만 함.
