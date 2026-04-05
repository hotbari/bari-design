---
name: screen-cycle
description: "화면 단위 설계+구현 통합 파이프라인. brainstorming → design-screen → critique(설계 게이트) → frontend-design-impeccable → create-component → design-review(구현 게이트) → polish. 설계부터 코드까지 한 사이클."
argument-hint: "[화면명 또는 컴포넌트명]"
user-invocable: true
---

# Screen Cycle

## Context

$ARGUMENTS — 대상 화면 또는 컴포넌트. 생략 시 사용자에게 질문.

화면 하나를 설계부터 구현까지 완주하는 통합 파이프라인. 설계만 하고 코드를 안 만드는 반쪽짜리 워크플로우를 방지한다.

## Pipeline

```
[Stage 1: 설계]
  brainstorming → design-screen → critique
      │                               │
      │                    GATE 1: Nielsen 30/40 미만 → 수정 후 재평가
      │                               │ (통과)
      ▼                               ▼
[Stage 2: 구현]
  frontend-design-impeccable → create-component → design-review
      │                                               │
      │                                    GATE 2: P0/P1 이슈 → 수정 후 재평가
      │                                               │ (통과)
      ▼                                               ▼
[Stage 3: 마감]
  polish → 사용자 확인 → (선택) writing-plans (잔여 구현)
```

## Instructions

### Stage 1: 설계

#### 1-1. Brainstorming

`/brainstorming $ARGUMENTS` 실행. 사용자와 요구사항·방향을 정한다.

#### 1-2. Design Screen

`/design-screen $ARGUMENTS` 실행. 화면 명세 + 컴포넌트 목록을 추출한다.

#### 1-3. Critique (GATE 1)

`/critique $ARGUMENTS` 실행.

**게이트 규칙**:
- Nielsen 총점 **30/40 이상** → Stage 2로 진행
- **30/40 미만** → 피드백 기반으로 설계 수정 후 `/critique` 재실행
- 최대 2회 재평가. 2회 후에도 미달이면 사용자에게 판단 위임

Stage 1 완료 시 사용자에게 결과를 보여주고 Stage 2 진입 확인을 받는다.

### Stage 2: 구현

#### 2-1. Frontend Design Impeccable

`/frontend-design-impeccable $ARGUMENTS` 실행. 프로덕션급 HTML/CSS/JS 코드를 생성한다.

#### 2-2. Create Component

`/create-component` 실행. 컴포넌트 스펙 + 코드를 작성한다.

#### 2-3. Design Review (GATE 2)

`/design-review` 실행. Playwright 기반 구현 품질 평가.

**게이트 규칙**:
- **P0/P1 이슈 없음** → Stage 3로 진행
- **P0/P1 이슈 있음** → 수정 후 `/design-review` 재실행
- 최대 2회 재평가. 2회 후에도 미달이면 사용자에게 판단 위임

Stage 2 완료 시 사용자에게 결과를 보여주고 Stage 3 진입 확인을 받는다.

### Stage 3: 마감

#### 3-1. Polish

`/polish` 실행. 정렬, 간격, 일관성 최종 점검.

#### 3-2. 사용자 확인 (GATE 3)

polish 결과를 보여주고 완료 확인을 받는다.

#### 3-3. 잔여 구현 (선택)

추가 구현이 필요하면 `/writing-plans`로 잔여 작업을 계획한다.

## Common Mistakes

| 실수 | 결과 | 수정 |
|------|------|------|
| brainstorming 없이 바로 design-screen | 요구사항 누락 | Stage 1 순서 준수 |
| critique 미통과 상태에서 구현 진입 | 설계 결함이 코드에 고착 | GATE 1 통과 필수 |
| design-review 없이 polish만 | 렌더링 이슈 미탐지 | GATE 2 통과 필수 |
| 사용자 확인 없이 다음 Stage 진입 | 방향 불일치 | 각 Stage 종료 시 확인 |
