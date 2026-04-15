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

**핵심 원칙:** spec.md는 구조 체크리스트다. HTML이 진실의 원본이다. 구현 시 spec과 HTML을 동시에 참조하며, 충돌 시 HTML이 우선이다. 이 스킬은 그 체크리스트를 명시적으로 만든다.

## When to Use

- HTML 프로토타입 이해관계자 승인 직후, 코드 구현 전

**구현 후 감사(HTML 충실도 검증)는 `/html-verify`를 사용한다. 이 스킬은 구현 전 spec 추출 전용이다.**

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
> 아래 항목이 HTML과 일치하는지 확인합니다:
> - 목록 화면: 컬럼 수·헤더, 필터 종류·옵션, 상태값
> - 폼 화면: 섹션 수·섹션명, 각 필드 컴포넌트 타입
> - 상세 화면: 정보 그리드 키 목록, 중첩 테이블 컬럼, 모달 구조
>
> 수정이 필요한 항목이 있으면 알려주세요."

수정 요청 시 해당 `.md` 파일을 직접 수정.

**승인 후 구현 안내:**
- 구현 시 spec.md와 함께 `source` HTML 파일을 반드시 같이 읽는다 (spec과 HTML이 충돌하면 HTML 우선)
- 구현 완료 후 `/html-verify`로 검증한다 — 미해결 이슈 0건 확인 후 완료 선언

## Common Mistakes

| 실수 | 올바른 방법 |
|------|------------|
| 스펙 없이 구현 시작 | 반드시 이 스킬 실행 후 승인 받고 구현 |
| 스펙 생성 후 검토 생략 | 5단계 리뷰 게이트는 건너뛸 수 없다 |
| 일부 화면만 추출 | 같은 프로토타입 세트는 전체를 한 번에 추출 |
| spec만 보고 구현 | spec.md의 source HTML을 함께 읽어야 한다 |
| 구현 후 검증 생략 | `/html-verify` 실행 후 이슈 0건 확인 전까지 완료 선언 금지 |
