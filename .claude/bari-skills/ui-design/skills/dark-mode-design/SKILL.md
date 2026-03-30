---
name: dark-mode-design
description: Design effective dark mode interfaces with proper color adaptation, contrast, and elevation.
---

# Dark Mode Design
You are an expert in designing dark mode interfaces that are comfortable, accessible, and production-ready.

## What You Do
You design dark mode experiences that go beyond simple color inversion, incorporating system behavior, user control, and visual hierarchy.

## Core Principles
* Reduce overall luminance to decrease eye strain
* Use surface elevation through lighter shades (not shadows)
* Desaturate bright colors for dark backgrounds
* Maintain sufficient contrast for readability
* Ensure consistency between light and dark mode semantics

## Surface Hierarchy (Dark Mode)
Dark mode relies on layered surfaces instead of shadows:
* **Background** — darkest base layer (e.g., #121212)
* **Surface 1** — slightly elevated (cards, sections)
* **Surface 2** — higher elevation (modals, dropdowns)
* **Surface 3** — highest elevation (tooltips, menus)
Each layer should be distinguishable through subtle luminance differences.

## Color Adaptation
* **Primary colors** — reduce saturation by 10–20%
* **Semantic colors (error, warning, success)** — adjust to maintain contrast on dark backgrounds
* **Text** — use off-white (e.g., #E0E0E0), not pure white (#FFFFFF)
* **Borders & dividers** — low-opacity white or neutral tones
* Avoid overly vibrant or neon-like colors

## Images and Media
* Slightly dim images to reduce glare
* Provide dark-mode-specific illustrations when possible
* Use light-on-dark logo variants
* Avoid large bright regions in imagery

## Accessibility
* Maintain minimum **4.5:1 contrast** for body text
* Maintain **3:1 contrast** for large text and UI components
* Do not rely on color alone to convey meaning
* Test with screen readers (ensure mode is announced if applicable)
* Validate across real dark environments

## Mode Switching (Theme Control)
Dark mode must support both system-driven and user-controlled behavior:
* Use system preference (`prefers-color-scheme`) as the default
* Provide a manual toggle for light/dark mode
* Persist user preference (e.g., local storage or account setting)
* Allow override of system preference
* Ensure no flash of incorrect theme on initial load (FOUC prevention)
* Sync theme correctly in server-rendered environments

### Interaction Guidelines
* Place toggle in a globally accessible location (e.g., header or settings)
* Clearly indicate current mode state
* Animate transitions smoothly between modes
* Avoid abrupt color flashing or layout shifts

## Implementation Considerations
* Use semantic design tokens for all colors (e.g., `bg-primary`, `text-secondary`)
* Avoid hardcoded color values
* Ensure all components support both modes before release
* Test all states (hover, active, disabled) in dark mode

## Best Practices
* Don’t invert — redesign with intent
* Test in real low-light environments
* Audit every component in dark mode
* Maintain parity between light and dark experiences
* Design the system, not just individual screens