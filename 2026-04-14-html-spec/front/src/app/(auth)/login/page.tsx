'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import styles from './login.module.css'

const schema = z.object({
  email: z.string().min(1, '이메일을 입력하세요').email('올바른 이메일 형식이 아닙니다'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
  remember: z.boolean().optional(),
})

type FormData = z.infer<typeof schema>

export default function LoginPage() {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) })

  const onSubmit = async (data: FormData) => {
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email, password: data.password }),
      })
      if (res.status === 401) {
        const json = await res.json() as { message: string }
        setError('root', { message: json.message })
        return
      }
      if (!res.ok) {
        setError('root', { message: '로그인 중 오류가 발생했습니다.' })
        return
      }
      router.push('/')
    } catch {
      setError('root', { message: '네트워크 오류가 발생했습니다.' })
    }
  }

  return (
    <>
      <div className={styles.logo}>
        <p className={styles.brand}>Bari DOOH</p>
        <p className={styles.subtitle}>매체 관리 플랫폼</p>
      </div>

      <h1 className={styles.title}>로그인</h1>

      {errors.root && (
        <p className={styles.rootErr} role="alert">{errors.root.message}</p>
      )}

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className={styles.field}>
          <label htmlFor="email" className={styles.label}>이메일</label>
          <input
            id="email"
            type="email"
            autoComplete="email"
            className={`${styles.input}${errors.email ? ` ${styles.error}` : ''}`}
            {...register('email')}
          />
          {errors.email && <span className={styles.errMsg}>{errors.email.message}</span>}
        </div>

        <div className={styles.field}>
          <label htmlFor="password" className={styles.label}>비밀번호</label>
          <div className={styles.passwordWrap}>
            <input
              id="password"
              type={showPassword ? 'text' : 'password'}
              autoComplete="current-password"
              className={`${styles.input}${errors.password ? ` ${styles.error}` : ''}`}
              {...register('password')}
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
          {errors.password && <span className={styles.errMsg}>{errors.password.message}</span>}
        </div>

        <div className={styles.checkRow}>
          <input
            id="remember"
            type="checkbox"
            {...register('remember')}
          />
          <label htmlFor="remember" className={styles.checkLabel}>로그인 상태 유지</label>
        </div>

        <Button
          type="submit"
          variant="primary"
          className={styles.submit}
          disabled={isSubmitting}
        >
          {isSubmitting ? '로그인 중...' : '로그인'}
        </Button>
      </form>
    </>
  )
}
