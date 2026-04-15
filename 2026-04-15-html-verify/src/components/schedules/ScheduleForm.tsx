'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ScheduleDetail } from '@/types/schedule'
import styles from './ScheduleForm.module.css'

interface Props {
  defaultValues?: Partial<ScheduleDetail>
  onSubmit: (data: any) => void
  isEdit?: boolean
}

const PLAYLISTS = [
  { id: 'pl-001', name: '강남권 4월 운영 재생목록', slotCount: 8 },
  { id: 'pl-002', name: '신촌 스프링 캠페인 재생목록', slotCount: 5 },
  { id: 'pl-003', name: '공익광고 필러 재생목록', slotCount: 3 },
  { id: 'pl-004', name: '여의도 봄 시즌 재생목록', slotCount: 6 },
]

const MEDIA_LIST = [
  { id: 'm-001', name: '강남대로 전광판' },
  { id: 'm-002', name: '홍대입구 사이니지' },
  { id: 'm-003', name: '신촌역 디스플레이' },
  { id: 'm-004', name: '여의도 IFC 전광판' },
  { id: 'm-005', name: '명동 메가보드' },
]

export function ScheduleForm({ defaultValues = {}, onSubmit, isEdit = false }: Props) {
  const router = useRouter()
  const [name, setName] = useState(defaultValues.name ?? '')
  const [priority, setPriority] = useState(defaultValues.priority ?? 'prio-3')
  const [playlistId, setPlaylistId] = useState(defaultValues.playlistId ?? '')
  const [playlistSearch, setPlaylistSearch] = useState('')
  const [mediaIds, setMediaIds] = useState<string[]>(
    defaultValues.mediaId ? [defaultValues.mediaId] : []
  )
  const [mediaSearch, setMediaSearch] = useState('')
  const [startDate, setStartDate] = useState(defaultValues.startDate ?? '')
  const [startTime, setStartTime] = useState('00:00')
  const [endDate, setEndDate] = useState(defaultValues.endDate ?? '')
  const [endTime, setEndTime] = useState('23:59')
  const [submitting, setSubmitting] = useState(false)

  const selectedPlaylist = PLAYLISTS.find(p => p.id === playlistId)
  const filteredPlaylists = PLAYLISTS.filter(p =>
    !playlistSearch || p.name.includes(playlistSearch)
  )
  const filteredMedia = MEDIA_LIST.filter(m =>
    !mediaSearch || m.name.includes(mediaSearch)
  )

  function toggleMedia(id: string) {
    setMediaIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!name.trim() || !playlistId || mediaIds.length === 0) return
    setSubmitting(true)
    await onSubmit({
      name,
      priority,
      playlistId,
      playlistName: selectedPlaylist?.name ?? '',
      mediaId: mediaIds[0],
      mediaName: MEDIA_LIST.find(m => m.id === mediaIds[0])?.name,
      startDate,
      endDate,
      sync: 'sync-none',
      editingNow: false,
      status: 'pending',
    })
    setSubmitting(false)
  }

  const prioOptions = [
    { value: 'prio-1', label: '1순위', desc: '최우선 편성' },
    { value: 'prio-2', label: '2순위', desc: '우선 편성' },
    { value: 'prio-3', label: '3순위', desc: '일반 (기본)' },
  ]

  return (
    <form className={styles.formLayout} onSubmit={handleSubmit}>
      <div className={styles.formMain}>
        {/* Section 1: 기본 설정 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>1</span>
            <span className={styles.sectionTitle}>기본 설정</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="sch-name">
                편성표명 <span className={styles.req}>*</span>
              </label>
              <input
                id="sch-name"
                className={styles.formInput}
                type="text"
                placeholder="편성표 이름 입력"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>우선순위 <span className={styles.req}>*</span></span>
              <div className={styles.prioCards}>
                {prioOptions.map(opt => (
                  <div key={opt.value} className={styles.prioCard}>
                    <input
                      type="radio"
                      name="priority"
                      id={`prio-${opt.value}`}
                      value={opt.value}
                      checked={priority === opt.value}
                      onChange={() => setPriority(opt.value as any)}
                    />
                    <label className={styles.prioCardLabel} htmlFor={`prio-${opt.value}`}>
                      <span className={`${styles.prioBadgeInline} ${styles[`${opt.value}-badge`]}`}>{opt.label}</span>
                      <span className={styles.prioDesc}>{opt.desc}</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 2: 콘텐츠 및 매체 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>2</span>
            <span className={styles.sectionTitle}>콘텐츠 및 매체</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>재생목록 <span className={styles.req}>*</span></span>
              <div className={styles.playlistSelector}>
                <div className={styles.playlistSearchRow}>
                  <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
                  <input
                    className={styles.playlistSearchInput}
                    placeholder="재생목록 검색"
                    value={playlistSearch}
                    onChange={e => setPlaylistSearch(e.target.value)}
                  />
                </div>
                <div className={styles.playlistList}>
                  {filteredPlaylists.map(pl => (
                    <div
                      key={pl.id}
                      className={`${styles.playlistItem} ${playlistId === pl.id ? styles.selected : ''}`}
                      onClick={() => setPlaylistId(pl.id)}
                    >
                      <div className={styles.playlistInfo}>
                        <div className={styles.playlistName}>{pl.name}</div>
                        <div className={styles.playlistMeta}>구좌 {pl.slotCount}개</div>
                      </div>
                      {playlistId === pl.id && (
                        <div className={styles.playlistCheck}>
                          <svg viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className={styles.field}>
              <span className={styles.fieldLabel}>대상 매체 <span className={styles.req}>*</span></span>
              <div className={styles.mediaSearchRow}>
                <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><circle cx="7" cy="7" r="4.5"/><path d="M10.5 10.5 13 13"/></svg>
                <input
                  className={styles.mediaSearchInput}
                  placeholder="매체 검색"
                  value={mediaSearch}
                  onChange={e => setMediaSearch(e.target.value)}
                />
              </div>
              <div className={styles.mediaCheckList}>
                {filteredMedia.map(m => (
                  <label key={m.id} className={styles.mediaCheckItem}>
                    <input
                      type="checkbox"
                      checked={mediaIds.includes(m.id)}
                      onChange={() => toggleMedia(m.id)}
                    />
                    <span className={styles.mediaCheckName}>{m.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Section 3: 적용 기간 */}
        <div className={styles.section}>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionNum}>3</span>
            <span className={styles.sectionTitle}>적용 기간</span>
          </div>
          <div className={styles.sectionBody}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="start-date">시작일시</label>
                <div className={styles.datetimeRow}>
                  <input id="start-date" className={styles.formInput} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <input className={styles.formInput} type="time" value={startTime} onChange={e => setStartTime(e.target.value)} />
                </div>
              </div>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="end-date">종료일시</label>
                <div className={styles.datetimeRow}>
                  <input id="end-date" className={styles.formInput} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                  <input className={styles.formInput} type="time" value={endTime} onChange={e => setEndTime(e.target.value)} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right preview panel */}
      <div className={styles.previewPanel}>
        <div className={styles.previewHeader}>
          <span className={styles.previewTitle}>입력 요약</span>
        </div>
        <div className={styles.previewBody}>
          <div className={styles.previewRow}>
            <div className={styles.previewLabel}>편성표명</div>
            <div className={`${styles.previewVal} ${!name ? styles.previewEmpty : ''}`}>{name || '미입력'}</div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewLabel}>우선순위</div>
            <div className={styles.previewVal}>{priority === 'prio-1' ? '1순위' : priority === 'prio-2' ? '2순위' : '3순위'}</div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewLabel}>재생목록</div>
            <div className={`${styles.previewVal} ${!selectedPlaylist ? styles.previewEmpty : ''}`}>{selectedPlaylist?.name ?? '미선택'}</div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewLabel}>대상 매체</div>
            <div className={`${styles.previewVal} ${mediaIds.length === 0 ? styles.previewEmpty : ''}`}>
              {mediaIds.length === 0 ? '미선택' : mediaIds.map(id => MEDIA_LIST.find(m => m.id === id)?.name).join(', ')}
            </div>
          </div>
          <div className={styles.previewRow}>
            <div className={styles.previewLabel}>기간</div>
            <div className={`${styles.previewVal} ${!startDate ? styles.previewEmpty : ''}`}>
              {startDate ? `${startDate} ~ ${endDate || '미입력'}` : '미입력'}
            </div>
          </div>
        </div>
        <div className={styles.formActions}>
          <button type="button" className={styles.btnSecondary} onClick={() => router.back()}>취소</button>
          <button type="submit" className={styles.btnPrimary} disabled={submitting}>
            {submitting ? '저장 중...' : isEdit ? '수정 저장' : '저장'}
          </button>
        </div>
      </div>
    </form>
  )
}
