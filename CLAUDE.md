

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

## Review Rules
- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.

## Debugging Rules
- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

## Prototype Rules
- 프로토타입 복수 파일 생성 시 공통 CSS/JS는 반드시 shared 파일로 분리. 복붙 금지
- 화면 명세(GATE 1)를 거치지 않은 프로토타입은 만들지 않는다. 시나리오 → 프로토타입 직행 금지
- 일괄 작업 시에도 품질 균일성 유지. 먼저 만든 것과 나중 만든 것의 Nielsen 점수 차이가 5점 이상이면 보강 필수
- GATE 2(design-review)는 시스템 레벨 이슈가 동일하면 개별 반복하지 않는다. 첫 2~3회 후 시스템 리뷰 1회로 전환
- AI Slop 체크는 디자인 시스템 확립 후 첫 1회만. 이후는 변경이 있을 때만
- IA에 정의된 화면 수 대비 프로토타입 커버리지를 명시적으로 추적. 누락 화면 목록을 유지

## Scenario Workflow
- 시나리오 문서는 `docs/scenarios/` 에 도메인별로 작성
- 검증은 `/validate-scenario` 로 전체 파이프라인 실행 (단위 검증 → 교차 검증 → 다음 단계 안내)
- 개별 도메인만 검증: `/validate-scenario <파일명>`
- 개별 스킬도 단독 사용 가능: `/spec-dialectic`
- 시나리오 파일 수정 시 MANIFEST.md의 해당 도메인 `[x]`는 hook이 자동으로 `[ ]`로 해제 (재검증 필요)
- 사용자 확인 없이 writing-plans에 직접 진입 금지

## Research Outputs
- 리서치 산출물은 `docs/research/` 하위에 저장
- 페르소나: `docs/research/personas/{product}_{role}_{name}.md`
- 공감지도: `docs/research/empathy-maps/{product}_{persona_name}.md`
- 여정지도: `docs/research/journey-maps/{product}_{persona_name}.md`
- 페르소나 생성 시 반드시 파일로 저장. 인라인 출력만으로 끝내지 않는다
- `/interview` 실행 시 `docs/research/personas/` 에서 기존 페르소나 자동 검색
