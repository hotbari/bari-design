---
name: design-review
description: "구현 단계(코드 후, 라이브 UI) 디자인 평가 — Playwright 스크린샷 기반으로 AI Slop 탐지, Nielsen 휴리스틱/Audit 채점, 리포트 생성, 코드 수정, polish까지 완전한 품질 개선 사이클. 설계 단계(명세·목업) 평가는 /critique를 사용할 것."
argument-hint: "[url (default: localhost:3000)] [area (optional: component or section name)]"
user-invocable: true
---

# Design Review

## Context

$ARGUMENTS — target URL and optional area to focus on. Defaults to `http://localhost:3000`, full page.

This skill orchestrates a complete design quality evaluation and improvement cycle for frontend interfaces. It combines automated browser inspection via Playwright with structured AI Slop detection, Nielsen heuristics scoring, and technical audit — then applies targeted fixes using `frontend-design-impeccable` principles.

---

## Domain Context

- **AI Slop 문제**: 제네릭 컨테이너, 기계적 색상 시스템, 기본 폰트 페어링, 의도 없는 공간감은 "기억에 남지 않는 인터페이스"의 가장 큰 원인이다. 제품의 독자성을 지우고 모든 AI 생성 인터페이스를 동일하게 만든다.
- **코드 분석의 한계**: 코드만 읽어서는 잡히지 않는 렌더링 이슈(폰트 로딩 실패, 실제 색상 대비, 레이아웃 깨짐)가 존재한다. Playwright 스크린샷 기반 평가가 필수인 이유다.
- **Nielsen 점수 현실**: 40점 중 20–32가 현실적 범위. 32+ = 눈에 띄게 좋은 UI. 이 점수를 목표로 삼는다.
- **Audit 점수 현실**: 20점 중 14–17이 Good 범위. 18+ = Excellent. 10 미만이면 시스템 수준 문제다.
- **수정 우선순위**: P0/P1은 릴리스 전 반드시 수정. P2는 다음 이터레이션. P3는 시간이 있을 때.

---

## Instructions

### 1. MANDATORY PREP — Load Design Principles

Before anything else, load the frontend design principles:

Read `.claude/bari-skills/frontend-design-impeccable/SKILL.md` to internalize:
- The full AI Slop DON'T list (these are your fix criteria)
- Design principles you will apply during the fix phase

### 2. Dispatch design-evaluator Subagent

Dispatch the `design-evaluator` subagent with the following context:

```
Target URL: [url from $ARGUMENTS, default: http://localhost:3000]
Area: [area from $ARGUMENTS, default: "full page"]
Output directory: output/gate-d2_{date}/{HHmm}_design-eval-{target}/
Task: Run the complete evaluation protocol and write report.md to the output directory
```

The subagent will:
- Take Playwright screenshots into `output/gate-d2_{date}/{HHmm}_design-eval-{target}/`
- Read CSS, component files, design tokens via Glob/Grep/Read
- Run the AI Slop 4-item checklist
- Score Nielsen heuristics (0–4 × 10 = /40)
- Score Audit 5 dimensions (0–4 × 5 = /20)
- Write `report.md` to the output directory

Wait for the subagent to complete before proceeding.

### 3. Read Report

Read `output/gate-d2_{date}/{HHmm}_design-eval-{target}/report.md`.

### 4. Present Core Findings

Present a concise summary in this order:

**AI Slop Verdict** — PASS or FAIL with the specific tells found (N/4)

**Design Health: ??/40** — highlight the lowest 2-3 heuristic scores

**Audit Health: ??/20** — highlight the lowest 1-2 dimension scores

**P0/P1 Issues** — list each with file location and one-line description

Keep this presentation tight — the user will read the full report if they want detail.

### 5. Ask User: Scope and Priority

Ask these targeted questions (adapt based on actual findings — do NOT ask generic questions):

1. **Priority category**: Based on the actual issues found, ask which category to tackle first. Example: "AI Slop fixes (fonts + colors + spacing) vs. accessibility (P1 contrast issues) vs. visual hierarchy — which matters most right now?"

2. **Scope**: "Fix everything / P0–P1 only / specific area only?"

3. **Constraints** (only if relevant): "Is any part of the design intentionally as-is and should stay untouched?"

Keep to 2–3 questions maximum. If findings are very clear (1–2 dominant issues), skip questions and propose a concrete fix plan.

### 6. Apply Fixes

Based on the user's answers, apply targeted fixes using `frontend-design-impeccable` principles:

**For AI Slop issues:**
- Generic containers → apply varied `border-radius` by semantic purpose (cards ≠ badges ≠ inputs), vary `shadow` depth by elevation
- Mechanical colors → introduce brand hues using OKLCH, tint neutrals toward brand, add accent colors with purpose
- Default font pairing → replace Inter/Roboto with a distinctive display + body pair from Google Fonts or variable fonts
- Unintentional spacing → implement spatial rhythm: tight groupings (gap-1/gap-2) for related items, generous separations (gap-8/gap-12/gap-16) between sections

**For Nielsen/Audit issues:**
- Apply fixes in P0 → P1 → P2 order
- Cite the specific file:line from the report for each fix
- After each significant change, note what heuristic/dimension it addresses

**Approach:**
- Make focused, targeted edits — do not rewrite components unless necessary
- Preserve existing functionality while improving visual quality
- Use the actual `frontend-design-impeccable` reference files for specific technical guidance

### 7. Run Polish

After fixes are applied, invoke `{{command_prefix}}polish` to catch spacing/alignment/interaction-state details.

### 8. Optional Re-evaluation

Offer the user: "Run `/design-review` again to see before/after score comparison?"

If yes, dispatch `design-evaluator` again with the same URL and compare:
- AI Slop verdict change
- Nielsen score delta (??/40 → ??/40)
- Audit score delta (??/20 → ??/20)
- Which P0/P1 issues were resolved

---

## Further Reading

- Nielsen, J. (1994). *10 Usability Heuristics for User Interface Design*. Nielsen Norman Group.
- Moran, K. (2019). *Usability 101: Introduction to Usability*. Nielsen Norman Group.
- Smith, A. (2023). *The Problem with AI-Generated Design: Homogenization and the Loss of Brand Identity*. UX Collective.
- `.claude/bari-skills/frontend-design-impeccable/reference/` — color, typography, spacing, interaction reference docs
- `.claude/bari-skills/critique/reference/heuristics-scoring.md` — Nielsen scoring rubric details
- `.claude/bari-skills/audit/SKILL.md` — Audit dimension scoring criteria

> 사용자 관점 플로우 검증: `/cognitive-walkthrough`
