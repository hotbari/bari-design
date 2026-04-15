'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

const MEDIA_LIST = [
  { id: 'm-001', name: '강남대로 전광판', status: 'online' },
  { id: 'm-002', name: '홍대입구 사이니지', status: 'online' },
  { id: 'm-003', name: '신촌역 디스플레이', status: 'delay' },
  { id: 'm-004', name: '여의도 IFC 전광판', status: 'online' },
  { id: 'm-005', name: '명동 메가보드', status: 'offline' },
]

const MATERIALS = [
  { id: 'mat-001', name: '삼성 갤럭시 S25 런치 :15', meta: '15초 · MP4 · 승인됨' },
  { id: 'mat-002', name: '봄 시즌 브랜드 캠페인 :30', meta: '30초 · MP4 · 승인됨' },
  { id: 'mat-003', name: '카카오페이 봄 프로모션', meta: '20초 · MP4 · 승인됨' },
]

const DAYS = ['월', '화', '수', '목', '금', '토', '일']

interface TimeSlot { start: string; end: string }

export default function SyncSchedulePage() {
  const router = useRouter()
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [showDropdown, setShowDropdown] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState('mat-001')
  const [activeDays, setActiveDays] = useState<string[]>(['월', '화', '수', '목', '금'])
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([
    { start: '09:00', end: '09:30' },
    { start: '13:00', end: '13:15' },
    { start: '18:00', end: '18:30' },
  ])
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')
  const [toastMsg, setToastMsg] = useState('')
  const [saving, setSaving] = useState(false)

  function toggleMedia(id: string) {
    setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function removeMedia(id: string) {
    setSelectedMedia(prev => prev.filter(x => x !== id))
  }

  function toggleDay(day: string) {
    setActiveDays(prev => prev.includes(day) ? prev.filter(x => x !== day) : [...prev, day])
  }

  function addSlot() {
    setTimeSlots(prev => [...prev, { start: '10:00', end: '10:30' }])
  }

  function removeSlot(idx: number) {
    if (timeSlots.length <= 1) { showToast('최소 1개의 시간대가 필요합니다.'); return }
    setTimeSlots(prev => prev.filter((_, i) => i !== idx))
  }

  function updateSlot(idx: number, field: 'start' | 'end', val: string) {
    setTimeSlots(prev => prev.map((s, i) => i === idx ? { ...s, [field]: val } : s))
  }

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3000)
  }

  function handleSave() {
    if (selectedMedia.length === 0) { showToast('대상 매체를 선택해주세요.'); return }
    setSaving(true)
    setTimeout(() => {
      showToast(`싱크 송출이 ${selectedMedia.length}개 매체에 등록되었습니다.`)
      setTimeout(() => router.push('/schedules'), 1200)
    }, 1000)
  }

  const selectedMediaNames = selectedMedia.map(id => MEDIA_LIST.find(m => m.id === id)?.name ?? '')
  const currentMaterial = MATERIALS.find(m => m.id === selectedMaterial)

  // Timeline helper — convert hh:mm to minutes
  function toMins(t: string) {
    const [h, m] = t.split(':').map(Number)
    return (h || 0) * 60 + (m || 0)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>싱크 송출 설정</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <div>
            <h1 className={styles.pageTitle}>싱크 송출 설정</h1>
            <div className={styles.pageSubtitle}>매체의 정규 편성 외 특정 시간대에 소재를 직접 송출합니다.</div>
          </div>
          <div className={styles.syncBadge}>
            <div className={styles.syncPulse} />
            싱크 프로토콜 v2.1 연결됨
          </div>
        </div>

        <div className={styles.syncLayout}>
          {/* Left form */}
          <div>
            {/* Section 1: 대상 매체 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>대상 매체 선택</div>
                <span className={styles.cardCount}><span>{selectedMedia.length}</span>개 선택됨</span>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>매체 <span className={styles.req}>*</span></span>
                  <div className={styles.mediaChips} onClick={() => setShowDropdown(!showDropdown)}>
                    {selectedMedia.length === 0 ? (
                      <span className={styles.chipsPlaceholder}>클릭하여 매체 선택…</span>
                    ) : (
                      selectedMediaNames.map((name, i) => (
                        <span key={selectedMedia[i]} className={styles.chip}>
                          {name}
                          <button className={styles.chipRemove} onClick={e => { e.stopPropagation(); removeMedia(selectedMedia[i]) }}>
                            <svg viewBox="0 0 8 8" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M1 1l6 6M7 1L1 7"/></svg>
                          </button>
                        </span>
                      ))
                    )}
                  </div>
                  {showDropdown && (
                    <div className={styles.mediaDropdown}>
                      {MEDIA_LIST.map(m => (
                        <div
                          key={m.id}
                          className={`${styles.mediaDropItem} ${selectedMedia.includes(m.id) ? styles.mediaDropSelected : ''} ${m.status === 'offline' ? styles.disabled : ''}`}
                          onClick={() => m.status !== 'offline' && toggleMedia(m.id)}
                        >
                          <input type="checkbox" checked={selectedMedia.includes(m.id)} readOnly disabled={m.status === 'offline'} />
                          <span className={styles.mediaDropName}>{m.name}</span>
                          <span className={`${styles.mediaDropStatus} ${styles[`status-${m.status}`]}`}>
                            {m.status === 'online' ? '온라인' : m.status === 'delay' ? '지연' : '오프라인'}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Section 2: 소재 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>송출 소재</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.cardDesc}>싱크 송출 시간에 재생할 소재를 선택합니다.</div>
                {MATERIALS.map(m => (
                  <div
                    key={m.id}
                    className={`${styles.materialCard} ${selectedMaterial === m.id ? styles.materialSelected : ''}`}
                    onClick={() => setSelectedMaterial(m.id)}
                  >
                    <div className={styles.materialThumb} />
                    <div className={styles.materialInfo}>
                      <div className={styles.materialName}>{m.name}</div>
                      <div className={styles.materialMeta}>{m.meta}</div>
                    </div>
                    {selectedMaterial === m.id && (
                      <div className={styles.materialCheck}>
                        <svg viewBox="0 0 12 12" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><path d="M2 6l3 3 5-5"/></svg>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Section 3: 시간 설정 */}
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <div className={styles.cardTitle}>싱크 시간 설정</div>
              </div>
              <div className={styles.cardBody}>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>반복 요일 <span className={styles.req}>*</span></span>
                  <div className={styles.dayToggles}>
                    {DAYS.map(d => (
                      <button
                        key={d}
                        type="button"
                        className={`${styles.dayBtn} ${activeDays.includes(d) ? styles.dayActive : ''}`}
                        onClick={() => toggleDay(d)}
                      >{d}</button>
                    ))}
                  </div>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>싱크 시간대 <span className={styles.req}>*</span></span>
                  <div className={styles.timeGrid}>
                    {timeSlots.map((slot, i) => (
                      <div key={i} className={styles.timeSlotRow}>
                        <input className={styles.timeInput} type="time" value={slot.start} onChange={e => updateSlot(i, 'start', e.target.value)} />
                        <span className={styles.timeSep}>→</span>
                        <input className={styles.timeInput} type="time" value={slot.end} onChange={e => updateSlot(i, 'end', e.target.value)} />
                        <button className={styles.timeRemove} type="button" onClick={() => removeSlot(i)} title="삭제">
                          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
                        </button>
                      </div>
                    ))}
                  </div>
                  <button className={styles.addTimeBtn} type="button" onClick={addSlot}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"><path d="M8 3v10M3 8h10"/></svg>
                    시간대 추가
                  </button>
                </div>
                <div className={styles.field}>
                  <span className={styles.fieldLabel}>적용 기간</span>
                  <div className={styles.dateRow}>
                    <input className={styles.timeInput} type="date" value={startDate} onChange={e => setStartDate(e.target.value)} style={{ flex: 1 }} />
                    <span className={styles.timeSep}>→</span>
                    <input className={styles.timeInput} type="date" value={endDate} onChange={e => setEndDate(e.target.value)} style={{ flex: 1 }} />
                  </div>
                  <div className={styles.fieldHint}>비워두면 수동으로 중단할 때까지 계속 실행됩니다.</div>
                </div>
              </div>
            </div>
          </div>

          {/* Right preview */}
          <div>
            <div className={styles.previewPanel}>
              <div className={styles.previewHeader}>
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" style={{ color: 'var(--color-neutral-500)' }}><circle cx="8" cy="8" r="7"/><path d="M8 4v5l3 2"/></svg>
                <span className={styles.previewTitle}>설정 미리보기</span>
              </div>
              <div className={styles.previewBody}>
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>대상 매체</div>
                  <div className={`${styles.previewVal} ${selectedMedia.length === 0 ? styles.previewEmpty : ''}`}>
                    {selectedMedia.length === 0 ? '미선택' : selectedMediaNames.join(', ')}
                  </div>
                </div>
                <div className={styles.previewDivider} />
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>송출 소재</div>
                  <div className={styles.previewVal}>{currentMaterial?.name}</div>
                </div>
                <div className={styles.previewDivider} />
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>반복 요일</div>
                  <div className={`${styles.previewVal} ${activeDays.length === 0 ? styles.previewEmpty : ''}`}>
                    {activeDays.length === 0 ? '미선택' : activeDays.join('·')}
                  </div>
                </div>
                <div className={styles.previewDivider} />
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>싱크 시간 (하루 {timeSlots.length}회)</div>
                  <div className={styles.previewVal} style={{ fontSize: 'var(--text-xs)', lineHeight: '1.6' }}>
                    {timeSlots.map((s, i) => <div key={i}>{s.start} → {s.end}</div>)}
                  </div>
                </div>
                <div className={styles.previewDivider} />
                <div className={styles.previewRow}>
                  <div className={styles.previewLabel}>오늘의 타임라인</div>
                  <div className={styles.timelineViz}>
                    <div className={styles.timelineHeader}>
                      {['0', '6', '12', '18', '24'].map(h => (
                        <div key={h} className={styles.timelineHour}>{h}</div>
                      ))}
                    </div>
                    <div className={styles.timelineRow}>
                      {timeSlots.map((s, i) => {
                        const leftPct = (toMins(s.start) / 1440 * 100).toFixed(2)
                        const widthPct = Math.max(((toMins(s.end) - toMins(s.start)) / 1440 * 100), 0.5).toFixed(2)
                        return (
                          <div key={i} className={styles.timelineBlock} style={{ left: `${leftPct}%`, width: `${widthPct}%` }}>
                            <div className={styles.timelineLabel}>{s.start}</div>
                          </div>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Action bar */}
      <div className={styles.formActions}>
        <button className={styles.btnGhost} onClick={() => router.push('/schedules')}>취소</button>
        <div style={{ flex: 1 }} />
        <button className={styles.btnPrimary} onClick={handleSave} disabled={saving}>
          {saving ? '등록 중…' : '싱크 송출 등록'}
        </button>
      </div>

      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
    </div>
  )
}
