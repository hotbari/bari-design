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

**주의:** `{domain}s` 규칙은 단순 `s` 추가다. 예외: `media` → `media` (medias 아님).

추론 결과 파일이 존재하지 않거나 패턴 불일치인 경우:
- **단일 spec 모드**: 사용자에게 tsx 경로를 직접 묻는다.
- **전체 scan 모드**: 해당 spec을 "경로 미확인" 목록에 추가하고 나머지를 먼저 처리한다. 모든 추론 완료 후 미확인 목록을 한 번에 사용자에게 제시한다.

### 3. html-impl-verifier 디스패치

각 (spec, tsx) 쌍에 대해 `html-impl-verifier` 에이전트를 디스패치한다.

디스패치 시 다음 형식으로 입력 전달 (impl은 Step 2에서 결정된 경로를 항상 포함한다):
```
spec: {spec 경로}
impl: {tsx 경로}
```

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
