'use client'
import { useState } from 'react'
import Link from 'next/link'
import styles from './page.module.css'

type PwStrength = 'weak' | 'medium' | 'strong' | ''

function getPwStrength(pw: string): PwStrength {
  if (!pw) return ''
  if (pw.length < 6) return 'weak'
  const hasUpper = /[A-Z]/.test(pw)
  const hasNumber = /\d/.test(pw)
  const hasSpecial = /[^A-Za-z0-9]/.test(pw)
  const score = [hasUpper, hasNumber, hasSpecial].filter(Boolean).length
  if (pw.length >= 8 && score >= 2) return 'strong'
  return 'medium'
}

const PW_STRENGTH_LABEL: Record<string, string> = { weak: '약함', medium: '보통', strong: '강함' }

export default function ProfilePage() {
  // Basic info
  const [name, setName] = useState('김운영')
  const [phone, setPhone] = useState('010-1234-5678')
  const [lang, setLang] = useState('ko')
  const [infoChanged, setInfoChanged] = useState(false)

  // Password
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPw, setCurrentPw] = useState('')
  const [newPw, setNewPw] = useState('')
  const [confirmPw, setConfirmPw] = useState('')
  const pwStrength = getPwStrength(newPw)
  const pwChanged = !!(currentPw || newPw || confirmPw)

  const [toast, setToast] = useState('')

  function showToast(msg: string) {
    setToast(msg)
    setTimeout(() => setToast(''), 2800)
  }

  function handleSaveInfo(e: React.FormEvent) {
    e.preventDefault()
    setInfoChanged(false)
    showToast('기본 정보가 저장되었습니다.')
  }

  function handleSavePw(e: React.FormEvent) {
    e.preventDefault()
    setCurrentPw(''); setNewPw(''); setConfirmPw('')
    showToast('비밀번호가 변경되었습니다.')
  }

  return (
    <>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <span className={styles.breadcrumbItem}>설정</span>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>내 정보</span>
        </nav>
      </header>

      <div className={styles.settingsLayout}>
        {/* Settings sidenav */}
        <nav className={styles.settingsNav} aria-label="설정 메뉴">
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>내 계정</div>
            <Link href="/settings/profile" className={`${styles.navItem} ${styles.navItemActive}`}>프로필</Link>
            <Link href="/settings/notifications" className={styles.navItem}>알림 설정</Link>
            <Link href="/settings/security" className={styles.navItem}>보안</Link>
          </div>
          <div className={styles.navGroup}>
            <div className={styles.navGroupLabel}>시스템 (어드민)</div>
            <Link href="/settings/system" className={styles.navItem}>시스템 설정</Link>
          </div>
        </nav>

        {/* Content */}
        <div className={styles.content}>
          {/* Basic info card */}
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>기본 정보</h2>
              <p className={styles.cardSubtitle}>프로필 사진, 이름, 연락처 등을 수정합니다</p>
            </div>
            <form className={styles.cardBody} onSubmit={handleSaveInfo}>
              {/* Avatar */}
              <div className={styles.avatarSection}>
                <div className={styles.avatarCircle}>김</div>
                <div className={styles.avatarMeta}>
                  <button type="button" className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: 'var(--text-xs)' }}>
                    사진 변경
                  </button>
                  <span className={styles.avatarHint}>JPG/PNG, 최대 2MB, 권장 200×200px</span>
                </div>
              </div>

              <div className={styles.formGrid}>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="name">이름</label>
                  <input
                    id="name" type="text" className={styles.input}
                    value={name}
                    onChange={e => { setName(e.target.value); setInfoChanged(true) }}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label}>역할</label>
                  <div className={styles.roleField}>
                    <span className={styles.roleBadge}>어드민</span>
                  </div>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="email">이메일</label>
                  <input
                    id="email" type="email"
                    className={`${styles.input} ${styles.inputDisabled}`}
                    value="kim@bari.io" disabled
                  />
                  <span className={styles.inputHint}>변경이 필요한 경우 관리자에게 문의하세요</span>
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="phone">연락처</label>
                  <input
                    id="phone" type="tel" className={styles.input}
                    value={phone}
                    onChange={e => { setPhone(e.target.value); setInfoChanged(true) }}
                    placeholder="010-0000-0000"
                  />
                </div>
                <div className={styles.formGroup}>
                  <label className={styles.label} htmlFor="lang">언어</label>
                  <select
                    id="lang" className={styles.select}
                    value={lang}
                    onChange={e => { setLang(e.target.value); setInfoChanged(true) }}
                  >
                    <option value="ko">한국어</option>
                    <option value="en">English</option>
                  </select>
                </div>
              </div>

              {infoChanged && (
                <div className={styles.saveBar}>
                  <button type="button" className="btn btn-secondary" onClick={() => setInfoChanged(false)}>취소</button>
                  <button type="submit" className="btn btn-primary">저장</button>
                </div>
              )}
            </form>
          </div>

          {/* Password card */}
          <div className={styles.card} id="security">
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>비밀번호 변경</h2>
              <p className={styles.cardSubtitle}>계정 보안을 위해 주기적으로 비밀번호를 변경하세요</p>
            </div>
            <form className={styles.cardBody} onSubmit={handleSavePw}>
              <div className={styles.formGrid}>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label} htmlFor="current-pw">현재 비밀번호<span className={styles.required}>*</span></label>
                  <div className={styles.pwWrap}>
                    <input
                      id="current-pw"
                      type={showCurrent ? 'text' : 'password'}
                      className={styles.input}
                      value={currentPw}
                      onChange={e => setCurrentPw(e.target.value)}
                      autoComplete="current-password"
                    />
                    <button type="button" className={styles.pwToggle} onClick={() => setShowCurrent(v => !v)} aria-label="현재 비밀번호 표시/숨기기">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {showCurrent
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label} htmlFor="new-pw">새 비밀번호<span className={styles.required}>*</span></label>
                  <div className={styles.pwWrap}>
                    <input
                      id="new-pw"
                      type={showNew ? 'text' : 'password'}
                      className={styles.input}
                      value={newPw}
                      onChange={e => setNewPw(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.pwToggle} onClick={() => setShowNew(v => !v)} aria-label="새 비밀번호 표시/숨기기">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {showNew
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                        }
                      </svg>
                    </button>
                  </div>
                  {pwStrength && (
                    <>
                      <div className={styles.pwStrengthBar}>
                        <div className={`${styles.pwStrengthFill} ${
                          pwStrength === 'weak' ? styles.pwWeak
                          : pwStrength === 'medium' ? styles.pwMedium
                          : styles.pwStrong
                        }`} />
                      </div>
                      <span className={`${styles.pwStrengthLabel} ${
                        pwStrength === 'weak' ? styles.pwWeakLabel
                        : pwStrength === 'medium' ? styles.pwMediumLabel
                        : styles.pwStrongLabel
                      }`}>
                        비밀번호 강도: {PW_STRENGTH_LABEL[pwStrength]}
                      </span>
                    </>
                  )}
                </div>

                <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                  <label className={styles.label} htmlFor="confirm-pw">새 비밀번호 확인<span className={styles.required}>*</span></label>
                  <div className={styles.pwWrap}>
                    <input
                      id="confirm-pw"
                      type={showConfirm ? 'text' : 'password'}
                      className={styles.input}
                      value={confirmPw}
                      onChange={e => setConfirmPw(e.target.value)}
                      autoComplete="new-password"
                    />
                    <button type="button" className={styles.pwToggle} onClick={() => setShowConfirm(v => !v)} aria-label="비밀번호 확인 표시/숨기기">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                        {showConfirm
                          ? <><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/><path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/><line x1="1" y1="1" x2="23" y2="23"/></>
                          : <><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></>
                        }
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              {pwChanged && (
                <div className={styles.saveBar}>
                  <button type="button" className="btn btn-secondary" onClick={() => { setCurrentPw(''); setNewPw(''); setConfirmPw('') }}>취소</button>
                  <button type="submit" className="btn btn-primary">변경</button>
                </div>
              )}
            </form>
          </div>

          {/* Danger zone */}
          <div className={`${styles.card} ${styles.dangerCard}`}>
            <div className={`${styles.cardHeader} ${styles.dangerHeader}`} style={{ paddingBottom: 18 }}>
              <h2 className={`${styles.cardTitle} ${styles.dangerTitle}`}>위험 구역</h2>
            </div>
            <div className={styles.cardBody}>
              <div className={styles.dangerBody}>
                <p className={styles.dangerDesc}>계정을 비활성화하면 즉시 로그아웃 처리되며 접근이 불가해집니다. 복구하려면 관리자에게 문의하세요.</p>
                <button type="button" className="btn btn-danger">계정 비활성화</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {toast && (
        <div className={styles.toast} role="status">
          <svg className={styles.toastIcon} width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {toast}
        </div>
      )}
    </>
  )
}
