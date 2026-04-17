# HTML 충실도 파이프라인 설계

**날짜:** 2026-04-15
**목표:** HTML 프로토타입을 코드로 구현할 때 발생하는 정보 손실을 제거하고, 구현 후 자동 검증으로 누락을 즉시 발견한다.

---

## 배경

HTML 프로토타입 → spec.md → 코드 구현 파이프라인에서 세 구간 모두 정보 손실이 발생했다:

1. **spec 추출 시**: FORM·DETAIL 패턴 미처리로 섹션·필드·info grid·모달이 누락
2. **구현 시**: 에이전트가 spec만 보고 구현 — HTML의 세부 내용 재확인 없음
3. **검증 시**: 구현 완료 후 HTML과 비교하는 단계 자체가 없음

기존에 ①은 html-spec-extractor 패턴 확장으로 개선. 이 설계는 ②③을 해결한다.

---

## 설계 원칙

- **HTML이 진실의 원본**: spec.md는 구조 체크리스트, HTML은 콘텐츠 원본
- **충실도가 기본값**: HTML과 다른 구현은 의도적 개선만 허용하며 명시해야 함
- **자동 검증**: 사람이 눈으로 비교하지 않아도 누락이 발견되어야 함

---

## 변경 사항

### 1. spec.md frontmatter — source 참조

html-spec-extractor가 생성하는 모든 spec.md 상단에 source 필드 추가:

```markdown
---
source: 2026-04-08-prototype/campaign-list.html
generated: 2026-04-15
---
```

**목적:** 구현 에이전트가 원본 HTML 경로를 별도 탐색 없이 즉시 알 수 있다.

---

### 2. 구현 규칙 변경 — HTML을 원본으로 참조

**CLAUDE.md에 추가할 규칙:**

```
- 구현 전 spec.md의 source HTML을 함께 읽는다. spec과 HTML이 충돌하면 HTML이 우선이다.
- 구현 완료 후 /html-verify로 검증한다. 이슈 0건 확인 전까지 완료 선언 금지.
```

**동작 방식:**
1. 에이전트가 spec.md를 읽어 구조 파악 (섹션, 필드, 컬럼 목록)
2. spec의 `source` 경로로 HTML 파일을 열어 세부 내용 확인
3. HTML이 spec보다 상세한 경우 HTML을 따른다
4. 의도적으로 HTML과 다르게 구현하는 경우: 코드 주석으로 `// intentional: {이유}` 명시. 이 주석은 사람이 읽는 설명용이며 html-impl-verifier는 파싱하지 않는다 — 에이전트는 여전히 해당 항목을 이슈로 리포트하고, 사람이 검토 후 무시 여부를 결정한다.

---

### 3. 신규 에이전트: html-impl-verifier

**파일:** `.claude/agents/html-impl-verifier.md`

**입력:**
- spec.md 경로 (필수)
- tsx 파일 경로 (없으면 아래 규칙으로 추론)

**tsx 경로 추론 규칙:**

spec 파일명에서 tsx 경로를 다음 규칙으로 매핑한다:

| spec 파일명 패턴 | tsx 경로 패턴 |
|----------------|-------------|
| `{domain}-list.md` | `src/app/(dashboard)/{domain}s/page.tsx` |
| `{domain}-detail.md` | `src/app/(dashboard)/{domain}s/[id]/page.tsx` |
| `{domain}-form.md` | `src/app/(dashboard)/{domain}s/new/page.tsx` (신규 폼만) |
| `{domain}-edit.md` | `src/app/(dashboard)/{domain}s/[id]/edit/page.tsx` |

파일명이 위 패턴에 해당하지 않는 경우(예: 서브 라우트, 복합 이름) 에이전트가 사용자에게 tsx 경로를 직접 묻는다. 자동 추론을 시도하지 않는다.

예시:
- `campaign-list.md` → `src/app/(dashboard)/campaigns/page.tsx`
- `campaign-detail.md` → `src/app/(dashboard)/campaigns/[id]/page.tsx`
- `schedule-form.md` → `src/app/(dashboard)/schedules/new/page.tsx`
- `campaign-edit.md` → `src/app/(dashboard)/campaigns/[id]/edit/page.tsx`
- `foot-traffic.md` → 패턴 불일치 → 사용자에게 경로 입력 요청

**spec.md 섹션 헤더 형식:**

아래 헤더는 html-spec-extractor가 현재 생성하는 형식 그대로다. 파싱 시 이 형식을 기준으로 삼는다:

| 검증 항목 | spec 헤더 |
|---------|---------|
| 테이블 컬럼 | `## 테이블 컬럼` |
| 필터 | `## 필터` |
| 섹션 목록 | `## 섹션 목록` |
| 섹션별 필드 | `## 섹션 N: {섹션명}` |
| 정보 그리드 | `## 정보 그리드` |
| 열거값 | `## 열거값` |
| 모달 | `## 모달: {모달명}` |

**검증 방식:**

에이전트는 spec.md와 tsx를 AI 독해로 비교한다. 정규식·AST 파싱이 아니라 에이전트가 두 파일을 읽고 구조적 일치 여부를 판단한다. spec은 html-spec-extractor가 HTML을 충실히 추출한 결과이므로 spec → tsx 비교로 HTML 충실도를 검증하기에 충분하다. (HTML 파일을 별도로 파싱하지 않는다.)

**검증 항목:**

| 항목 | spec에서 읽는 것 | tsx에서 확인하는 것 |
|------|----------------|------------------|
| 테이블 컬럼 수·헤더 | `## 테이블 컬럼` 행 수와 헤더 텍스트 | tsx에서 렌더링되는 컬럼 헤더 목록 |
| 필터 종류·옵션 값 | `## 필터` 각 행의 이름과 option value 목록 | tsx의 select/filter 구현에서 사용하는 값 목록 |
| 섹션 수·필드 목록 | `## 섹션 목록` 행 수, 각 `## 섹션 N:` 하위 필드 | tsx의 form section 헤더와 필드 구현 |
| 정보 그리드 키 목록 | `## 정보 그리드` 행의 키 텍스트 | tsx의 키-값 쌍 렌더링 항목 |
| 열거값 | `## 열거값` 코드 블록의 value 목록 | tsx에서 Badge 또는 상태 분기에 쓰인 값 목록 |
| 모달 유무 | `## 모달:` 섹션 존재 여부 | tsx에 Modal/dialog 컴포넌트 존재 여부 |

**리포트 형식:**

```
캠페인 목록 검증
spec: docs/design/screen-specs/campaign-list.md
impl: src/app/(dashboard)/campaigns/page.tsx

✅ 테이블 컬럼: 7개 일치
✅ 필터: 3개 일치
❌ 열거값: spec 'running' → impl 'active' (rename 금지 위반)
❌ 정보 그리드: spec 9개 → impl 6개
   누락: 광고 유형, 잔여 일수, 등록자

이슈 2건 → 수정 후 재실행
```

리포트는 이슈를 두 카테고리로 구분한다:
- **미해결 이슈**: 수정이 필요한 실제 누락·불일치
- **의도적 차이**: 에이전트가 tsx 파일에서 `// intentional:` 주석을 읽고, 해당 주석이 spec 항목의 차이를 설명한다고 AI 판단으로 결정한 항목. 정확한 매핑은 에이전트의 독해 판단에 의존한다.

통과 조건: **미해결 이슈 0건** (의도적 차이는 통과에 영향을 주지 않는다)

이슈 0건일 때: `✅ 검증 통과 — 완료 선언 가능`

**리포트 출력:** 콘솔(터미널) 출력만. 파일로 저장하지 않는다. `/design-review`와 달리 반복 실행을 전제로 하므로 파일 누적이 불필요하다.

---

### 4. 신규 스킬: html-verify

**파일:** `.claude/skills/html-verify/SKILL.md`

**호출:** `/html-verify [spec.md 경로]`
인수 생략 시 `docs/design/screen-specs/` 전체 처리.

**동작:**
1. 대상 spec.md 확인 (또는 `docs/design/screen-specs/` 전체 목록)
2. 각 spec의 tsx 경로를 추론 규칙으로 결정; 파일이 없으면 사용자에게 경로 입력 요청
3. `html-impl-verifier` 에이전트 디스패치 — spec별 병렬 실행. 단일 spec 지정 시 순차 실행.
4. 이슈 있으면 spec과 impl 파일 경로를 함께 제시하며 수정 안내
5. 수정 후 해당 spec만 재실행
6. 전체 spec 이슈 0건이면 "검증 통과" 선언

---

## 최종 파이프라인

```
HTML 프로토타입
    ↓
/html-to-spec
    ↓
spec.md (source: HTML 경로 포함)
    ↓
구현 (spec.md + source HTML 동시 참조)
    ↓
/html-verify
    ↓
이슈 0건 → 완료 선언
```

---

## 구현 범위

| 파일 | 작업 |
|------|------|
| `.claude/agents/html-spec-extractor.md` | spec.md 파일 생성 직후 frontmatter 삽입. `source` 값은 에이전트가 처리 중인 HTML 파일의 경로(호출 시 전달된 경로 그대로). `generated` 값은 오늘 날짜(YYYY-MM-DD). 이미 frontmatter가 있는 spec.md를 재실행하는 경우 기존 frontmatter를 덮어쓴다. |
| `.claude/agents/html-impl-verifier.md` | 신규 생성 |
| `.claude/skills/html-verify/SKILL.md` | 신규 생성 |
| `CLAUDE.md` | 구현 규칙 2줄 추가 |

---

## 미포함 범위

- **시각적(스크린샷) 비교**: Playwright 기반 픽셀 비교는 이 설계에 포함하지 않는다. 구조 검증만으로 주요 누락을 잡을 수 있으며, 시각 비교는 별도 `/design-review` 스킬이 담당한다.
- **HTML 개선 제안**: 이 파이프라인은 충실도 검증만 한다. HTML보다 나은 UX 구현은 구현자가 판단하고 `// intentional:` 주석으로 명시한다.
