# CSS 공통화 작업 계획

## 표준 기준

나머지 6개 파일(scheduling, media, dashboard, campaign, user, notification)의 컨벤션을 표준으로 삼음.
material-management.html을 이 표준에 맞춤.

## 작업 순서

1. shared.css 생성 (표준 컨벤션 기준)
2. material-management.html 정규화 (표준에 맞춤)
3. 7개 파일에서 공통 CSS 제거, `<link rel="stylesheet" href="shared.css">` 추가
4. 각 파일에 페이지 전용 CSS만 남김
5. 전체 렌더링 검증

## 정규화 필요 항목 (material-management.html → 표준)

| 항목 | material (현재) | 표준 (6개 파일) |
|------|----------------|----------------|
| body line-height | 1.6 | 1.5 |
| .gnb z-index | 100 | 500 |
| .gnb padding | space-6 | space-5 |
| .gnb justify-content | margin-right:auto | space-between |
| .gnb-brand span | color:text-primary | color:border-strong, margin:0 space-2 |
| .gnb-actions gap | space-4 | space-3 |
| .gnb-icon transition | background only | all |
| .gnb-icon:hover | bg only | bg + color |
| .gnb-avatar | interactive-muted, text-xs | primary-100, text-sm |
| .sidebar z-index | 90 | 400 |
| .sidebar padding-top | space-4 | space-3 |
| .sidebar-item color | text-secondary | text-tertiary |
| .sidebar-item.active::before | centered fixed height | top:8px bottom:8px |
| .sidebar-tooltip | display:none/block | opacity:0/1 |
| .app | flex column | min-height only |
| .layout-body | margin-top | padding-top |
| .main padding | space-8 uniform | space-6 space-8 |
| .badge padding | space-1 space-2 | 2px space-2 |
| .modal radius | radius-xl | radius-lg |
| .modal-overlay visibility | visibility | pointer-events |
| .modal-overlay z-index | 600 | 650 |
| .btn-primary | flex, space-5, text-base | inline-flex, space-4, text-sm |
| .btn-secondary border | border-default | border-strong |
| .filter focus | outline | color-mix |
| .filter-select SVG | 24x24 | 10x6 |
| .summary-card-label | text-sm | text-xs, font-weight:500 |
| .drawer z-index | 510 | 600 |
| .drawer-overlay z-index | 500 | 550 |

## shared.css에 포함될 셀렉터 (표준 기준)

### 필수 (7/7 파일 공통)
- :root 토큰 (전체 superset)
- @media prefers-reduced-motion
- Reset (*, body, button/select/input, table)
- .gnb, .gnb-brand, .gnb-brand span, .gnb-actions, .gnb-icon, .gnb-icon:hover, .gnb-avatar, .gnb-badge
- .sidebar, .sidebar-item, .sidebar-item:hover, .sidebar-item.active, .sidebar-item.active::before, .sidebar-tooltip, .sidebar-item:hover .sidebar-tooltip
- .app, .layout-body, .main, .icon
- .badge
- .toast, .toast.active

### 대다수 (5+/7 파일 공통)
- .page-header, .page-title
- .btn-primary, .btn-secondary, .btn-destructive, .btn-danger-outline
- .filter-bar, .filter-select, .filter-input
- .toolbar, .toolbar-count
- .data-table-wrap, .data-table th/td/tr, .cell-name/sub/meta
- .view, .view.active
- .form-group, .form-label, .form-control, .form-hint, .form-grid, .form-group.full-width
- .modal-overlay, .modal, .modal-title, .modal-body, .modal-actions
- .summary-widget, .summary-card
- .breadcrumb
- .tab-nav, .tab-nav-item
- .drawer-overlay, .drawer, .drawer-header/title/close/body/footer
- .meta-card, .meta-row
- .detail-field-label, .detail-field-value
- .form-card, .form-card-title
- .warn-banner
- .btn-ghost, .btn-sm
- .form-date-range
- .pagination, .page-btn, .page-ellipsis
