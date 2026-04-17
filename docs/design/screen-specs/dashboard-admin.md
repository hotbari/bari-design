# 대시보드 — 어드민 (`dashboard-admin.html`)

## 기본 정보

- **페이지 제목**: 대시보드
- **역할**: 어드민 (admin)
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 2컬럼 바디)

## 레이아웃 구조

- GNB: 대시보드 제목 + 날짜 + 새로고침 버튼 + 알림벨(미읽음 dot)
- 바디: 좌측 스크롤 패널(60%) + 우측 지도 패널(40%)

## 좌측 패널 섹션

| 섹션 | 내용 |
|------|------|
| 이상 감지 배너 | 즉시 확인 필요 알림 (error-50 배경), 이슈별 링크 포함 |
| 요약 스탯 (4컬럼) | 전체 매체 / 온라인 / 이상 / 캠페인 수 |
| 매체 상태 요약 | 상태별 chip: online/delayed/error/offline/inactive |
| 캠페인 요약 | 상태별 chip: active/draft/ended |
| 헬스체크 이상 목록 | 이상 있는 매체 목록 (d-dot: error/delayed/offline) |
| 시스템 현황 (3컬럼) | 서버 상태, DB, 배치 (sys-ok/sys-warn/sys-err) |
| 알림 목록 | 최근 알림 (unread/read dot) |

## 우측 지도 패널

- 지도 헤더: 제목 + 필터 버튼 + 범례
- 지도 필터 버튼: 전체 / 온라인 / 이상 / 오프라인 (토글)
- 지도 바디: 매체 위치 마커 (map-marker: online/delayed/error/offline/inactive)
- 지도 범례: 색상별 상태 설명

## 상태값/배지

```
// 지도 마커 상태
marker: 'online' | 'delayed' | 'error' | 'offline' | 'inactive'
// CSS: .map-marker.online, .map-marker.delayed, .map-marker.error, .map-marker.offline, .map-marker.inactive

// 헬스체크 dot
d_dot: 'error' | 'delayed' | 'offline'
// CSS: .d-dot.error, .d-dot.delayed, .d-dot.offline

// 시스템 현황 상태
sys: 'sys-ok' | 'sys-warn' | 'sys-err'
// CSS: .sys-ok, .sys-warn, .sys-err

// stat chip 색상
chip: 'chip-online' | 'chip-delayed' | 'chip-error' | 'chip-offline' | 'chip-inactive' | 'chip-active' | 'chip-draft' | 'chip-ended'
```

## 기타 UI

- **새로고침 버튼**: 데이터 폴링, 로딩 중 스피너
- **Stale data 인디케이터**: 데이터가 오래된 경우 경고 표시
- **이상 감지 배너**: 즉시 확인 필요 이슈 목록 + 각 항목별 이동 링크
- **지도 마커 hover**: tooltip으로 매체명/메타 표시
- **알림 dot**: unread → primary-500, read → neutral-300
