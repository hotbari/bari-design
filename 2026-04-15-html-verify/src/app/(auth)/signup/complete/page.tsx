'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styles from './page.module.css'

type View = 'form' | 'expired' | 'already-used' | 'success'

// Mock invite data — in production this comes from the token in the URL
const MOCK_INVITE = {
  inviter: '박진수',
  role: '매체사 담당자',
  email: 'user@company.kr',
  expired: false,
  alreadyUsed: false,
}

function getStrength(pw: string): { level: 'weak' | 'fair' | 'strong'; label: string } {
  let score = 0
  if (pw.length >= 8)          score++
  if (/[a-zA-Z]/.test(pw))     score++
  if (/[0-9]/.test(pw))        score++
  if (/[^a-zA-Z0-9]/.test(pw)) score++
  if (score <= 2) return { level: 'weak', label: '약함' }
  if (score === 3) return { level: 'fair', label: '보통' }
  return { level: 'strong', label: '강함' }
}

const BrandMark = () => (
  <div className={styles.brand} aria-hidden="true">
    <div className={styles.brandMark}>
      <svg viewBox="0 0 24 24" focusable="false">
        <rect x="4" y="3" width="10" height="18" rx="2" />
        <path d="M14 7h3a2 2 0 0 1 0 4h-3M14 11h4a2 2 0 0 1 0 4h-4" />
      </svg>
    </div>
    <div className={styles.brandName}>Bari CMS</div>
  </div>
)

export default function SignupCompletePage() {
  const router = useRouter()
  const invite = MOCK_INVITE

  const initialView: View = invite.expired ? 'expired' : invite.alreadyUsed ? 'already-used' : 'form'
  const [view, setView] = useState<View>(initialView)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [nameError, setNameError] = useState('')
  const [pwError, setPwError] = useState('')
  const [confirmError, setConfirmError] = useState('')
  const [serverError, setServerError] = useState('')
  const [successName, setSuccessName] = useState('')

  const pwStrength = password ? getStrength(password) : null

  function handleConfirmBlur() {
    if (confirm && password !== confirm) {
      setConfirmError('비밀번호가 일치하지 않습니다.')
    } else {
      setConfirmError('')
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    let valid = true

    setNameError('')
    setPwError('')
    setConfirmError('')
    setServerError('')

    if (!name.trim()) {
      setNameError('이름을 입력해주세요.')
      valid = false
    }

    if (!password) {
      setPwError('비밀번호를 입력해주세요.')
      valid = false
    } else if (password.length < 8) {
      setPwError('비밀번호는 8자 이상이어야 합니다.')
      valid = false
    } else if (!/[a-zA-Z]/.test(password) || !/[0-9]/.test(password) || !/[^a-zA-Z0-9]/.test(password)) {
      setPwError('영문·숫자·특수문자를 모두 포함해야 합니다.')
      valid = false
    }

    if (password && confirm !== password) {
      setConfirmError('비밀번호가 일치하지 않습니다.')
      valid = false
    }

    if (!valid) return

    // mock success
    setSuccessName(name.trim())
    setView('success')
  }

  if (view === 'expired') {
    return (
      <>
        <a href="#main" className={styles.skipLink}>본문으로 건너뛰기</a>
        <div className={styles.card} id="main">
          <BrandMark />
          <div
            className={`${styles.stateBanner} ${styles.stateBannerError}`}
            role="alert"
            tabIndex={-1}
          >
            <div className={styles.stateBannerIcon}>
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="10" />
                <polyline points="12 6 12 12 16 14" />
              </svg>
            </div>
            <h2 className={styles.stateBannerTitle}>초대 링크가 만료됐습니다</h2>
            <div className={styles.stateBannerDesc}>
              초대 링크는 발송 후 7일간 유효합니다.<br />
              초대를 다시 요청해주세요.
            </div>
          </div>
        </div>
      </>
    )
  }

  if (view === 'already-used') {
    return (
      <>
        <a href="#main" className={styles.skipLink}>본문으로 건너뛰기</a>
        <div className={styles.card} id="main">
          <BrandMark />
          <div
            className={`${styles.stateBanner} ${styles.stateBannerError}`}
            role="alert"
            tabIndex={-1}
          >
            <div className={styles.stateBannerIcon}>
              <svg viewBox="0 0 24 24" focusable="false">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className={styles.stateBannerTitle}>이미 가입이 완료된 링크입니다</h2>
            <div className={styles.stateBannerDesc}>아래 버튼으로 로그인하세요.</div>
          </div>
          <button
            className={styles.submitBtn}
            type="button"
            onClick={() => router.push('/login')}
          >
            로그인 화면으로
          </button>
        </div>
      </>
    )
  }

  if (view === 'success') {
    return (
      <>
        <a href="#main" className={styles.skipLink}>본문으로 건너뛰기</a>
        <div className={styles.card} id="main">
          <BrandMark />
          <div
            className={`${styles.stateBanner} ${styles.stateBannerSuccess}`}
            role="status"
            aria-live="polite"
          >
            <div className={styles.stateBannerIcon}>
              <svg viewBox="0 0 24 24" focusable="false">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>
            <div className={styles.stateBannerTitle}>가입이 완료됐습니다</div>
            <div className={styles.stateBannerDesc}>
              <span>{successName}</span>님, Bari CMS에 오신 걸 환영합니다.<br />
              <span className={styles.roleNote}>{invite.role} 권한으로 로그인하세요.</span>
            </div>
          </div>
          <button
            className={styles.submitBtn}
            type="button"
            onClick={() => router.push('/login')}
          >
            로그인 화면으로
          </button>
        </div>
      </>
    )
  }

  // default: form view
  return (
    <>
      <a href="#signup-form" className={styles.skipLink}>본문으로 건너뛰기</a>
      <div className={styles.card}>
        <BrandMark />

        <div className={styles.inviteBlock}>
          <span className={styles.inviteBy}>{invite.inviter}</span>님이 회원님을 초대했습니다
          <span className={styles.inviteRole}>{invite.role}</span>
          <div className={styles.inviteEmail}>초대 이메일: {invite.email}</div>
        </div>

        {serverError && (
          <div className={styles.serverError} role="alert" aria-live="assertive" aria-atomic="true">
            {serverError}
          </div>
        )}

        <form id="signup-form" onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="full-name">
              이름<span className={styles.required} aria-label="필수">*</span>
            </label>
            <input
              type="text"
              id="full-name"
              className={`${styles.input}${nameError ? ' ' + styles.isError : ''}`}
              placeholder="홍길동"
              autoComplete="name"
              autoFocus
              required
              aria-required="true"
              aria-invalid={!!nameError}
              value={name}
              onChange={e => { setName(e.target.value); setNameError('') }}
            />
            {nameError && (
              <div className={styles.fieldError} aria-live="polite">{nameError}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">
              비밀번호<span className={styles.required} aria-label="필수">*</span>
            </label>
            <input
              type="password"
              id="password"
              className={`${styles.input}${pwError ? ' ' + styles.isError : ''}`}
              placeholder="8자 이상, 영문·숫자·특수문자"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={!!pwError}
              value={password}
              onChange={e => { setPassword(e.target.value); setPwError('') }}
            />
            {pwStrength && (
              <div
                className={styles.pwStrength}
                data-level={pwStrength.level}
                aria-live="polite"
                aria-atomic="true"
              >
                강도: {pwStrength.label}
              </div>
            )}
            {pwError && (
              <div className={styles.fieldError} aria-live="polite">{pwError}</div>
            )}
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="confirm-password">
              비밀번호 확인<span className={styles.required} aria-label="필수">*</span>
            </label>
            <input
              type="password"
              id="confirm-password"
              className={`${styles.input}${confirmError ? ' ' + styles.isError : ''}`}
              placeholder="비밀번호 재입력"
              autoComplete="new-password"
              required
              aria-required="true"
              aria-invalid={!!confirmError}
              aria-describedby="pw-confirm-error"
              value={confirm}
              onChange={e => { setConfirm(e.target.value); setConfirmError('') }}
              onBlur={handleConfirmBlur}
            />
            {confirmError && (
              <div id="pw-confirm-error" className={styles.fieldError} aria-live="polite">
                {confirmError}
              </div>
            )}
          </div>

          <button type="submit" className={styles.submitBtn}>가입 완료</button>
        </form>
      </div>
    </>
  )
}
