---
name: color-taste
description: Use when the user asks for a color palette, brand colors, design system colors, or says things like "색 감각이 없어", "팔레트 만들어줘", "브랜드 컬러 정해줘" — triggers 3-question intake before generating any colors.
---

# Color Taste Intake

## Context

$ARGUMENTS를 무시하고, 이 스킬은 색상 팔레트를 생성하기 전에 반드시 3가지 질문을 통해 사용자의 색 취향을 수집하는 워크플로우를 실행한다. 질문 없이 즉시 팔레트를 제안하면 안 된다.

## Domain Context

- **OKLCH 색공간**: 인간의 지각과 가장 일치하는 색공간. `oklch(L C H)` — Lightness(0~1), Chroma(0~0.4), Hue(0~360). 같은 L값이면 실제로 같은 밝기로 보인다
- **감정 → Hue 매핑 (실증 연구 기반)**:
  - 신뢰/전문적 → H: 220~260 (blue-indigo)
  - 조용함/차분함 → H: 200~230 (cool blue), Chroma 낮게
  - 따뜻함/친근함 → H: 30~80 (amber/orange)
  - 자연/신선함 → H: 130~160 (green)
  - 창의/활기 → H: 280~320 (purple/pink)
  - 고급/세련 → H: 240~270, Chroma 매우 낮게 (near-neutral)
- **Chroma 수준**:
  - 절제/미니멀 → C: 0.04~0.10
  - 균형/일반 → C: 0.10~0.16
  - 선명/강조 → C: 0.16~0.25
- **안티 레퍼런스**가 포지티브 레퍼런스만큼 중요함 — 피해야 할 색을 알면 범위가 즉시 좁혀진다

## Instructions

### Step 1: 3가지 질문을 한 번에 묻기

팔레트 생성 전 반드시 아래 3가지를 묻는다. 한 번에 묶어서 물어야 한다 (각각 따로 물으면 사용자 피로 증가):

```
색 취향을 파악하기 위해 3가지만 여쭤볼게요:

1. **"이 색감이다"** — 좋아하는 브랜드, 사진, 장면, 또는 키워드
   예: "에르메스", "새벽 안개", "오래된 양장본", "머큐리"

2. **"이 색감은 절대 아니다"** — 피하고 싶은 색이나 브랜드
   예: "형광색 싫어요", "카카오 같은 노랑은 아니었으면"

3. **감정 단어 1~3개** — 이 색이 주어야 하는 느낌
   예: "신뢰, 조용함", "따뜻하고 전문적", "차갑지 않게 세련됨"
```

### Step 2: 답변 분석 → OKLCH 파라미터 도출

사용자 답변을 받으면 아래 순서로 분석한다:

1. **감정 단어 → Hue 범위 결정** (Domain Context 매핑 사용)
2. **포지티브 레퍼런스 → Chroma/Lightness 프로파일 추정**
   - 고급 브랜드 언급 → Chroma 낮게, 중간~높은 Lightness
   - 자연/유기적 키워드 → 중간 Chroma, 따뜻한 Hue
3. **안티 레퍼런스 → 제외 범위 설정**
   - 특정 브랜드 언급 시 해당 브랜드의 Hue ±20 회피
4. **최종 파라미터 정리**:
   ```
   Primary Hue: 220~240
   Chroma 수준: 절제 (0.06~0.09)
   Lightness 프로파일: 중간 밝기 메인 + 어두운 텍스트 + 밝은 배경
   ```

### Step 3: 팔레트 초안 생성 (OKLCH 형식)

아래 역할로 팔레트를 구성한다:

```
| 역할        | OKLCH                    | 용도                    |
|------------|--------------------------|-------------------------|
| Primary    | oklch(0.45 0.08 230)     | CTA, 강조, 링크         |
| Secondary  | oklch(0.55 0.06 200)     | 보조 액션, 아이콘 악센트 |
| Background | oklch(0.97 0.01 230)     | 페이지 배경             |
| Surface    | oklch(0.93 0.01 230)     | 카드, 입력 필드 배경    |
| Border     | oklch(0.86 0.02 230)     | 구분선, 테두리           |
| Text Main  | oklch(0.18 0.02 240)     | 본문 텍스트             |
| Text Sub   | oklch(0.50 0.02 230)     | 보조 텍스트, placeholder|
| Success    | oklch(0.50 0.10 145)     | 성공 상태               |
| Warning    | oklch(0.60 0.12 60)      | 경고 상태               |
| Error      | oklch(0.50 0.14 20)      | 오류 상태               |
```

**반드시 초안임을 명시**하고 사용자 확인을 요청:
```
위 팔레트 초안입니다. 어떤 부분이 마음에 드시나요, 혹은 조정하고 싶은 게 있나요?
확정되면 .impeccable.md 파일에 저장해드릴게요.
```

### Step 3.5: HTML 프리뷰 생성

팔레트 초안을 시각적으로 확인할 수 있는 `color-preview.html`을 프로젝트 루트에 생성한다. 프리뷰에 포함할 요소:

1. **색상 스와치**: 각 토큰의 색상 블록 + OKLCH/Hex 표기
2. **UI 컴포넌트 데모**: 프로젝트 맥락에 맞는 실제 UI 예시
   - 카드 (정상 상태 vs 에러 상태 대비)
   - 알림/배너 (Error / Warning / Info 구분)
   - 테이블 (데이터 + 뱃지 색상)
   - 입력 폼 (포커스 시 Primary 테두리)
   - 파괴적 액션 확인 모달 (Error 강조)
   - 네비게이션 (활성/비활성 대비)
3. **CSS 변수**: `:root`에 OKLCH 변수로 정의하여 토큰 구조 확인 가능

생성 후 브라우저에서 자동으로 열어 사용자가 실제 렌더링을 확인하도록 한다.

> 이 파일은 확인용이므로 팔레트 확정 후 삭제해도 된다.

### Step 4: 피드백 반영 → 확정

사용자가 수정 요청하면:
- "좀 더 따뜻하게" → Primary Hue +20~30 이동
- "덜 진하게" → Chroma -0.02~0.04 감소
- "더 밝게" → Lightness +0.05~0.10 증가

수정 후 재확인 요청. 확정되면 Step 5로.

### Step 5: `.impeccable.md` 에 저장

확정 팔레트를 프로젝트 루트의 `.impeccable.md`에 저장한다:

```markdown
## Color Palette

Generated: [날짜]
Intent: [사용자의 감정 단어]
Reference: [포지티브 레퍼런스]
Anti-reference: [안티 레퍼런스]

### Tokens

| Token           | OKLCH                 | Hex (fallback) |
|----------------|-----------------------|----------------|
| --color-primary | oklch(0.45 0.08 230) | #2d5fa3        |
| ...            | ...                   | ...            |
```

> **Hex fallback**: OKLCH를 지원하지 않는 도구를 위해 근사 Hex도 함께 제공한다.

### Step 6: 다음 단계 안내

팔레트 저장 후 사용자에게 안내:

```
색 취향 초안이 .impeccable.md에 저장되었습니다.
풀 컬러 시스템(톤 스케일, 시맨틱 매핑, 접근성, 다크모드)을 구축하려면
`/color-palette` 를 실행하세요. 저장된 Color Palette 섹션을 seed로 사용합니다.
```

## Common Mistakes

| 실수 | 결과 | 수정 |
|------|------|------|
| 질문 없이 즉시 팔레트 생성 | 사용자가 원하지 않는 색감 | 반드시 3-질문 인테이크 먼저 |
| Hex/RGB로 출력 | 팔레트 확장/조정 시 일관성 깨짐 | OKLCH 우선, Hex는 fallback만 |
| 안티 레퍼런스 미수집 | 피해야 할 색이 팔레트에 포함될 수 있음 | 질문 2번 필수 |
| 확인 없이 저장 | 사용자가 원치 않는 초안 저장 | 초안 → 확인 → 저장 순서 지키기 |

## Further Reading

- Björn Ottosson, "A perceptual color space for image processing" (2020) — OKLCH 설계 근거
- Eva Heller, *Wie Farben wirken* (색채 심리학) — 감정-색 매핑 이론적 기반
- Lea Verou, "LCH colors in CSS: what, why, and how?" — CSS에서의 OKLCH 실용 가이드
