'use client'

import { useRouter } from 'next/navigation'
import type { Material } from '@/types/material'
import { Badge } from '@/components/ui/Badge'
import styles from './MaterialTable.module.css'

const REVIEW_LABELS: Record<string, string> = {
  reviewing: '검수 중',
  done: '완료',
  failed: '반려',
  manual: '수동 승인',
}

const OPS_LABELS: Record<string, string> = {
  active: '운영 중',
  scheduled: '예약됨',
  expired: '만료',
}

interface MaterialTableProps {
  items: Material[]
}

export function MaterialTable({ items }: MaterialTableProps) {
  const router = useRouter()

  const goToDetail = (id: string) => router.push(`/materials/${id}`)

  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}>
        <span className={styles.count}>
          총 <strong>{items.length}건</strong>
        </span>
      </div>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>썸네일</th>
            <th>소재명</th>
            <th>해상도</th>
            <th>재생시간</th>
            <th>검수 상태</th>
            <th>운영 상태</th>
            <th>등록일</th>
          </tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr>
              <td colSpan={7} className={styles.empty}>소재가 없습니다.</td>
            </tr>
          ) : items.map(m => (
            <tr
              key={m.id}
              className={m.opsStatus === 'expired' ? styles.expired : ''}
              onClick={() => goToDetail(m.id)}
              onKeyDown={e => e.key === 'Enter' && goToDetail(m.id)}
              tabIndex={0}
              role="row"
            >
              <td>
                <div className={styles.thumbnail}>
                  <span className={styles.thumbIcon}>{m.fileType === 'video' ? '▶' : '🖼'}</span>
                </div>
              </td>
              <td>
                <div className={styles.materialName}>{m.name}</div>
                {m.campaignName && (
                  <div className={styles.campaignName}>{m.campaignName}</div>
                )}
              </td>
              <td className={styles.meta}>{m.resolution}</td>
              <td className={styles.meta}>
                {m.duration != null ? `${m.duration}초` : '-'}
              </td>
              <td>
                <Badge variant={m.reviewStatus} label={REVIEW_LABELS[m.reviewStatus] ?? m.reviewStatus} />
              </td>
              <td>
                <Badge variant={m.opsStatus} label={OPS_LABELS[m.opsStatus] ?? m.opsStatus} />
              </td>
              <td className={styles.meta}>
                {new Date(m.uploadedAt).toLocaleDateString('ko-KR')}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
