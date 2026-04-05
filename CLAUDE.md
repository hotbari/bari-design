

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
- Three similar lines is better than a premature abstraction.

## Review Rules
- State the bug. Show the fix. Stop.
- No suggestions beyond the scope of the review.

## Debugging Rules
- Never speculate about a bug without reading the relevant code first.
- State what you found, where, and the fix. One pass.
- If cause is unclear: say so. Do not guess.

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
