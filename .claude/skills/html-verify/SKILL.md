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

처리 예정 목록을 사용자에게 보여주고 응답을 기다린다:
```
검증 예정 (N개):
- docs/design/screen-specs/campaign-list.md
- docs/design/screen-specs/schedule-form.md
...

제외할 파일이 있으면 알려주세요. 없으면 바로 진행합니다.
```

사용자가 응답하면 제외 목록을 반영한 후 Step 2로 진행한다.

### 2. Next.js 앱 루트 탐색 및 tsx 경로 결정

**Step 2-A: 앱 루트 탐색**

프로젝트 디렉토리에서 Next.js 앱 루트를 찾는다:
1. `package.json`에 `"next"` 의존성이 있는 디렉토리를 탐색 (프로젝트 루트부터 하위 2단계까지)
2. 찾은 디렉토리에서 `src/app/` 또는 `app/` 하위 디렉토리 확인
3. 앱 루트 = `package.json` 위치 기준 `src/app/` 또는 `app/` 경로

예시: `package.json`이 `2026-04-14-html-spec/front/`에 있고 `src/app/`이 존재하면
→ 앱 루트 = `2026-04-14-html-spec/front/src/app/`

**Step 2-B: tsx 경로 추론**

앱 루트 아래에서 spec 파일명 패턴으로 경로를 추론한다:

| spec 파일명 패턴 | 앱 루트 기준 상대 경로 |
|----------------|---------------------|
| `{domain}-list.md` | `**/{domain}s/page.tsx` 또는 `**/{domain}/page.tsx` |
| `{domain}-detail.md` | `**/{domain}s/[id]/page.tsx` |
| `{domain}-form.md` | `**/{domain}s/new/page.tsx` |
| `{domain}-edit.md` | `**/{domain}s/[id]/edit/page.tsx` |

패턴 매칭 시 Glob으로 실제 파일 존재 여부를 확인한다. 복수형(`{domain}s`)과 원형(`{domain}`) 모두 시도한다.

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
