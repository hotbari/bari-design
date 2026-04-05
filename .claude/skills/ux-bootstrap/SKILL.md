---
name: ux-bootstrap
description: "프로젝트 초기 UX 기반 셋업 파이프라인. teach-impeccable → color-taste → synthesize → handoff를 순차 실행하여 디자인 컨텍스트를 한 번에 구축한다."
user-invocable: true
---

# UX Bootstrap

## Context

프로젝트 시작 시 필요한 UX 기반을 1커맨드로 셋업한다. 개별 스킬을 따로 실행하는 번거로움을 줄인다.

## Pipeline

```
teach-impeccable → color-taste → synthesize → handoff
```

## Instructions

### Step 1: Teach Impeccable

`/teach-impeccable` 실행.

프로젝트 디자인 컨텍스트(브랜드, 대상 사용자, 톤앤매너)를 수집하여 `.impeccable.md`에 저장한다.

**게이트**: `.impeccable.md` 파일이 생성되었는지 확인. 실패 시 중단.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 2: Color Taste

`/color-taste` 실행.

3-질문 인테이크로 색 취향을 수집하고 OKLCH 팔레트 초안을 `.impeccable.md`에 추가한다.

**게이트**: `.impeccable.md`에 `## Color Palette` 섹션이 추가되었는지 확인. 실패 시 중단.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 3: Synthesize

`/synthesize` 실행.

리서치 결과(페르소나, 공감지도, 여정지도)를 종합하여 핵심 인사이트를 도출한다.

**게이트**: 리서치 산출물이 `docs/research/`에 존재해야 한다. 없으면 사용자에게 알리고 이 단계를 건너뛸지 질문.

사용자에게 결과를 보여주고 다음 단계 진행 확인.

### Step 4: Handoff

리서치 → 디자인 핸드오프 요약을 제공한다:

```
## UX Bootstrap 완료

### 생성된 산출물
- `.impeccable.md` — 디자인 컨텍스트 + 컬러 팔레트
- 리서치 종합 인사이트 (해당 시)

### 다음 단계
- 전략 수립: `/strategize`
- 정보 아키텍처: `/map-ia`
- 시나리오 검증: `/validate-all`
```

## Common Mistakes

| 실수 | 결과 | 수정 |
|------|------|------|
| teach-impeccable 없이 color-taste | 컨텍스트 없는 팔레트 | 순서 준수 |
| synthesize에 리서치 없이 진입 | 빈 종합 | 게이트에서 안내 |
| 사용자 확인 없이 자동 진행 | 방향 불일치 | 각 단계 종료 시 확인 |
