# Task 9: 인증 도메인 (2 routes)

`(auth)/layout.tsx`는 Task 0에서 생성 완료. 여기서는 페이지 2개만 구현.

**Files:**
- Create: `src/app/(auth)/login/page.tsx`
- Create: `src/app/(auth)/login/login.module.css`
- Create: `src/app/(auth)/signup/complete/page.tsx`

---

- [ ] **Step 1: 로그인 페이지**

`src/app/(auth)/login/login.module.css`:
```css
.card {
  width: 400px;
  background: white;
  border-radius: var(--radius-xl);
  padding: 40px;
  box-shadow: 0 4px 24px oklch(0 0 0 / 0.08);
  display: flex;
  flex-direction: column;
  gap: 24px;
}
.logo { font-size: 22px; font-weight: 700; color: var(--color-primary-600); text-align: center; }
.title { font-size: 18px; font-weight: 600; color: var(--color-neutral-900); text-align: center; margin: 0; }
.form { display: flex; flex-direction: column; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input {
  padding: 10px 14px;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  outline: none;
  transition: border-color 0.15s;
}
.input:focus { border-color: var(--color-primary-500); }
.error { font-size: var(--text-xs); color: var(--color-error-500); }
.submit { width: 100%; justify-content: center; }
.footer { text-align: center; font-size: var(--text-xs); color: var(--color-neutral-500); }
```

`src/app/(auth)/login/page.tsx`:
```tsx
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
    // MSW 미구현 — 프로토타입에서는 바로 대시보드로 이동
    router.push('/')
  }

  return (
    <div className={styles.card}>
      <p className={styles.logo}>Bari CMS</p>
      <h1 className={styles.title}>로그인</h1>
      <form className={styles.form} onSubmit={handleSubmit(onSubmit)}>
        <div className={styles.field}>
          <label className={styles.label}>이메일</label>
          <input className={styles.input} type="email" {...register('email')} placeholder="user@bari.io" autoComplete="email" />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>비밀번호</label>
          <input className={styles.input} type="password" {...register('password')} placeholder="••••••••" autoComplete="current-password" />
          {errors.password && <span className={styles.error}>{errors.password.message}</span>}
        </div>
        <Button type="submit" className={styles.submit} loading={isSubmitting}>로그인</Button>
      </form>
      <p className={styles.footer}>계정이 없으신가요? 관리자에게 문의하세요.</p>
    </div>
  )
}
```

- [ ] **Step 2: 회원가입 완료 페이지**

`src/app/(auth)/signup/complete/page.tsx`:
```tsx
import Link from 'next/link'

export default function SignupCompletePage() {
  return (
    <div style={{
      width: '400px',
      background: 'white',
      borderRadius: 'var(--radius-xl)',
      padding: '48px 40px',
      boxShadow: '0 4px 24px oklch(0 0 0 / 0.08)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '20px',
      textAlign: 'center',
    }}>
      <div style={{ width: '56px', height: '56px', borderRadius: '50%', background: 'var(--color-primary-100)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px' }}>
        ✓
      </div>
      <div>
        <h1 style={{ fontSize: '18px', fontWeight: 600, color: 'var(--color-neutral-900)', margin: '0 0 8px' }}>
          가입이 완료되었습니다
        </h1>
        <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', margin: 0 }}>
          관리자 승인 후 서비스를 이용하실 수 있습니다.
        </p>
      </div>
      <Link
        href="/login"
        style={{
          display: 'inline-flex',
          padding: '8px 20px',
          background: 'var(--color-primary-500)',
          color: 'white',
          borderRadius: 'var(--radius-md)',
          fontSize: 'var(--text-sm)',
          fontWeight: 500,
          textDecoration: 'none',
        }}
      >
        로그인 화면으로
      </Link>
    </div>
  )
}
```

- [ ] **Step 3: 브라우저 확인**

```
/login           → 카드 레이아웃 (사이드바 없음), 폼 제출 시 / 이동
/signup/complete → 완료 카드, "로그인 화면으로" 링크
```

- [ ] **Step 4: 커밋**

```bash
git add src/app/(auth)/login/ src/app/(auth)/signup/
git commit -m "feat(auth): 로그인·회원가입 완료 페이지 구현"
```
