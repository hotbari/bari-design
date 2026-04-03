---
description: 기획/스펙 문서 간 모순, 누락, 엔티티 라이프사이클 미정의를 변증법적으로 분석합니다.
argument-hint: "[분석할 문서 경로 또는 디렉토리]"
---
# /spec-dialectic
Apply dialectical analysis to planning/specification documents — expose contradictions, define entity lifecycles as FSMs, and resolve gaps through Socratic inquiry.

## Steps

1. **Discovery** — Read ALL target documents. Build inventory table: entities, states, cross-references, open items (미결/검토 필요).

2. **Ontology** — Classify every entity: Core/Supporting, lifecycle YES/PARTIAL/NO, which documents define it. Ask ontological questions (distinct entity vs. state of another? essential vs. accidental attributes?).

3. **Lifecycle FSM** — For every entity with lifecycle YES or PARTIAL, produce a formal FSM using the template in SKILL.md:
   - States table (description, entry condition, allowed operations)
   - Transitions table (trigger, guard, effect, actor)
   - Invariants
   - Multi-axis composition table if applicable

3.5. **Entity Completeness Check** — Phase 2-3 산출물을 기반으로:
   - Sub-phase A: 권한-UC 매핑, 의존 완전성, 라이프사이클 미정의 검사 (항상)
   - Sub-phase B: 구현 디렉토리 스캔 (`prototype/` 등이 존재할 때만)
     → entity-coverage-scanner 에이전트 디스패치
   - 발견된 Gap을 Phase 5 질문 목록에 추가

4. **Dialectic Analysis** — Compare each entity across ALL documents. Detect contradiction types: state, transition, permission, existence, constraint, temporal. Record each as Thesis/Antithesis/Impact/Proposed synthesis.

5. **Socratic Inquiry** — Present all contradictions and ambiguities to the user. NEVER resolve on your own.
   - Quote specific sections from each document
   - State impact of leaving unresolved
   - Offer 2–3 options with trade-offs
   - Batch related questions per entity
   - Honor prior decisions; only re-ask if a decision creates NEW contradictions

6. **Synthesis** — After user answers:
   - Update FSMs with decisions
   - Check for new contradictions introduced by answers (iterate if found)
   - Produce **Analysis Report** (`spec-analysis-report.md`): entity catalog, FSMs, resolved contradictions, remaining gaps, cross-entity invariants, dependency graph
   - Propose **Document Fixes**: show diffs, get approval before applying

## Rules
- Read the ENTIRE document. Never skim.
- Undefined ≠ denied. Undefined = must ask.
- User decisions can create new contradictions. Always re-check after incorporating.
- Never silently change a document. Show intended changes and get approval.
- Group questions by entity but present critical blockers immediately.

## Output
Analysis report with entity FSMs, resolved contradictions, remaining gaps, and proposed document fixes.
