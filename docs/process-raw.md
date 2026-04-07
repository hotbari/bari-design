# AI 에이전트 기반 UX 설계 하네스

## 개요

시나리오 작성부터 프로토타입 사용성 검증까지, AI 에이전트가 각 단계를 자동으로 검증하고 품질 게이트를 통과해야 다음 단계로 진행하는 **게이트 기반 설계 파이프라인**이다. 사람은 의사결정만 하고, 검증·평가·수정 사이클은 에이전트가 수행한다.

### 한눈에 보기

```
시나리오 작성 ──→ GATE S1 (단위 검증) ──→ GATE S2 (교차 검증) ──→ GATE S3 (사용자 선택)
                                                                         │
                    ┌────────────────────────────────────────────────────┘
                    ▼
              UX 전략 수립 ──→ 정보 아키텍처 ──→ 디자인 시스템 기반
                                                        │
                    ┌───────────────────────────────────┘
                    ▼
              화면 설계 ──→ GATE D1 (설계 평가, Nielsen 30/40+)
                    │
                    ▼
              프로토타입 구현 ──→ GATE D2 (디자인 리뷰, P0/P1 해소)
                    │
                    ▼
              사용성 검증 ──→ GATE U1 (인지 워크스루, Task-blocking P1=0)
                    │
                    ▼
              프로덕션 전환 준비 (구현 체크리스트 + acceptance criteria)
```

### 핵심 수치 (DOOH CMS 프로젝트 실측)
IA? Information Architecture, 화면 인벤토리 + 역할별 접근 매트릭스 + 네비게이션 구조

| 지표 | 값 |
|------|-----|
| 시나리오 도메인 | 7개 (37 Use Case) |
| IA 화면 | 31개 (S-00 ~ S-30) |
| 페르소나 | 4명 (인터뷰 2차까지 심화) |
| 프로토타입 | 17개 HTML (shared.css 공통) |
| 교차 검증 모순 | 8건 발견 → 8건 해소 |
| 사용성 검증 | 4 Round, P1 18→22→11→6→0 |
| 스킬 | 25+개 |
| 에이전트 | 3개 (설계 평가, 사용성 평가, 엔티티 커버리지) |
| 자동화 hook | 시나리오 수정 시 검증 상태 자동 해제 |

### 디렉토리 구조

```
docs/               ← 진화하는 정본 (삭제 불가, 의사결정의 근거)
├── scenarios/      시나리오 문서 (7개 도메인)
├── design/         UX 전략, IA, 디자인 파운데이션, 화면 명세
├── research/       페르소나, 인터뷰 인사이트
└── process-raw.md  이 문서 (하네스 프로세스)

output/             ← 재생성 가능한 시점 기록 (에이전트 평가 결과)
├── gate-d2_{date}/                     GATE D2 (design-review) 결과
│   └── {HHmm}_design-eval-{target}/
├── gate-u1_{date}/                     GATE U1 (cognitive-walkthrough) 결과
│   ├── {HHmm}_usability-{flow}/
│   └── {HHmm}_synthesis/              gate-checklist + issue-registry
└── README.md                           네이밍 규칙 + 폴더별 설명

.claude/            ← 하네스 정의 (스킬 + 에이전트 + 설정)
├── skills/         스킬 (SKILL.md)
├── agents/         에이전트 (.md)
└── settings.json   hook 설정
```

판단 기준: **이 파일을 삭제하고 다시 만들 수 있는가?** Yes → `output/`, No → `docs/`

---

## 1. 시나리오 작성 구조

### 파일 구조

```
docs/scenarios/
├── MANIFEST.md                    # 도메인별 검증 상태 추적
├── 01-user-management.md
├── 02-media-management.md
├── 03-material-management.md
├── 04-campaign-management.md
├── 05-scheduling-management.md
├── 06-notification-management.md
└── 07-dashboard-report.md
```

### 시나리오 문서 표준 구조

각 도메인 시나리오 문서는 6개 섹션으로 구성:

1. **개요** — 도메인의 역할과 범위
2. **페르소나 & 권한** — 역할별 기능 접근 매트릭스
3. **시나리오 목록** — UC-ID, 시나리오명, Actor
4. **상세 시나리오** — 각 UC의 전제조건, 시나리오 흐름, "이런 경우에는"(엣지 케이스), 결과
5. **도메인 규칙** — FSM, 불변식(INV), 비즈니스 규칙(BR)
6. **미결 사항** — 미정의 항목, 인터뷰 도출 이슈

---

## GATE 명명 규칙

| GATE | 단계 | 의미 |
|------|------|------|
| GATE S1 | 시나리오 Stage 1 | 도메인별 단위 검증 통과 |
| GATE S2 | 시나리오 Stage 2 | 교차 검증 모순 해소 |
| GATE S3 | 시나리오 Stage 3 | 다음 단계 사용자 선택 |
| GATE D1 | 설계 (코드 전) | 화면 명세 critique 통과 (Nielsen 30/40+) |
| GATE D2 | 구현 (코드 후) | design-review 통과 (P0/P1 해소) |
| GATE U1 | 사용성 검증 | cognitive-walkthrough 통과 (P0=0, P1≤2) |

S = Scenario, D = Design, U = Usability. 번호가 같아도 접두어가 다르면 다른 게이트.

---

## 2. 검증 파이프라인

### 진입점

`/validate-scenario` — 단위 검증과 교차 검증을 게이트 방식으로 연결한 단일 파이프라인

- `/validate-scenario` — MANIFEST.md에서 `[ ]`인 도메인 전부 검증 후 교차 검증까지
- `/validate-scenario <파일명>` — 해당 도메인만 검증

### 스킬 구조

```
.claude/skills/scenario-pipeline/
├── SKILL.md                              ← 파이프라인 오케스트레이터
├── commands/
│   └── validate-scenario.md              ← /validate-scenario (유일한 진입점)
└── skills/
    ├── validate-scenario/SKILL.md        ← Stage 1 로직
    └── spec-dialectic/
        ├── SKILL.md                      ← Stage 2 로직
        └── commands/spec-dialectic.md
```

### 파이프라인 흐름

```
[Stage 1] 도메인별 단위 검증 (validate-scenario)
    │
    ├─ 발견사항 있음 → 사용자에게 보고 → ⛔ GATE S1: 반영 확인
    │                                          ├─ 반영 후 재검증 → Stage 1 반복
    │                                          └─ 무시하고 진행 → Stage 2
    │
    └─ 전부 통과 → MANIFEST.md [x] 체크 → Stage 2 자동 진입
                                              │
[Stage 2] 교차 검증 (spec-dialectic)
    │
    ├─ 모순/갭 발견 → Socratic Inquiry → ⛔ GATE S2: 해결 확인
    │                                          ├─ 해결 반영 → Synthesis
    │                                          └─ 보류 → Synthesis (remaining gaps 포함)
    │
    └─ 모순 없음 (rare) → Synthesis
                              │
[Stage 3] 다음 단계 안내 → ⛔ GATE S3: 사용자 선택
    ├─ A) 기획 보강 → /research 로 심화 조사
    ├─ B) UX/UI 설계 → /ux-bootstrap → /strategize → /map-ia → /design-foundation → /screen-cycle
    └─ C) 구현 준비 → /writing-plans 로 구현 계획 수립
```

---

## 3. Stage 1: 도메인별 단위 검증 (3단계)

도메인 시나리오마다 3개 서브에이전트를 병렬로 디스패치:

### Step 1: Ubiquitous Language 점검

- 동의어, 모호한 용어, 미정의 용어 탐지
- 도메인 간 용어 불일치 (docs/scenarios/ 내 다른 파일과 대조)
- 발견 사항은 §6(미결 사항)에 기록

### Step 2: Example Mapping

- 각 UC의 규칙마다 구체적 예시(input → output) 생성
- 엣지 케이스 발견 시 §4에 "이런 경우에는" 추가 또는 §6에 기록

### Step 3: Pre-mortem

- "이 도메인이 운영 중 실패한다면 원인은?" 질문
- 동시성/순서 문제, 외부 의존성 장애, 데이터 정합성 점검
- 빠진 요구사항 발견 시 UC 추가 또는 §6에 기록

### 검증 완료

3단계 통과 후 `MANIFEST.md` 해당 항목을 `[x]` 체크

---

## 4. Stage 2: 교차 검증 (Cross-domain)

### 트리거 조건

Stage 1 완료 후 MANIFEST.md의 **모든** 항목이 `[x]`일 때 자동 진입

### 실행 (spec-dialectic 6단계)

1. **Discovery** — 전체 문서 인벤토리 (엔티티, 상태, 교차 참조, 미결 항목)
2. **Ontology** — 엔티티 분류 (Core/Supporting, 라이프사이클 여부)
3. **Lifecycle FSM** — 라이프사이클 엔티티의 상태 머신 정의
4. **Phase 3.5 Entity Completeness** — 권한-UC 매핑, 의존 완전성, 구현 커버리지 검사 (entity-coverage-scanner 에이전트 디스패치)
5. **Dialectic Analysis** — 문서 간 모순 탐지 (상태, 전이, 권한, 존재, 제약, 시간)
6. **Socratic Inquiry** → 사용자 답변 → **Synthesis** (분석 리포트 + 문서 수정)

### 교차 검증 후 분기 (GATE 3)

사용자 확인 필수 (자동 진입 금지):
- 기획 보강 필요 → `/research`로 심화 조사 후 시나리오 보완
- UX/UI 설계 진입 → 아래 §4-2 설계 파이프라인 참조
- 구현 준비 완료 → `/writing-plans`로 구현 계획 수립

---

## 4-2. 설계 파이프라인 (시나리오 이후)

시나리오 검증 완료 후 UX/UI 설계로 진입하는 경로. 각 파이프라인은 독립 실행 가능하나, 아래 순서가 권장 흐름이다.

### 전체 흐름

```
[시나리오 완료] GATE 3 통과
    │
    ├─ /ux-bootstrap ─── 프로젝트 초기 UX 기반 셋업
    │   teach-impeccable → color-taste → synthesize → handoff
    │
    ├─ /strategize ────── UX 전략 수립
    │
    ├─ /map-ia ────────── 정보 아키텍처 (화면 인벤토리, 접근 매트릭스, 네비게이션)
    │
    ├─ /design-foundation ── 디자인 시스템 기반 구축
    │   color-palette → type-system → (layout-grid + spacing-system) → tokenize
    │
    └─ /screen-cycle ───── 화면 단위 설계+구현 (반복)
        [설계] brainstorming → design-screen → critique (⛔ GATE D1: 30/40)
        [구현] frontend-design-impeccable → create-component → design-review (⛔ GATE D2: P0/P1)
        [마감] polish → 사용자 확인

[GATE D2 통과 후]
    │
    └─ /cognitive-walkthrough ── 페르소나 관점 사용성 검증 (⛔ GATE U1: P0=0, P1≤2)
        issue-registry → 수정 → 재실행 (반복)
        통과 → 프로덕션 전환 준비
```

### 프로토타입 필수 규칙

`/screen-cycle` 또는 직접 프로토타입 빌드 시 반드시 준수:

**단계 생략 금지**
- 화면 명세(critique/GATE D1) 없이 시나리오에서 바로 프로토타입 직행하지 않는다
- 화면 명세 = "이 화면에 뭐가 있어야 하는가"를 시나리오 + IA 기반으로 정의하는 단계
- `/screen-cycle`을 사용하면 critique가 내장되어 있으므로 자동 충족. 직접 빌드 시에는 별도로 `/critique` 실행 필수
- 명세 없이 만들면 "대략적 해석"이 되어 Nielsen 5~8점 차이 발생 (실측)

**공통 파일 분리**
- 프로토타입 2개 이상 생성 시, 첫 번째 파일 작성 시점에 공통 CSS/JS를 shared 파일로 분리
- "나중에 정리"는 하지 않음. 50줄 이상 동일 코드 반복 시 무조건 분리

**품질 균일성**
- 일괄 작업(자율 진행 포함)에서도 각 도메인의 핵심 인터랙션 체크리스트를 먼저 작성
- 먼저 만든 것과 나중 만든 것의 Nielsen 점수 차이가 5점 이상이면 보강 필수
- 자율 진행 지시를 받아도 품질 기준은 자의적으로 낮추지 않는다

**GATE 효율화**
- AI Slop 체크는 디자인 시스템 확립 후 첫 1회만. 이후는 시스템 변경 시에만
- GATE D2(design-review)는 시스템 레벨 이슈(반응형, 사이드바 등)가 반복되면 개별 실행을 중단하고 시스템 리뷰 1회로 전환
- 첫 2~3개 도메인에서 개별 GATE → 이후 시스템 리뷰

**커버리지 추적**
- IA에 정의된 화면 수 대비 프로토타입 커버리지를 명시적으로 추적
- 누락 화면 목록을 유지하고, 의도적 skip인지 누락인지 구분

### 스킬 용도 구분

| 스킬 | 단계 | 용도 |
|------|------|------|
| `/critique` | 설계 단계 (코드 전) | 명세·목업·스크린샷 기반 Nielsen 평가. **프로토타입 전 필수** |
| `/design-review` | 구현 단계 (코드 후) | Playwright 스크린샷 기반 라이브 UI 평가 |
| `/cognitive-walkthrough` | 사용성 검증 (프로토타입 or 프로덕션) | 페르소나 관점 플로우별 3축 평가. **GATE U1** |
| `/color-taste` | 초기 셋업 | 색 취향 수집 → 팔레트 초안 (.impeccable.md) |
| `/color-palette` | 디자인 시스템 | 풀 컬러 시스템 (.impeccable.md seed 사용) |

---

## 5. 변경 시 자동 검증 해제

시나리오 문서가 수정되면 해당 도메인의 검증 상태가 자동으로 `[ ]`로 해제된다.

### 흐름

```
Claude가 Edit/Write로 시나리오 파일 수정
  → PostToolUse hook 발동
  → scripts/uncheck-manifest.sh 실행
  → MANIFEST.md에서 해당 도메인 [x] → [ ] 변경
```

### 구현

**hook 설정** (`.claude/settings.json`):
```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "Edit|Write",
        "hooks": [
          {
            "type": "command",
            "command": "bash scripts/uncheck-manifest.sh"
          }
        ]
      }
    ]
  }
}
```

**스크립트** (`scripts/uncheck-manifest.sh`):
1. stdin으로 수정된 파일 경로를 JSON에서 추출
2. `docs/scenarios/*.md`인지 확인 (MANIFEST.md 제외)
3. MANIFEST.md에서 해당 파일명이 포함된 줄의 `[x]`를 `[ ]`로 치환

### 예외

- MANIFEST.md 자체 수정 시에는 무시
- `docs/scenarios/` 외 파일 수정 시에는 무시

---

## 6. 인터뷰 결론 반영 프로세스

교차 검증에서 모순이 발견되면:

### 6-1. 페르소나 인터뷰

- 모순을 관련 페르소나에 분배
- 각 페르소나 시점에서 집중 인터뷰 수행
- 결론을 도출하고 채택 옵션 확정

### 6-2. 시나리오 문서 반영

결론을 해당 도메인 시나리오 문서에 반영:
- UC 시나리오 흐름, "이런 경우에는" 수정
- FSM 상태/전이 추가·변경
- 비즈니스 규칙(BR) 추가·변경
- 이벤트 카탈로그(알림) 추가·변경
- 미결 사항 해결 표시

### 6-3. 자동 검증 해제

시나리오 수정 시 hook이 MANIFEST.md를 자동 업데이트 → 변경된 도메인은 `/validate-scenario`로 재검증 필요

---

## 7. 실제 적용 사례

### 배경

`/validate-scenario` Stage 2 교차 검증에서 8개 모순(C-1 ~ C-8) 발견

### 인터뷰

3명 페르소나로 분배:
- 김도현 (매체사 운영팀장): C-1, C-2, C-3, C-4, C-6
- 이수진 (운영대행사 현장 매니저): C-4, C-5
- 박민호 (영업대행사 AE): C-7, C-8

### 반영 결과 (5개 파일 변경)

| 모순 | 결론 | 변경 파일 |
|------|------|----------|
| C-1 | 편성표 `일시정지` 상태 추가. 매체 비활성화 시 종료일 기준 자동 판단 | 02-media, 05-scheduling |
| C-2 | 캠페인 취소 시 편성표 독립 유지 | 04-campaign |
| C-3 | 캠페인 집행 시작 기본 알림 없음. 예외 조건(매체 비활성)만 알림 | 04-campaign, 06-notification |
| C-4 | 편성 알림 수신 대상 = 편성표 생성자. 권한 밖 충돌 시 매체사 추가 | 06-notification |
| C-5 | 구좌 상태 3종: 정상 / 삭제됨 / 네이버연동 (UI 구분) | 05-scheduling |
| C-6 | 비활성화 주체 ≠ 편성 생성자일 때만 알림 | 02-media, 06-notification |
| C-7 | 소재 광고주 = 선택/메모 용도, 검증 없음 | 03-material |
| C-8 | 영업대행사 소재 조회 = 본인 등록 기본, 광고주 단위 공유 가능 | 03-material |

### 자동 해제

5개 파일 수정으로 MANIFEST.md에서 해당 5개 도메인이 자동으로 `[ ]`로 해제됨. `/validate-scenario`로 재검증 필요.

---

## 8. 설계 파이프라인 적용 사례 및 교훈

### 배경

시나리오 7개 도메인 완료 후, 설계 파이프라인을 통해 프로토타입 7개를 생성함.

### 실행 흐름

```
/ux-bootstrap → /strategize → /map-ia (31개 화면) → /design-foundation
    → 소재 관리: 화면 명세(GATE 1) → 프로토타입 → design-review(GATE 2) → polish → re-eval
    → 편성 관리: 시나리오에서 직접 → 프로토타입 → GATE 2 → 시각화 보강
    → 매체 관리: 시나리오에서 직접 → 프로토타입 → GATE 2
    → 대시보드/캠페인/사용자/알림: 시나리오에서 직접 → 일괄 빌드 → GATE 2 병렬 실행
```

### 결과 — 품질 격차 발생

| 그룹 | 도메인 | Nielsen | 특징 |
|------|--------|:-------:|------|
| 꼼꼼 | 소재, 편성, 매체 | 32~33/40 | 화면 명세 또는 충분한 검토 후 빌드 |
| 급행 | 대시보드, 캠페인, 사용자, 알림 | 25~27/40 | 시나리오에서 직접 빌드, 자율 진행 |

**7점 차이의 원인:**
1. 화면 명세(critique/GATE D1) 단계를 소재 관리만 수행, 나머지 6개는 생략
2. 후반 4개를 일괄 생성하면서 핵심 인터랙션 누락 (스텝퍼 장식 전용, 딥링크 없음 등)
3. CSS 200줄 × 7파일 = 1,400줄 중복 (shared 파일 미분리)

### 교훈 (§4-2 프로토타입 필수 규칙으로 반영)

1. **단계 생략 금지** — 화면 명세 없이 시나리오 → 프로토타입 직행하면 품질 저하
2. **공통 파일 첫 번째에서 분리** — "나중에 정리"는 실현되지 않음
3. **자율 진행 ≠ 품질 타협** — 속도를 높이더라도 핵심 인터랙션 체크리스트 필수
4. **GATE 반복 비효율** — AI Slop 7/7 PASS, 시스템 이슈(반응형) 7회 동일 지적. 첫 2~3회 후 시스템 리뷰로 전환이 효율적
5. **커버리지 명시 추적** — IA 31개 화면 중 22개 커버, 9개 누락. 의도적 skip과 실수 누락 구분 필요

---

## 9. 사용성 검증 (GATE U1) — cognitive-walkthrough

### 목적

GATE D2(design-review) 이후, 프로덕션 전환 전 마지막 게이트. 개별 화면 품질이 아닌 **플로우 단위**로 페르소나가 목표를 달성할 수 있는지 검증한다.

### 평가 기준 (3축)

| 축 | 질문 | pass 조건 |
|----|------|----------|
| 발견성 | 다음 행동을 찾을 수 있는가? | 트리거가 명확한 위치에, 명확한 레이블로 존재 |
| 충분성 | 판단에 필요한 정보가 충분한가? | 의사결정에 필요한 정보가 화면에 존재 |
| 확신도 | 확신 갖고 진행할 수 있는가? | 피드백/되돌리기/결과 예측이 가능 |

하나라도 fail → P1 이슈. 플로우를 완료할 수 없으면 P0.

### 게이트 기준

P1을 두 유형으로 분류하여 판정한다:

| 유형 | 정의 | 예시 |
|------|------|------|
| **Task-blocking** | 페르소나가 목표를 달성할 수 없거나 심각한 오판 유발 | 로그인 불가, 피드백 없음, 상태 불일치 |
| **Standards-compliance** | 태스크 완수 가능하나 접근성/웹표준 위반 | aria-label 누락, scope 없음, fieldset 없음 |

**판정 순서:**
1. P0 > 0 → **FAIL**. 수정 후 재실행.
2. Task-blocking P1 > 0 → **FAIL**. 수정 후 재실행.
3. Task-blocking P1 = 0 AND Standards P1 ≤ 5 → **CONDITIONAL PASS**. 잔존 이슈 수정, 재실행 안 함, 프로덕션 체크리스트로 이관.
4. 모든 P1 = 0 → **PASS**.
5. **최대 4 Round**. R4까지 Task-blocking P1 잔존 시 CONDITIONAL PASS + 체크리스트 이관.

### 실행

```
/cognitive-walkthrough [URL]
```

1. `docs/research/personas/` 에서 페르소나 자동 로드
2. IA에서 핵심 플로우 5개 추출
3. 플로우별 usability-evaluator 에이전트 병렬 디스패치
4. 결과 종합 → issue-registry + gate-checklist

### 산출물

```
output/gate-u1_{date}/
├── {HHmm}_usability-{flow}/
│   ├── report.md          # 플로우별 3축 평가
│   └── screenshots/       # 단계별 Playwright 스크린샷
└── {HHmm}_synthesis/
    ├── issue-registry.md  # P0-P1 이슈 통합 목록
    └── gate-checklist.md  # 게이트 판정 + 프로덕션 체크리스트
```

### 수정-재검증 사이클

```
Round 1: cognitive-walkthrough → issue-registry (P0=1, P1=18)
    → Pattern 분석 → 일괄 수정
Round 2: cognitive-walkthrough → issue-registry (P0=0, P1=22)
    → 기존 10건 해소, 신규 14건 발견 (심화 인터랙션)
    → 수정 후 Round 3 ...
    → GATE U1 PASS까지 반복
```

### 프로덕션 연결

GATE U1을 통과한 프로토타입의 산출물이 프���덕션 코드의 입력이 된다:

| 프로토타입 산출물 | 프로덕션에서의 역할 |
|-----------------|-------------------|
| `*.html` 프로토타입 | 컴포넌트 구조·레이아웃·상태의 레퍼런스 |
| `shared.css` 디자인 토큰 | CSS variables / Tailwind config로 이관 |
| issue-registry P1 목록 | 구현 시 acceptance criteria — 티켓으로 전환 |
| 3축 평가 결과 | 각 화면의 수용 기준 (발견성·충분성·확신도 모두 pass) |

프로덕션 빌드 후 `/cognitive-walkthrough`를 URL만 바꿔 재실행:

```
프로토타입: localhost:8080/2026-04-05-prototype/login.html
프로덕션:   localhost:3000/login

동일한 페르소나, 동일한 플로우, 동일한 3축 기준.
프로토타입 대비 프로덕션의 점수 후퇴를 즉시 감지.
```

### 교훈 (2026-04-06 첫 실행)

1. **URL 디렉토리 통일 필수** — 구버전 프로토타입(`2026-04-03-prototype/`)과 정본(`2026-04-05-prototype/`)을 혼용하면 평가 결과가 오염됨. 에이전트 디스패치 시 정본 디렉토리만 명시
2. **스크린샷은 별도 폴더** — `report.md`와 같은 레벨에 png를 놓으면 산출물 관리가 어려움. `screenshots/` 하위에 분리
3. **시스템 문제 먼저 해소** — Round 1에서 접근성(6건), 상태 버그(2건), P0(1건)을 먼저 잡으니 Round 2에서 깊은 인터랙션 이슈가 자연스럽게 드러남
4. **P1 증가는 자연스럽다** — Round 2에서 P1이 18→22로 증가했지만, 이는 기존 문제 해소 후 더 깊은 단계의 이슈가 노출된 것. 표면 문제 해소 → 심층 문제 발견은 정상적인 품질 개선 패턴
5. **패턴 분석이 일괄 수정의 핵심** — 22건을 개별 수정하면 비효율. 패턴(폼 검증, 목록 반영, 확인 다이얼로그, 토스트 타이밍)으로 묶어 일괄 적용
6. **평가자 비일관성 대응** — 매 Round 새로운 LLM 추론이므로 P1/P2 경계가 흔들림. media-register가 R3 P1=1 → R4 P1=4로 증가한 사례. P1을 Task-blocking / Standards-compliance로 분류하여 종료 조건을 명확화함
7. **최대 4 Round 제한** — 프로토타입 HTML에 aria 속성을 반복 추가하는 것과 프로덕션에서 컴포넌트 라이브러리로 해결하는 것은 별개. R4 이후 Standards-compliance 이슈는 프로덕션 체크리스트로 이관이 효율적
8. **종료 판정 자동화** — 사용자 개입 없이 "Task-blocking P1=0이면 CONDITIONAL PASS" 규칙을 스킬에 내장. 다른 프로젝트에서도 동일 기준 적용

---

## 10. 스킬 & 에이전트 인벤토리

이 하네스를 구성하는 모든 스킬과 에이전트의 목록. 각 항목의 상세 동작은 해당 `SKILL.md`에 정의되어 있다.

### 파이프라인 스킬 (게이트 연결)

시나리오 → 설계 → 검증 흐름의 각 단계를 오케스트레이션하는 스킬.

| 스킬 | 커맨드 | 단계 | 역할 | GATE |
|------|--------|------|------|------|
| scenario-pipeline | `/validate-scenario` | 시나리오 | 단위 검증 → 교차 검증 게이트 연결 | S1, S2, S3 |
| screen-cycle | `/screen-cycle` | 설계+구현 | brainstorming → 명세 → critique → 구현 → review → polish 한 사이클 | D1, D2 |
| cognitive-walkthrough | `/cognitive-walkthrough` | 사용성 | 페르소나 플로우 3축 평가 + 수정-재검증 사이클 | U1 |
| ux-bootstrap | `/ux-bootstrap` | 초기 셋업 | teach-impeccable → color-taste → synthesize → handoff | — |
| design-foundation | `/design-foundation` | 디자인 시스템 | color-palette → type-system → layout-grid → tokenize | — |

### 평가 스킬 (품질 게이트)

각 게이트에서 실제 평가를 수행하는 스킬.

| 스킬 | 커맨드 | 입력 | 출력 | 정량 기준 |
|------|--------|------|------|----------|
| critique | `/critique` | 명세·목업 (코드 전) | Nielsen 점수 + 이슈 목록 | 30/40 이상 |
| design-review | `/design-review` | 라이브 UI (코드 후) | AI Slop + Nielsen + Audit + 이슈 | P0/P1 해소 |
| audit | `/audit` | 라이브 UI | 접근성/성능/반응형/테마/안티패턴 5축 | P0-P3 리포트 |

### 설계 스킬 (구현 도구)

실제 디자인 결정과 코드를 생성하는 스킬.

| 스킬 | 커맨드 | 역할 |
|------|--------|------|
| brainstorming | `/brainstorming` | 창작 작업 전 요구사항·의도 탐색. **모든 구현 전 필수** |
| frontend-design-impeccable | `/frontend-design` | AI Slop 회피 + 프로덕션급 프론트엔드 코드 생성 |
| ux-strategy | `/strategize` | 문제 정의, 경쟁 분석, 기회 프레임워크, 디자인 원칙 |
| color-taste | `/color-taste` | 색 취향 3문 인터뷰 → 팔레트 초안 |
| color-palette | `/color-palette` | 풀 컬러 시스템 (OKLCH 기반) |
| rhythm-arrange | `/rhythm-arrange` | 레이아웃/간격/시각 위계 개선 |
| polish | `/polish` | 정렬/간격/일관성 최종 패스 |
| optimize | `/optimize` | 로딩/렌더링/번들 성능 진단 |

### 리서치 스킬

| 스킬 | 커맨드 | 역할 |
|------|--------|------|
| research | `/research` | 페르소나 생성, 공감지도, 여정지도, 인터뷰 시뮬레이션 |

### 에이전트 (서브프로세스)

스킬이 디스패치하는 전문 서브에이전트. 병렬 실행으로 처리 속도를 높인다.

| 에이전트 | 디스패치 주체 | 역할 |
|---------|-------------|------|
| design-evaluator | `/design-review` | Playwright 스크린샷 + AI Slop + Nielsen + Audit 채점 |
| usability-evaluator | `/cognitive-walkthrough` | 플로우별 3축 평가 (발견성·충분성·확신도) |
| entity-coverage-scanner | spec-dialectic | 시나리오 엔티티 vs 구현 커버리지 갭 탐지 |

### 자동화 (Hooks)

| Hook | 트리거 | 동작 |
|------|--------|------|
| uncheck-manifest | 시나리오 파일 Edit/Write | MANIFEST.md 해당 도메인 `[x]` → `[ ]` 자동 해제 |

---

## 11. 성과 — 무엇이 달라졌는가

### 기존 방식 vs 하네스

| | 기존 (수동) | 하네스 (에이전트) |
|---|-----------|-----------------|
| 시나리오 검증 | 리뷰어 1명이 읽고 코멘트 | 3종 병렬 검증 (언어·예시·사전부검) + 교차 검증 |
| 모순 발견 | 구현 중 발견 ("이거 정의가 다른데?") | 교차 검증에서 사전 발견 (8건) + 페르소나 인터뷰로 해소 |
| 설계 품질 | 리뷰어 주관 ("이건 좀 이상한데") | Nielsen 점수 정량 평가 (30/40 게이트) |
| 사용성 검증 | 출시 후 사용자 불만 | 프로토타입 단계에서 페르소나 워크스루 (P1 18→0, 4R) |
| 접근성 | "나중에 하자" | 매 Round 자동 탐지 (WCAG 1.3.1 등) |
| 변경 영향 | 수동 추적 | Hook이 자동으로 검증 상태 해제 → 재검증 강제 |

### GATE U1 (사용성 검증) 4 Round 추이

```
Round 1: P0=1, P1=18  ██████████████████░░  FAIL
         │ 수정: 접근성 6건 + 상태 버그 2건 + P0 1건
Round 2: P0=0, P1=22  ██████████████████████  FAIL (심화 발견)
         │ 수정: 피드백 5건 + 탐색 5건 + 맥락 5건 + 시스템 2건
Round 3: P0=0, P1=11  ███████████░░░░░░░░░░  CONDITIONAL
         │ 수정: 대시보드 3건 + 캠페인 4건 + 매체 1건 + 소재 3건
Round 4: P0=0, P1=6   ██████░░░░░░░░░░░░░░░  3/5 PASS
         │ 수정: Standards 6건 (접근성/검증 패턴)
Final:   P0=0, P1=0   ░░░░░░░░░░░░░░░░░░░░░  5/5 PASS ✓
```

### 교차 검증으로 사전에 잡은 것들

구현 단계에서 발견되었으면 **재작업**이 필요했을 문제들:

| 모순 | 구현에서 발견 시 비용 | 교차 검증에서 해소 |
|------|---------------------|-------------------|
| 매체 비활성화 시 편성표 상태 미정의 | API + FSM 재설계 | FSM에 `일시정지` 추가 |
| 캠페인 취소 시 편성표 연쇄 삭제 | 데이터 유실 사고 | 편성표 독립 유지로 결정 |
| 알림 수신 대상 누락 | 운영 사고 후 패치 | 이벤트 카탈로그에 수신 규칙 명시 |
| 영업대행사 소재 접근 범위 모호 | 권한 시스템 재설계 | 광고주 단위 공유 규칙 확정 |

### 프로토타입에서 검증 완료된 인터랙션 (18건)

사용성 검증에서 P1→해소→검증 완료된 인터랙션 패턴. 프로덕션에서 이 목록이 **acceptance criteria**가 된다:

- 로그인 성공 → 대시보드 전환 + 로딩 상태
- KPI 카드 → 각 목록 페이지 딥링크
- 긴급 알림 → 매체 상세 딥링크
- 어드민 위젯에 대상명 표시 (숫자만 아님)
- 3단계 스텝 폼 + 단계별 필수 검증 + 인라인 에러
- 복수 매체 선택 + 충돌 경고 (캠페인명·일자 명시)
- 등록 전 확인 모달 + 취소 시 미저장 경고
- 등록 후 목록 즉시 반영 + 하이라이트
- 상태별 동적 타임라인 (검수중/수동검수대기/검수완료)
- 수동검수대기 안내 (사유, 담당자, 예상 시간, 행동 안내)
- 리포트 유형별 포함 항목 설명
- 예약 토글 ↔ 예약 버튼 상태 연동

---

## 12. 알려진 한계 & 개선 로드맵

### 한계

| 영역 | 문제 | 원인 |
|------|------|------|
| **평가자 비일관성** | 같은 이슈를 Round마다 P1/P2로 다르게 분류. media-register R3 P1=1 → R4 P1=4 | 매 Round 새로운 LLM 추론. 고정 체크리스트가 아닌 자유 서술 평가 |
| **Playwright 브라우저 잠금** | 병렬 에이전트 5개가 동시에 브라우저를 열면 락 충돌 | Playwright MCP가 단일 브라우저 세션만 지원 |
| **프로토타입 한계** | 실제 API 응답, 대용량 데이터, 네트워크 지연 미반영 | 정적 HTML 프로토타입의 본질적 제약 |
| **리서치 ↔ 설계 자동 연결 부재** | 인터뷰 인사이트가 시나리오에 수동 반영 | 인사이트 → 시나리오 변경 제안 자동화 미구현 |

### 개선 로드맵

**단기 (다음 프로젝트)**

| # | 개선 | 기대 효과 |
|---|------|----------|
| 1 | 평가자에게 **이전 Round 이슈 목록**을 입력으로 제공 | "해소 여부 확인" + "신규 발견" 분리 → 비일관성 감소 |
| 2 | Playwright 에이전트를 **순차 실행** (2-3개씩 배치) | 브라우저 잠금 회피 |
| 3 | GATE U1 종료 시 **프로덕션 티켓 자동 생성** (Linear/GitHub Issues) | issue-registry → 티켓 변환 자동화 |

**중기**

| # | 개선 | 기대 효과 |
|---|------|----------|
| 4 | **고정 체크리스트** 도입 — 3축 평가 + WCAG AA 체크리스트 병행 | 자유 서술의 창의성 + 체크리스트의 일관성 |
| 5 | 프로덕션 코드에서 **자동 회귀 테스트** — CI에서 cognitive-walkthrough 실행 | PR마다 사용성 점수 후퇴 감지 |
| 6 | 인터뷰 인사이트 → 시나리오 **변경 제안 자동화** | `/research` 결과가 시나리오에 직접 반영 제안 |

**장기**

| # | 개선 | 기대 효과 |
|---|------|----------|
| 7 | 실제 사용자 행동 데이터 (analytics) 기반 **플로우 우선순위 자동 조정** | 가장 많이 쓰이는 플로우부터 검증 |
| 8 | 프로토타입 → 프로덕션 **컴포넌트 자동 변환** | HTML 프로토타입에서 React/Vue 컴포넌트 스캐폴딩 생성 |
