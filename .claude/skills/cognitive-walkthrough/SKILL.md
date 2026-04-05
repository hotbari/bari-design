---
name: cognitive-walkthrough
description: "페르소나 관점 인지 워크스루 — 핵심 플로우를 페르소나 시점으로 걸으며 발견성·충분성·확신도 3축 평가. Playwright 스냅샷 기반. 결과를 이슈 레지스트리 + 게이트 체크리스트로 종합."
argument-hint: "[url (default: localhost:3000)] [flow (optional: specific flow name)]"
user-invocable: true
---

# Cognitive Walkthrough

## Context

$ARGUMENTS — target URL and optional flow name. Defaults to `http://localhost:3000`, all core flows.

페르소나 관점에서 핵심 플로우를 단계별로 걸으며, 각 단계에서 사용자가 목표를 달성할 수 있는지 3축(발견성·충분성·확신도)으로 판정한다.

---

## Instructions

### 1. Load Personas

Read all files in `docs/research/personas/` to load available personas. Select the most relevant persona(s) for each flow based on role-flow mapping:

| Flow domain | Primary persona |
|-------------|-----------------|
| 로그인/가입 | 박진수 (Admin) |
| 매체/매체사 | 김서영 (Media Owner) |
| 캠페인/스케줄링 | 최유진 (Sales Agency) |
| 소재/규격 | 이준혁 (Ops Agency) |
| 대시보드/리포트 | 박진수 (Admin) |
| 알림/설정 | 박진수 (Admin) |

### 2. Define Flows from IA

Read `docs/design/information-architecture.md` to extract core flows. If a specific flow was requested via $ARGUMENTS, use only that flow. Otherwise, evaluate these 5 core flows:

1. **login-to-dashboard**: 로그인 → 대시보드 확인
2. **campaign-create**: 캠페인 목록 → 캠페인 생성 → 저장
3. **media-register**: 매체사 목록 → 매체 등록 → 확인
4. **material-upload**: 소재 규격 확인 → 소재 업로드 → 승인 요청
5. **report-generate**: 리포트 목록 → 리포트 생성 → 결과 확인

For each flow, define the step-by-step sequence (page navigations + key actions).

### 3. Dispatch usability-evaluator per Flow

For each flow, dispatch the `usability-evaluator` subagent with:

```
Target URL: {url from $ARGUMENTS}
Persona: {selected persona — full content from persona file}
Flow: {flow name}
Steps: {ordered step list with URLs/actions}
Output directory: output/{date}-usability-{flow-name}/
```

If multiple flows are being evaluated, dispatch agents in parallel where possible.

### 4. Collect & Synthesize Results

After all agents complete, read each `output/{date}-usability-{flow}/report.md`.

#### Issue Registry

Compile all P0–P1 issues across flows into a single registry:

```markdown
# Usability Issue Registry
Generated: {date}

## P0 — Blocking
| # | Flow | Step | Issue | Persona | Fix |
|---|------|------|-------|---------|-----|

## P1 — Major
| # | Flow | Step | Issue | Persona | Fix |
|---|------|------|-------|---------|-----|

## Summary
- Flows evaluated: {N}
- Total steps: {N}
- Full-pass steps: {N} ({%})
- P0 issues: {N}
- P1 issues: {N}
- P2 issues: {N}
```

Write to `output/{date}-usability-synthesis/issue-registry.md`.

#### Gate Checklist

```markdown
# Usability Gate Checklist
Generated: {date}

| Flow | Pass Rate | P0 | P1 | Gate |
|------|-----------|----|----|------|
| login-to-dashboard | {N/M} | {count} | {count} | ✓ PASS / ✗ FAIL |
| campaign-create | ... | | | |
| ... | | | | |

## Gate Decision
- **PASS**: 모든 플로우 P0=0 AND P1≤2
- **CONDITIONAL**: P0=0 AND P1≤5 (P1 수정 후 재검증)
- **FAIL**: P0>0 OR P1>5

**Result**: {PASS / CONDITIONAL / FAIL}
```

Write to `output/{date}-usability-synthesis/gate-checklist.md`.

### 5. Present Results

Present to the user:

1. **Gate result** — PASS / CONDITIONAL / FAIL
2. **Flow-by-flow pass rates** — table
3. **Top P0/P1 issues** — max 5, with flow + step + fix
4. If CONDITIONAL/FAIL: suggest fix order (P0 first, then P1 by impact)

### 6. Iteration & Termination

이 스킬은 수정-재검증 사이클로 반복 실행될 수 있다. 아래 규칙에 따라 **자동으로** 반복 여부를 판단한다.

#### P1 분류: Task-blocking vs Standards-compliance

P1을 두 유형으로 분류한다:

| 유형 | 정의 | 예시 |
|------|------|------|
| **Task-blocking** | 페르소나가 플로우 목표를 달성할 수 없거나 심각한 오판을 유발 | 로그인 불가, 저장 후 피드백 없음, 상태 불일치, 확인 없이 삭제 |
| **Standards-compliance** | 태스크 완수는 가능하나 웹 표준/접근성 위반 | aria-label 누락, scope="col" 없음, fieldset/legend 없음, 키보드 트랩 |

#### Round 판정 규칙

각 Round 완료 후 아래 순서로 판정한다:

```
1. P0 > 0 → FAIL. 수정 후 재실행 (무조건).

2. Task-blocking P1 > 0 → FAIL. 수정 후 재실행.

3. Task-blocking P1 = 0 AND Standards-compliance P1 ≤ 5 → CONDITIONAL PASS.
   - 잔존 Standards P1을 수정한다.
   - 재실행하지 않는다.
   - 잔존 이슈는 프로덕션 구현 체크리스트로 이관한다.

4. 모든 P1 = 0 → PASS.

5. 최대 4 Round. R4까지 Task-blocking P1이 남아있으면
   CONDITIONAL PASS + 잔존 이슈를 프로덕션 체크리스트로 이관.
```

#### 수렴 감지

Round N과 Round N-1을 비교하여:
- Task-blocking P1이 감소하지 않았으면 → "동일 이슈 반복 또는 평가자 비일관성" 경고 출력
- 신규 P1의 80% 이상이 Standards-compliance 유형이면 → "심화 단계 진입" 판단 → 잔존 이슈 수정 후 재실행 없이 종료

#### 종료 시 산출물

CONDITIONAL PASS 또는 PASS 시, gate-checklist.md에 추가로:

```markdown
## 프로덕션 구현 체크리스트

### 이관된 Standards-compliance 이슈
| # | 화면 | 이슈 | WCAG | 프로덕션 해결 방법 |
|---|------|------|------|-------------------|
| 1 | ... | scope="col" 누락 | 1.3.1 | Table 컴포넌트에 자동 적용 |
| 2 | ... | fieldset/legend 누락 | 1.3.1 | CheckboxGroup 컴포넌트로 해결 |

### 프로토타입에서 검증 완료된 인터랙션
| # | 플로우 | 검증된 패턴 | acceptance criteria |
|---|--------|-----------|-------------------|
| 1 | login → dashboard | 로그인 성공 → 대시보드 전환 | 발견성·충분성·확신도 3축 pass |
```

### 7. Next Steps

Based on gate result:

- **PASS**: "프로덕션 전환 준비 완료. `/design-review`로 최종 디자인 품질 확인을 권장합니다."
- **CONDITIONAL PASS**: 잔존 Standards P1을 수정하고, 프로덕션 구현 체크리스트를 출력한다. 재실행하지 않는다.
- **FAIL**: Task-blocking P1을 수정 후 재실행한다.

---

## 주의사항

1. **URL 디렉토리 통일**: 에이전트 디스패치 시 프로토타입 정본 디렉토리만 사용. 구버전과 혼용하면 평가 오염
2. **스크린샷 분리**: 산출물은 `report.md` + `screenshots/` 하위 폴더. 같은 레벨에 png 혼재 금지
3. **프로덕션 URL 재실행**: GATE U1 통과 후 프로덕션 빌드에 URL만 바꿔 동일 워크스루 재실행 가능. 프로토타입 대비 점수 후퇴 감지용
4. **최대 4 Round**: 프로토타입 단계에서의 반복은 4회로 제한. 그 이후의 품질 개선은 프로덕션 코드에서 실행
