```
name: persona-simulation
description: Simulate a user interview by embodying a persona and answering questions in first person. Use after interview-script to validate persona assumptions through structured dialogue.
```

**Purpose:** 
Claude embodies the persona and responds to interview questions in first person.

**Input:** Persona data + generated interview script. `docs/research/personas/` 에 저장된 페르소나 파일이 있으면 자동으로 로드한다. 없으면 사용자에게 페르소나 정보를 요청한다.

**Behavior:**
- Claude adopts the persona's age, occupation, goals, frustrations, speech style
- Presents script questions one at a time
- Answers AS the persona (first-person, in character)
- After each answer, user may ask follow-up questions before moving to the next
- End signals: `끝`, `종료`, `/end` (Korean signals included as the primary user runs sessions in Korean)
- On end signal: print insight summary inline to the conversation, and also save it to `docs/research/insights/{date}_{topic}.md`

**Insight Summary (inline output):**
- Responses that differed from persona definition
- Hypotheses validated by simulation
- Contradictions or gaps found
- Areas needing further real-user research
