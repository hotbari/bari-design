---
description: 리서치 결과물(페르소나, 여정 지도, 인사이트)을 UX 전략 단계 인풋으로 변환합니다.
argument-hint: "[research output file or description]"
---
# /handoff
Convert research outputs into structured inputs for the UX strategy phase.

## Steps

1. **Collect Research Outputs** — Review available artifacts from `/discover`, `/synthesize`, and `/interview`.
   > If no research outputs exist, recommend running `/discover` first before proceeding.

2. **Reformat for Strategy** — Transform each artifact type:
   - Personas → target audience summary (goals, context, constraints)
   - Jobs-to-be-done → opportunity signals (unmet needs, frequency, severity)
   - Pain points → design constraints (must-avoid, must-support)

3. **Compress Key Insights** — Summarize the 3–5 most strategy-relevant findings in "So what?" format:
   > e.g., "Users abandon onboarding at step 3 → so what? The value prop isn't communicated early enough."

4. **Recommend Next Step** — Based on the insight profile, suggest one of:
   - `/frame-problem` — if the core problem still needs definition
   - `/strategize` — if insights are sufficient to move into strategy
   - `/benchmark` — if competitive context is needed before strategy
