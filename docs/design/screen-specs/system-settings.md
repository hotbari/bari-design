# 시스템 설정 (`system-settings.html`)

## 기본 정보

- **페이지 제목**: 시스템 설정
- **브레드크럼**: 시스템 설정
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 설정 레이아웃)
- **접근 권한**: 어드민 전용 (admin-badge 표시)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 바디: 좌측 설정 사이드내비(200px) + 우측 컨텐츠

## 설정 사이드내비

| 그룹 | 항목 |
|------|------|
| 내 계정 | 프로필 / 알림 설정 / 보안 |
| 시스템 (어드민) | 시스템 설정 (active) |

## 폼 필드

### Slack 연동 카드

**연결 상태**: connected / disconnected 두 가지 표시
- connected: 워크스페이스 정보(이름, 연결일, Bot) + "연결 해제" 버튼
- disconnected: 안내 텍스트 + "Slack으로 연결" 버튼

**이벤트별 채널 매핑 테이블**

| 이벤트 | 태그 | 채널 select 옵션 |
|--------|------|-----------------|
| 매체 오프라인 / 긴급 편성 | et-critical (긴급) | #bari-alerts / #bari-critical / #general / 채널 없음 |
| 편성 충돌 / 지연 | et-warning (경고) | #bari-alerts / #bari-ops / #general / 채널 없음 |
| 캠페인 승인 요청 | et-info (정보) | #bari-approvals / #bari-ops / #general / 채널 없음 |
| 즉시 반영 완료 | et-info (정보) | #bari-ops / #bari-alerts / 채널 없음 |
| 신규 사용자 합류 | et-info (정보) | #bari-team / #general / 채널 없음 |

**Bot 테스트**: "테스트 메시지 전송" 버튼 → #bari-alerts로 전송

### 일반 설정 카드

(추가 필드: 일반 시스템 설정 항목)

## 상태값/배지

```
// Slack 연결 상태
slack_status: 'connected' | 'disconnected'
// CSS: .slack-status.connected, .slack-status.disconnected

// 이벤트 태그
event_tag: 'et-critical' | 'et-warning' | 'et-info'

// Slack 연결됨 배지
// CSS: .slack-connected-badge (dot: .slack-connected-dot)
```

## 기타 UI

- **어드민 전용 배지**: 제목 옆 admin-badge
- **저장 바**: 변경 사항 있을 때 하단 sticky bar
- **토스트**: 저장 완료 시 하단 표시
