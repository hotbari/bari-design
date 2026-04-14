# Task 2: 캠페인 도메인 (4 routes)

이 태스크가 이후 모든 도메인의 **패턴 템플릿**. 훅 구조, 컴포넌트 분리, 페이지 조합 방식을 여기서 확정.

**Files:**
- Create: `src/hooks/campaigns/useCampaigns.ts`
- Create: `src/hooks/campaigns/useCampaignDetail.ts`
- Create: `src/components/domain/campaigns/CampaignStatusBadge.tsx`
- Create: `src/components/domain/campaigns/CampaignTable.tsx`
- Create: `src/components/domain/campaigns/CampaignForm.tsx`
- Create: `src/app/(dashboard)/campaigns/page.tsx`
- Create: `src/app/(dashboard)/campaigns/new/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/page.tsx`
- Create: `src/app/(dashboard)/campaigns/[id]/edit/page.tsx`

---

- [ ] **Step 1: MSW에 POST/PUT/DELETE 핸들러 추가**

`src/mocks/handlers/campaigns.ts` 수정:
```ts
import { http, HttpResponse } from 'msw'
import campaigns from '../fixtures/campaigns.json'

let data = [...campaigns]

export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(data)),
  http.get('/api/campaigns/:id', ({ params }) => {
    const item = data.find((c) => c.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/campaigns', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `camp-${Date.now()}`, ...body }
    data = [...data, newItem as typeof data[0]]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/campaigns/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((c) => c.id === params.id ? { ...c, ...body } : c)
    return HttpResponse.json(data.find((c) => c.id === params.id))
  }),
  http.delete('/api/campaigns/:id', ({ params }) => {
    data = data.filter((c) => c.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

- [ ] **Step 2: useCampaigns 훅 생성**

`src/hooks/campaigns/useCampaigns.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campaign, CampaignInput } from '@/types/campaign'

const QUERY_KEY = ['campaigns'] as const

async function fetchCampaigns(): Promise<Campaign[]> {
  const res = await fetch('/api/campaigns')
  if (!res.ok) throw new Error('캠페인 목록 조회 실패')
  return res.json()
}

async function createCampaign(input: CampaignInput): Promise<Campaign> {
  const res = await fetch('/api/campaigns', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('캠페인 생성 실패')
  return res.json()
}

export function useCampaigns() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchCampaigns })
}

export function useCreateCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

- [ ] **Step 3: useCampaignDetail 훅 생성**

`src/hooks/campaigns/useCampaignDetail.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Campaign, CampaignInput } from '@/types/campaign'

const listKey = ['campaigns'] as const
const detailKey = (id: string) => ['campaigns', id] as const

async function fetchCampaignDetail(id: string): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${id}`)
  if (!res.ok) throw new Error('캠페인 조회 실패')
  return res.json()
}

async function updateCampaign(id: string, input: CampaignInput): Promise<Campaign> {
  const res = await fetch(`/api/campaigns/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('캠페인 수정 실패')
  return res.json()
}

async function deleteCampaign(id: string): Promise<void> {
  const res = await fetch(`/api/campaigns/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('캠페인 삭제 실패')
}

export function useCampaignDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchCampaignDetail(id) })
}

export function useUpdateCampaign(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: CampaignInput) => updateCampaign(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: detailKey(id) })
    },
  })
}

export function useDeleteCampaign() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteCampaign,
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  })
}
```

- [ ] **Step 4: CampaignStatusBadge 컴포넌트 생성**

`src/components/domain/campaigns/CampaignStatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Campaign } from '@/types/campaign'

const labelMap: Record<Campaign['status'], string> = {
  active: '운영중',
  done: '완료',
  pending: '대기',
  paused: '일시정지',
}

const variantMap: Record<Campaign['status'], 'success' | 'neutral' | 'warning' | 'error'> = {
  active: 'success',
  done: 'neutral',
  pending: 'warning',
  paused: 'error',
}

export function CampaignStatusBadge({ status }: { status: Campaign['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
```

- [ ] **Step 5: CampaignTable 컴포넌트 생성**

`src/components/domain/campaigns/CampaignTable.tsx`:
```tsx
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { CampaignStatusBadge } from './CampaignStatusBadge'
import type { Campaign } from '@/types/campaign'

const columns: Column<Campaign>[] = [
  { key: 'name', header: '캠페인명', render: (r) => r.name },
  { key: 'advertiser', header: '광고주', render: (r) => r.advertiser },
  { key: 'status', header: '상태', render: (r) => <CampaignStatusBadge status={r.status} />, width: '100px' },
]

export function CampaignTable({ campaigns }: { campaigns: Campaign[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={campaigns}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/campaigns/${r.id}`)}
    />
  )
}
```

- [ ] **Step 6: CampaignForm 컴포넌트 생성**

`src/components/domain/campaigns/CampaignForm.tsx`:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { campaignInputSchema, type CampaignInput } from '@/types/campaign'
import { Button } from '@/components/ui/Button'
import styles from './CampaignForm.module.css'

interface CampaignFormProps {
  defaultValues?: Partial<CampaignInput>
  onSubmit: (data: CampaignInput) => void
  isPending: boolean
}

export function CampaignForm({ defaultValues, onSubmit, isPending }: CampaignFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<CampaignInput>({
    resolver: zodResolver(campaignInputSchema),
    defaultValues: defaultValues ?? { status: 'pending' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>캠페인명 *</label>
        <input className={styles.input} {...register('name')} placeholder="캠페인명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>광고주 *</label>
        <input className={styles.input} {...register('advertiser')} placeholder="광고주명 입력" />
        {errors.advertiser && <span className={styles.error}>{errors.advertiser.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>상태</label>
        <select className={styles.input} {...register('status')}>
          <option value="pending">대기</option>
          <option value="active">운영중</option>
          <option value="paused">일시정지</option>
        </select>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
```

`src/components/domain/campaigns/CampaignForm.module.css`:
```css
.form { display: flex; flex-direction: column; gap: 20px; max-width: 480px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input {
  padding: 8px 12px;
  border: 1px solid var(--color-neutral-300);
  border-radius: var(--radius-md);
  font-size: var(--text-sm);
  font-family: var(--font-sans);
  background: white;
  outline: none;
}
.input:focus { border-color: var(--color-primary-500); }
.error { font-size: var(--text-xs); color: var(--color-error-500); }
.actions { display: flex; justify-content: flex-end; padding-top: 8px; }
```

- [ ] **Step 7: 캠페인 목록 페이지**

`src/app/(dashboard)/campaigns/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useCampaigns } from '@/hooks/campaigns/useCampaigns'
import { CampaignTable } from '@/components/domain/campaigns/CampaignTable'
import { FilterBar } from '@/components/ui/FilterBar'
import { Button } from '@/components/ui/Button'
import styles from './campaigns.module.css'

export default function CampaignsPage() {
  const router = useRouter()
  const { data: campaigns, isLoading } = useCampaigns()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>캠페인</h1>
        <Button onClick={() => router.push('/campaigns/new')}>+ 캠페인 등록</Button>
      </div>
      <FilterBar
        filters={[{ key: 'status', label: '상태', options: [
          { value: '', label: '전체' },
          { value: 'active', label: '운영중' },
          { value: 'pending', label: '대기' },
          { value: 'done', label: '완료' },
        ]}]}
        onFilterChange={() => {}}
      />
      {isLoading ? (
        <p style={{ padding: '24px', color: 'var(--color-neutral-500)' }}>불러오는 중...</p>
      ) : (
        <CampaignTable campaigns={campaigns ?? []} />
      )}
    </div>
  )
}
```

`src/app/(dashboard)/campaigns/campaigns.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

- [ ] **Step 8: 캠페인 등록 페이지**

`src/app/(dashboard)/campaigns/new/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useCreateCampaign } from '@/hooks/campaigns/useCampaigns'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useToast } from '@/stores/toast'
import styles from '../campaigns.module.css'

export default function CampaignNewPage() {
  const router = useRouter()
  const mutation = useCreateCampaign()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>캠페인 등록</h1>
      <CampaignForm
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('캠페인이 등록되었습니다', 'success'); router.push('/campaigns') },
            onError: () => add('등록에 실패했습니다', 'error'),
          })
        }
      />
    </div>
  )
}
```

- [ ] **Step 9: 캠페인 상세 페이지**

`src/app/(dashboard)/campaigns/[id]/page.tsx`:
```tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useCampaignDetail, useDeleteCampaign } from '@/hooks/campaigns/useCampaignDetail'
import { CampaignStatusBadge } from '@/components/domain/campaigns/CampaignStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../campaigns.module.css'

export default function CampaignDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: campaign, isLoading } = useCampaignDetail(id)
  const deleteMutation = useDeleteCampaign()
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (!campaign) return <p style={{ padding: '24px' }}>캠페인을 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>{campaign.name}</h1>
          <CampaignStatusBadge status={campaign.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push(`/campaigns/${id}/edit`)}>수정</Button>
          <Button
            variant="danger"
            onClick={() => deleteMutation.mutate(id, {
              onSuccess: () => { add('캠페인이 삭제되었습니다', 'success'); router.push('/campaigns') },
              onError: () => add('삭제에 실패했습니다', 'error'),
            })}
          >
            삭제
          </Button>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>광고주</dt>
        <dd>{campaign.advertiser}</dd>
      </dl>
    </div>
  )
}
```

- [ ] **Step 10: 캠페인 편집 페이지**

`src/app/(dashboard)/campaigns/[id]/edit/page.tsx`:
```tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useCampaignDetail, useUpdateCampaign } from '@/hooks/campaigns/useCampaignDetail'
import { CampaignForm } from '@/components/domain/campaigns/CampaignForm'
import { useToast } from '@/stores/toast'
import styles from '../../campaigns.module.css'

export default function CampaignEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: campaign, isLoading } = useCampaignDetail(id)
  const mutation = useUpdateCampaign(id)
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>캠페인 수정</h1>
      <CampaignForm
        defaultValues={campaign}
        isPending={mutation.isPending}
        onSubmit={(data) =>
          mutation.mutate(data, {
            onSuccess: () => { add('수정되었습니다', 'success'); router.push(`/campaigns/${id}`) },
            onError: () => add('수정에 실패했습니다', 'error'),
          })
        }
      />
    </div>
  )
}
```

- [ ] **Step 11: 브라우저 확인**

```
/campaigns          → 목록 테이블, 행 클릭 시 상세 이동
/campaigns/new      → 폼 렌더링, 필수 필드 빈 채 제출 시 에러 표시
/campaigns/camp-001 → 상세 정보 표시
/campaigns/camp-001/edit → 기존 데이터 폼에 채워짐
```

- [ ] **Step 12: 커밋**

```bash
git add src/hooks/campaigns/ src/components/domain/campaigns/ src/app/(dashboard)/campaigns/ src/mocks/handlers/campaigns.ts
git commit -m "feat(campaign): 목록·상세·등록·수정 페이지 구현"
```
