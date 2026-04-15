'use client'

import { useState, useEffect } from 'react'
import styles from './page.module.css'

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [hasInviteToken, setHasInviteToken] = useState(false)
  const [remember, setRemember] = useState(false)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    setHasInviteToken(!!params.get('token'))
  }, [])

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const form = e.currentTarget
    const email = (form.elements.namedItem('email') as HTMLInputElement).value.trim()
    const password = (form.elements.namedItem('password') as HTMLInputElement).value

    if (!email || !password) {
      setError('이메일과 비밀번호를 입력해주세요.')
      return
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError('올바른 이메일 형식을 입력해주세요.')
      return
    }

    // mock: always fail for demo
    setError('이메일 또는 비밀번호가 올바르지 않습니다.')
  }

  return (
    <>
      <a href="#login-form" className={styles.skipLink}>본문으로 건너뛰기</a>

      <div className={styles.card}>
        <div className={styles.brand} aria-hidden="true">
          <div className={styles.brandMark}>
            <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
              <rect x="4" y="3" width="10" height="18" rx="2" />
              <path d="M14 7h3a2 2 0 0 1 0 4h-3M14 11h4a2 2 0 0 1 0 4h-4" />
            </svg>
          </div>
          <div className={styles.brandName}>Bari CMS</div>
          <div className={styles.brandSub}>DOOH 광고 관리 플랫폼</div>
        </div>

        {hasInviteToken && (
          <div className={styles.inviteBlock}>
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>초대 링크로 접속하셨습니다. 로그인 후 팀에 합류하세요.</span>
          </div>
        )}

        {error && (
          <div className={styles.errorBanner} role="alert" aria-live="assertive" aria-atomic="true">
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="12" r="10" />
              <line x1="12" y1="8" x2="12" y2="12" />
              <line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        <form id="login-form" onSubmit={handleSubmit} noValidate>
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">이메일</label>
            <input
              type="email"
              id="email"
              name="email"
              className={`${styles.input}${error ? ' ' + styles.isError : ''}`}
              placeholder="name@company.kr"
              autoComplete="email"
              autoFocus
              required
              aria-required="true"
              onChange={() => error && setError('')}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="password">비밀번호</label>
            <div className={styles.inputWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                name="password"
                className={`${styles.input} ${styles.inputWithToggle}${error ? ' ' + styles.isError : ''}`}
                placeholder="비밀번호 입력"
                autoComplete="current-password"
                required
                aria-required="true"
                onChange={() => error && setError('')}
              />
              <button
                type="button"
                className={styles.eyeToggle}
                onClick={() => setShowPassword(v => !v)}
                aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 표시'}
              >
                {showPassword ? (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                    <line x1="1" y1="1" x2="23" y2="23" />
                  </svg>
                ) : (
                  <svg viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                    <circle cx="12" cy="12" r="3" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <label className={styles.checkRow}>
            <input
              type="checkbox"
              checked={remember}
              onChange={e => setRemember(e.target.checked)}
            />
            로그인 상태 유지
          </label>

          <button type="submit" className={styles.submitBtn}>
            로그인
          </button>
        </form>

        <div className={styles.footer}>계정 문의: 담당 관리자에게 연락하세요</div>
      </div>
    </>
  )
}
