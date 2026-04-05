# 시나리오 문서 운영 프로세스

## 개요

시나리오 기반 기획의 전체 작성-검증-교차검증 흐름과, 변경 시 자동으로 검증 상태가 해제되는 자동화 구조를 정리한다.

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
    ├─ A) 기획 보강 → /research 로 심화 조사
    ├─ B) UX/UI 설계 → /ux-bootstrap → /strategize → /map-ia → /screen-cycle
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
        [설계] brainstorming → design-screen → critique (GATE: 30/40)
        [구현] frontend-design-impeccable → create-component → design-review (GATE: P0/P1)
        [마감] polish → 사용자 확인
```

### 스킬 용도 구분

| 스킬 | 단계 | 용도 |
|------|------|------|
| `/critique` | 설계 단계 (코드 전) | 명세·목업·스크린샷 기반 Nielsen 평가 |
| `/design-review` | 구현 단계 (코드 후) | Playwright 스크린샷 기반 라이브 UI 평가 |
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
