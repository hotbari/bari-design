'use client'
import { useState } from 'react'
import styles from './page.module.css'

const MEDIA_LIST = [
  { id: 'm-001', name: '강남대로 전광판', status: 'online' },
  { id: 'm-002', name: '홍대입구 사이니지', status: 'online' },
  { id: 'm-003', name: '신촌역 디스플레이', status: 'delay' },
  { id: 'm-004', name: '여의도 IFC 전광판', status: 'online' },
  { id: 'm-005', name: '명동 메가보드', status: 'offline' },
]

const MATERIALS = [
  { id: 'mat-em-001', name: '기상청 특보 안내 :30' },
  { id: 'mat-em-002', name: '재해 위험 구역 경보 :20' },
  { id: 'mat-em-003', name: '시설물 안전 점검 알림 :15' },
  { id: 'mat-em-004', name: '지자체 긴급 공지 :30' },
  { id: 'mat-em-005', name: '대피 안내 방송 :60' },
]

const DURATIONS = [
  { value: '30min', label: '30분', sub: '단기' },
  { value: '1h', label: '1시간', sub: '기본' },
  { value: '2h', label: '2시간', sub: '중기' },
  { value: 'manual', label: '수동 해제', sub: '직접 종료' },
]

type EmStatus = 'em-active' | 'em-inactive'
interface ActiveEmergency {
  id: string
  media: string
  material: string
  period: string
  reason: string
  status: EmStatus
}

const INITIAL_EMERGENCIES: ActiveEmergency[] = [
  { id: 'em-001', media: '강남대로 전광판', material: '기상청 특보 안내 :30', period: '오늘 09:42 ~', reason: '기상 특보', status: 'em-active' },
  { id: 'em-002', media: '홍대입구 사이니지', material: '시설물 안전 점검 알림 :15', period: '어제 14:20 → 16:05', reason: '시설물 안전 경고', status: 'em-inactive' },
]

export default function EmergencySchedulePage() {
  const [emergencies, setEmergencies] = useState<ActiveEmergency[]>(INITIAL_EMERGENCIES)
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [material, setMaterial] = useState('')
  const [duration, setDuration] = useState('1h')
  const [reason, setReason] = useState('')
  const [confirmed, setConfirmed] = useState(false)
  const [dismissTarget, setDismissTarget] = useState<ActiveEmergency | null>(null)
  const [toastMsg, setToastMsg] = useState('')
  const [triggering, setTriggering] = useState(false)

  const canTrigger = selectedMedia.length > 0 && material && reason.trim() && confirmed

  function toggleMedia(id: string) {
    setSelectedMedia(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  function showToast(msg: string) {
    setToastMsg(msg)
    setTimeout(() => setToastMsg(''), 3500)
  }

  function handleTrigger() {
    setTriggering(true)
    setTimeout(() => {
      showToast(`긴급 편성이 ${selectedMedia.length}개 매체에 즉시 발동되었습니다.`)
      setSelectedMedia([])
      setMaterial('')
      setReason('')
      setConfirmed(false)
      setTriggering(false)
    }, 1200)
  }

  function handleDismiss() {
    if (!dismissTarget) return
    setEmergencies(prev =>
      prev.map(e => e.id === dismissTarget.id ? { ...e, status: 'em-inactive' as EmStatus } : e)
    )
    showToast(`${dismissTarget.media}의 긴급 편성이 해제되었습니다.`)
    setDismissTarget(null)
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>편성 관리</span>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>긴급 편성</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림">
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>긴급 편성</h1>
          <span className={styles.adminBadge}>
            <svg width="10" height="10" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 1a4 4 0 0 1 4 4v2H4V5a4 4 0 0 1 4-4z"/><rect x="2" y="7" width="12" height="8" rx="1.5"/></svg>
            어드민 전용
          </span>
        </div>

        {/* Warning banner */}
        <div className={styles.emergencyBanner}>
          <div className={styles.bannerIcon}>
            <svg width="18" height="18" viewBox="0 0 16 16" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round"><path d="M8 1L1 14h14L8 1z"/><path d="M8 6v4M8 11.5v.5"/></svg>
          </div>
          <div className={styles.bannerBody}>
            <div className={styles.bannerTitle}>긴급 편성은 모든 기존 편성을 즉시 중단하고 지정 소재를 송출합니다</div>
            <div className={styles.bannerDesc}>
              발동 즉시 해당 매체의 현재 재생이 중단됩니다. 공공 안전 방송, 재해 경보, 긴급 공지 등 실제 긴급 상황에서만 사용하십시오.
              모든 긴급 편성 발동/해제 이력은 감사 로그에 기록됩니다.
            </div>
          </div>
        </div>

        {/* Current emergencies */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <div className={styles.cardTitle}>현재 긴급 편성 현황</div>
          </div>
          <div className={styles.cardBody}>
            {emergencies.map(em => (
              <div key={em.id} className={`${styles.emergencyItem} ${em.status === 'em-active' ? styles.isActive : ''}`}>
                <div className={`${styles.emIcon} ${em.status === 'em-active' ? styles.emIconActive : styles.emIconInactive}`}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke={em.status === 'em-active' ? 'white' : 'var(--color-neutral-400)'} strokeWidth="1.8" strokeLinecap="round"><path d="M8 1L1 14h14L8 1z"/><path d="M8 6v4M8 11.5v.5"/></svg>
                </div>
                <div className={styles.emInfo}>
                  <div className={styles.emName}>{em.media} — {em.reason}</div>
                  <div className={styles.emMeta}>{em.period} · {em.material}</div>
                </div>
                <span className={`${styles.emBadge} ${styles[em.status]}`}>
                  {em.status === 'em-active' && <span className={styles.emDot} />}
                  {em.status === 'em-active' ? '발동중' : '해제됨'}
                </span>
                {em.status === 'em-active' && (
                  <button className={styles.btnDismiss} onClick={() => setDismissTarget(em)}>
                    <svg width="13" height="13" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M4 4l8 8M12 4l-8 8"/></svg>
                    해제
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* New emergency form */}
        <div className={styles.card}>
          <div className={styles.cardHeader}>
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" stroke="oklch(0.55 0.18 25)" strokeWidth="1.8" strokeLinecap="round"><path d="M8 1L1 14h14L8 1z"/><path d="M8 6v4M8 11.5v.5"/></svg>
            <div className={styles.cardTitle}>새 긴급 편성 발동</div>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.field}>
              <label className={styles.fieldLabel}>대상 매체 <span className={styles.req}>*</span></label>
              <div className={styles.mediaCheckList}>
                {MEDIA_LIST.map(m => (
                  <label
                    key={m.id}
                    className={`${styles.mediaCheckItem} ${m.status === 'offline' ? styles.disabled : ''}`}
                  >
                    <input
                      type="checkbox"
                      checked={selectedMedia.includes(m.id)}
                      onChange={() => m.status !== 'offline' && toggleMedia(m.id)}
                      disabled={m.status === 'offline'}
                    />
                    <span className={styles.mediaCheckName}>{m.name}</span>
                    <span className={`${styles.mediaStatus} ${styles[`m-${m.status}`]}`}>
                      {m.status === 'online' ? '온라인' : m.status === 'delay' ? '지연' : '오프라인'}
                    </span>
                  </label>
                ))}
              </div>
              <div className={styles.mediaActions}>
                <button className={styles.btnGhost} type="button" onClick={() => setSelectedMedia(MEDIA_LIST.filter(m => m.status !== 'offline').map(m => m.id))}>전체 선택</button>
                <button className={styles.btnGhost} type="button" onClick={() => setSelectedMedia([])}>전체 해제</button>
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="em-material">송출 소재 <span className={styles.req}>*</span></label>
              <select className={styles.formSelect} id="em-material" value={material} onChange={e => setMaterial(e.target.value)}>
                <option value="">소재 선택…</option>
                {MATERIALS.map(m => <option key={m.id} value={m.id}>{m.name}</option>)}
              </select>
            </div>

            <div className={styles.field}>
              <span className={styles.fieldLabel}>지속 시간</span>
              <div className={styles.durationOptions}>
                {DURATIONS.map(d => (
                  <div key={d.value} className={styles.durationOpt}>
                    <input type="radio" name="em-duration" id={`dur-${d.value}`} value={d.value} checked={duration === d.value} onChange={() => setDuration(d.value)} />
                    <label className={styles.durationLabel} htmlFor={`dur-${d.value}`}>
                      {d.label}
                      <div className={styles.durationSub}>{d.sub}</div>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <label className={styles.fieldLabel} htmlFor="em-reason">발동 사유 <span className={styles.req}>*</span></label>
              <textarea
                className={styles.formTextarea}
                id="em-reason"
                placeholder="긴급 편성 발동 사유를 입력하세요. 감사 로그에 기록됩니다."
                value={reason}
                onChange={e => setReason(e.target.value)}
              />
            </div>

            <div className={styles.confirmRow}>
              <input type="checkbox" id="em-confirm" checked={confirmed} onChange={e => setConfirmed(e.target.checked)} />
              <label className={styles.confirmText} htmlFor="em-confirm">
                위 내용을 확인했습니다. 긴급 편성 발동 시 선택된 매체의 <strong>현재 편성이 즉시 중단</strong>되며 이 소재가 대신 송출됩니다.
              </label>
            </div>

            <button
              className={styles.btnTrigger}
              disabled={!canTrigger || triggering}
              onClick={handleTrigger}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><path d="M8 1L1 14h14L8 1z"/><path d="M8 6v4M8 11.5v.5"/></svg>
              {triggering ? '발동 중…' : '긴급 편성 발동'}
            </button>
          </div>
        </div>
      </main>

      {/* Dismiss modal */}
      {dismissTarget && (
        <div className={styles.modalBackdrop} onClick={() => setDismissTarget(null)}>
          <div className={styles.modal} onClick={e => e.stopPropagation()} role="dialog" aria-modal="true">
            <div className={styles.modalTitle}>긴급 편성 해제</div>
            <div className={styles.modalDesc}>「{dismissTarget.media}」의 긴급 편성을 해제합니다. 해제 즉시 기존 정규 편성이 재개됩니다.</div>
            <div className={styles.modalActions}>
              <button className={styles.btnGhost} onClick={() => setDismissTarget(null)}>취소</button>
              <button className={styles.btnDangerConfirm} onClick={handleDismiss}>해제 확인</button>
            </div>
          </div>
        </div>
      )}

      {toastMsg && <div className={styles.toast}>{toastMsg}</div>}
    </div>
  )
}
