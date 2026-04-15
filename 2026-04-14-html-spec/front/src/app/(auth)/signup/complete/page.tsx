'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import styles from './signup.module.css'

const schema = z.object({
  name: z.string().min(1, '이름을 입력하세요'),
  password: z.string().min(6, '비밀번호는 6자 이상이어야 합니다'),
  passwordConfirm: z.string().min(1, '비밀번호 확인을 입력하세요'),
}).refine(data => data.password === data.passwordConfirm, {
  message: '비밀번호가 일치하지 않습니다',
  path: ['passwordConfirm'],
})

type FormData = z.infer<typeof schema>

type Strength = 'weak' | 'medium' | 'strong'

function getStrength(pw: string): Strength | null {
  if (!pw) return null
  if (pw.length < 6) return 'weak'
  if (pw.length < 10) return 'medium'
  return 'strong'
}

const strengthLabels: Record<Strength, string> = {
  weak: '약함',
  medium: '보통',
  strong: '강함',
}

const strengthSegmentCount: Record<Strength, number> = {
  weak: 1,
  medium: 2,
  strong: 3,
}

export default function SignupCompletePage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [passwordValue, setPasswordValue] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const strength = getStrength(passwordValue)

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: data.name, password: data.password }),
      })
      if (!res.ok) return
      router.push('/login')
    } catch {
      // network error — silent fail for now
    }
  }

  const passwordProps = register('password', {
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => setPasswordValue(e.target.value),
  })

  return (
    <>
      <div className={styles.logo}>
        <p className={styles.brand}>Bari DOOH</p>
        <p className={styles.subtitle}>매체 관리 플랫폼</p>
      </div>

      <h1 className={styles.title}>가입 완료 설정</h1>

      <div className={styles.inviteBlock}>
        <p className={styles.inviteTitle}>초대 정보</p>
        <p className={styles.inviteInfo}>초대 조직: Bari 미디어</p>
        <p className={styles.inviteInfo}>역할: 운영 대행사</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.field}>
          <label htmlFor="name" className={styles.label}>이름</label>
          <input
            id="name"
            type="text"
            autoComplete="name"
            className={`${styles.input}${errors.name ? ` ${styles.error}` : ''}`}
            {...register('name')}
          />
          {errors.name && <span className={styles.errMsg}>{errors.name.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <div className={styles.passwordWrap}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${styles.input}${errors.password ? ` ${styles.error}` : ''}`}
              {...passwordProps}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? '비밀번호 숨기기' : '비밀번호 보기'}
            >
              {showPassword ? '숨김' : '표시'}
            </button>
          </div>
          {strength && (
            <>
              <div className={styles.strengthBar}>
                {[0, 1, 2].map(i => (
                  <div
                    key={i}
                    className={`${styles.strengthSegment}${i < strengthSegmentCount[strength] ? ` ${styles.active} ${styles[strength]}` : ''}`}
                  />
                ))}
              </div>
              <span className={`${styles.strengthLabel} ${styles[strength]}`}>
                {strengthLabels[strength]}
              </span>
            </>
          )}
          {errors.password && <span className={styles.errMsg}>{errors.password.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="passwordConfirm" className={styles.label}>비밀번호 확인</label>
          <div className={styles.passwordWrap}>
            <input
              id="passwordConfirm"
              type={showConfirm ? 'text' : 'password'}
              autoComplete="new-password"
              className={`${styles.input}${errors.passwordConfirm ? ` ${styles.error}` : ''}`}
              {...register('passwordConfirm')}
            />
            <button
              type="button"
              className={styles.eyeBtn}
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? '비밀번호 확인 숨기기' : '비밀번호 확인 보기'}
            >
              {showConfirm ? '숨김' : '표시'}
            </button>
          </div>
          {errors.passwordConfirm && (
            <span className={styles.errMsg}>{errors.passwordConfirm.message}</span>
          )}
        </div>

        <Button
          type="submit"
          variant="primary"
          className={styles.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '처리 중...' : '가입 완료'}
        </Button>
      </form>
    </>
  )
}
