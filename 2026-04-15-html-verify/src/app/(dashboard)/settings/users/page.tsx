'use client'
import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import Link from 'next/link'
import { User, UserRole, UserStatus } from '@/types/user'
import styles from './page.module.css'

type Tab = 'all' | 'active' | 'invited'

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('Failed to fetch users')
  return res.json()
}

async function patchUser(id: string, body: Partial<User>): Promise<User> {
  const res = await fetch(`/api/users/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to update user')
  return res.json()
}

const ROLE_LABEL: Record<UserRole, string> = {
  admin: '어드민',
  media: '매체사',
  ops: '운영대행사',
  sales: '영업대행사',
}

const STATUS_LABEL: Record<UserStatus, string> = {
  active: '활성',
  inactive: '비활성',
  invited: '초대 대기',
  expired: '만료',
}

function AvatarCircle({ user }: { user: User }) {
  const cls =
    user.status === 'invited' || user.status === 'expired'
      ? styles.avatarInvite
      : user.role === 'admin' ? styles.avatarAdmin
      : user.role === 'media' ? styles.avatarMedia
      : user.role === 'ops'   ? styles.avatarOps
      : styles.avatarSales
  const initial = user.status === 'invited' || user.status === 'expired' ? '?' : user.name.charAt(0)
  return <div className={`${styles.avatar} ${cls}`}>{initial}</div>
}

function RoleBadge({ role }: { role: UserRole }) {
  const cls =
    role === 'admin' ? styles.roleAdmin
    : role === 'media' ? styles.roleMedia
    : role === 'ops'   ? styles.roleOps
    : styles.roleSales
  return <span className={`${styles.roleBadge} ${cls}`}>{ROLE_LABEL[role]}</span>
}

function StatusBadge({ status }: { status: UserStatus }) {
  const cls =
    status === 'active'   ? styles.statusActive
    : status === 'inactive' ? styles.statusInactive
    : status === 'invited'  ? styles.statusInvited
    : styles.statusExpired
  return (
    <span className={`${styles.statusBadge} ${cls}`}>
      <span className={styles.statusDot} />
      {STATUS_LABEL[status]}
    </span>
  )
}

export default function UsersPage() {
  const queryClient = useQueryClient()
  const { data: users = [], isLoading } = useQuery({ queryKey: ['users'], queryFn: fetchUsers })

  const [tab, setTab] = useState<Tab>('all')
  const [roleFilter, setRoleFilter] = useState('')
  const [search, setSearch] = useState('')
  const [deactivateTarget, setDeactivateTarget] = useState<User | null>(null)

  const mutation = useMutation({
    mutationFn: ({ id, body }: { id: string; body: Partial<User> }) => patchUser(id, body),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  const filtered = useMemo(() => {
    return users.filter(u => {
      if (tab === 'active' && u.status !== 'active') return false
      if (tab === 'invited' && u.status !== 'invited' && u.status !== 'expired') return false
      if (roleFilter && u.role !== roleFilter) return false
      if (search) {
        const q = search.toLowerCase()
        if (!u.name.toLowerCase().includes(q) && !u.email.toLowerCase().includes(q)) return false
      }
      return true
    })
  }, [users, tab, roleFilter, search])

  const counts = useMemo(() => ({
    all: users.length,
    active: users.filter(u => u.status === 'active').length,
    invited: users.filter(u => u.status === 'invited' || u.status === 'expired').length,
  }), [users])

  function handleDeactivate() {
    if (!deactivateTarget) return
    mutation.mutate({ id: deactivateTarget.id, body: { status: 'inactive' } })
    setDeactivateTarget(null)
  }

  const TAB_ITEMS: { key: Tab; label: string }[] = [
    { key: 'all', label: '전체' },
    { key: 'active', label: '활성' },
    { key: 'invited', label: '초대 대기' },
  ]

  return (
    <>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <span className={styles.breadcrumbCurrent}>사용자 관리</span>
        </nav>
      </header>

      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>사용자 관리</h1>
            <p className={styles.pageSubtitle}>CMS 사용자 계정 조회, 권한 변경, 비활성화를 관리합니다</p>
          </div>
          <Link href="/settings/users/invite" className="btn btn-primary">
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
              <path d="M8 3v10M3 8h10"/>
            </svg>
            사용자 초대
          </Link>
        </div>

        {/* Tabs */}
        <div className={styles.tabBar} role="tablist">
          {TAB_ITEMS.map(({ key, label }) => (
            <button
              key={key}
              role="tab"
              aria-selected={tab === key}
              className={`${styles.tabBtn} ${tab === key ? styles.tabBtnActive : ''}`}
              onClick={() => setTab(key)}
            >
              {label}
              <span className={`${styles.tabCount} ${tab === key ? styles.tabCountActive : ''}`}>
                {counts[key]}
              </span>
            </button>
          ))}
        </div>

        {/* Filter bar (shown for all/active tabs) */}
        {tab !== 'invited' && (
          <div className={styles.filterBar}>
            <select
              className={styles.filterSelect}
              value={roleFilter}
              onChange={e => setRoleFilter(e.target.value)}
              aria-label="역할 필터"
            >
              <option value="">전체 역할</option>
              <option value="admin">어드민</option>
              <option value="media">매체사</option>
              <option value="ops">운영대행사</option>
              <option value="sales">영업대행사</option>
            </select>
            <div className={styles.searchWrap}>
              <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden="true">
                <circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/>
              </svg>
              <input
                type="search"
                className={styles.searchInput}
                placeholder="이름 또는 이메일 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
                aria-label="사용자 검색"
              />
            </div>
            <button
              className={styles.filterReset}
              onClick={() => { setRoleFilter(''); setSearch('') }}
            >
              초기화
            </button>
          </div>
        )}

        {/* All / Active tab: table */}
        {tab !== 'invited' && (
          <div className={styles.tableWrap}>
            <div className={styles.tableToolbar}>
              <span className={styles.tableCount}>
                총 <strong>{filtered.length}</strong>명
              </span>
            </div>
            {isLoading ? (
              <div style={{ padding: '24px 16px', color: 'var(--color-neutral-500)', fontSize: 'var(--text-sm)' }}>로딩 중...</div>
            ) : (
              <table className={styles.table} aria-label="사용자 목록">
                <thead>
                  <tr>
                    <th>사용자</th>
                    <th>역할</th>
                    <th>상태</th>
                    <th>접근 범위</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(user => (
                    <tr key={user.id}>
                      <td>
                        <div className={styles.userCell}>
                          <AvatarCircle user={user} />
                          <div>
                            <div className={`${styles.userName} ${user.status === 'inactive' ? styles.userNameInactive : ''}`}>
                              {user.name}
                            </div>
                            <div className={styles.userEmail}>{user.email}</div>
                          </div>
                        </div>
                      </td>
                      <td><RoleBadge role={user.role} /></td>
                      <td><StatusBadge status={user.status} /></td>
                      <td><span className={styles.scopeText}>{user.scope}</span></td>
                      <td>
                        <div className={styles.rowActions}>
                          {user.status === 'active' && (
                            <>
                              <button className={styles.rowActionBtn}>편집</button>
                              <button
                                className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}
                                onClick={() => setDeactivateTarget(user)}
                              >
                                비활성화
                              </button>
                            </>
                          )}
                          {user.status === 'inactive' && (
                            <button
                              className={styles.rowActionBtn}
                              onClick={() => mutation.mutate({ id: user.id, body: { status: 'active' } })}
                            >
                              활성화
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}

        {/* Invited tab: invite panel */}
        {tab === 'invited' && (
          <div className={styles.invitePanel}>
            <div className={styles.invitePanelHeader}>
              <span className={styles.invitePanelTitle}>초대 현황</span>
              <Link href="/settings/users/invite" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)' }}>
                새 초대 발송
              </Link>
            </div>
            {filtered.map(user => (
              <div key={user.id} className={styles.inviteRow}>
                <AvatarCircle user={user} />
                <div style={{ flex: 1 }}>
                  <div className={styles.inviteEmail}>{user.email}</div>
                  <div className={styles.inviteMeta}>
                    {ROLE_LABEL[user.role]}
                    {user.invitedAt ? ` · ${user.invitedAt} 발송` : ''}
                  </div>
                </div>
                <StatusBadge status={user.status} />
                <button className={styles.rowActionBtn} style={{ marginLeft: 8 }}>재발송</button>
                {user.status === 'invited' && (
                  <button className={`${styles.rowActionBtn} ${styles.rowActionBtnDanger}`}>취소</button>
                )}
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Deactivate confirmation modal */}
      {deactivateTarget && (
        <div className={styles.modalBackdrop} role="dialog" aria-modal="true" aria-labelledby="modal-title">
          <div className={styles.modal}>
            <div className={styles.modalIcon}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
                <line x1="22" y1="11" x2="16" y2="11"/>
              </svg>
            </div>
            <h2 className={styles.modalTitle} id="modal-title">사용자 비활성화</h2>
            <p className={styles.modalBody}>
              {deactivateTarget.name}님을 비활성화하시겠습니까? 비활성화된 사용자는 즉시 로그아웃 처리되며 CMS에 접근할 수 없게 됩니다.
            </p>
            <div className={styles.modalActions}>
              <button className="btn btn-secondary" onClick={() => setDeactivateTarget(null)}>취소</button>
              <button className="btn btn-danger" onClick={handleDeactivate}>비활성화</button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
