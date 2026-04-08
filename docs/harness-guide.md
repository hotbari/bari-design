# AI 에이전트 UX 설계 하네스 — 이해와 재사용 가이드

> 18개 세션, 135k줄의 대화 로그에서 추출한 하네스 여정 기록.
> 운영 매뉴얼은 [process-raw.md](./process-raw.md)를 참조.

---

## Part 1: 세션별 여정 타임라인

### 요약 테이블

| # | 날짜 | 주제 | 산출물 | 하네스 변경 | 핵심 결정 |
|---|------|------|--------|------------|----------|
| 01 | 04-01 | spec-dialectic 스킬 TDD 개발 | `spec-dialectic/SKILL.md` | 첫 스킬 생성 (RED→GREEN→REFACTOR) | FSM + Design by Contract 수준의 형식 검증, 프로젝트 무관 범용 설계 |
| 02 | 04-01 | 시나리오 파이프라인 설계 + 7개 도메인 작성 | 7개 시나리오 문서, `MANIFEST.md`, CLAUDE.md 워크플로우 | validate-scenario 3단계 검증 체계 확립 | MANIFEST 기반 게이트 (하드코딩 7개 → 유연), 하이브리드 UC 형식, writing-plans 직행 금지 |
| 03 | 04-01 | /research 스킬 등록 수정 | `research/SKILL.md` 생성 | 스킬 등록 구조 규칙 발견 | 서비스명 "DOOH" 확정 |
| 04 | 04-01 | 페르소나 인터뷰 + 8건 모순 해소 | 시나리오 5개 파일 업데이트, 어피니티 다이어그램 | 페르소나 시뮬레이션 인터뷰 패턴 확립 | 매체 비활성화 시 `일시정지` 상태 도입, 구좌 3종 상태 |
| 05 | 04-02 | 인터뷰 결론 반영 + 자동화 훅 + 스킬 정리 | `uncheck-manifest.sh`, validate-scenario 스킬, hub SKILL.md 3개 | PostToolUse hook, bari 플러그인 네임스페이스 | 감지(자동) vs 실행(수동) 분리, MANIFEST가 현재 규모에 최선 |
| 06 | 04-02 | 시나리오 검증 완료 + 4 페르소나 투표 + 프로토타입 계획 | 4개 페르소나 파일, spec-analysis-report, 프로토타입 계획서 | 페르소나 파일 저장 필수화, interview 자동 검색 | 용어집은 시나리오 2개째에, Next.js→순수 HTML 전환 |
| 07 | 04-03 | HTML 프로토타입 ~25개 구현 + cognitive-walkthrough 설계 시작 | `2026-04-03-prototype/` 전체 | cognitive-walkthrough 스킬/에이전트 설계 착수 | Playwright MCP로 file:// 프로토타입 테스트 |
| 08 | 04-03 | 4 역할 병렬 프로토타입 검증 | layout.js 버그 수정 | verify-prototype 병렬 에이전트 패턴 실증 | 브라우저 폼 자동복원 레이스 컨디션 발견·해결 |
| 08-1 | 04-03 | Entity Completeness Check 구현 | `entity-coverage-scanner` 에이전트, spec-dialectic Phase 3.5 | spec-dialectic에 Phase 3.5 추가 | 기존 스킬 확장 > 새 스킬 생성 |
| 09 | 04-03 | 회의록 반영 + 재생목록 누락 원인 분석 | 시나리오 7개 업데이트, Phase 3.5 설계 | entity-coverage-scanner 설계 (08-1에서 구현) | 메뉴 단위 ≠ 엔티티 단위 → 커버리지 갭 발생 원인 |
| 10 | 04-03 | validate-scenario + spec-dialectic 통합 | `scenario-pipeline/SKILL.md`, `/validate-all` | 게이트 방식 파이프라인 통합 | "깔끔한게 좋아" → 옵션 C (게이트 파이프라인) |
| 11 | 04-03~05 | 시나리오 검증 3라운드 (92→55→19) + 4 페르소나 인터뷰 | 4개 인터뷰 인사이트, 시나리오 업데이트 | 세션 상태 핸드오프 패턴 (memory 활용) | 삭제=soft delete, 스토리보드 형식 부연 설명 |
| 12 | 04-03 | UX/UI 스킬 정찰 | 없음 | 없음 | 스킬 사용 가능 시점 분류 (즉시/중간/구현 후) |
| 13 | 04-05 | 스킬 하네스 정비 + UX 전략~프로토타입 1개 완성 | IA, 디자인 파운데이션, 소재관리 화면 명세, 프로토타입 | screen-cycle, ux-bootstrap, design-foundation, map-ia 신규 | "도구 정비가 프로젝트 진행보다 우선" |
| 14 | 04-05 | GATE D2 + 프로토타입 4개 일괄 빌드 + 품질 격차 발견 | 프로토타입 4개, design-eval 리포트 7개, CSS 통합 계획 | Prototype Rules (CLAUDE.md), GATE 명명(S/D), 교훈 기록 | 명세 없이 직행 → Nielsen 7점 차이 실측, 교훈을 하네스에 내장 |
| 15 | 04-05 | output 폴더 정리 실행 | 64개 파일 → output/ 구조화 | design-evaluator, design-review 경로 갱신, Output Rules | 하네스 수정 먼저 → 파일 이동 나중 |
| 16 | 04-05~06 | CSS 공통화 + 사용성 검증 하네스 설계 | shared.css, usability-evaluator/cognitive-walkthrough 설계 | usability-evaluator, cognitive-walkthrough 설계 | HTML 프로토타입의 가치 = "버리는 비용 0" |
| 17 | 04-06 | cognitive-walkthrough 구현 + GATE U1 4R 검증 + 하네스 최종 진화 | GATE U1 산출물, process-raw.md 전면 개정 | P1 분류(Task-blocking/Standards), 자동 종료 규칙, 디렉토리 기준 | 양파 효과 vs 평가자 비일관성 구분, 최대 4R 제한 |

### 세션 규모

| # | 메시지 | 시간 | 토큰 | 비고 |
|---|--------|------|------|------|
| 01 | 127 | 85m | — | 첫 스킬 TDD |
| 02 | 459 | 149m | — | 최장 시나리오 작성 |
| 06 | 324 | 26h+ | — | 장시간 세션 (idle 포함) |
| 11 | 415 | 48h | 17.6M | 3라운드 검증 |
| 13 | 623 | 118m | 33.3M | 하네스 정비 + 설계 파이프라인 관통 |
| 14 | 823 | 159m | 55.5M | 최대 메시지 수 |
| 17 | 934 | 709m | 72M | 최대 토큰, 하네스 최종 진화 |

---

## Part 1.5: 스토리보드 — 실제 대화에서 배우기

### "스킬은 TDD로 만들어야 한다"

**배경**: Session 01. spec-dialectic 스킬을 만들기 전, 먼저 스킬 없이 에이전트가 어떻게 동작하는지 관찰하는 RED 단계를 실행.

**대화 인용**:
> RED 단계 실행 결과, 에이전트의 6가지 약점이 발견됨:
> - 질문을 하지 않음 (가정으로 처리)
> - 정형 FSM 없음
> - Design by Contract 없음
> - 변증법적 종합 없음
> - 문서 수정을 제안하지 않음
> - 이미 해결된 모순을 재보고

**전환점**: 스킬 없는 에이전트의 실패 패턴을 먼저 기록하고, 그 패턴을 해소하는 방향으로 스킬을 작성. GREEN 테스트에서 35분 타임아웃이 발생했지만, RED 기록이 있었기에 수동 검증으로도 "무엇이 개선되었는지" 판단 가능.

**결과**: spec-dialectic SKILL.md의 6단계 프로세스는 모두 RED에서 발견된 약점을 해소하기 위해 설계됨. 이후 모든 스킬 작성에 "먼저 실패를 관찰하라"는 원칙이 적용.

---

### "도구 정비가 먼저다"

**배경**: Session 13. 시나리오 파이프라인 완료 후 UX/UI 설계로 진입하려는데, 스킬 체계에 중복·누락·끊긴 연결이 발견됨.

**대화 인용**:
> **사용자** (Session 13, Turn 1):
> "Implement the following plan: # 스킬 하네스 정비 플랜 [...] 시나리오 파이프라인 완료 후 UX/UI 설계 진입을 검토한 결과, 스킬 체계에 중복·누락·끊긴 연결이 발견되었다. **프로젝트 진행보다 도구 자체의 완성도를 높이는 것이 우선**이라는 판단 하에, 스킬 하네스를 범용적으로 정비한다."

**전환점**: 프로젝트 일정보다 하네스 품질을 우선한 결정. 사용자가 직접 정비 플랜을 작성하여 전달.

**결과**: 6개 스킬 신규/수정 (screen-cycle, ux-bootstrap, design-foundation, map-ia, critique/design-review 구분). 정비 후 Session 13 후반에서 UX 전략 → IA → 디자인 파운데이션 → 화면 명세 → 프로토타입까지 2시간 만에 관통. 도구 정비가 실행 속도를 극적으로 높임.

---

### "시나리오에서 프로토타입 직행하면 안 된다"

**배경**: Session 14. 소재관리만 화면 명세(GATE D1)를 거쳤고, 나머지 6개는 시나리오에서 바로 프로토타입으로 점프.

**대화 인용**:
> **사용자** (Session 14, Turn 51):
> "지금까지의 내 행동에 수정이 필요한 부분이나 불필요했던 부분이 있는지 확인해줘"
>
> **에이전트** (Session 14, Turn 52):
> "## 불필요했거나 비효율적이었던 것
> ### 3. 후반 4개 프로토타입 품질 격차
> | 구분 | 소재/편성/매체 | 대시보드/캠페인/사용자/알림 |
> | Nielsen | 32~33/40 | 25~27/40 |
> | 코드량 | 1,400~2,000줄 | 200~500줄 |
> **7점 차이는 유의미**함."

> **사용자** (Session 14, Turn 53):
> "지금 발견한 부분들을 다른 프로젝트에서는 되풀이 해서는 안돼. claude.md나 skills 등 **하네스 적인 부분에서 수정**하면 될까?"

**전환점**: 에이전트의 솔직한 자기 평가에서 품질 격차가 수치로 드러남. 사용자가 "현재 프로젝트 수정"이 아니라 "하네스에 반영하여 재발 방지"를 요구.

**결과**: CLAUDE.md에 Prototype Rules 6개 추가. 핵심 규칙: "명세 없이 만들면 '대략적 해석'이 되어 Nielsen 5~8점 차이 발생 (실측)". 이후 모든 프로토타입은 GATE D1(critique)을 거쳐야 함.

---

### "P1이 늘어났는데 왜?"

**배경**: Session 17. cognitive-walkthrough 4라운드 실행 중, Round 3에서 P1이 줄어들다가 Round 4에서 특정 플로우의 P1이 다시 증가.

**대화 인용**:
> **사용자** (Session 17, Turn 81):
> "한 번에 해결되지 않는 이유가 궁금해"
>
> **에이전트** (Session 17, Turn 82):
> "솔직하게 말하면 두 가지 원인이 있습니다.
> ## 1. 자연스러운 원인: 양파 효과
> 표면 이슈를 해소하면 더 깊은 이슈가 드러납니다. 이건 정상입니다.
> ```
> R1: 로그인이 안 돼요 (P0)
> R2: 로그인은 되는데 대시보드에서 클릭이 안 돼요 (P1)
> R3: 클릭은 되는데 KPI 카드가 fake affordance예요 (P1)
> ```
> ## 2. 문제가 되는 원인: 평가자 비일관성
> media-register가 R3에서 P1 1건 → R4에서 P1 4건으로 **증가**한 것은 양파 효과로 설명이 안 됩니다. ... 매 라운드 에이전트가 **새로운 LLM 추론**으로 동작 / P1/P2 경계가 **주관적** ... **이건 하네스의 약점입니다.**"

**전환점**: 양파 효과(정상)와 평가자 비일관성(문제)의 구분. 사용자가 이 인사이트를 하네스에 내장할 것을 요구.

**결과**: P1을 Task-blocking(사용자 목표 달성 불가)과 Standards-compliance(태스크 완수 가능, 접근성 위반)로 분류. Task-blocking P1=0이면 CONDITIONAL PASS로 자동 종료하는 규칙을 cognitive-walkthrough 스킬에 내장. 최대 4R 제한.

---

### "한 번에 해결되지 않는 이유" — 하네스 자동화 요구

**배경**: Session 17. 위의 양파 효과/비일관성 논의 직후. 사용자가 "이 프로젝트에서 내가 판단한 것"을 "다른 프로젝트에서 자동으로 적용"하길 원함.

**대화 인용**:
> **사용자** (Session 17, Turn 87):
> "실용적으로 하면 좋지, 근데 나는 **하네스를 만드는 중**이잖아. 다른 프로젝트에서도 이 과정을 거칠텐데 그 때는 이렇게 내가 물어봐서가 아닌 **미리 정의된 내용에 의해서 결론**이 났으면 좋겠는데 그렇게 할 수 있어?"
>
> **에이전트** (Session 17, Turn 88):
> "가능합니다. 종료 조건과 수렴 판단 규칙을 스킬에 내장하면 됩니다."

**전환점**: 하네스의 존재 이유를 가장 명확하게 드러낸 순간. "사용자가 매번 판단하지 않아도 되는 자동 종료 규칙"이라는 요구가 P1 분류 체계 + 수렴 감지 + 최대 4R 제한으로 구현됨.

**결과**: cognitive-walkthrough SKILL.md에 자동 판정 로직 내장. 이후 다른 프로젝트에서도 동일 기준이 적용됨.

---

## Part 2: 하네스 아키텍처 맵

### 먼저 알아야 할 것: 스킬과 에이전트는 어떻게 동작하는가

이 하네스를 이해하려면 Claude Code의 스킬 시스템이 어떻게 동작하는지를 먼저 알아야 한다.

#### 스킬(Skill)이란

`.claude/skills/{skill-name}/SKILL.md` 파일에 정의된 **에이전트 행동 지침**이다. 사용자가 `/skill-name`을 입력하면 Claude가 해당 SKILL.md를 읽고, 거기에 적힌 Instructions를 따라 행동한다.

스킬은 코드가 아니다. **자연어로 작성된 프로세스 정의**다. Claude가 SKILL.md를 읽으면 "아, 이 순서로 이것들을 해야 하는구나"를 이해하고 실행한다.

```
.claude/skills/scenario-pipeline/
├── SKILL.md                    ← 파이프라인 전체 흐름 + 게이트 규칙
├── commands/
│   └── validate-scenario.md    ← /validate-scenario 커맨드 (진입점)
└── skills/
    ├── validate-scenario/SKILL.md  ← Stage 1 세부 로직
    └── spec-dialectic/SKILL.md     ← Stage 2 세부 로직
```

- `SKILL.md`: 스킬의 목적, 실행 순서, 게이트 규칙을 정의
- `commands/*.md`: 슬래시 커맨드(`/validate-scenario`)의 실행 로직. 사용자 진입점
- `skills/*/SKILL.md`: 하위 스킬. 상위 스킬이 참조

#### 에이전트(Agent)란

`.claude/agents/{agent-name}.md` 파일에 정의된 **서브프로세스 행동 지침**이다. 스킬이 `Agent` 도구로 디스패치하면, 별도 프로세스에서 에이전트 정의를 따라 독립적으로 작업하고 결과를 반환한다.

스킬과의 차이:
- **스킬**: 메인 대화에서 실행. 사용자와 대화할 수 있음
- **에이전트**: 별도 프로세스에서 실행. 사용자와 직접 대화 불가. 결과만 반환

#### 연쇄 동작은 어떻게 가능한가

"Stage 1이 끝나면 Stage 2로 넘어가는" 연쇄 동작은 **SKILL.md에 명시된 흐름을 Claude가 읽고 따르는 것**이다.

예를 들어 `scenario-pipeline/commands/validate-scenario.md`에는:

```markdown
### Stage 1: 도메인별 단위 검증
1. MANIFEST.md에서 [ ]인 도메인 전부를 대상으로 한다.
2. 대상 도메인마다 3개 서브에이전트를 병렬 디스패치한다.
...
5. **GATE 1 판정**:
   - 전부 통과 → MANIFEST.md [x] 체크 → Stage 2 자동 진입
   - 발견사항 있음 → 사용자에게 보고하고 선택지를 제시

### Stage 2: 교차 검증
1. docs/scenarios/ 디렉토리를 대상으로 spec-dialectic 6단계를 실행한다.
```

Claude는 이 문서를 읽고 "Stage 1 → GATE 판정 → Stage 2"를 순서대로 실행한다. 프로그래밍이 아니라 **지시문을 따르는 것**이다.

#### SKILL.md vs CLAUDE.md — 어디에 무엇을 쓰는가

| | SKILL.md | CLAUDE.md |
|---|----------|-----------|
| **역할** | 특정 스킬의 실행 절차 | 프로젝트 전체 규칙 |
| **읽는 시점** | 해당 스킬이 호출될 때 | 매 대화 시작 시 항상 |
| **영향 범위** | 해당 스킬 실행 중에만 | 모든 대화, 모든 작업 |
| **예시** | "Stage 1에서 3개 에이전트를 병렬 디스패치" | "사용자 확인 없이 writing-plans에 직접 진입 금지" |
| **적합한 내용** | 구체적 실행 단계, 입출력 형식, 게이트 기준 | 프로젝트 규칙, 디렉토리 구조, 워크플로우 제약 |

**실제 예시**: "시나리오에서 프로토타입 직행 금지" 규칙은 CLAUDE.md에 있다. 이 규칙은 특정 스킬이 아니라 **모든 작업**에 적용되어야 하기 때문이다. 반면 "validate-scenario에서 3개 에이전트를 병렬 디스패치한다"는 validate-scenario SKILL.md에 있다. 이건 해당 스킬에서만 필요한 구체적 절차이기 때문이다.

**쓰는 기준**:
- "이 스킬을 실행할 때만 필요한 절차" → SKILL.md
- "어떤 작업을 하든 항상 지켜야 할 규칙" → CLAUDE.md
- "특정 스킬 간의 연결 순서" → 파이프라인 SKILL.md (오케스트레이터)

---

### 전체 파이프라인 흐름

```
[시나리오 작성]
    │
    ▼
scenario-pipeline ─── GATE S1 (단위 검증) ─── GATE S2 (교차 검증) ─── GATE S3 (사용자 선택)
                                                                            │
    ┌───────────────────────────────────────────────────────────────────────┘
    ▼
ux-bootstrap → ux-strategy(/strategize, /map-ia) → design-foundation
    │
    ▼
screen-cycle ──── GATE D1 (critique, 30/40) ──── GATE D2 (design-review, P0/P1)
    │
    ▼
cognitive-walkthrough ──── GATE U1 (Task-blocking P1=0, max 4R)
    │
    ▼
[프로덕션 전환 준비]
```

이 흐름에서 각 파이프라인 사이의 연결은 **자동이 아니다**. scenario-pipeline이 끝나면 GATE S3에서 사용자에게 "다음에 뭘 할지" 선택지를 보여주고, 사용자가 "B) UX/UI 설계"를 선택하면 그때 `/ux-bootstrap`을 실행한다. 파이프라인 **내부**의 Stage 연결은 자동이지만, 파이프라인 **사이**의 연결은 사용자 판단에 의존한다.

---

### 파이프라인 1: scenario-pipeline — 시나리오 검증

**진입점**: `/validate-scenario` (사용자가 직접 호출)
**파일**: `.claude/skills/scenario-pipeline/SKILL.md`
**목적**: 시나리오 문서의 품질을 검증하고, 문서 간 모순을 발견·해소하여 구현 전에 명세를 확정

```
[사용자] /validate-scenario
    │
    ▼
Stage 1: 도메인별 단위 검증 (validate-scenario)
    │
    ├─ MANIFEST.md에서 [ ]인 도메인 목록 추출
    │  (전부 [x]이면 "검증 완료, Stage 2로" 안내)
    │
    ├─ 도메인마다 3개 서브에이전트를 병렬 디스패치:
    │   ┌──────────────────────────────────────────────┐
    │   │ Agent A: Ubiquitous Language 점검             │
    │   │ Agent B: Example Mapping                      │
    │   │ Agent C: Pre-mortem                           │
    │   └──────────────────────────────────────────────┘
    │   (5개 도메인이면 15개 에이전트가 동시 실행)
    │
    ├─ 결과 취합 → 도메인별 통과/미통과 테이블
    │
    ⛔ GATE S1: 발견사항이 있으면 사용자에게 보고
    │   ├─ "반영 후 재검증" → 시나리오 수정 → 다음 호출 시 재검증
    │   └─ "무시하고 진행" → Stage 2로
    │
    ▼
Stage 2: 교차 검증 (spec-dialectic 6단계)
    │
    ├─ Phase 1: Discovery — 전체 문서 인벤토리
    ├─ Phase 2: Ontology — 엔티티 분류 (Core/Supporting, 라이프사이클 여부)
    ├─ Phase 3: Lifecycle FSM — 상태 머신 정의
    ├─ Phase 3.5: Entity Completeness — entity-coverage-scanner 에이전트 디스패치
    ├─ Phase 4: Dialectic Analysis — 문서 간 모순 탐지
    ├─ Phase 5: Socratic Inquiry — 사용자에게 질문
    │
    ⛔ GATE S2: 사용자가 질문에 답변해야 진행
    │   (답변이 새 모순을 만들면 추가 질문)
    │
    ├─ Phase 6: Synthesis — 분석 리포트 + 문서 수정
    │
    ▼
Stage 3: 다음 단계 안내
    │
    ⛔ GATE S3: 사용자 선택 (자동 진입 금지)
        ├─ A) /research — 기획 보강
        ├─ B) /ux-bootstrap → /strategize → /map-ia → /screen-cycle — UX/UI 설계
        └─ C) /writing-plans — 구현 준비
```

#### Stage 1의 3가지 검증은 무엇인가

세 가지 검증은 각각 다른 관점에서 시나리오를 분석한다. 모두 시나리오 파일을 **읽기만** 하고, 수정은 하지 않는다.

**Agent A: Ubiquitous Language 점검**

Ubiquitous Language(보편 언어)는 DDD(Domain-Driven Design)의 핵심 개념이다. 모든 이해관계자가 **같은 용어를 같은 의미로** 사용해야 한다는 원칙이다.

이 에이전트가 탐지하는 것:
- **동의어**: 같은 것을 다른 이름으로 부르는 경우 (예: "구좌"와 "슬롯"이 같은 것인지 다른 것인지)
- **모호한 용어**: 정의 없이 사용되는 용어 (예: "권한 범위 내"가 정확히 무엇인지)
- **미정의 참조**: 다른 도메인에서 정의된 용어를 설명 없이 사용
- **도메인 간 불일치**: `docs/scenarios/` 내 다른 파일과 대조하여 같은 용어가 다른 의미로 쓰이는 경우

**왜 필요한가**: 용어 불일치는 구현 시 "같은 API를 다르게 해석"하는 사고로 이어진다. 이 프로젝트에서 실제로 "구좌"의 상태 정의가 문서마다 달랐고, Ubiquitous Language 점검에서 발견하여 3종 상태(정상/삭제됨/네이버연동)로 통일했다.

**Agent B: Example Mapping**

Example Mapping은 BDD(Behavior-Driven Development) 커뮤니티에서 나온 기법이다. 각 비즈니스 규칙에 대해 **구체적인 예시(input → expected output)를 생성**하여, 규칙이 모호하거나 불완전한지 확인한다.

이 에이전트가 하는 것:
- 각 UC의 비즈니스 규칙, 가드 조건, 불변식을 추출
- 규칙마다 구체적 예시를 생성 (예: "캠페인 상태가 '집행중'이고 매체가 비활성화되면 → 알림 발송")
- **예시가 없어 동작이 모호한 규칙** 탐지
- **"이런 경우에는" 섹션에 빠진 엣지 케이스** 발견
- **FSM 전이에서 가드 조건이 불완전한 경우** 탐지

**왜 필요한가**: 규칙을 자연어로만 적으면 "해석의 여지"가 남는다. 구체적 예시가 있으면 규칙의 의미가 확정된다. 이 프로젝트에서 "매체 비활성화 시 편성표 처리"는 Example Mapping에서 "비활성화 기간이 편성 종료일을 넘기면?" 예시가 생성되면서 규칙 미정의가 드러났다.

**Agent C: Pre-mortem**

Pre-mortem은 Gary Klein이 개발한 프로젝트 관리 기법이다. "이 시스템이 운영 중 실패한다면 원인은 무엇인가?"라는 질문으로 **역방향 사고**를 한다.

이 에이전트가 점검하는 것:
- **빠진 요구사항**: 시나리오로 커버되지 않는 실패 시나리오
- **동시성/순서 문제**: 두 사용자가 동시에 같은 편성표를 수정하면?
- **외부 의존성 장애**: SSP, 플레이어, FTP가 다운되면?
- **데이터 정합성**: FSM 상태 불일치가 발생할 수 있는 경로

**왜 필요한가**: Happy path만 검증하면 운영 사고는 예방할 수 없다. 이 프로젝트에서 Pre-mortem이 "편성표 동시 편집 → 데이터 충돌" 시나리오를 발견하여 비관적 잠금 + 충돌 감지 + 3회 재시도 규칙이 추가되었다.

#### GATE S1은 왜 존재하는가

GATE S1은 "검증에서 발견된 문제를 반영할지 무시할지"를 사용자가 결정하는 지점이다.

존재 이유:
1. **서브에이전트는 파일을 수정하지 않는다** — 읽기만 하고 발견사항을 보고한다. 수정 권한은 사용자에게 있다
2. **모든 발견사항이 반영 대상은 아니다** — 에이전트가 "모호하다"고 지적한 것이 의도적인 유연성일 수 있다
3. **반영 후 재검증이 필요한지 판단해야 한다** — 사소한 수정은 재검증 없이 넘어가도 되지만, 구조적 변경은 재검증이 필요하다

실제 운영: 첫 실행에서 92건 발견 → 반영 후 55건 → 반영 후 19건. 3회 반복 후 전부 통과.

#### Stage 1에서 Stage 2로 넘어가는 메커니즘

`scenario-pipeline/commands/validate-scenario.md`에 명시되어 있다:

```markdown
5. **GATE 1 판정**:
   - 전부 통과 → MANIFEST.md [x] 체크 → Stage 2 자동 진입
   - 발견사항 있음 → 사용자에게 보고하고 선택지를 제시
```

Claude는 이 지시를 읽고, GATE 1이 통과하면 **같은 대화 내에서** Stage 2(spec-dialectic)를 시작한다. "자동 진입"이라고 적혀 있으니 사용자 확인 없이 넘어간다.

반면 발견사항이 있으면 사용자에게 보고하고 멈춘다. 사용자가 "반영 후 재검증"을 선택하면, Claude가 시나리오를 수정한 뒤 **다음 `/validate-scenario` 호출 시** Stage 1부터 다시 시작한다. "무시하고 진행"을 선택하면 Stage 2로 넘어간다.

#### Stage 2: spec-dialectic은 무엇을 하는가

spec-dialectic은 **문서 간 모순을 발견하는** 스킬이다. Stage 1이 도메인 하나를 깊이 파는 것이라면, Stage 2는 **도메인 사이의 관계**를 검증한다.

철학적 기반이 있다:
- **아리스토텔레스 무모순율**: 같은 엔티티에 대해 두 문서가 모순되는 속성을 부여할 수 없다
- **소크라테스 문답법**: 모호한 점을 발견하면 가정하지 않고 반드시 질문한다
- **헤겔 변증법**: 테제(문서 A 주장) + 안티테제(문서 B 주장) → 종합(사용자 결정)
- **Design by Contract**: 모든 상태 전이에 사전 조건, 사후 조건, 불변식을 정의한다

6단계 프로세스:

| Phase | 이름 | 하는 일 | 산출물 |
|-------|------|---------|--------|
| 1 | Discovery | 전체 문서를 읽고 엔티티, 상태, 교차 참조, 미결 항목을 인벤토리 | 문서별 엔티티 목록 테이블 |
| 2 | Ontology | 엔티티를 Core/Supporting으로 분류, 라이프사이클 여부 판정 | 엔티티 분류 테이블 |
| 3 | Lifecycle FSM | 라이프사이클 엔티티마다 상태 머신 정의 (상태, 전이, 가드, 불변식) | FSM 다이어그램 + Design by Contract |
| 3.5 | Entity Completeness | 권한-UC 매핑 갭, 의존 완전성, 구현 커버리지 검사 | 엔티티 완전성 테이블 + Gap 목록 |
| 4 | Dialectic Analysis | 6종 모순 탐지 (상태/전이/권한/존재/제약/시간) | 모순 목록 (C-1, C-2, ...) |
| 5 | Socratic Inquiry | 발견된 모순마다 양측 증거를 제시하고 사용자에게 질문 | 사용자 결정 |
| 6 | Synthesis | 결정을 반영한 분석 리포트 + 원본 문서 수정 | spec-analysis-report.md + 문서 업데이트 |

**Phase 3.5에서 entity-coverage-scanner 에이전트가 디스패치되는 이유**: Phase 2-3에서 엔티티 카탈로그와 FSM이 만들어지면, "이 엔티티들이 실제 구현(프로토타입)에 반영되어 있는지"를 확인해야 한다. 이 작업은 파일 시스템 스캔이므로 별도 에이전트(entity-coverage-scanner)가 담당한다. 에이전트는 Glob/Grep으로 HTML 파일을 스캔하여 각 엔티티를 DEDICATED(전용 페이지)/EMBEDDED(다른 페이지에 포함)/MISSING으로 분류하고, Gap을 보고한다.

**Phase 5의 Socratic Inquiry가 중요한 이유**: 이 스킬의 핵심 원칙은 **"절대 가정하지 말고 질문하라"**이다. 모순을 발견했을 때 에이전트가 "아마 이게 맞겠지"라고 판단하면, 그 판단이 틀릴 때 구현 단계에서 버그가 된다. 대신 양측 증거를 제시하고 선택지를 주면, 사용자(도메인 전문가)가 올바른 결정을 내린다.

이 프로젝트에서 실제로 8건(C-1~C-8)의 모순이 발견되었고, 4명 페르소나의 시뮬레이션 인터뷰로 해소했다. 추후 2차 교차 검증에서 추가 18건(C-9~C-18)이 발견되어 동일한 프로세스로 해소했다.

---

### 파이프라인 2: screen-cycle — 화면 설계→구현 통합

**진입점**: `/screen-cycle [화면명]`
**파일**: `.claude/skills/screen-cycle/SKILL.md`
**목적**: 화면 하나를 설계부터 구현까지 완주. "명세만 만들고 코드를 안 만드는 반쪽짜리 워크플로우"를 방지

```
[사용자] /screen-cycle 소재관리
    │
    ▼
Stage 1: 설계
    │
    ├─ 1-1. /brainstorming ← 요구사항·의도 탐색
    │   └─ 프로젝트 컨텍스트 파악 → 질문 → 2-3개 접근법 제안 → 설계 문서 작성
    │   └─ ⚠️ HARD GATE: 설계를 사용자가 승인할 때까지 코드 작성 금지
    │
    ├─ 1-2. /design-screen ← 화면 명세 + 컴포넌트 목록 추출
    │
    ├─ 1-3. /critique ← Nielsen 휴리스틱 평가 (코드 전, 명세 기반)
    │   └─ 9개 차원 평가: AI Slop, 시각 위계, 정보 구조, 감정 여정,
    │      발견성, 구성, 타이포, 색상, 상태·엣지 케이스
    │   └─ Nielsen 10항목 점수 (0-4점 × 10 = /40)
    │
    ⛔ GATE D1: Nielsen ≥ 30/40 → Stage 2로
    │   30/40 미만 → 피드백 기반 수정 후 /critique 재실행 (최대 2회)
    │   2회 후에도 미달 → 사용자에게 판단 위임
    │
    ▼
Stage 2: 구현
    │
    ├─ 2-1. /frontend-design-impeccable ← 프로덕션급 HTML/CSS/JS 생성
    │   └─ AI Slop DON'T 리스트 적용 (제네릭 컨테이너, 기계적 색상, 기본 폰트 회피)
    │
    ├─ 2-2. /create-component ← 컴포넌트 스펙 + 코드
    │
    ├─ 2-3. /design-review ← Playwright 기반 라이브 UI 평가
    │   └─ design-evaluator 에이전트 디스패치:
    │       1. Playwright로 스크린샷 촬영
    │       2. CSS/코드 정적 분석
    │       3. AI Slop 4항목 체크 (PASS/FAIL)
    │       4. Nielsen 10항목 채점 (/40)
    │       5. Audit 5차원 채점 (/20): 접근성, 성능, 반응형, 테마, 안티패턴
    │       6. P0-P3 이슈 목록 (파일:줄번호 포함)
    │       7. output/gate-d2_{date}/{HHmm}_design-eval-{target}/report.md 작성
    │
    ⛔ GATE D2: P0/P1 = 0 → Stage 3로
    │   P0/P1 있음 → 수정 후 /design-review 재실행 (최대 2회)
    │
    ▼
Stage 3: 마감
    │
    ├─ 3-1. /polish ← 정렬, 간격, 일관성, 마이크로 디테일 최종 점검
    ├─ 3-2. 사용자 확인
    └─ 3-3. (선택) /writing-plans ← 잔여 구현 작업 계획
```

#### critique vs design-review — 왜 두 개인가

| | critique | design-review |
|---|----------|---------------|
| **입력** | 명세, 목업, 스크린샷 (코드 없어도 됨) | 라이브 UI (코드 실행 필수) |
| **평가 방식** | 문서 기반 정성 평가 | Playwright 스크린샷 + 코드 분석 |
| **에이전트** | 없음 (메인 대화에서 실행) | design-evaluator 에이전트 디스패치 |
| **탐지 가능** | 구조적 문제, 정보 누락, UX 흐름 | 렌더링 이슈, 실제 색상 대비, 폰트 로딩, 접근성 |
| **시점** | 코드 작성 전 (값싸게 수정 가능) | 코드 작성 후 (수정 비용 있음) |

critique는 "이 설계대로 만들면 괜찮을까?"이고, design-review는 "만들어진 결과물이 실제로 괜찮은가?"이다. 둘 다 필요한 이유: 코드 없이는 잡을 수 없는 문제가 있고 (폰트 로딩 실패, CSS 우선순위 충돌), 코드 후에 발견하면 수정 비용이 큰 문제도 있다 (정보 구조, 네비게이션 흐름).

#### brainstorming의 HARD GATE

brainstorming 스킬에는 특별한 규칙이 있다:

> Do NOT invoke any implementation skill, write any code, scaffold any project, or take any implementation action until you have presented a design and the user has approved it.

이것은 코드 생성 전에 **반드시 설계를 사용자에게 보여주고 승인을 받아야 한다**는 강제 규칙이다. "이건 간단하니까 바로 만들겠습니다"가 불가능하다. 이 규칙이 생긴 이유: Session 14에서 설계 없이 프로토타입을 만들었을 때 Nielsen 7점 차이가 발생했기 때문이다.

---

### 파이프라인 3: ux-bootstrap — 프로젝트 초기 셋업

**진입점**: `/ux-bootstrap`
**파일**: `.claude/skills/ux-bootstrap/SKILL.md`
**목적**: 프로젝트 시작 시 디자인 컨텍스트를 한 번에 수집

```
Step 1: /teach-impeccable
    └─ 프로젝트 디자인 컨텍스트 수집 (브랜드, 대상 사용자, 톤앤매너)
    └─ 산출물: docs/.impeccable.md
    └─ 게이트: .impeccable.md 생성 확인
    └─ 사용자 확인 후 다음 단계
    │
Step 2: /color-taste
    └─ 3-질문 인테이크: 레퍼런스 색상, 안티레퍼런스, 감정 키워드
    └─ OKLCH 팔레트 초안을 .impeccable.md에 추가
    └─ 게이트: .impeccable.md에 Color Palette 섹션 확인
    └─ 사용자 확인 후 다음 단계
    │
Step 3: /synthesize
    └─ docs/research/ 의 리서치 결과(페르소나, 공감지도, 여정지도) 종합
    └─ 게이트: 리서치 산출물이 없으면 사용자에게 알리고 건너뛸지 질문
    └─ 사용자 확인 후 다음 단계
    │
Step 4: handoff
    └─ 다음 단계 안내: /strategize, /map-ia, /validate-all
```

**각 단계 사이에 사용자 확인을 받는 이유**: 디자인 컨텍스트 수집은 "정답"이 없는 주관적 작업이다. 팔레트 초안이 마음에 들지 않으면 다시 해야 한다. 자동으로 넘어가면 잘못된 컨텍스트 위에 모든 후속 작업이 쌓인다.

---

### 파이프라인 4: design-foundation — 디자인 토큰 체계

**진입점**: `/design-foundation`
**파일**: `.claude/skills/design-foundation/SKILL.md`
**전제 조건**: `.impeccable.md` 존재 (없으면 `/ux-bootstrap` 안내 후 중단)
**목적**: 색상, 타이포, 그리드, 간격을 CSS variables로 통합

```
Step 1: /color-palette
    └─ .impeccable.md의 Color Palette를 seed로 풀 컬러 시스템 구축
    └─ 톤 스케일, 시맨틱 매핑, 접근성(WCAG AA), 다크모드
    │
Step 2: /type-system
    └─ 타이포그래피 스케일, 폰트 페어링, 줄 간격
    │
Step 3: /layout-grid + /spacing-system (병렬)
    └─ 그리드(컬럼, 거터, 브레이크포인트) + 간격 스케일(4px 기반)
    │
Step 4: /tokenize
    └─ Step 1-3의 모든 결과를 CSS variables로 통합
    └─ 산출물: 60+ CSS 커스텀 프로퍼티
```

**Step 3이 병렬인 이유**: layout-grid(그리드 시스템)와 spacing-system(간격 스케일)은 독립적이다. 그리드는 "화면을 어떻게 나누는가"이고 간격은 "요소 사이를 얼마나 띄우는가"이다. 서로 참조하지 않으므로 동시에 정의할 수 있다.

---

### 파이프라인 5: cognitive-walkthrough — 사용성 검증

**진입점**: `/cognitive-walkthrough [url]`
**파일**: `.claude/skills/cognitive-walkthrough/SKILL.md`
**목적**: 프로덕션 전환 전 마지막 게이트. 개별 화면 품질이 아니라 **플로우 단위**로 페르소나가 목표를 달성할 수 있는지 검증

```
Step 1: 페르소나 로드
    └─ docs/research/personas/ 에서 전체 페르소나 파일 읽기
    └─ 플로우-페르소나 매핑 (예: 캠페인 생성 → 최유진/영업대행사)

Step 2: 핵심 플로우 정의
    └─ docs/design/information-architecture.md 에서 5개 핵심 플로우 추출:
        1. login-to-dashboard (박진수/Admin)
        2. campaign-create (최유진/Sales Agency)
        3. media-register (김서영/Media Owner)
        4. material-upload (이준혁/Ops Agency)
        5. report-generate (박진수/Admin)

Step 3: usability-evaluator 에이전트 × 5 (병렬 디스패치)
    │
    │  각 에이전트가 하는 일:
    │  ┌─────────────────────────────────────────────────┐
    │  │ 1. Playwright로 target URL 접속                   │
    │  │ 2. 플로우의 각 단계를 실행 (클릭, 네비게이션)        │
    │  │ 3. 각 단계마다 스크린샷 촬영 + 접근성 트리 분석       │
    │  │ 4. 페르소나 관점에서 3축 평가:                       │
    │  │    - 발견성: "다음 행동을 찾을 수 있는가?"            │
    │  │      (트리거가 명확한 위치에, 명확한 레이블로 존재)     │
    │  │    - 충분성: "판단에 필요한 정보가 충분한가?"          │
    │  │      (의사결정에 필요한 정보가 화면에 존재)            │
    │  │    - 확신도: "확신 갖고 진행할 수 있는가?"             │
    │  │      (피드백/되돌리기/결과 예측이 가능)               │
    │  │ 5. 하나라도 fail → P1 이슈로 기록                    │
    │  │ 6. report.md + screenshots/ 저장                    │
    │  └─────────────────────────────────────────────────┘

Step 4: 결과 종합
    └─ 5개 report.md를 읽어서:
        - issue-registry.md: P0-P1 이슈 통합 목록
        - gate-checklist.md: 플로우별 pass rate + 게이트 판정

Step 5: GATE U1 판정
    │
    │  판정 순서:
    │  1. P0 > 0 → FAIL (수정 후 재실행)
    │  2. Task-blocking P1 > 0 → FAIL (수정 후 재실행)
    │  3. Task-blocking P1 = 0 AND Standards P1 ≤ 5 → CONDITIONAL PASS
    │     (잔존 이슈 수정, 재실행 안 함, 프로덕션 체크리스트로 이관)
    │  4. 모든 P1 = 0 → PASS
    │  5. 최대 4 Round (R4까지 Task-blocking 잔존 시 CONDITIONAL PASS)
    │
    │  P1 분류:
    │  ┌─────────────────────────────────────────────────┐
    │  │ Task-blocking: 사용자가 목표 달성 불가             │
    │  │   예: 로그인 불가, 저장 후 피드백 없음, 상태 불일치   │
    │  │                                                  │
    │  │ Standards-compliance: 태스크 완수 가능, 표준 위반    │
    │  │   예: aria-label 누락, scope="col" 없음           │
    │  └─────────────────────────────────────────────────┘
    │
    │  수렴 감지:
    │  - Round N vs N-1에서 Task-blocking P1이 감소하지 않으면 경고
    │  - 신규 P1의 80%+ 가 Standards-compliance면 → 종료 판단
    │

Step 6: 반복 또는 종료
    ├─ FAIL → 패턴 분석 → 일괄 수정 → 재실행 (Step 3부터)
    ├─ CONDITIONAL PASS → 잔존 이슈 수정 + 프로덕션 체크리스트 생성
    └─ PASS → "프로덕션 전환 준비 완료"
```

**"3축 평가"가 기존 Nielsen 휴리스틱과 다른 점**: Nielsen은 인터페이스 전체를 10개 항목으로 채점한다. 3축 평가는 **플로우의 각 단계**를 **특정 페르소나 관점**에서 평가한다. "이 버튼이 접근성 기준을 충족하는가?"가 아니라 "최유진(영업대행사 AE)이 캠페인 생성 3단계에서 다음 버튼을 찾을 수 있는가?"를 묻는다.

**왜 최대 4 Round인가**: 프로토타입 HTML에 aria 속성을 반복 추가하는 것과 프로덕션에서 `<Table>` 컴포넌트가 scope를 자동 적용하는 것은 별개의 작업이다. R4 이후 Standards-compliance 이슈는 프로덕션 코드에서 컴포넌트 라이브러리로 해결하는 것이 효율적이다.

---

### 에이전트 상세

#### design-evaluator — 디자인 품질 평가

**디스패치 주체**: design-review 스킬
**파일**: `.claude/agents/design-evaluator.md`
**도구**: Playwright MCP (스크린샷), Read, Glob, Grep (코드 분석)

실행 프로세스:
1. 참조 자료 로드 (frontend-design-impeccable, critique, audit의 SKILL.md)
2. Playwright로 target URL 스크린샷 촬영 → `output/gate-d2_{date}/{HHmm}_design-eval-{target}/`에 저장
3. CSS/컴포넌트 파일 수집 (색상, 폰트, 간격 패턴)
4. **AI Slop 4항목 체크**:
   - Generic Containers: 모든 카드/배지/테이블이 동일한 rounded+shadow 사용?
   - Mechanical Colors: primary/secondary/success/danger만으로 구성?
   - Default Font Pairing: Inter/Roboto만 사용, weight 변형 없음?
   - Unintentional Spacing: 모든 gap이 gap-4, p-4, p-6에 집중?
5. **Nielsen 10항목 채점** (0-4점 × 10 = /40)
6. **Audit 5차원 채점** (0-4점 × 5 = /20): 접근성, 성능, 반응형, 테마, 안티패턴
7. **P0-P3 이슈 목록** (파일:줄번호 + 수정 제안)
8. report.md 작성

**AI Slop이란**: AI가 생성한 인터페이스의 공통 징후. 둥근 모서리+그림자가 일률적, primary/secondary만 있는 색상, Inter 폰트만 사용, gap-4 일색의 간격. "기억에 남지 않는 인터페이스"의 원인이다. 이 체크는 디자인 시스템 확립 후 첫 1회만 실행하면 된다 (같은 시스템이면 결과가 동일하므로).

#### usability-evaluator — 페르소나 사용성 평가

**디스패치 주체**: cognitive-walkthrough 스킬
**파일**: `.claude/agents/usability-evaluator.md`
**도구**: Playwright MCP (네비게이션, 클릭, 스크린샷), Read, Glob, Grep

입력으로 받는 것:
- Target URL
- 페르소나 정보 (이름, 역할, 목표, IT 리터러시, 핵심 불만)
- 플로우 정의 (단계별 URL과 액션)
- 출력 디렉토리

평가 기준: 각 단계에서 3축(발견성/충분성/확신도) pass/fail 판정. fail에는 반드시 "이 페르소나가 왜 이걸 못 찾는지/부족하게 느끼는지"를 페르소나 관점에서 근거를 써야 한다. 이슈를 꾸며내면 안 된다 — 스크린샷이나 접근성 트리에서 확인 가능한 것만 기록.

#### entity-coverage-scanner — 명세 vs 구현 갭 탐지

**디스패치 주체**: spec-dialectic Phase 3.5
**파일**: `.claude/agents/entity-coverage-scanner.md`
**도구**: Glob, Grep, Read (Playwright 불필요)

입력: 엔티티 목록 JSON (`[{ "nameKo": "재생목록", "nameEn": "playlist", "operations": ["C","R","U","D"], "ucRefs": ["UC-21"] }]`) + basePath

처리:
1. basePath 하위 HTML 파일/디렉토리 구조 수집
2. 엔티티별로:
   - DEDICATED: 파일명/디렉토리명에 엔티티 영문명 포함 (예: `playlist/`)
   - EMBEDDED: 다른 엔티티 페이지에서 한글명/영문명이 참조됨
   - MISSING: 어디에서도 발견 안 됨
3. Gap 분류:
   - G1: CRUD UC가 있지만 전용 페이지 없음
   - G3: 라이프사이클 엔티티가 다른 UI에 흡수됨

이 에이전트가 필요한 이유: 프로토타입을 네비게이션 메뉴 기준으로 만들면, 독립 생명주기를 가진 엔티티(재생목록 등)가 부모 도메인(편성관리)에 흡수되어 전용 UI가 없어진다. 문서에는 CRUD가 정의되어 있는데 구현에는 없는 상태. 이 갭을 자동 탐지한다.

---

### 스킬 분류 (27개)

#### 파이프라인 허브 (7개) — 다른 스킬을 오케스트레이션

| 스킬 | 호출 방식 | 내부 스킬 | 하는 일 |
|------|----------|----------|---------|
| scenario-pipeline | `/validate-scenario` | validate-scenario, spec-dialectic | 시나리오 검증 3단계 + 3개 게이트 연결 |
| screen-cycle | `/screen-cycle` | brainstorming, design-screen, critique, frontend-design, create-component, design-review, polish | 화면 하나를 설계→구현→마감까지 완주 |
| ux-bootstrap | `/ux-bootstrap` | teach-impeccable, color-taste, synthesize, handoff | 프로젝트 초기 디자인 컨텍스트 수집 |
| design-foundation | `/design-foundation` | color-palette, type-system, layout-grid, spacing-system, tokenize | 디자인 토큰 체계 구축 |
| cognitive-walkthrough | `/cognitive-walkthrough` | usability-evaluator (에이전트) | 페르소나 관점 플로우 사용성 검증 |
| writing-plans | `/writing-plans` | — | 구현 계획을 3섹션(목표, 아키텍처, 태스크)으로 작성 |
| subagent-driven-development | — | 태스크별 에이전트 디스패치 | 계획의 각 태스크를 병렬 에이전트로 구현 |

#### 멀티 커맨드 허브 (4개) — 여러 서브커맨드의 라우터

이 스킬들은 하위에 여러 커맨드를 가진 "메뉴"다. `/research /interview`처럼 허브명+서브커맨드로 호출한다.

| 스킬 | 커맨드 | 각 커맨드의 역할 |
|------|--------|----------------|
| research | /discover | 페르소나, 공감지도, 여정지도 생성 |
| | /interview | 페르소나 시뮬레이션 인터뷰 (docs/research/personas/ 자동 검색) |
| | /synthesize | 리서치 결과 종합 (어피니티 다이어그램, JTBD 분석) |
| | /handoff | 리서치→설계 핸드오프 요약 |
| ux-strategy | /frame-problem | 문제 정의, 디자인 브리프 |
| | /benchmark | 경쟁 분석 |
| | /strategize | 기회 프레임워크, 노스스타 비전, KPI |
| | /map-ia | 정보 아키텍처 (화면 인벤토리, 역할별 접근 매트릭스, 네비게이션) |
| ui-design | /color-palette | OKLCH 기반 풀 컬러 시스템 |
| | /design-screen | 화면 명세 + 컴포넌트 목록 |
| | /type-system | 타이포그래피 스케일 |
| | /responsive-audit | 반응형 감사 |
| system | /create-component | 컴포넌트 스펙 + 코드 |
| | /tokenize | 디자인 토큰 통합 |
| | /audit-system | 디자인 시스템 감사 |

#### 독립 실행 가능 (10개) — 사용자가 직접 호출

파이프라인 내에서도 호출되지만, 사용자가 단독으로도 호출할 수 있는 스킬.

| 스킬 | 입력 | 출력 | 언제 쓰는가 |
|------|------|------|-----------|
| critique | 명세·목업 | Nielsen 점수 + 이슈 | 코드 작성 전 설계 검증 (GATE D1) |
| design-review | 라이브 URL | AI Slop + Nielsen + Audit + P0-P3 | 코드 작성 후 구현 검증 (GATE D2) |
| audit | 라이브 URL | 5축 기술 품질 리포트 | 접근성/성능/반응형 점검이 필요할 때 |
| brainstorming | 아이디어/화면명 | 설계 문서 + 사용자 승인 | 모든 창작 작업 전 필수 |
| polish | 구현된 UI | 정렬/간격/일관성 수정 | 마지막 품질 패스 |
| rhythm-arrange | 구현된 UI | 레이아웃/간격 개선 | 시각 위계가 약할 때 |
| optimize | 구현된 UI | 성능 진단 리포트 | 느리거나 렉이 있을 때 |
| color-taste | — | OKLCH 팔레트 초안 | 색 취향 수집 (3문 인터뷰) |
| teach-impeccable | — | .impeccable.md | 프로젝트 디자인 컨텍스트 초기 수집 |
| frontend-design-impeccable | 화면명 | 프로덕션급 HTML/CSS/JS | AI Slop 회피 코드 생성 |

#### 파이프라인 내부 전용 (4개)

허브가 호출하므로 사용자가 직접 호출할 필요 없는 스킬.

| 스킬 | 소속 | 역할 |
|------|------|------|
| validate-scenario | scenario-pipeline Stage 1 | 도메인별 3단계 병렬 검증 로직 |
| spec-dialectic | scenario-pipeline Stage 2 | 6단계 교차 검증 로직 |
| design-screen | screen-cycle Stage 1 (ui-design 하위) | 화면 명세 + 컴포넌트 목록 |
| create-component | screen-cycle Stage 2 (system 하위) | 컴포넌트 스펙 + 코드 |

#### 유틸리티 (2개)

| 스킬 | 용도 |
|------|------|
| executing-plans | writing-plans로 만든 계획을 세션에서 단계별로 실행 |
| finishing-a-development-branch | 구현 완료 후 브랜치 마무리 (merge/PR/cleanup 옵션 제시) |

---

### GATE 체계 — 왜 게이트가 필요한가

게이트는 "품질이 기준 미달이면 다음 단계로 진행하지 못하게 막는 관문"이다.

게이트가 없으면: 시나리오에 모순이 있는 상태에서 프로토타입을 만들고, 프로토타입이 깨진 상태에서 사용성 테스트를 하게 된다. 각 단계의 결함이 다음 단계로 전파되어, 마지막에 가서야 "처음부터 잘못됐다"를 발견한다.

게이트가 있으면: 각 단계에서 품질을 정량적으로 확인하고, 기준 미달이면 **그 단계에서 수정**한다. 결함이 전파되지 않는다.

| GATE | 단계 | 평가 스킬 | 통과 기준 | 왜 이 기준인가 | 실패 시 |
|------|------|----------|----------|--------------|--------|
| S1 | 시나리오 단위 검증 | validate-scenario | 3종 검증 통과 | 용어 불일치, 규칙 미정의, 실패 시나리오가 남아있으면 교차 검증이 무의미 | 반영 후 재검증 |
| S2 | 시나리오 교차 검증 | spec-dialectic | 모순 해소 | 문서 간 모순이 있으면 구현 시 "어느 문서를 따를지" 혼란 | Socratic Inquiry → 재합성 |
| S3 | 다음 단계 선택 | — | 사용자 선택 | 자동으로 다음 단계에 진입하면 기획 보강이 필요한 상황을 놓칠 수 있음 | — |
| D1 | 설계 평가 | critique | Nielsen ≥ 30/40 | 30/40은 "눈에 띄는 문제가 없는" 수준. 이하면 구조적 결함이 코드에 고착됨 | 설계 반복 (최대 2회) |
| D2 | 구현 평가 | design-review | P0/P1 = 0 | P0은 기능 불가, P1은 심각한 사용 문제. 이것이 남아있으면 출시 불가 | 코드 수정 후 재평가 (최대 2회) |
| U1 | 사용성 검증 | cognitive-walkthrough | Task-blocking P1 = 0 | 사용자가 목표를 달성할 수 없으면 제품이 아님 | 수정 후 재실행 (최대 4R) |

### 자동화 Hook — 게이트 무효화 방지

| Hook | 트리거 | 동작 | 왜 필요한가 |
|------|--------|------|-----------|
| uncheck-manifest | `docs/scenarios/*.md` 파일이 Edit/Write될 때 | MANIFEST.md 해당 도메인 `[x]` → `[ ]` 자동 해제 | 시나리오를 수정했는데 GATE S1 통과 표시가 남아있으면, 검증되지 않은 내용이 검증된 것으로 오인됨. 자동 해제로 "수정하면 재검증 필요" 상태를 강제 |

구현: `.claude/settings.json`에 PostToolUse hook으로 등록. `scripts/uncheck-manifest.sh`가 stdin에서 수정된 파일 경로를 추출하고, `docs/scenarios/*.md`인 경우에만 MANIFEST.md를 업데이트한다.

**감지(자동) vs 실행(수동) 분리 원칙**: hook은 `[x]` → `[ ]` 해제만 한다. 재검증(`/validate-scenario`) 실행은 사용자가 명시적으로 요청해야 한다. 만약 인터뷰 결론 반영처럼 한번에 5개 파일을 수정하면 매 Edit마다 검증이 돌아가는 비효율이 발생하기 때문이다.

---

## Part 3: 재사용 가이드 — 다른 프로젝트에 적용하기

### 프로젝트 무관 범용 스킬

다른 프로젝트에 그대로 가져갈 수 있는 스킬:

**파이프라인:**
- scenario-pipeline — 도메인 시나리오 검증 (MANIFEST.md 기반)
- screen-cycle — 화면 설계→구현→검증 사이클
- cognitive-walkthrough — 페르소나 사용성 검증
- ux-bootstrap — 프로젝트 초기 UX 셋업
- design-foundation — 디자인 토큰 체계 구축

**개별 스킬:**
- spec-dialectic — 문서 교차 검증 (FSM, Design by Contract)
- critique / design-review / audit — 품질 평가 3종
- brainstorming — 창작 전 탐색
- research — 페르소나/공감지도/여정지도/인터뷰
- frontend-design-impeccable — AI Slop 회피 코드 생성
- polish / rhythm-arrange / optimize — 품질 개선

**에이전트:**
- design-evaluator — Playwright 기반 디자인 평가
- usability-evaluator — 페르소나 3축 사용성 평가
- entity-coverage-scanner — 명세 vs 구현 커버리지 갭 탐지

### 프로젝트별 커스텀 필요

| 항목 | 위치 | 커스텀 내용 |
|------|------|-----------|
| 페르소나 | `docs/research/personas/` | 프로젝트의 사용자 역할별 페르소나 파일 |
| 시나리오 | `docs/scenarios/` | 도메인별 유스케이스 문서 |
| IA | `docs/design/information-architecture.md` | 화면 인벤토리, 역할별 접근 매트릭스 |
| 디자인 컨텍스트 | `docs/.impeccable.md` | 브랜드 컬러, 톤, 레퍼런스 |
| 디자인 토큰 | `docs/design/design-foundation.md` | 색상, 타이포, 그리드, 간격 |
| 핵심 플로우 | cognitive-walkthrough 실행 시 | IA에서 추출할 5개 플로우 |
| MANIFEST | `docs/scenarios/MANIFEST.md` | 도메인 목록과 검증 상태 |

### 최소 시작 세트

새 프로젝트에서 이것만 있으면 시작:

```
.claude/
├── skills/
│   ├── scenario-pipeline/    ← 시나리오 검증
│   ├── research/             ← 페르소나 + 인터뷰
│   ├── screen-cycle/         ← 설계→구현 사이클
│   ├── cognitive-walkthrough/ ← 사용성 검증
│   ├── critique/             ← 설계 평가
│   ├── design-review/        ← 구현 평가
│   ├── brainstorming/        ← 창작 전 탐색
│   └── frontend-design-impeccable/ ← 코드 생성
├── agents/
│   ├── design-evaluator.md
│   └── usability-evaluator.md
└── settings.json             ← PostToolUse hook
```

나머지는 필요할 때 추가. ux-bootstrap, design-foundation은 디자인 시스템이 필요한 프로젝트에서만.

### 권장 실행 순서

```
1. /research /discover        ← 페르소나 생성
2. 시나리오 작성               ← 도메인별 유스케이스
3. /validate-scenario         ← 시나리오 검증 파이프라인
4. /research /interview       ← 페르소나 인터뷰로 모순 해소
5. /ux-bootstrap              ← 디자인 컨텍스트 수집
6. /strategize → /map-ia      ← UX 전략 + IA
7. /design-foundation         ← 디자인 토큰 구축
8. /screen-cycle (반복)        ← 화면별 설계→구현
9. /cognitive-walkthrough      ← 사용성 검증
```

**주의:** 1→3→4는 시나리오 품질이 이후 모든 단계의 기반. 여기를 건너뛰면 나중에 비용이 기하급수적으로 증가.

---

## Part 4: 교훈 + 개선 제안

### 잘 된 것

**1. 스킬 TDD (Session 1)**
스킬 없는 에이전트의 실패를 먼저 관찰(RED)한 뒤 스킬을 작성(GREEN). 스킬이 "무엇을 해결하는가"가 명확해지고, 불필요한 기능을 넣지 않게 됨.

**2. 게이트 파이프라인 (Session 2, 10)**
각 단계에 정량적 통과 기준을 두고, 통과하지 못하면 다음 단계로 진행 불가. 사용자 확인 게이트로 자동 진입을 방지. "시나리오 완료 전에 프로토타입 만들기"같은 순서 오류를 구조적으로 차단.

**3. 페르소나 시뮬레이션 인터뷰 (Session 4, 6, 11)**
문서 분석(spec-dialectic)이 잡지 못하는 운영 관점 모순을 페르소나 인터뷰가 발견. 매체 비활성화 → 편성표 `일시정지` 상태 도입은 페르소나 김도현의 인터뷰에서만 나온 인사이트.

**4. 도구 정비 우선 (Session 13)**
프로젝트 진행보다 하네스 품질을 우선한 결정. 정비 후 2시간 만에 UX 전략→IA→디자인 파운데이션→화면 명세→프로토타입 관통. 도구에 투자한 시간이 실행 속도로 회수됨.

**5. 교훈의 하네스 내장 (Session 14, 17)**
발견한 교훈을 "기억"이 아니라 CLAUDE.md 규칙, SKILL.md 로직, 자동 종료 규칙으로 내장. 다른 프로젝트에서 같은 실수를 반복하지 않음.

### 실패/우회한 것

**1. 시나리오→프로토타입 직행 (Session 14)**
소재관리만 화면 명세(GATE D1)를 거치고 나머지 6개는 생략 → Nielsen 7점 차이. 이후 Prototype Rules로 방지.

**2. CSS 복붙 (Session 14→16)**
200줄 × 7파일 = 1,400줄 중복. Session 16에서 shared.css 추출(+715/-1,395). "나중에 정리"는 실현되지 않았음.

**3. 일괄 빌드 시 품질 저하 (Session 14)**
사용자 자리비움 중 4개 프로토타입 자율 빌드 → 핵심 인터랙션 누락. "자율 진행 ≠ 품질 타협" 규칙 추가.

**4. 평가자 비일관성 (Session 17)**
LLM이 매 라운드 새로운 추론으로 동작하여 P1/P2 경계가 흔들림. media-register R3 P1=1 → R4 P1=4. Task-blocking/Standards-compliance 분류로 대응했으나 근본 해결은 아님.

**5. 구버전 프로토타입 오염 (Session 17)**
에이전트 디스패치 시 `2026-04-03-prototype/`과 `2026-04-05-prototype/` URL이 혼용 → Round 1 전체 삭제 후 재실행. URL 통일 규칙 추가.

**6. GREEN 테스트 타임아웃 (Session 1)**
spec-dialectic GREEN 테스트가 35분 타임아웃. 스킬이 너무 무거워 단일 에이전트로 검증 불가. 이후 검증은 수동 또는 분할 실행.

### 발견된 패턴

**양파 효과**: 표면 이슈를 해소하면 더 깊은 이슈가 드러남. P1이 일시적으로 증가하는 것은 정상적인 품질 개선 패턴.

**메뉴 단위 ≠ 엔티티 단위**: 프로토타입을 네비게이션 메뉴 기준으로 만들면, 독립 생명주기를 가진 엔티티(재생목록 등)가 누락됨. entity-coverage-scanner로 탐지.

**감지(자동) vs 실행(수동)**: 시나리오 수정 감지는 hook으로 자동화하되, 재검증 실행은 사용자 명시 요청. 전자동은 비용 낭비.

**버리는 비용 0**: HTML 프로토타입은 버리기 쉬워서 GATE 체계가 작동. React 컴포넌트는 상태/타입/테스트가 붙으면 버리기 아까워지고 잘못된 설계에 매몰됨.

### 미래 개선 방향

**단기 (다음 프로젝트)**
1. 평가자에게 이전 Round 이슈 목록을 입력으로 제공 → "해소 확인" + "신규 발견" 분리
2. Playwright 에이전트를 순차 실행 (2~3개씩 배치) → 브라우저 잠금 회피
3. GATE U1 종료 시 프로덕션 티켓 자동 생성 (issue-registry → Linear/GitHub Issues)

**중기**
4. 고정 체크리스트 + 자유 서술 병행 → 일관성 + 창의성
5. CI에서 cognitive-walkthrough 실행 → PR마다 사용성 후퇴 감지
6. 인터뷰 인사이트 → 시나리오 변경 제안 자동화

**장기**
7. 실제 사용자 행동 데이터 기반 플로우 우선순위 자동 조정
8. HTML 프로토타입 → React/Vue 컴포넌트 자동 스캐폴딩
