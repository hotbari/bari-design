

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
- 도메인 시나리오 1개 작성 완료 시 아래 3단계 검증을 순서대로 실행:
  1. **Ubiquitous Language 점검** — 동의어/모호한 용어/미정의 용어 탐지. 발견 사항은 §6(미결 사항)에 기록
  2. **Example Mapping** — 각 UC의 규칙마다 구체적 예시(input→output) 생성. 엣지 케이스 발견 시 §4에 "이런 경우에는" 추가 또는 §6에 기록
  3. **Pre-mortem** — "이 도메인이 운영 중 실패한다면 원인은?" 질문. 빠진 요구사항 발견 시 UC 추가 또는 §6에 기록
- 3단계 검증 통과 후 `docs/scenarios/MANIFEST.md` 해당 항목을 `[x]` 체크 + 파일명 기입
- MANIFEST.md의 모든 항목이 `[x]`가 되면 반드시 `/spec-dialectic docs/scenarios/` 실행하여 교차 검증
- 교차 검증 후 다음 단계를 사용자에게 확인:
  - 기획 보강이 필요하면 → `@bari-skills/research` 로 심화 조사 후 시나리오 보완
  - 구현 준비가 되었으면 → `writing-plans` 로 구현 계획 수립
- 사용자 확인 없이 writing-plans에 직접 진입 금지
