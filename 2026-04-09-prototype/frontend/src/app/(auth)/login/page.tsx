'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import styles from './login.module.css'

const loginSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  password: z.string().min(1, '비밀번호를 입력하세요'),
})
type LoginInput = z.infer<typeof loginSchema>

export default function LoginPage() {
  const router = useRouter()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  })

  function onSubmit(_data: LoginInput) {
    router.push('/')
  }

  return (
    <div className={styles.card}>
      <p className={styles.logo}>Bari CMS</p>
      <h1 className={styles.title}>로그인</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label htmlFor="login-email" className={styles.label}>이메일</label>
          <input id="login-email" className={styles.input} type="email" {...register('email')} placeholder="user@bari.io" autoComplete="email" />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="login-password" className={styles.label}>비밀번호</label>
          <input id="login-password" className={styles.input} type="password" {...register('password')} placeholder="••••••••" autoComplete="current-password" />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        <Button type="submit" className={styles.submit} loading={isSubmitting}>로그인</Button>
      </form>
      <p className={styles.footer}>계정이 없으신가요? 관리자에게 문의하세요.</p>
    </div>
  )
}
