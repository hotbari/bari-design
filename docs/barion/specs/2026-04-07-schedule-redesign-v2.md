# 편성관리 시각적 고도화 — 디자인 스펙 v2

생성일: 2026-04-07
범위: 편성관리 4개 화면 + 공통 레이아웃(GNB/LNB) + 컴포넌트 리디자인
기반: design-foundation.md, .impeccable.md, information-architecture.md 섹션 3

---

## 1. 디자인 토큰 변경

### 1.1 Border Radius (네이버 광고주센터 실측 기준)

**적용 범위: 글로벌.** `design-foundation.md` 및 `shared/style.css`의 CSS 변수를 함께 업데이트한다.

| Token | 기존 | 변경 | 용도 |
|-------|------|------|------|
| `--radius-sm` | 4px | 4px (유지) | 뱃지, 태그 |
| `--radius-md` | 8px | **6px** | 버튼, 인풋 |
| `--radius-lg` | 12px | **10px** | 카드 |
| `--radius-xl` | 16px | **12px** | 모달, 패널 |

### 1.2 컬러 적용 원칙

기존 디자인 파운데이션 토큰을 유지하되, Agentify 레퍼런스에서 도출한 원칙 적용:

- **CTA 버튼**: `linear-gradient(180deg, primary-400, primary-500)` + `box-shadow: 0 1px 2px rgba(primary-500, 0.3), inset 0 1px 0 rgba(white, 0.15)`
- **표면 레이어링**: 배경(neutral-50) → 카드(neutral-100) → 활성(white) 3단계
- **보더**: 하드 라인 대신 `rgba` 투명도 활용. `border: 1px solid rgba(0,0,0,0.06)`
- **다크 그린 포인트**: 사이드바 활성 메뉴에 `primary-900` 소량 사용
- **아이콘 원칙 (Brandpad 레퍼런스)**: 장식 제거, 배경 없이 인라인 배치, 라벨 보조 역할. 16px Lucide 스트로크, neutral-500

### 1.3 상태 컬러 시스템

| 상태 | 바 (타임라인) | 뱃지 | 원리 |
|------|-------------|------|------|
| 적용중 | `linear-gradient(135deg, var(--color-primary-500), var(--color-primary-600))` 솔리드 | bg: primary-50, text: primary-500 | 채움 = 활성 |
| 예약됨 | `bg: rgba(primary-500, 0.08)` + `border: 1.5px solid var(--color-primary-500)` 아웃라인 | bg: primary-50, text: primary-500, border: primary-500 | 아웃라인 = 대기 |
| 일시정지 | `border: 1.5px dashed var(--color-warning-500)` 빈 배경 | bg: warning-50, text: warning-600 | dashed = 중단 |
| 종료 | `var(--color-neutral-300)` 솔리드 | bg: neutral-200, text: neutral-500 | 그레이 = 비활성 |
| 동기화 실패 | 바 우측에 빨간 dot (6px, error-500) | bg: error-50, text: error-500 | dot = 주의 |

---

## 2. 공통 레이아웃 — GNB + LNB (IA 섹션 3 준수)

### 2.1 GNB (상단 고정, 56px)

IA 정의:
```
GNB: 대시보드, 매체 관리, 소재 관리, 캠페인 관리, 편성 관리, 리포트, [bell], [프로필]
```

**구현:**
- 좌측: 로고 "DOOH CMS" + 서브텍스트 "Digital Out-of-Home"
- 중앙: 도메인 탭 (대시보드 / 매체 관리 / 소재 관리 / 캠페인 관리 / 편성 관리 / 리포트)
  - 활성 도메인: `font-weight: 600`, `color: primary-600`, 하단 2px 바 (primary-500)
  - 비활성: `color: neutral-500`, 호버 시 `neutral-700`
  - 역할별 노출: 영업대행사는 소재 관리만 표시
- 우측: 역할 뱃지(role-switcher) + 벨 아이콘(알림 패널 트리거) + 프로필 아바타

### 2.2 프로필 드롭다운

GNB 우측 프로필 아바타 클릭 시 드롭다운 표시:
- **내 정보 / 알림 설정** → S-29 링크
- **역할**: 현재 역할 표시 (읽기 전용)
- **로그아웃**

드롭다운 스타일:
- `background: white`, `border-radius: var(--radius-lg)`, `box-shadow: 0 8px 24px rgba(0,0,0,0.12)`
- `min-width: 200px`, 아바타 하단 우측 정렬
- 항목: `padding: 8px 16px`, `font-size: 13px`, 호버 시 `neutral-50` 배경

### 2.3 LNB (좌측 사이드바, 도메인별 하위 메뉴)

GNB에서 선택된 도메인에 따라 LNB 내용이 변경됨.

**LNB 구조 (IA 기준):**

| 도메인 | LNB 메뉴 | 역할 제한 |
|--------|----------|-----------|
| 대시보드 | (LNB 없음, 단일 화면) | |
| 매체 관리 | 매체사 관리, 매체 목록, 매체 그룹, SSP 연동, 유동인구 연결 | 매체사: 어드민만, 유동인구: 어드민만 |
| 소재 관리 | 소재 목록, 소재 규격 안내 | |
| 캠페인 관리 | 캠페인 목록 | (단일 항목이지만 LNB 표시) |
| 편성 관리 | 재생목록, 편성표, 싱크 송출, 긴급 편성, 잔여 구좌 조회 | 긴급 편성: 어드민만 |
| 리포트 | 리포트 목록, 리포트 생성 | |
| 설정 | 사용자 관리, 사용자 초대, Slack 연동 | 사용자: 어드민/매체사만, Slack: 어드민만 |

**LNB 스타일:**
- 너비: 200px
- 배경: white, 우측 보더 `1px solid rgba(0,0,0,0.06)`
- 상단: 도메인명 라벨 (10px, neutral-400, uppercase)
- 메뉴 항목: `padding: 6px 12px`, `font-size: 12px`, `border-radius: var(--radius-md)`
- 아이콘: 16px Lucide SVG, neutral-500 (활성 시 primary-500)
- 활성: `background: primary-50`, `color: primary-600`, `border-left: 2px solid primary-500`
- 비활성: `color: neutral-600`, 호버 `rgba(0,0,0,0.03)`
- 역할 제한 항목: 해당 역할이 아니면 완전 숨김

### 2.4 설정 접근

IA에서 "설정"은 GNB 도메인이 아닌 별도 카테고리. 접근 경로:
- GNB에 설정 아이콘(⚙) 또는 프로필 드롭다운 내 "시스템 설정" 링크
- 설정 진입 시 LNB에 사용자 관리, 사용자 초대, Slack 연동 표시
- 내 정보/알림 설정(S-29)은 프로필 드롭다운에만 존재 (설정 LNB에 중복 배치하지 않음)

---

## 3. 편성 목록 (list.html)

### 3.1 핵심 변경

- **듀얼 뷰**: 목록 ↔ 타임라인 토글 스위치 (세그먼트 컨트롤)
- 기존 테이블 목록 뷰는 유지, 타임라인 뷰 추가
- 기본 뷰: 타임라인 (편성의 시간 기반 특성에 최적화)

### 3.2 타임라인 뷰 구조: 미니맵 + 포커스

**미니맵 (상단)**
- 전체 분기(Q1~Q2) 축소 뷰
- 매체별 가로 행, 편성은 컬러 바로 표시
- 초록 테두리 사각형으로 포커스 구간 표시
- 오늘 마커: 빨간 세로선 1.5px + "오늘" 라벨

**포커스 뷰 (하단)**
- 선택된 구간(1개월) 확대
- 좌우 화살표로 이전/다음 월 이동
- 주차 헤더: W1(1~7), W2(8~14), W3(15~21), W4(22~30)
- 매체별 행: 좌측 매체명+스펙, 우측 타임라인 트랙
- 각 행: `background: neutral-50`, `border-radius: 10px`, `border: 1px solid neutral-200`

**타임라인 바 정보**
- 편성명 (font-weight: 600, white)
- 우선순위 라벨 (P1/P2, rgba 반투명 배경)
- 동기화 상태 dot (우측 끝)
- 빈 매체: "편성 없음" dashed 보더 placeholder

**오늘 마커 (포커스 뷰)**
- 빨간 원(8px) + 날짜 라벨(배경: error-500, white text)
- 수직선 2px, `opacity: 0.6`, 모든 행 관통

**범례 바 (하단)**
- 적용중, 예약됨, 일시정지, 종료, 오늘, 동기화 미완료 아이콘 나열

### 3.3 헤더 영역

- 좌: 페이지 타이틀 "편성표" (LNB 활성 항목과 일치) + 편성 수 카운트 ("매체 N개 · 편성 M건")
- 우: 뷰 토글(목록/타임라인) + "편성표 생성" CTA 버튼
- 필터 적용 시: "매체 N개 · 편성 M건 (전체 K건)"

### 3.4 미니맵 인터랙션

- **클릭**: 클릭한 위치로 포커스 구간 이동 (점프)
- **드래그**: 미지원 (프로토타입 범위)
- **리사이즈**: 미지원 (포커스 구간은 항상 1개월 고정)
- 포커스 뷰의 ◀ ▶ 버튼으로 월 단위 이동

---

## 4. 편성표 상세 (detail.html)

### 4.1 레이아웃

```
┌─────────────────────────────────────┐
│ breadcrumb (편성표 / 편성표명)      │  액션 버튼 (수정, 종료)
├─────────────────────────────────────┤
│ 히어로 블록                         │
│  - 제목 + 상태 뱃지                │  동기화 상태 카드
│  - 매체, 기간, 우선순위 메타        │  (에러 시 빨간 배경)
│  - 미니 타임라인 진행바             │
├──────────────────────┬──────────────┤
│ 재생목록 구좌 카드    │ 사이드바     │
│ (메인 영역, flex:1)  │ (220px)     │
│                      │ - 충돌 경고  │
│                      │ - 동기화 이력│
│                      │ - 메타 정보  │
└──────────────────────┴──────────────┘
```

### 4.2 히어로 블록

- 제목: `--text-xl` (22px), weight 700
- 상태 뱃지: 인라인, 제목 우측
- 메타 정보: 매체 · 기간 · 우선순위 한 줄 (secondary text)
- 동기화 상태 카드: 우측 정렬. 정상 시 primary-50 배경, 실패 시 error-50 배경 + error 보더

### 4.3 미니 타임라인 진행바

- 전체 기간을 가로 바로 표현
- 경과 구간: primary-500 채움, 잔여 구간: neutral-200
- 오늘 마커: 빨간 세로선 + 날짜 라벨
- 하단 텍스트: "경과 N일 (X%)" / "잔여 N일"

### 4.4 재생목록 구좌 (테이블 → 카드 리스트)

각 구좌를 개별 카드로 표현:

- 순번 (22×22px, neutral-50 bg, center)
- 썸네일 (36×36px, rounded-md)
  - 동영상: 다크 배경 + ▶ 아이콘
  - 이미지: 밝은 배경 + IMG 텍스트
  - SSP: primary-600 배경 + "SSP" 텍스트
- 소재명 (weight 600) + 유형·재생시간 (secondary)
- 상태 뱃지 (우측)

**특수 구좌 표현:**
- 삭제됨: dashed 보더, opacity 0.6, 취소선
- SSP: primary-50 배경 + primary-200 보더, 구좌 전체가 그린 틴트 (primary 계열)
- 교체중: purple 뱃지 (기존 유지)

### 4.5 사이드바 (220px)

- 충돌 경고: warning-50 배경, "해소하기 →" 링크
- 동기화 이력: 버전별 성공/실패 리스트
- 편성 정보: 버전, 생성일, 생성자

---

## 5. 편성표 생성 (new.html)

### 5.1 레이아웃: 2컬럼

```
┌────────────────────┬─────────────────┐
│ 폼 영역 (flex:1)   │ 라이브 프리뷰   │
│                    │ (360px)         │
│ - 편성표명         │                  │
│ - 재생목록 선택    │ 미니 타임라인    │
│ - 매체 선택        │ (선택 매체별)   │
│ - 기간 설정        │                  │
│ - 우선순위         │ 충돌 감지 영역  │
│                    │                  │
│ [취소] [생성]      │                  │
└────────────────────┴─────────────────┘
```

### 5.2 라이브 프리뷰 타임라인

- 매체/기간 폼 값에 반응하여 실시간 업데이트
- 기존 편성: neutral-300 솔리드 바
- 새 편성 (지금 생성 중): primary-500 아웃라인 (점선) 바
- 겹침 발생 시: 겹침 구간에 warning-50 배경 + 경고 메시지
- 겹침 없으면: "충돌 없음 ✓" 성공 메시지 (primary 텍스트)

### 5.3 폼 개선

- 매체 선택: 체크박스 리스트 유지, 선택 시 프리뷰에 행 추가
- 기간: date picker, 설정 시 프리뷰 바 업데이트
- 우선순위: 선택 시 프리뷰에서 기존 편성과 비교 표시

---

## 6. 충돌 해소 (conflict.html)

### 6.1 레이아웃

```
┌─────────────────────────────────────┐
│ 충돌 타임라인 시각화                │
│ (두 편성 바 + 겹침 구간 강조)      │
├─────────────────────────────────────┤
│ 해소 옵션 A  → 타임라인 변화 표시  │
│ 해소 옵션 B  → 타임라인 변화 표시  │
│ 해소 옵션 C  → 타임라인 변화 표시  │
├─────────────────────────────────────┤
│                    [취소] [적용]    │
└─────────────────────────────────────┘
```

### 6.2 타임라인 시각화

- 매체명 좌측, 타임라인 트랙 우측
- 현재 편성: primary 솔리드 바
- 충돌 편성: primary 아웃라인 바
- 겹침 구간: warning-50 배경 + dashed 보더로 강조

### 6.3 인터랙티브 옵션 프리뷰

- 라디오 선택 시 상단 타임라인이 해당 옵션의 결과를 보여줌
- 옵션 A (우선순위 유지): 겹침 그대로, 우선순위 라벨 강조
- 옵션 B (기간 조정): 충돌 편성 바가 밀려남 (이동 위치 표시)
- 옵션 C (취소): 새 편성 바 제거, 원래 상태로 복귀

### 6.4 옵션 카드

- 기존 라디오 + 설명 유지
- 선택된 옵션: primary-50 배경 + primary 보더
- 옵션 B 내 날짜 입력: 인라인 date picker

---

## 7. 공통 시각 언어

### 7.1 타임라인 관통

4개 화면 모두 동일한 타임라인 시각 문법 사용:
- 목록: 미니맵 + 포커스 (전체 편성 조감)
- 상세: 진행바 (이 편성의 시간 경과)
- 생성: 프리뷰 (새 편성의 위치 확인)
- 충돌: 비교 (두 편성의 겹침 시각화)

### 7.2 오늘 마커 일관성

- 빨간 수직선 (2px, error-500, opacity 0.6)
- 날짜 라벨 (error-500 배경, white text, radius-sm)
- 포커스 뷰에서는 상단에 원(8px) 추가

### 7.3 공통 CSS/JS 구조

- `shared/style.css`: 디자인 토큰 변수 + 공통 컴포넌트 + 기존 페이지 호환 레이어
- `shared/icons.js`: Lucide SVG 인라인 상수
- `shared/layout.js`: GNB + LNB + 프로필 드롭다운 + 역할 전환. **IA 섹션 3 구조 반영 필수**
- `schedules/timeline.js` (신규): 타임라인 렌더링 공통 모듈

**layout.js GNB/LNB 구현 요건:**
- MENU_ITEMS를 flat array가 아닌 **도메인 > 하위메뉴 2단계 구조**로 정의
- 현재 URL에서 활성 도메인 자동 감지 → 해당 LNB 렌더링
- 역할별 메뉴 필터링 (roles 배열)
- 프로필 아바타 클릭 → 드롭다운 (내 정보/알림 설정, 로그아웃)
- 설정 도메인: GNB 프로필 드롭다운 내 "시스템 설정" 링크 또는 별도 GNB 아이콘

**timeline.js API 스펙:**

```
renderMinimap(container, options)
  - options: { schedules[], media[], focusRange, onFocusChange(range) }
  - 분기 축소 뷰 + 포커스 사각형 렌더링

renderFocusView(container, options)
  - options: { schedules[], media[], range, todayDate }
  - 확대된 월간 타임라인 + 오늘 마커 + 바 렌더링

renderProgressBar(container, options)
  - options: { startDate, endDate, todayDate }
  - 단일 편성 진행바 렌더링

renderConflictTimeline(container, options)
  - options: { currentSchedule, conflictSchedule, selectedOption }
  - 두 편성 비교 + 겹침 구간 강조
```

모든 함수는 DOM 조작 기반 (Canvas 미사용). 프로토타입 수준이므로 더미 데이터 하드코딩 허용.

### 7.4 접근성

- 타임라인 바: `role="img"` + `aria-label="편성명, 기간, 상태"`
- 미니맵: `role="navigation"` + `aria-label="편성 타임라인 전체 보기"`
- 오늘 마커: `aria-hidden="true"` (시각 전용, 날짜 정보는 바 aria-label에 포함)
- 상태 dot: `title` 속성으로 "동기화 완료/미완료" 텍스트 제공
- GNB 도메인 탭: `role="tablist"` + `role="tab"` + `aria-selected`
- 프로필 드롭다운: `aria-haspopup="menu"`, `aria-expanded`

### 7.5 기존 페이지 호환

style.css 끝에 호환 레이어 포함:
- `.badge-green/red/yellow/blue/gray` → 새 토큰으로 매핑
- `table/th/td` 기본 스타일 유지
- `.tab-group/.tab-item` → 세그먼트 컨트롤 스타일로 매핑
- `.stat-card h3` 호환

Tailwind CDN config 오버라이드:
- `blue` scale → primary green 매핑
- `gray` scale → warm gray 매핑
- `borderRadius` → 네이버 기준 매핑

---

## 8. 공통 컴포넌트 리디자인

편성관리 화면과 함께 `shared/style.css`의 기본 컴포넌트를 업데이트한다.
변경은 글로벌 적용 (편성 화면뿐 아니라 전체 프로토타입에 반영).

### 8.1 버튼

- radius: 6px (--radius-md)
- Primary: `linear-gradient(180deg, primary-400, primary-500)` + `box-shadow: 0 1px 2px rgba(primary-500, 0.3), inset 0 1px 0 rgba(white, 0.15)`
- Secondary: white bg + `border: 1px solid rgba(0,0,0,0.12)` + `box-shadow: 0 1px 2px rgba(0,0,0,0.04)`
- Danger: white bg + `border: 1px solid rgba(error-500, 0.25)`
- `letter-spacing: -0.01em`, `font-weight: 600`

### 8.2 카드

- radius: 10px (--radius-lg)
- `border: 1px solid rgba(0,0,0,0.06)`, `box-shadow: 0 1px 3px rgba(0,0,0,0.03)`
- **아이콘**: 16px Lucide 스트로크 아이콘, neutral-500 색상, 라벨과 같은 줄 인라인 배치
  - 매체: Monitor, 편성: Calendar, 캠페인: Play, 소재: File, 리포트: BarChart
  - 아이콘 라이브러리: Lucide (MIT, lucide.dev)
- 숫자: `font-size: 28px`, `font-weight: 700`, `letter-spacing: -0.03em`
- 하위 상태: 숫자 아래, 10px, dot+텍스트 인라인

### 8.3 뱃지 / 상태 표시

**인라인 상태 (테이블, 목록 내):**
- dot(7px) + 텍스트. 배경 없음.
- 적용중: 솔리드 dot (primary-500)
- 예약됨: 아웃라인 dot (primary-500 border, white fill) — 타임라인 바와 동일 언어
- 일시정지: 솔리드 dot (warning-500, opacity 0.6)
- 종료: 솔리드 dot (neutral-300)

**강조 뱃지 (헤더, 카드 타이틀):**
- radius: 4px (풀라운드 제거)
- 반투명 bg + 반투명 border
- 예: `background: rgba(primary-500, 0.1)`, `border: 1px solid rgba(primary-500, 0.2)`

### 8.4 테이블 → 카드 행

- `<table>` 대신 flex 레이아웃 카드 행
- 행간 4px gap
- 각 행: `border-radius: 6px`, `border: 1px solid rgba(0,0,0,0.04)`, `box-shadow: 0 1px 2px rgba(0,0,0,0.02)`
- 헤더: 배경 없이 텍스트만 (11px, neutral-500)
- 링크색: 블루 제거 → 본문색(neutral-900) + font-weight 600

### 8.5 인풋 / 폼

- radius: 6px
- 라벨: 11px, neutral-500, `letter-spacing: 0.01em`
- 인풋: white bg, `border: 1px solid rgba(0,0,0,0.1)`
- 포커스: `border-color: primary-500` + `box-shadow: 0 0 0 3px rgba(primary-500, 0.08)`
- Select: 커스텀 SVG 화살표, `appearance: none`

### 8.6 탭 → 세그먼트 컨트롤

- 컨테이너: `background: rgba(0,0,0,0.04)`, `border-radius: 6px`, `padding: 3px`
- 활성 탭: white bg + `box-shadow: 0 1px 2px rgba(0,0,0,0.06)`, `border-radius: 4px`
- 비활성: 배경 없음, neutral-500 텍스트
- 괄호 제거, 숫자만 라벨 옆에

---

## 9. 범위 외 (이번 작업에 포함하지 않음)

- 다른 도메인 화면 (대시보드, 매체, 소재, 캠페인 등) 내용 리디자인
- 반응형 브레이크포인트 처리 (데스크톱 우선)
- 다크 모드
- 실제 데이터 연동 (프로토타입 더미 데이터 사용)
- LNB 없는 도메인(대시보드)의 레이아웃 조정은 GNB 구현 시 자동 처리
