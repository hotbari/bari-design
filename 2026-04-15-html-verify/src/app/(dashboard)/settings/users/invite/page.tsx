'use client'
import { useState } from 'react'
import { useMutation } from '@tanstack/react-query'
import Link from 'next/link'
import { UserRole } from '@/types/user'
import styles from './page.module.css'

type SalesScope = 'all' | 'own'

const ROLE_LABEL: Record<UserRole, string> = {
  admin: '어드민',
  media: '매체사',
  ops: '운영대행사',
  sales: '영업대행사',
}

const ROLE_DESC: Record<UserRole, string> = {
  admin: '전체 시스템 관리 권한 (주의)',
  media: '자사 매체 관리, 사용자 초대 가능',
  ops: '부여된 매체/그룹 운영 대행',
  sales: '소재 도메인 접근만 허용',
}

const SCOPE_SUBTITLE: Record<UserRole, string> = {
  ops: '운영대행사가 접근할 수 있는 매체 또는 그룹을 선택하세요',
  sales: '영업대행사가 접근할 수 있는 소재 범위를 설정하세요',
  media: '매체사 역할의 권한 범위 안내',
  admin: '어드민 권한 주의 사항',
}

async function postInvite(body: object) {
  const res = await fetch('/api/users/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error('Failed to send invite')
  return res.json()
}

export default function UserInvitePage() {
  const [email, setEmail] = useState('')
  const [emailError, setEmailError] = useState('')
  const [role, setRole] = useState<UserRole>('ops')
  const [company, setCompany] = useState('')
  const [salesScope, setSalesScope] = useState<SalesScope>('all')
  const [success, setSuccess] = useState<{ email: string; role: UserRole } | null>(null)

  const mutation = useMutation({
    mutationFn: postInvite,
    onSuccess: () => setSuccess({ email, role }),
  })

  function validateEmail(val: string) {
    if (!val) { setEmailError('이메일 주소를 입력해주세요'); return false }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)) { setEmailError('올바른 이메일 형식을 입력해주세요'); return false }
    setEmailError('')
    return true
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!validateEmail(email)) return
    if (role !== 'admin' && !company) { return }
    mutation.mutate({ email, role, company: role === 'admin' ? '' : company, salesScope: role === 'sales' ? salesScope : undefined })
  }

  function handleSendAnother() {
    setSuccess(null)
    setEmail('')
    setEmailError('')
    setCompany('')
    setSalesScope('all')
  }

  const ROLES: UserRole[] = ['media', 'ops', 'sales', 'admin']

  return (
    <>
      <header className={styles.gnb}>
        <nav className={styles.breadcrumb} aria-label="현재 위치">
          <Link href="/settings/users" className={styles.breadcrumbLink}>사용자 관리</Link>
          <span className={styles.breadcrumbSep}>›</span>
          <span className={styles.breadcrumbCurrent}>사용자 초대</span>
        </nav>
      </header>

      <main className={styles.page}>
        <div className={styles.pageHeader}>
          <h1 className={styles.pageTitle}>사용자 초대</h1>
          <p className={styles.pageSubtitle}>이메일로 초대장을 발송합니다. 초대는 7일간 유효합니다.</p>
        </div>

        {success && (
          <div className={styles.successBanner} aria-live="polite">
            <div className={styles.successIcon}>
              <svg viewBox="0 0 18 18" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <polyline points="3,9 7,14 15,5"/>
              </svg>
            </div>
            <div className={styles.successText}>
              <div className={styles.successTitle}>{success.email}에 초대장을 발송했습니다</div>
              <div className={styles.successBody}>역할: {ROLE_LABEL[success.role]} · 유효기간: 7일</div>
            </div>
            <button className="btn btn-secondary" style={{ fontSize: 'var(--text-xs)', padding: '6px 14px' }} onClick={handleSendAnother}>
              추가 초대
            </button>
          </div>
        )}

        {!success && (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.inviteLayout}>
              {/* Left: form */}
              <div className={styles.formCol}>
                {/* Card 1: 초대 정보 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <div className={styles.formCardHeaderIcon}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                        <path d="M2 13c0-2.76 2.24-5 5-5h2c2.76 0 5 2.24 5 5"/>
                        <circle cx="8" cy="5" r="3"/>
                      </svg>
                    </div>
                    <div>
                      <div className={styles.formCardTitle}>초대 정보</div>
                      <div className={styles.formCardSubtitle}>초대할 사용자의 이메일과 역할을 입력하세요</div>
                    </div>
                  </div>
                  <div className={styles.formCardBody}>
                    {/* Email */}
                    <div className={styles.formField}>
                      <label className={styles.formLabel} htmlFor="invite-email">
                        이메일 주소 <span className={styles.requiredMark}>*</span>
                      </label>
                      <input
                        id="invite-email"
                        type="email"
                        className={`${styles.formInput} ${emailError ? styles.formInputError : ''}`}
                        placeholder="example@company.com"
                        value={email}
                        onChange={e => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value) }}
                        autoComplete="email"
                      />
                      {emailError && (
                        <div className={styles.fieldError}>
                          <svg width="12" height="12" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                            <circle cx="8" cy="8" r="7"/><path d="M8 5v4M8 12v.01"/>
                          </svg>
                          {emailError}
                        </div>
                      )}
                    </div>

                    {/* Role */}
                    <div className={styles.formField}>
                      <span className={styles.formLabel}>역할 <span className={styles.requiredMark}>*</span></span>
                      <div className={styles.roleCards} role="radiogroup" aria-label="역할 선택">
                        {ROLES.map(r => (
                          <label key={r} className={`${styles.roleCard} ${role === r ? styles.roleCardSelected : ''}`}>
                            <input type="radio" name="invite-role" value={r} checked={role === r} onChange={() => setRole(r)} />
                            <div className={styles.roleCardName}>{ROLE_LABEL[r]}</div>
                            <div className={styles.roleCardDesc}>{ROLE_DESC[r]}</div>
                          </label>
                        ))}
                      </div>
                    </div>

                    {/* Company (non-admin) */}
                    {role !== 'admin' && (
                      <div className={styles.formField}>
                        <label className={styles.formLabel} htmlFor="invite-company">
                          소속 매체사 <span className={styles.requiredMark}>*</span>
                        </label>
                        <select
                          id="invite-company"
                          className={styles.formSelect}
                          value={company}
                          onChange={e => setCompany(e.target.value)}
                        >
                          <option value="">매체사를 선택하세요</option>
                          <option value="hanbit">한빛미디어 (매체 8개)</option>
                          <option value="seoul-oa">서울옥외광고 (매체 5개)</option>
                          <option value="digital">디지털사이니지 (매체 3개)</option>
                        </select>
                      </div>
                    )}
                  </div>
                </div>

                {/* Card 2: 권한 범위 설정 */}
                <div className={styles.formCard}>
                  <div className={styles.formCardHeader}>
                    <div className={styles.formCardHeaderIcon}>
                      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                        <path d="M9 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7"/><path d="M7 9l5-5M10 2h4v4"/>
                      </svg>
                    </div>
                    <div>
                      <div className={styles.formCardTitle}>권한 범위 설정</div>
                      <div className={styles.formCardSubtitle}>{SCOPE_SUBTITLE[role]}</div>
                    </div>
                  </div>
                  <div className={styles.formCardBody}>
                    {role === 'ops' && (
                      <div className={styles.formField}>
                        <span className={styles.formLabel}>접근 가능 매체/그룹</span>
                        <span className={styles.formHint}>선택하지 않으면 해당 매체사의 전체 매체에 접근할 수 있습니다.</span>
                        <div className={styles.checkList}>
                          {[
                            { id: 'a101', label: '강남대로 전광판', sub: 'A-101 · LED' },
                            { id: 'b205', label: '홍대입구 사이니지', sub: 'B-205 · LED' },
                            { id: 'c017', label: '신촌역 디스플레이', sub: 'C-017 · LCD' },
                            { id: 'd304', label: '여의도 IFC 전광판', sub: 'D-304 · LED' },
                          ].map(item => (
                            <label key={item.id} className={styles.checkItem}>
                              <input type="checkbox" />
                              <span className={styles.checkLabel}>{item.label}</span>
                              <span className={styles.checkSub}>{item.sub}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                    )}
                    {role === 'sales' && (
                      <div className={styles.formField}>
                        <span className={styles.formLabel}>소재 접근 범위</span>
                        <div className={styles.radioList}>
                          <label className={styles.radioItem}>
                            <input type="radio" name="sales-scope" value="all" checked={salesScope === 'all'} onChange={() => setSalesScope('all')} />
                            <div>
                              <div className={styles.radioLabel}>전체 소재</div>
                              <div className={styles.radioDesc}>소속 매체사의 모든 소재에 접근 가능</div>
                            </div>
                          </label>
                          <label className={styles.radioItem}>
                            <input type="radio" name="sales-scope" value="own" checked={salesScope === 'own'} onChange={() => setSalesScope('own')} />
                            <div>
                              <div className={styles.radioLabel}>본인 등록 소재만</div>
                              <div className={styles.radioDesc}>본인이 직접 등록한 소재만 접근 가능</div>
                            </div>
                          </label>
                        </div>
                      </div>
                    )}
                    {role === 'media' && (
                      <div className={styles.scopeInfo}>
                        매체사 역할은 소속 매체사의 전체 매체에 자동으로 접근합니다. 추가 범위 설정이 필요하지 않습니다.
                      </div>
                    )}
                    {role === 'admin' && (
                      <div className={styles.scopeWarning}>
                        ⚠️ 어드민 계정은 모든 매체사와 기능에 접근할 수 있습니다. 신중하게 초대하세요.
                      </div>
                    )}
                  </div>
                </div>

                {/* Footer */}
                <div className={styles.formFooter}>
                  <Link href="/settings/users" className="btn btn-secondary">취소</Link>
                  <button type="submit" className="btn btn-primary" disabled={mutation.isPending}>
                    <svg width="14" height="14" viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                      <path d="M2 8l5 5 7-9"/>
                    </svg>
                    {mutation.isPending ? '발송 중...' : '초대장 발송'}
                  </button>
                </div>
              </div>

              {/* Right: info panels */}
              <div className={styles.rightCol}>
                <div className={styles.infoPanel}>
                  <div className={styles.infoPanelHeader}>초대 방식 안내</div>
                  <div className={styles.infoList}>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <path d="M14 2H2v12h12zM2 6h12M6 6v8"/>
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoTextTitle}>초대 이메일 발송</div>
                        <div className={styles.infoTextBody}>입력한 이메일로 가입 링크가 포함된 초대 메일이 발송됩니다.</div>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <circle cx="8" cy="8" r="7"/><path d="M8 4v5l3 2"/>
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoTextTitle}>유효기간 7일</div>
                        <div className={styles.infoTextBody}>초대 링크는 발송 후 7일간 유효합니다. 만료 시 재발송할 수 있습니다.</div>
                      </div>
                    </div>
                    <div className={styles.infoItem}>
                      <div className={styles.infoIcon}>
                        <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round">
                          <path d="M9 2H3a1 1 0 0 0-1 1v10a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V7"/><path d="M7 9l5-5M10 2h4v4"/>
                        </svg>
                      </div>
                      <div>
                        <div className={styles.infoTextTitle}>역할 자동 부여</div>
                        <div className={styles.infoTextBody}>가입 완료 시 지정한 역할과 소속 매체사가 자동으로 설정됩니다.</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={styles.roleInfoPanel}>
                  <div className={styles.roleInfoHeader}>역할별 권한</div>
                  <div className={styles.roleInfoBody}>
                    <div className={styles.roleInfoRow}>
                      <div className={`${styles.roleInfoName} ${styles.roleAdminText}`}>어드민</div>
                      <div className={styles.roleInfoDesc}>전체 매체사·매체·사용자 관리. 시스템 설정 접근</div>
                    </div>
                    <div className={styles.roleInfoRow}>
                      <div className={`${styles.roleInfoName} ${styles.roleMediaText}`}>매체사</div>
                      <div className={styles.roleInfoDesc}>소속 매체 관리, 운영/영업대행사 초대, 캠페인·편성 관리</div>
                    </div>
                    <div className={styles.roleInfoRow}>
                      <div className={`${styles.roleInfoName} ${styles.roleOpsText}`}>운영대행사</div>
                      <div className={styles.roleInfoDesc}>부여된 매체/그룹 운영 대행. 소재·캠페인·편성 관리</div>
                    </div>
                    <div className={styles.roleInfoRow}>
                      <div className={`${styles.roleInfoName} ${styles.roleSalesText}`}>영업대행사</div>
                      <div className={styles.roleInfoDesc}>소재 도메인만 접근. 소재 등록·검수 확인</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        )}
      </main>
    </>
  )
}
