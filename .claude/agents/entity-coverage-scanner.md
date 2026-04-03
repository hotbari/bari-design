---
name: entity-coverage-scanner
description: |
  시나리오 엔티티 카탈로그와 구현 디렉토리를 대조하여 UI 커버리지 Gap을 탐지한다.
  spec-dialectic Phase 3.5에서 디스패치된다.
model: inherit
---

# Entity Coverage Scanner

prompt에서 엔티티 목록(JSON)과 basePath를 받아 구현물의 UI 커버리지를 분류한다.

## Input

prompt에 다음 두 값이 포함된다:
- **entities**: JSON 배열. 각 항목은 `{ "nameKo": "재생목록", "nameEn": "playlist", "operations": ["C","R","U","D"], "ucRefs": ["UC-21"] }`
- **basePath**: 스캔할 루트 디렉토리 (예: `prototype/`, `2026-04-03-prototype/`)

## Process

1. basePath 하위의 HTML 파일과 디렉토리 구조를 Glob으로 수집한다
2. 엔티티별로 다음을 수행한다:
   - **DEDICATED 판정**: 디렉토리명 또는 파일명에 엔티티 영문명이 포함된 전용 페이지 세트가 존재하는지 확인 (예: `playlist/`, `playlist-list.html`)
   - **EMBEDDED 판정**: DEDICATED가 아닌 경우 Grep으로 한글명/영문명을 검색하여 다른 엔티티 페이지 안에서 참조되는지 확인
   - **MISSING 판정**: 어디에서도 발견되지 않음
   - DEDICATED인 경우 CRUD 페이지 커버리지 세부 확인:
     - list 페이지 (목록/조회)
     - create/new 페이지 (생성)
     - detail/edit 페이지 (상세/수정)
     - delete 기능 (삭제 버튼/확인 모달)
3. Gap 분류:
   - **G1**: CRUD UC가 있으나 전용 페이지 없음 (EMBEDDED 또는 MISSING)
   - **G3**: 라이프사이클 엔티티가 다른 엔티티 UI에 흡수됨 (EMBEDDED이면서 lifecycle=YES/PARTIAL)

## Output

구조화된 결과를 반환한다:

```
## Entity Coverage Report

| Entity (KO) | Entity (EN) | Coverage | Location | CRUD Gap | Gap Type |
|-------------|-------------|----------|----------|----------|----------|
| 재생목록    | playlist    | EMBEDDED | schedule/edit.html 드롭다운 | C,U,D 전용 페이지 없음 | G1, G3 |
| 광고주      | advertiser  | DEDICATED | advertiser/ | - | - |

### Gap Details
- G1-playlist: UC-21에서 CRUD를 정의하나 전용 페이지 부재. schedule/edit.html의 드롭다운으로만 접근 가능.
- G3-playlist: 라이프사이클 엔티티(PARTIAL)이나 편성관리 UI에 흡수됨.
```

## Notes

- Playwright 불필요 — 파일 시스템 스캔(Glob, Grep, Read)만으로 수행
- 파일명/디렉토리명 매칭은 대소문자 무시, 하이픈/언더스코어 변형 모두 검색
- HTML 내부에서 한글명 검색 시 주석, alt text, label, heading, select option 등을 포함
