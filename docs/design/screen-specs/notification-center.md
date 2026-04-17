# 알림 센터 (`notification-center.html`)

## 기본 정보

- **페이지 제목**: 알림 센터
- **브레드크럼**: 알림 센터
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 2패널)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨(active 상태, 미읽음 배지 5)
- 바디: 좌측 알림 목록 + 우측 상세 패널 (선택 시 슬라이드인)

## 알림 목록 헤더

- 제목: "알림"
- "모두 읽음 처리" 버튼

## 필터 탭

| 탭 | 값 | 카운트 배지 |
|----|----|-----------|
| 전체 | all | 5 |
| 긴급 | critical | 2 (red 배지) |
| 편성 | schedule | - |
| 캠페인 | campaign | - |
| 시스템 | system | - |

## 알림 항목 구성

- 읽음/미읽음 dot (unread/read)
- 우선도 아이콘 (icon-critical/icon-warning/icon-info/icon-success)
- 알림 제목 (font-weight:600, 미읽음) / (font-weight:500, 읽음)
- 알림 설명 (xs, neutral-500)
- 메타: 시각 + 태그 (tag-critical/tag-schedule/tag-campaign/tag-system/tag-user)
- 알림별 액션 버튼 (primary/secondary)
- 호버 시 X(dismiss) 버튼

## 알림 섹션 구분

- "오늘" 그룹 / "이전" 그룹 (section-label)

## 상태값/배지

```
// 알림 읽음 상태
read_status: 'unread' | 'read'
// CSS: .notif-item.unread, .unread-dot, .read-dot

// 우선도 아이콘
priority_icon: 'icon-critical' | 'icon-warning' | 'icon-info' | 'icon-success'

// 태그
tag: 'tag-critical' | 'tag-schedule' | 'tag-campaign' | 'tag-system' | 'tag-user'
```

## 우측 상세 패널

- 슬라이드인 (transform translateX)
- 구성: 뒤로가기 + 제목 / 전체 제목 + 설명 / 메타 그리드(발생시각, 대상, 유형) / 액션 버튼
- 닫기: 뒤로가기 버튼

## 기타 UI

- **빈 상태**: 필터 결과 없을 때 empty-state 표시
- **알림 배지**: GNB 알림벨에 미읽음 수 표시
