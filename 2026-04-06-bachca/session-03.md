# Session Export

| Property | Value |
|----------|-------|
| Session | `cd24bc63-8bf2-422a-b829-6340a4a8b606` |
| Project | `/Users/yeonsu/2026/bari-design` |
| Branch | `main` |
| Date | 2026-04-01 07:51:37 UTC |

## Metrics

| Metric | Value |
|--------|-------|
| Duration | 6m 19s |
| Total Tokens | 544,629 |
| Input Tokens | 28 |
| Output Tokens | 7,654 |
| Cache Read | 472,045 |
| Cache Created | 64,902 |
| Messages | 78 |
| Cost | N/A |

## Conversation

### User (Turn 1)

@.claude/skills/research/ research가 왜 슬래쉬로 인식이 안될까?

### Assistant (Turn 2)

> *Thinking:*
> 

Tool: Bash
Input: {
  "command": "ls -R /Users/yeonsu/2026/bari-design/.claude/skills/research/",
  "description": "List research skill directory structure"
}

Tool: Glob
Input: {
  "pattern": ".claude/skills/research/**/*"
}

commands
skills

/Users/yeonsu/2026/bari-design/.claude/skills/research/commands:
discover.md
handoff.md
interview.md
scenario-test-plan.md
synthesize.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills:
affinity-diagram
empathy-map
interview-script
jobs-to-be-done
journey-map
persona-simulation
usability-test-plan
user-persona

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/affinity-diagram:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/interview-script:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/jobs-to-be-done:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/persona-simulation:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/usability-test-plan:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/handoff.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/interview.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/scenario-test-plan.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/synthesize.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/affinity-diagram/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/interview-script/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/jobs-to-be-done/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/persona-simulation/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/usability-test-plan/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md

`research` 디렉토리에 **`SKILL.md` 파일이 없습니다**.

Claude Code의 스킬 시스템은 각 스킬 디렉토리의 루트에 `SKILL.md`가 있어야 슬래시 커맨드로 인식합니다. 현재 구조:

```
.claude/skills/research/
├── commands/        # 하위 커맨드들은 있음
├── skills/          # 하위 스킬들도 있음
└── (SKILL.md 없음)  # ← 이게 문제
```

하위 스킬들(`affinity-diagram`, `empathy-map` 등)은 각각 `SKILL.md`가 있지만, **`research/` 자체에는 `SKILL.md`가 없어서** `/research`로 인식이 안 됩니다.

`/Users/yeonsu/2026/bari-design/.claude/skills/research/SKILL.md` 파일을 만들어야 합니다. 만들어 드릴까요?

**Tool:** `Bash`

```json
{
  "command": "ls -R /Users/yeonsu/2026/bari-design/.claude/skills/research/",
  "description": "List research skill directory structure"
}
```

**Result:**

```
commands
skills

/Users/yeonsu/2026/bari-design/.claude/skills/research/commands:
discover.md
handoff.md
interview.md
scenario-test-plan.md
synthesize.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills:
affinity-diagram
empathy-map
interview-script
jobs-to-be-done
journey-map
persona-simulation
usability-test-plan
user-persona

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/affinity-diagram:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/interview-script:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/jobs-to-be-done:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/persona-simulation:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/usability-test-plan:
SKILL.md

/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona:
SKILL.md
```

**Tool:** `Glob`

```json
{
  "pattern": ".claude/skills/research/**/*"
}
```

**Result:**

```
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/handoff.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/interview.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/scenario-test-plan.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/synthesize.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/affinity-diagram/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/interview-script/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/jobs-to-be-done/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/persona-simulation/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/usability-test-plan/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md
```

### User (Turn 3)

헐 웅

### Assistant (Turn 4)

> *Thinking:*
> 

기존 스킬 하나를 참고해서 만들겠습니다.

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md"
}

     1→---
     2→description: Run a full user research cycle — persona creation, empathy mapping, and journey mapping for a product or feature.
     3→argument-hint: [product or feature to research]
     4→---
     5→
     6→Run a full user research discovery cycle by chaining these steps:
     7→
     8→1. Use the `user-persona` skill to create 2-3 user personas from available research data
     9→2. Use the `empathy-map` skill to build empathy maps for the primary persona
    10→3. Use the `journey-map` skill to map the end-to-end user journey for the primary persona
    11→4. Synthesize findings into a research summary with key insights and design implications
    12→5. After completion, suggest: "Want me to `/interview` to prepare scripts for validating these personas?" or "Want me to `/test-plan` to design usability tests?"

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/synthesize.md"
}

     1→---
     2→description: Synthesize research data into affinity diagrams, themes, and actionable insights.
     3→argument-hint: [PRD, interview notes to synthesize]
     4→---
     5→
     6→Synthesize qualitative research data into structured insights:
     7→
     8→1. Use the `affinity-diagram` skill to organize raw data into themed clusters with insight statements
     9→2. Use the `jobs-to-be-done` skill to map user motivations and outcome expectations
    10→3. Combine findings into a prioritized list of design implications and opportunities
    11→4. After completion, suggest: "Want me to `/discover` to create personas from these insights?" or "Want me to `/scenario-test-plan` to validate these findings with usability testing?"

Tool: Glob
Input: {
  "pattern": ".claude/skills/*/SKILL.md"
}

/Users/yeonsu/2026/bari-design/.claude/skills/audit/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/color-taste/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/critique/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/design-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/dispatching-parallel-agents/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/executing-plans/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/finishing-a-development-branch/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/frontend-design-impeccable/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/optimize/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/polish/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/receiving-code-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/requesting-code-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/rhythm-arrange/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/subagent-driven-development/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/teach-impeccable/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/using-git-worktrees/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/writing-plans/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/spec-dialectic/SKILL.md

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/critique/SKILL.md",
  "limit": 30
}

     1→---
     2→name: critique
     3→description: "Evaluate design from a UX perspective, assessing visual hierarchy, information architecture, emotional resonance, cognitive load, and overall quality with quantitative scoring, persona-based testing, and actionable feedback. Use when the user asks to review, critique, evaluate, or give feedback on a design or component."
     4→argument-hint: "[area (feature, page, component...)]"
     5→user-invocable: true
     6→---
     7→
     8→## MANDATORY PREPARATION
     9→
    10→Invoke {{command_prefix}}frontend-design — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run {{command_prefix}}teach-impeccable first. Additionally gather: what the interface is trying to accomplish.
    11→
    12→---
    13→
    14→Conduct a holistic design critique, evaluating whether the interface actually works — not just technically, but as a designed experience. Think like a design director giving feedback.
    15→
    16→## Phase 1: Design Critique
    17→
    18→Evaluate the interface across these dimensions:
    19→
    20→### 1. AI Slop Detection (CRITICAL)
    21→
    22→**This is the most important check.** Does this look like every other AI-generated interface from 2024-2025?
    23→
    24→Review the design against ALL the **DON'T** guidelines in the frontend-design skill — they are the fingerprints of AI-generated work. Check for the AI color palette, gradient text, dark mode with glowing accents, glassmorphism, hero metric layouts, identical card grids, generic fonts, and all other tells.
    25→
    26→**The test**: If you showed this to someone and said "AI made this," would they believe you immediately? If yes, that's the problem.
    27→
    28→### 2. Visual Hierarchy
    29→- Does the eye flow to the most important element first?
    30→- Is there a clear primary action? Can you spot it in 2 seconds?

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/interview.md"
}

     1→---
     2→description: Generate an interview script and run a simulated user interview for a persona.
     3→argument-hint: [file path or persona name]
     4→---
     5→
     6→# Interview
     7→
     8→Chain interview script generation and persona simulation into a single guided session.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher facilitating a user interview session for $ARGUMENTS. Accept a file path or persona name as input. If no valid persona is found, prompt: "No persona found. Run `/discover` first or provide a file path."
    13→
    14→## Domain Context
    15→
    16→- Chain the two skills sequentially: `interview-script` → `persona-simulation`
    17→- A user confirmation gate separates the two phases
    18→- Prompt between phases: "인터뷰 스크립트를 확인해주세요. 이대로 시뮬레이션을 시작할까요? (yes로 진행, 또는 수정할 내용을 입력하세요)"
    19→- Any affirmative reply (`yes`, `ㅇㅇ`, `진행`, etc.) starts the simulation
    20→- If the user pastes edits, replace the generated script with the edited version before proceeding
    21→
    22→## Instructions
    23→
    24→1. **Load persona**: Read the persona from the provided file path or name.
    25→2. **Generate script**: Run the `interview-script` skill to produce a structured interview script from the persona data.
    26→3. **Confirm**: Present the script and ask the user to confirm or revise before proceeding.
    27→4. **Simulate**: Run the `persona-simulation` skill using the confirmed script and persona data.
    28→
    29→## Further Reading
    30→
    31→- Steve Portigal, *Interviewing Users*
    32→- JTBD (Jobs To Be Done) framework
    33→- Contextual Inquiry — Karen Holtzblatt
    34→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/handoff.md"
}

     1→---
     2→description: 리서치 결과물(페르소나, 여정 지도, 인사이트)을 UX 전략 단계 인풋으로 변환합니다.
     3→argument-hint: "[research output file or description]"
     4→---
     5→# /handoff
     6→Convert research outputs into structured inputs for the UX strategy phase.
     7→
     8→## Steps
     9→
    10→1. **Collect Research Outputs** — Review available artifacts from `/discover`, `/synthesize`, and `/interview`.
    11→   > If no research outputs exist, recommend running `/discover` first before proceeding.
    12→
    13→2. **Reformat for Strategy** — Transform each artifact type:
    14→   - Personas → target audience summary (goals, context, constraints)
    15→   - Jobs-to-be-done → opportunity signals (unmet needs, frequency, severity)
    16→   - Pain points → design constraints (must-avoid, must-support)
    17→
    18→3. **Compress Key Insights** — Summarize the 3–5 most strategy-relevant findings in "So what?" format:
    19→   > e.g., "Users abandon onboarding at step 3 → so what? The value prop isn't communicated early enough."
    20→
    21→4. **Recommend Next Step** — Based on the insight profile, suggest one of:
    22→   - `/frame-problem` — if the core problem still needs definition
    23→   - `/strategize` — if insights are sufficient to move into strategy
    24→   - `/benchmark` — if competitive context is needed before strategy
    25→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/scenario-test-plan.md"
}

     1→---
     2→description: Design a complete usability test plan with tasks, metrics, and facilitation guide.
     3→argument-hint: [product, feature, or prototype to test]
     4→---
     5→
     6→Design a comprehensive usability test plan:
     7→
     8→1. Use the `usability-test-plan` skill to create the full test plan including research questions, methodology, participant criteria, tasks, metrics, and facilitation guide.
     9→2. If personas are available, align tasks to primary persona scenarios.
    10→3. Include a pilot test checklist.
    11→4. After completion, suggest: "Want me to `/synthesize` to help analyze results after testing?" or "Want me to `/interview` to prepare follow-up interview scripts?"

이제 구조를 파악했습니다. `SKILL.md`를 만들겠습니다.

Tool: Write
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/SKILL.md",
  "content": "---\nname: research\ndescription: \"Run user research workflows — persona creation, empathy mapping, journey mapping, interview simulation, and synthesis. Use when the user wants to understand users, validate assumptions, or gather qualitative insights.\"\nuser-invocable: true\n---\n\n# Research\n\nUX 리서치 스킬 허브. 하위 커맨드와 스킬을 조합하여 리서치 사이클을 실행합니다.\n\n## Available Commands\n\n| Command | Description |\n|---------|-------------|\n| `/discover` | 페르소나 → 공감지도 → 여정지도 풀사이클 |\n| `/synthesize` | 정성 데이터를 어피니티 다이어그램 + JTBD로 구조화 |\n| `/interview` | 인터뷰 스크립트 생성 + 페르소나 시뮬레이션 |\n| `/scenario-test-plan` | 유저빌리티 테스트 플랜 설계 |\n| `/handoff` | 리서치 결과물을 UX 전략 단계 인풋으로 변환 |\n\n## Usage\n\n인자 없이 `/research` 실행 시, 위 커맨드 목록을 보여주고 사용자에게 어떤 리서치 활동을 원하는지 질문합니다.\n\n인자가 있으면 맥락에 맞는 커맨드를 추천합니다:\n- 제품/기능 이름 → `/discover` 추천\n- 인터뷰 데이터/노트 → `/synthesize` 추천\n- 페르소나 파일 → `/interview` 추천\n"
}

File created successfully at: /Users/yeonsu/2026/bari-design/.claude/skills/research/SKILL.md

완료. `.claude/skills/research/SKILL.md`를 생성했습니다. 이제 `/research`가 슬래시 커맨드로 인식될 겁니다.

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md"
}
```

**Result:**

```
     1→---
     2→description: Run a full user research cycle — persona creation, empathy mapping, and journey mapping for a product or feature.
     3→argument-hint: [product or feature to research]
     4→---
     5→
     6→Run a full user research discovery cycle by chaining these steps:
     7→
     8→1. Use the `user-persona` skill to create 2-3 user personas from available research data
     9→2. Use the `empathy-map` skill to build empathy maps for the primary persona
    10→3. Use the `journey-map` skill to map the end-to-end user journey for the primary persona
    11→4. Synthesize findings into a research summary with key insights and design implications
    12→5. After completion, suggest: "Want me to `/interview` to prepare scripts for validating these personas?" or "Want me to `/test-plan` to design usability tests?"
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/synthesize.md"
}
```

**Result:**

```
     1→---
     2→description: Synthesize research data into affinity diagrams, themes, and actionable insights.
     3→argument-hint: [PRD, interview notes to synthesize]
     4→---
     5→
     6→Synthesize qualitative research data into structured insights:
     7→
     8→1. Use the `affinity-diagram` skill to organize raw data into themed clusters with insight statements
     9→2. Use the `jobs-to-be-done` skill to map user motivations and outcome expectations
    10→3. Combine findings into a prioritized list of design implications and opportunities
    11→4. After completion, suggest: "Want me to `/discover` to create personas from these insights?" or "Want me to `/scenario-test-plan` to validate these findings with usability testing?"
```

**Tool:** `Glob`

```json
{
  "pattern": ".claude/skills/*/SKILL.md"
}
```

**Result:**

```
/Users/yeonsu/2026/bari-design/.claude/skills/audit/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/color-taste/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/critique/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/design-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/dispatching-parallel-agents/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/executing-plans/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/finishing-a-development-branch/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/frontend-design-impeccable/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/optimize/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/polish/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/receiving-code-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/requesting-code-review/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/rhythm-arrange/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/subagent-driven-development/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/teach-impeccable/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/using-git-worktrees/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/writing-plans/SKILL.md
/Users/yeonsu/2026/bari-design/.claude/skills/spec-dialectic/SKILL.md
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/critique/SKILL.md",
  "limit": 30
}
```

**Result:**

```
     1→---
     2→name: critique
     3→description: "Evaluate design from a UX perspective, assessing visual hierarchy, information architecture, emotional resonance, cognitive load, and overall quality with quantitative scoring, persona-based testing, and actionable feedback. Use when the user asks to review, critique, evaluate, or give feedback on a design or component."
     4→argument-hint: "[area (feature, page, component...)]"
     5→user-invocable: true
     6→---
     7→
     8→## MANDATORY PREPARATION
     9→
    10→Invoke {{command_prefix}}frontend-design — it contains design principles, anti-patterns, and the **Context Gathering Protocol**. Follow the protocol before proceeding — if no design context exists yet, you MUST run {{command_prefix}}teach-impeccable first. Additionally gather: what the interface is trying to accomplish.
    11→
    12→---
    13→
    14→Conduct a holistic design critique, evaluating whether the interface actually works — not just technically, but as a designed experience. Think like a design director giving feedback.
    15→
    16→## Phase 1: Design Critique
    17→
    18→Evaluate the interface across these dimensions:
    19→
    20→### 1. AI Slop Detection (CRITICAL)
    21→
    22→**This is the most important check.** Does this look like every other AI-generated interface from 2024-2025?
    23→
    24→Review the design against ALL the **DON'T** guidelines in the frontend-design skill — they are the fingerprints of AI-generated work. Check for the AI color palette, gradient text, dark mode with glowing accents, glassmorphism, hero metric layouts, identical card grids, generic fonts, and all other tells.
    25→
    26→**The test**: If you showed this to someone and said "AI made this," would they believe you immediately? If yes, that's the problem.
    27→
    28→### 2. Visual Hierarchy
    29→- Does the eye flow to the most important element first?
    30→- Is there a clear primary action? Can you spot it in 2 seconds?
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/interview.md"
}
```

**Result:**

```
     1→---
     2→description: Generate an interview script and run a simulated user interview for a persona.
     3→argument-hint: [file path or persona name]
     4→---
     5→
     6→# Interview
     7→
     8→Chain interview script generation and persona simulation into a single guided session.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher facilitating a user interview session for $ARGUMENTS. Accept a file path or persona name as input. If no valid persona is found, prompt: "No persona found. Run `/discover` first or provide a file path."
    13→
    14→## Domain Context
    15→
    16→- Chain the two skills sequentially: `interview-script` → `persona-simulation`
    17→- A user confirmation gate separates the two phases
    18→- Prompt between phases: "인터뷰 스크립트를 확인해주세요. 이대로 시뮬레이션을 시작할까요? (yes로 진행, 또는 수정할 내용을 입력하세요)"
    19→- Any affirmative reply (`yes`, `ㅇㅇ`, `진행`, etc.) starts the simulation
    20→- If the user pastes edits, replace the generated script with the edited version before proceeding
    21→
    22→## Instructions
    23→
    24→1. **Load persona**: Read the persona from the provided file path or name.
    25→2. **Generate script**: Run the `interview-script` skill to produce a structured interview script from the persona data.
    26→3. **Confirm**: Present the script and ask the user to confirm or revise before proceeding.
    27→4. **Simulate**: Run the `persona-simulation` skill using the confirmed script and persona data.
    28→
    29→## Further Reading
    30→
    31→- Steve Portigal, *Interviewing Users*
    32→- JTBD (Jobs To Be Done) framework
    33→- Contextual Inquiry — Karen Holtzblatt
    34→
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/handoff.md"
}
```

**Result:**

```
     1→---
     2→description: 리서치 결과물(페르소나, 여정 지도, 인사이트)을 UX 전략 단계 인풋으로 변환합니다.
     3→argument-hint: "[research output file or description]"
     4→---
     5→# /handoff
     6→Convert research outputs into structured inputs for the UX strategy phase.
     7→
     8→## Steps
     9→
    10→1. **Collect Research Outputs** — Review available artifacts from `/discover`, `/synthesize`, and `/interview`.
    11→   > If no research outputs exist, recommend running `/discover` first before proceeding.
    12→
    13→2. **Reformat for Strategy** — Transform each artifact type:
    14→   - Personas → target audience summary (goals, context, constraints)
    15→   - Jobs-to-be-done → opportunity signals (unmet needs, frequency, severity)
    16→   - Pain points → design constraints (must-avoid, must-support)
    17→
    18→3. **Compress Key Insights** — Summarize the 3–5 most strategy-relevant findings in "So what?" format:
    19→   > e.g., "Users abandon onboarding at step 3 → so what? The value prop isn't communicated early enough."
    20→
    21→4. **Recommend Next Step** — Based on the insight profile, suggest one of:
    22→   - `/frame-problem` — if the core problem still needs definition
    23→   - `/strategize` — if insights are sufficient to move into strategy
    24→   - `/benchmark` — if competitive context is needed before strategy
    25→
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/scenario-test-plan.md"
}
```

**Result:**

```
     1→---
     2→description: Design a complete usability test plan with tasks, metrics, and facilitation guide.
     3→argument-hint: [product, feature, or prototype to test]
     4→---
     5→
     6→Design a comprehensive usability test plan:
     7→
     8→1. Use the `usability-test-plan` skill to create the full test plan including research questions, methodology, participant criteria, tasks, metrics, and facilitation guide.
     9→2. If personas are available, align tasks to primary persona scenarios.
    10→3. Include a pilot test checklist.
    11→4. After completion, suggest: "Want me to `/synthesize` to help analyze results after testing?" or "Want me to `/interview` to prepare follow-up interview scripts?"
```

**Tool:** `Write`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/SKILL.md",
  "content": "---\nname: research\ndescription: \"Run user research workflows — persona creation, empathy mapping, journey mapping, interview simulation, and synthesis. Use when the user wants to understand users, validate assumptions, or gather qualitative insights.\"\nuser-invocable: true\n---\n\n# Research\n\nUX 리서치 스킬 허브. 하위 커맨드와 스킬을 조합하여 리서치 사이클을 실행합니다.\n\n## Available Commands\n\n| Command | Description |\n|---------|-------------|\n| `/discover` | 페르소나 → 공감지도 → 여정지도 풀사이클 |\n| `/synthesize` | 정성 데이터를 어피니티 다이어그램 + JTBD로 구조화 |\n| `/interview` | 인터뷰 스크립트 생성 + 페르소나 시뮬레이션 |\n| `/scenario-test-plan` | 유저빌리티 테스트 플랜 설계 |\n| `/handoff` | 리서치 결과물을 UX 전략 단계 인풋으로 변환 |\n\n## Usage\n\n인자 없이 `/research` 실행 시, 위 커맨드 목록을 보여주고 사용자에게 어떤 리서치 활동을 원하는지 질문합니다.\n\n인자가 있으면 맥락에 맞는 커맨드를 추천합니다:\n- 제품/기능 이름 → `/discover` 추천\n- 인터뷰 데이터/노트 → `/synthesize` 추천\n- 페르소나 파일 → `/interview` 추천\n"
}
```

**Result:**

```
File created successfully at: /Users/yeonsu/2026/bari-design/.claude/skills/research/SKILL.md
```

### User (Turn 5)

내가 지금 시나리오 만들며 기획하고 이는 서비스의 이름을 정하자

### Assistant (Turn 6)

> *Thinking:*
> 

프로젝트 맥락부터 확인하겠습니다.

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/.claude/projects/-Users-yeonsu-2026-bari-design/memory/project_dooh_cms.md"
}

Tool: Glob
Input: {
  "pattern": "docs/scenarios/**/*.md"
}

     1→---
     2→name: DOOH CMS project context
     3→description: DOOH CMS 기획 문서 구조, 주요 엔티티, 확정된 의사결정사항
     4→type: project
     5→---
     6→
     7→DOOH(Digital Out-Of-Home) CMS 플랫폼 기획 프로젝트. 12개 기획 문서가 `.claude/docs/`에 위치.
     8→
     9→**핵심 엔티티**: 매체(Media), 소재(Material), 캠페인(Campaign), 편성표(Schedule), 재생목록(Playlist), 광고주(Advertiser), 사용자(User)
    10→
    11→**확정 의사결정 (2026-04-01)**:
    12→- FM 방식: FSM + Design by Contract 수준으로 적용
    13→- 소재 검수: `소재검수.md` 기준 (자동 검수 강화 방식)
    14→- 캠페인: 승인/반려 없음, 집행상태관리만 (초안→집행중→완료/취소)
    15→- 영업대행사: 광고 소재 도메인만 접근 가능, 편성 관련 기능 접근 불가
    16→- 분석 산출물: 분석 보고서 + 기존 문서 보완 (둘 다)
    17→
    18→**Why:** 문서 간 충돌이 많아 구현 전 정리가 필수
    19→**How to apply:** spec-dialectic 스킬로 분석 시 이 의사결정을 prior decision으로 적용
    20→

/Users/yeonsu/2026/bari-design/docs/scenarios/02-media-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/06-notification-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/07-dashboard-report.md
/Users/yeonsu/2026/bari-design/docs/scenarios/MANIFEST.md
/Users/yeonsu/2026/bari-design/docs/scenarios/03-material-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/05-scheduling-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/04-campaign-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/01-user-management.md

DOOH(디지털 옥외광고) CMS 플랫폼이군요. 네이밍 전에 몇 가지 확인하고 싶습니다:

1. **타겟 사용자는 누구인가요?** 광고주 직접 사용? 미디어렙/대행사 내부 운영툴? 매체사 자체 관리?
2. **톤앤매너 선호가 있나요?** 예: 전문적/테크, 친근/캐주얼, 미니멀/모던, 한국어 이름 vs 영어 이름
3. **이미 후보나 방향성이 있나요?** 아니면 완전 백지에서 시작?

이걸 알면 맥락에 맞는 이름을 제안할 수 있습니다.

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/.claude/projects/-Users-yeonsu-2026-bari-design/memory/project_dooh_cms.md"
}
```

**Result:**

```
     1→---
     2→name: DOOH CMS project context
     3→description: DOOH CMS 기획 문서 구조, 주요 엔티티, 확정된 의사결정사항
     4→type: project
     5→---
     6→
     7→DOOH(Digital Out-Of-Home) CMS 플랫폼 기획 프로젝트. 12개 기획 문서가 `.claude/docs/`에 위치.
     8→
     9→**핵심 엔티티**: 매체(Media), 소재(Material), 캠페인(Campaign), 편성표(Schedule), 재생목록(Playlist), 광고주(Advertiser), 사용자(User)
    10→
    11→**확정 의사결정 (2026-04-01)**:
    12→- FM 방식: FSM + Design by Contract 수준으로 적용
    13→- 소재 검수: `소재검수.md` 기준 (자동 검수 강화 방식)
    14→- 캠페인: 승인/반려 없음, 집행상태관리만 (초안→집행중→완료/취소)
    15→- 영업대행사: 광고 소재 도메인만 접근 가능, 편성 관련 기능 접근 불가
    16→- 분석 산출물: 분석 보고서 + 기존 문서 보완 (둘 다)
    17→
    18→**Why:** 문서 간 충돌이 많아 구현 전 정리가 필수
    19→**How to apply:** spec-dialectic 스킬로 분석 시 이 의사결정을 prior decision으로 적용
    20→
```

**Tool:** `Glob`

```json
{
  "pattern": "docs/scenarios/**/*.md"
}
```

**Result:**

```
/Users/yeonsu/2026/bari-design/docs/scenarios/02-media-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/06-notification-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/07-dashboard-report.md
/Users/yeonsu/2026/bari-design/docs/scenarios/MANIFEST.md
/Users/yeonsu/2026/bari-design/docs/scenarios/03-material-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/05-scheduling-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/04-campaign-management.md
/Users/yeonsu/2026/bari-design/docs/scenarios/01-user-management.md
```

### User (Turn 7)

그냥 DOOH라고 부를게.

### Assistant (Turn 8)

알겠습니다. 서비스 이름은 **DOOH**로 확정.

### User (Turn 9)

<command-message>research</command-message>
<command-name>/research</command-name>
<command-args>DOOH</command-args>

### Assistant (Turn 10)

Base directory for this skill: /Users/yeonsu/2026/bari-design/.claude/skills/research

# Research

UX 리서치 스킬 허브. 하위 커맨드와 스킬을 조합하여 리서치 사이클을 실행합니다.

## Available Commands

| Command | Description |
|---------|-------------|
| `/discover` | 페르소나 → 공감지도 → 여정지도 풀사이클 |
| `/synthesize` | 정성 데이터를 어피니티 다이어그램 + JTBD로 구조화 |
| `/interview` | 인터뷰 스크립트 생성 + 페르소나 시뮬레이션 |
| `/scenario-test-plan` | 유저빌리티 테스트 플랜 설계 |
| `/handoff` | 리서치 결과물을 UX 전략 단계 인풋으로 변환 |

## Usage

인자 없이 `/research` 실행 시, 위 커맨드 목록을 보여주고 사용자에게 어떤 리서치 활동을 원하는지 질문합니다.

인자가 있으면 맥락에 맞는 커맨드를 추천합니다:
- 제품/기능 이름 → `/discover` 추천
- 인터뷰 데이터/노트 → `/synthesize` 추천
- 페르소나 파일 → `/interview` 추천


ARGUMENTS: DOOH



DOOH 프로젝트에 대한 리서치를 시작하려고 하시는군요.

현재 시나리오 문서가 7개 작성되어 있고, 기획 단계이니 추천 순서는:

| 커맨드 | 추천 이유 |
|--------|-----------|
| **`/discover`** | 페르소나 → 공감지도 → 여정지도. 사용자 유형별 니즈 파악에 적합 |
| **`/interview`** | 만들어진 페르소나로 시뮬레이션 인터뷰 → 시나리오 검증 |
| **`/synthesize`** | 기존 기획 문서들의 인사이트를 JTBD로 구조화 |

어떤 리서치 활동을 하고 싶으세요?

### User (Turn 11)

순서대로 진행

### Assistant (Turn 12)

Tool: Skill
Input: {
  "skill": "research:discover",
  "args": "DOOH"
}

<tool_use_error>Unknown skill: research:discover</tool_use_error>

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md"
}

     1→---
     2→description: Run a full user research cycle — persona creation, empathy mapping, and journey mapping for a product or feature.
     3→argument-hint: [product or feature to research]
     4→---
     5→
     6→Run a full user research discovery cycle by chaining these steps:
     7→
     8→1. Use the `user-persona` skill to create 2-3 user personas from available research data
     9→2. Use the `empathy-map` skill to build empathy maps for the primary persona
    10→3. Use the `journey-map` skill to map the end-to-end user journey for the primary persona
    11→4. Synthesize findings into a research summary with key insights and design implications
    12→5. After completion, suggest: "Want me to `/interview` to prepare scripts for validating these personas?" or "Want me to `/test-plan` to design usability tests?"

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona/SKILL.md"
}

     1→---
     2→name: user-persona
     3→description: Create refined user personas from research data with demographics, goals, and behavioral patterns. Use when synthesizing user research into actionable persona profiles for design decisions.
     4→---
     5→
     6→# User Persona
     7→
     8→Create comprehensive user personas grounded in research data for product and UX design.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team create user personas for $ARGUMENTS. If the user provides product planning materials (requirements documents, feature specs, or roadmaps), read them first. If they mention a product URL, use web search to understand the product. 
    13→
    14→## Domain Context
    15→
    16→- Personas (Alan Cooper, About Face): Archetypical users based on behavioral patterns, not demographics alone.
    17→- Each persona should feel like a real person the team can empathize with and design for.
    18→- Personas should be grounded in actual research data, not assumptions.
    19→- Include behavioral variables, goals (life goals, experience goals, end goals), and frustrations.
    20→
    21→## Instructions
    22→
    23→The user will describe their product and available research data. Work through these steps:
    24→
    25→1. **Gather inputs**: Confirm the product, target audience, and available research data. Ask for clarification if anything is ambiguous.
    26→2. **Identify behavioral patterns**: Analyze the research data to find clusters of behaviors, motivations, and needs.
    27→3. **Define 2-4 personas** — for each persona, include:
    28→   - Name, photo description, and a one-line quote that captures their mindset
    29→   - Demographics: age range, occupation, tech comfort, relevant context
    30→   - Goals: what they want to achieve (functional, emotional, social)
    31→   - Frustrations: current pain points and unmet needs
    32→   - Behaviors: how they currently approach the problem
    33→   - Scenario: a brief day-in-the-life narrative
    34→   - Design implications: what this means for product decisions
    35→4. **Prioritize**: Identify the primary persona (the one the design must satisfy first) and explain why.
    36→5. **Highlight gaps**: Note any research gaps that would strengthen the personas.
    37→6. Think step by step. Present personas in a clear, structured format. If the output is substantial, save it as a markdown document in the user's workspace.
    38→
    39→## Further Reading
    40→
    41→- About Face — Alan Cooper
    42→- Lean UX — Jeff Gothelf and Josh Seiden
    43→- Just Enough Research — Erika Hall

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map/SKILL.md"
}

     1→---
     2→name: empathy-map
     3→description: Build a 4-quadrant empathy map (Says, Thinks, Does, Feels) to synthesize user research into actionable insights. Use when you need to quickly capture and share user understanding across the team.
     4→---
     5→
     6→# Empathy Map
     7→
     8→Build an empathy map to synthesize user research and align the team around user understanding.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team create user personas for $ARGUMENTS. If the user provides product planning materials (requirements documents, feature specs, or roadmaps), read them first. If they mention a product URL, use web search to understand the product. 
    13→
    14→## Domain Context
    15→
    16→- Empathy Maps (Dave Gray, XPLANE): A collaborative tool to externalize what we know about a user type.
    17→- Four quadrants: Says (direct quotes), Thinks (inferred beliefs), Does (observed actions), Feels (emotional states).
    18→- Also capture Goals (what they want to achieve) and Pain Points (barriers and frustrations).
    19→- Best created from actual research data, not assumptions.
    20→
    21→## Instructions
    22→
    23→The user will describe their user type and available research data. Work through these steps:
    24→
    25→1. **Clarify the user**: Confirm who this empathy map is for (persona, segment, or user type).
    26→2. **Map each quadrant**:
    27→  - **Says**: Direct quotes and statements from research (use actual quotes where available)
    28→  - **Thinks**: Beliefs, concerns, and thoughts inferred from behavior and context
    29→  - **Does**: Observable actions, behaviors, and workarounds
    30→  - **Feels**: Emotional states, anxieties, and motivations
    31→3. **Identify goals**: What is this user trying to achieve?
    32→4. **Identify pain points**: What barriers, frustrations, or unmet needs exist?
    33→5. **Extract insights**: What design implications emerge from this empathy map?
    34→6. **Note gaps**: What do we still need to learn?
    35→7. Think step by step. Present the empathy map in a clear, visual-friendly format.
    36→
    37→## Further Reading
    38→
    39→- Gamestorming — Dave Gray
    40→- Lean UX — Jeff Gothelf and Josh Seiden

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map/SKILL.md"
}

     1→---
     2→name: journey-map
     3→description: Create an end-to-end user journey map with stages, touchpoints, emotions, pain points, and opportunity areas. Use when mapping the full user experience for a product, feature, or service.
     4→---
     5→
     6→# Journey Map
     7→
     8→Create a comprehensive user journey map for product design and UX analysis.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team map the user journey for $ARGUMENTS. If the user provides planning documents (PRDs, product specs, or system architectures), read them first.
    13→
    14→## Domain Context
    15→
    16→- Journey Mapping (Jim Kalbach, Mapping Experiences): Visualizing the end-to-end experience across stages, touchpoints, channels, emotions, and pain points.
    17→- Each stage should capture: user goals, actions, touchpoints, emotions, pain points, and opportunities.
    18→- Journey maps should be persona-specific when possible.
    19→- Include both the current state (as-is) and highlight opportunity areas for the future state.
    20→
    21→## Instructions
    22→
    23→The user will describe the product/feature and target user. Work through these steps:
    24→
    25→1. **Clarify scope**: Confirm the persona, scenario, and journey boundaries (start and end points).
    26→2. **Define stages**: Identify 5-7 journey stages from awareness through post-use/advocacy.
    27→3. **Map each stage** with:
    28→     - User goals for this stage
    29→     - Actions and behaviors
    30→     - Touchpoints and channels
    31→     - Thoughts and questions
    32→     - Emotional state (rate on a positive/negative scale)
    33→     - Pain points and friction
    34→     - Opportunity areas for design improvement
    35→4. **Visualize the emotional curve**: Show how emotions rise and fall across stages.
    36→5. **Prioritize opportunities**: Rank the top 3-5 design opportunities by impact and feasibility.
    37→6. **Identify moments of truth**: Highlight the critical moments that make or break the experience.
    38→7. Think step by step. Present in a clear, structured format.
    39→
    40→## Further Reading
    41→
    42→- Mapping Experiences — Jim Kalbach
    43→- The Elements of User Experience — Jesse James Garrett

> *Thinking:*
> 

기획 문서를 먼저 읽고 페르소나를 만들겠습니다.

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/01-user-management.md"
}

     1→# 사용자 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS에 접근하는 모든 사용자의 계정 생성, 권한 부여, 비활성화를 관리한다. 이메일 초대 기반 가입 방식을 사용하며, 자체 회원가입은 지원하지 않는다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 페르소나 | 설명 |
    12→|---------|------|
    13→| **어드민** | CMS 플랫폼 관리자. 모든 사용자 관리 권한 보유. 매체사 담당자 초대의 기본 주체 |
    14→| **매체사** | 매체를 소유한 회사 소속 사용자. 소속 매체사 내 추가 사용자(운영대행사/영업대행사) 초대 가능 |
    15→| **운영대행사** | 매체사로부터 권한을 부여받아 매체 또는 매체 그룹을 관리 |
    16→| **영업대행사** | 매체사로부터 권한을 부여받아 소재 도메인만 접근 가능 (확정 의사결정) |
    17→
    18→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    19→|------|:------:|:------:|:----------:|:----------:|
    20→| 매체사 담당자 초대 | O | — | — | — |
    21→| 추가 사용자 초대 | O (예외적) | O | X | X |
    22→| 사용자 권한 변경 | O (전체) | O (소속 내) | X | X |
    23→| 사용자 비활성화 | O (전체) | O (소속 내) | X | X |
    24→| 본인 정보 수정 | O | O | O | O |
    25→
    26→---
    27→
    28→## 3. 시나리오 목록
    29→
    30→| ID | 시나리오명 | Actor |
    31→|----|----------|-------|
    32→| UC-01 | 어드민이 매체사 담당자를 초대 | 어드민 |
    33→| UC-02 | 초대받은 사용자가 가입 완료 | 초대받은 사용자 |
    34→| UC-03 | 매체사가 운영대행사/영업대행사를 추가 초대 | 매체사 |
    35→| UC-04 | 사용자 권한 변경 | 어드민, 매체사 |
    36→| UC-05 | 사용자 비활성화/탈퇴 | 어드민, 매체사 |
    37→
    38→---
    39→
    40→## 4. 상세 시나리오
    41→
    42→### UC-01: 어드민이 매체사 담당자를 초대
    43→
    44→**누가**: 어드민
    45→**언제**: 새로운 매체사를 CMS에 온보딩할 때
    46→**전제조건**: 어드민이 로그인된 상태. 대상 매체사가 UC-06(매체사 등록)으로 등록 완료되었거나, 초대와 동시에 매체사 등록을 진행
    47→
    48→#### 시나리오
    49→
    50→1. 어드민이 사용자 관리 > 초대 버튼을 클릭한다
    51→2. 초대 대상의 이메일 주소를 입력한다
    52→3. 역할을 "매체사"로 지정한다
    53→4. 소속 매체사를 선택한다
    54→5. 초대장 발송 버튼을 클릭한다
    55→6. 시스템이 초대 메일을 발송하고, 초대 상태를 "발송됨"으로 기록한다
    56→7. 초대 목록에 해당 건이 표시된다
    57→
    58→#### 이런 경우에는
    59→
    60→- **이미 가입된 이메일 (활성 상태)**: "이미 등록된 사용자입니다" 안내. 초대 발송 차단
    61→- **이미 가입된 이메일 (비활성 상태)**: "비활성화된 사용자입니다. 활성화하시겠습니까?" 확인 → 활성화 처리 (새 초대 불필요)
    62→- **동일 이메일로 이미 초대 발송됨 (미가입 상태)**: "이미 초대가 발송된 이메일입니다. 재발송하시겠습니까?" 확인 후 재발송 가능
    63→- **이메일 형식 오류**: 필드 하이라이트 + "올바른 이메일 형식을 입력해주세요" 안내
    64→- **소속 매체사 미선택**: 다음 단계 버튼 비활성화
    65→
    66→#### 결과
    67→
    68→- 초대 레코드 생성: 상태 "발송됨", 유효기간 7일
    69→- 대상 이메일로 가입 링크 포함 초대 메일 발송
    70→- 인앱 알림: 초대 주체(어드민)에게 "초대 발송 완료" 알림
    71→
    72→---
    73→
    74→### UC-02: 초대받은 사용자가 가입 완료
    75→
    76→**누가**: 초대받은 사용자
    77→**언제**: 초대 메일의 가입 링크를 클릭했을 때
    78→**전제조건**: UC-01 또는 UC-03에서 초대가 발송된 상태. 초대 유효기간 내
    79→
    80→#### 시나리오
    81→
    82→1. 사용자가 초대 메일의 가입 링크를 클릭한다
    83→2. 가입 페이지가 열린다. 이메일은 초대 시 지정된 값으로 고정 표시
    84→3. 이름, 비밀번호를 입력한다
    85→4. 이용약관에 동의한다
    86→5. 가입 완료 버튼을 클릭한다
    87→6. 시스템이 계정을 생성하고, 초대 시 지정된 역할과 소속을 자동 부여한다
    88→7. CMS 메인 화면으로 이동한다
    89→
    90→#### 이런 경우에는
    91→
    92→- **초대 유효기간 만료**: "초대가 만료되었습니다. 관리자에게 재발송을 요청해주세요" 안내. 가입 불가
    93→- **비밀번호 정책 미충족**: 필드 하이라이트 + 정책 안내 (최소 8자, 영문+숫자+특수문자)
    94→- **이미 가입 완료된 초대 링크 재클릭**: "이미 가입이 완료되었습니다" 안내 → 로그인 페이지로 이동
    95→
    96→#### 결과
    97→
    98→- 사용자 계정 생성: 역할(매체사/운영대행사/영업대행사), 소속 매체사 자동 설정
    99→- 초대 레코드 상태: "발송됨" → "가입완료"
   100→- 인앱 알림: 초대 주체에게 "xxx님이 가입을 완료했습니다" 알림
   101→
   102→---
   103→
   104→### UC-03: 매체사가 운영대행사/영업대행사를 추가 초대
   105→
   106→**누가**: 매체사
   107→**언제**: 소속 매체의 운영 또는 영업을 위임할 외부 담당자를 초대할 때
   108→**전제조건**: 매체사 사용자가 로그인된 상태. UC-02를 통해 가입 완료된 매체사 계정
   109→
   110→#### 시나리오
   111→
   112→1. 매체사가 사용자 관리 > 초대 버튼을 클릭한다
   113→2. 초대 대상의 이메일 주소를 입력한다
   114→3. 역할을 선택한다: "운영대행사" 또는 "영업대행사"
   115→4. 권한 범위를 설정한다:
   116→   - 운영대행사: 접근 가능한 매체 또는 매체 그룹을 선택
   117→   - 영업대행사: 소재 도메인 접근 범위를 설정 (전체 또는 본인 소속 데이터만)
   118→5. 초대장 발송 버튼을 클릭한다
   119→6. 시스템이 초대 메일을 발송한다
   120→
   121→#### 이런 경우에는
   122→
   123→- **매체사에 등록된 매체가 없는 상태에서 운영대행사 초대**: "먼저 매체를 등록해주세요" 안내. 초대 발송 차단
   124→- **이미 가입된 이메일**: UC-01과 동일 처리
   125→- **동일 사용자를 다른 역할로 재초대**: "이미 xxx 역할로 등록된 사용자입니다. 역할을 변경하시겠습니까?" 확인 → UC-04로 이동
   126→
   127→#### 결과
   128→
   129→- 초대 레코드 생성: 역할, 권한 범위 포함
   130→- 초대 메일 발송
   131→- 인앱 알림: 초대 주체(매체사)에게 발송 완료 알림
   132→
   133→---
   134→
   135→### UC-04: 사용자 권한 변경
   136→
   137→**누가**: 어드민 또는 매체사
   138→**언제**: 기존 사용자의 역할 또는 접근 범위를 변경해야 할 때
   139→**전제조건**: 대상 사용자가 가입 완료(활성) 상태. 변경 주체가 대상 사용자에 대한 관리 권한 보유
   140→
   141→#### 시나리오
   142→
   143→1. 어드민 또는 매체사가 사용자 관리 > 사용자 목록에서 대상 사용자를 선택한다
   144→2. 상세 정보 화면에서 "권한 변경" 버튼을 클릭한다
   145→3. 변경할 항목을 수정한다:
   146→   - 역할 변경 (운영대행사 ↔ 영업대행사)
   147→   - 접근 가능 매체/매체 그룹 범위 변경
   148→4. 변경 사유를 입력한다 (선택)
   149→5. 저장 버튼을 클릭한다
   150→6. 시스템이 권한을 즉시 반영한다
   151→
   152→#### 이런 경우에는
   153→
   154→- **매체사가 어드민 권한 사용자를 변경 시도**: 변경 버튼이 표시되지 않음 (권한 부족)
   155→- **매체사가 타 매체사 소속 사용자를 변경 시도**: 사용자 목록에 표시되지 않음
   156→- **운영대행사→영업대행사 변경 시 기존 편성 관련 데이터 존재**: "기존 편성 관리 권한이 회수됩니다. 계속하시겠습니까?" 확인
   157→
   158→#### 결과
   159→
   160→- 사용자 권한 즉시 변경 반영
   161→- 변경 이력 기록 (변경 주체, 변경 전/후 값, 변경 일시)
   162→- 대상 사용자에게 "권한이 변경되었습니다" 인앱 알림
   163→
   164→---
   165→
   166→### UC-05: 사용자 비활성화/탈퇴
   167→
   168→**누가**: 어드민 또는 매체사
   169→**언제**: 사용자의 CMS 접근을 중지하거나, 사용자가 탈퇴를 요청할 때
   170→**전제조건**: 대상 사용자가 활성 상태. 비활성화 주체가 관리 권한 보유
   171→
   172→#### 시나리오
   173→
   174→1. 어드민 또는 매체사가 사용자 관리 > 사용자 목록에서 대상 사용자를 선택한다
   175→2. "비활성화" 버튼을 클릭한다
   176→3. 시스템이 확인 모달을 표시한다: "이 사용자를 비활성화하시겠습니까?"
   177→4. 확인 버튼을 누르면 사용자 상태가 "활성" → "비활성"으로 변경된다
   178→5. 비활성화된 사용자는 즉시 로그아웃 처리되며, 이후 로그인 불가
   179→
   180→#### 이런 경우에는
   181→
   182→- **매체사의 유일한 활성 사용자를 비활성화 시도**: "이 매체사의 마지막 활성 사용자입니다. 비활성화하면 해당 매체사를 관리할 수 없게 됩니다. 계속하시겠습니까?" 경고
   183→- **비활성화된 사용자를 다시 활성화**: 사용자 상세에서 "활성화" 버튼 → 즉시 활성화 → 기존 역할/권한 복원
   184→- **사용자가 본인 탈퇴 요청**: 설정 > 계정 > 탈퇴 요청 → 어드민 또는 매체사에게 탈퇴 요청 알림 발송 → 어드민 또는 매체사가 승인 시 비활성화 처리
   185→
   186→#### 결과
   187→
   188→- 사용자 상태: "활성" → "비활성"
   189→- 즉시 세션 무효화 (로그아웃 처리)
   190→- 비활성화 이력 기록 (주체, 일시, 사유)
   191→- 비활성화된 사용자의 데이터(등록한 소재, 캠페인 등)는 삭제되지 않고 유지
   192→
   193→---
   194→
   195→## 5. 도메인 규칙
   196→
   197→### 5.1 사용자 상태 FSM
   198→
   199→```
   200→[초대발송됨] ──(가입완료)──→ [활성]
   201→     │                        │    ↑
   202→     │(만료)                (비활성화) (활성화)
   203→     ↓                        ↓    │
   204→[초대만료]                  [비활성] ─┘
   205→```
   206→
   207→**상태**:
   208→| 상태 | 설명 | 허용 동작 |
   209→|------|------|----------|
   210→| 초대발송됨 | 초대 메일 발송, 미가입 | 재발송, 만료 |
   211→| 초대만료 | 유효기간 경과 | 재발송(새 초대 생성) |
   212→| 활성 | 가입 완료, CMS 사용 가능 | 로그인, 기능 사용, 비활성화 |
   213→| 비활성 | CMS 접근 차단 | 활성화(관리자) |
   214→
   215→**전이**:
   216→| From → To | 트리거 | 가드 | 효과 |
   217→|-----------|--------|------|------|
   218→| 초대발송됨 → 활성 | 사용자가 가입 완료 | 유효기간 내, 필수정보 입력 | 계정 생성, 역할/소속 부여 |
   219→| 초대발송됨 → 초대만료 | 유효기간 경과 (7일) | — | 가입 링크 무효화 |
   220→| 초대만료 → 초대발송됨 | 어드민 또는 매체사가 재발송 | — | 새 초대 레코드 생성 |
   221→| 활성 → 비활성 | 어드민 또는 매체사가 비활성화 | 관리 권한 보유 | 세션 무효화, 로그인 차단 |
   222→| 비활성 → 활성 | 어드민 또는 매체사가 활성화 | 관리 권한 보유 | 기존 역할/권한 복원 |
   223→
   224→**불변식**:
   225→- INV-01: 모든 활성 사용자는 정확히 하나의 역할(어드민/매체사/운영대행사/영업대행사)을 가진다
   226→- INV-02: 매체사/운영대행사/영업대행사는 반드시 하나의 소속 매체사에 연결된다
   227→- INV-03: 영업대행사는 소재 도메인 외 기능에 접근할 수 없다
   228→- INV-04: 초대 유효기간은 발송 시점으로부터 7일이다
   229→
   230→### 5.2 비즈니스 규칙
   231→
   232→- BR-01: 자체 회원가입 불가. 반드시 초대를 통해서만 계정 생성
   233→- BR-02: 어드민은 시스템에 직접 생성 (초대 프로세스 외)
   234→- BR-03: 한 이메일 = 한 계정. 동일 이메일로 복수 계정 불가
   235→- BR-04: 비활성화된 사용자의 기존 데이터(소재, 캠페인 등)는 삭제되지 않음
   236→- BR-05: 권한 변경은 즉시 반영. 다음 요청부터 새 권한 적용
   237→
   238→---
   239→
   240→## 6. 미결 사항
   241→
   242→- 초대 유효기간 7일이 적정한지 확인 필요. 만료 기준: 발송 시점 +7일 00:00:00 (자정 기준? 정확히 168시간?)
   243→- 어드민 계정의 초기 생성 방법 (시드 데이터? 별도 관리 콘솔?) 미정의
   244→- 비밀번호 정책 상세 (최소 길이, 복잡도, 변경 주기) 미정의
   245→- 한 사용자가 복수 매체사에 소속 가능한지 미정의 (현재 설계: 1인 1매체사)
   246→- 탈퇴 시 개인정보 처리 방안 (보존 기간, 익명화) 미정의
   247→- 운영대행사→영업대행사 역할 전환 시 기존 편성 작업물의 소유자 처리 방안 미정의
   248→- 매체사의 유일한 활성 사용자 비활성화 후 복구 주체: 어드민만 가능한지 확인 필요
   249→- 초대 메일 발송 상태 추적 필요 여부 (발송성공/실패/읽음). 스팸함 유입 대응
   250→- 어드민 계정 보안 강화 (2FA, 세션 관리 정책) 미정의
   251→- 휴면 계정 자동 비활성화 정책 (미로그인 기간 기준) 미정의
   252→- 통합 권한 모델 미정의: "권한 범위 내"가 역할별로 다른 의미 — 운영대행사=매체/매체그룹 단위, 영업대행사=소재 범위(전체/본인 소속). 구현 시 통합 권한 체계 설계 필요 (spec-dialectic C-5)
   253→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/04-campaign-management.md"
}

     1→# 캠페인 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→캠페인은 "누가 얼마를 내고 어디에 광고하는지"를 정의하는 비즈니스 단위이다. 광고주, 대상 매체, 집행 기간, 예산 정보를 포함한다. 캠페인은 편성표를 직접 제어하지 않으며, 각각 독립적으로 관리된다. **승인/반려 워크플로우 없음** (확정 의사결정).
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 캠페인 등록 | O | O | O (권한 범위 내) | X |
    14→| 캠페인 수정 | O | O | O (권한 범위 내) | X |
    15→| 캠페인 삭제/취소 | O | O | O (권한 범위 내) | X |
    16→| 캠페인 목록 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    17→
    18→> 영업대행사는 소재 도메인만 접근 가능 (확정 의사결정). 캠페인 관리 기능에 접근 불가.
    19→
    20→---
    21→
    22→## 3. 시나리오 목록
    23→
    24→| ID | 시나리오명 | Actor |
    25→|----|----------|-------|
    26→| UC-17 | 캠페인 등록 (3단계 스텝) | 어드민, 매체사, 운영대행사 |
    27→| UC-18 | 캠페인 집행 시작 | 시스템 (자동) |
    28→| UC-19 | 캠페인 완료/취소 | 어드민, 매체사, 운영대행사 / 시스템 |
    29→| UC-20 | 캠페인 목록 조회 및 필터링 | 어드민, 매체사, 운영대행사 |
    30→
    31→---
    32→
    33→## 4. 상세 시나리오
    34→
    35→### UC-17: 캠페인 등록 (3단계 스텝)
    36→
    37→**누가**: 어드민, 매체사 또는 운영대행사
    38→**언제**: 새로운 광고 계약을 CMS에 등록할 때
    39→**전제조건**: 로그인 상태. 대상 매체가 UC-07로 등록 완료
    40→
    41→#### 시나리오
    42→
    43→1. 매체사가 캠페인 관리 > 등록 버튼을 클릭한다
    44→2. 상단에 단계 표시: **1.기본 정보 → 2.매체 및 기간 → 3.예산 및 확인**
    45→
    46→**Step 1: 기본 정보**
    47→3. 캠페인명을 입력한다 (필수)
    48→4. 광고주를 선택한다 (드롭다운 단일 선택, 필수)
    49→   - 옆에 [신규 등록] 버튼 → 광고주 등록 모달 → 등록 완료 시 자동 선택
    50→5. 광고대행사를 입력한다 (텍스트 직접 입력, 선택)
    51→6. 캠페인 유형을 선택한다 (필수, 단일): 직접판매 / 자사광고 / 필러 / 네이버
    52→7. 광고 유형을 선택한다 (단일)
    53→8. [다음] 버튼을 클릭한다
    54→
    55→**Step 2: 매체 및 기간**
    56→9. 대상 매체를 선택한다 (개별 매체 또는 매체 그룹, 복수 선택, 최소 1개 필수)
    57→10. 집행 기간을 설정한다 (시작일·종료일, 필수)
    58→11. [다음] 버튼을 클릭한다
    59→
    60→**Step 3: 예산 및 확인**
    61→12. 과금 모델을 선택한다 (단일): 정액제 / 일단가 / 입력안함
    62→13. 과금 모델 선택 시 집행 금액을 입력한다 ("입력안함" 선택 시 미표시)
    63→14. 전체 입력 내용을 확인한다
    64→15. [등록] 버튼을 클릭한다
    65→16. 시스템이 캠페인을 "초안" 상태로 생성한다
    66→
    67→#### 이런 경우에는
    68→
    69→- **필수 정보 미입력 시 [다음] 클릭**: 버튼 비활성화. 미입력 필드 하이라이트
    70→- **시작일 > 종료일**: "시작일이 종료일보다 앞서야 합니다" 안내
    71→- **시작일이 과거 날짜**: "시작일은 오늘 이후여야 합니다" 안내
    72→- **광고주 신규 등록 모달에서 취소**: 모달 닫힘, 광고주 미선택 상태 유지
    73→- **운영대행사가 권한 범위 밖 매체 선택 시도**: 해당 매체가 선택 목록에 표시되지 않음
    74→- **[이전] 버튼 클릭**: 이전 단계로 이동. 입력 내용 유지
    75→- **등록 중 브라우저 이탈**: 입력 내용 미저장. "작성 중인 내용이 있습니다. 이탈하시겠습니까?" 확인
    76→
    77→#### 결과
    78→
    79→- 캠페인 레코드 생성: 상태 "초안"
    80→- 시작일 도래 시 자동으로 UC-18(집행 시작) 트리거
    81→
    82→---
    83→
    84→### UC-18: 캠페인 집행 시작
    85→
    86→**누가**: 시스템 (자동)
    87→**언제**: 캠페인 시작일이 도래했을 때
    88→**전제조건**: 캠페인이 "초안" 상태. 시작일 = 오늘
    89→
    90→#### 시나리오
    91→
    92→1. 시스템이 매일 정해진 시간에 시작일이 도래한 캠페인을 조회한다
    93→2. 해당 캠페인의 상태를 "초안" → "집행중"으로 변경한다
    94→3. 캠페인 상태 변경이 목록에 반영된다 (별도 알림 이벤트 없음 — 캠페인은 비즈니스 단위, 실제 송출은 편성이 담당)
    95→
    96→#### 이런 경우에는
    97→
    98→- **시작일 도래 시점에 대상 매체가 비활성 상태**: 캠페인은 "집행중"으로 전환되지만, 해당 매체에서는 실제 광고 송출 불가. 알림에 "대상 매체 중 비활성 매체가 있습니다" 경고 포함
    99→- **시작일이 이미 지난 캠페인이 "초안" 상태로 남아 있음**: 시스템이 감지하여 "집행중"으로 자동 전환 (소급 처리)
   100→
   101→#### 결과
   102→
   103→- 캠페인 상태: "초안" → "집행중"
   104→- 알림 발송
   105→
   106→---
   107→
   108→### UC-19: 캠페인 완료/취소
   109→
   110→**누가**: 시스템 (자동 완료) 또는 어드민, 매체사, 운영대행사 (수동 취소)
   111→**언제**: 캠페인 종료일이 도래하거나, 사용자가 캠페인을 취소할 때
   112→**전제조건**: 캠페인이 "초안" 또는 "집행중" 상태
   113→
   114→#### 시나리오 A — 자동 완료
   115→
   116→1. 시스템이 매일 정해진 시간에 종료일이 경과한 캠페인을 조회한다
   117→2. 해당 캠페인의 상태를 "집행중" → "완료"로 변경한다
   118→3. 캠페인 상태 변경이 목록에 반영된다
   119→
   120→#### 시나리오 B — 수동 취소
   121→
   122→1. 어드민, 매체사 또는 운영대행사가 캠페인 상세에서 "취소" 버튼을 클릭한다
   123→2. 취소 사유를 입력한다 (필수)
   124→3. 시스템이 확인 모달을 표시한다: "이 캠페인을 취소하시겠습니까?"
   125→4. 확인 버튼을 누르면 캠페인 상태가 "취소"로 변경된다
   126→
   127→#### 이런 경우에는
   128→
   129→- **집행중 캠페인 취소 시**: "집행 중인 캠페인입니다. 취소하면 즉시 집행이 중단됩니다. 계속하시겠습니까?" 경고
   130→- **완료된 캠페인 취소 시도**: "취소" 버튼이 표시되지 않음 (완료는 최종 상태)
   131→- **이미 취소된 캠페인 재활성화**: 불가. 새 캠페인으로 등록 필요
   132→
   133→#### 결과
   134→
   135→- 자동 완료: 상태 "집행중" → "완료"
   136→- 수동 취소: 상태 "초안"/"집행중" → "취소". 취소 사유 기록
   137→
   138→---
   139→
   140→### UC-20: 캠페인 목록 조회 및 필터링
   141→
   142→**누가**: 어드민, 매체사 또는 운영대행사
   143→**언제**: 등록된 캠페인 현황을 확인할 때
   144→**전제조건**: 로그인 상태
   145→
   146→#### 시나리오
   147→
   148→1. 어드민, 매체사 또는 운영대행사가 캠페인 관리 메뉴를 클릭한다
   149→2. 캠페인 목록이 표시된다 (권한 범위 내)
   150→3. 필터를 적용한다:
   151→   - 상태: 초안 / 집행중 / 완료 / 취소
   152→   - 캠페인 유형: 직접판매 / 자사광고 / 필러 / 네이버
   153→   - 집행 기간: 시작일~종료일 범위
   154→   - 광고주
   155→   - 대상 매체
   156→4. 검색어로 캠페인명을 검색한다
   157→5. 정렬 기준을 변경한다 (등록일, 시작일, 종료일, 캠페인명)
   158→
   159→#### 이런 경우에는
   160→
   161→- **매체사 사용자**: 본인 매체에 연결된 캠페인만 표시
   162→- **운영대행사**: 부여받은 매체에 연결된 캠페인만 표시
   163→- **검색 결과 없음**: "조건에 맞는 캠페인이 없습니다" 안내
   164→- **대량 데이터**: 페이지네이션 적용 (기본 20건)
   165→
   166→#### 결과
   167→
   168→- 권한 범위 내 캠페인 목록 표시
   169→- 필터/검색/정렬 적용
   170→
   171→---
   172→
   173→## 5. 도메인 규칙
   174→
   175→### 5.1 캠페인 상태 FSM
   176→
   177→```
   178→[초안] ──(시작일 도래)──→ [집행중] ──(종료일 경과)──→ [완료]
   179→  │                         │
   180→  └──(수동 취소)──→ [취소] ←──(수동 취소)──┘
   181→```
   182→
   183→**상태**:
   184→| 상태 | 설명 | 허용 동작 |
   185→|------|------|----------|
   186→| 초안 | 등록 완료, 집행 전 | 수정, 취소 |
   187→| 집행중 | 시작일 경과, 광고 운영 중 | 수정(일부), 취소 |
   188→| 완료 | 종료일 경과, 최종 상태 | 조회만 |
   189→| 취소 | 사용자가 취소, 최종 상태 | 조회만 |
   190→
   191→**전이**:
   192→| From → To | 트리거 | 가드 | 효과 |
   193→|-----------|--------|------|------|
   194→| 초안 → 집행중 | 시작일 도래 (시스템 자동) | — | 상태 변경. 대상 매체 비활성 시 경고 포함 |
   195→| 집행중 → 완료 | 종료일 경과 (시스템 자동) | — | 상태 변경 |
   196→| 초안 → 취소 | 사용자가 취소 | 취소 사유 입력 | 상태 변경, 사유 기록 |
   197→| 집행중 → 취소 | 사용자가 취소 | 취소 사유 입력 | 즉시 집행 중단, 사유 기록 |
   198→
   199→**불변식**:
   200→- INV-14: 완료/취소 상태의 캠페인은 수정 불가
   201→- INV-15: 캠페인은 최소 1개의 대상 매체를 가져야 함
   202→- INV-16: 캠페인 시작일 < 종료일
   203→- INV-17: 승인/반려 워크플로우 없음 (등록 즉시 초안, 시작일에 자동 집행)
   204→
   205→### 5.2 비즈니스 규칙
   206→
   207→- BR-15: 캠페인은 편성표를 직접 제어하지 않음. 각각 독립 관리
   208→- BR-16: 캠페인 유형: 직접판매 / 자사광고 / 필러 / 네이버
   209→- BR-17: 과금 모델: 정액제 / 일단가 / 입력안함
   210→- BR-18: 영업대행사는 캠페인 관리 기능에 접근 불가
   211→
   212→---
   213→
   214→## 6. 미결 사항
   215→
   216→- 집행중 캠페인의 수정 가능 범위 미정의 (기간 연장? 매체 추가/제거? 금액 변경?)
   217→- 캠페인과 편성표의 연관 관계 표시 방법 미정의 (참조만? 연결 기능?)
   218→- 광고주 엔티티의 상세 속성 및 관리 시나리오 미정의 (현재: 캠페인 등록 시 모달로 간략 등록만)
   219→- 캠페인 복제(기존 캠페인 기반 신규 생성) 기능 필요 여부 미정의
   220→- 시작일 도래 시 자동 전환의 실행 시점 (매일 00:00? 특정 시간?) 미정의
   221→- 취소된 캠페인의 실적 데이터 보존 방안 미정의
   222→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/05-scheduling-management.md"
}

     1→# 편성 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→광고 소재를 재생목록으로 구성하고, 편성표를 통해 매체에 배정하여 송출한다. 기본은 루프 기반 반복 재생이며, 특정 구좌를 네이버 Ad Server와 연동하여 프로그래매틱 동작도 가능하다.
     6→
     7→**핵심 흐름**: 소재 선택 → 재생목록 구성 → 편성표 생성(매체 배정 + 기간) → 매체에서 반복 재생
     8→
     9→---
    10→
    11→## 2. 페르소나 & 권한
    12→
    13→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    14→|------|:------:|:------:|:----------:|:----------:|
    15→| 재생목록 생성/수정/삭제 | O | O | O (권한 범위 내) | X |
    16→| 편성표 생성/수정/삭제 | O | O | O (권한 범위 내) | X |
    17→| 네이버 연동 구좌 설정 | O | O | O (권한 범위 내) | X |
    18→| 편성 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    19→
    20→> 영업대행사는 편성 관련 기능 접근 불가 (확정 의사결정).
    21→
    22→---
    23→
    24→## 3. 시나리오 목록
    25→
    26→| ID | 시나리오명 | Actor |
    27→|----|----------|-------|
    28→| UC-21 | 재생목록 생성 | 매체사, 운영대행사 |
    29→| UC-22 | 편성표 생성 | 매체사, 운영대행사 |
    30→| UC-23 | 네이버 Ad Server 연동 구좌 설정 | 어드민, 매체사, 운영대행사 |
    31→| UC-24 | 편성 충돌 감지 및 해소 | 어드민, 매체사, 운영대행사 |
    32→| UC-25 | 편성표 적용/종료 | 시스템 (자동) / 매체사, 운영대행사 |
    33→
    34→---
    35→
    36→## 4. 상세 시나리오
    37→
    38→### UC-21: 재생목록 생성
    39→
    40→**누가**: 매체사 또는 운영대행사
    41→**언제**: 매체에 송출할 소재들의 재생 순서를 구성할 때
    42→**전제조건**: 로그인 상태. "검수완료" 상태의 소재가 1개 이상 존재 (UC-14 완료)
    43→
    44→#### 시나리오
    45→
    46→1. 매체사가 편성 관리 > 재생목록 > 새 목록 버튼을 클릭한다
    47→2. 재생목록명을 입력한다 (필수)
    48→3. 소재를 추가한다:
    49→   - 소재 목록에서 "검수완료" 상태의 소재만 표시
    50→   - 드래그&드롭으로 순서 배치
    51→   - 각 소재가 하나의 구좌(Slot)를 차지
    52→4. 구좌 순서를 조정한다 (드래그&드롭)
    53→5. 저장 버튼을 클릭한다
    54→
    55→#### 이런 경우에는
    56→
    57→- **검수완료 소재가 0건**: "사용 가능한 소재가 없습니다. 먼저 소재를 업로드하고 검수를 완료해주세요" 안내
    58→- **동일 소재를 복수 구좌에 배치**: 허용. 같은 소재가 여러 번 반복 재생 가능
    59→- **재생목록에 소재 0건인 상태로 저장 시도**: "최소 1개의 소재를 추가해주세요" 안내
    60→- **재생목록에 포함된 소재가 이후 삭제됨**: 해당 구좌가 "삭제됨" 상태로 전환. 빨간 점선 테두리 + "소재 삭제됨 — 교체 필요" 라벨 표시. "교체" 버튼으로 즉시 대체 가능. 재생 시 해당 구좌 스킵. 편성 관리자에게 알림 발송
    61→
    62→#### 결과
    63→
    64→- 재생목록 레코드 생성: 소재 배치 순서(구좌) 포함
    65→- 이 재생목록은 UC-22(편성표)에서 매체에 배정 가능
    66→
    67→---
    68→
    69→### UC-22: 편성표 생성
    70→
    71→**누가**: 매체사 또는 운영대행사
    72→**언제**: 재생목록을 특정 매체에 배정하고 재생 기간을 설정할 때
    73→**전제조건**: UC-21로 재생목록 1개 이상 생성. 대상 매체가 UC-08로 디바이스 연동 완료 (연동됨(활성) 상태)
    74→
    75→#### 시나리오
    76→
    77→1. 매체사가 편성 관리 > 편성표 > 새 편성표 버튼을 클릭한다
    78→2. 편성표명을 입력한다 (필수)
    79→3. 재생목록을 선택한다 (필수)
    80→4. 대상 매체 또는 매체 그룹을 선택한다 (복수 선택 가능, 최소 1개 필수)
    81→5. 적용 기간을 설정한다 (시작일·종료일, 필수)
    82→6. 우선순위를 설정한다 (동일 매체에 복수 편성표가 적용될 경우 우선순위로 결정)
    83→7. 저장 버튼을 클릭한다
    84→8. 시스템이 편성 충돌 여부를 검사한다 (UC-24 연계)
    85→9. 충돌 없으면 편성표가 "예약됨" 상태로 생성된다
    86→
    87→#### 이런 경우에는
    88→
    89→- **비활성 매체 선택 시도**: "비활성 매체에는 편성표를 적용할 수 없습니다" 안내. 선택 불가
    90→- **미연동 매체 선택 시도**: "디바이스 미연동 매체입니다" 안내. 선택 불가
    91→- **시작일 > 종료일**: "시작일이 종료일보다 앞서야 합니다" 안내
    92→- **동일 매체+동일 기간에 편성 충돌**: UC-24로 이동하여 충돌 해소
    93→- **운영대행사가 권한 범위 밖 매체 선택**: 해당 매체가 목록에 표시되지 않음
    94→
    95→#### 결과
    96→
    97→- 편성표 레코드 생성: 상태 "예약됨"
    98→- 시작일 도래 시 자동 적용 (UC-25)
    99→
   100→---
   101→
   102→### UC-23: 네이버 Ad Server 연동 구좌 설정
   103→
   104→**누가**: 어드민, 매체사 또는 운영대행사
   105→**언제**: 재생목록 내 특정 구좌를 네이버 Ad Server와 연동하여 프로그래매틱 광고를 송출할 때
   106→**전제조건**: UC-21로 재생목록 생성 완료. 해당 매체가 UC-09로 네이버 SSP 연동 완료
   107→
   108→#### 시나리오
   109→
   110→1. 어드민, 매체사 또는 운영대행사가 재생목록 상세로 진입한다
   111→2. 특정 구좌를 선택한다
   112→3. "네이버 연동" 토글을 활성화한다
   113→4. 해당 구좌에 배치된 소재가 제거되고, "네이버 Ad Server" 라벨로 표시된다
   114→5. 저장 버튼을 클릭한다
   115→6. 이후 재생 시 해당 구좌는 네이버 Ad Server가 실시간으로 광고를 결정한다
   116→
   117→#### 이런 경우에는
   118→
   119→- **매체에 네이버 SSP 연동이 안 된 상태**: "네이버 연동" 토글 비활성화. "먼저 매체의 SSP 연동을 설정해주세요" 툴팁
   120→- **모든 구좌를 네이버 연동으로 설정**: 허용. 전체 프로그래매틱 운영 가능
   121→- **네이버 연동 구좌를 다시 자체 소재로 전환**: 토글 해제 → 소재 선택 필요
   122→
   123→#### 결과
   124→
   125→- 해당 구좌가 네이버 Ad Server 연동 모드로 전환
   126→- 나머지 구좌는 기존 루프 방식 유지
   127→
   128→---
   129→
   130→### UC-24: 편성 충돌 감지 및 해소
   131→
   132→**누가**: 어드민, 매체사 또는 운영대행사
   133→**언제**: 편성표 생성/수정 시 동일 매체에 기간이 겹치는 편성이 감지될 때
   134→**전제조건**: UC-22에서 편성표 저장 시 충돌 감지
   135→
   136→#### 시나리오
   137→
   138→1. 시스템이 편성표 저장 시 충돌을 감지한다:
   139→   - 동일 매체 + 겹치는 기간 + 동일/낮은 우선순위
   140→2. 충돌 상세를 표시한다:
   141→   - 충돌 대상 편성표명, 기간, 우선순위
   142→3. 해소 옵션을 제시한다:
   143→   - **A)** 현재 편성표의 우선순위를 올려서 기존 편성표를 대체
   144→   - **B)** 기존 편성표의 기간을 조정
   145→   - **C)** 현재 편성표 저장을 취소
   146→4. 사용자가 옵션을 선택하여 충돌을 해소한다
   147→
   148→#### 이런 경우에는
   149→
   150→- **3개 이상 편성표가 동시 충돌**: 모든 충돌 목록을 표시. 하나씩 순차 해소
   151→- **우선순위가 동일한 편성표끼리 충돌**: 나중에 생성된 편성표가 우선 (기본 규칙). 사용자가 변경 가능
   152→
   153→#### 결과
   154→
   155→- 충돌 해소 후 편성표 저장 완료
   156→- 편성 관리자에게 "편성 충돌" 알림 발송 (UC-26 연계)
   157→
   158→---
   159→
   160→### UC-25: 편성표 적용/종료
   161→
   162→**누가**: 시스템 (자동) 또는 매체사, 운영대행사 (수동 종료)
   163→**언제**: 편성표 시작일이 도래하거나, 종료일이 경과하거나, 사용자가 수동 종료할 때
   164→**전제조건**: UC-22로 편성표 생성 완료 ("예약됨" 상태)
   165→
   166→#### 시나리오 A — 자동 적용
   167→
   168→1. 시스템이 시작일이 도래한 편성표를 감지한다
   169→2. 편성표 상태를 "예약됨" → "적용중"으로 변경한다
   170→3. 해당 매체의 플레이어에 재생목록을 전송한다
   171→4. 플레이어가 재생목록의 구좌를 순서대로 무한 반복 재생한다
   172→5. 편성 관리자에게 "편성 시작" 알림 발송
   173→
   174→#### 시나리오 B — 자동 종료
   175→
   176→1. 시스템이 종료일이 경과한 편성표를 감지한다
   177→2. 편성표 상태를 "적용중" → "종료"로 변경한다
   178→3. 편성 관리자에게 "편성 종료" 알림 발송
   179→
   180→#### 시나리오 C — 수동 종료
   181→
   182→1. 매체사 또는 운영대행사가 편성 관리 > 편성표 상세에서 "종료" 버튼을 클릭한다
   183→2. 시스템이 확인 모달: "이 편성표를 즉시 종료하시겠습니까?"
   184→3. 확인 시 편성표 상태 "적용중" → "종료"
   185→
   186→#### 이런 경우에는
   187→
   188→- **적용 시작 시 플레이어 오프라인**: 편성표는 "적용중"으로 전환되지만 실제 재생 불가. 매체 오프라인 알림 별도 발송 (UC-11 연계)
   189→- **적용중 편성표의 재생목록을 수정**: 수정 후 저장 시 플레이어에 업데이트된 재생목록 즉시 전송
   190→- **종료 후 재적용**: 불가. 새 편성표 생성 필요
   191→
   192→#### 결과
   193→
   194→- 적용: "예약됨" → "적용중". 매체에서 재생 시작
   195→- 종료: "적용중" → "종료". 매체에서 재생 중단
   196→
   197→---
   198→
   199→## 5. 도메인 규칙
   200→
   201→### 5.1 편성표 상태 FSM
   202→
   203→```
   204→[예약됨] ──(시작일 도래)──→ [적용중] ──(종료일 경과 또는 수동 종료)──→ [종료]
   205→```
   206→
   207→**상태**:
   208→| 상태 | 설명 | 허용 동작 |
   209→|------|------|----------|
   210→| 예약됨 | 편성표 생성, 적용 전 | 수정, 삭제 |
   211→| 적용중 | 매체에서 재생 중 | 재생목록 수정, 수동 종료 |
   212→| 종료 | 재생 완료/중단 | 조회만 |
   213→
   214→**전이**:
   215→| From → To | 트리거 | 가드 | 효과 |
   216→|-----------|--------|------|------|
   217→| 예약됨 → 적용중 | 시작일 도래 | 대상 매체 활성 상태 | 플레이어에 재생목록 전송, 알림 |
   218→| 적용중 → 종료 | 종료일 경과 (자동) | — | 재생 중단, 알림 |
   219→| 적용중 → 종료 | 사용자가 수동 종료 | 권한 보유 | 즉시 재생 중단, 알림 |
   220→
   221→**불변식**:
   222→- INV-18: 편성표는 최소 1개의 재생목록을 가져야 함
   223→- INV-19: 편성표는 최소 1개의 대상 매체를 가져야 함
   224→- INV-20: 비활성 매체에 편성표 적용 불가
   225→- INV-21: 재생목록의 구좌는 1개 이상이어야 함 (빈 재생목록 불가)
   226→
   227→### 5.2 재생 모델
   228→
   229→- **기본**: 루프 기반 — 재생목록의 구좌를 순서대로 무한 반복
   230→- **확장**: 네이버 연동 구좌는 Ad Server가 실시간 결정
   231→- 나머지 구좌는 기존 루프 유지
   232→- 별도 LoopPolicy 엔티티 없음
   233→
   234→### 5.3 비즈니스 규칙
   235→
   236→- BR-19: 구좌의 재생 시간 = 배정된 소재의 재생 시간 (구좌 자체 시간 설정 없음)
   237→- BR-20: 동일 매체에 복수 편성표 적용 가능. 우선순위로 결정
   238→- BR-21: 편성 충돌 = 동일 매체 + 겹치는 기간 + 우선순위 미결정
   239→- BR-22: 네이버 연동 구좌는 SSP 연동 완료 매체에만 설정 가능
   240→
   241→---
   242→
   243→## 6. 미결 사항
   244→
   245→- 편성표 우선순위의 상세 동작 미정의 (우선순위 높은 편성표만 재생? 혼합 재생?)
   246→- 재생목록 수정 시 적용중 편성표에 즉시 반영되는 메커니즘 상세 미정의
   247→- 종료된 편성표 이후 매체에 표시할 기본 콘텐츠(대기 화면) 미정의
   248→- 편성표 없는 매체의 기본 동작 미정의 (블랙스크린? 기본 이미지?)
   249→- 재생목록 삭제 시 해당 재생목록을 참조하는 편성표 처리 미정의
   250→- 네이버 Ad Server 응답 지연/실패 시 해당 구좌의 fallback 동작 미정의
   251→- 플레이어에 재생목록 전송 실패 시 재시도 정책 미정의
   252→- 네이버 연동 구좌와 자체 구좌 혼합 시 전체 루프 시간 계산 방식 미정의 (네이버 구좌 시간은 가변)
   253→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/02-media-management.md"
}

     1→# 매체 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS에서 매체사(회사)와 매체(디스플레이 장비)를 등록·설정·모니터링한다. 매체사 등록은 어드민 전용이며, 매체 등록은 매체사와 운영대행사도 가능하다. 매체-디바이스 연동, SSP 연동, 유동인구 데이터 연결까지 포함한다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 매체사 등록/삭제 | O | X | X | X |
    14→| 매체사 정보 수정 | O | O (변경 불가 필드 제외) | X | X |
    15→| 매체 등록 | O (지원) | O (기본) | O (권한 범위 내) | X |
    16→| 매체 정보 수정 | O | O | O (권한 범위 내) | X |
    17→| 매체 활성/비활성 | O | O | O (권한 범위 내) | X |
    18→| 플레이어 연결 시점 수정 | O | X | X | X |
    19→| 유동인구 데이터 연결 | O | X | X | X |
    20→| SSP 연동 설정 | O | O | O | X |
    21→
    22→---
    23→
    24→## 3. 시나리오 목록
    25→
    26→| ID | 시나리오명 | Actor |
    27→|----|----------|-------|
    28→| UC-06 | 어드민이 매체사 등록 | 어드민 |
    29→| UC-07 | 매체사가 매체 등록 | 매체사, 운영대행사 |
    30→| UC-08 | 매체-디바이스 연동 | 매체사, 운영대행사 |
    31→| UC-09 | SSP 연동 설정 | 어드민, 매체사, 운영대행사 |
    32→| UC-10 | 유동인구 데이터 연결 | 어드민 |
    33→| UC-11 | 매체 헬스체크 모니터링 | 어드민, 매체사, 운영대행사 |
    34→| UC-12 | 매체 활성/비활성 전환 | 어드민, 매체사, 운영대행사 |
    35→
    36→---
    37→
    38→## 4. 상세 시나리오
    39→
    40→### UC-06: 어드민이 매체사 등록
    41→
    42→**누가**: 어드민
    43→**언제**: 신규 매체사를 CMS에 온보딩할 때
    44→**전제조건**: 어드민이 로그인된 상태
    45→
    46→#### 시나리오
    47→
    48→1. 어드민이 매체사 관리 > 등록 버튼을 클릭한다
    49→2. 필수 정보를 입력한다:
    50→   - 사업자등록번호
    51→   - 회사명
    52→   - 대표자명
    53→   - 담당자 연락처 (이메일, 전화번호)
    54→3. 선택 정보를 입력한다:
    55→   - 회사 주소
    56→   - 비고 (메모)
    57→4. 등록 버튼을 클릭한다
    58→5. 시스템이 매체사 식별 ID를 자동 발급한다
    59→6. 매체사 관리 목록에 신규 매체사가 표시된다
    60→
    61→#### 이런 경우에는
    62→
    63→- **사업자등록번호 중복**: "이미 등록된 매체사입니다" 안내 → 기존 매체사 상세로 이동 링크 표시
    64→- **필수 항목 누락**: 해당 필드 하이라이트 + 안내 메시지. 등록 버튼 비활성화
    65→- **사업자등록번호 형식 오류**: "올바른 사업자등록번호 형식(000-00-00000)을 입력해주세요" 안내
    66→
    67→#### 결과
    68→
    69→- 매체사 레코드 생성: 상태 "등록됨", 매체사 식별 ID 자동 발급
    70→- 이후 UC-01(초대)을 통해 매체사 담당자 계정 생성 가능
    71→
    72→---
    73→
    74→### UC-07: 매체사가 매체 등록
    75→
    76→**누가**: 매체사 또는 운영대행사
    77→**언제**: 새로운 디스플레이 장비를 CMS에 등록할 때
    78→**전제조건**: 매체사 사용자가 로그인된 상태. 소속 매체사가 UC-06으로 등록 완료
    79→
    80→#### 시나리오
    81→
    82→1. 매체사가 매체 관리 > 등록 버튼을 클릭한다
    83→2. **기본 정보**를 입력한다:
    84→   - 매체명 (필수)
    85→   - 매체 종류: 고정형 / 이동형 (필수)
    86→   - 설치 주소 (필수. 이동형의 경우 거점 주소 + 도움말 표시)
    87→   - 설치 형태: 가로형 / 세로형 (필수)
    88→3. **디스플레이 설정**을 입력한다:
    89→   - 디스플레이 유형: LCD / LED / 기타(직접입력) (필수)
    90→   - 화면 사이즈 (필수)
    91→   - 해상도 (필수)
    92→   - 허용 해상도 (필수)
    93→   - LED인 경우: 비정형 사이즈 여부, pitch 값 (네이버 RFP 필수 항목)
    94→4. **운영 시간**을 설정한다:
    95→   - 요일: 매일 / 평일 / 주말 / 직접 선택
    96→   - 시간: 24시간 / 직접 입력 (시작~종료)
    97→   - 목록 표시 형식: `xx:xx ~ xx:xx`
    98→5. **비고**를 입력한다 (선택)
    99→6. 등록 버튼을 클릭한다
   100→7. 시스템이 디바이스 ID를 자동 발급한다
   101→8. 시스템이 플레이어 연결 시점을 자동 생성한다 (타 매체와 겹치지 않게 분산)
   102→
   103→#### 이런 경우에는
   104→
   105→- **운영대행사가 권한 범위 밖 매체 등록 시도**: 등록 버튼이 표시되지 않음 (권한 필터링)
   106→- **LED 선택 시 pitch 값 미입력**: "LED 매체는 pitch 값을 필수로 입력해야 합니다" 안내
   107→- **운영 시간 시작 > 종료**: "시작 시간이 종료 시간보다 앞서야 합니다" 안내
   108→- **이동형 매체 선택 시**: 설치 주소 라벨이 "거점 주소"로 변경, 도움말 툴팁 표시
   109→- **매체명 중복 (동일 매체사 내)**: "동일한 이름의 매체가 이미 존재합니다" 안내
   110→
   111→#### 결과
   112→
   113→- 매체 레코드 생성: 상태 "미연동" (디바이스 연동 전)
   114→- 디바이스 ID 자동 발급
   115→- 플레이어 연결 시점 자동 생성 (수정은 어드민만 가능)
   116→
   117→---
   118→
   119→### UC-08: 매체-디바이스 연동
   120→
   121→**누가**: 매체사 또는 운영대행사
   122→**언제**: 현장에 플레이어를 설치한 후, CMS 매체와 물리 장비를 연결할 때
   123→**전제조건**: UC-07로 매체 등록 완료 (디바이스 ID 발급됨). 현장에 플레이어 소프트웨어 설치 완료
   124→
   125→#### 시나리오
   126→
   127→1. 매체사가 매체 상세 > 디바이스 연동 탭을 클릭한다
   128→2. 현장 플레이어에 표시된 디바이스 ID를 입력한다
   129→3. 연동 버튼을 클릭한다
   130→4. 시스템이 플레이어와 통신을 시도한다
   131→5. 연동 성공 시 매체 상태가 "미연동" → "연동됨"으로 변경된다
   132→6. **영상 출력 조정** 단계로 진입한다:
   133→   - 플레이어에서 디바이스 영상 사이즈와 위치를 방향키로 육안 조정
   134→   - 조정값이 실시간으로 CMS에 동기화
   135→7. 조정 완료 후 "잠금" 버튼을 클릭한다
   136→8. 크기/위치가 고정되어 오조작을 방지한다
   137→
   138→#### 이런 경우에는
   139→
   140→- **잘못된 디바이스 ID 입력**: "유효하지 않은 디바이스 ID입니다" 안내
   141→- **이미 다른 매체에 연동된 디바이스 ID**: "이 디바이스는 다른 매체(매체명)에 연동되어 있습니다" 안내. 연동 차단
   142→- **플레이어 통신 실패**: "플레이어와 연결할 수 없습니다. 네트워크 상태를 확인해주세요" 안내. 재시도 버튼 표시
   143→- **잠금 해제 필요**: CMS 또는 플레이어에서 "잠금 해제" 클릭 → 재조정 가능
   144→- **잠금 상태에서 사이즈/위치 변경 시도**: 변경 불가. "잠금을 해제해주세요" 안내
   145→
   146→#### 결과
   147→
   148→- 매체 상태: "미연동" → "연동됨"
   149→- 영상 출력 사이즈/위치 값 CMS 저장
   150→- 잠금 설정 시 크기/위치 고정
   151→
   152→---
   153→
   154→### UC-09: SSP 연동 설정
   155→
   156→**누가**: 어드민, 매체사 또는 운영대행사
   157→**언제**: 매체를 외부 SSP(Supply-Side Platform)와 연동할 때
   158→**전제조건**: UC-07로 매체 등록 완료. SSP 연동은 필수가 아닌 선택 항목
   159→
   160→#### 시나리오
   161→
   162→1. 어드민, 매체사 또는 운영대행사가 매체 상세 > SSP 연동 탭을 클릭한다
   163→2. SSP를 선택한다 (1차: 네이버, 이후 확장 예정)
   164→3. SSP별 연동 정보를 입력한다:
   165→   - 네이버: 매체 매핑 ID, 보장 인벤토리, 최소 보장단가
   166→4. 연동 테스트 버튼을 클릭한다
   167→5. 시스템이 SSP와 통신 테스트를 수행한다
   168→6. 테스트 성공 시 연동 상태가 "연동 완료"로 표시된다
   169→7. 저장 버튼을 클릭한다
   170→
   171→#### 이런 경우에는
   172→
   173→- **SSP 통신 테스트 실패**: "SSP 연동 테스트에 실패했습니다. 입력 정보를 확인해주세요" 안내. 저장은 가능하되 연동 상태 "미연동"
   174→- **보장 인벤토리/단가 미입력**: 경고 표시. 저장은 가능하나 네이버 연동 시 필수
   175→- **이미 연동된 SSP를 재설정**: 기존 설정 표시 → 수정 → 저장 시 덮어쓰기
   176→
   177→#### 결과
   178→
   179→- SSP 연동 정보 저장
   180→- 연동 테스트 성공 시: SSP 연동 상태 "연동 완료"
   181→- 네이버 SSP 연동 시: 편성 관리에서 네이버 연동 구좌 사용 가능
   182→
   183→---
   184→
   185→### UC-10: 유동인구 데이터 연결
   186→
   187→**누가**: 어드민
   188→**언제**: 매체 위치의 유동인구 데이터를 연결하여 광고 가치를 산정할 때
   189→**전제조건**: UC-07로 매체 등록 완료. SKP FTP에서 유동인구 데이터 수신 가능 상태. 필수가 아닌 선택 항목 (네이버 RFP 관련 항목)
   190→
   191→#### 시나리오
   192→
   193→1. 어드민이 매체 상세 > 유동인구 탭을 클릭한다
   194→2. 데이터 소스를 확인한다: SKP FTP → 포도 가공 → CMS 업로드 경로
   195→3. 매체의 설치 주소와 유동인구 데이터 지점을 매핑한다
   196→4. 연결 버튼을 클릭한다
   197→5. 시스템이 해당 지점의 유동인구 데이터를 주기적으로 수신하기 시작한다
   198→
   199→#### 이런 경우에는
   200→
   201→- **설치 주소와 매핑 가능한 유동인구 지점이 없음**: "해당 위치의 유동인구 데이터가 없습니다" 안내
   202→- **데이터 수신 오류**: "유동인구 데이터 수신에 실패했습니다" 안내 + 오류 상세 로그
   203→- **이동형 매체**: 거점 주소 기준으로 매핑. "이동형 매체는 거점 주소 기준으로 연결됩니다" 안내
   204→
   205→#### 결과
   206→
   207→- 매체에 유동인구 데이터 연결
   208→- 주기적 데이터 수신 시작
   209→- 대시보드/리포트에서 유동인구 데이터 조회 가능
   210→
   211→---
   212→
   213→### UC-11: 매체 헬스체크 모니터링
   214→
   215→**누가**: 어드민, 매체사 또는 운영대행사
   216→**언제**: 매체의 운영 상태를 확인하거나, 이상 징후 알림을 수신했을 때
   217→**전제조건**: UC-08로 디바이스 연동 완료. 매체 상태 "연동됨"
   218→
   219→#### 시나리오
   220→
   221→1. 어드민, 매체사 또는 운영대행사가 매체 관리 > 목록에서 매체를 선택한다
   222→2. 매체 상세 > 모니터링 탭을 클릭한다
   223→3. 현재 상태가 표시된다:
   224→   - 연결 상태: 온라인 / 오프라인
   225→   - CPU 온도
   226→   - GPU 온도
   227→   - 최근 통신 시점
   228→   - 플레이어 리프레시 상태
   229→4. 이상 징후 발생 시 자동 알림이 발송된다 (UC-26 연계)
   230→
   231→#### 이런 경우에는
   232→
   233→- **매체 오프라인 감지**: 알림 발송 (인앱 + 브라우저 푸시 + Slack). 목록에서 상태 아이콘 변경
   234→- **CPU/GPU 온도 임계치 초과**: 알림 발송 (인앱 + Slack). "매체 이상 감지" 이벤트
   235→- **오프라인 매체가 복구됨**: "매체 복구" 알림 발송 (인앱)
   236→- **플레이어 리프레시 실패**: 재구동 상태 및 오류 로그 표시
   237→
   238→#### 결과
   239→
   240→- 매체 상태 실시간 표시
   241→- 이상 징후 시 알림 이벤트 발생 (알림 관리 도메인 연계)
   242→
   243→---
   244→
   245→### UC-12: 매체 활성/비활성 전환
   246→
   247→**누가**: 어드민, 매체사 또는 운영대행사
   248→**언제**: 매체 운영을 일시 중지하거나 재개할 때
   249→**전제조건**: UC-07로 매체 등록 완료
   250→
   251→#### 시나리오
   252→
   253→1. 어드민, 매체사 또는 운영대행사가 매체 관리 > 목록에서 대상 매체를 선택한다
   254→2. 매체 상세에서 "비활성화" 버튼을 클릭한다
   255→3. 시스템이 확인 모달을 표시한다: "이 매체를 비활성화하시겠습니까? 진행 중인 편성이 중단됩니다."
   256→4. 확인 버튼을 누르면 매체 상태가 "비활성"으로 변경된다
   257→
   258→#### 이런 경우에는
   259→
   260→- **진행 중인 편성표가 있는 매체 비활성화**: "이 매체에 진행 중인 편성표가 N건 있습니다. 비활성화하면 모두 중단됩니다. 계속하시겠습니까?" 경고
   261→- **진행 중인 캠페인이 연결된 매체 비활성화**: "이 매체에 집행 중인 캠페인이 N건 있습니다." 추가 경고
   262→- **비활성 매체를 다시 활성화**: "활성화" 버튼 클릭 → 즉시 활성화. 기존 편성표는 자동 복구되지 않음 (재편성 필요)
   263→- **운영대행사가 권한 범위 밖 매체 전환 시도**: 버튼이 표시되지 않음
   264→
   265→#### 결과
   266→
   267→- 매체 상태 변경: "활성" ↔ "비활성"
   268→- 비활성 시: 해당 매체의 모든 편성 중단, 광고 송출 중지
   269→- 활성화 시: 매체만 활성화. 편성은 별도 재설정 필요
   270→
   271→---
   272→
   273→## 5. 도메인 규칙
   274→
   275→### 5.1 매체사 상태 FSM
   276→
   277→```
   278→[등록됨] ──(삭제)──→ [삭제됨]
   279→```
   280→
   281→매체사는 별도 활성/비활성 상태 없음. 등록 후 삭제만 가능 (어드민 전용).
   282→
   283→**불변식**:
   284→- INV-05: 매체사 삭제 시 소속 매체가 0건이어야 함 (매체가 존재하면 삭제 불가)
   285→- INV-06: 매체사 식별 ID는 시스템 발급, 사용자 변경 불가
   286→
   287→### 5.2 매체 상태 FSM
   288→
   289→```
   290→[미연동] ──(디바이스 연동 성공)──→ [연동됨(활성)]
   291→                                      │        ↑
   292→                                  (비활성화)  (활성화)
   293→                                      ↓        │
   294→                                  [연동됨(비활성)] ─┘
   295→```
   296→
   297→**상태**:
   298→| 상태 | 설명 | 허용 동작 |
   299→|------|------|----------|
   300→| 미연동 | 매체 등록 완료, 디바이스 미연결 | 정보 수정, 디바이스 연동, SSP 설정 |
   301→| 연동됨(활성) | 디바이스 연결, 광고 송출 가능 | 전체 기능 사용, 편성 가능 |
   302→| 연동됨(비활성) | 운영 일시 중지 | 정보 조회, 활성화 |
   303→
   304→**전이**:
   305→| From → To | 트리거 | 가드 | 효과 |
   306→|-----------|--------|------|------|
   307→| 미연동 → 연동됨(활성) | 디바이스 ID 입력 + 통신 성공 | 플레이어 설치 완료 | 디바이스 연동, 헬스체크 시작 |
   308→| 연동됨(활성) → 연동됨(비활성) | 어드민/매체사/운영대행사가 비활성화 | 권한 보유 | 편성 중단, 송출 중지 |
   309→| 연동됨(비활성) → 연동됨(활성) | 어드민/매체사/운영대행사가 활성화 | 권한 보유 | 매체만 활성화. 편성 자동 복구 안 됨 |
   310→
   311→**불변식**:
   312→- INV-07: 디바이스 ID는 시스템 전체에서 고유. 하나의 매체에만 연동 가능
   313→- INV-08: 플레이어 연결 시점은 타 매체와 겹치지 않음 (시스템 자동 분산)
   314→- INV-09: 플레이어 연결 시점 수정은 어드민만 가능
   315→- INV-10: 비활성 매체에는 새 편성표를 적용할 수 없음
   316→
   317→### 5.3 비즈니스 규칙
   318→
   319→- BR-06: 매체 등록 시 디바이스 ID 자동 발급
   320→- BR-07: 플레이어 연결 시점은 등록 시 자동 생성, 타 매체와 분산 배치
   321→- BR-08: SSP 연동은 선택 사항. 1차 네이버, 이후 확장
   322→- BR-09: 유동인구 데이터 연결은 어드민 전용, 선택 사항
   323→- BR-10: 매체 비활성화 시 편성 자동 중단. 활성화 시 편성 자동 복구 안 됨 (재편성 필요)
   324→
   325→---
   326→
   327→## 6. 미결 사항
   328→
   329→- 매체사 삭제 시 소속 사용자(매체사/운영대행사/영업대행사) 처리 방안 미정의
   330→- 매체 삭제 기능 존재 여부 미정의 (현재: 비활성화만 정의)
   331→- 이동형 매체의 거점 주소 변경 시 유동인구 데이터 재매핑 자동화 여부
   332→- 플레이어 리프레시 설정의 상세 옵션 (재구동 시간, 리프레시 간격 등) 미정의
   333→- 하나의 매체에 복수 디스플레이(멀티스크린) 구성 가능 여부 미정의
   334→- 매체 그룹 개념의 상세 정의 (그룹 생성/수정/삭제, 그룹 단위 편성 적용 등) 미정의
   335→- 헬스체크 임계치 설정 (CPU/GPU 온도 기준값) 미정의
   336→- SSP 연동 테스트 실패 시 재시도 정책 미정의
   337→- 삭제된 매체사의 사업자등록번호로 재등록 가능 여부 미정의
   338→- 등록 후 매체의 디스플레이 유형(LCD↔LED) 변경 가능 여부 미정의
   339→- 디바이스 연동 해제 및 교체(다른 디바이스로 재연동) 시나리오 미정의
   340→- 플레이어 연결 시점 분산 풀의 크기 한계 (매체 수 증가 시) 미정의
   341→- 대량 매체 동시 오프라인 시 알림 집계/그룹핑 정책 미정의 (알림 관리 도메인 교차)
   342→- SSP 연동 버전 관리 (네이버 측 스펙 변경 대응) 미정의
   343→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/03-material-management.md"
}

     1→# 소재 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→광고 소재(이미지/영상)를 업로드하고, 자동/수동 검수를 거쳐 편성에 사용할 수 있도록 관리한다. 소재는 편성의 최소 재생 단위이다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 소재 업로드 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    14→| 소재 정보 수정 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    15→| 소재 삭제 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    16→| 소재 목록 조회 | O (전체) | O (본인 매체사) | O (부여받은 매체) | O (권한에 따라: 전체 또는 본인 소속) |
    17→| 수동 검수 확인 | O | O | X | X |
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-13 | 소재 업로드 | 매체사, 운영대행사, 영업대행사 |
    26→| UC-14 | 소재 자동 검수 | 시스템 |
    27→| UC-15 | 소재 수동 검수 확인 | 어드민, 매체사 |
    28→| UC-16 | 소재 상태 관리 (교체/삭제) | 매체사, 운영대행사, 영업대행사 |
    29→
    30→---
    31→
    32→## 4. 상세 시나리오
    33→
    34→### UC-13: 소재 업로드
    35→
    36→**누가**: 매체사, 운영대행사 또는 영업대행사
    37→**언제**: 광고 소재를 CMS에 등록하여 편성에 사용하고자 할 때
    38→**전제조건**: 로그인 상태. 소속 매체사에 등록된 매체가 1개 이상 존재
    39→
    40→#### 시나리오
    41→
    42→1. 매체사가 소재 관리 > 업로드 버튼을 클릭한다
    43→2. 파일을 선택한다 (드래그&드롭 또는 파일 탐색기)
    44→3. 시스템이 파일 기본 검증을 수행한다:
    45→   - 허용 파일 형식 (이미지: JPG, PNG / 영상: MP4, MOV)
    46→   - 최대 파일 크기
    47→4. 메타데이터를 입력한다:
    48→   - 소재명 (필수)
    49→   - 광고주 (선택)
    50→   - 재생 시간 — 영상: 파일에서 자동 추출, 이미지: 직접 입력 (필수)
    51→   - 대상 해상도 (필수)
    52→   - 비고 (선택)
    53→5. 업로드 버튼을 클릭한다
    54→6. 시스템이 파일을 저장하고 UC-14(자동 검수)를 트리거한다
    55→7. 소재 상태가 "검수중"으로 표시된다
    56→
    57→#### 이런 경우에는
    58→
    59→- **허용되지 않은 파일 형식**: "지원하지 않는 파일 형식입니다. JPG, PNG, MP4, MOV만 업로드 가능합니다" 안내
    60→- **파일 크기 초과**: "파일 크기가 제한(XXX MB)을 초과합니다" 안내
    61→- **동일 파일명 업로드**: 시스템이 자동으로 파일명 뒤에 넘버링 부여 (예: 광고A_2.mp4)
    62→- **복수 파일 동시 업로드**: 일괄 업로드 지원. 각 파일별 메타데이터 개별 입력 또는 일괄 적용
    63→- **영상 파일의 코덱이 지원되지 않는 경우**: "지원하지 않는 코덱입니다" 안내. 업로드 차단
    64→- **영업대행사의 접근 범위 밖 소재 업로드 시도**: 해당 매체사의 소재 관리 메뉴 자체가 표시되지 않음
    65→
    66→#### 결과
    67→
    68→- 소재 레코드 생성: 상태 "검수중"
    69→- 파일 스토리지에 원본 저장
    70→- UC-14 자동 검수 트리거
    71→
    72→---
    73→
    74→### UC-14: 소재 자동 검수
    75→
    76→**누가**: 시스템 (자동)
    77→**언제**: UC-13에서 소재 업로드 완료 직후
    78→**전제조건**: 소재가 "검수중" 상태
    79→
    80→#### 시나리오
    81→
    82→1. 시스템이 업로드된 소재를 자동 검수한다:
    83→   - 해상도 검증: 대상 해상도와 실제 파일 해상도 일치 여부
    84→   - 용량 검증: 허용 범위 내 여부
    85→   - 코덱 검증: 지원 코덱 여부 (영상)
    86→   - 재생 시간 검증: 메타데이터와 실제 재생 시간 일치 (영상)
    87→   - 파일 무결성: 손상 여부
    88→2. 모든 항목 통과 시 소재 상태가 "검수완료"로 변경된다
    89→3. 소재 등록자에게 "검수 완료" 알림 발송
    90→
    91→#### 이런 경우에는
    92→
    93→- **해상도 불일치**: 소재 상태 "검수실패". 실패 사유: "등록 해상도(1920x1080)와 실제 해상도(1280x720)가 다릅니다". 등록자에게 "검수 실패" 알림 발송
    94→- **파일 손상**: 소재 상태 "검수실패". 실패 사유: "파일이 손상되었습니다. 다시 업로드해주세요"
    95→- **자동 검수로 판단 불가한 항목 존재**: 소재 상태 "수동검수대기". 검수 권한자에게 "사용자 확인 필요" 알림 발송 → UC-15로 이동
    96→
    97→#### 결과
    98→
    99→- 검수 통과: 소재 상태 "검수중" → "검수완료". 편성에 사용 가능
   100→- 검수 실패: 소재 상태 "검수중" → "검수실패". 재업로드 필요
   101→- 수동 검수 필요: 소재 상태 "검수중" → "수동검수대기"
   102→
   103→---
   104→
   105→### UC-15: 소재 수동 검수 확인
   106→
   107→**누가**: 어드민 또는 매체사
   108→**언제**: UC-14에서 "수동검수대기" 상태가 된 소재를 확인할 때
   109→**전제조건**: 소재가 "수동검수대기" 상태. 검수 권한 보유
   110→
   111→#### 시나리오
   112→
   113→1. 어드민 또는 매체사가 소재 관리 > 검수 대기 목록을 확인한다
   114→2. 대상 소재를 선택하여 미리보기로 확인한다
   115→3. 자동 검수 결과 리포트를 확인한다 (통과 항목, 확인 필요 항목)
   116→4. "검수 통과" 또는 "검수 실패" 버튼을 클릭한다
   117→5. 실패 시 사유를 입력한다
   118→
   119→#### 이런 경우에는
   120→
   121→- **수동검수대기 소재가 장기간 방치**: 일정 기간(예: 7일) 경과 시 어드민에게 리마인더 알림
   122→- **미리보기 불가 (인코딩 문제)**: "미리보기를 지원하지 않는 형식입니다. 파일을 다운로드하여 확인해주세요" 안내 + 다운로드 버튼
   123→
   124→#### 결과
   125→
   126→- 검수 통과: 소재 상태 "수동검수대기" → "검수완료". 등록자에게 "검수 완료" 알림
   127→- 검수 실패: 소재 상태 "수동검수대기" → "검수실패". 등록자에게 "검수 실패" 알림 + 실패 사유
   128→
   129→---
   130→
   131→### UC-16: 소재 상태 관리 (교체/삭제)
   132→
   133→**누가**: 매체사, 운영대행사 또는 영업대행사
   134→**언제**: 기존 소재를 교체하거나 삭제할 때
   135→**전제조건**: 소재가 존재. 해당 소재에 대한 관리 권한 보유
   136→
   137→#### 시나리오 A — 소재 교체
   138→
   139→1. 매체사가 소재 관리 > 소재 상세에서 "교체" 버튼을 클릭한다
   140→2. 새 파일을 선택한다
   141→3. 시스템이 기존 메타데이터를 유지한 채 파일만 교체한다
   142→4. UC-14 자동 검수가 다시 트리거된다
   143→5. 소재 상태가 "검수중"으로 변경된다
   144→
   145→#### 시나리오 B — 소재 삭제
   146→
   147→1. 매체사가 소재 관리 > 소재 상세에서 "삭제" 버튼을 클릭한다
   148→2. 시스템이 확인 모달을 표시한다
   149→
   150→#### 이런 경우에는
   151→
   152→- **편성에 사용 중인 소재 교체**: "이 소재는 현재 N건의 편성에 사용 중입니다. 교체하면 검수 완료 후 자동 반영됩니다. 계속하시겠습니까?" 확인
   153→- **편성에 사용 중인 소재 삭제**: "이 소재는 현재 N건의 재생목록에 사용 중입니다. 삭제하면 해당 구좌가 '삭제됨' 상태로 표시됩니다. 계속하시겠습니까?" 경고. 삭제 후 편성 관리자에게 알림 발송
   154→- **검수 실패 소재 재업로드**: 소재 상세에서 "재업로드" 버튼 → UC-13과 동일 플로우 (기존 메타데이터 유지)
   155→- **검수중 소재 삭제**: 검수 프로세스 중단 후 삭제
   156→
   157→#### 결과
   158→
   159→- 교체: 파일만 변경, 메타데이터 유지, 재검수 시작
   160→- 삭제: 소재 레코드 삭제. 재생목록 내 해당 구좌는 "삭제됨" 상태로 전환 (구좌 구조 보존, 재생 시 스킵). 편성 관리자에게 알림. 파일 스토리지에서 삭제
   161→
   162→---
   163→
   164→## 5. 도메인 규칙
   165→
   166→### 5.1 소재 상태 FSM (검수축)
   167→
   168→```
   169→[검수중] ──(자동 검수 통과)──→ [검수완료]
   170→   │                              ↑
   171→   ├──(자동 검수 실패)──→ [검수실패] ──(재업로드)──→ [검수중]
   172→   │
   173→   └──(수동 검수 필요)──→ [수동검수대기]
   174→                              │
   175→                              ├──(통과)──→ [검수완료]
   176→                              └──(실패)──→ [검수실패]
   177→```
   178→
   179→**상태**:
   180→| 상태 | 설명 | 허용 동작 |
   181→|------|------|----------|
   182→| 검수중 | 자동 검수 진행 중 | 삭제 |
   183→| 검수완료 | 검수 통과, 편성 사용 가능 | 편성 연결, 교체, 삭제 |
   184→| 검수실패 | 검수 미통과 | 재업로드, 삭제 |
   185→| 수동검수대기 | 수동 확인 필요 | 수동 검수, 삭제 |
   186→
   187→**전이**:
   188→| From → To | 트리거 | 가드 | 효과 |
   189→|-----------|--------|------|------|
   190→| 검수중 → 검수완료 | 자동 검수 전 항목 통과 | — | 알림: "검수 완료" |
   191→| 검수중 → 검수실패 | 자동 검수 항목 실패 | — | 알림: "검수 실패" + 사유 |
   192→| 검수중 → 수동검수대기 | 자동 판단 불가 항목 존재 | — | 알림: "사용자 확인 필요" |
   193→| 수동검수대기 → 검수완료 | 검수 권한자가 통과 처리 | 검수 권한 보유 | 알림: "검수 완료" |
   194→| 수동검수대기 → 검수실패 | 검수 권한자가 실패 처리 | 검수 권한 보유, 사유 입력 | 알림: "검수 실패" |
   195→| 검수실패 → 검수중 | 소재 재업로드/교체 | — | 재검수 시작 |
   196→| 검수완료 → 검수중 | 소재 교체 | — | 재검수 시작 |
   197→
   198→**불변식**:
   199→- INV-11: "검수완료" 상태의 소재만 편성에 연결 가능
   200→- INV-12: 소재의 재생 시간은 0보다 커야 함
   201→- INV-13: 영업대행사는 소재 도메인만 접근 가능 (편성, 캠페인 관련 기능 접근 불가)
   202→
   203→### 5.2 비즈니스 규칙
   204→
   205→- BR-11: 소재 업로드 시 자동 검수가 기본 (확정 의사결정: 자동 검수 강화)
   206→- BR-12: 수동 검수는 자동으로 판단 불가한 경우에만 발생하는 예외 케이스
   207→- BR-13: 소재 교체 시 메타데이터 유지, 파일만 교체, 재검수 필수
   208→- BR-14: 편성에 사용 중인 소재 삭제 시 재생목록 내 구좌는 "삭제됨" 상태로 보존 (구좌 순서 유지, 재생 시 스킵). 편성 관리자에게 알림 발송. UI에서 빨간 점선 + "소재 삭제됨 — 교체 필요" 표시
   209→
   210→---
   211→
   212→## 6. 미결 사항
   213→
   214→- 허용 파일 형식 및 최대 파일 크기 상세 기준 미정의
   215→- 소재 교체 시 편성에 즉시 반영되는지, 재검수 완료 후 반영되는지 미정의
   216→- 소재 버전 관리 (교체 이력 보존) 필요 여부 미정의
   217→- 자동 검수의 구체적 검증 항목 및 기준값 미정의 (해상도 허용 오차 등)
   218→- 수동검수대기 장기 방치 시 리마인더 주기 미정의
   219→- 소재 삭제 시 파일 스토리지 즉시 삭제인지, 일정 기간 보존 후 삭제인지 미정의
   220→- 소재 미리보기(썸네일) 자동 생성 여부 미정의
   221→- 대용량 영상 업로드 시 청크 업로드/이어 올리기 지원 여부 미정의
   222→- 자동 검수 타임아웃 정책 미정의 (검수 서버 장애 시 "검수중" 영구 정체 방지)
   223→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/06-notification-management.md"
}

     1→# 알림 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS 내에서 발생하는 주요 이벤트를 사용자에게 실시간으로 전달한다. 3개 채널(인앱, 브라우저 푸시, Slack)을 지원하며, 사용자별로 채널·카테고리 조합을 설정할 수 있다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 인앱 알림 수신 | O (전체) | O (본인 매체) | O (부여받은 매체) | O (권한 범위 내 소재) |
    14→| 브라우저 푸시 수신 | O | O | O | O |
    15→| 본인 알림 설정 변경 | O | O | O | O |
    16→| Slack Webhook 관리 | O | X | X | X |
    17→| Slack 채널 매핑 설정 | O | X | X | X |
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-26 | 인앱 알림 수신 및 읽음 처리 | 모든 페르소나 |
    26→| UC-27 | 브라우저 푸시 권한 설정 | 모든 페르소나 |
    27→| UC-28 | Slack Webhook 설정 | 어드민 |
    28→
    29→---
    30→
    31→## 4. 상세 시나리오
    32→
    33→### UC-26: 인앱 알림 수신 및 읽음 처리
    34→
    35→**누가**: 모든 페르소나 (어드민, 매체사, 운영대행사, 영업대행사)
    36→**언제**: CMS 사용 중 이벤트가 발생하거나, 알림 센터를 확인할 때
    37→**전제조건**: 로그인 상태
    38→
    39→#### 시나리오
    40→
    41→1. CMS 이벤트 발생 시 시스템이 해당 수신 대상에게 인앱 알림을 생성한다
    42→2. 헤더의 bell 아이콘에 안 읽은 알림 수 배지가 표시된다
    43→3. 사용자가 bell 아이콘을 클릭하면 알림 센터가 열린다
    44→4. 알림 목록이 최신순으로 표시된다:
    45→   - 안 읽은 알림: 강조 표시
    46→   - 읽은 알림: 일반 표시
    47→5. 알림을 클릭하면:
    48→   - 해당 알림이 "읽음" 처리된다
    49→   - 관련 화면으로 이동한다 (예: 캠페인 상세, 소재 상세 등)
    50→6. "전체 읽음" 버튼으로 모든 알림을 일괄 읽음 처리할 수 있다
    51→
    52→#### 이런 경우에는
    53→
    54→- **알림 수신 대상이 오프라인(비로그인)**: 알림 레코드는 생성됨. 다음 로그인 시 확인 가능
    55→- **90일 경과한 알림**: 자동 삭제 (보존 기간: 90일)
    56→- **영업대행사의 알림**: 소재 관련 이벤트(검수 완료, 검수 실패)만 수신
    57→- **대량 알림 발생 (매체 100대 동시 오프라인 등)**: 동일 카테고리 알림을 그룹핑하여 "N건의 매체 오프라인" 형태로 표시
    58→
    59→#### 이벤트 카탈로그
    60→
    61→| 카테고리 | 이벤트 | 기본 채널 | 수신 대상 |
    62→|---------|--------|----------|----------|
    63→| 소재 검수 | 검수 완료 | 인앱 | 소재 등록자 |
    64→| 소재 검수 | 검수 실패 | 인앱, 브라우저 푸시 | 소재 등록자 |
    65→| 소재 검수 | 사용자 확인 필요 | 인앱 | 검수 권한자 |
    66→| 매체 상태 | 매체 오프라인 | 인앱, 브라우저 푸시, Slack | 매체 관리자 |
    67→| 매체 상태 | 매체 이상 감지 | 인앱, Slack | 매체 관리자 |
    68→| 매체 상태 | 매체 복구 | 인앱 | 매체 관리자 |
    69→| 편성 | 편성 충돌 | 인앱, 브라우저 푸시 | 편성 관리자 |
    70→| 편성 | 편성 시작 | 인앱 | 편성 관리자 |
    71→| 편성 | 편성 종료 | 인앱 | 편성 관리자 |
    72→| 사용자 | 초대 발송 | 인앱 | 초대 주체 |
    73→| 사용자 | 초대 만료 임박 (24h 전) | 인앱 | 초대 주체 |
    74→| 사용자 | 가입 완료 | 인앱 | 초대 주체 |
    75→| 리포트 | 리포트 발송 완료 | 인앱 | 리포트 설정자 |
    76→| 리포트 | 리포트 발송 실패 | 인앱, 브라우저 푸시 | 리포트 설정자 |
    77→
    78→> 캠페인 승인/반려 이벤트 제거됨 (확정 의사결정: 승인 워크플로우 없음)
    79→
    80→#### 결과
    81→
    82→- 알림 레코드 생성: 안 읽음 상태, 90일 보존
    83→- bell 아이콘 배지 업데이트
    84→
    85→---
    86→
    87→### UC-27: 브라우저 푸시 권한 설정
    88→
    89→**누가**: 모든 페르소나
    90→**언제**: 브라우저 푸시 알림을 받거나 끄고 싶을 때
    91→**전제조건**: 로그인 상태. 브라우저가 Web Push API를 지원
    92→
    93→#### 시나리오
    94→
    95→1. 사용자가 설정 > 알림 설정 메뉴를 클릭한다
    96→2. 알림 채널 설정이 표시된다:
    97→   - 인앱 알림: 항상 활성 (비활성화 불가)
    98→   - 브라우저 푸시: 토글 (기본 OFF)
    99→3. 브라우저 푸시 토글을 ON으로 변경한다
   100→4. 브라우저가 알림 권한 요청 팝업을 표시한다
   101→5. "허용"을 선택하면 브라우저 푸시가 활성화된다
   102→6. 카테고리별로 브라우저 푸시 수신 여부를 설정한다 (기본: 긴급 이벤트만)
   103→
   104→#### 이런 경우에는
   105→
   106→- **브라우저에서 "차단" 선택**: 브라우저 푸시 활성화 불가. "브라우저 설정에서 알림을 허용해주세요" 안내
   107→- **브라우저가 Web Push API 미지원**: 브라우저 푸시 설정 항목 비표시. "현재 브라우저는 푸시 알림을 지원하지 않습니다" 안내
   108→- **기존에 허용했다가 토글 OFF**: 구독 해제. 이후 푸시 미발송
   109→
   110→#### 결과
   111→
   112→- 브라우저 푸시 구독 등록/해제
   113→- 카테고리별 수신 설정 저장
   114→
   115→---
   116→
   117→### UC-28: Slack Webhook 설정
   118→
   119→**누가**: 어드민
   120→**언제**: 운영팀 Slack 채널에 CMS 알림을 연동할 때
   121→**전제조건**: 어드민 로그인 상태. Slack Webhook URL 보유
   122→
   123→#### 시나리오
   124→
   125→1. 어드민이 설정 > Slack 연동 메뉴를 클릭한다
   126→2. Slack Webhook URL을 입력한다
   127→3. 테스트 발송 버튼을 클릭한다
   128→4. 시스템이 Slack에 테스트 메시지를 발송한다
   129→5. 발송 성공 시 "연동 완료" 표시
   130→6. 카테고리-채널 매핑을 설정한다:
   131→   - 매체 상태 이벤트 → #ops-alerts 채널
   132→   - 편성 충돌 이벤트 → #scheduling 채널
   133→   - (카테고리별로 다른 Webhook URL/채널 매핑 가능)
   134→7. 저장 버튼을 클릭한다
   135→
   136→#### 이런 경우에는
   137→
   138→- **잘못된 Webhook URL**: 테스트 발송 실패. "Webhook URL이 올바르지 않습니다" 안내
   139→- **Slack 서버 장애로 발송 실패**: "Slack 발송에 실패했습니다. 잠시 후 다시 시도해주세요" 안내. 알림은 인앱에는 정상 전달
   140→- **복수 Webhook URL 등록**: 허용. 카테고리별로 다른 채널에 발송 가능
   141→
   142→#### 결과
   143→
   144→- Slack Webhook 설정 저장
   145→- 이후 해당 카테고리 이벤트 발생 시 Slack에 자동 발송
   146→
   147→---
   148→
   149→## 5. 도메인 규칙
   150→
   151→### 5.1 알림 우선순위
   152→
   153→| 우선순위 | 이벤트 유형 | 기본 채널 |
   154→|:--------:|-----------|----------|
   155→| 긴급 | 매체 오프라인, 검수 실패, 편성 충돌, 리포트 발송 실패 | 인앱 + 브라우저 푸시 + Slack |
   156→| 일반 | 검수 완료, 편성 시작/종료, 가입 완료, 리포트 발송 완료 | 인앱 |
   157→| 정보 | 초대 발송, 초대 만료 임박, 매체 복구 | 인앱 |
   158→
   159→### 5.2 비즈니스 규칙
   160→
   161→- BR-23: 인앱 알림은 항상 활성. 사용자가 비활성화할 수 없음
   162→- BR-24: 브라우저 푸시는 사용자별 opt-in. 기본 OFF
   163→- BR-25: Slack은 어드민만 설정 가능. 카테고리별 채널 매핑
   164→- BR-26: 알림 보존 기간: 90일. 이후 자동 삭제
   165→- BR-27: 알림 수신 대상은 이벤트 발생 시점의 권한 기준으로 결정
   166→
   167→---
   168→
   169→## 6. 미결 사항
   170→
   171→- 알림 그룹핑 기준 (동일 카테고리? 동일 매체? 시간 윈도우?) 미정의
   172→- 알림 발송 실패 시 재시도 정책 미정의 (브라우저 푸시, Slack)
   173→- 사용자별 카테고리 수신 설정의 상세 UI 미정의
   174→- 알림 센터의 페이지네이션/무한 스크롤 방식 미정의
   175→- 이메일 알림 채널 추가 여부 미정의 (현재: 인앱, 브라우저 푸시, Slack만)
   176→- Slack 외 메신저(네이버웍스 등) 연동 필요 여부 미정의 (RFP에서 네이버웍스 협업도구 언급)
   177→

Tool: Read
Input: {
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/07-dashboard-report.md"
}

     1→# 대시보드/리포트 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS의 전체 운영 현황을 대시보드로 시각화하고, 정기/수동 리포트를 생성·발송한다. 매체 상태, 캠페인 현황, 편성 상태, 알림 요약 등을 한눈에 파악할 수 있다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 대시보드 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    14→| 리포트 생성/예약 | O | O | O (권한 범위 내) | X |
    15→| 리포트 조회/다운로드 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    16→
    17→> 영업대행사는 대시보드/리포트 기능에 접근 불가 (소재 도메인만 접근 가능).
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-29 | 대시보드 현황 조회 | 어드민, 매체사, 운영대행사 |
    26→| UC-30 | 리포트 생성 및 예약 발송 | 어드민, 매체사, 운영대행사 |
    27→| UC-31 | 리포트 조회/다운로드 | 어드민, 매체사, 운영대행사 |
    28→
    29→---
    30→
    31→## 4. 상세 시나리오
    32→
    33→### UC-29: 대시보드 현황 조회
    34→
    35→**누가**: 어드민, 매체사 또는 운영대행사
    36→**언제**: CMS 로그인 직후 또는 운영 현황을 확인할 때
    37→**전제조건**: 로그인 상태
    38→
    39→#### 시나리오
    40→
    41→1. 어드민, 매체사 또는 운영대행사가 CMS에 로그인하면 대시보드가 기본 화면으로 표시된다
    42→2. 대시보드에 다음 위젯이 표시된다:
    43→   - **매체 상태 요약**: 전체/온라인/오프라인/비활성 매체 수
    44→   - **캠페인 현황**: 초안/집행중/완료/취소 건수
    45→   - **편성 상태**: 예약됨/적용중/종료 건수
    46→   - **최근 알림**: 안 읽은 알림 상위 5건
    47→   - **매체 헬스체크 이상**: 이상 감지 매체 목록
    48→3. 각 위젯을 클릭하면 해당 상세 화면으로 이동한다
    49→4. 기간 필터를 적용하여 특정 기간의 현황을 확인할 수 있다
    50→
    51→#### 이런 경우에는
    52→
    53→- **매체사 사용자**: 본인 매체 관련 데이터만 표시
    54→- **운영대행사**: 부여받은 매체 관련 데이터만 표시
    55→- **데이터 없음 (신규 매체사)**: 각 위젯에 "아직 데이터가 없습니다" 안내
    56→
    57→#### 결과
    58→
    59→- 권한 범위 내 운영 현황 시각화
    60→
    61→---
    62→
    63→### UC-30: 리포트 생성 및 예약 발송
    64→
    65→**누가**: 어드민, 매체사 또는 운영대행사
    66→**언제**: 운영 실적 리포트를 생성하거나 정기 발송을 예약할 때
    67→**전제조건**: 로그인 상태. 리포트 대상 데이터 존재
    68→
    69→#### 시나리오 A — 수동 리포트 생성
    70→
    71→1. 어드민, 매체사 또는 운영대행사가 리포트 > 새 리포트 버튼을 클릭한다
    72→2. 리포트 유형을 선택한다:
    73→   - 매체 운영 리포트 (매체별 온라인 시간, 재생 횟수 등)
    74→   - 캠페인 실적 리포트 (캠페인별 집행 현황)
    75→   - 편성 리포트 (편성별 재생 통계)
    76→3. 대상 기간을 설정한다 (시작일~종료일)
    77→4. 대상 매체를 선택한다 (전체 또는 특정 매체)
    78→5. 생성 버튼을 클릭한다
    79→6. 시스템이 리포트를 생성한다
    80→7. 생성 완료 시 리포트 목록에 표시되고, 다운로드 가능
    81→
    82→#### 시나리오 B — 예약 발송 설정
    83→
    84→1. 리포트 생성 화면에서 "예약 발송" 토글을 ON으로 설정한다
    85→2. 발송 주기를 선택한다: 매일 / 매주 / 매월
    86→3. 수신자 이메일을 입력한다 (복수 가능)
    87→4. 저장 버튼을 클릭한다
    88→5. 시스템이 설정된 주기마다 리포트를 자동 생성·발송한다
    89→
    90→#### 이런 경우에는
    91→
    92→- **대상 기간에 데이터 없음**: "해당 기간에 데이터가 없습니다" 안내. 빈 리포트 생성 가능 (데이터 없음 표시)
    93→- **예약 발송 메일 발송 실패**: 리포트 설정자에게 "리포트 발송 실패" 알림 (UC-26 연계)
    94→- **예약 발송 수정/삭제**: 리포트 > 예약 목록에서 수정/삭제 가능
    95→- **운영대행사가 권한 범위 밖 매체 데이터 리포트 생성 시도**: 해당 매체가 선택 목록에 표시되지 않음
    96→
    97→#### 결과
    98→
    99→- 수동: 리포트 파일 생성 (다운로드 가능)
   100→- 예약: 주기적 자동 생성 + 이메일 발송
   101→
   102→---
   103→
   104→### UC-31: 리포트 조회/다운로드
   105→
   106→**누가**: 어드민, 매체사 또는 운영대행사
   107→**언제**: 기존에 생성된 리포트를 확인하거나 다운로드할 때
   108→**전제조건**: 로그인 상태. 리포트가 1건 이상 존재
   109→
   110→#### 시나리오
   111→
   112→1. 어드민, 매체사 또는 운영대행사가 리포트 > 리포트 목록을 클릭한다
   113→2. 생성된 리포트 목록이 표시된다 (권한 범위 내)
   114→3. 필터를 적용한다:
   115→   - 리포트 유형
   116→   - 생성 기간
   117→   - 대상 매체
   118→4. 리포트를 선택하면 미리보기가 표시된다
   119→5. "다운로드" 버튼으로 파일을 다운로드한다
   120→
   121→#### 이런 경우에는
   122→
   123→- **리포트 목록 없음**: "생성된 리포트가 없습니다" 안내
   124→- **리포트 파일 손상**: "리포트를 열 수 없습니다. 다시 생성해주세요" 안내
   125→- **대량 리포트 다운로드**: 일괄 다운로드 지원 (ZIP 압축)
   126→
   127→#### 결과
   128→
   129→- 리포트 미리보기 및 파일 다운로드
   130→
   131→---
   132→
   133→## 5. 도메인 규칙
   134→
   135→### 5.1 비즈니스 규칙
   136→
   137→- BR-28: 대시보드는 로그인 시 기본 화면
   138→- BR-29: 모든 대시보드/리포트 데이터는 사용자 권한 범위로 필터링
   139→- BR-30: 리포트 예약 발송 실패 시 알림 연동 (UC-26)
   140→- BR-31: 영업대행사는 대시보드/리포트 접근 불가
   141→
   142→---
   143→
   144→## 6. 미결 사항
   145→
   146→- 리포트 파일 형식 미정의 (PDF? Excel? CSV?)
   147→- 대시보드 위젯 커스터마이징(순서 변경, 표시/숨김) 가능 여부 미정의
   148→- 리포트 보존 기간 미정의 (무제한? 일정 기간 후 자동 삭제?)
   149→- 유동인구 데이터가 연결된 매체의 경우 리포트에 유동인구 통계 포함 여부 미정의
   150→- 리포트 내 차트/그래프 유형 미정의
   151→- 실시간 대시보드 갱신 주기 미정의 (웹소켓? 폴링? 수동 새로고침?)
   152→- 매체사별 월간 리포트 (RFP 산출물: "매체사 세일즈 관련 월간 리포트") 자동 생성 여부 미정의
   153→- 예약 발송 "매월" 옵션의 기준일 미정의 (매월 1일? 설정일 기준?)
   154→- 대량 매체 리포트 생성 시 비동기 처리 + 완료 알림 패턴 필요 여부 미정의
   155→

> *Thinking:*
> 

전체 시나리오 7개를 다 읽었습니다. `/discover` 워크플로우를 시작합니다.

---

## Step 1: User Personas

DOOH CMS의 4개 역할에서 **3개 핵심 페르소나**를 도출합니다.

### Persona 1: 김도현 — 매체사 운영팀장 (Primary Persona)

> *"내 매체가 지금 정상인지, 광고가 제대로 나가고 있는지 한눈에 봐야 해요."*

| 항목 | 내용 |
|------|------|
| **나이/직업** | 38세, 중견 옥외광고 매체사 운영팀장 |
| **테크 수준** | 중간. 엑셀 능숙, SaaS 경험 있음 (구글 Ads, 네이버 광고 등) |
| **목표** | 소유 매체 50대의 안정적 운영, 캠페인 일정 관리, 광고주에게 실적 보고 |
| **좌절** | 매체 장애를 현장에서 전화로 알게 됨. 편성 충돌을 사후에 발견. 리포트를 수동으로 만듦 |
| **행동** | 출근 → 매체 상태 확인 → 캠페인 등록/수정 → 편성표 조정 → 리포트 작성. 하루 CMS 접속 10회+ |
| **시나리오** | 월요일 아침, 주말 사이 오프라인된 매체 3대를 발견하고 운영대행사에게 현장 확인 지시. 동시에 이번주 시작 캠페인 2건의 편성표를 생성 |
| **설계 시사점** | 대시보드 최우선, 매체 상태 실시간 가시성, 편성 충돌 사전 경고, 리포트 자동화 |

---

### Persona 2: 이수진 — 운영대행사 현장 매니저

> *"매체사에서 부여받은 매체만 빠르게 관리하고 싶어요. 복잡한 건 필요 없어요."*

| 항목 | 내용 |
|------|------|
| **나이/직업** | 29세, 옥외광고 운영대행사 소속 현장 매니저 |
| **테크 수준** | 중하. 스마트폰 위주, PC 업무는 기본적인 것만 |
| **목표** | 맡은 매체 15대의 디바이스 연동, 소재 교체, 편성표 적용을 빠르게 처리 |
| **좌절** | 권한 범위가 복잡해서 뭘 할 수 있는지 헷갈림. 현장에서 디바이스 연동 시 오류 대응이 어려움 |
| **행동** | 현장 출장 → 디바이스 연동/점검 → 사무실 복귀 → 편성 변경. CMS 접속 주 3~4회 |
| **시나리오** | 새 매체 설치 현장에서 디바이스 ID를 입력해 연동하고, 영상 출력을 육안 조정한 뒤 잠금. 사무실 돌아와서 재생목록에 소재를 배치하고 편성표를 생성 |
| **설계 시사점** | 디바이스 연동 UX 단순화, 권한 범위 명확한 UI, 모바일 대응 고려, 오류 메시지 친절하게 |

---

### Persona 3: 박민호 — 영업대행사 AE (Account Executive)

> *"광고주한테 받은 소재 올리고 검수 통과됐는지만 확인하면 돼요."*

| 항목 | 내용 |
|------|------|
| **나이/직업** | 33세, 광고대행사 소속 AE |
| **테크 수준** | 중. 다양한 광고 플랫폼 사용 경험 |
| **목표** | 광고주 소재를 빠르게 업로드하고 검수 통과 확인. 편성/캠페인은 매체사가 알아서 |
| **좌절** | 검수 실패 시 사유가 불친절. 소재 재업로드 반복. 본인 올린 소재 외 다른 기능이 보이면 혼란 |
| **행동** | 광고주에게 소재 수령 → CMS 업로드 → 검수 결과 확인 → 실패 시 광고주에게 수정 요청. 주 1~2회 접속 |
| **시나리오** | 광고주에게 받은 영상 3건을 일괄 업로드. 1건이 해상도 불일치로 검수 실패 → 광고주에게 "1920x1080으로 다시 보내주세요" 안내 |
| **설계 시사점** | 소재 도메인 외 기능 완전 숨김, 검수 실패 사유 명확+복사 가능, 일괄 업로드 UX, 소재 상태 알림 |

---

### Primary Persona: **김도현 (매체사 운영팀장)**

**이유**: CMS의 핵심 가치 흐름(매체 등록 → 소재 관리 → 캠페인 → 편성 → 모니터링 → 리포트)을 전부 경험하는 유일한 역할. 이 페르소나를 만족시키면 운영대행사와 영업대행사의 니즈도 하위 집합으로 커버됨.

### 리서치 갭
- 실제 매체사 운영팀의 일일 업무 루틴 관찰 데이터 없음
- 기존 경쟁 CMS(Broadsign, Scala 등) 사용 경험 및 불만점 미수집
- 매체 수 규모별(10대 vs 500대) 사용 패턴 차이 미파악

---

## Step 2: Empathy Map — 김도현 (Primary Persona)

### Says (직접 발화)
- "매체 장애 알림이 너무 늦어요. 현장에서 전화 와서 알게 되면 이미 늦죠."
- "편성 잡을 때 충돌 나면 어디서 겹치는지 찾기가 너무 힘들어요."
- "광고주한테 보낼 리포트 만드는 데 반나절씩 걸려요."
- "소재 검수 통과됐는지 매번 확인하러 들어가야 해요."

### Thinks (추론되는 생각)
- "이 시스템이 내가 몰라도 알아서 잡아줬으면 좋겠다"
- "매체 50대 각각 상태 확인하는 건 비효율적이야"
- "편성 충돌은 실수가 아니라 시스템이 막아줘야 하는 거 아닌가"
- "리포트는 버튼 하나로 나와야지, 왜 내가 데이터 모아서 만들어야 하지"

### Does (관찰 가능한 행동)
- 아침마다 매체 목록을 스크롤하며 오프라인 매체 확인
- 엑셀에 편성 일정을 별도로 관리 (CMS 편성 화면만으로 파악 어려워서)
- 소재 검수 상태를 수시로 새로고침
- 월간 리포트를 수동으로 스크린샷 + 엑셀 조합으로 작성

### Feels (감정 상태)
- **불안**: 매체가 지금 제대로 돌아가고 있는지 확신이 없음
- **번거로움**: 반복적인 수동 작업(리포트, 상태 확인)에 지침
- **부담**: 편성 실수 시 광고주에게 직접 책임
- **기대**: 새 CMS가 이런 문제를 해결해주길 바람

### Goals
- 매체 상태를 한 화면에서 실시간 파악
- 편성 충돌을 사전에 방지
- 리포트 자동 생성 및 정기 발송
- 이상 징후 즉시 알림 수신

### Pain Points
- 매체 장애 인지 지연 → 광고 송출 공백
- 편성 충돌 사후 발견 → 긴급 편성 변경
- 리포트 수동 작성 → 시간 낭비
- 소재 검수 상태 확인의 반복적 수동 조회

### 인사이트
1. **실시간 모니터링이 핵심 가치** — 대시보드의 매체 상태 위젯이 CMS 첫인상을 결정
2. **예방 > 대응** — 편성 충돌 감지, 소재 검수 알림 등 사전 알림이 신뢰를 만듦
3. **자동화 = 시간 회수** — 리포트 자동화만으로도 도입 명분이 됨

---

## Step 3: Journey Map — 김도현의 DOOH CMS 일일 운영

| 단계 | 1. 로그인/현황 파악 | 2. 매체 점검 | 3. 소재 관리 | 4. 캠페인 등록 | 5. 편성표 생성 | 6. 모니터링 | 7. 리포트 |
|------|-------------------|-------------|-------------|--------------|--------------|------------|----------|
| **목표** | 오늘 할 일 파악 | 매체 정상 확인 | 소재 검수 확인/업로드 | 새 계약 등록 | 재생목록→편성 배정 | 실시간 이상 감지 | 광고주에 실적 보고 |
| **행동** | 대시보드 확인, 알림 확인 | 매체 목록에서 오프라인/이상 필터 | 검수 대기 소재 확인, 승인/반려 | 3단계 스텝 입력 | 소재 배치, 매체 배정, 기간 설정 | 알림 수신, 매체 상세 모니터링 탭 | 리포트 생성, 다운로드, 이메일 발송 |
| **터치포인트** | 대시보드, 알림 센터 | 매체 목록, 헬스체크 탭 | 소재 목록, 미리보기 | 캠페인 등록 폼 | 재생목록 편집기, 편성표 폼 | 인앱 알림, Slack, 브라우저 푸시 | 리포트 목록, 예약 발송 설정 |
| **감정** | 😐 중립 → 😰 불안 (알림 많으면) | 😰 불안 → 😌 안심 (정상이면) | 😤 답답 (검수 느리면) | 😐 중립 (반복 작업) | 😣 긴장 (충돌 발생 시) | 😱 공포 (장애 시) → 😌 안심 | 😩 피로 (수동이면) → 😊 만족 (자동이면) |
| **Pain Point** | 알림이 많으면 중요도 구분 어려움 | 매체 50대 개별 확인 비효율 | 검수 결과 알림 누락 | 광고주 신규 등록이 흐름 끊김 | 충돌 해소 옵션 이해 어려움 | 오프라인 원인 파악 불가 | 리포트 형식 커스텀 불가 |
| **기회** | 알림 우선순위 시각화, 투두 요약 | 매체 그룹 상태 대시보드 | 검수 완료 자동 알림+편성 연결 제안 | 인라인 광고주 등록 모달 (이미 있음) | 충돌 시각화 (타임라인 뷰) | 장애 원인 자동 진단 힌트 | 원클릭 리포트 + 예약 발송 |

### Emotional Curve

```
긍정 ─────────────────────────────────────────────────
      │         ╱╲                              ╱ 자동 리포트
      │   대시보드  매체정상                    ╱
중립  │──╱──────────╲──────────────────────╱────
      │              ╲  검수지연  ╱╲충돌 ╱
      │               ╲────────╱  ╲──╱ 장애알림
부정 ─┼─────────────────────────────────────────
      1.로그인   2.매체   3.소재   4.캠페인  5.편성  6.모니터링  7.리포트
```

### Moments of Truth (결정적 순간)

1. **매체 장애 알림 수신 → 대응까지의 시간** — CMS 신뢰도를 결정
2. **편성 충돌 감지 시점** — 저장 전에 잡아주면 신뢰, 사후 발견이면 불신
3. **첫 리포트 생성 경험** — 자동화 수준이 도입 ROI 체감을 좌우

### Top 5 Design Opportunities (영향도 × 실현 가능성)

| 순위 | 기회 | 영향 | 실현성 |
|:----:|------|:----:|:-----:|
| 1 | 대시보드에 매체 상태 실시간 요약 + 이상 매체 원클릭 진입 | 높음 | 높음 |
| 2 | 편성 충돌 타임라인 시각화 (달력/간트 뷰) | 높음 | 중간 |
| 3 | 리포트 원클릭 생성 + 예약 발송 자동화 | 높음 | 높음 |
| 4 | 소재 검수 완료 시 "이 소재로 편성하기" CTA 제안 | 중간 | 높음 |
| 5 | 알림 센터 우선순위 그룹핑 + 긴급/일반/정보 탭 분리 | 중간 | 높음 |

---

## Step 4: Research Summary

### 핵심 인사이트

1. **모니터링 불안이 최대 페인** — 매체 상태 실시간 가시성이 CMS의 1순위 가치
2. **예방 시스템이 신뢰를 만듦** — 편성 충돌 사전 감지, 소재 검수 자동 알림
3. **반복 작업 자동화가 도입 명분** — 리포트, 상태 확인의 수동 반복 제거
4. **역할별 UI 스코프가 핵심** — 영업대행사는 소재만, 운영대행사는 권한 범위만 보여야 혼란 없음
5. **현장 작업(디바이스 연동)의 UX가 취약 고리** — 오류 시 대응이 어려운 환경

### 다음 단계 제안

- `/interview`로 김도현(매체사 운영팀장) 페르소나 시뮬레이션 인터뷰를 진행하여 시나리오 검증할까요?
- `/synthesize`로 기존 7개 시나리오 문서의 미결 사항들을 JTBD로 구조화할까요?

**Tool:** `Skill`

```json
{
  "skill": "research:discover",
  "args": "DOOH"
}
```

**Error:**

```
<tool_use_error>Unknown skill: research:discover</tool_use_error>
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/commands/discover.md"
}
```

**Result:**

```
     1→---
     2→description: Run a full user research cycle — persona creation, empathy mapping, and journey mapping for a product or feature.
     3→argument-hint: [product or feature to research]
     4→---
     5→
     6→Run a full user research discovery cycle by chaining these steps:
     7→
     8→1. Use the `user-persona` skill to create 2-3 user personas from available research data
     9→2. Use the `empathy-map` skill to build empathy maps for the primary persona
    10→3. Use the `journey-map` skill to map the end-to-end user journey for the primary persona
    11→4. Synthesize findings into a research summary with key insights and design implications
    12→5. After completion, suggest: "Want me to `/interview` to prepare scripts for validating these personas?" or "Want me to `/test-plan` to design usability tests?"
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/user-persona/SKILL.md"
}
```

**Result:**

```
     1→---
     2→name: user-persona
     3→description: Create refined user personas from research data with demographics, goals, and behavioral patterns. Use when synthesizing user research into actionable persona profiles for design decisions.
     4→---
     5→
     6→# User Persona
     7→
     8→Create comprehensive user personas grounded in research data for product and UX design.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team create user personas for $ARGUMENTS. If the user provides product planning materials (requirements documents, feature specs, or roadmaps), read them first. If they mention a product URL, use web search to understand the product. 
    13→
    14→## Domain Context
    15→
    16→- Personas (Alan Cooper, About Face): Archetypical users based on behavioral patterns, not demographics alone.
    17→- Each persona should feel like a real person the team can empathize with and design for.
    18→- Personas should be grounded in actual research data, not assumptions.
    19→- Include behavioral variables, goals (life goals, experience goals, end goals), and frustrations.
    20→
    21→## Instructions
    22→
    23→The user will describe their product and available research data. Work through these steps:
    24→
    25→1. **Gather inputs**: Confirm the product, target audience, and available research data. Ask for clarification if anything is ambiguous.
    26→2. **Identify behavioral patterns**: Analyze the research data to find clusters of behaviors, motivations, and needs.
    27→3. **Define 2-4 personas** — for each persona, include:
    28→   - Name, photo description, and a one-line quote that captures their mindset
    29→   - Demographics: age range, occupation, tech comfort, relevant context
    30→   - Goals: what they want to achieve (functional, emotional, social)
    31→   - Frustrations: current pain points and unmet needs
    32→   - Behaviors: how they currently approach the proble...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/empathy-map/SKILL.md"
}
```

**Result:**

```
     1→---
     2→name: empathy-map
     3→description: Build a 4-quadrant empathy map (Says, Thinks, Does, Feels) to synthesize user research into actionable insights. Use when you need to quickly capture and share user understanding across the team.
     4→---
     5→
     6→# Empathy Map
     7→
     8→Build an empathy map to synthesize user research and align the team around user understanding.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team create user personas for $ARGUMENTS. If the user provides product planning materials (requirements documents, feature specs, or roadmaps), read them first. If they mention a product URL, use web search to understand the product. 
    13→
    14→## Domain Context
    15→
    16→- Empathy Maps (Dave Gray, XPLANE): A collaborative tool to externalize what we know about a user type.
    17→- Four quadrants: Says (direct quotes), Thinks (inferred beliefs), Does (observed actions), Feels (emotional states).
    18→- Also capture Goals (what they want to achieve) and Pain Points (barriers and frustrations).
    19→- Best created from actual research data, not assumptions.
    20→
    21→## Instructions
    22→
    23→The user will describe their user type and available research data. Work through these steps:
    24→
    25→1. **Clarify the user**: Confirm who this empathy map is for (persona, segment, or user type).
    26→2. **Map each quadrant**:
    27→  - **Says**: Direct quotes and statements from research (use actual quotes where available)
    28→  - **Thinks**: Beliefs, concerns, and thoughts inferred from behavior and context
    29→  - **Does**: Observable actions, behaviors, and workarounds
    30→  - **Feels**: Emotional states, anxieties, and motivations
    31→3. **Identify goals**: What is this user trying to achieve?
    32→4. **Identify pain points**: What barriers, frustrations, or unmet needs exist?
    33→5. **Extract insights**: What design implications emerge from...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/.claude/skills/research/skills/journey-map/SKILL.md"
}
```

**Result:**

```
     1→---
     2→name: journey-map
     3→description: Create an end-to-end user journey map with stages, touchpoints, emotions, pain points, and opportunity areas. Use when mapping the full user experience for a product, feature, or service.
     4→---
     5→
     6→# Journey Map
     7→
     8→Create a comprehensive user journey map for product design and UX analysis.
     9→
    10→## Context
    11→
    12→You are a senior UX researcher helping a design team map the user journey for $ARGUMENTS. If the user provides planning documents (PRDs, product specs, or system architectures), read them first.
    13→
    14→## Domain Context
    15→
    16→- Journey Mapping (Jim Kalbach, Mapping Experiences): Visualizing the end-to-end experience across stages, touchpoints, channels, emotions, and pain points.
    17→- Each stage should capture: user goals, actions, touchpoints, emotions, pain points, and opportunities.
    18→- Journey maps should be persona-specific when possible.
    19→- Include both the current state (as-is) and highlight opportunity areas for the future state.
    20→
    21→## Instructions
    22→
    23→The user will describe the product/feature and target user. Work through these steps:
    24→
    25→1. **Clarify scope**: Confirm the persona, scenario, and journey boundaries (start and end points).
    26→2. **Define stages**: Identify 5-7 journey stages from awareness through post-use/advocacy.
    27→3. **Map each stage** with:
    28→     - User goals for this stage
    29→     - Actions and behaviors
    30→     - Touchpoints and channels
    31→     - Thoughts and questions
    32→     - Emotional state (rate on a positive/negative scale)
    33→     - Pain points and friction
    34→     - Opportunity areas for design improvement
    35→4. **Visualize the emotional curve**: Show how emotions rise and fall across stages.
    36→5. **Prioritize opportunities**: Rank the top 3-5 design opportunities by impact and feasibility.
    37→6. **Iden...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/01-user-management.md"
}
```

**Result:**

```
     1→# 사용자 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS에 접근하는 모든 사용자의 계정 생성, 권한 부여, 비활성화를 관리한다. 이메일 초대 기반 가입 방식을 사용하며, 자체 회원가입은 지원하지 않는다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 페르소나 | 설명 |
    12→|---------|------|
    13→| **어드민** | CMS 플랫폼 관리자. 모든 사용자 관리 권한 보유. 매체사 담당자 초대의 기본 주체 |
    14→| **매체사** | 매체를 소유한 회사 소속 사용자. 소속 매체사 내 추가 사용자(운영대행사/영업대행사) 초대 가능 |
    15→| **운영대행사** | 매체사로부터 권한을 부여받아 매체 또는 매체 그룹을 관리 |
    16→| **영업대행사** | 매체사로부터 권한을 부여받아 소재 도메인만 접근 가능 (확정 의사결정) |
    17→
    18→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    19→|------|:------:|:------:|:----------:|:----------:|
    20→| 매체사 담당자 초대 | O | — | — | — |
    21→| 추가 사용자 초대 | O (예외적) | O | X | X |
    22→| 사용자 권한 변경 | O (전체) | O (소속 내) | X | X |
    23→| 사용자 비활성화 | O (전체) | O (소속 내) | X | X |
    24→| 본인 정보 수정 | O | O | O | O |
    25→
    26→---
    27→
    28→## 3. 시나리오 목록
    29→
    30→| ID | 시나리오명 | Actor |
    31→|----|----------|-------|
    32→| UC-01 | 어드민이 매체사 담당자를 초대 | 어드민 |
    33→| UC-02 | 초대받은 사용자가 가입 완료 | 초대받은 사용자 |
    34→| UC-03 | 매체사가 운영대행사/영업대행사를 추가 초대 | 매체사 |
    35→| UC-04 | 사용자 권한 변경 | 어드민, 매체사 |
    36→| UC-05 | 사용자 비활성화/탈퇴 | 어드민, 매체사 |
    37→
    38→---
    39→
    40→## 4. 상세 시나리오
    41→
    42→### UC-01: 어드민이 매체사 담당자를 초대
    43→
    44→**누가**: 어드민
    45→**언제**: 새로운 매체사를 CMS에 온보딩할 때
    46→**전제조건**: 어드민이 로그인된 상태. 대상 매체사가 UC-06(매체사 등록)으로 등록 완료되었거나, 초대와 동시에 매체사 등록을 진행
    47→
    48→#### 시나리오
    49→
    50→1. 어드민이 사용자 관리 > 초대 버튼을 클릭한다
    51→2. 초대 대상의 이메일 주소를 입력한다
    52→3. 역할을 "매체사"로 지정한다
    53→4. 소속 매체사를 선택한다
    54→5. 초대장 발송 버튼을 클릭한다
    55→6. 시스템이 초대 메일을 발송하고, 초대 상태를 "발송됨"으로 기록한다
    56→7. 초대 목록에 해당 건이 표시된다
    57→
    58→#### 이런 경우에는
    59→
    60→- **이미 가입된 이메일 (활성 상태)**: "이미 등록된 사용자입니다" 안내. 초대 발송 차단
    61→- **이미 가입된 이메일 (비활성 상태)**: "비활성화된 사용자입니다. 활성화하시겠습니까?" 확인 → 활성화 처리 (새 초대 불필요)
    62→- **동일 이메일로 이미 초대 발송됨 (미가입 상태)**: "이미 초대가 발송된 이메일입니다. 재발송하시겠습니까?" 확인 후 재발송 가능
    63→- **이메일 형식 오류**: 필드 하이라이트 + "올바른 이메일 형식을 입력해주세요" 안내
    64→- *...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/04-campaign-management.md"
}
```

**Result:**

```
     1→# 캠페인 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→캠페인은 "누가 얼마를 내고 어디에 광고하는지"를 정의하는 비즈니스 단위이다. 광고주, 대상 매체, 집행 기간, 예산 정보를 포함한다. 캠페인은 편성표를 직접 제어하지 않으며, 각각 독립적으로 관리된다. **승인/반려 워크플로우 없음** (확정 의사결정).
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 캠페인 등록 | O | O | O (권한 범위 내) | X |
    14→| 캠페인 수정 | O | O | O (권한 범위 내) | X |
    15→| 캠페인 삭제/취소 | O | O | O (권한 범위 내) | X |
    16→| 캠페인 목록 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    17→
    18→> 영업대행사는 소재 도메인만 접근 가능 (확정 의사결정). 캠페인 관리 기능에 접근 불가.
    19→
    20→---
    21→
    22→## 3. 시나리오 목록
    23→
    24→| ID | 시나리오명 | Actor |
    25→|----|----------|-------|
    26→| UC-17 | 캠페인 등록 (3단계 스텝) | 어드민, 매체사, 운영대행사 |
    27→| UC-18 | 캠페인 집행 시작 | 시스템 (자동) |
    28→| UC-19 | 캠페인 완료/취소 | 어드민, 매체사, 운영대행사 / 시스템 |
    29→| UC-20 | 캠페인 목록 조회 및 필터링 | 어드민, 매체사, 운영대행사 |
    30→
    31→---
    32→
    33→## 4. 상세 시나리오
    34→
    35→### UC-17: 캠페인 등록 (3단계 스텝)
    36→
    37→**누가**: 어드민, 매체사 또는 운영대행사
    38→**언제**: 새로운 광고 계약을 CMS에 등록할 때
    39→**전제조건**: 로그인 상태. 대상 매체가 UC-07로 등록 완료
    40→
    41→#### 시나리오
    42→
    43→1. 매체사가 캠페인 관리 > 등록 버튼을 클릭한다
    44→2. 상단에 단계 표시: **1.기본 정보 → 2.매체 및 기간 → 3.예산 및 확인**
    45→
    46→**Step 1: 기본 정보**
    47→3. 캠페인명을 입력한다 (필수)
    48→4. 광고주를 선택한다 (드롭다운 단일 선택, 필수)
    49→   - 옆에 [신규 등록] 버튼 → 광고주 등록 모달 → 등록 완료 시 자동 선택
    50→5. 광고대행사를 입력한다 (텍스트 직접 입력, 선택)
    51→6. 캠페인 유형을 선택한다 (필수, 단일): 직접판매 / 자사광고 / 필러 / 네이버
    52→7. 광고 유형을 선택한다 (단일)
    53→8. [다음] 버튼을 클릭한다
    54→
    55→**Step 2: 매체 및 기간**
    56→9. 대상 매체를 선택한다 (개별 매체 또는 매체 그룹, 복수 선택, 최소 1개 필수)
    57→10. 집행 기간을 설정한다 (시작일·종료일, 필수)
    58→11. [다음] 버튼을 클릭한다
    59→
    60→**Step 3: 예산 및 확인**
    61→12. 과금 모델을 선택한다 (단일): 정액제 / 일단가 / 입력안함
    62→13. 과금 모델 선택 시 집행 금액을 입력한다 ("입력안함" 선택 시 미표시)
    63→14. 전체 입력 내용을 확인한다
    64→15. [등록] 버튼을 클릭한다
    65→16. 시스템이 캠페인을 "초안" 상태로 생성한다
    66→
    67→#### 이런 경우에는
    68→
    69→- **필수 ...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/05-scheduling-management.md"
}
```

**Result:**

```
     1→# 편성 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→광고 소재를 재생목록으로 구성하고, 편성표를 통해 매체에 배정하여 송출한다. 기본은 루프 기반 반복 재생이며, 특정 구좌를 네이버 Ad Server와 연동하여 프로그래매틱 동작도 가능하다.
     6→
     7→**핵심 흐름**: 소재 선택 → 재생목록 구성 → 편성표 생성(매체 배정 + 기간) → 매체에서 반복 재생
     8→
     9→---
    10→
    11→## 2. 페르소나 & 권한
    12→
    13→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    14→|------|:------:|:------:|:----------:|:----------:|
    15→| 재생목록 생성/수정/삭제 | O | O | O (권한 범위 내) | X |
    16→| 편성표 생성/수정/삭제 | O | O | O (권한 범위 내) | X |
    17→| 네이버 연동 구좌 설정 | O | O | O (권한 범위 내) | X |
    18→| 편성 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    19→
    20→> 영업대행사는 편성 관련 기능 접근 불가 (확정 의사결정).
    21→
    22→---
    23→
    24→## 3. 시나리오 목록
    25→
    26→| ID | 시나리오명 | Actor |
    27→|----|----------|-------|
    28→| UC-21 | 재생목록 생성 | 매체사, 운영대행사 |
    29→| UC-22 | 편성표 생성 | 매체사, 운영대행사 |
    30→| UC-23 | 네이버 Ad Server 연동 구좌 설정 | 어드민, 매체사, 운영대행사 |
    31→| UC-24 | 편성 충돌 감지 및 해소 | 어드민, 매체사, 운영대행사 |
    32→| UC-25 | 편성표 적용/종료 | 시스템 (자동) / 매체사, 운영대행사 |
    33→
    34→---
    35→
    36→## 4. 상세 시나리오
    37→
    38→### UC-21: 재생목록 생성
    39→
    40→**누가**: 매체사 또는 운영대행사
    41→**언제**: 매체에 송출할 소재들의 재생 순서를 구성할 때
    42→**전제조건**: 로그인 상태. "검수완료" 상태의 소재가 1개 이상 존재 (UC-14 완료)
    43→
    44→#### 시나리오
    45→
    46→1. 매체사가 편성 관리 > 재생목록 > 새 목록 버튼을 클릭한다
    47→2. 재생목록명을 입력한다 (필수)
    48→3. 소재를 추가한다:
    49→   - 소재 목록에서 "검수완료" 상태의 소재만 표시
    50→   - 드래그&드롭으로 순서 배치
    51→   - 각 소재가 하나의 구좌(Slot)를 차지
    52→4. 구좌 순서를 조정한다 (드래그&드롭)
    53→5. 저장 버튼을 클릭한다
    54→
    55→#### 이런 경우에는
    56→
    57→- **검수완료 소재가 0건**: "사용 가능한 소재가 없습니다. 먼저 소재를 업로드하고 검수를 완료해주세요" 안내
    58→- **동일 소재를 복수 구좌에 배치**: 허용. 같은 소재가 여러 번 반복 재생 가능
    59→- **재생목록에 소재 0건인 상태로 저장 시도**: "최소 1개의 소재를 추가해주세요" 안내
    60→- **재생목록에 포함된 소재가 이후 삭제됨**: 해당 구좌가 "삭제됨" 상태로 전환. 빨간 점선 테두리 + "소재 삭제됨 — 교체 필요" 라벨 표시. "교체" 버튼으로 즉시 대체 가능. 재생 시 해당 구좌 스킵. 편성 관리자에게 알림 발송
    61→
    62→#### 결과
    63→
    64→- 재생목록 레코드 생성: 소재 배치 순서(구좌) 포함
    65→- 이 재생목록은 UC-22(편성표)에서 매체에 배정 가능
    66→
 ...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/02-media-management.md"
}
```

**Result:**

```
     1→# 매체 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS에서 매체사(회사)와 매체(디스플레이 장비)를 등록·설정·모니터링한다. 매체사 등록은 어드민 전용이며, 매체 등록은 매체사와 운영대행사도 가능하다. 매체-디바이스 연동, SSP 연동, 유동인구 데이터 연결까지 포함한다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 매체사 등록/삭제 | O | X | X | X |
    14→| 매체사 정보 수정 | O | O (변경 불가 필드 제외) | X | X |
    15→| 매체 등록 | O (지원) | O (기본) | O (권한 범위 내) | X |
    16→| 매체 정보 수정 | O | O | O (권한 범위 내) | X |
    17→| 매체 활성/비활성 | O | O | O (권한 범위 내) | X |
    18→| 플레이어 연결 시점 수정 | O | X | X | X |
    19→| 유동인구 데이터 연결 | O | X | X | X |
    20→| SSP 연동 설정 | O | O | O | X |
    21→
    22→---
    23→
    24→## 3. 시나리오 목록
    25→
    26→| ID | 시나리오명 | Actor |
    27→|----|----------|-------|
    28→| UC-06 | 어드민이 매체사 등록 | 어드민 |
    29→| UC-07 | 매체사가 매체 등록 | 매체사, 운영대행사 |
    30→| UC-08 | 매체-디바이스 연동 | 매체사, 운영대행사 |
    31→| UC-09 | SSP 연동 설정 | 어드민, 매체사, 운영대행사 |
    32→| UC-10 | 유동인구 데이터 연결 | 어드민 |
    33→| UC-11 | 매체 헬스체크 모니터링 | 어드민, 매체사, 운영대행사 |
    34→| UC-12 | 매체 활성/비활성 전환 | 어드민, 매체사, 운영대행사 |
    35→
    36→---
    37→
    38→## 4. 상세 시나리오
    39→
    40→### UC-06: 어드민이 매체사 등록
    41→
    42→**누가**: 어드민
    43→**언제**: 신규 매체사를 CMS에 온보딩할 때
    44→**전제조건**: 어드민이 로그인된 상태
    45→
    46→#### 시나리오
    47→
    48→1. 어드민이 매체사 관리 > 등록 버튼을 클릭한다
    49→2. 필수 정보를 입력한다:
    50→   - 사업자등록번호
    51→   - 회사명
    52→   - 대표자명
    53→   - 담당자 연락처 (이메일, 전화번호)
    54→3. 선택 정보를 입력한다:
    55→   - 회사 주소
    56→   - 비고 (메모)
    57→4. 등록 버튼을 클릭한다
    58→5. 시스템이 매체사 식별 ID를 자동 발급한다
    59→6. 매체사 관리 목록에 신규 매체사가 표시된다
    60→
    61→#### 이런 경우에는
    62→
    63→- **사업자등록번호 중복**: "이미 등록된 매체사입니다" 안내 → 기존 매체사 상세로 이동 링크 표시
    64→- **필수 항목 누락**: 해당 필드 하이라이트 + 안내 메시지. 등록 버튼 비활성화
    65→- **사업자등록번호 형식 오류**: "올바른 사업자등록번호 형식(000-00-00000)을 입력해주세요" 안내
    66→
    67→#### 결과
    68→
    69→- 매체사 레코드 생성: 상태 "등록됨", 매체사 식별 ID 자동 발급
    70→- 이후 UC-01(초대)을 통해 매체사 담당자 계정 생성 가능
    71→
    72→---
    ...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/03-material-management.md"
}
```

**Result:**

```
     1→# 소재 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→광고 소재(이미지/영상)를 업로드하고, 자동/수동 검수를 거쳐 편성에 사용할 수 있도록 관리한다. 소재는 편성의 최소 재생 단위이다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 소재 업로드 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    14→| 소재 정보 수정 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    15→| 소재 삭제 | O | O | O (권한 범위 내) | O (권한 범위 내) |
    16→| 소재 목록 조회 | O (전체) | O (본인 매체사) | O (부여받은 매체) | O (권한에 따라: 전체 또는 본인 소속) |
    17→| 수동 검수 확인 | O | O | X | X |
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-13 | 소재 업로드 | 매체사, 운영대행사, 영업대행사 |
    26→| UC-14 | 소재 자동 검수 | 시스템 |
    27→| UC-15 | 소재 수동 검수 확인 | 어드민, 매체사 |
    28→| UC-16 | 소재 상태 관리 (교체/삭제) | 매체사, 운영대행사, 영업대행사 |
    29→
    30→---
    31→
    32→## 4. 상세 시나리오
    33→
    34→### UC-13: 소재 업로드
    35→
    36→**누가**: 매체사, 운영대행사 또는 영업대행사
    37→**언제**: 광고 소재를 CMS에 등록하여 편성에 사용하고자 할 때
    38→**전제조건**: 로그인 상태. 소속 매체사에 등록된 매체가 1개 이상 존재
    39→
    40→#### 시나리오
    41→
    42→1. 매체사가 소재 관리 > 업로드 버튼을 클릭한다
    43→2. 파일을 선택한다 (드래그&드롭 또는 파일 탐색기)
    44→3. 시스템이 파일 기본 검증을 수행한다:
    45→   - 허용 파일 형식 (이미지: JPG, PNG / 영상: MP4, MOV)
    46→   - 최대 파일 크기
    47→4. 메타데이터를 입력한다:
    48→   - 소재명 (필수)
    49→   - 광고주 (선택)
    50→   - 재생 시간 — 영상: 파일에서 자동 추출, 이미지: 직접 입력 (필수)
    51→   - 대상 해상도 (필수)
    52→   - 비고 (선택)
    53→5. 업로드 버튼을 클릭한다
    54→6. 시스템이 파일을 저장하고 UC-14(자동 검수)를 트리거한다
    55→7. 소재 상태가 "검수중"으로 표시된다
    56→
    57→#### 이런 경우에는
    58→
    59→- **허용되지 않은 파일 형식**: "지원하지 않는 파일 형식입니다. JPG, PNG, MP4, MOV만 업로드 가능합니다" 안내
    60→- **파일 크기 초과**: "파일 크기가 제한(XXX MB)을 초과합니다" 안내
    61→- **동일 파일명 업로드**: 시스템이 자동으로 파일명 뒤에 넘버링 부여 (예: 광고A_2.mp4)
    62→- **복수 파일 동시 업로드**: 일괄 업로드 지원. 각 파일별 메타데이터 개별 입력 또는 일괄 적용
    63→- **영상 파일의 코덱이 지원되지 않는 경우**: "지원하지 않는 코덱입니다" 안내. 업로드 차단
    64→- **영업대행사의 접근 범위 밖 소재 업로드 시도**: 해당 매체사의 소재 관리 메뉴 자체가 표시되지 않음
    65→
 ...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/06-notification-management.md"
}
```

**Result:**

```
     1→# 알림 관리 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS 내에서 발생하는 주요 이벤트를 사용자에게 실시간으로 전달한다. 3개 채널(인앱, 브라우저 푸시, Slack)을 지원하며, 사용자별로 채널·카테고리 조합을 설정할 수 있다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 인앱 알림 수신 | O (전체) | O (본인 매체) | O (부여받은 매체) | O (권한 범위 내 소재) |
    14→| 브라우저 푸시 수신 | O | O | O | O |
    15→| 본인 알림 설정 변경 | O | O | O | O |
    16→| Slack Webhook 관리 | O | X | X | X |
    17→| Slack 채널 매핑 설정 | O | X | X | X |
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-26 | 인앱 알림 수신 및 읽음 처리 | 모든 페르소나 |
    26→| UC-27 | 브라우저 푸시 권한 설정 | 모든 페르소나 |
    27→| UC-28 | Slack Webhook 설정 | 어드민 |
    28→
    29→---
    30→
    31→## 4. 상세 시나리오
    32→
    33→### UC-26: 인앱 알림 수신 및 읽음 처리
    34→
    35→**누가**: 모든 페르소나 (어드민, 매체사, 운영대행사, 영업대행사)
    36→**언제**: CMS 사용 중 이벤트가 발생하거나, 알림 센터를 확인할 때
    37→**전제조건**: 로그인 상태
    38→
    39→#### 시나리오
    40→
    41→1. CMS 이벤트 발생 시 시스템이 해당 수신 대상에게 인앱 알림을 생성한다
    42→2. 헤더의 bell 아이콘에 안 읽은 알림 수 배지가 표시된다
    43→3. 사용자가 bell 아이콘을 클릭하면 알림 센터가 열린다
    44→4. 알림 목록이 최신순으로 표시된다:
    45→   - 안 읽은 알림: 강조 표시
    46→   - 읽은 알림: 일반 표시
    47→5. 알림을 클릭하면:
    48→   - 해당 알림이 "읽음" 처리된다
    49→   - 관련 화면으로 이동한다 (예: 캠페인 상세, 소재 상세 등)
    50→6. "전체 읽음" 버튼으로 모든 알림을 일괄 읽음 처리할 수 있다
    51→
    52→#### 이런 경우에는
    53→
    54→- **알림 수신 대상이 오프라인(비로그인)**: 알림 레코드는 생성됨. 다음 로그인 시 확인 가능
    55→- **90일 경과한 알림**: 자동 삭제 (보존 기간: 90일)
    56→- **영업대행사의 알림**: 소재 관련 이벤트(검수 완료, 검수 실패)만 수신
    57→- **대량 알림 발생 (매체 100대 동시 오프라인 등)**: 동일 카테고리 알림을 그룹핑하여 "N건의 매체 오프라인" 형태로 표시
    58→
    59→#### 이벤트 카탈로그
    60→
    61→| 카테고리 | 이벤트 | 기본 채널 | 수신 대상 |
    62→|---------|--------|----------|----------|
    63→| 소재 검수 | 검수 완료 | 인앱 | 소재 등록자 |
    64→| 소재 검수 | 검수 실패 | 인앱, 브라우저 푸시 | 소재 등록자 |
    65→| 소재 검수 | 사용자 확인 필요 | 인앱 | 검수 권한자 |
    66→| 매체 상태 | 매체 오프라인 | 인앱, 브라우저 푸시, Slack | 매체 관리자 ...
```

**Tool:** `Read`

```json
{
  "file_path": "/Users/yeonsu/2026/bari-design/docs/scenarios/07-dashboard-report.md"
}
```

**Result:**

```
     1→# 대시보드/리포트 시나리오
     2→
     3→## 1. 개요
     4→
     5→CMS의 전체 운영 현황을 대시보드로 시각화하고, 정기/수동 리포트를 생성·발송한다. 매체 상태, 캠페인 현황, 편성 상태, 알림 요약 등을 한눈에 파악할 수 있다.
     6→
     7→---
     8→
     9→## 2. 페르소나 & 권한
    10→
    11→| 기능 | 어드민 | 매체사 | 운영대행사 | 영업대행사 |
    12→|------|:------:|:------:|:----------:|:----------:|
    13→| 대시보드 조회 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    14→| 리포트 생성/예약 | O | O | O (권한 범위 내) | X |
    15→| 리포트 조회/다운로드 | O (전체) | O (본인 매체) | O (부여받은 매체) | X |
    16→
    17→> 영업대행사는 대시보드/리포트 기능에 접근 불가 (소재 도메인만 접근 가능).
    18→
    19→---
    20→
    21→## 3. 시나리오 목록
    22→
    23→| ID | 시나리오명 | Actor |
    24→|----|----------|-------|
    25→| UC-29 | 대시보드 현황 조회 | 어드민, 매체사, 운영대행사 |
    26→| UC-30 | 리포트 생성 및 예약 발송 | 어드민, 매체사, 운영대행사 |
    27→| UC-31 | 리포트 조회/다운로드 | 어드민, 매체사, 운영대행사 |
    28→
    29→---
    30→
    31→## 4. 상세 시나리오
    32→
    33→### UC-29: 대시보드 현황 조회
    34→
    35→**누가**: 어드민, 매체사 또는 운영대행사
    36→**언제**: CMS 로그인 직후 또는 운영 현황을 확인할 때
    37→**전제조건**: 로그인 상태
    38→
    39→#### 시나리오
    40→
    41→1. 어드민, 매체사 또는 운영대행사가 CMS에 로그인하면 대시보드가 기본 화면으로 표시된다
    42→2. 대시보드에 다음 위젯이 표시된다:
    43→   - **매체 상태 요약**: 전체/온라인/오프라인/비활성 매체 수
    44→   - **캠페인 현황**: 초안/집행중/완료/취소 건수
    45→   - **편성 상태**: 예약됨/적용중/종료 건수
    46→   - **최근 알림**: 안 읽은 알림 상위 5건
    47→   - **매체 헬스체크 이상**: 이상 감지 매체 목록
    48→3. 각 위젯을 클릭하면 해당 상세 화면으로 이동한다
    49→4. 기간 필터를 적용하여 특정 기간의 현황을 확인할 수 있다
    50→
    51→#### 이런 경우에는
    52→
    53→- **매체사 사용자**: 본인 매체 관련 데이터만 표시
    54→- **운영대행사**: 부여받은 매체 관련 데이터만 표시
    55→- **데이터 없음 (신규 매체사)**: 각 위젯에 "아직 데이터가 없습니다" 안내
    56→
    57→#### 결과
    58→
    59→- 권한 범위 내 운영 현황 시각화
    60→
    61→---
    62→
    63→### UC-30: 리포트 생성 및 예약 발송
    64→
    65→**누가**: 어드민, 매체사 또는 운영대행사
    66→**언제**: 운영 실적 리포트를 생성하거나 정기 발송을 예약할 때
    67→**전제조건**: 로그인 상태. 리포트 대상 데이터 존재
    68→
    69→#### 시나리오 A — 수동 리포트 생성
    70→
    71→1. 어드민, 매체사 또는 운영대행사가 리포트 > 새 리포트 버튼을 클릭한다
    72→2. 리포트 유형을 선택한다:
    73→   - 매체 운영 리포트 (매체별 온라인 시간, 재생 횟수 등)
    74→   - 캠페인 실적 리포...
```
