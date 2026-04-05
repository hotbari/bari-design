# Scenario Manifest

## Domains
- [x] 사용자 관리 → 01-user-management.md
- [x] 매체 관리 → 02-media-management.md
- [x] 소재 관리 → 03-material-management.md
- [x] 캠페인 관리 → 04-campaign-management.md
- [x] 편성 관리 → 05-scheduling-management.md
- [x] 알림 관리 → 06-notification-management.md
- [x] 대시보드/리포트 → 07-dashboard-report.md

## Validation per Domain
각 도메인 `[x]` 체크 전 아래 3단계를 반드시 통과:
1. **Ubiquitous Language** — 용어 불일치·모호함·미정의 탐지
2. **Example Mapping** — 규칙별 구체적 예시로 엣지 케이스 발견
3. **Pre-mortem** — "이 도메인이 실패한다면 왜?" 로 빠진 요구사항 탐지

## Gate
전체 체크 완료 시 → `/spec-dialectic docs/scenarios/`
교차 검증 후 → 사용자 확인: `@bari-skills/research` (기획 보강) 또는 `writing-plans` (구현 계획)
