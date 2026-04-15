---
name: html-to-spec
description: Use when an HTML prototype has been approved and code implementation is about to begin, or when implemented code is suspected to have drifted from the HTML prototype. Extracts full screen specs from HTML — list screens (columns, filters, enums) and form/detail screens (layout, sections, component types, behaviors). Stack-agnostic.
argument-hint: "[html-dir] [file1.html file2.html ...]  — omit to auto-detect prototype directory"
user-invocable: true
---

# HTML → Screen Spec 추출

## Overview

HTML 프로토타입이 승인된 후 코드 구현 전에, 각 화면의 스펙을 구조화된 문서로 추출한다.

- **목록 화면**: 컬럼·필터·열거값
- **폼/상세 화면**: 레이아웃·섹션·컴포넌트 타입·동작 규칙

**핵심 원칙:** HTML은 디자인·검토용으로 만들어진 것이다. 코드 구현은 이 HTML을 "변환"하는 것이 아니라 "명세를 보고 구현"하는 것이다. 이 스킬은 그 명세를 명시적으로 만든다.

## When to Use

- HTML 프로토타입 이해관계자 승인 직후, 코드 구현 전
- HTML과 구현 코드 불일치가 의심될 때 (구현 후 감사 용도)

**사용하지 않는 경우:** HTML 프로토타입 없이 처음부터 코드를 작성하는 경우

## Instructions

### 1. 처리 대상 파일 확정

`$ARGUMENTS`에서 디렉토리 또는 파일 목록을 파싱한다.

인수가 없으면 Glob으로 `*prototype*` 패턴 디렉토리를 탐색, 가장 최신 날짜 디렉토리를 선택.

다음은 **제외**한다:
- `shared/` 디렉토리 (공통 CSS/JS)
- `login.html`, `signup*.html` (인증 화면 — 스펙 추출 불필요)

처리 대상 목록을 사용자에게 보여주고 확인:
```
처리 예정 파일 (N개):
- campaign-list.html
- media-list.html
...

제외할 파일이 있으면 알려주세요.
```

### 2. 출력 디렉토리 준비

`docs/design/screen-specs/` 디렉토리가 없으면 생성.

### 3. html-spec-extractor 서브에이전트 디스패치

다음 컨텍스트로 `html-spec-extractor` 서브에이전트를 디스패치:

```
Source files: [확정된 파일 경로 목록]
Output directory: docs/design/screen-specs/
```

서브에이전트 완료 대기.

### 4. 생성 결과 보고

```
스펙 파일 생성 완료 (N개):
- docs/design/screen-specs/campaign-list.md
- docs/design/screen-specs/media-list.md
...
```

### 5. 리뷰 게이트

> "`docs/design/screen-specs/` 를 열어 내용을 검토해주세요.
> 컬럼·필터·상태값이 HTML과 일치하는지 확인 후 구현을 시작합니다.
> 수정이 필요한 항목이 있으면 알려주세요."

수정 요청 시 해당 `.md` 파일을 직접 수정. 승인 후 구현 단계로 안내.

## Common Mistakes

| 실수 | 올바른 방법 |
|------|------------|
| 스펙 없이 구현 시작 | 반드시 이 스킬 실행 후 승인 받고 구현 |
| 스펙 생성 후 검토 생략 | 5단계 리뷰 게이트는 건너뛸 수 없다 |
| 일부 화면만 추출 | 같은 프로토타입 세트는 전체를 한 번에 추출 |
