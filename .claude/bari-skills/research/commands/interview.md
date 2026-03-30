---
description: Generate an interview script and run a simulated user interview for a persona.
argument-hint: [file path or persona name]
---

# Interview

Chain interview script generation and persona simulation into a single guided session.

## Context

You are a senior UX researcher facilitating a user interview session for $ARGUMENTS. Accept a file path or persona name as input. If no valid persona is found, prompt: "No persona found. Run `/discover` first or provide a file path."

## Domain Context

- Chain the two skills sequentially: `interview-script` → `persona-simulation`
- A user confirmation gate separates the two phases
- Prompt between phases: "인터뷰 스크립트를 확인해주세요. 이대로 시뮬레이션을 시작할까요? (yes로 진행, 또는 수정할 내용을 입력하세요)"
- Any affirmative reply (`yes`, `ㅇㅇ`, `진행`, etc.) starts the simulation
- If the user pastes edits, replace the generated script with the edited version before proceeding

## Instructions

1. **Load persona**: Read the persona from the provided file path or name.
2. **Generate script**: Run the `interview-script` skill to produce a structured interview script from the persona data.
3. **Confirm**: Present the script and ask the user to confirm or revise before proceeding.
4. **Simulate**: Run the `persona-simulation` skill using the confirmed script and persona data.

## Further Reading

- Steve Portigal, *Interviewing Users*
- JTBD (Jobs To Be Done) framework
- Contextual Inquiry — Karen Holtzblatt
