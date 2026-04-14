'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { userInviteSchema, type UserInvite } from '@/types/user'
import { useInviteUser } from '@/hooks/users/useUsers'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import pageStyles from '../users.module.css'
import styles from './invite.module.css'

export default function UserInvitePage() {
  const router = useRouter()
  const mutation = useInviteUser()
  const { add } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<UserInvite>({
    resolver: zodResolver(userInviteSchema),
    defaultValues: { role: 'operator' },
  })

  return (
    <div className={pageStyles.page}>
      <h1 className={pageStyles.title}>사용자 초대</h1>
      <form
        className={styles.form}
        onSubmit={handleSubmit((data) => mutation.mutate(data, {
          onSuccess: () => { add('초대 이메일이 발송되었습니다', 'success'); router.push('/users') },
          onError: () => add('초대 실패', 'error'),
        }))}
      >
        <div className={styles.field}>
          <label htmlFor="invite-name" className={styles.label}>이름 *</label>
          <input id="invite-name" className={styles.input} {...register('name')} placeholder="홍길동" />
          {errors.name && <span className={styles.error}>{errors.name.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="invite-email" className={styles.label}>이메일 *</label>
          <input id="invite-email" className={styles.input} type="email" {...register('email')} placeholder="user@example.com" />
          {errors.email && <span className={styles.error}>{errors.email.message}</span>}
        </div>
        <div className={styles.field}>
          <label htmlFor="invite-role" className={styles.label}>역할</label>
          <select id="invite-role" className={styles.input} {...register('role')}>
            <option value="admin">관리자</option>
            <option value="operator">운영자</option>
            <option value="agency">대행사</option>
          </select>
        </div>
        <div className={styles.actions}>
          <Button type="submit" loading={mutation.isPending}>초대 보내기</Button>
        </div>
      </form>
    </div>
  )
}
