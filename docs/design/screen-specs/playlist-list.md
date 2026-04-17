# 재생목록 (`playlist-list.html`)

## 기본 정보

- **페이지 제목**: 재생목록
- **브레드크럼**: 편성 관리 › 재생목록
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 컨텐츠: 페이지 헤더 → 카드 그리드

## 카드 그리드

- 레이아웃: `grid-template-columns: repeat(auto-fill, minmax(280px, 1fr))`
- 각 카드 구성:
  - 썸네일 영역: 슬롯 미리보기 (재생목록 첫 N개 소재 썸네일)
  - 재생목록명 (font-weight:600)
  - 구좌 N개 (xs, neutral-500)
  - 수정일 (xs, neutral-400)
  - 편성표 N건 사용 중 (xs)
  - 액션: 편집 / 삭제

## 상태값/배지

```
// 삭제된 소재 경고
// CSS: .pl-warning (warning 스타일)
```

## 기타 UI

- **삭제된 소재 경고**: 포함된 소재가 삭제된 경우 카드에 `.pl-warning` 배지 표시
- **주요 액션**: "새 목록 만들기" 버튼 (→ playlist-edit.html)
- **카드 액션**: 편집 (→ playlist-edit.html?id=N) / 삭제 (확인 다이얼로그)
