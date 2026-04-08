# S-02 대시보드 리디자인 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use barion:subagent-driven-development (recommended) or barion:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 기존 공장형 대시보드를 anti-factory 원칙이 적용된 비대칭 그리드 기반 대시보드로 리디자인

**Architecture:** 기존 2026-04-07-prototype의 index.html을 교체. shared/style.css에 대시보드 전용 스타일 추가. 역할별 ZONE 3는 layout.js의 role 시스템 활용. 정적 HTML 프로토타입이므로 데이터는 인라인 하드코딩.

**Tech Stack:** HTML, CSS (design-foundation tokens + Tailwind utilities), Vanilla JS (layout.js role switcher)

---

## File Structure

| 파일 | 역할 | 변경 |
|------|------|------|
| `2026-04-07-prototype/index.html` | 대시보드 메인 | **완전 교체** |
| `2026-04-07-prototype/shared/style.css` | 공통 + 대시보드 전용 스타일 | **하단에 추가** |
| `2026-04-07-prototype/shared/layout.js` | GNB/사이드바/역할 스위처 | 변경 없음 |
| `2026-04-07-prototype/shared/icons.js` | SVG 아이콘 | 필요 시 아이콘 추가 |

---

### Task 1: 대시보드 전용 CSS 추가

**Files:**
- Modify: `2026-04-07-prototype/shared/style.css` (하단에 대시보드 섹션 추가)

- [ ] **Step 1: style.css 하단에 대시보드 전용 토큰/컴포넌트 추가**

```css
/* ══ Dashboard — Anti-Factory Redesign ══ */

/* Zone spacing */
.dash-zone { margin-bottom: 24px; } /* --space-6: zone 간 간격 */
.dash-zone:last-child { margin-bottom: 0; }

/* Asymmetric hero grid (ZONE 1) */
.dash-hero-grid {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 12px; /* --space-3: 같은 zone 내 카드 간 */
}

/* Hero anomaly card — Level 2 (부유) */
.dash-hero-card {
  grid-row: span 2;
  border-radius: var(--radius-lg);
  padding: 20px;
}
.dash-hero-card.alert {
  background: var(--color-error-50);
  border: 1.5px solid oklch(0.75 0.16 25); /* error-300 */
  box-shadow: 0 4px 12px oklch(0.55 0.24 25 / 0.08); /* shadow-md error tint */
}
.dash-hero-card.calm {
  background: var(--color-neutral-50);
  border: 1px solid var(--color-border-default);
}
.dash-hero-count {
  font-size: 32px;
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  line-height: 1;
}
.dash-hero-label {
  font-size: var(--text-sm);
  font-weight: 700;
  margin-bottom: 12px;
}

/* Anomaly list item inside hero */
.dash-anomaly-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 10px;
  background: white;
  border-radius: var(--radius-md);
  margin-bottom: 6px;
}
.dash-anomaly-item:last-child { margin-bottom: 0; }
.dash-anomaly-name { font-weight: 600; font-size: var(--text-sm); color: var(--color-neutral-900); }
.dash-anomaly-location { font-size: var(--text-xs); color: var(--color-neutral-500); }
.dash-anomaly-badge {
  font-size: var(--text-xs);
  font-weight: 600;
  padding: 2px 8px;
  border-radius: var(--radius-sm);
}
.dash-anomaly-badge.error { background: var(--color-error-50); color: var(--color-error-500); }
.dash-anomaly-badge.warning { background: var(--color-warning-50); color: var(--color-warning-600); }

/* KPI cards — Level 1 (표면) */
.dash-kpi {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-sm);
  cursor: pointer;
  transition: box-shadow 0.15s ease;
  text-decoration: none;
  color: inherit;
  display: block;
}
.dash-kpi:hover { box-shadow: var(--shadow-md); }
.dash-kpi-label {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  font-weight: 500;
  margin-bottom: 6px;
}
.dash-kpi-value {
  font-weight: 800;
  letter-spacing: -0.03em;
  font-variant-numeric: tabular-nums;
  color: var(--color-neutral-900);
  line-height: 1;
}
.dash-kpi-value.hero { font-size: 22px; } /* 조연: 전체 매체 */
.dash-kpi-value.supporting { font-size: 16px; } /* 배경: 캠페인, 편성 */
.dash-kpi-sub {
  font-size: var(--text-xs);
  color: var(--color-neutral-500);
  margin-top: 4px;
}
.dash-kpi-pair {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 8px; /* --space-2 */
}

/* ZONE 2: 1fr 1fr grid */
.dash-mid-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

/* Panel — Level 1 */
.dash-panel {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 14px;
  box-shadow: var(--shadow-sm);
}
.dash-panel-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}
.dash-panel-title { font-size: var(--text-sm); font-weight: 700; color: var(--color-neutral-900); }
.dash-panel-link { font-size: var(--text-xs); color: var(--color-primary-500); font-weight: 600; text-decoration: none; }
.dash-panel-link:hover { text-decoration: underline; }

/* Alert list */
.dash-alert-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 0;
  border-bottom: 1px solid var(--color-neutral-100);
}
.dash-alert-item:last-child { border-bottom: none; }
.dash-alert-dot { width: 6px; height: 6px; flex-shrink: 0; }
.dash-alert-dot.urgent { background: var(--color-error-500); clip-path: polygon(50% 0%, 0% 100%, 100% 100%); width: 8px; height: 8px; }
.dash-alert-dot.normal { background: var(--color-primary-500); border-radius: 50%; }
.dash-alert-dot.info { background: var(--color-neutral-300); border-radius: 2px; }
.dash-alert-text { flex: 1; font-size: var(--text-xs); font-weight: 500; color: var(--color-neutral-900); }
.dash-alert-time { font-size: var(--text-xs); color: var(--color-neutral-400); }

/* Map placeholder */
.dash-map-placeholder {
  height: 160px;
  background: var(--color-neutral-100);
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--color-neutral-400);
  font-size: var(--text-sm);
  border: 1px dashed var(--color-neutral-300);
  position: relative;
}
.dash-map-pin {
  position: absolute;
  width: 10px; height: 10px;
  border-radius: 50%;
  border: 2px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

/* ZONE 3: Admin grid */
.dash-admin-grid {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 12px;
}
.dash-admin-card {
  background: white;
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 14px;
}
.dash-admin-label {
  font-size: 9px;
  font-weight: 600;
  color: var(--color-neutral-500);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 6px;
}
.dash-admin-value {
  font-size: var(--text-lg);
  font-weight: 800;
  font-variant-numeric: tabular-nums;
}
.dash-admin-sub { font-size: var(--text-xs); color: var(--color-neutral-400); margin-top: 2px; }

/* Warning banner (동시편집, 비정상 캠페인) */
.dash-warn-banner {
  padding: 10px 14px;
  border-radius: var(--radius-md);
  background: var(--color-warning-50);
  border: 1px solid oklch(0.87 0.10 55); /* warning-200 */
  font-size: var(--text-sm);
  color: oklch(0.52 0.11 55); /* warning-700 */
  font-weight: 500;
  margin-top: 12px;
}

/* Matching card — 매체사 의도 vs 현장 */
.dash-match-card {
  border-radius: var(--radius-lg);
  padding: 12px;
  margin-bottom: 8px;
}
.dash-match-card.mismatch {
  background: var(--color-error-50);
  border: 1.5px solid oklch(0.75 0.16 25);
}
.dash-match-card .match-header {
  font-weight: 700;
  font-size: var(--text-sm);
  color: var(--color-neutral-900);
  margin-bottom: 8px;
}
.dash-match-pair {
  display: flex;
  align-items: center;
  gap: 8px;
}
.dash-match-side {
  flex: 1;
  background: white;
  border-radius: var(--radius-md);
  padding: 8px;
  text-align: center;
}
.dash-match-label { font-size: 9px; color: var(--color-neutral-500); margin-bottom: 2px; }
.dash-match-value { font-size: var(--text-xs); font-weight: 600; }
.dash-match-divider { font-size: 16px; font-weight: 800; color: var(--color-error-500); }

.dash-match-ok {
  background: var(--color-neutral-50);
  border: 1px solid var(--color-border-default);
  border-radius: var(--radius-lg);
  padding: 10px 12px;
  display: flex;
  align-items: center;
  gap: 8px;
}
.dash-match-ok-dot { width: 8px; height: 8px; border-radius: 50%; background: var(--color-primary-500); }
.dash-match-ok-text { font-weight: 600; font-size: var(--text-xs); color: var(--color-neutral-900); }
.dash-match-ok-sub { font-size: var(--text-xs); color: var(--color-neutral-500); }

/* Page header */
.dash-page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.dash-page-title { font-size: var(--text-xl); font-weight: 800; color: var(--color-neutral-900); }
.dash-page-date { font-size: var(--text-xs); color: var(--color-neutral-400); margin-top: 2px; }
.dash-page-actions { display: flex; align-items: center; gap: 8px; }
.dash-refresh-btn {
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary-500);
  cursor: pointer;
  background: none;
  border: none;
  font-family: inherit;
}
.dash-refresh-btn:hover { text-decoration: underline; }
.dash-widget-time {
  font-size: var(--text-xs);
  color: var(--color-neutral-400);
}

/* Empty states */
.dash-empty {
  text-align: center;
  padding: 24px;
  color: var(--color-neutral-400);
  font-size: var(--text-sm);
}
.dash-empty-cta {
  display: inline-block;
  margin-top: 8px;
  font-size: var(--text-sm);
  font-weight: 600;
  color: var(--color-primary-500);
  text-decoration: none;
}
.dash-empty-cta:hover { text-decoration: underline; }

/* Responsive */
@media (max-width: 1024px) {
  .dash-hero-grid { grid-template-columns: 1fr; }
  .dash-hero-card { grid-row: auto; }
  .dash-mid-grid { grid-template-columns: 1fr; }
  .dash-admin-grid { grid-template-columns: 1fr 1fr; }
}
@media (max-width: 768px) {
  .dash-admin-grid { grid-template-columns: 1fr; }
  .dash-kpi-pair { grid-template-columns: 1fr; }
}
```

- [ ] **Step 2: 브라우저에서 기존 페이지 확인 후 커밋**

```bash
git add 2026-04-07-prototype/shared/style.css
git commit -m "style(dashboard): 대시보드 전용 CSS 컴포넌트 추가"
```

---

### Task 2: 대시보드 HTML — 페이지 헤더 + ZONE 1 (이상 감지 히어로 + KPI)

**Files:**
- Modify: `2026-04-07-prototype/index.html` (전체 교체)

- [ ] **Step 1: index.html을 새 구조로 교체 — 헤더 + ZONE 1**

```html
<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>DOOH CMS - 대시보드</title>
  <link rel="stylesheet" href="shared/style.css">
</head>
<body>
  <div id="app-header"></div>
  <div style="display:flex;">
    <div id="app-sidebar"></div>
    <main style="flex:1; padding:32px;">

      <!-- Page Header -->
      <div class="dash-page-header">
        <div>
          <h1 class="dash-page-title">대시보드</h1>
          <div class="dash-page-date" id="dash-date"></div>
        </div>
        <div class="dash-page-actions">
          <select class="form-input" style="width:auto; font-size:var(--text-sm);">
            <option selected>최근 7일</option>
            <option>최근 30일</option>
            <option>최근 90일</option>
          </select>
          <button class="dash-refresh-btn" onclick="refreshDashboard()">↻ 새로고침</button>
        </div>
      </div>

      <!-- ZONE 1: Asymmetric Hero Grid -->
      <div class="dash-zone">
        <div class="dash-hero-grid">

          <!-- Hero: Anomaly Card (2fr, span 2 rows) -->
          <div class="dash-hero-card alert" id="hero-card">
            <div style="display:flex; justify-content:space-between; align-items:center;">
              <div class="dash-hero-label" style="color:var(--color-error-500);">⚠ 이상 감지</div>
              <a href="media/list.html" class="dash-panel-link">전체 보기 →</a>
            </div>
            <div class="dash-hero-count" style="color:var(--color-error-500); margin-bottom:16px;">3<span style="font-size:14px; font-weight:600; margin-left:4px;">건</span></div>

            <div class="dash-anomaly-item">
              <div>
                <div class="dash-anomaly-name">강남역 1번출구</div>
                <div class="dash-anomaly-location">서울 강남구 · LCD · 1920×1080</div>
              </div>
              <span class="dash-anomaly-badge error">오프라인 5분</span>
            </div>
            <div class="dash-anomaly-item">
              <div>
                <div class="dash-anomaly-name">삼성역 B2</div>
                <div class="dash-anomaly-location">서울 강남구 · LED · 3840×2160</div>
              </div>
              <span class="dash-anomaly-badge warning">GPU 온도 높음</span>
            </div>
            <div class="dash-anomaly-item">
              <div>
                <div class="dash-anomaly-name">홍대입구 A</div>
                <div class="dash-anomaly-location">서울 마포구 · LCD · 1920×1080</div>
              </div>
              <span class="dash-anomaly-badge error">동기화 실패</span>
            </div>
          </div>

          <!-- KPI: 전체 매체 (조연) -->
          <a href="media/list.html" class="dash-kpi">
            <div class="dash-kpi-label">전체 매체 <span class="dash-widget-time">· 14:35</span></div>
            <div class="dash-kpi-value hero">142</div>
            <div class="dash-kpi-sub">
              <span style="color:var(--color-primary-500);">● 온라인 128</span> ·
              <span style="color:var(--color-error-500);">● 오프라인 8</span> ·
              비활성 6
            </div>
          </a>

          <!-- KPI: 캠페인 + 편성 (배경) -->
          <div class="dash-kpi-pair">
            <a href="campaigns/list.html" class="dash-kpi">
              <div class="dash-kpi-label">캠페인</div>
              <div class="dash-kpi-value supporting">47</div>
              <div class="dash-kpi-sub">초안 12 · 집행중 28 · 완료 5 · 취소 2</div>
            </a>
            <a href="schedules/list.html" class="dash-kpi">
              <div class="dash-kpi-label">편성</div>
              <div class="dash-kpi-value supporting">63</div>
              <div class="dash-kpi-sub">예약 15 · 적용중 38 · 일시정지 3 · 종료 7</div>
            </a>
          </div>

        </div>
      </div>

      <!-- ZONE 2 placeholder -->
      <div class="dash-zone" id="zone2"></div>

      <!-- ZONE 3 placeholder -->
      <div class="dash-zone" id="zone3"></div>

    </main>
  </div>
  <script src="shared/icons.js"></script>
  <script src="shared/layout.js"></script>
  <script>
    // Set date
    var now = new Date();
    var days = ['일','월','화','수','목','금','토'];
    document.getElementById('dash-date').textContent =
      now.getFullYear() + '년 ' + (now.getMonth()+1) + '월 ' + now.getDate() + '일 ' + days[now.getDay()] + '요일 · 마지막 갱신 ' + now.toTimeString().slice(0,5);

    function refreshDashboard() {
      var t = new Date().toTimeString().slice(0,5);
      document.getElementById('dash-date').textContent =
        document.getElementById('dash-date').textContent.replace(/마지막 갱신 \d{2}:\d{2}/, '마지막 갱신 ' + t);
    }
  </script>
</body>
</html>
```

- [ ] **Step 2: 브라우저에서 열어 비대칭 그리드 확인**

확인 항목:
- 이상 감지 카드가 좌측 2/3, 빨간 배경 + 컬러 shadow
- KPI 카드가 우측 1/3, 흰 배경 + 얇은 shadow
- 숫자 크기 3단계: 이상(32px) > 매체(22px) > 캠페인/편성(16px)

- [ ] **Step 3: 커밋**

```bash
git add 2026-04-07-prototype/index.html
git commit -m "feat(dashboard): ZONE 1 비대칭 히어로 그리드 구현"
```

---

### Task 3: ZONE 2 — 최근 알림 + 매체 위치 지도

**Files:**
- Modify: `2026-04-07-prototype/index.html` (ZONE 2 placeholder 교체)

- [ ] **Step 1: zone2 placeholder를 실제 내용으로 교체**

`id="zone2"`인 div의 내용을 다음으로 교체:

```html
<div class="dash-mid-grid">
  <!-- 최근 알림 -->
  <div class="dash-panel">
    <div class="dash-panel-header">
      <div class="dash-panel-title">최근 알림 <span class="dash-widget-time">· 14:35</span></div>
      <a href="notifications/center.html" class="dash-panel-link">전체 보기 →</a>
    </div>
    <div class="dash-alert-item">
      <div class="dash-alert-dot urgent"></div>
      <div class="dash-alert-text">강남역 1번출구 오프라인 감지</div>
      <div class="dash-alert-time">5분 전</div>
    </div>
    <div class="dash-alert-item">
      <div class="dash-alert-dot urgent"></div>
      <div class="dash-alert-text">봄맞이 프로모션 30s 수동검수 대기</div>
      <div class="dash-alert-time">12분 전</div>
    </div>
    <div class="dash-alert-item">
      <div class="dash-alert-dot normal"></div>
      <div class="dash-alert-text">4월 프로모션 편성 적용 시작</div>
      <div class="dash-alert-time">1시간 전</div>
    </div>
    <div class="dash-alert-item">
      <div class="dash-alert-dot info"></div>
      <div class="dash-alert-text">리포트 '3월 운영현황' 생성 완료</div>
      <div class="dash-alert-time">2시간 전</div>
    </div>
    <div class="dash-alert-item">
      <div class="dash-alert-dot normal"></div>
      <div class="dash-alert-text">사용자 '김영희' 가입 완료</div>
      <div class="dash-alert-time">3시간 전</div>
    </div>
  </div>

  <!-- 매체 위치 지도 -->
  <div class="dash-panel">
    <div class="dash-panel-header">
      <div class="dash-panel-title">매체 위치 <span class="dash-widget-time">· 14:35</span></div>
    </div>
    <div class="dash-map-placeholder">
      지도 위젯 (위경도 기반 매체 위치 시각화)
      <div class="dash-map-pin" style="top:25%; left:30%; background:var(--color-primary-500);"></div>
      <div class="dash-map-pin" style="top:45%; left:55%; background:var(--color-error-500);"></div>
      <div class="dash-map-pin" style="top:35%; left:70%; background:var(--color-primary-500);"></div>
      <div class="dash-map-pin" style="top:60%; left:40%; background:var(--color-neutral-300);"></div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 브라우저에서 확인**

확인 항목:
- 알림 dot 형태 분화: 삼각형(긴급), 원(일반), 사각형(정보)
- 지도 placeholder에 컬러 핀 표시
- ZONE 1과 ZONE 2 사이 24px 간격

- [ ] **Step 3: 커밋**

```bash
git add 2026-04-07-prototype/index.html
git commit -m "feat(dashboard): ZONE 2 알림 + 지도 패널 구현"
```

---

### Task 4: ZONE 3 — 어드민 전용 영역

**Files:**
- Modify: `2026-04-07-prototype/index.html` (ZONE 3 placeholder 교체)

- [ ] **Step 1: zone3 placeholder를 역할별 내용으로 교체**

`id="zone3"`인 div의 내용을 다음으로 교체:

```html
<!-- 어드민 전용 -->
<div data-roles="admin">
  <div class="dash-admin-grid">
    <a href="schedules/list.html" class="dash-admin-card" style="text-decoration:none; color:inherit;">
      <div class="dash-admin-label">동기화 미완료</div>
      <div class="dash-admin-value" style="color:var(--color-warning-500);">2건</div>
      <div class="dash-admin-sub">홍대입구 A, 여의도 C</div>
    </a>
    <div class="dash-admin-card">
      <div class="dash-admin-label">배치 실행 상태</div>
      <div class="dash-admin-value" style="color:var(--color-primary-500);">정상</div>
      <div class="dash-admin-sub">04.07 06:00 실행</div>
    </div>
    <div class="dash-admin-card">
      <div class="dash-admin-label">Slack 연동</div>
      <div class="dash-admin-value" style="color:var(--color-primary-500);">정상</div>
      <div class="dash-admin-sub">마지막 발송 14:30</div>
    </div>
  </div>
  <div class="dash-warn-banner">
    ⚠ 비정상 캠페인 1건: 현대자동차 봄 캠페인 — 시작일 경과 + 초안 상태
  </div>
</div>

<!-- 매체사 전용 -->
<div data-roles="media">
  <div style="font-size:var(--text-sm); font-weight:700; color:var(--color-neutral-900); margin-bottom:12px;">
    내 매체 동기화 현황 <span class="dash-widget-time">· 14:35</span>
  </div>

  <!-- 불일치: 매칭 카드 -->
  <div class="dash-match-card mismatch">
    <div class="match-header">강남역 1번출구 <span style="font-size:var(--text-xs); font-weight:500; color:var(--color-error-500); margin-left:4px;">불일치</span></div>
    <div class="dash-match-pair">
      <div class="dash-match-side">
        <div class="dash-match-label">CMS 의도</div>
        <div class="dash-match-value" style="color:var(--color-primary-500);">4월 프로모션 적용중</div>
      </div>
      <div class="dash-match-divider">≠</div>
      <div class="dash-match-side">
        <div class="dash-match-label">플레이어 현장</div>
        <div class="dash-match-value" style="color:var(--color-error-500);">v2.1 미반영</div>
      </div>
    </div>
  </div>

  <!-- 정상: 축약 -->
  <div class="dash-match-ok">
    <div class="dash-match-ok-dot"></div>
    <div>
      <div class="dash-match-ok-text">정상 동기화 3개 매체</div>
      <div class="dash-match-ok-sub">종로 전광판, 삼성역 B2, 역삼역 3번출구</div>
    </div>
  </div>
</div>

<!-- 운영대행사 전용 -->
<div data-roles="ops">
  <div style="margin-bottom:12px;">
    <div class="segment-control">
      <div class="segment-item active">시티미디어</div>
      <div class="segment-item">한빛미디어</div>
      <div class="segment-item">서울애드</div>
    </div>
  </div>
  <div class="dash-warn-banner">
    ⚠ 이준혁님이 시티미디어의 편성을 편집 중입니다
  </div>
  <div style="margin-top:12px;">
    <div class="dash-match-ok">
      <div class="dash-match-ok-dot"></div>
      <div>
        <div class="dash-match-ok-text">시티미디어 매체 3개 정상 동기화</div>
        <div class="dash-match-ok-sub">강남역 1번출구, 종로 전광판, 삼성역 B2</div>
      </div>
    </div>
  </div>
</div>
```

- [ ] **Step 2: 역할 스위처로 3개 역할 전환 확인**

확인 항목:
- 어드민: 동기화/배치/Slack 3칸 그리드 + 비정상 캠페인 경고
- 매체사: 매칭 카드(불일치) + 축약(정상)
- 운영대행사: segment control + 동시편집 경고 + 동기화 현황

- [ ] **Step 3: 커밋**

```bash
git add 2026-04-07-prototype/index.html
git commit -m "feat(dashboard): ZONE 3 역할별 전용 영역 구현"
```

---

### Task 5: Tailwind 의존성 제거 + 최종 검수

**Files:**
- Modify: `2026-04-07-prototype/index.html` (Tailwind CDN script 제거)

- [ ] **Step 1: index.html에서 Tailwind CDN과 tailwind.config 블록 제거**

기존 대시보드에 있던 `<script src="https://cdn.tailwindcss.com">` 및 `tailwind.config` 블록을 삭제. 이 프로토타입은 shared/style.css의 커스텀 CSS만 사용.

- [ ] **Step 2: 브라우저에서 전체 화면 최종 확인**

Anti-Factory 체크리스트:
- [ ] 원칙 1: 스크린샷만 보고 "대시보드"임을 알 수 있는가? (목록 화면과 다른가?)
- [ ] 원칙 2: 이상 감지가 가장 큰 시각적 무게를 가지는가?
- [ ] 원칙 3: primary green이 "전체 보기" 링크와 새로고침 버튼에만 쓰이는가?
- [ ] 원칙 4: ZONE 간 간격(24px) > 카드 간 간격(12px) > 카드 내부(8px) 비율 유지?
- [ ] 원칙 5: 지도 + 매칭 카드가 도메인 특화 UI로 기능하는가?

- [ ] **Step 3: 최종 커밋**

```bash
git add 2026-04-07-prototype/index.html
git commit -m "refactor(dashboard): Tailwind 의존성 제거 + anti-factory 최종 검수"
```
