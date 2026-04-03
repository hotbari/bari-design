---
name: scenario-pipeline
description: "시나리오 검증 전체 파이프라인. validate-scenario(도메인별 단위 검증) → spec-dialectic(교차 검증)을 게이트 방식으로 연결. 각 단계 완료 시 사용자 확인 후 다음 단계 진입."
---

# Scenario Pipeline

validate-scenario와 spec-dialectic을 하나의 파이프라인으로 연결한다. 각 게이트에서 사용자 확인을 받고, 통과해야 다음 단계로 진행한다.

## 파이프라인 흐름

```
[Stage 1] 도메인별 단위 검증 (validate-scenario)
    │
    ├─ 발견사항 있음 → 사용자에게 보고 → ⛔ GATE 1: 반영 확인
    │                                        ├─ 반영 후 재검증 → Stage 1 반복
    │                                        └─ 무시하고 진행 → Stage 2
    │
    └─ 전부 통과 → MANIFEST.md [x] 체크 → Stage 2 자동 진입
                                              │
[Stage 2] 교차 검증 (spec-dialectic)
    │
    ├─ 모순/갭 발견 → Socratic Inquiry → ⛔ GATE 2: 해결 확인
    │                                        ├─ 해결 반영 → Synthesis
    │                                        └─ 보류 → Synthesis (remaining gaps 포함)
    │
    └─ 모순 없음 (rare) → Synthesis
                              │
[Stage 3] 다음 단계 안내 → ⛔ GATE 3: 사용자 선택
    ├─ A) 기획 보강 → research 스킬 안내
    └─ B) 구현 준비 → writing-plans 스킬 안내
```

## 게이트 규칙

1. **GATE 1**: Stage 1 발견사항이 있으면 반드시 사용자에게 보고하고 반영 여부를 확인받는다. 사용자가 "진행"이라고 하면 Stage 2로 넘어간다.
2. **GATE 2**: Stage 2의 Socratic Inquiry 질문에 사용자가 답변해야 Synthesis에 진입한다. 답변이 새로운 모순을 만들면 추가 질문한다.
3. **GATE 3**: writing-plans 직접 진입 금지. 반드시 사용자가 선택한다.

## Stage 1 세부: validate-scenario

validate-scenario SKILL.md의 전체 프로세스를 그대로 따른다:

1. 대상 결정 — 인자가 있으면 해당 파일, 없으면 MANIFEST.md에서 `[ ]`인 도메인 전부
2. 도메인별 3단계 병렬 검증 (Ubiquitous Language, Example Mapping, Pre-mortem)
3. 결과 취합 — 도메인별 통과/미통과 테이블
4. 통과한 도메인은 MANIFEST.md `[x]` 체크

## Stage 2 세부: spec-dialectic

spec-dialectic SKILL.md의 6단계를 그대로 따른다:

1. Discovery — 전체 문서 인벤토리
2. Ontology — 엔티티 분류
3. Lifecycle FSM — 상태 머신 정의
4. Phase 3.5 — 엔티티 완전성 (entity-coverage-scanner 에이전트 디스패치 포함)
5. Dialectic Analysis — 문서 간 모순 탐지
6. Socratic Inquiry → 사용자 답변 → Synthesis

## Stage 3 세부: 다음 단계 안내

Synthesis 완료 후 사용자에게 선택지를 제시한다:

```markdown
검증 파이프라인이 완료되었습니다.

→ 선택지:
- A) 기획 보강이 필요하면 → `/research` 로 심화 조사 후 시나리오 보완
- B) 구현 준비가 되었으면 → `/writing-plans` 로 구현 계획 수립
```

## 주의사항

- 각 Stage의 세부 로직은 원본 SKILL.md를 참조한다. 이 스킬은 오케스트레이션만 담당한다.
- 사용자 확인 없이 게이트를 넘지 않는다.
- Stage 1에서 발견사항을 반영하면 해당 도메인의 MANIFEST.md `[x]`가 hook에 의해 `[ ]`로 돌아간다. 재검증은 다음 파이프라인 호출 시 수행.
