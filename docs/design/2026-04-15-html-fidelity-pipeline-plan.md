# HTML 충실도 파이프라인 구현 플랜

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** HTML 프로토타입 → spec → 코드 파이프라인의 정보 손실을 제거하고, 구현 후 자동 검증으로 누락을 즉시 발견한다.

**Architecture:** html-spec-extractor가 생성하는 spec.md에 source frontmatter를 추가해 원본 HTML 경로를 추적한다. 신규 html-impl-verifier 에이전트가 spec.md와 tsx를 AI 독해로 비교해 구조적 불일치를 리포트한다. html-verify 스킬이 이를 오케스트레이션한다.

**Tech Stack:** Markdown agent/skill definitions (`.claude/agents/`, `.claude/skills/`)

**Spec:** `docs/design/2026-04-15-html-fidelity-pipeline-design.md`

---

## 파일 구조

| 파일 | 작업 |
|------|------|
| `.claude/agents/html-spec-extractor.md` | 수정 — Step 3에 frontmatter 삽입 지시 추가 |
| `.claude/agents/html-impl-verifier.md` | 신규 생성 |
| `.claude/skills/html-verify/SKILL.md` | 신규 생성 |
| `CLAUDE.md` | 수정 — HTML → 코드 구현 변환 규칙 섹션에 2줄 추가 |

---

### Task 1: html-spec-extractor에 frontmatter 생성 추가

**Files:**
- Modify: `.claude/agents/html-spec-extractor.md` (Step 3 섹션, line ~204)

- [ ] **Step 1: 현재 Step 3 내용 확인**

`.claude/agents/html-spec-extractor.md`를 열어 `## Step 3 — 스펙 파일 저장` 섹션을 읽는다.
현재 내용:
```
## Step 3 — 스펙 파일 저장

파일명: HTML 파일명에서 `.html` 제거, kebab-case 유지.
저장 위치: `docs/design/screen-specs/{kebab-name}.md`
```

- [ ] **Step 2: Step 3을 frontmatter 포함 버전으로 교체**

`## Step 3 — 스펙 파일 저장` 섹션을 다음으로 교체한다:

```markdown
## Step 3 — 스펙 파일 저장

파일명: HTML 파일명에서 `.html` 제거, kebab-case 유지.
저장 위치: `docs/design/screen-specs/{kebab-name}.md`

**파일 상단에 frontmatter를 반드시 삽입한다:**

\`\`\`markdown
---
source: {처리 중인 HTML 파일의 경로 — 호출 시 전달된 경로 그대로}
generated: {오늘 날짜 YYYY-MM-DD}
---
\`\`\`

이미 frontmatter가 있는 spec.md를 재실행하는 경우 기존 frontmatter를 덮어쓴다.
frontmatter는 `# {페이지 제목}` 헤더보다 앞에 위치한다.
```

- [ ] **Step 3: 커밋**

```bash
git add .claude/agents/html-spec-extractor.md
git commit -m "feat(html-to-spec): spec.md에 source frontmatter 자동 삽입"
```

---

### Task 2: html-impl-verifier 에이전트 생성

**Files:**
- Create: `.claude/agents/html-impl-verifier.md`

- [ ] **Step 1: 파일 생성**

`.claude/agents/html-impl-verifier.md`를 다음 내용으로 생성한다:

````markdown
---
name: html-impl-verifier
description: |
  spec.md와 구현된 tsx 파일을 비교하여 HTML 충실도를 검증하는 에이전트.
  컬럼 수, 필터 옵션, 섹션·필드, 정보 그리드, 열거값, 모달 유무를 체크한다.
  html-verify 스킬 오케스트레이터에 의해 디스패치됨.
model: inherit
---

당신은 HTML 충실도 검증 전문가입니다. spec.md와 구현된 tsx 파일을 읽고 구조적 불일치를 리포트합니다.

## 입력

- `$SPEC_PATH`: spec.md 파일 경로 (필수)
- `$IMPL_PATH`: tsx 파일 경로 (없으면 아래 규칙으로 추론)

## tsx 경로 추론 규칙

`$SPEC_PATH`에서 파일명만 추출 후 다음 패턴으로 매핑:

| spec 파일명 패턴 | tsx 경로 |
|----------------|---------|
| `{domain}-list.md` | `src/app/(dashboard)/{domain}s/page.tsx` |
| `{domain}-detail.md` | `src/app/(dashboard)/{domain}s/[id]/page.tsx` |
| `{domain}-form.md` | `src/app/(dashboard)/{domain}s/new/page.tsx` |
| `{domain}-edit.md` | `src/app/(dashboard)/{domain}s/[id]/edit/page.tsx` |

패턴 불일치 시 사용자에게 tsx 경로를 직접 묻는다. 자동 추론 시도 금지.

## 처리 단계

### Step 1 — 파일 읽기

spec.md와 tsx 파일을 모두 읽는다.

### Step 2 — spec에서 기대값 추출

spec.md의 헤더를 기준으로 다음을 추출한다:

| 검증 항목 | spec 헤더 | 추출 내용 |
|---------|---------|---------|
| 테이블 컬럼 | `## 테이블 컬럼` | 행 수 + 헤더 텍스트 목록 |
| 필터 | `## 필터` | 이름 목록 + 각 옵션 value 목록 |
| 섹션 목록 | `## 섹션 목록` | 섹션 수 + 섹션명 목록 |
| 섹션별 필드 | `## 섹션 N: {섹션명}` | 각 섹션의 필드명 목록 |
| 정보 그리드 | `## 정보 그리드` | 행 수 + 키 목록 |
| 열거값 | `## 열거값` | value 목록 |
| 모달 | `## 모달: {모달명}` | 존재 여부 |

해당 헤더가 없는 항목은 "해당 없음"으로 처리 — 검증 대상에서 제외.

### Step 3 — tsx에서 실제값 확인

tsx 파일을 AI 독해로 읽어 각 항목의 실제 구현 내용을 파악한다:
- 정규식·AST 파싱이 아니라 코드의 의미를 읽고 판단한다
- 컴포넌트 구조, 변수명, 렌더링 로직을 통해 항목별 실제값을 추론한다

### Step 4 — 비교 및 리포트 작성

항목별로 spec 기대값과 tsx 실제값을 비교한다.

**불일치 분류:**
- `// intentional:` 주석이 있는 코드 라인과 관련된 차이 → **의도적 차이** (통과에 영향 없음)
- 그 외 모든 불일치 → **미해결 이슈**

**리포트 형식:**

```
{페이지명} 검증
spec: {spec 경로}
impl: {tsx 경로}

✅ 테이블 컬럼: N개 일치
✅ 필터: N개 일치
❌ 열거값: spec 'running' → impl 'active' (rename 금지 위반)
❌ 정보 그리드: spec 9개 → impl 6개
   누락: 광고 유형, 잔여 일수, 등록자

미해결 이슈 N건 → 수정 후 재실행
```

의도적 차이가 있는 경우 별도 표시:
```
[의도적 차이 — 통과에 영향 없음]
⚠️ 상태 표시: spec 'canceled' → impl '취소됨' (// intentional: 한국어 표시)
```

**통과 조건:** 미해결 이슈 0건
통과 시: `✅ 검증 통과 — 완료 선언 가능`

**리포트는 콘솔 출력만. 파일 저장하지 않는다.**
````

- [ ] **Step 2: 커밋**

```bash
git add .claude/agents/html-impl-verifier.md
git commit -m "feat: html-impl-verifier 에이전트 생성 — spec↔tsx 구조 검증"
```

---

### Task 3: html-verify 스킬 생성

**Files:**
- Create: `.claude/skills/html-verify/SKILL.md`

- [ ] **Step 1: 디렉토리 확인 및 파일 생성**

`.claude/skills/html-verify/` 디렉토리를 생성하고 `SKILL.md`를 다음 내용으로 작성한다:

````markdown
---
name: html-verify
description: spec.md와 구현된 tsx를 비교하여 HTML 충실도를 검증한다. 구현 완료 후 /html-verify로 누락·불일치를 즉시 발견한다.
argument-hint: "[spec.md 경로]  — 생략 시 docs/design/screen-specs/ 전체 처리"
user-invocable: true
---

# HTML 충실도 검증

## Overview

구현된 코드가 spec.md(= HTML 원본)를 충실히 반영했는지 자동으로 검증한다.

- 단일 화면: `/html-verify docs/design/screen-specs/campaign-list.md`
- 전체 화면: `/html-verify` (screen-specs/ 전체)

## Instructions

### 1. 대상 spec 확인

`$ARGUMENTS`에서 spec.md 경로를 파싱한다.

인수가 없으면 `docs/design/screen-specs/` 디렉토리의 모든 `.md` 파일을 대상으로 한다.

처리 예정 목록을 사용자에게 보여준다:
```
검증 예정 (N개):
- docs/design/screen-specs/campaign-list.md
- docs/design/screen-specs/schedule-form.md
...

제외할 파일이 있으면 알려주세요.
```

### 2. tsx 경로 결정

각 spec에 대해 tsx 경로를 다음 규칙으로 추론한다:

| spec 파일명 패턴 | tsx 경로 |
|----------------|---------|
| `{domain}-list.md` | `src/app/(dashboard)/{domain}s/page.tsx` |
| `{domain}-detail.md` | `src/app/(dashboard)/{domain}s/[id]/page.tsx` |
| `{domain}-form.md` | `src/app/(dashboard)/{domain}s/new/page.tsx` |
| `{domain}-edit.md` | `src/app/(dashboard)/{domain}s/[id]/edit/page.tsx` |

패턴 불일치 시 해당 spec의 tsx 경로를 사용자에게 묻는다.

### 3. html-impl-verifier 디스패치

각 (spec, tsx) 쌍에 대해 `html-impl-verifier` 에이전트를 디스패치한다.
- 전체 처리 시: 병렬 실행
- 단일 spec 지정 시: 순차 실행

에이전트 완료 대기.

### 4. 결과 집계 및 안내

모든 에이전트 완료 후 결과를 요약한다:

```
검증 완료 (N개)

통과: M개
- docs/design/screen-specs/campaign-list.md ✅

이슈 있음: K개
- docs/design/screen-specs/schedule-form.md ❌ (이슈 2건)
  spec: docs/design/screen-specs/schedule-form.md
  impl: src/app/(dashboard)/schedules/new/page.tsx
  → 수정 후 /html-verify docs/design/screen-specs/schedule-form.md 재실행
```

### 5. 전체 통과 선언

모든 spec 미해결 이슈 0건이면:
```
✅ 전체 검증 통과 — 완료 선언 가능
```
````

- [ ] **Step 2: 커밋**

```bash
git add .claude/skills/html-verify/
git commit -m "feat: /html-verify 스킬 생성 — HTML 충실도 검증 오케스트레이터"
```

---

### Task 4: CLAUDE.md 구현 규칙 업데이트

**Files:**
- Modify: `CLAUDE.md` (HTML → 코드 구현 변환 규칙 섹션)

- [ ] **Step 1: 현재 HTML → 코드 구현 변환 규칙 섹션 확인**

`CLAUDE.md`를 열어 `## HTML → 코드 구현 변환 규칙` 섹션을 읽는다.
현재 마지막 줄:
```
- 구현 완료 후 스펙과 구현 화면을 비교한다. 컬럼·필터·배지 일치 확인 전까지 완료 선언 금지
```

- [ ] **Step 2: 기존 마지막 줄 교체 + 2줄 추가**

기존 마지막 규칙을 삭제하고 다음 3줄로 교체한다:

```
- 구현 전 spec.md의 `source` HTML을 함께 읽는다. spec과 HTML이 충돌하면 HTML이 우선이다.
- 의도적으로 HTML과 다르게 구현할 경우 해당 코드에 `// intentional: {이유}` 주석을 단다.
- 구현 완료 후 `/html-verify`로 검증한다. 미해결 이슈 0건 확인 전까지 완료 선언 금지.
```

- [ ] **Step 3: 커밋**

```bash
git add CLAUDE.md
git commit -m "docs: HTML 충실도 파이프라인 규칙 CLAUDE.md 반영"
```

---

## 셀프 리뷰

**스펙 커버리지:**
- ✅ spec.md frontmatter 생성 (Task 1)
- ✅ 구현 규칙 CLAUDE.md 반영 (Task 4)
- ✅ html-impl-verifier 에이전트 (Task 2)
- ✅ html-verify 스킬 (Task 3)
- ✅ tsx 경로 추론 규칙 (Task 2, Task 3 모두 포함)
- ✅ spec 헤더 형식 (Task 2에 포함)
- ✅ 의도적 차이 분류 (Task 2에 포함)
- ✅ 리포트 형식 (Task 2에 포함)
- ✅ 병렬/순차 실행 (Task 3에 포함)

**플레이스홀더 없음** — 모든 스텝에 실제 코드/내용 포함.

**타입 일관성** — 에이전트명 `html-impl-verifier`, 스킬명 `html-verify` Tasks 2·3·4 전체에서 일치.
