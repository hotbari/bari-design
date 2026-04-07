// DOOH CMS Prototype - Layout Injection & Role Switcher (Redesigned)

const ROLES = {
  admin: { label: '어드민', badge: 'role-badge-admin' },
  media: { label: '매체사', badge: 'role-badge-media' },
  ops: { label: '운영대행사', badge: 'role-badge-ops' },
  sales: { label: '영업대행사', badge: 'role-badge-sales' }
};

const MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: 'dashboard', href: '/index.html', roles: ['admin','media','ops'] },
  { id: 'media-companies', label: '매체사 관리', icon: 'building', href: '/media/companies.html', roles: ['admin'] },
  { id: 'media', label: '매체 관리', icon: 'monitor', href: '/media/list.html', roles: ['admin','media','ops'] },
  { id: 'materials', label: '소재 관리', icon: 'film', href: '/materials/list.html', roles: ['admin','media','ops','sales'] },
  { id: 'campaigns', label: '캠페인 관리', icon: 'play', href: '/campaigns/list.html', roles: ['admin','media','ops'] },
  { id: 'schedules', label: '편성 관리', icon: 'calendar', href: '/schedules/list.html', roles: ['admin','media','ops'] },
  { id: 'notifications', label: '알림 센터', icon: 'bell', href: '/notifications/center.html', roles: ['admin','media','ops','sales'] },
  { id: 'users', label: '사용자 관리', icon: 'users', href: '/users/list.html', roles: ['admin','media'] },
  { id: 'reports', label: '리포트', icon: 'barChart', href: '/reports/list.html', roles: ['admin','media','ops'] },
  { id: 'notif-settings', label: '알림 설정', icon: 'settings', href: '/notifications/settings.html', roles: ['admin','media','ops','sales'] },
];

function getRole() { return localStorage.getItem('dooh-role') || 'admin'; }
function setRole(role) {
  if (role === getRole()) return;
  localStorage.setItem('dooh-role', role);
  location.reload();
}

function getBasePath() {
  const path = location.pathname;
  const protoIdx = path.indexOf('prototype');
  if (protoIdx < 0) return '.';
  const afterProto = path.substring(protoIdx + 'prototype'.length);
  const segments = afterProto.split('/').filter(Boolean);
  const depth = segments.length - 1;
  if (depth <= 0) return '.';
  return Array(depth).fill('..').join('/');
}

function resolveHref(href) { return getBasePath() + href; }

function getCurrentPage() {
  const path = location.pathname;
  const protoIdx = path.indexOf('prototype');
  if (protoIdx >= 0) return path.substring(protoIdx + 'prototype'.length);
  return path;
}

function injectLayout() {
  const role = getRole();
  const currentPage = getCurrentPage();

  const header = document.getElementById('app-header');
  if (header) {
    header.innerHTML = `
      <div style="display:flex; align-items:center; justify-content:space-between; padding:0 24px; height:56px; background:white; border-bottom:1px solid rgba(0,0,0,0.06);">
        <div style="display:flex; align-items:center; gap:10px;">
          <a href="${resolveHref('/index.html')}" style="font-size:16px; font-weight:700; color:var(--color-neutral-900); text-decoration:none;">DOOH CMS</a>
          <span style="font-size:11px; color:var(--color-neutral-400);">Digital Out-of-Home</span>
        </div>
        <div style="display:flex; align-items:center; gap:16px;">
          <select id="role-switcher" autocomplete="off"
            class="${ROLES[role].badge}"
            style="font-size:12px; font-weight:500; padding:4px 10px; border-radius:20px; border:none; cursor:pointer;">
            ${Object.entries(ROLES).map(([k,v]) =>
              `<option value="${k}" ${k===role?'selected':''}>${v.label}</option>`
            ).join('')}
          </select>
          <a href="${resolveHref('/notifications/center.html')}" style="position:relative; color:var(--color-neutral-500);">
            ${ICONS.bell.replace('width="16"','width="20"').replace('height="16"','height="20"')}
            <span class="notif-dot"></span>
          </a>
          <div style="width:32px; height:32px; background:var(--color-neutral-900); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:600; color:white;">관</div>
        </div>
      </div>`;
  }

  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    const visibleItems = MENU_ITEMS.filter(item => item.roles.includes(role));
    sidebar.innerHTML = `
      <nav style="width:200px; background:var(--color-primary-900); border-right:none; min-height:100vh; padding:12px 8px;">
        <div style="padding:0 10px 8px; font-size:10px; color:rgba(255,255,255,0.4); text-transform:uppercase; letter-spacing:0.05em;">메뉴</div>
        ${visibleItems.map(item => {
          const href = resolveHref(item.href);
          const isActive = currentPage === item.href || (item.href !== '/index.html' && currentPage.startsWith(item.href.replace('/list.html','').replace('/center.html','')));
          const iconSvg = ICONS[item.icon] || '';
          const iconColored = isActive
            ? iconSvg.replace(/stroke="[^"]*"/g, 'stroke="#03C75A"')
            : iconSvg.replace(/stroke="[^"]*"/g, 'stroke="rgba(255,255,255,0.5)"');
          return `<a href="${href}" class="${isActive ? 'active' : ''}"
            style="display:flex; align-items:center; gap:8px; padding:6px 10px; border-radius:6px; font-size:12px; text-decoration:none; color:${isActive ? '#03C75A' : 'rgba(255,255,255,0.7)'}; margin-bottom:1px;">
            <span style="display:flex;">${iconColored}</span>
            <span>${item.label}</span>
          </a>`;
        }).join('')}
      </nav>`;
  }
}

function showModal(id) { document.getElementById(id).classList.remove('hidden'); }
function hideModal(id) { document.getElementById(id).classList.add('hidden'); }

function switchTab(groupId, tabName) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  document.querySelectorAll('[data-tab-content]').forEach(el => {
    el.classList.toggle('hidden', el.dataset.tabContent !== tabName);
  });
}

function applyRoleVisibility() {
  const role = getRole();
  document.querySelectorAll('[data-roles]').forEach(el => {
    const allowed = el.dataset.roles.split(',');
    el.classList.toggle('hidden', !allowed.includes(role));
  });
}

document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  applyRoleVisibility();
  requestAnimationFrame(() => {
    const switcher = document.getElementById('role-switcher');
    if (switcher) {
      switcher.value = getRole();
      switcher.addEventListener('change', () => setRole(switcher.value));
    }
  });
});
