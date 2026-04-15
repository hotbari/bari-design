'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { useRouter } from 'next/navigation'
import { AppShell } from '@/components/layout/AppShell'
import { PageHeader } from '@/components/ui/PageHeader'
import { Button } from '@/components/ui/Button'
import { useInviteUser } from '@/hooks/users/useInviteUser'
import { useToast } from '@/components/ui/Toast'
import styles from './invite.module.css'

const BREADCRUMBS = [{ label: '사용자 관리', href: '/users' }, { label: '사용자 초대' }]

const schema = z.object({
  email: z.string().email('올바른 이메일을 입력하세요'),
  role: z.enum(['admin', 'media', 'ops', 'sales']),
  company: z.string().optional(),
})
type FormValues = z.infer<typeof schema>

export default function UserInvitePage() {
  const router = useRouter()
  const { show } = useToast()
  const invite = useInviteUser()
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { role: 'ops' },
  })

  const onSubmit = async (data: FormValues) => {
    await invite.mutateAsync(data)
    show('초대 이메일이 발송되었습니다.')
    router.push('/users')
  }

  return (
    <AppShell breadcrumbs={BREADCRUMBS}>
      <PageHeader title="사용자 초대" desc="이메일로 팀원을 초대합니다." />
      <div className={styles.card}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>이메일</label>
            <input {...register('email')} type="email" className={`${styles.input} ${errors.email ? styles.err : ''}`} placeholder="user@example.com" />
            {errors.email && <p className={styles.errMsg}>{errors.email.message}</p>}
          </div>
          <div className={styles.field}>
            <label className={`${styles.label} ${styles.required}`}>역할</label>
            <select {...register('role')} className={styles.input}>
              <option value="admin">관리자</option>
              <option value="media">매체사</option>
              <option value="ops">운영 대행사</option>
              <option value="sales">영업 대행사</option>
            </select>
          </div>
          <div className={styles.field}>
            <label className={styles.label}>소속 (선택)</label>
            <input {...register('company')} className={styles.input} placeholder="회사명" />
          </div>
          <div className={styles.footer}>
            <Button type="button" variant="secondary" onClick={() => router.push('/users')}>취소</Button>
            <Button type="submit" disabled={isSubmitting}>초대 발송</Button>
          </div>
        </form>
      </div>
    </AppShell>
  )
}
