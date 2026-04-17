# 사용자 목록 (`user-list.html`)

## 기본 정보

- **페이지 제목**: 사용자 관리
- **브레드크럼**: 사용자 관리
- **레이아웃**: 사이드바(200px) + 메인 (GNB + 컨텐츠)

## 레이아웃 구조

- GNB: 브레드크럼 + 알림벨
- 컨텐츠: 페이지 헤더 → 탭 → 필터바 → 테이블

## 탭

| 탭 | 값 | 카운트 배지 |
|----|----|-----------|
| 전체 | all | N건 |
| 활성 | active | N건 |
| 초대 대기 | invited | N건 |

## 테이블 컬럼

| # | 헤더 | 표시 데이터 | 보조 텍스트 | 비고 |
|---|------|------------|------------|------|
| 1 | 사용자 | 아바타 + 이름 (font-weight:600) | 이메일 (xs, neutral-500) | avatar CSS: .avatar-admin/.avatar-media/.avatar-ops/.avatar-sales/.avatar-invite |
| 2 | 역할 | 역할 배지 | | admin/media/ops/sales |
| 3 | 상태 | 상태 배지 | | active/inactive/invited/expired |
| 4 | 접근 범위 | 접근 범위 텍스트 | | |
| 5 | 액션 | 편집 / 비활성화 (hover 표시) | | 비활성화는 danger 스타일 |

## 필터

| 이름 | 타입 | 옵션 (value → 표시명) |
|------|------|----------------------|
| 역할 | select | `''`→전체 역할, `admin`→어드민, `media`→매체사, `ops`→운영대행사, `sales`→영업대행사 |
| 검색 | search | 이름/이메일 검색 |

## 상태값/배지

```
// 역할
role: 'admin' | 'media' | 'ops' | 'sales'
// CSS: .role-admin, .role-media, .role-ops, .role-sales

// 사용자 상태
status: 'active' | 'inactive' | 'invited' | 'expired'
// CSS: .status-active, .status-inactive, .status-invited, .status-expired

// 아바타
// CSS: .avatar-admin, .avatar-media, .avatar-ops, .avatar-sales, .avatar-invite
```

## 기타 UI

- **주요 액션**: "사용자 초대" 버튼 (→ user-invite.html)
- **행 hover 액션**: 편집 / 비활성화(danger)
- **비활성화 모달**: 비활성화 버튼 클릭 시 확인 모달
- **초대 대기 패널**: 초대 대기 탭에서 초대 재발송 / 취소 액션 표시
