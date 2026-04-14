# Task 3: 미디어 도메인 (6 routes)

Task 2 캠페인 패턴 동일. 차이점: `groups/page.tsx` (media-group.html), `companies/page.tsx` (media-company-mgmt.html) 추가.

**Files:**
- Modify: `src/mocks/handlers/media.ts` (POST/PUT/DELETE 추가)
- Create: `src/hooks/media/useMedia.ts`
- Create: `src/hooks/media/useMediaDetail.ts`
- Create: `src/components/domain/media/MediaStatusBadge.tsx`
- Create: `src/components/domain/media/MediaTable.tsx`
- Create: `src/components/domain/media/MediaForm.tsx`
- Create: `src/components/domain/media/MediaForm.module.css`
- Create: `src/app/(dashboard)/media/page.tsx`
- Create: `src/app/(dashboard)/media/media.module.css`
- Create: `src/app/(dashboard)/media/new/page.tsx`
- Create: `src/app/(dashboard)/media/groups/page.tsx`
- Create: `src/app/(dashboard)/media/companies/page.tsx`
- Create: `src/app/(dashboard)/media/[id]/page.tsx`
- Create: `src/app/(dashboard)/media/[id]/edit/page.tsx`

---

- [ ] **Step 1: media 핸들러에 뮤테이션 추가**

`src/mocks/handlers/media.ts` 교체:
```ts
import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

let data = [...media]

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(data)),
  http.get('/api/media/:id', ({ params }) => {
    const item = data.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/media', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `med-${Date.now()}`, ...body }
    data = [...data, newItem as typeof data[0]]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/media/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((m) => m.id === params.id ? { ...m, ...body } : m)
    return HttpResponse.json(data.find((m) => m.id === params.id))
  }),
  http.delete('/api/media/:id', ({ params }) => {
    data = data.filter((m) => m.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
```

- [ ] **Step 2: useMedia 훅**

`src/hooks/media/useMedia.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Media, MediaInput } from '@/types/media'

const QUERY_KEY = ['media'] as const

async function fetchMedia(): Promise<Media[]> {
  const res = await fetch('/api/media')
  if (!res.ok) throw new Error('매체 목록 조회 실패')
  return res.json()
}

async function createMedia(input: MediaInput): Promise<Media> {
  const res = await fetch('/api/media', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('매체 등록 실패')
  return res.json()
}

export function useMedia() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchMedia })
}

export function useCreateMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMedia,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

- [ ] **Step 3: useMediaDetail 훅**

`src/hooks/media/useMediaDetail.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Media, MediaInput } from '@/types/media'

const listKey = ['media'] as const
const detailKey = (id: string) => ['media', id] as const

async function fetchMediaDetail(id: string): Promise<Media> {
  const res = await fetch(`/api/media/${id}`)
  if (!res.ok) throw new Error('매체 조회 실패')
  return res.json()
}

async function updateMedia(id: string, input: MediaInput): Promise<Media> {
  const res = await fetch(`/api/media/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('매체 수정 실패')
  return res.json()
}

async function deleteMedia(id: string): Promise<void> {
  const res = await fetch(`/api/media/${id}`, { method: 'DELETE' })
  if (!res.ok) throw new Error('매체 삭제 실패')
}

export function useMediaDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchMediaDetail(id) })
}

export function useUpdateMedia(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (input: MediaInput) => updateMedia(id, input),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: listKey })
      qc.invalidateQueries({ queryKey: detailKey(id) })
    },
  })
}

export function useDeleteMedia() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: deleteMedia,
    onSuccess: () => qc.invalidateQueries({ queryKey: listKey }),
  })
}
```

- [ ] **Step 4: MediaStatusBadge**

`src/components/domain/media/MediaStatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Media } from '@/types/media'

const labelMap: Record<Media['status'], string> = {
  active: '운영중',
  maintenance: '점검중',
  inactive: '비활성',
}
const variantMap: Record<Media['status'], 'success' | 'warning' | 'neutral'> = {
  active: 'success',
  maintenance: 'warning',
  inactive: 'neutral',
}

export function MediaStatusBadge({ status }: { status: Media['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
```

- [ ] **Step 5: MediaTable**

`src/components/domain/media/MediaTable.tsx`:
```tsx
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { MediaStatusBadge } from './MediaStatusBadge'
import type { Media } from '@/types/media'

const columns: Column<Media>[] = [
  { key: 'name', header: '매체명', render: (r) => r.name },
  { key: 'type', header: '유형', render: (r) => r.type },
  { key: 'location', header: '위치', render: (r) => r.location },
  { key: 'status', header: '상태', render: (r) => <MediaStatusBadge status={r.status} />, width: '100px' },
]

export function MediaTable({ media }: { media: Media[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={media}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/media/${r.id}`)}
    />
  )
}
```

- [ ] **Step 6: MediaForm**

`src/components/domain/media/MediaForm.tsx`:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { mediaInputSchema, type MediaInput } from '@/types/media'
import { Button } from '@/components/ui/Button'
import styles from './MediaForm.module.css'

interface MediaFormProps {
  defaultValues?: Partial<MediaInput>
  onSubmit: (data: MediaInput) => void
  isPending: boolean
}

export function MediaForm({ defaultValues, onSubmit, isPending }: MediaFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<MediaInput>({
    resolver: zodResolver(mediaInputSchema),
    defaultValues: defaultValues ?? { status: 'active', type: 'billboard' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>매체명 *</label>
        <input className={styles.input} {...register('name')} placeholder="매체명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>유형</label>
        <select className={styles.input} {...register('type')}>
          <option value="billboard">빌보드</option>
          <option value="signage">사이니지</option>
          <option value="display">디스플레이</option>
          <option value="screen">스크린</option>
        </select>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>위치 *</label>
        <input className={styles.input} {...register('location')} placeholder="위치 입력" />
        {errors.location && <span className={styles.error}>{errors.location.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>상태</label>
        <select className={styles.input} {...register('status')}>
          <option value="active">운영중</option>
          <option value="maintenance">점검중</option>
          <option value="inactive">비활성</option>
        </select>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
```

`src/components/domain/media/MediaForm.module.css`:
```css
.form { display: flex; flex-direction: column; gap: 20px; max-width: 480px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input { padding: 8px 12px; border: 1px solid var(--color-neutral-300); border-radius: var(--radius-md); font-size: var(--text-sm); font-family: var(--font-sans); background: white; outline: none; }
.input:focus { border-color: var(--color-primary-500); }
.error { font-size: var(--text-xs); color: var(--color-error-500); }
.actions { display: flex; justify-content: flex-end; padding-top: 8px; }
```

- [ ] **Step 7: 미디어 목록 페이지**

`src/app/(dashboard)/media/media.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/media/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useMedia } from '@/hooks/media/useMedia'
import { MediaTable } from '@/components/domain/media/MediaTable'
import { Button } from '@/components/ui/Button'
import styles from './media.module.css'

export default function MediaPage() {
  const router = useRouter()
  const { data: media, isLoading } = useMedia()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>매체 관리</h1>
        <Button onClick={() => router.push('/media/new')}>+ 매체 등록</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <MediaTable media={media ?? []} />}
    </div>
  )
}
```

- [ ] **Step 8: 미디어 그룹 페이지 (media-group.html)**

`src/app/(dashboard)/media/groups/page.tsx`:
```tsx
'use client'
import { useMedia } from '@/hooks/media/useMedia'
import { Card } from '@/components/ui/Card'
import styles from '../media.module.css'

export default function MediaGroupsPage() {
  const { data: media, isLoading } = useMedia()

  // 유형별 그룹화
  const groups = media?.reduce<Record<string, typeof media>>((acc, m) => {
    if (!acc[m.type]) acc[m.type] = []
    acc[m.type].push(m)
    return acc
  }, {}) ?? {}

  const typeLabel: Record<string, string> = {
    billboard: '빌보드', signage: '사이니지', display: '디스플레이', screen: '스크린',
  }

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>매체 그룹</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '16px' }}>
          {Object.entries(groups).map(([type, items]) => (
            <Card key={type}>
              <h2 style={{ fontSize: 'var(--text-sm)', fontWeight: 600, marginBottom: '12px' }}>
                {typeLabel[type] ?? type} ({items.length})
              </h2>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '6px' }}>
                {items.map((m) => (
                  <li key={m.id} style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-700)' }}>{m.name}</li>
                ))}
              </ul>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 9: 미디어사 관리 페이지 (media-company-mgmt.html)**

`src/app/(dashboard)/media/companies/page.tsx`:
```tsx
'use client'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { Badge } from '@/components/ui/Badge'
import styles from '../media.module.css'

// 미디어사 데이터는 별도 MSW 미정 → 정적 더미
const companies = [
  { id: 'mc-001', name: '서울옥외광고(주)', mediaCount: 12, status: 'active' as const },
  { id: 'mc-002', name: '홍대미디어(주)', mediaCount: 5, status: 'active' as const },
]

export default function MediaCompaniesPage() {
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>미디어사 관리</h1>
        <Button>+ 미디어사 등록</Button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {companies.map((c) => (
          <Card key={c.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px' }}>
            <div>
              <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>{c.name}</p>
              <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-500)', margin: '4px 0 0' }}>매체 {c.mediaCount}개</p>
            </div>
            <Badge variant="success">활성</Badge>
          </Card>
        ))}
      </div>
    </div>
  )
}
```

- [ ] **Step 10: 상세·편집 페이지**

`src/app/(dashboard)/media/[id]/page.tsx`:
```tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useMediaDetail, useDeleteMedia } from '@/hooks/media/useMediaDetail'
import { MediaStatusBadge } from '@/components/domain/media/MediaStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../media.module.css'

export default function MediaDetailPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: media, isLoading } = useMediaDetail(id)
  const deleteMutation = useDeleteMedia()
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (!media) return <p style={{ padding: '24px' }}>매체를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 className={styles.title}>{media.name}</h1>
          <MediaStatusBadge status={media.status} />
        </div>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push(`/media/${id}/edit`)}>수정</Button>
          <Button variant="danger" onClick={() => deleteMutation.mutate(id, {
            onSuccess: () => { add('삭제되었습니다', 'success'); router.push('/media') },
            onError: () => add('삭제 실패', 'error'),
          })}>삭제</Button>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>유형</dt><dd>{media.type}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>위치</dt><dd>{media.location}</dd>
      </dl>
    </div>
  )
}
```

`src/app/(dashboard)/media/[id]/edit/page.tsx`:
```tsx
'use client'
import { useParams, useRouter } from 'next/navigation'
import { useMediaDetail, useUpdateMedia } from '@/hooks/media/useMediaDetail'
import { MediaForm } from '@/components/domain/media/MediaForm'
import { useToast } from '@/stores/toast'
import styles from '../../media.module.css'

export default function MediaEditPage() {
  const { id } = useParams<{ id: string }>()
  const router = useRouter()
  const { data: media, isLoading } = useMediaDetail(id)
  const mutation = useUpdateMedia(id)
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>매체 수정</h1>
      <MediaForm
        defaultValues={media}
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data, {
          onSuccess: () => { add('수정되었습니다', 'success'); router.push(`/media/${id}`) },
          onError: () => add('수정 실패', 'error'),
        })}
      />
    </div>
  )
}
```

- [ ] **Step 11: 브라우저 확인**

```
/media              → 목록
/media/new          → 폼
/media/groups       → 유형별 그룹 카드
/media/companies    → 미디어사 목록
/media/med-001      → 상세
/media/med-001/edit → 편집 폼
```

- [ ] **Step 12: 커밋**

```bash
git add src/hooks/media/ src/components/domain/media/ src/app/(dashboard)/media/ src/mocks/handlers/media.ts
git commit -m "feat(media): 목록·그룹·미디어사·상세·등록·수정 페이지 구현"
```
