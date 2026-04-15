'use client'

import { useRouter } from 'next/navigation'
import type { Media } from '@/types/media'
import { StatusDot } from '@/components/ui/StatusDot'
import { SyncBadge } from '@/components/ui/SyncBadge'
import { TypeChip } from '@/components/ui/TypeChip'
import styles from './MediaTable.module.css'

interface MediaTableProps {
  items: Media[]
  total: number
  page: number
  pageSize: number
  onPageChange: (page: number) => void
}

export function MediaTable({ items, total, page, pageSize, onPageChange }: MediaTableProps) {
  const router = useRouter()
  const totalPages = Math.ceil(total / pageSize)

  const goToDetail = (id: string) => router.push(`/media/${id}`)

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          총 <strong>{total}개</strong> 매체
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>매체명</th>
            <th>매체사</th>
            <th>유형</th>
            <th>해상도</th>
            <th>상태</th>
            <th>동기화</th>
            <th>운영 시간</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={8} className={styles.empty}>매체가 없습니다.</td>
            </tr>
          ) : items.map(m => (
            <tr
              key={m.id}
              onClick={() => goToDetail(m.id)}
              onKeyDown={e => e.key === 'Enter' && goToDetail(m.id)}
              tabIndex={0}
              role="row"
            >
              <td>
                <div className={styles.mediaName}>{m.name}</div>
                <div className={styles.mediaAddr}>{m.location}</div>
              </td>
              <td className={styles.companyName}>{m.companyName}</td>
              <td><TypeChip type={m.type} /></td>
              <td className={styles.resolution}>{m.resolution}</td>
              <td className={styles.statusCell}>
                <StatusDot status={m.status} showLabel />
              </td>
              <td>
                <SyncBadge status={m.status === 'inactive' ? null : m.syncStatus} />
              </td>
              <td className={styles.operHours}>{m.operatingHours}</td>
              <td className={styles.regDate}>{m.registeredAt}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {totalPages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange(page - 1)}
            disabled={page <= 1}
            aria-label="이전 페이지"
          >‹</button>
          {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
            <button
              key={p}
              className={`${styles.pageBtn} ${p === page ? styles.activePage : ''}`}
              onClick={() => onPageChange(p)}
            >{p}</button>
          ))}
          <button
            className={styles.pageBtn}
            onClick={() => onPageChange(page + 1)}
            disabled={page >= totalPages}
            aria-label="다음 페이지"
          >›</button>
        </div>
      )}
    </div>
  )
}
