# Visual Vitality Reference

5가지 "밋밋한 UI" 증후군 — 진단, 처방, 체크 기준.
프로젝트 비종속적. 어떤 도메인에든 적용 가능.

---

## Syndrome 1 — 균일 여백 (Uniform Spacing)

**진단**: 모든 요소에 동일한 `gap`/`padding` 값이 적용되어 있다. 중요도 차이가 여백에서 보이지 않는다.

**문제 CSS 패턴**
```css
/* 모든 카드가 동일한 여백 */
.card { padding: 16px; }
.section { gap: 16px; }
.list-item { padding: 12px 16px; }
```

**처방**
```css
/* 중요도에 따라 여백 차등 */
.card--featured { padding: 24px 28px; }   /* 주인공: 더 넓게 */
.card--regular  { padding: 14px 16px; }   /* 조연: 기본 */
.card--compact  { padding: 8px 12px; }    /* 배경: 빡빡하게 */

/* 섹션 간 간격 > 섹션 내부 간격 (3:1 이상 비율) */
.page-section { gap: 40px; }
.section-content { gap: 12px; }
```

**체크 기준**: 페이지에서 가장 중요한 요소의 여백이 나머지보다 50% 이상 넓은가?

---

## Syndrome 2 — 카드 공장 (Card Factory)

**진단**: 통계 숫자, 목록 행, 알림, 레이블 등 독립 객체가 아닌 모든 것에 카드 컨테이너가 씌워져 있다.

**문제 CSS 패턴**
```css
/* 통계, 목록, 알림이 전부 같은 카드 */
.stat-card, .list-card, .alert-card {
  background: white;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 16px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}
```

**처방**
```css
/* 독립 객체(탐색/편집 대상)만 카드 */
.item-card { border: 1px solid var(--border); border-radius: 8px; }

/* 통계 → hero block (배경색으로 섹션 구분) */
.stats-section {
  background: var(--surface-tint);
  border-radius: 12px;
  padding: 24px;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
}
.stat-value { font-size: 2rem; font-weight: 800; }
.stat-label { font-size: 0.75rem; color: var(--text-secondary); }

/* 목록 → inline table (카드 없이 행 구분) */
.list-row {
  padding: 12px 16px;
  border-bottom: 1px solid var(--border-subtle);
}
.list-row:hover { background: var(--surface-hover); }
```

**체크 기준**: "이 요소를 삭제/선택할 수 있는가?" No라면 카드 컨테이너 제거 검토.

---

## Syndrome 3 — 인터랙션 공백 (Interaction Void)

**진단**: hover 시 색상만 바뀐다. active/focus/loading/empty 상태가 없다. 클릭해도 물리적 피드백이 없다.

**문제 CSS 패턴**
```css
.button:hover { background: var(--primary-dark); }
/* active, focus, loading 상태 없음 */
```

**처방**
```css
/* 버튼 — 물리적 반응 */
.button {
  transition: transform 80ms ease, box-shadow 120ms ease;
}
.button:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
}
.button:active {
  transform: translateY(1px);
  box-shadow: inset 0 1px 3px rgba(0,0,0,0.2);
}
.button:focus-visible {
  outline: none;
  box-shadow: 0 0 0 3px rgba(var(--primary-rgb), 0.35); /* glow ring */
}

/* 리스트 행 — 왼쪽 accent bar */
.list-row {
  position: relative;
  padding-left: 16px;
  transition: padding-left 120ms ease, background 120ms ease;
}
.list-row::before {
  content: '';
  position: absolute;
  left: 0; top: 0; bottom: 0;
  width: 3px;
  background: var(--primary);
  transform: scaleY(0);
  transition: transform 120ms ease;
}
.list-row:hover {
  background: var(--surface-hover);
  padding-left: 20px;
}
.list-row:hover::before { transform: scaleY(1); }

/* 로딩 상태 */
.button--loading {
  pointer-events: none;
  opacity: 0.7;
  position: relative;
}
.button--loading::after {
  content: '';
  width: 14px; height: 14px;
  border: 2px solid currentColor;
  border-top-color: transparent;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
  margin-left: 8px;
  display: inline-block;
  vertical-align: middle;
}
```

**체크 기준**: hover/active/focus/loading/empty — 5가지 상태 중 3가지 이상 구현되어 있는가?

---

## Syndrome 4 — 타이포 평탄화 (Typography Flattening)

**진단**: 크기(font-size)만으로 위계를 표현한다. weight, letter-spacing 변주가 없어 텍스트 전체가 같은 온도로 보인다.

**문제 CSS 패턴**
```css
h1 { font-size: 24px; }
h2 { font-size: 18px; }
h3 { font-size: 14px; }
/* weight, spacing 변주 없음 */
```

**처방**
```css
/* 3축 변주: 크기 + 무게 + letter-spacing */

/* 큰 숫자 — weight 최대, spacing 음수 */
.metric-value {
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.04em; /* 크기↑ → spacing↓ 반비례 */
  font-variant-numeric: tabular-nums;
}

/* 레이블 — 작은 크기, 두꺼운 weight, 양수 spacing */
.label {
  font-size: 0.6875rem;   /* 11px */
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: var(--text-secondary);
}

/* 섹션 제목 — 중간 크기, medium weight, 약한 음수 spacing */
.section-title {
  font-size: 0.9375rem;   /* 15px */
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* 본문 — 기본 크기, 가장 가벼운 weight, spacing 0 */
.body-text {
  font-size: 0.875rem;    /* 14px */
  font-weight: 400;
  letter-spacing: 0;
  line-height: 1.6;
}
```

**체크 기준**: 페이지의 폰트 weight 값이 3가지 이상인가? 가장 큰 숫자의 letter-spacing이 음수(-0.02em 이하)인가?

---

## Syndrome 5 — 경계선 과다 (Border Overuse)

**진단**: 요소 간 관계를 border로만 표현한다. 배경 대비와 여백으로 해결 가능한 곳에도 선을 긋는다. 활성 상태를 border 색상 변경으로 표현한다.

**문제 CSS 패턴**
```css
/* 모든 구분을 border로 */
.card { border: 1px solid #e5e7eb; }
.section { border-bottom: 1px solid #e5e7eb; }
.nav-item--active { border-left: 3px solid var(--primary); border-color: var(--primary); }
```

**처방 — 경계 표현 우선순위**
```
1순위: 여백 (breathing room) — 간격만으로 그룹이 읽히면 선 불필요
2순위: 배경 대비 (background contrast) — 배경색 차이로 영역 구분
3순위: 희미한 구분선 (subtle divider) — 1px, opacity 낮게
4순위: 테두리 (border) — 독립 객체(카드)에만 허용
```

```css
/* 배경 대비로 섹션 구분 */
.sidebar    { background: var(--surface-2); }   /* 약간 어둡게 */
.main       { background: var(--surface-1); }   /* 기본 */
.panel      { background: var(--surface-3); }   /* 약간 밝게 */

/* 희미한 구분선 */
.divider {
  border: none;
  border-top: 1px solid rgba(0,0,0,0.06); /* opacity 낮게 */
}

/* 활성 상태 — border가 아닌 background tint */
.nav-item--active {
  background: color-mix(in oklch, var(--primary) 12%, transparent);
  color: var(--primary);
  /* border 없음 */
}

/* 독립 객체에만 border 허용 */
.item-card {
  border: 1px solid color-mix(in oklch, var(--primary) 8%, var(--border));
}
```

**체크 기준**: "이 border를 지우고 배경색 차이나 여백으로 대체할 수 있는가?" Yes라면 제거 검토. 활성 상태 표현에 border-color 변경이 포함되어 있는가? → background tint로 교체.

---

## Quick Checklist

디자인 완료 후 5개 항목 점검:

- [ ] **S1 균일 여백**: 주인공 요소의 padding이 일반 요소보다 넓은가?
- [ ] **S2 카드 공장**: 독립 객체가 아닌 통계/목록에 카드를 씌우지 않았는가?
- [ ] **S3 인터랙션**: hover + active + focus 3가지 상태가 모두 구현되어 있는가?
- [ ] **S4 타이포**: font-weight가 3단계 이상 사용되고, 큰 숫자에 negative letter-spacing이 적용되었는가?
- [ ] **S5 경계선**: 활성 상태를 border-color가 아닌 background tint로 표현했는가?
