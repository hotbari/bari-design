---
description: UX critique와 technical audit을 연속 실행하고 통합 우선순위 리스트와 권장 액션을 생성합니다.
argument-hint: "[area (feature, page, component...)]"
---
# /review
Run a combined UX critique and technical audit, then produce a single prioritized action list.

## Steps

1. **UX Critique** — Run `critique` skill across all 10 dimensions. Score heuristics (0–40). Identify P0–P3 issues.
   > Skip critique Phase 3 (open questions) — the synthesis step below replaces it.

2. **Technical Audit** — Run `audit` skill across all 5 dimensions. Score health (0–20). Identify P0–P3 issues.

3. **Synthesize** — Merge both issue lists into a single prioritized list:
   - Deduplicate: if the same issue appears in both, count it once at the higher severity.
   - Label each item `[UX]`, `[Tech]`, or `[Both]`.
   - Any P0 from either source is automatically top priority.

4. **Integrated Summary** — Present scores and top findings:
   ```
   UX: ??/40 | Tech: ??/20 | Combined: ??/60
   ```
   List the top 5 issues from the merged list with label and severity.

5. **Action Recommendations** — Select follow-up commands from `{{available_commands}}` only:
   - One command per issue (most targeted match).
   - Deduplicate: if multiple issues map to the same command, list it once.
   - End with `/polish` as the final cleanup step.
