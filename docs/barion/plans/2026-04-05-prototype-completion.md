# 프로토타입 완성 계획 (Phase 1 + Phase 2)

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 후반 4개 프로토타입 Nielsen 30+ 보강 + 누락 9개 화면 추가 → 31/31 커버리지 달성

**Architecture:** shared.css에 반응형 breakpoint를 추가하여 공통 이슈 일괄 해결 후, 개별 파일의 P1 이슈를 수정. 누락 화면은 GATE D1(화면 명세) 작성 후 shared.css 기반으로 생성.

**Tech Stack:** HTML, CSS (shared.css 기반), Vanilla JS (인터랙션), Playwright (렌더링 검증)

---

## Phase 1: 후반 4개 프로토타입 보강

### Task 1: shared.css 반응형 breakpoint 추가

4개 프로토타입 공통으로 반응형 레이아웃이 없음. shared.css에 breakpoint를 추가하면 7개 파일 전체에 자동 적용.

**Files:**
- Modify: `prototype/shared.css`

- [ ] **Step 1: shared.css 끝에 반응형 미디어쿼리 추가**

```css
/* === RESPONSIVE === */
@media (max-width: 1024px) {
  .summary-widget { grid-template-columns: repeat(2, 1fr); }
  .form-grid { grid-template-columns: 1fr; }
  .drawer { width: 100%; }
}

@media (max-width: 768px) {
  .sidebar { display: none; }
  .main { margin-left: 0; padding: var(--space-4); }
  .gnb { padding: 0 var(--space-3); }
  .summary-widget { grid-template-columns: 1fr; }
  .filter-bar { flex-direction: column; align-items: stretch; }
  .filter-select { min-width: unset; width: 100%; }
  .filter-input { min-width: unset; width: 100%; }
  .data-table-wrap { overflow-x: auto; }
  .data-table { min-width: 640px; }
  .page-header { flex-direction: column; align-items: flex-start; gap: var(--space-3); }
  .modal { max-width: 95%; }
}
```

- [ ] **Step 2: 브라우저에서 768px/1024px 뷰포트 확인**

7개 파일 모두 열어서 레이아웃 깨짐 없는지 확인.

- [ ] **Step 3: 커밋**

```bash
git add prototype/shared.css
git commit -m "a11y: shared.css 반응형 breakpoint 추가 (1024px, 768px)"
```

---

### Task 2: shared.css 접근성 공통 보강

skip-to-content, focus-visible, 공통 접근성 스타일 추가.

**Files:**
- Modify: `prototype/shared.css`

- [ ] **Step 1: shared.css에 접근성 유틸 추가**

```css
/* === ACCESSIBILITY === */
.skip-to-content {
  position: absolute; top: -100%; left: var(--space-4);
  padding: var(--space-2) var(--space-4); background: var(--color-interactive-primary);
  color: var(--color-text-inverse); border-radius: var(--radius-md);
  font-size: var(--text-sm); font-weight: 600; z-index: 9999;
  transition: top var(--transition-fast);
}
.skip-to-content:focus { top: var(--space-2); }

.btn-primary:focus-visible,
.btn-secondary:focus-visible,
.btn-destructive:focus-visible,
.btn-ghost:focus-visible {
  outline: 2px solid var(--color-focus-ring);
  outline-offset: 2px;
}

.sr-only {
  position: absolute; width: 1px; height: 1px; padding: 0; margin: -1px;
  overflow: hidden; clip: rect(0,0,0,0); white-space: nowrap; border: 0;
}
```

- [ ] **Step 2: 7개 HTML 파일 `<body>` 직후에 skip-to-content 링크 추가**

각 파일의 `<body>` 또는 `<div class="app">` 직후에:
```html
<a href="#main-content" class="skip-to-content">본문으로 건너뛰기</a>
```
그리고 `<main class="main">` 에 `id="main-content"` 추가.

- [ ] **Step 3: 커밋**

```bash
git add prototype/shared.css prototype/*.html
git commit -m "a11y: skip-to-content, focus-visible, sr-only 공통 추가"
```

---

### Task 3: dashboard.html P1 수정

**Files:**
- Modify: `prototype/dashboard.html`

**P1 이슈:**
1. 색상만으로 긴급도 구분 → 아이콘/형태 추가
2. 반응형 (Task 1에서 공통 처리, 대시보드 전용 그리드만 추가)

- [ ] **Step 1: 대시보드 전용 반응형 추가**

`<style>` 블록에 추가:
```css
@media (max-width: 1024px) {
  .dash-grid { grid-template-columns: repeat(2, 1fr); }
  .dash-wide { grid-template-columns: 1fr; }
  .admin-grid { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 768px) {
  .dash-grid { grid-template-columns: 1fr; }
  .admin-grid { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: 알림 dot에 형태 구분 추가 (색상+아이콘)**

`.alert-dot.urgent`에 삼각형 형태, `.alert-dot.normal`에 원형, `.alert-dot.info`에 사각형:
```css
.alert-dot.urgent { border-radius: 0; clip-path: polygon(50% 0%, 0% 100%, 100% 100%); width: 10px; height: 10px; }
.alert-dot.info { border-radius: 2px; }
```

- [ ] **Step 3: P2 인라인 스타일 정리 (주요 항목만)**

KPI 카드의 `tabindex="0"` + `cursor:pointer`에 `role="link"` 와 `aria-label` 추가, 또는 `tabindex`와 `cursor:pointer` 제거하여 혼란 방지.

→ `tabindex="0"` 제거 (클릭 동작이 없으므로).

- [ ] **Step 4: 렌더링 확인 후 커밋**

```bash
git add prototype/dashboard.html
git commit -m "fix(dashboard): 반응형 그리드, 알림 형태 구분, 비활성 tabindex 제거"
```

---

### Task 4: campaign-management.html P1 수정

**Files:**
- Modify: `prototype/campaign-management.html`

**P1 이슈:**
1. 스텝퍼 장식용 → Step 2, 3 콘텐츠 추가
2. 예산 입력 밸리데이션
3. 날짜 범위 검증

- [ ] **Step 1: 스텝퍼 3단계 실제 콘텐츠 구현**

Step 2 (매체 및 기간):
```html
<div class="form-card" id="step2-content" style="display:none;">
  <div class="form-card-title">매체 및 기간</div>
  <div class="form-grid">
    <div class="form-group">
      <label class="form-label">대상 매체 <span class="required">*</span></label>
      <select class="form-control" required>
        <option value="">매체 선택</option>
        <option>강남역 1번출구</option>
        <option>종로 전광판</option>
        <option>홍대입구 A</option>
      </select>
    </div>
    <div class="form-group">
      <label class="form-label">집행 기간 <span class="required">*</span></label>
      <div class="form-date-range">
        <input type="date" class="form-control" id="camp-start" onchange="validateDateRange()">
        <span>~</span>
        <input type="date" class="form-control" id="camp-end" onchange="validateDateRange()">
      </div>
      <div class="form-hint" id="date-error" style="color:var(--color-status-error);display:none;">종료일이 시작일보다 앞설 수 없습니다.</div>
    </div>
  </div>
</div>
```

Step 3 (예산 및 확인):
```html
<div class="form-card" id="step3-content" style="display:none;">
  <div class="form-card-title">예산 및 확인</div>
  <div class="form-grid">
    <div class="form-group">
      <label class="form-label">총 예산 (원)</label>
      <input type="text" class="form-control" inputmode="numeric" pattern="[0-9,]*" placeholder="예: 5,000,000" oninput="formatBudget(this)">
    </div>
    <div class="form-group">
      <label class="form-label">과금 모델</label>
      <select class="form-control"><option>CPM (노출당)</option><option>고정 금액</option></select>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 스텝퍼 네비게이션 JS 추가**

```javascript
function goToStep(n) {
  document.querySelectorAll('.step').forEach((s,i) => {
    s.classList.remove('active');
    if (i < n-1) s.classList.add('done');
    if (i === n-1) s.classList.add('active');
  });
  for (let i=1;i<=3;i++) {
    const el = document.getElementById('step'+i+'-content');
    if (el) el.style.display = i===n ? '' : 'none';
  }
}
function validateDateRange() {
  const s = document.getElementById('camp-start').value;
  const e = document.getElementById('camp-end').value;
  const err = document.getElementById('date-error');
  if (s && e && e < s) { err.style.display = ''; } else { err.style.display = 'none'; }
}
function formatBudget(el) {
  let v = el.value.replace(/[^\d]/g,'');
  el.value = v ? Number(v).toLocaleString('ko-KR') : '';
}
```

- [ ] **Step 3: 렌더링 확인 후 커밋**

```bash
git add prototype/campaign-management.html
git commit -m "fix(campaign): 스텝퍼 3단계 실제 구현, 예산/날짜 밸리데이션"
```

---

### Task 5: user-management.html P1 수정

**Files:**
- Modify: `prototype/user-management.html`

**P1 이슈:**
1. 필터/검색 없음 → filter-bar 추가
2. 인라인 폼 밸리데이션 없음

- [ ] **Step 1: 사용자 목록에 filter-bar 추가**

페이지 헤더와 toolbar 사이에 filter-bar 삽입:
```html
<div class="filter-bar">
  <select class="filter-select"><option value="">역할</option><option>어드민</option><option>매체사</option><option>운영대행사</option><option>영업대행사</option></select>
  <select class="filter-select"><option value="">상태</option><option>활성</option><option>비활성</option></select>
  <input type="text" class="filter-input" placeholder="이름, 이메일 검색...">
</div>
```

- [ ] **Step 2: 초대 폼 인라인 밸리데이션 추가**

drawer 내 form-group에 에러 상태 표시:
```javascript
function validateInviteForm() {
  let valid = true;
  const email = document.getElementById('invite-email');
  if (email && !email.value.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
    email.style.borderColor = 'var(--color-status-error)';
    showFieldError(email, '유효한 이메일 주소를 입력하세요.');
    valid = false;
  }
  return valid;
}
function showFieldError(el, msg) {
  let hint = el.parentElement.querySelector('.form-error');
  if (!hint) {
    hint = document.createElement('div');
    hint.className = 'form-hint form-error';
    hint.style.color = 'var(--color-status-error)';
    el.parentElement.appendChild(hint);
  }
  hint.textContent = msg;
}
```

- [ ] **Step 3: 비활성 사용자 행에 `aria-disabled` 추가**

```html
<tr tabindex="0" style="opacity:0.5" aria-disabled="true">
```

- [ ] **Step 4: 렌더링 확인 후 커밋**

```bash
git add prototype/user-management.html
git commit -m "fix(user): 필터바 추가, 인라인 폼 밸리데이션, aria-disabled"
```

---

### Task 6: notification-panel.html P1 수정

**Files:**
- Modify: `prototype/notification-panel.html`

**P1 이슈:**
1. 전체 읽음 undo 없음
2. ARIA 탭 패턴 미적용
3. 필터/그룹 비기능

- [ ] **Step 1: ARIA 탭 패턴 적용**

탭 컨테이너:
```html
<div class="notif-tabs" role="tablist" aria-label="알림 우선순위 필터">
  <button class="notif-tab active" role="tab" aria-selected="true" id="tab-all" aria-controls="notif-list">전체</button>
  <button class="notif-tab" role="tab" aria-selected="false" id="tab-urgent">긴급</button>
  <button class="notif-tab" role="tab" aria-selected="false" id="tab-normal">일반</button>
  <button class="notif-tab" role="tab" aria-selected="false" id="tab-info">정보</button>
</div>
```

- [ ] **Step 2: 전체 읽음에 확인 다이얼로그 + undo toast 추가**

```javascript
function markAllRead() {
  if (!confirm('모든 알림을 읽음 처리하시겠습니까?')) return;
  const items = document.querySelectorAll('.notif-item.unread');
  const prev = [...items].map(el => el.cloneNode(true));
  items.forEach(el => el.classList.remove('unread'));
  document.getElementById('badge-count').style.display = 'none';
  showToastWithUndo('모든 알림을 읽음 처리했습니다.', () => {
    items.forEach((el,i) => el.className = prev[i].className);
    document.getElementById('badge-count').style.display = '';
  });
}
```

- [ ] **Step 3: 필터 탭 실제 동작 구현**

```javascript
function filterTab(btn, category) {
  document.querySelectorAll('.notif-tab').forEach(t => {
    t.classList.remove('active');
    t.setAttribute('aria-selected','false');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-selected','true');
  document.querySelectorAll('.notif-item').forEach(item => {
    const dot = item.querySelector('.notif-dot');
    if (!dot) return;
    if (category === 'all') { item.style.display = ''; return; }
    item.style.display = dot.classList.contains(category) ? '' : 'none';
  });
}
```

- [ ] **Step 4: 그룹 펼치기 aria-expanded 추가**

```html
<div class="notif-group-header" onclick="toggleGroup(this)" aria-expanded="false">
```

- [ ] **Step 5: 렌더링 확인 후 커밋**

```bash
git add prototype/notification-panel.html
git commit -m "fix(notification): ARIA 탭패턴, 전체읽음 undo, 필터 동작 구현"
```

---

### Task 7: Phase 1 GATE 2 재평가

**Files:**
- 4개 프로토타입 (dashboard, campaign, user, notification)

- [ ] **Step 1: 4개 파일 Playwright 스크린샷 촬영**

localhost:8765에서 4개 파일 열어 full-page 스크린샷.

- [ ] **Step 2: Nielsen 점수 확인 — 30+ 미달 시 추가 보강**

각 파일의 주요 P1이 모두 해결됐는지 체크리스트:
- [ ] 반응형 (768px, 1024px)
- [ ] skip-to-content
- [ ] focus-visible
- [ ] 색상 외 형태 구분 (dashboard)
- [ ] 스텝퍼 동작 (campaign)
- [ ] 필터 존재 (user)
- [ ] ARIA 탭 (notification)

- [ ] **Step 3: 결과 커밋 (추가 수정 있을 경우)**

---

## Phase 2: 누락 9개 화면 추가

### Task 8: 화면 명세 (GATE D1) — 공통/인증 (S-00, S-01)

CLAUDE.md 규칙: 화면 명세를 거치지 않은 프로토타입 생성 금지.

**Files:**
- Create: `docs/design/screens/S-00-login.md`
- Create: `docs/design/screens/S-01-signup-complete.md`

- [ ] **Step 1: S-00 로그인 화면 명세 작성**

```markdown
# S-00: 로그인

## 출처
- UC-02 (초대받은 사용자가 가입 완료)
- IA: 비로그인 시 진입점

## 레이아웃
- 중앙 정렬 카드 (max-width: 400px)
- 배경: --color-bg-primary
- 로고 + 서비스명 상단

## 컴포넌트
- 이메일 입력 (form-control, type="email", required)
- 비밀번호 입력 (form-control, type="password", required)
- "로그인" 버튼 (btn-primary, full-width)
- "비밀번호 찾기" 링크 (text-link)
- 에러 메시지 영역 (이메일/비밀번호 불일치 시)

## 상태
- 기본: 폼 입력 대기
- 로딩: 버튼 disabled + 스피너
- 에러: 인라인 에러 메시지 표시

## 접근성
- autofocus on email
- Enter 키로 제출
- 에러 시 aria-live="polite"

## 역할 분기
- 없음 (모든 역할 동일)
```

- [ ] **Step 2: S-01 가입 완료 화면 명세 작성**

```markdown
# S-01: 가입 완료

## 출처
- UC-02: 초대 링크 → 이름/비밀번호 설정
- IA: 초대 기반 전용

## 레이아웃
- 중앙 정렬 카드 (max-width: 400px)
- 상단에 초대 정보 표시 (초대한 사람, 역할)

## 컴포넌트
- 이름 입력 (form-control, required)
- 비밀번호 입력 (form-control, type="password", required)
- 비밀번호 확인 입력 (form-control, type="password")
- 비밀번호 강도 표시 바
- "가입 완료" 버튼 (btn-primary, full-width)

## 상태
- 기본: 초대 정보 + 폼
- 비밀번호 불일치: 인라인 에러
- 토큰 만료: 에러 카드 + "관리자에게 재발급 요청" 안내
- 완료: 성공 메시지 + "로그인" 이동 링크

## 접근성
- autofocus on name
- 비밀번호 강도 aria-live
```

- [ ] **Step 3: 커밋**

```bash
git add docs/design/screens/
git commit -m "docs: S-00 로그인, S-01 가입완료 화면 명세 (GATE D1)"
```

---

### Task 9: 화면 명세 (GATE D1) — 매체 확장 (S-05, S-09, S-10, S-11)

**Files:**
- Create: `docs/design/screens/S-05-media-company.md`
- Create: `docs/design/screens/S-09-ssp-integration.md`
- Create: `docs/design/screens/S-10-foot-traffic.md`
- Create: `docs/design/screens/S-11-media-group.md`

- [ ] **Step 1: S-05 매체사 목록/등록 명세**

```markdown
# S-05: 매체사 목록/등록

## 출처
- UC-06: 어드민이 매체사 등록

## 레이아웃
- 표준 CRUD 레이아웃 (page-header + data-table)
- 등록: drawer (우측 슬라이드)

## 컴포넌트
- page-header: "매체사 관리" + btn-primary "매체사 등록"
- data-table: 매체사명, 사업자등록번호, 대표자, 소속 매체 수, 등록일
- drawer (등록/수정):
  - 매체사명 (form-control, required)
  - 사업자등록번호 (form-control, pattern="[0-9]{3}-[0-9]{2}-[0-9]{5}", required)
  - 대표자명 (form-control)
  - 연락처 (form-control, type="tel")
  - 주소 (form-control)

## 상태
- 목록: 기본
- drawer 열림: 등록/수정
- 사업자등록번호 중복: 인라인 에러

## 역할 분기
- 어드민 전용 (IA 매트릭스 참고)
```

- [ ] **Step 2: S-09 SSP 연동 설정 명세**

```markdown
# S-09: SSP 연동 설정

## 출처
- UC-09: 네이버 SSP Webhook/매체 매핑

## 레이아웃
- 설정 페이지 (form-card 기반)

## 컴포넌트
- form-card "SSP 연동":
  - Webhook URL (form-control, readonly + 복사 버튼)
  - API Key (form-control, type="password" + 표시 토글)
  - 연동 상태 badge (연동됨/미연동/오류)
- form-card "매체 매핑":
  - data-table: SSP 매체ID ↔ CMS 매체명 매핑
  - btn-primary "매핑 추가"
- form-card "이벤트 로그":
  - 최근 Webhook 수신 이력 (타임스탬프, 이벤트, 상태)

## 역할 분기
- 어드민, 매체사, 운영대행사 접근 가능
```

- [ ] **Step 3: S-10 유동인구 데이터 연결 명세**

```markdown
# S-10: 유동인구 데이터 연결

## 출처
- UC-10: 외부 유동인구 데이터 소스 매핑

## 레이아웃
- 설정 페이지 (form-card 기반)

## 컴포넌트
- form-card "데이터 소스":
  - 제공사 선택 (form-select: SKT, KT, 직접입력)
  - API Endpoint (form-control)
  - 인증 키 (form-control, type="password")
  - "연결 테스트" btn-secondary
  - 연결 상태 badge
- form-card "매체 매핑":
  - data-table: 매체명 ↔ 데이터 포인트 ID
- 최종 동기화 시각 표시

## 역할 분기
- 어드민 전용
```

- [ ] **Step 4: S-11 매체 그룹 관리 명세**

```markdown
# S-11: 매체 그룹 관리

## 출처
- UC-37: 그룹 CRUD, 매체 배정

## 레이아웃
- 2패널: 좌측 그룹 목록 + 우측 그룹 상세/매체 배정

## 컴포넌트
- 좌측 패널:
  - 그룹 목록 (카드형, 이름 + 소속 매체 수)
  - btn-primary "그룹 추가"
- 우측 패널:
  - 그룹명 (form-control, 인라인 편집)
  - 배정된 매체 목록 (체크박스 + 매체명 + 위치)
  - 미배정 매체 목록 (추가 가능)
  - btn-destructive "그룹 삭제"

## 역할 분기
- 어드민, 매체사
```

- [ ] **Step 5: 커밋**

```bash
git add docs/design/screens/
git commit -m "docs: S-05, S-09, S-10, S-11 매체 확장 화면 명세 (GATE D1)"
```

---

### Task 10: 화면 명세 (GATE D1) — 소재/리포트 (S-14, S-27, S-28)

**Files:**
- Create: `docs/design/screens/S-14-material-spec-guide.md`
- Create: `docs/design/screens/S-27-report-list.md`
- Create: `docs/design/screens/S-28-report-create.md`

- [ ] **Step 1: S-14 소재 규격 안내 명세**

```markdown
# S-14: 매체별 소재 규격 안내

## 출처
- 페르소나 인터뷰: 광고주 사전 공유용 규격 가이드
- 기회 #6: 검수 실패율 감소

## 레이아웃
- 읽기 전용 가이드 페이지 (공유 링크 가능)
- 매체별 카드 나열

## 컴포넌트
- page-header: "소재 규격 안내" + btn-secondary "링크 복사"
- 매체 카드 (반복):
  - 매체명, 디스플레이 타입, 해상도
  - 허용 포맷: MP4, JPG, PNG (아이콘 + 텍스트)
  - 파일 크기 제한
  - 권장 비트레이트 (영상)
  - 재생 시간 옵션: 15초, 30초
  - 업로드 가이드 요약

## 역할 분기
- 전체 역할 접근 가능 (읽기 전용)
```

- [ ] **Step 2: S-27 리포트 목록 명세**

```markdown
# S-27: 리포트 목록

## 출처
- UC-31: 리포트 조회/다운로드

## 레이아웃
- 표준 목록 (filter-bar + data-table)

## 컴포넌트
- filter-bar:
  - 리포트 유형 (filter-select: 노출, 정산, 매체 현황, 캠페인)
  - 기간 (date range)
  - 매체 (filter-select)
- data-table: 리포트명, 유형, 기간, 생성일, 상태(생성중/완료/실패), 다운로드
- 상태 badge: .badge-generating, .badge-complete, .badge-failed
- 다운로드 버튼 (CSV/PDF 아이콘)
- 미리보기: 행 클릭 → drawer에 요약 차트

## 역할 분기
- 어드민, 매체사: 전체
- 운영대행사: 부여 매체 범위
```

- [ ] **Step 3: S-28 리포트 생성/예약 명세**

```markdown
# S-28: 리포트 생성/예약

## 출처
- UC-30: 리포트 생성 및 예약 발송

## 레이아웃
- form-card 기반 설정 페이지

## 컴포넌트
- form-card "리포트 설정":
  - 리포트 유형 (form-select: 노출 리포트, 정산 리포트, 매체 현황, 캠페인 성과)
  - 대상 매체 (다중 선택 체크박스)
  - 기간 (date range)
- form-card "예약 발송" (선택):
  - 토글: 예약 발송 활성화
  - 주기 (form-select: 매일, 매주, 매월)
  - 수신자 이메일 (태그 입력)
  - 발송 시각
- 하단 액션:
  - btn-primary "즉시 생성"
  - btn-secondary "예약 저장"
  - btn-ghost "취소"

## 역할 분기
- 어드민, 매체사: 전체
- 운영대행사: 부여 매체 범위
```

- [ ] **Step 4: 커밋**

```bash
git add docs/design/screens/
git commit -m "docs: S-14, S-27, S-28 소재규격/리포트 화면 명세 (GATE D1)"
```

---

### Task 11: 프로토타입 생성 — S-00 로그인 + S-01 가입 완료

인증 화면은 GNB/사이드바가 없는 독립 레이아웃. shared.css의 토큰/리셋/폼만 사용.

**Files:**
- Create: `prototype/login.html`
- Create: `prototype/signup-complete.html`

- [ ] **Step 1: S-00 login.html 생성**

화면 명세(Task 8) 기준으로 중앙 정렬 카드 레이아웃 구현.
- shared.css 링크
- 페이지 전용 CSS: .auth-card, .auth-logo, .auth-error
- 폼: 이메일 + 비밀번호 + 로그인 버튼
- JS: 간단한 밸리데이션 + 에러 표시

- [ ] **Step 2: S-01 signup-complete.html 생성**

화면 명세(Task 8) 기준.
- 초대 정보 표시 (초대자, 역할)
- 이름 + 비밀번호 + 확인 + 강도 표시
- 토큰 만료 상태

- [ ] **Step 3: 렌더링 확인 후 커밋**

```bash
git add prototype/login.html prototype/signup-complete.html
git commit -m "feat: S-00 로그인, S-01 가입완료 프로토타입 추가"
```

---

### Task 12: 프로토타입 생성 — S-05 매체사 관리

기존 media-management.html과 동일한 패턴 (표준 CRUD + drawer).

**Files:**
- Create: `prototype/media-company.html`

- [ ] **Step 1: media-company.html 생성**

화면 명세(Task 9) 기준.
- shared.css + Pretendard 링크
- GNB + sidebar (매체 관리 active)
- page-header + data-table (매체사명, 사업자등록번호, 대표자, 소속 매체 수, 등록일)
- drawer: 등록/수정 폼
- 사업자등록번호 포맷 밸리데이션

- [ ] **Step 2: 렌더링 확인 후 커밋**

```bash
git add prototype/media-company.html
git commit -m "feat: S-05 매체사 관리 프로토타입 추가"
```

---

### Task 13: 프로토타입 생성 — S-09, S-10 설정 화면

설정 페이지 패턴 (form-card 기반).

**Files:**
- Create: `prototype/ssp-integration.html`
- Create: `prototype/foot-traffic.html`

- [ ] **Step 1: ssp-integration.html 생성**

화면 명세(Task 9) 기준.
- SSP 연동 설정: Webhook URL, API Key, 연동 상태, 매체 매핑 테이블, 이벤트 로그

- [ ] **Step 2: foot-traffic.html 생성**

화면 명세(Task 9) 기준.
- 유동인구 데이터 연결: 데이터 소스 설정, 연결 테스트, 매체-데이터포인트 매핑

- [ ] **Step 3: 렌더링 확인 후 커밋**

```bash
git add prototype/ssp-integration.html prototype/foot-traffic.html
git commit -m "feat: S-09 SSP 연동, S-10 유동인구 데이터 프로토타입 추가"
```

---

### Task 14: 프로토타입 생성 — S-11 매체 그룹 관리

2패널 레이아웃.

**Files:**
- Create: `prototype/media-group.html`

- [ ] **Step 1: media-group.html 생성**

화면 명세(Task 9) 기준.
- 좌측: 그룹 목록 (카드형)
- 우측: 그룹 상세 + 매체 배정/해제
- JS: 그룹 선택 → 우측 패널 전환

- [ ] **Step 2: 렌더링 확인 후 커밋**

```bash
git add prototype/media-group.html
git commit -m "feat: S-11 매체 그룹 관리 프로토타입 추가"
```

---

### Task 15: 프로토타입 생성 — S-14 소재 규격 안내

읽기 전용 가이드 페이지. 가장 단순한 화면.

**Files:**
- Create: `prototype/material-spec-guide.html`

- [ ] **Step 1: material-spec-guide.html 생성**

화면 명세(Task 10) 기준.
- 매체별 규격 카드 나열 (기존 5개 매체 데이터 활용)
- "링크 복사" 버튼
- 반응형 그리드 (카드 2열 → 1열)

- [ ] **Step 2: 렌더링 확인 후 커밋**

```bash
git add prototype/material-spec-guide.html
git commit -m "feat: S-14 소재 규격 안내 프로토타입 추가"
```

---

### Task 16: 프로토타입 생성 — S-27, S-28 리포트

표준 목록 + 생성 폼 패턴.

**Files:**
- Create: `prototype/report.html`

- [ ] **Step 1: report.html 생성 (S-27 목록 + S-28 생성 통합)**

campaign-management.html 패턴과 동일하게 view 전환:
- view-report-list: filter-bar + data-table + badge(생성중/완료/실패) + 다운로드 아이콘
- view-report-create: form-card 기반 설정 + 예약 발송 토글
- drawer: 미리보기 (차트 placeholder)

- [ ] **Step 2: 렌더링 확인 후 커밋**

```bash
git add prototype/report.html
git commit -m "feat: S-27 리포트 목록, S-28 리포트 생성 프로토타입 추가"
```

---

### Task 17: 커버리지 검증 + 최종 커밋

**Files:**
- 전체 프로토타입 디렉토리

- [ ] **Step 1: 31개 화면 커버리지 대조**

| 화면 | 프로토타입 파일 | 상태 |
|------|---------------|------|
| S-00 | login.html | ✅ |
| S-01 | signup-complete.html | ✅ |
| S-02 | dashboard.html | ✅ |
| S-03~04 | user-management.html | ✅ |
| S-05 | media-company.html | ✅ |
| S-06~08 | media-management.html | ✅ |
| S-09 | ssp-integration.html | ✅ |
| S-10 | foot-traffic.html | ✅ |
| S-11 | media-group.html | ✅ |
| S-12~13 | material-management.html | ✅ |
| S-14 | material-spec-guide.html | ✅ |
| S-15~17 | campaign-management.html | ✅ |
| S-18~25 | scheduling-management.html | ✅ |
| S-26 | notification-panel.html | ✅ |
| S-27~28 | report.html | ✅ |
| S-29 | *(내 정보 — 기존 프로토타입 내 또는 별도)* | 확인 필요 |
| S-30 | *(Slack 설정 — 기존 프로토타입 내 또는 별도)* | 확인 필요 |

- [ ] **Step 2: S-29, S-30 커버리지 확인**

S-29(내 정보/알림 설정)와 S-30(Slack 연동 설정)은 IA에서 별도 화면으로 정의됨.
현재 프로토타입에 없다면 추가 필요. 설정 화면 패턴(form-card)이므로 S-09/S-10과 동일.

- [ ] **Step 3: 전체 Playwright 스크린샷 일괄 촬영 + 검증**

- [ ] **Step 4: 메모리 업데이트 (pipeline progress)**

```markdown
### Phase 3: 프로토타입 — 완료
- 31/31 화면 커버, 모두 GATE 2 통과
- CSS 공통화 완료, 반응형 추가
- Nielsen 30+ 균일 품질 달성
```
