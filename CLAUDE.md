

## Approach
- Think before acting. Read existing files before writing code.
- Be concise in output but thorough in reasoning.
- Prefer editing over rewriting whole files.
- Do not re-read files you have already read unless the file may have changed.
- Test your code before declaring done.
- No sycophantic openers or closing fluff.
- Keep solutions simple and direct. No over-engineering.
- If unsure: say so. Never guess or invent file paths.
- User instructions always override this file.

## Efficiency
- Read before writing. Understand the problem before coding.
- No redundant file reads. Read each file once.
- One focused coding pass. Avoid write-delete-rewrite cycles.
- Test once, fix if needed, verify once. No unnecessary iterations.
- Budget: 50 tool calls maximum. Work efficiently.

## Output
- Return code first. Explanation after, only if non-obvious.
- No inline prose. Use comments sparingly - only where logic is unclear.
- No boilerplate unless explicitly requested.

## Code Rules
- Simplest working solution. No over-engineering.
- No abstractions for single-use operations.
- No speculative features or "you might also want..."
- Read the file before modifying it. Never edit blind.
- No docstrings or type annotations on code not being changed.
- No error handling for scenarios that cannot happen.
- Three similar lines is better than a premature abstraction. 단, 파일 간 50줄 이상 동일 코드가 반복되면 공통 파일로 분리.

## Commit Convention
- 형식: `<type>(<scope>): <요약>`
- type: `feat` | `fix` | `docs` | `refactor` | `chore` | `a11y` | `style` | `test`
- scope: 선택. 도메인명(campaign, media, user, notification, dashboard) 또는 시나리오 ID(S-05)
- 요약: 한글, 50자 이내, 마침표 없음
- 여러 화면을 다루면 본문에 목록으로 나열
- Co-Authored-By 트레일러는 Claude가 작성한 커밋에만 추가

## Review Rules
- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.

## Debugging Rules
- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

## Prototype Rules
- 프로토타입 복수 파일 생성 시 공통 CSS/JS는 반드시 shared 파일로 분리. 복붙 금지
- 화면 명세(GATE D1)를 거치지 않은 프로토타입은 만들지 않는다. 시나리오 → 프로토타입 직행 금지
- 일괄 작업 시에도 품질 균일성 유지. 먼저 만든 것과 나중 만든 것의 Nielsen 점수 차이가 5점 이상이면 보강 필수
- GATE D2(design-review)는 시스템 레벨 이슈가 동일하면 개별 반복하지 않는다. 첫 2~3회 후 시스템 리뷰 1회로 전환
- AI Slop 체크는 디자인 시스템 확립 후 첫 1회만. 이후는 변경이 있을 때만
- IA에 정의된 화면 수 대비 프로토타입 커버리지를 명시적으로 추적. 누락 화면 목록을 유지
- 레이아웃(사이드바, 헤더, 네비게이션) 구현/수정 시 information-architecture.md 섹션 3 (네비게이션 구조)를 반드시 참조
- IA에 정의된 GNB/LNB depth를 프로토타입에 그대로 반영. flat 나열 금지
- 개인 설정(S-29)은 프로필 드롭다운, 시스템 설정(S-30)은 설정 그룹에 배치 — IA 기준 준수
- 화면 명세 시 `docs/design/anti-factory-principles.md` 섹션 4 체크 필수. "이 화면의 주인공은?", "도메인 특화 UI가 있는가?" 미리 답할 것

## Scenario Workflow
- 시나리오 문서는 `docs/scenarios/` 에 도메인별로 작성
- 검증은 `/validate-scenario` 로 전체 파이프라인 실행 (단위 검증 → 교차 검증 → 다음 단계 안내)
- 개별 도메인만 검증: `/validate-scenario <파일명>`
- 개별 스킬도 단독 사용 가능: `/spec-dialectic`
- 시나리오 파일 수정 시 MANIFEST.md의 해당 도메인 `[x]`는 hook이 자동으로 `[ ]`로 해제 (재검증 필요)
- 사용자 확인 없이 writing-plans에 직접 진입 금지

## 디렉토리 기준

판단 기준: **이 파일을 삭제하고 다시 만들 수 있는가?**

### `docs/` — 진화하는 정본 (삭제 불가)

사람이 읽고 의사결정에 쓰는 것. 프로젝트가 끝날 때까지 유지·갱신된다.

- `docs/scenarios/` — 시나리오 문서 (도메인별)
- `docs/design/` — UX 전략, IA, 디자인 파운데이션, 화면 명세
- `docs/research/` — 페르소나, 공감지도, 여정지도, 인터뷰 인사이트
- `docs/process-raw.md` — 하네스 프로세스 문서
- `docs/.impeccable.md` — 디자인 컨텍스트

### `output/` — 재생성 가능한 시점 기록 (삭제 후 재실행 가능)

에이전트가 생성한 평가 결과. 게이트별 → 날짜별 → 시각별로 관리.

- 네이밍: `output/{gate}_{date}/{HHmm}_{type}/`
- 예: `output/gate-u1_2026-04-06/0056_usability-campaign-create/`
- 각 폴더: `report.md` + `screenshots/`
- 상세: `output/README.md` 참조

### 경계 규칙

- 프로젝트 루트에 산출물 파일을 직접 생성하지 않는다
- GATE 통과 시 프로덕션 체크리스트를 `docs/design/`에 정본으로 복사한다
- output/ 스크린샷은 반드시 `screenshots/` 하위 폴더에 저장한다
- output/은 .gitignore 대상. 필요 시 선택적으로 커밋한다

## Research Outputs
- 리서치 산출물은 `docs/research/` 하위에 저장
- 페르소나: `docs/research/personas/{product}_{role}_{name}.md`
- 공감지도: `docs/research/empathy-maps/{product}_{persona_name}.md`
- 여정지도: `docs/research/journey-maps/{product}_{persona_name}.md`
- 페르소나 생성 시 반드시 파일로 저장. 인라인 출력만으로 끝내지 않는다
- `/interview` 실행 시 `docs/research/personas/` 에서 기존 페르소나 자동 검색
