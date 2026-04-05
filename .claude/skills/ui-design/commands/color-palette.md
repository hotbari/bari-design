---
description: Generate a full color palette with semantic mapping and accessibility checks.
argument-hint: "[brand colors, mood, or requirements, e.g., '#3B82F6 primary blue, modern tech feel']"
---
# /color-palette
Generate a comprehensive color palette.
## Precondition
- `.impeccable.md`에 `## Color Palette` 섹션이 있으면 seed로 사용한다. `/color-taste`에서 생성된 초안이 여기에 저장되어 있을 수 있다.

## Steps
0. **Taste intake** — If input is missing or vague, first check `.impeccable.md` for an existing Color Palette section to use as seed. If none found, run `color-taste` skill to collect 3 inputs (positive reference / anti-reference / emotional keywords → OKLCH parameters). Skip if argument is already specific enough.
1. **Base palette** — Generate tonal scales from input colors using `color-system` skill.
2. **Semantic mapping** — Map colors to semantic roles (success, error, etc.) using `color-system` skill.
3. **Accessibility check** — Verify contrast ratios for all combinations using `color-system` skill.
4. **Dark mode** — Create dark mode color mappings using `dark-mode-design` skill.
5. **Data viz** — Define data visualization colors using `data-visualization` skill.
6. **Document** — Output the complete palette with usage guidance.
## Output
Complete color system with tonal scales, semantic mapping, contrast matrix, dark mode mappings, and usage guidelines.
Consider following up with `/design-screen` to apply the palette.