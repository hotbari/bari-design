'use client'

import { Badge } from '@/components/ui/Badge'
import type { User, UserRole, UserStatus } from '@/types/user'
import styles from './UserTable.module.css'

const ROLE_LABELS: Record<UserRole, string> = {
  admin: '관리자',
  media: '매체사',
  ops: '운영 대행사',
  sales: '영업 대행사',
}

const STATUS_LABELS: Record<UserStatus, string> = {
  active: '활성',
  inactive: '비활성',
  invited: '초대됨',
  expired: '만료',
}

const ROLE_SCOPE: Record<UserRole, string> = {
  admin: '전체 접근',
  media: '소속 매체사',
  ops: '배정 매체',
  sales: '배정 소재',
}

function formatDate(iso: string) {
  return iso.slice(0, 10)
}

interface UserTableProps {
  items: User[]
}

export function UserTable({ items }: UserTableProps) {
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          총 <strong>{items.length}명</strong>
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>사용자</th>
            <th>역할</th>
            <th>상태</th>
            <th>접근 범위</th>
            <th>액션</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={5} className={styles.empty}>사용자가 없습니다.</td>
            </tr>
          ) : items.map(u => (
            <tr key={u.id} className={styles.row}>
              <td>
                <div className={styles.userCell}>
                  <span className={`${styles.avatar} ${styles[`avatar-${u.status === 'invited' ? 'invite' : u.role}`]}`}>
                    {u.name.slice(0, 1)}
                  </span>
                  <div>
                    <div className={styles.userName}>{u.name}</div>
                    <div className={styles.userEmail}>{u.email}</div>
                  </div>
                </div>
              </td>
              <td><Badge variant={u.role} label={ROLE_LABELS[u.role]} /></td>
              <td><Badge variant={u.status} label={STATUS_LABELS[u.status]} /></td>
              <td className={styles.scope}>{ROLE_SCOPE[u.role]}</td>
              <td>
                <div className={styles.actions}>
                  <button className={styles.actionBtn}>편집</button>
                  {u.status === 'active' && (
                    <button className={`${styles.actionBtn} ${styles.danger}`}>비활성화</button>
                  )}
                  {u.status === 'invited' && (
                    <button className={styles.actionBtn}>재발송</button>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
