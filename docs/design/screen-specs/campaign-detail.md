# 캠페인 상세 (`campaign-detail.html`)

## 기본 정보

- **페이지 제목**: 캠페인 상세
- **브레드크럼**: 캠페인 관리 › {캠페인명}
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 컨텐츠:
  - 페이지 헤더: 캠페인명 + 상태 배지 + 액션 버튼(수정/취소)
  - FSM 타임라인: 초안 → 집행중 → 완료 (상태 진행 시각화)
  - 정보 그리드: 광고주, 유형, 기간, 예산, 광고대행사, 매체 목록
  - 연결된 편성표 섹션: 편성 테이블 (편성명, 상태, 기간, 동기화)

## 상태값/배지

```
// 캠페인 상태
status: 'draft' | 'running' | 'done' | 'canceled'
// CSS: .status-draft, .status-running, .status-done, .status-canceled

// 연결 편성 상태
schedule_status: 'active' | 'pending' | 'done'
// CSS: .sch-active, .sch-pending, .sch-done
```

## 폼 필드 (취소 모달)

| 필드 | 타입 | 필수 | 비고 |
|------|------|------|------|
| 취소 사유 | textarea | * | required, placeholder: "취소 사유를 입력하세요" |

## 기타 UI

- **FSM 타임라인**: 초안(draft) → 집행중(running) → 완료(done), 취소(canceled) 분기
- **취소 모달**: "캠페인 취소" 버튼 클릭 시 확인 모달 표시 (취소 사유 입력 필수)
- **주요 액션**: 수정 (→ campaign-form.html), 취소 (opens modal)
- **연결 편성표 목록**: 편성표명, 상태, 기간, 동기화 상태
