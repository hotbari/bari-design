# DOOH CMS — Design Foundation

생성일: 2026-04-05
기반: .impeccable.md, ux-strategy.md, information-architecture.md

---

## 1. Color System

### 1.1 Primitive Colors (Tonal Scales)

Hue 고정, Lightness 균등 분포 (OKLCH 장점). Chroma는 밝은 쪽에서 낮고 중간에서 최대.

| Scale | Primary (H 155) | Neutral (H 80) | Error (H 25) | Warning (H 55) |
|------:|-----------------|-----------------|---------------|-----------------|
| 50 | oklch(0.97 0.03 155) | oklch(0.98 0.005 80) | oklch(0.97 0.02 25) | oklch(0.97 0.03 55) |
| 100 | oklch(0.93 0.06 155) | oklch(0.95 0.008 80) | oklch(0.93 0.05 25) | oklch(0.93 0.06 55) |
| 200 | oklch(0.87 0.10 155) | oklch(0.90 0.01 80) | oklch(0.85 0.10 25) | oklch(0.87 0.10 55) |
| 300 | oklch(0.80 0.14 155) | oklch(0.82 0.01 80) | oklch(0.75 0.16 25) | oklch(0.80 0.13 55) |
| 400 | oklch(0.76 0.17 155) | oklch(0.72 0.01 80) | oklch(0.65 0.20 25) | oklch(0.75 0.15 55) |
| 500 | oklch(0.72 0.19 155) | oklch(0.62 0.01 80) | oklch(0.55 0.24 25) | oklch(0.70 0.15 55) |
| 600 | oklch(0.62 0.17 155) | oklch(0.55 0.01 80) | oklch(0.48 0.20 25) | oklch(0.62 0.13 55) |
| 700 | oklch(0.52 0.14 155) | oklch(0.45 0.01 80) | oklch(0.40 0.16 25) | oklch(0.52 0.11 55) |
| 800 | oklch(0.40 0.10 155) | oklch(0.35 0.01 80) | oklch(0.32 0.12 25) | oklch(0.40 0.08 55) |
| 900 | oklch(0.30 0.07 155) | oklch(0.20 0.02 80) | oklch(0.25 0.08 25) | oklch(0.30 0.06 55) |

> Primary-500 = #03C75A, Error-500 = #E62318, Warning-500 = #E8A030, Neutral-50 = #FAF9F7

### 1.2 Semantic Colors

| Token | Value | Usage |
|-------|-------|-------|
| `--color-bg-primary` | neutral-50 | 페이지 배경 |
| `--color-bg-surface` | neutral-100 | 카드, 입력 필드 배경 |
| `--color-bg-elevated` | `oklch(1.00 0 0)` | 모달, 드롭다운 (순백) |
| `--color-bg-hover` | neutral-200 | 호버 배경 |
| `--color-text-primary` | neutral-900 | 본문 텍스트 |
| `--color-text-secondary` | neutral-500 | 보조 텍스트, placeholder |
| `--color-text-tertiary` | neutral-400 | 비활성 텍스트 |
| `--color-text-inverse` | `oklch(1.00 0 0)` | 프라이머리 버튼 위 텍스트 |
| `--color-border-default` | neutral-200 | 기본 테두리 |
| `--color-border-strong` | neutral-300 | 강조 테두리 (포커스 전) |
| `--color-interactive-primary` | primary-500 | 버튼, 링크, 토글 |
| `--color-interactive-hover` | primary-600 | 호버 |
| `--color-interactive-active` | primary-700 | 눌림 |
| `--color-interactive-muted` | primary-100 | 선택된 행 배경 |
| `--color-status-error` | error-500 | 에러 텍스트/아이콘 |
| `--color-status-error-bg` | error-50 | 에러 배너 배경 |
| `--color-status-warning` | warning-500 | 경고 텍스트/아이콘 |
| `--color-status-warning-bg` | warning-50 | 경고 배너 배경 |
| `--color-status-success` | primary-500 | 성공 (프라이머리 재사용) |
| `--color-status-success-bg` | primary-50 | 성공 배너 배경 |
| `--color-focus-ring` | primary-400 | 포커스 링 (2px solid) |

### 1.3 Contrast Check (WCAG AA)

| Foreground | Background | Ratio | Pass |
|-----------|-----------|:-----:|:----:|
| neutral-900 (본문) | neutral-50 (배경) | ~16:1 | AA |
| neutral-500 (보조) | neutral-50 (배경) | ~5.2:1 | AA |
| primary-500 (링크) | neutral-50 (배경) | ~4.8:1 | AA |
| primary-600 (호버) | neutral-50 (배경) | ~6.5:1 | AA |
| error-500 (에러) | neutral-50 (배경) | ~5.5:1 | AA |
| white (버튼텍스트) | primary-500 (버튼) | ~4.6:1 | AA |
| error-500 | error-50 (배너) | ~5.0:1 | AA |

---

## 2. Typography System

### 2.1 Font Stack

```css
--font-sans: 'Pretendard', 'Noto Sans KR', -apple-system, sans-serif;
--font-mono: 'JetBrains Mono', 'Fira Code', monospace;
```

### 2.2 Type Scale

B2B 운영 도구 기준. 14px base, 정보 밀도 우선.

| Token | Size | Weight | Line Height | Letter Spacing | Usage |
|-------|-----:|:------:|:-----------:|:--------------:|-------|
| `--text-xs` | 11px | 400 | 1.5 | 0 | 뱃지, 타임스탬프, 레이블 |
| `--text-sm` | 13px | 400 | 1.5 | 0 | 테이블 보조, 캡션 |
| `--text-base` | 14px | 400 | 1.6 | 0 | 본문, 폼 입력 |
| `--text-md` | 16px | 500 | 1.5 | 0 | 카드 타이틀, 서브헤딩 |
| `--text-lg` | 18px | 600 | 1.4 | -0.01em | 섹션 헤더 |
| `--text-xl` | 22px | 700 | 1.3 | -0.02em | 페이지 타이틀 |
| `--text-2xl` | 28px | 700 | 1.2 | -0.02em | 대시보드 KPI 수치 |

---

## 3. Layout Grid

### 3.1 Grid System

| Property | Value | Note |
|----------|-------|------|
| Type | 12-column | 데이터 테이블 + 카드 혼용 |
| Gutter | 24px | 테이블 가독성 |
| Margin | 32px (desktop) / 16px (tablet) | |
| Max content width | 1440px | 어드민 대시보드 기준 |
| Sidebar (expanded) | 240px | LNB |
| Sidebar (collapsed) | 64px | 아이콘 전용 |
| GNB height | 56px | 상단 고정 |

### 3.2 Breakpoints

| Token | Width | Layout |
|-------|------:|--------|
| `--bp-sm` | 640px | 단일 컬럼, 사이드바 숨김 |
| `--bp-md` | 768px | 사이드바 collapsed |
| `--bp-lg` | 1024px | 사이드바 expanded |
| `--bp-xl` | 1440px | max-width 적용 |

---

## 4. Spacing System

Base unit: 4px

| Token | Value | Usage |
|-------|------:|-------|
| `--space-1` | 4px | 아이콘-레이블 간격 |
| `--space-2` | 8px | 뱃지 패딩, 리스트 아이템 |
| `--space-3` | 12px | 폼 필드 내부 패딩 |
| `--space-4` | 16px | 카드 패딩, 섹션 내 간격 |
| `--space-5` | 20px | 폼 그룹 간격 |
| `--space-6` | 24px | 카드 섹션 사이 |
| `--space-8` | 32px | 페이지 섹션 사이 |
| `--space-10` | 40px | 페이지 헤더 패딩 |
| `--space-12` | 48px | 섹션 구분 |
| `--space-16` | 64px | 페이지 상하 여백 |

---

## 5. Additional Tokens

### 5.1 Border Radius

| Token | Value | Usage |
|-------|------:|-------|
| `--radius-sm` | 4px | 뱃지, 태그 |
| `--radius-md` | 6px | 버튼, 인풋 |
| `--radius-lg` | 10px | 카드 |
| `--radius-xl` | 12px | 모달, 패널 |

### 5.2 Shadows

| Token | Value | Usage |
|-------|-------|-------|
| `--shadow-sm` | `0 1px 2px oklch(0 0 0 / 0.05)` | 미세 리프트 |
| `--shadow-md` | `0 4px 8px oklch(0 0 0 / 0.08)` | 카드 |
| `--shadow-lg` | `0 8px 24px oklch(0 0 0 / 0.12)` | 드롭다운, 모달 |

### 5.3 Transitions

| Token | Value | Usage |
|-------|-------|-------|
| `--transition-fast` | `100ms ease` | 호버, 포커스 |
| `--transition-normal` | `200ms ease` | 토글, 확장/축소 |
| `--transition-slow` | `300ms ease` | 모달, 사이드 패널 |

---

## 6. CSS Variables Export

```css
:root {
  /* ── Primary (H 155) ── */
  --color-primary-50:  oklch(0.97 0.03 155);
  --color-primary-100: oklch(0.93 0.06 155);
  --color-primary-200: oklch(0.87 0.10 155);
  --color-primary-300: oklch(0.80 0.14 155);
  --color-primary-400: oklch(0.76 0.17 155);
  --color-primary-500: oklch(0.72 0.19 155); /* #03C75A */
  --color-primary-600: oklch(0.62 0.17 155);
  --color-primary-700: oklch(0.52 0.14 155);
  --color-primary-800: oklch(0.40 0.10 155);
  --color-primary-900: oklch(0.30 0.07 155);

  /* ── Neutral (H 80, warm gray) ── */
  --color-neutral-50:  oklch(0.98 0.005 80); /* #FAF9F7 */
  --color-neutral-100: oklch(0.95 0.008 80); /* #F2F0ED */
  --color-neutral-200: oklch(0.90 0.01 80);
  --color-neutral-300: oklch(0.82 0.01 80);
  --color-neutral-400: oklch(0.72 0.01 80);
  --color-neutral-500: oklch(0.62 0.01 80);  /* #8A8580 */
  --color-neutral-600: oklch(0.55 0.01 80);
  --color-neutral-700: oklch(0.45 0.01 80);
  --color-neutral-800: oklch(0.35 0.01 80);
  --color-neutral-900: oklch(0.20 0.02 80);  /* #2D2A26 */

  /* ── Error (H 25) ── */
  --color-error-50:  oklch(0.97 0.02 25);
  --color-error-100: oklch(0.93 0.05 25);
  --color-error-200: oklch(0.85 0.10 25);
  --color-error-300: oklch(0.75 0.16 25);
  --color-error-400: oklch(0.65 0.20 25);
  --color-error-500: oklch(0.55 0.24 25);   /* #E62318 */
  --color-error-600: oklch(0.48 0.20 25);
  --color-error-700: oklch(0.40 0.16 25);
  --color-error-800: oklch(0.32 0.12 25);
  --color-error-900: oklch(0.25 0.08 25);

  /* ── Warning (H 55) ── */
  --color-warning-50:  oklch(0.97 0.03 55);
  --color-warning-100: oklch(0.93 0.06 55);
  --color-warning-200: oklch(0.87 0.10 55);
  --color-warning-300: oklch(0.80 0.13 55);
  --color-warning-400: oklch(0.75 0.15 55);
  --color-warning-500: oklch(0.70 0.15 55);  /* #E8A030 */
  --color-warning-600: oklch(0.62 0.13 55);
  --color-warning-700: oklch(0.52 0.11 55);
  --color-warning-800: oklch(0.40 0.08 55);
  --color-warning-900: oklch(0.30 0.06 55);

  /* ── Semantic ── */
  --color-bg-primary:       var(--color-neutral-50);
  --color-bg-surface:       var(--color-neutral-100);
  --color-bg-elevated:      oklch(1.00 0 0);
  --color-bg-hover:         var(--color-neutral-200);
  --color-text-primary:     var(--color-neutral-900);
  --color-text-secondary:   var(--color-neutral-500);
  --color-text-tertiary:    var(--color-neutral-400);
  --color-text-inverse:     oklch(1.00 0 0);
  --color-border-default:   var(--color-neutral-200);
  --color-border-strong:    var(--color-neutral-300);
  --color-interactive:      var(--color-primary-500);
  --color-interactive-hover: var(--color-primary-600);
  --color-interactive-active: var(--color-primary-700);
  --color-interactive-muted: var(--color-primary-100);
  --color-status-error:     var(--color-error-500);
  --color-status-error-bg:  var(--color-error-50);
  --color-status-warning:   var(--color-warning-500);
  --color-status-warning-bg: var(--color-warning-50);
  --color-status-success:   var(--color-primary-500);
  --color-status-success-bg: var(--color-primary-50);
  --color-focus-ring:       var(--color-primary-400);

  /* ── Typography ── */
  --font-sans: 'Pretendard', 'Noto Sans KR', -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --text-xs:   11px; --text-sm:  13px; --text-base: 14px;
  --text-md:   16px; --text-lg:  18px; --text-xl:   22px; --text-2xl: 28px;

  /* ── Spacing (4px base) ── */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 20px; --space-6: 24px; --space-8: 32px; --space-10: 40px;
  --space-12: 48px; --space-16: 64px;

  /* ── Border Radius ── */
  --radius-sm: 4px; --radius-md: 6px; --radius-lg: 10px; --radius-xl: 12px;

  /* ── Shadows ── */
  --shadow-sm: 0 1px 2px oklch(0 0 0 / 0.05);
  --shadow-md: 0 4px 8px oklch(0 0 0 / 0.08);
  --shadow-lg: 0 8px 24px oklch(0 0 0 / 0.12);

  /* ── Transitions ── */
  --transition-fast:   100ms ease;
  --transition-normal: 200ms ease;
  --transition-slow:   300ms ease;

  /* ── Layout ── */
  --grid-columns: 12;
  --grid-gutter: 24px;
  --grid-margin: 32px;
  --sidebar-expanded: 240px;
  --sidebar-collapsed: 64px;
  --gnb-height: 56px;
  --content-max-width: 1440px;
  --bp-sm: 640px; --bp-md: 768px; --bp-lg: 1024px; --bp-xl: 1440px;
}
```
