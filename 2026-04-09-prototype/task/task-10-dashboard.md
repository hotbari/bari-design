# Task 10: 대시보드 (1 route, 3개 역할 컴포넌트)

역할 전환: `?role=admin|media-company|ops-agency`. Next.js 15 async searchParams 필수.
TopBar에 역할 셀렉터 추가.

**Files:**
- Create: `src/components/domain/dashboard/AdminDashboard.tsx`
- Create: `src/components/domain/dashboard/MediaCompanyDashboard.tsx`
- Create: `src/components/domain/dashboard/OpsAgencyDashboard.tsx`
- Create: `src/components/domain/dashboard/DashboardCard.tsx`
- Create: `src/components/domain/dashboard/dashboard.module.css`
- Create: `src/app/(dashboard)/page.tsx`
- Modify: `src/components/layout/TopBar.tsx` (역할 셀렉터 추가)

---

- [ ] **Step 1: DashboardCard 공통 컴포넌트**

`src/components/domain/dashboard/DashboardCard.tsx`:
```tsx
import { Card } from '@/components/ui/Card'
import styles from './dashboard.module.css'

interface DashboardCardProps {
  label: string
  value: string | number
  sub?: string
  accent?: boolean
}

export function DashboardCard({ label, value, sub, accent }: DashboardCardProps) {
  return (
    <Card className={accent ? styles.accentCard : ''}>
      <p className={styles.cardLabel}>{label}</p>
      <p className={styles.cardValue}>{value}</p>
      {sub && <p className={styles.cardSub}>{sub}</p>}
    </Card>
  )
}
```

`src/components/domain/dashboard/dashboard.module.css`:
```css
.grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(200px, 1fr)); gap: 16px; }
.section { display: flex; flex-direction: column; gap: 12px; }
.sectionTitle { font-size: var(--text-sm); font-weight: 600; color: var(--color-neutral-600); margin: 0; }
.cardLabel { font-size: var(--text-xs); color: var(--color-neutral-500); margin: 0 0 6px; }
.cardValue { font-size: 28px; font-weight: 700; color: var(--color-neutral-900); margin: 0; line-height: 1; }
.cardSub { font-size: var(--text-xs); color: var(--color-neutral-500); margin: 6px 0 0; }
.accentCard { border-left: 3px solid var(--color-primary-500); }
.page { padding: 24px; display: flex; flex-direction: column; gap: 24px; }
.pageTitle { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

- [ ] **Step 2: AdminDashboard**

`src/components/domain/dashboard/AdminDashboard.tsx`:
```tsx
'use client'
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'
import { useMedia } from '@/hooks/media/useMedia'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function AdminDashboard() {
  const { data: campaigns } = useCampaigns()
  const { data: media } = useMedia()
  const { data: schedules } = useSchedules()

  const activeCampaigns = campaigns?.filter((c) => c.status === 'active').length ?? 0
  const activeMedia = media?.filter((m) => m.status === 'active').length ?? 0
  const activeSchedules = schedules?.filter((s) => s.status === 'active').length ?? 0
  const lagSchedules = schedules?.filter((s) => s.syncStatus === 'lag').length ?? 0

  return (
    <>
      <div className={styles.grid}>
        <DashboardCard label="운영중 캠페인" value={activeCampaigns} accent />
        <DashboardCard label="운영중 매체" value={activeMedia} />
        <DashboardCard label="활성 편성" value={activeSchedules} />
        <DashboardCard label="동기화 지연" value={lagSchedules} sub="즉시 확인 필요" accent={lagSchedules > 0} />
      </div>
    </>
  )
}
```

- [ ] **Step 3: MediaCompanyDashboard**

`src/components/domain/dashboard/MediaCompanyDashboard.tsx`:
```tsx
'use client'
import { useMedia } from '@/hooks/media/useMedia'
import { useSlotRemaining } from '@/hooks/schedules/useSlotRemaining'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function MediaCompanyDashboard() {
  const { data: media } = useMedia()
  const { data: slots } = useSlotRemaining()

  const totalMedia = media?.length ?? 0
  const maintenanceMedia = media?.filter((m) => m.status === 'maintenance').length ?? 0
  const avgUsage = slots
    ? Math.round(slots.reduce((sum, s) => sum + (s.usedSlots / s.totalSlots) * 100, 0) / slots.length)
    : 0

  return (
    <>
      <div className={styles.grid}>
        <DashboardCard label="총 매체 수" value={totalMedia} />
        <DashboardCard label="점검중 매체" value={maintenanceMedia} accent={maintenanceMedia > 0} />
        <DashboardCard label="평균 슬롯 사용률" value={`${avgUsage}%`} sub="전체 매체 기준" />
      </div>
    </>
  )
}
```

- [ ] **Step 4: OpsAgencyDashboard**

`src/components/domain/dashboard/OpsAgencyDashboard.tsx`:
```tsx
'use client'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { useMaterials } from '@/hooks/materials/useMaterials'
import { DashboardCard } from './DashboardCard'
import styles from './dashboard.module.css'

export function OpsAgencyDashboard() {
  const { data: schedules } = useSchedules()
  const { data: materials } = useMaterials()

  const pendingSchedules = schedules?.filter((s) => s.status === 'pending').length ?? 0
  const pendingMaterials = materials?.filter((m) => m.reviewStatus === 'pending').length ?? 0
  const rejectedMaterials = materials?.filter((m) => m.reviewStatus === 'rejected').length ?? 0

  return (
    <>
      <div className={styles.grid}>
        <DashboardCard label="대기 중 편성" value={pendingSchedules} accent={pendingSchedules > 0} />
        <DashboardCard label="검수 대기 소재" value={pendingMaterials} accent={pendingMaterials > 0} />
        <DashboardCard label="반려된 소재" value={rejectedMaterials} accent={rejectedMaterials > 0} />
      </div>
    </>
  )
}
```

- [ ] **Step 5: 대시보드 페이지**

`src/app/(dashboard)/page.tsx`:
```tsx
import { AdminDashboard } from '@/components/domain/dashboard/AdminDashboard'
import { MediaCompanyDashboard } from '@/components/domain/dashboard/MediaCompanyDashboard'
import { OpsAgencyDashboard } from '@/components/domain/dashboard/OpsAgencyDashboard'
import styles from '@/components/domain/dashboard/dashboard.module.css'

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ role?: string }> }) {
  const { role = 'admin' } = await searchParams

  const titleMap: Record<string, string> = {
    admin: '어드민 대시보드',
    'media-company': '미디어사 대시보드',
    'ops-agency': '운영 대행사 대시보드',
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.pageTitle}>{titleMap[role] ?? '대시보드'}</h1>
      {role === 'media-company' ? <MediaCompanyDashboard /> :
       role === 'ops-agency' ? <OpsAgencyDashboard /> :
       <AdminDashboard />}
    </div>
  )
}
```

- [ ] **Step 6: TopBar에 역할 셀렉터 추가**

`src/components/layout/TopBar.tsx` 수정 — 기존 파일 읽은 후 역할 셀렉터 추가:

TopBar 우측에 `<RoleSelector />` 추가:
```tsx
// TopBar.tsx 내에 추가할 클라이언트 컴포넌트
'use client'
import { useRouter, useSearchParams } from 'next/navigation'

function RoleSelector() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const current = searchParams.get('role') ?? 'admin'

  return (
    <select
      value={current}
      onChange={(e) => router.push(`/?role=${e.target.value}`)}
      style={{
        padding: '4px 8px',
        border: '1px solid var(--color-neutral-300)',
        borderRadius: 'var(--radius-sm)',
        fontSize: 'var(--text-xs)',
        fontFamily: 'var(--font-sans)',
        background: 'white',
        cursor: 'pointer',
      }}
    >
      <option value="admin">어드민</option>
      <option value="media-company">미디어사</option>
      <option value="ops-agency">운영 대행사</option>
    </select>
  )
}
```

TopBar의 우측 액션 영역에 `<RoleSelector />` 배치.

> **주의**: `useSearchParams()`는 `'use client'` 필수. TopBar가 이미 서버 컴포넌트라면 RoleSelector를 별도 파일로 분리 후 import.

- [ ] **Step 7: 브라우저 확인**

```
/?role=admin         → AdminDashboard (캠페인·매체·편성 수치)
/?role=media-company → MediaCompanyDashboard
/?role=ops-agency    → OpsAgencyDashboard
TopBar 셀렉터로 역할 전환 → URL 변경 + 컴포넌트 교체 확인
```

- [ ] **Step 8: 커밋**

```bash
git add src/components/domain/dashboard/ src/app/(dashboard)/page.tsx src/components/layout/TopBar.tsx
git commit -m "feat(dashboard): 역할별 대시보드 3종 + TopBar 역할 셀렉터 구현"
```
