// Timeline rendering module
// DOM 기반, 더미 데이터 하드코딩 허용

function parseDate(str) { return new Date(str + 'T00:00:00'); }
function daysBetween(a, b) { return Math.round((parseDate(b) - parseDate(a)) / 86400000); }
function dateToPercent(date, rangeStart, rangeEnd) {
  const total = daysBetween(rangeStart, rangeEnd);
  const elapsed = daysBetween(rangeStart, date);
  return Math.max(0, Math.min(100, (elapsed / total) * 100));
}

function getStatusClass(status) {
  return { active: 'active', reserved: 'reserved', paused: 'paused', ended: 'ended' }[status] || '';
}

/**
 * renderMinimap — 분기 축소 뷰 + 포커스 사각형
 */
function renderMinimap(container, { schedules, media, focusRange, rangeStart, rangeEnd, onFocusChange }) {
  const mediaWithSchedules = media.map(m => ({
    ...m,
    schedules: schedules.filter(s => s.mediaId === m.id)
  }));

  const todayPct = dateToPercent(TODAY, rangeStart, rangeEnd);
  const focusStartPct = dateToPercent(focusRange.start, rangeStart, rangeEnd);
  const focusEndPct = dateToPercent(focusRange.end, rangeStart, rangeEnd);

  const months = [];
  const start = parseDate(rangeStart);
  const end = parseDate(rangeEnd);
  let cursor = new Date(start);
  while (cursor < end) {
    months.push((cursor.getMonth()+1) + '월');
    cursor.setMonth(cursor.getMonth()+1);
  }

  container.innerHTML = `
    <div style="padding:14px 20px; background:var(--color-neutral-100); border-bottom:1px solid rgba(0,0,0,0.06); position:relative;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="font-size:11px; font-weight:600; color:var(--color-neutral-500);">${rangeStart.substring(0,4)} Q1–Q2</span>
      </div>
      <div style="position:relative;">
        <div style="display:flex; margin-bottom:4px; padding-left:70px;">
          ${months.map(m => `<div style="flex:1; font-size:9px; color:var(--color-neutral-400);">${m}</div>`).join('')}
        </div>
        <div style="display:flex; flex-direction:column; gap:3px; position:relative;">
          ${mediaWithSchedules.map(m => `
            <div style="display:flex; height:8px; align-items:center;">
              <div style="width:70px; font-size:9px; color:var(--color-neutral-500); text-align:right; padding-right:8px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${m.name.replace(/ .*/, '')}</div>
              <div style="flex:1; position:relative; background:var(--color-neutral-200); border-radius:2px; height:8px;">
                ${m.schedules.map(s => {
                  const left = dateToPercent(s.start, rangeStart, rangeEnd);
                  const width = dateToPercent(s.end, rangeStart, rangeEnd) - left;
                  const color = s.status === 'active' ? 'var(--color-primary-500)' :
                                s.status === 'reserved' ? 'var(--color-primary-300)' :
                                s.status === 'paused' ? 'var(--color-warning-500)' : 'var(--color-neutral-300)';
                  return `<div style="position:absolute; left:${left}%; width:${width}%; height:100%; background:${color}; border-radius:2px; ${s.status === 'paused' ? 'opacity:0.5;' : ''}"></div>`;
                }).join('')}
              </div>
            </div>
          `).join('')}
          <div style="position:absolute; left:calc(70px + (100% - 70px) * ${todayPct/100}); top:-14px; bottom:-2px; z-index:5; pointer-events:none;">
            <div style="font-size:8px; font-weight:700; color:var(--color-error-500); background:white; padding:0 3px; border-radius:2px;">오늘</div>
            <div style="width:1.5px; height:calc(100% - 10px); background:var(--color-error-500);"></div>
          </div>
        </div>
        <div style="position:absolute; left:calc(70px + (100% - 70px) * ${focusStartPct/100}); width:calc((100% - 70px) * ${(focusEndPct - focusStartPct)/100}); top:20px; bottom:-2px; border:2px solid var(--color-primary-500); border-radius:4px; background:rgba(3,199,90,0.06); pointer-events:none; cursor:pointer;" class="minimap-focus"></div>
      </div>
    </div>
  `;

  // Click to jump
  const barArea = container.querySelector('[style*="flex-direction:column"]');
  if (barArea && onFocusChange) {
    barArea.parentElement.style.cursor = 'pointer';
    barArea.parentElement.addEventListener('click', (e) => {
      const rect = barArea.getBoundingClientRect();
      const x = e.clientX - rect.left - 70;
      const totalWidth = rect.width - 70;
      if (x < 0 || totalWidth <= 0) return;
      const pct = x / totalWidth;
      const totalDays = daysBetween(rangeStart, rangeEnd);
      const clickDay = Math.floor(pct * totalDays);
      const clickDate = new Date(parseDate(rangeStart).getTime() + clickDay * 86400000);
      const monthStart = new Date(clickDate.getFullYear(), clickDate.getMonth(), 1);
      const monthEnd = new Date(clickDate.getFullYear(), clickDate.getMonth() + 1, 0);
      const fmt = d => d.toISOString().split('T')[0];
      onFocusChange({ start: fmt(monthStart), end: fmt(monthEnd) });
    });
  }
}

/**
 * renderFocusView — 확대 월간 타임라인
 */
function renderFocusView(container, { schedules, media, range, todayDate }) {
  const rangeStart = range.start;
  const rangeEnd = range.end;
  const todayPct = dateToPercent(todayDate, rangeStart, rangeEnd);
  const startDate = parseDate(rangeStart);
  const monthLabel = `${startDate.getFullYear()}년 ${startDate.getMonth()+1}월`;
  const endDay = parseDate(rangeEnd).getDate();

  const mediaWithSchedules = media.map(m => ({
    ...m,
    schedules: schedules.filter(s => s.mediaId === m.id && s.start <= rangeEnd && s.end >= rangeStart)
  }));

  container.innerHTML = `
    <div style="padding:20px;">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:14px;">
        <button class="focus-prev" style="border:none; background:none; font-size:16px; color:var(--color-neutral-500); cursor:pointer;">◀</button>
        <span style="font-size:14px; font-weight:700; color:var(--color-neutral-900);">${monthLabel}</span>
        <button class="focus-next" style="border:none; background:none; font-size:16px; color:var(--color-neutral-500); cursor:pointer;">▶</button>
      </div>
      <div style="display:flex; margin-bottom:6px; padding-left:110px;">
        <div style="flex:1; font-size:10px; color:var(--color-neutral-500); text-align:center;">W1 (1~7)</div>
        <div style="flex:1; font-size:10px; color:var(--color-neutral-500); text-align:center;">W2 (8~14)</div>
        <div style="flex:1; font-size:10px; color:var(--color-neutral-500); text-align:center;">W3 (15~21)</div>
        <div style="flex:1; font-size:10px; color:var(--color-neutral-500); text-align:center;">W4 (22~${endDay})</div>
      </div>
      <div style="position:relative;">
        ${todayPct > 0 && todayPct < 100 ? `
          <div class="today-marker" style="left:calc(110px + (100% - 110px - 20px) * ${todayPct/100}); top:-16px; bottom:0;">
            <div style="position:relative;">
              <div class="label" style="position:absolute; top:0; left:-14px;">${todayDate.split('-')[1]}/${todayDate.split('-')[2]}</div>
              <div class="dot" style="position:absolute; top:16px; left:-3px;"></div>
              <div class="line" style="position:absolute; top:20px; left:0; height:${mediaWithSchedules.length * 52 + 20}px;"></div>
            </div>
          </div>
        ` : ''}
        ${mediaWithSchedules.map(m => `
          <div style="display:flex; align-items:center; margin-bottom:8px;">
            <div style="width:110px; padding-right:12px; text-align:right;">
              <div style="font-size:12px; font-weight:600; color:var(--color-neutral-900);">${m.name}</div>
              <div style="font-size:10px; color:var(--color-neutral-400);">${m.spec}</div>
            </div>
            <div style="flex:1; height:44px; position:relative; background:var(--color-neutral-50); border-radius:var(--radius-lg); border:1px solid rgba(0,0,0,0.06);">
              <div style="position:absolute; inset:0; display:flex; pointer-events:none;">
                <div style="flex:1; border-right:1px solid rgba(0,0,0,0.04);"></div>
                <div style="flex:1; border-right:1px solid rgba(0,0,0,0.04);"></div>
                <div style="flex:1; border-right:1px solid rgba(0,0,0,0.04);"></div>
                <div style="flex:1;"></div>
              </div>
              ${m.schedules.length === 0 ? `
                <div style="position:absolute; inset:0; display:flex; align-items:center; justify-content:center;">
                  <span style="font-size:11px; color:var(--color-neutral-400); border:1px dashed var(--color-neutral-200); padding:4px 12px; border-radius:4px;">편성 없음</span>
                </div>
              ` : m.schedules.map(s => {
                const left = Math.max(0, dateToPercent(s.start, rangeStart, rangeEnd));
                const right = Math.min(100, dateToPercent(s.end, rangeStart, rangeEnd));
                const width = right - left;
                const cls = getStatusClass(s.status);
                const syncDot = s.syncStatus === 'fail' ? '<span class="sync-dot fail"></span>' :
                                s.syncStatus === 'ok' ? '<span class="sync-dot ok"></span>' : '';
                const pLabel = s.priority ? `<span style="margin-left:4px; background:rgba(255,255,255,0.25); padding:1px 5px; border-radius:3px; font-size:10px;">P${s.priority}</span>` : '';
                return `<div class="timeline-bar ${cls}" role="img" aria-label="${s.name}, ${s.start}~${s.end}, ${s.status}" style="left:${left}%; width:${width}%; top:4px; bottom:4px;">
                  <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${s.name}</span>
                  ${pLabel}
                  ${syncDot}
                </div>`;
              }).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      <div style="margin-top:16px; padding-top:12px; border-top:1px solid rgba(0,0,0,0.06); display:flex; gap:16px; align-items:center; flex-wrap:wrap;">
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:20px; height:12px; background:var(--color-primary-500); border-radius:3px;"></div><span style="font-size:10px; color:var(--color-neutral-500);">적용중</span></div>
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:20px; height:12px; background:rgba(3,199,90,0.08); border:1.5px solid var(--color-primary-500); border-radius:3px;"></div><span style="font-size:10px; color:var(--color-neutral-500);">예약됨</span></div>
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:20px; height:12px; background:white; border:1.5px dashed var(--color-warning-500); border-radius:3px;"></div><span style="font-size:10px; color:var(--color-neutral-500);">일시정지</span></div>
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:20px; height:12px; background:var(--color-neutral-300); border-radius:3px;"></div><span style="font-size:10px; color:var(--color-neutral-500);">종료</span></div>
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:2px; height:12px; background:var(--color-error-500); border-radius:1px;"></div><span style="font-size:10px; color:var(--color-neutral-500);">오늘</span></div>
        <div style="display:flex; align-items:center; gap:4px;"><div style="width:6px; height:6px; border-radius:50%; background:var(--color-error-500); border:1px solid #ddd;"></div><span style="font-size:10px; color:var(--color-neutral-500);">동기화 미완료</span></div>
      </div>
    </div>
  `;
}

/**
 * renderProgressBar — 단일 편성 진행바
 */
function renderProgressBar(container, { startDate, endDate, todayDate }) {
  const totalDays = daysBetween(startDate, endDate);
  const elapsedDays = daysBetween(startDate, todayDate);
  const pct = Math.max(0, Math.min(100, (elapsedDays / totalDays) * 100));
  const remaining = totalDays - elapsedDays;

  container.innerHTML = `
    <div style="padding:12px 16px; background:var(--color-neutral-50); border-radius:var(--radius-lg); border:1px solid rgba(0,0,0,0.06);">
      <div style="display:flex; align-items:center; gap:8px; margin-bottom:8px;">
        <span style="font-size:10px; font-weight:600; color:var(--color-neutral-500);">편성 기간</span>
      </div>
      <div style="position:relative; height:24px; background:var(--color-neutral-200); border-radius:12px;">
        <div style="position:absolute; left:0; width:${pct}%; height:100%; background:linear-gradient(90deg, var(--color-primary-500), var(--color-primary-400)); border-radius:12px;"></div>
        <div style="position:absolute; left:${pct}%; top:-4px; width:2px; height:32px; background:var(--color-error-500); border-radius:1px;"></div>
        <div style="position:absolute; left:calc(${pct}% - 8px); top:-16px; font-size:9px; font-weight:700; color:var(--color-error-500);">${todayDate.split('-')[1]}/${todayDate.split('-')[2]}</div>
        <div style="position:absolute; left:8px; top:0; bottom:0; display:flex; align-items:center;">
          <span style="font-size:10px; color:white; font-weight:600;">${startDate.substring(5)}</span>
        </div>
        <div style="position:absolute; right:8px; top:0; bottom:0; display:flex; align-items:center;">
          <span style="font-size:10px; color:var(--color-neutral-500); font-weight:500;">${endDate.substring(5)}</span>
        </div>
      </div>
      <div style="display:flex; justify-content:space-between; margin-top:4px;">
        <span style="font-size:10px; color:var(--color-neutral-500);">경과 ${elapsedDays}일 (${Math.round(pct)}%)</span>
        <span style="font-size:10px; color:var(--color-neutral-500);">잔여 ${remaining}일</span>
      </div>
    </div>
  `;
}

/**
 * renderConflictTimeline — 두 편성 비교
 */
function renderConflictTimeline(container, { currentSchedule, conflictSchedule, media, rangeStart, rangeEnd, selectedOption }) {
  const todayPct = dateToPercent(TODAY, rangeStart, rangeEnd);
  const mediaName = getMediaById(currentSchedule.mediaId)?.name || '';

  function barHTML(s, option) {
    let start = s.start, end = s.end;
    if (option === 'B' && s.id === conflictSchedule.id) {
      start = currentSchedule.end > s.start ? currentSchedule.end : s.start;
    }
    if (option === 'C' && s.id === conflictSchedule.id) return '';
    const left = dateToPercent(start, rangeStart, rangeEnd);
    const right = dateToPercent(end, rangeStart, rangeEnd);
    const width = right - left;
    const cls = s.id === currentSchedule.id ? 'active' : 'reserved';
    return `<div class="timeline-bar ${cls}" style="left:${left}%; width:${width}%; top:6px; bottom:6px;">
      <span style="overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">${s.name}</span>
      <span style="margin-left:4px; font-size:10px; opacity:0.7;">P${s.priority}</span>
    </div>`;
  }

  // Overlap zone
  const overlapStart = Math.max(dateToPercent(currentSchedule.start, rangeStart, rangeEnd), dateToPercent(conflictSchedule.start, rangeStart, rangeEnd));
  const overlapEnd = Math.min(dateToPercent(currentSchedule.end, rangeStart, rangeEnd), dateToPercent(conflictSchedule.end, rangeStart, rangeEnd));
  const hasOverlap = selectedOption !== 'B' && selectedOption !== 'C' && overlapEnd > overlapStart;

  container.innerHTML = `
    <div style="padding:16px;">
      <div style="display:flex; align-items:center; margin-bottom:8px;">
        <div style="width:100px; font-size:12px; font-weight:600; color:var(--color-neutral-900); text-align:right; padding-right:12px;">${mediaName}</div>
        <div style="flex:1; height:48px; position:relative; background:var(--color-neutral-50); border-radius:var(--radius-lg); border:1px solid rgba(0,0,0,0.06);">
          ${hasOverlap ? `<div style="position:absolute; left:${overlapStart}%; width:${overlapEnd - overlapStart}%; top:0; bottom:0; background:var(--color-warning-50); border:1px dashed var(--color-warning-500); border-radius:4px; z-index:0;"></div>` : ''}
          ${barHTML(currentSchedule, selectedOption)}
          ${barHTML(conflictSchedule, selectedOption)}
        </div>
      </div>
    </div>
  `;
}
