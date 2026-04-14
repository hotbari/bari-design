# Task 8: 유저/시스템 도메인 (5 routes)

**Files:**
- Modify: `src/mocks/handlers/users.ts` (POST 추가)
- Create: `src/hooks/users/useUsers.ts`
- Create: `src/components/domain/users/UserRoleBadge.tsx`
- Create: `src/components/domain/users/UserTable.tsx`
- Create: `src/app/(dashboard)/users/users.module.css`
- Create: `src/app/(dashboard)/users/page.tsx`
- Create: `src/app/(dashboard)/users/invite/page.tsx`
- Create: `src/app/(dashboard)/settings/settings.module.css`
- Create: `src/app/(dashboard)/settings/profile/page.tsx`
- Create: `src/app/(dashboard)/settings/notifications/page.tsx`
- Create: `src/app/(dashboard)/settings/system/page.tsx`

---

- [ ] **Step 1: users 핸들러 업데이트**

`src/mocks/handlers/users.ts`:
```ts
import { http, HttpResponse } from 'msw'
import users from '../fixtures/users.json'

let data = [...users]

export const userHandlers = [
  http.get('/api/users', () => HttpResponse.json(data)),
  http.post('/api/users/invite', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newUser = { id: `usr-${Date.now()}`, ...body }
    data = [...data, newUser as typeof data[0]]
    return HttpResponse.json(newUser, { status: 201 })
  }),
]
```

- [ ] **Step 2: useUsers 훅**

`src/hooks/users/useUsers.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { User, UserInvite } from '@/types/user'

const QUERY_KEY = ['users'] as const

async function fetchUsers(): Promise<User[]> {
  const res = await fetch('/api/users')
  if (!res.ok) throw new Error('사용자 목록 조회 실패')
  return res.json()
}

async function inviteUser(input: UserInvite): Promise<User> {
  const res = await fetch('/api/users/invite', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('초대 실패')
  return res.json()
}

export function useUsers() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchUsers })
}

export function useInviteUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: inviteUser,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

- [ ] **Step 3: UserRoleBadge + UserTable**

`src/components/domain/users/UserRoleBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { User } from '@/types/user'

const labelMap: Record<User['role'], string> = {
  admin: '관리자', operator: '운영자', agency: '대행사',
}
const variantMap: Record<User['role'], 'success' | 'warning' | 'neutral'> = {
  admin: 'success', operator: 'warning', agency: 'neutral',
}

export function UserRoleBadge({ role }: { role: User['role'] }) {
  return <Badge variant={variantMap[role]}>{labelMap[role]}</Badge>
}
```

`src/components/domain/users/UserTable.tsx`:
```tsx
import { Table, type Column } from '@/components/ui/Table'
import { UserRoleBadge } from './UserRoleBadge'
import type { User } from '@/types/user'

const columns: Column<User>[] = [
  { key: 'name', header: '이름', render: (r) => r.name },
  { key: 'email', header: '이메일', render: (r) => r.email },
  { key: 'role', header: '역할', render: (r) => <UserRoleBadge role={r.role} />, width: '90px' },
]

export function UserTable({ users }: { users: User[] }) {
  return <Table columns={columns} rows={users} keyExtractor={(r) => r.id} />
}
```

- [ ] **Step 4: 사용자 목록 페이지**

`src/app/(dashboard)/users/users.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/users/page.tsx`:
```tsx
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
```

- [ ] **Step 5: 사용자 초대 페이지 (user-invite.html)**

`src/app/(dashboard)/users/invite/page.tsx`:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { userInviteSchema, type UserInvite } from '@/types/user'
import { useInviteUser } from '@/hooks/users/useUsers'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../users.module.css'

const fieldStyle = { display: 'flex', flexDirection: 'column' as const, gap: '6px' }
const labelStyle = { fontSize: 'var(--text-sm)', fontWeight: 500, color: 'var(--color-neutral-700)' }
const inputStyle = { padding: '8px 12px', border: '1px solid var(--color-neutral-300)', borderRadius: 'var(--radius-md)', fontSize: 'var(--text-sm)', fontFamily: 'var(--font-sans)', outline: 'none' }
const errorStyle = { fontSize: 'var(--text-xs)', color: 'var(--color-error-500)' }

export default function UserInvitePage() {
  const router = useRouter()
  const mutation = useInviteUser()
  const { add } = useToast()
  const { register, handleSubmit, formState: { errors } } = useForm<UserInvite>({
    resolver: zodResolver(userInviteSchema),
    defaultValues: { role: 'operator' },
  })

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>사용자 초대</h1>
      <form
        onSubmit={handleSubmit((data) => mutation.mutate(data, {
          onSuccess: () => { add('초대 이메일이 발송되었습니다', 'success'); router.push('/users') },
          onError: () => add('초대 실패', 'error'),
        }))}
        style={{ display: 'flex', flexDirection: 'column', gap: '20px', maxWidth: '480px' }}
      >
        <div style={fieldStyle}>
          <label style={labelStyle}>이름 *</label>
          <input style={inputStyle} {...register('name')} placeholder="홍길동" />
          {errors.name && <span style={errorStyle}>{errors.name.message}</span>}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>이메일 *</label>
          <input style={inputStyle} type="email" {...register('email')} placeholder="user@example.com" />
          {errors.email && <span style={errorStyle}>{errors.email.message}</span>}
        </div>
        <div style={fieldStyle}>
          <label style={labelStyle}>역할</label>
          <select style={inputStyle} {...register('role')}>
            <option value="admin">관리자</option>
            <option value="operator">운영자</option>
            <option value="agency">대행사</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="submit" loading={mutation.isPending}>초대 보내기</Button>
        </div>
      </form>
    </div>
  )
}
```

- [ ] **Step 6: 설정 페이지들**

`src/app/(dashboard)/settings/settings.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 24px; max-width: 640px; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
.section { display: flex; flex-direction: column; gap: 16px; }
.sectionTitle { font-size: var(--text-sm); font-weight: 600; color: var(--color-neutral-700); margin: 0; padding-bottom: 8px; border-bottom: 1px solid var(--color-neutral-200); }
.row { display: flex; align-items: center; justify-content: space-between; padding: 12px 0; border-bottom: 1px solid var(--color-neutral-100); }
.rowLabel { font-size: var(--text-sm); color: var(--color-neutral-800); }
.rowSub { font-size: var(--text-xs); color: var(--color-neutral-500); margin-top: 2px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input { padding: 8px 12px; border: 1px solid var(--color-neutral-300); border-radius: var(--radius-md); font-size: var(--text-sm); font-family: var(--font-sans); background: white; outline: none; }
.input:focus { border-color: var(--color-primary-500); }
```

`src/app/(dashboard)/settings/profile/page.tsx` (my-profile.html):
```tsx
'use client'
import { Button } from '@/components/ui/Button'
import styles from '../settings.module.css'

export default function ProfilePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>내 프로필</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>기본 정보</h2>
        <div className={styles.field}>
          <label className={styles.label}>이름</label>
          <input className={styles.input} defaultValue="김관리" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>이메일</label>
          <input className={styles.input} type="email" defaultValue="kim@bari.io" disabled style={{ background: 'var(--color-neutral-50)', color: 'var(--color-neutral-500)' }} />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button>저장</Button>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>비밀번호 변경</h2>
        <div className={styles.field}>
          <label className={styles.label}>현재 비밀번호</label>
          <input className={styles.input} type="password" />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>새 비밀번호</label>
          <input className={styles.input} type="password" />
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button variant="secondary">비밀번호 변경</Button>
        </div>
      </section>
    </div>
  )
}
```

`src/app/(dashboard)/settings/notifications/page.tsx` (notification-center.html):
```tsx
'use client'
import { Toggle } from '@/components/ui/Toggle'
import styles from '../settings.module.css'

const notificationSettings = [
  { id: 'n1', label: '편성 동기화 오류', sub: '동기화 지연 또는 실패 시 알림', defaultOn: true },
  { id: 'n2', label: '소재 검수 결과', sub: '소재 승인/반려 시 알림', defaultOn: true },
  { id: 'n3', label: '캠페인 상태 변경', sub: '캠페인 시작/종료 시 알림', defaultOn: false },
  { id: 'n4', label: '잔여 슬롯 부족', sub: '잔여 슬롯 10% 미만 시 알림', defaultOn: true },
]

export default function NotificationsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>알림 설정</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>알림 항목</h2>
        {notificationSettings.map((n) => (
          <div key={n.id} className={styles.row}>
            <div>
              <p className={styles.rowLabel}>{n.label}</p>
              <p className={styles.rowSub}>{n.sub}</p>
            </div>
            <Toggle defaultChecked={n.defaultOn} onChange={() => {}} />
          </div>
        ))}
      </section>
    </div>
  )
}
```

`src/app/(dashboard)/settings/system/page.tsx` (system-settings.html):
```tsx
import styles from '../settings.module.css'
import { Button } from '@/components/ui/Button'

export default function SystemSettingsPage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>시스템 설정</h1>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>일반</h2>
        <div className={styles.field}>
          <label className={styles.label}>기본 시간대</label>
          <select className={styles.input}>
            <option value="Asia/Seoul">Asia/Seoul (UTC+9)</option>
            <option value="UTC">UTC</option>
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>기본 언어</label>
          <select className={styles.input}>
            <option value="ko">한국어</option>
            <option value="en">English</option>
          </select>
        </div>
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button>저장</Button>
        </div>
      </section>
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>동기화</h2>
        <div className={styles.row}>
          <div>
            <p className={styles.rowLabel}>자동 동기화 간격</p>
            <p className={styles.rowSub}>편성 데이터를 매체에 자동 전송하는 주기</p>
          </div>
          <select className={styles.input} style={{ width: '120px' }}>
            <option value="5">5분</option>
            <option value="10">10분</option>
            <option value="30">30분</option>
          </select>
        </div>
      </section>
    </div>
  )
}
```

- [ ] **Step 7: 브라우저 확인**

```
/users              → 사용자 목록 (역할 배지)
/users/invite       → 초대 폼, 제출 후 토스트 + 목록 이동
/settings/profile   → 프로필 편집 폼
/settings/notifications → 토글 목록
/settings/system    → 드롭다운 설정
```

- [ ] **Step 8: 커밋**

```bash
git add src/hooks/users/ src/components/domain/users/ src/app/(dashboard)/users/ src/app/(dashboard)/settings/ src/mocks/handlers/users.ts
git commit -m "feat(user): 사용자 목록·초대·프로필·알림설정·시스템설정 페이지 구현"
```
