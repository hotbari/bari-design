'use client'
import { useRouter } from 'next/navigation'
import type { Playlist } from '@/types/playlist'
import styles from './PlaylistTable.module.css'

function formatDuration(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}분 ${s}초`
}
function formatDate(iso: string) { return iso.slice(0, 10) }

export function PlaylistTable({ items }: { items: Playlist[] }) {
  const router = useRouter()
  return (
    <div className={styles.wrap}>
      <div className={styles.toolbar}><span className={styles.count}>총 <strong>{items.length}개</strong></span></div>
      <table className={styles.table}>
        <thead>
          <tr><th>재생목록명</th><th>매체</th><th>소재 수</th><th>총 재생시간</th><th>수정일</th><th>액션</th></tr>
        </thead>
        <tbody>
          {items.length === 0 ? (
            <tr><td colSpan={6} className={styles.empty}>재생목록이 없습니다.</td></tr>
          ) : items.map(p => (
            <tr key={p.id} className={styles.row}>
              <td className={styles.name}>{p.name}</td>
              <td className={styles.meta}>{p.mediaName}</td>
              <td className={styles.meta}>{p.itemCount}개</td>
              <td className={styles.meta}>{formatDuration(p.totalDuration)}</td>
              <td className={styles.meta}>{formatDate(p.updatedAt)}</td>
              <td>
                <button className={styles.editBtn} onClick={() => router.push(`/playlists/${p.id}/edit`)}>편집</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
