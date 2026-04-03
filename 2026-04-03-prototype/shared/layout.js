// DOOH CMS Prototype - Layout Injection & Role Switcher

const ROLES = {
  admin: { label: '어드민', badge: 'role-badge-admin' },
  media: { label: '매체사', badge: 'role-badge-media' },
  ops: { label: '운영대행사', badge: 'role-badge-ops' },
  sales: { label: '영업대행사', badge: 'role-badge-sales' }
};

const MENU_ITEMS = [
  { id: 'dashboard', label: '대시보드', icon: '📊', href: '/index.html', roles: ['admin','media','ops'] },
  { id: 'media-companies', label: '매체사 관리', icon: '🏢', href: '/media/companies.html', roles: ['admin'] },
  { id: 'media', label: '매체 관리', icon: '🖥️', href: '/media/list.html', roles: ['admin','media','ops'] },
  { id: 'materials', label: '소재 관리', icon: '🎬', href: '/materials/list.html', roles: ['admin','media','ops','sales'] },
  { id: 'campaigns', label: '캠페인 관리', icon: '📢', href: '/campaigns/list.html', roles: ['admin','media','ops'] },
  { id: 'schedules', label: '편성 관리', icon: '📅', href: '/schedules/list.html', roles: ['admin','media','ops'] },
  { id: 'notifications', label: '알림 센터', icon: '🔔', href: '/notifications/center.html', roles: ['admin','media','ops','sales'] },
  { id: 'users', label: '사용자 관리', icon: '👤', href: '/users/list.html', roles: ['admin','media'] },
  { id: 'reports', label: '리포트', icon: '📈', href: '/reports/list.html', roles: ['admin','media','ops'] },
  { id: 'notif-settings', label: '알림 설정', icon: '⚙️', href: '/notifications/settings.html', roles: ['admin','media','ops','sales'] },
];

function getRole() {
  return localStorage.getItem('dooh-role') || 'admin';
}

function setRole(role) {
  if (role === getRole()) return;       // guard against browser form auto-restore
  localStorage.setItem('dooh-role', role);
  location.reload();
}

function getBasePath() {
  const path = location.pathname;
  const protoIdx = path.indexOf('prototype');
  if (protoIdx < 0) return '.';
  const afterProto = path.substring(protoIdx + 'prototype'.length);
  const segments = afterProto.split('/').filter(Boolean);
  // segments includes filename, so depth = segments.length - 1
  const depth = segments.length - 1;
  if (depth <= 0) return '.';
  return Array(depth).fill('..').join('/');
}

function resolveHref(href) {
  const base = getBasePath();
  return base + href;
}

function getCurrentPage() {
  const path = location.pathname;
  const protoIdx = path.indexOf('prototype');
  if (protoIdx >= 0) {
    return path.substring(protoIdx + 'prototype'.length);
  }
  return path;
}

function injectLayout() {
  const role = getRole();
  const currentPage = getCurrentPage();

  // Header
  const header = document.getElementById('app-header');
  if (header) {
    header.innerHTML = `
      <div class="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div class="flex items-center gap-3">
          <a href="${resolveHref('/index.html')}" class="text-lg font-bold text-gray-900">DOOH CMS</a>
          <span class="text-xs text-gray-400">Digital Out-of-Home</span>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative">
            <select id="role-switcher" autocomplete="off"
              class="text-sm font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${ROLES[role].badge}">
              ${Object.entries(ROLES).map(([k,v]) =>
                `<option value="${k}" ${k===role?'selected':''}>${v.label}</option>`
              ).join('')}
            </select>
          </div>
          <a href="${resolveHref('/notifications/center.html')}" class="relative p-2 text-gray-500 hover:text-gray-700">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"/>
            </svg>
            <span class="notif-dot"></span>
          </a>
          <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-semibold text-blue-700">관</div>
        </div>
      </div>`;
  }

  // Sidebar
  const sidebar = document.getElementById('app-sidebar');
  if (sidebar) {
    const visibleItems = MENU_ITEMS.filter(item => item.roles.includes(role));
    sidebar.innerHTML = `
      <nav class="w-56 bg-white border-r border-gray-200 min-h-screen pt-4 px-3">
        <div class="mb-4 px-3">
          <p class="text-xs text-gray-400 uppercase tracking-wider">메뉴</p>
        </div>
        ${visibleItems.map(item => {
          const href = resolveHref(item.href);
          const isActive = currentPage === item.href || (item.href !== '/index.html' && currentPage.startsWith(item.href.replace('/list.html','').replace('/center.html','')));
          return `<a href="${href}" class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm ${isActive ? 'active font-medium' : 'text-gray-600'}">
            <span>${item.icon}</span>
            <span>${item.label}</span>
          </a>`;
        }).join('')}
      </nav>`;
  }
}

// Modal helpers
function showModal(id) {
  document.getElementById(id).classList.remove('hidden');
}
function hideModal(id) {
  document.getElementById(id).classList.add('hidden');
}

// Tab helpers
function switchTab(groupId, tabName) {
  const group = document.getElementById(groupId);
  if (!group) return;
  group.querySelectorAll('[data-tab]').forEach(el => {
    el.classList.toggle('active', el.dataset.tab === tabName);
  });
  document.querySelectorAll(`[data-tab-content]`).forEach(el => {
    el.classList.toggle('hidden', el.dataset.tabContent !== tabName);
  });
}

// Role-based visibility
function applyRoleVisibility() {
  const role = getRole();
  document.querySelectorAll('[data-roles]').forEach(el => {
    const allowed = el.dataset.roles.split(',');
    el.classList.toggle('hidden', !allowed.includes(role));
  });
}

// Init
document.addEventListener('DOMContentLoaded', () => {
  injectLayout();
  applyRoleVisibility();
  // Bind role-switcher after a tick to avoid browser form auto-restore triggering onchange
  requestAnimationFrame(() => {
    const switcher = document.getElementById('role-switcher');
    if (switcher) {
      switcher.value = getRole();  // force correct value after any auto-restore
      switcher.addEventListener('change', () => setRole(switcher.value));
    }
  });
});
