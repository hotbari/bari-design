'use client'
import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { useRouter } from 'next/navigation'
import { Playlist } from '@/types/playlist'
import styles from './page.module.css'

async function fetchPlaylists(): Promise<Playlist[]> {
  const res = await fetch('/api/playlists')
  if (!res.ok) throw new Error('failed')
  return res.json()
}

function formatDuration(slots: { duration: number }[] | undefined): string {
  if (!slots) return ''
  const total = (slots as any[]).reduce((s: number, sl: any) => s + sl.duration, 0)
  if (total === 0) return '-'
  const m = Math.floor(total / 60)
  const s = total % 60
  return m > 0 ? `${m}분 ${s}초` : `${s}초`
}

export default function PlaylistListPage() {
  const router = useRouter()
  const { data = [], isLoading } = useQuery({ queryKey: ['playlists'], queryFn: fetchPlaylists })
  const [search, setSearch] = useState('')
  const [deleteTarget, setDeleteTarget] = useState<Playlist | null>(null)
  const [toastMsg, setToastMsg] = useState('')

  const filtered = data.filter(p => !search || p.name.includes(search))

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  function handleDelete() {
    if (!deleteTarget) return
    setDeleteTarget(null)
    showToast(`'${deleteTarget.name}' 재생목록이 삭제되었습니다.`)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>재생목록</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>재생목록</h1>
          <div className={styles.headerRight}>
            <div className={styles.searchWrap}>
              <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
              <input
                className={styles.searchInput}
                placeholder="재생목록 검색"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <button className={styles.btnPrimary} onClick={() => router.push('/playlists/new/edit')}>
              <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
              새 목록 만들기
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className={styles.empty}>로딩 중...</div>
        ) : filtered.length === 0 ? (
          <div className={styles.emptyState}>
            <div className={styles.emptyIcon}>
              <svg width="28" height="28" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round"><rect x="1" y="3" width="14" height="12" rx="1.5"/><path d="M1 7h14M5 1v4M11 1v4"/></svg>
            </div>
            <div className={styles.emptyTitle}>재생목록이 없습니다</div>
            <div className={styles.emptyBody}>새 목록을 만들어 소재를 구성해보세요.</div>
            <button className={styles.btnPrimary} onClick={() => router.push('/playlists/new/edit')}>새 목록 만들기</button>
          </div>
        ) : (
          <div className={styles.grid}>
            {filtered.map(pl => (
              <div key={pl.id} className={styles.card} onClick={() => router.push(`/playlists/${pl.id}/edit`)}>
                <div className={styles.cardThumb}>
                  {Array.from({ length: Math.min((pl as any).slots?.length ?? pl.slotCount, 4) }).map((_, i) => {
                    const slot = (pl as any).slots?.[i]
                    const type = slot?.type ?? 'normal'
                    return (
                      <div key={i} className={`${styles.thumbSlot} ${type === 'dummy' ? styles.slotDummy : type === 'deleted' ? styles.slotDeleted : ''}`}>
                        {type === 'dummy' && <span className={styles.thumbText}>더미</span>}
                        {type === 'deleted' && <span className={styles.thumbTextDeleted}>삭제됨</span>}
                        {type === 'normal' && <span className={styles.thumbText}>{slot?.materialName?.slice(0, 3) ?? ''}</span>}
                      </div>
                    )
                  })}
                </div>
                <div className={styles.cardBody}>
                  <div className={styles.plName}>{pl.name}</div>
                  <div className={styles.plMeta}>
                    구좌 {pl.slotCount}개 (소재 {pl.materialCount}{pl.dummyCount > 0 ? ` + 더미 ${pl.dummyCount}` : ''}{pl.deletedCount > 0 ? ` + 삭제 ${pl.deletedCount}` : ''})
                  </div>
                  {pl.updatedAt && (
                    <div className={styles.plDate}>수정 {pl.updatedAt}</div>
                  )}
                  {pl.hasDeletedMaterial && (
                    <div className={styles.plWarning}>
                      <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round"><circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 12v.01"/></svg>
                      소재 삭제됨 — 교체 필요 ({pl.deletedCount}건)
                    </div>
                  )}
                </div>
                <div className={styles.cardFooter}>
                  <div className={pl.scheduleCount > 0 ? styles.schedCount : styles.schedCountEmpty}>
                    {pl.scheduleCount > 0 ? (
                      <>편성표 <strong>{pl.scheduleCount}</strong>건 사용 중</>
                    ) : '편성표 미연결'}
                  </div>
                  <div className={styles.cardActions} onClick={e => e.stopPropagation()}>
                    <button className={styles.actionBtn} onClick={() => router.push(`/playlists/${pl.id}/edit`)}>편집</button>
                    <button
                      className={`${styles.actionBtn} ${styles.actionBtnDanger}`}
                      onClick={() => setDeleteTarget(pl)}
                    >삭제</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {deleteTarget && (
        <div className={styles.modalBackdrop} onClick={() => setDeleteTarget(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.modalIcon}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            </div>
            <h2 className={styles.modalTitle}>재생목록 삭제 — {deleteTarget.name}</h2>
            {deleteTarget.scheduleCount > 0 ? (
              <p className={styles.modalBody}>
                이 재생목록을 사용 중인 편성표가 <strong>{deleteTarget.scheduleCount}건</strong> 있습니다.<br />
                편성표에서 먼저 교체한 후 삭제해주세요.
              </p>
            ) : (
              <p className={styles.modalBody}>이 재생목록을 삭제하시겠습니까? 삭제된 재생목록은 이력에서만 조회 가능합니다.</p>
            )}
            <div className={styles.modalActions}>
              <button className={styles.btnSecondary} onClick={() => setDeleteTarget(null)}>취소</button>
              <button
                className={styles.btnDanger}
                onClick={handleDelete}
                disabled={deleteTarget.scheduleCount > 0}
              >
                {deleteTarget.scheduleCount > 0 ? '삭제 불가' : '삭제'}
              </button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className={styles.toast} role="status" aria-live="polite">{toastMsg}</div>
      )}
    </div>
  )
}
