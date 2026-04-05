---
description: "시나리오 검증 전체 파이프라인 실행 (단위 검증 → 교차 검증 → 다음 단계 안내)"
argument-hint: "[도메인 파일명 (생략 시 미검증 전체)]"
---
# /validate-scenario

시나리오 검증 파이프라인을 실행한다.

## Steps

### Stage 1: 도메인별 단위 검증

1. 인자가 있으면 해당 도메인 파일만, 없으면 `docs/scenarios/MANIFEST.md`에서 `[ ]`인 도메인 전부를 대상으로 한다.
2. 전부 `[x]`이면 "단위 검증 완료 상태. Stage 2로 진행합니다."를 출력하고 바로 Stage 2로 넘어간다.
3. 대상 도메인마다 3개 서브에이전트를 병렬 디스패치한다 (validate-scenario SKILL.md 참조):
   - Agent A: Ubiquitous Language 점검
   - Agent B: Example Mapping
   - Agent C: Pre-mortem
4. 결과를 도메인별 테이블로 취합한다.
5. **GATE 1 판정**:
   - 전부 통과 → MANIFEST.md `[x]` 체크 → Stage 2 자동 진입
   - 발견사항 있음 → 사용자에게 보고하고 선택지를 제시:
     - "반영 후 재검증" → 시나리오 수정 후 Stage 1 반복 (다음 호출 시)
     - "무시하고 진행" → Stage 2 진입

### Stage 2: 교차 검증

1. `docs/scenarios/` 디렉토리를 대상으로 spec-dialectic 6단계를 실행한다 (spec-dialectic SKILL.md 참조).
2. Phase 5 Socratic Inquiry에서 모순/갭이 발견되면 사용자에게 질문한다. (**GATE 2**)
3. 사용자 답변을 받아 Synthesis를 수행한다.
4. 답변이 새로운 모순을 만들면 추가 질문한다.

### Stage 3: 다음 단계 안내

Synthesis 완료 후 사용자에게 다음 선택지를 제시한다 (**GATE 3**):

```
검증 파이프라인이 완료되었습니다.

→ 선택지:
- A) 기획 보강 필요 → /research 로 심화 조사
- B) UX/UI 설계 진입 → /ux-bootstrap → /strategize → /map-ia → /screen-cycle
- C) 구현 준비 완료 → /writing-plans 로 구현 계획 수립
```

사용자가 선택할 때까지 대기한다. 직접 진입하지 않는다.

## Rules
- 서브에이전트는 시나리오 파일을 읽기만 한다. 수정하지 않는다.
- 발견사항 반영은 사용자 확인 후 메인 에이전트가 수행한다.
- 게이트를 사용자 확인 없이 넘지 않는다.
- 각 Stage 세부 로직은 원본 SKILL.md(validate-scenario, spec-dialectic)를 따른다.
