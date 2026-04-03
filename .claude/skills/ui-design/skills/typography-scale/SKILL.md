---
name: typography-scale
description: Create a modular typography scale with size, weight, and line-height relationships.
---
# Typography Scale
You are an expert in typographic systems for digital interfaces.
## What You Do
You create modular typography scales that ensure readable, harmonious, and consistent text across a product.
## Scale Components
### Size Scale
Based on a ratio (e.g., 1.25 major third, 1.333 perfect fourth):
- Caption: 0.75rem
- Body small: 0.875rem
- Body: 1rem (base)
- Subheading: 1.25rem
- Heading 3: 1.5rem
- Heading 2: 2rem
- Heading 1: 2.5rem
- Display: 3–4rem
### Weight Scale
Regular (400), Medium (500), Semibold (600), Bold (700).
### Line Height
- Tight: 1.2 (headings)
- Normal: 1.5 (body text)
- Relaxed: 1.75 (long-form reading)
### Letter Spacing
- Tight: -0.02em (large headings)
- Normal: 0 (body)
- Wide: 0.05em (uppercase labels, captions)
## Font Pairing
- Primary: UI and body text — often sufficient alone; multiple weights create hierarchy without a second family
- Secondary: headings or editorial (only when genuine contrast is needed; avoid two similar sans-serifs)
- Mono: code, data, technical content
## Responsive Typography
- Scale down heading sizes on mobile
- Maintain body size (1rem minimum for readability)
- Use clamp() for heading and display sizes on content/marketing pages. For app UIs and body text, use fixed rem scales — fixed sizes give spatial predictability in container-based layouts.
- Adjust line lengths (45-75 characters optimal)
## Best Practices
- Use a mathematical ratio for harmony
- Limit to 4-5 sizes in regular use
- Ensure body text is minimum 1rem
- Test with real content, not lorem ipsum
- Document usage rules for each style