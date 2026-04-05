---
name: design-foundation
description: "디자인 시스템 기반 구축 파이프라인. color-palette → type-system → layout-grid + spacing-system → tokenize를 순차 실행하여 디자인 토큰 체계를 한 번에 구축한다."
user-invocable: true
---

# Design Foundation

## Context

디자인 시스템의 기반 레이어(색상, 타이포그래피, 레이아웃, 간격, 토큰)를 1커맨드로 구축한다. 개별 스킬을 따로 실행하는 순서 혼동을 방지한다.

## Precondition

`.impeccable.md`에 디자인 컨텍스트가 있어야 한다. 없으면 `/ux-bootstrap` 또는 `/teach-impeccable`을 먼저 실행할 것을 안내하고 중단.

## Pipeline

```
color-palette → type-system → (layout-grid + spacing-system) → tokenize
```

## Instructions

### Step 1: Color Palette

`/color-palette` 실행.

`.impeccable.md`의 Color Palette 섹션을 seed로 사용하여 풀 컬러 시스템(톤 스케일, 시맨틱 매핑, 접근성, 다크모드)을 구축한다.

**게이트**: 컬러 시스템 산출물이 생성되었는지 확인.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 2: Type System

`/type-system` 실행.

타이포그래피 스케일, 폰트 페어링, 줄 간격 체계를 정의한다.

**게이트**: 타이포그래피 시스템 산출물 확인.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 3: Layout Grid + Spacing System (병렬)

`/layout-grid`와 `/spacing-system`을 실행한다. 이 두 스킬은 독립적이므로 병렬 실행 가능.

- **Layout Grid**: 그리드 시스템(컬럼, 거터, 마진, 브레이크포인트) 정의
- **Spacing System**: 간격 스케일(4px 기반 등) 정의

**게이트**: 양쪽 산출물 모두 확인.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 4: Tokenize

`/tokenize` 실행.

Step 1~3의 모든 결과를 통합하여 디자인 토큰으로 변환한다:
- Color tokens (semantic + primitive)
- Typography tokens
- Spacing tokens
- Layout tokens

**게이트**: 토큰 파일이 생성되었는지 확인.

### 완료 안내

```
## Design Foundation 완료

### 생성된 산출물
- 컬러 시스템 (톤 스케일 + 시맨틱 + 다크모드)
- 타이포그래피 시스템
- 레이아웃 그리드
- 간격 시스템
- 통합 디자인 토큰

### 다음 단계
- 화면 설계: `/screen-cycle [화면명]`
- 컴포넌트 라이브러리: `/create-component [컴포넌트명]`
```

## Common Mistakes

| 실수 | 결과 | 수정 |
|------|------|------|
| .impeccable.md 없이 시작 | seed 컬러 없음 | precondition 확인 |
| tokenize 전에 색·타입·간격 미완 | 불완전한 토큰 | 게이트 통과 필수 |
| type-system 없이 tokenize | 타이포 토큰 누락 | 순서 준수 |
