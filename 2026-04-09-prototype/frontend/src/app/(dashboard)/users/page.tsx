'use client'
import { useRouter } from 'next/navigation'
import { useUsers } from '@/hooks/users/useUsers'
import { UserTable } from '@/components/domain/users/UserTable'
import { Button } from '@/components/ui/Button'
import styles from './users.module.css'

export default function UsersPage() {
  const router = useRouter()
  const { data: users, isLoading } = useUsers()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>사용자 관리</h1>
        <Button onClick={() => router.push('/users/invite')}>+ 사용자 초대</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <UserTable users={users ?? []} />}
    </div>
  )
}
