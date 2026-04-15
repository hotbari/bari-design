'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useMutation } from '@tanstack/react-query'
import styles from './page.module.css'

const MEDIA_OPTIONS = [
  { value: 'lotteworld', label: '롯데월드 타워 외부 LED' },
  { value: 'coex', label: '코엑스 SM타운 아트리움' },
  { value: 'gangnam', label: '강남역 출구 빌보드' },
  { value: 'hongdae', label: '홍대 거리 미디어폴' },
  { value: 'jamsil', label: '잠실 롯데타운 전광판' },
  { value: 'sinchon', label: '신촌 이마트 DID' },
]

async function postReport(body: object) {
  const res = await fetch('/api/reports', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })
  if (!res.ok) throw new Error('failed')
  return res.json()
}

export default function ReportNewPage() {
  const router = useRouter()
  const [reportType, setReportType] = useState('')
  const [dateStart, setDateStart] = useState('')
  const [dateEnd, setDateEnd] = useState('')
  const [selectedMedia, setSelectedMedia] = useState<string[]>([])
  const [scheduleEnabled, setScheduleEnabled] = useState(false)
  const [scheduleFreq, setScheduleFreq] = useState('weekly')
  const [scheduleTime, setScheduleTime] = useState('09:00')
  const [emails, setEmails] = useState<string[]>([])
  const [emailInput, setEmailInput] = useState('')
  const [toast, setToast] = useState('')

  const mutation = useMutation({
    mutationFn: postReport,
    onSuccess: () => {
      showToast('리포트 생성이 요청되었습니다. 완료 시 알림을 드립니다.')
      setTimeout(() => router.push('/reports'), 1500)
    },
  })

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  function toggleMedia(value: string) {
    setSelectedMedia(prev =>
      prev.includes(value) ? prev.filter(v => v !== value) : [...prev, value]
    )
  }

  function toggleAllMedia() {
    if (selectedMedia.length === MEDIA_OPTIONS.length) {
      setSelectedMedia([])
    } else {
      setSelectedMedia(MEDIA_OPTIONS.map(m => m.value))
    }
  }

  function handleEmailKey(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Enter') {
      e.preventDefault()
      const val = emailInput.trim()
      if (val && val.includes('@') && !emails.includes(val)) {
        setEmails(prev => [...prev, val])
        setEmailInput('')
      }
    } else if (e.key === 'Backspace' && emailInput === '' && emails.length > 0) {
      setEmails(prev => prev.slice(0, -1))
    }
  }

  function handleGenerate() {
    if (!reportType) { alert('리포트 유형을 선택해 주세요.'); return }
    if (selectedMedia.length === 0) { alert('대상 매체를 하나 이상 선택해 주세요.'); return }
    mutation.mutate({ type: reportType, startDate: dateStart, endDate: dateEnd, media: selectedMedia })
  }

  function handleScheduleSave() {
    if (!scheduleEnabled) { showToast('예약 발송을 먼저 활성화해 주세요.'); return }
    showToast('예약 발송이 저장되었습니다.')
  }

  return (
    <div className={styles.page}>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb}>
          <span className={styles.breadcrumbParent}>리포트</span>
          <span className={styles.sep}>›</span>
          <button className={styles.breadcrumbLink} onClick={() => router.push('/reports')}>리포트 목록</button>
          <span className={styles.sep}>›</span>
          <span className={styles.current}>리포트 생성</span>
        </nav>
        <button className={styles.gnbBell} aria-label="알림" onClick={() => router.push('/notifications')}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round"><path d="M8 1a5 5 0 0 1 5 5v3l1.5 2H1.5L3 9V6a5 5 0 0 1 5-5z"/><path d="M6.5 13.5a1.5 1.5 0 0 0 3 0"/></svg>
        </button>
      </header>

      <main className={styles.content}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>리포트 생성</h1>
          <p className={styles.pageDesc}>캠페인 성과, 매체 상태, 편성 현황 리포트를 즉시 생성하거나 예약 발송합니다.</p>
        </div>

        {/* Card 1: 리포트 설정 */}
        <section className={styles.formCard} aria-labelledby="card1-title">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle} id="card1-title">리포트 설정</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.fieldRow}>
              <div className={styles.field}>
                <label className={styles.fieldLabel} htmlFor="report-type">
                  리포트 유형 <span className={styles.required} aria-hidden="true">*</span>
                </label>
                <select
                  id="report-type"
                  className={styles.fieldSelect}
                  value={reportType}
                  onChange={e => setReportType(e.target.value)}
                  aria-required="true"
                >
                  <option value="">유형 선택</option>
                  <option value="campaign">캠페인 성과</option>
                  <option value="media">매체 상태</option>
                  <option value="schedule">편성 현황</option>
                </select>
              </div>
              <div className={styles.field} />
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabel} id="media-select-label">
                대상 매체 <span className={styles.required} aria-hidden="true">*</span>
              </div>
              <div className={styles.mediaSelectHeader}>
                <span className={styles.fieldHint}>하나 이상의 매체를 선택하세요</span>
                <button className={styles.selectAllBtn} type="button" onClick={toggleAllMedia}>
                  {selectedMedia.length === MEDIA_OPTIONS.length ? '전체 해제' : '전체 선택'}
                </button>
              </div>
              <div className={styles.mediaGrid} role="group" aria-labelledby="media-select-label">
                {MEDIA_OPTIONS.map(m => (
                  <label
                    key={m.value}
                    className={`${styles.mediaItem} ${selectedMedia.includes(m.value) ? styles.mediaItemChecked : ''}`}
                  >
                    <input
                      type="checkbox"
                      value={m.value}
                      checked={selectedMedia.includes(m.value)}
                      onChange={() => toggleMedia(m.value)}
                      aria-label={m.label}
                    />
                    <span className={styles.mediaLabel}>{m.label}</span>
                  </label>
                ))}
              </div>
            </div>

            <div className={styles.field}>
              <div className={styles.fieldLabel}>
                기간 <span className={styles.required} aria-hidden="true">*</span>
              </div>
              <div className={styles.dateRange}>
                <input type="date" className={styles.fieldDate} id="date-start" value={dateStart} onChange={e => setDateStart(e.target.value)} aria-label="시작일" aria-required="true" />
                <span className={styles.dateRangeSep}>–</span>
                <input type="date" className={styles.fieldDate} id="date-end" value={dateEnd} onChange={e => setDateEnd(e.target.value)} aria-label="종료일" aria-required="true" />
              </div>
            </div>
          </div>
        </section>

        {/* Card 2: 예약 발송 */}
        <section className={styles.formCard} aria-labelledby="card2-title">
          <div className={styles.cardHeader}>
            <h2 className={styles.cardTitle} id="card2-title">예약 발송</h2>
          </div>
          <div className={styles.cardBody}>
            <div className={styles.toggleRow}>
              <div>
                <div className={styles.toggleLabel}>예약 발송 사용</div>
                <div className={styles.toggleDesc}>리포트를 자동으로 생성하여 이메일로 발송합니다</div>
              </div>
              <label className={styles.toggle} aria-label="예약 발송 사용">
                <input type="checkbox" checked={scheduleEnabled} onChange={e => setScheduleEnabled(e.target.checked)} />
                <span className={styles.toggleTrack} aria-hidden="true" />
                <span className={styles.toggleThumb} aria-hidden="true" />
              </label>
            </div>

            {scheduleEnabled && (
              <div className={styles.scheduleFields}>
                <div className={styles.fieldRow}>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="schedule-freq">
                      발송 주기 <span className={styles.required} aria-hidden="true">*</span>
                    </label>
                    <select id="schedule-freq" className={styles.fieldSelect} value={scheduleFreq} onChange={e => setScheduleFreq(e.target.value)} aria-required="true">
                      <option value="daily">매일</option>
                      <option value="weekly">매주</option>
                      <option value="monthly">매월</option>
                    </select>
                  </div>
                  <div className={styles.field}>
                    <label className={styles.fieldLabel} htmlFor="schedule-time">
                      발송 시각 <span className={styles.required} aria-hidden="true">*</span>
                    </label>
                    <input type="time" id="schedule-time" className={styles.fieldInput} value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} aria-required="true" />
                  </div>
                </div>
                <div className={styles.field}>
                  <label className={styles.fieldLabel} htmlFor="email-input">
                    수신자 이메일 <span className={styles.required} aria-hidden="true">*</span>
                  </label>
                  <div
                    className={styles.emailTagArea}
                    onClick={() => document.getElementById('email-input')?.focus()}
                    role="group"
                    aria-label="수신자 이메일 목록"
                  >
                    {emails.map(email => (
                      <span key={email} className={styles.emailTag} role="group" aria-label={`${email} 이메일`}>
                        <span className={styles.emailTagText}>{email}</span>
                        <button
                          className={styles.emailTagRemove}
                          type="button"
                          onClick={() => setEmails(prev => prev.filter(e => e !== email))}
                          aria-label={`${email} 제거`}
                        >×</button>
                      </span>
                    ))}
                    <input
                      id="email-input"
                      type="email"
                      className={styles.emailTagInput}
                      placeholder="이메일 입력 후 Enter"
                      value={emailInput}
                      onChange={e => setEmailInput(e.target.value)}
                      onKeyDown={handleEmailKey}
                      aria-label="새 수신자 이메일 입력"
                    />
                  </div>
                  <span className={styles.fieldHint}>Enter 키로 추가, Backspace로 마지막 주소 삭제</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Action bar */}
        <div className={styles.actionBar} role="group" aria-label="리포트 생성 액션">
          <button
            className={styles.btnPrimary}
            onClick={handleGenerate}
            disabled={mutation.isPending}
            aria-busy={mutation.isPending}
          >
            {mutation.isPending ? (
              <><span className={styles.spinner} aria-hidden="true" /> 생성 중…</>
            ) : (
              <><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polygon points="5 3 19 12 5 21 5 3"/></svg> 즉시 생성</>
            )}
          </button>
          <button className={styles.btnSecondary} onClick={handleScheduleSave} disabled={mutation.isPending}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
            예약 저장
          </button>
          <div style={{ flex: 1 }} />
          <button className={styles.btnSecondary} onClick={() => router.push('/reports')}>취소</button>
        </div>
      </main>

      {toast && (
        <div className={styles.toast} role="status" aria-live="polite" aria-atomic="true">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
          {toast}
        </div>
      )}
    </div>
  )
}
