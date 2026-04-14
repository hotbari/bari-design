# Task 4: 소재 도메인 (3 routes)

**Files:**
- Create: `src/hooks/materials/useMaterials.ts`
- Create: `src/components/domain/materials/MaterialReviewBadge.tsx`
- Create: `src/components/domain/materials/MaterialTable.tsx`
- Create: `src/app/(dashboard)/materials/page.tsx`
- Create: `src/app/(dashboard)/materials/materials.module.css`
- Create: `src/app/(dashboard)/materials/spec-guide/page.tsx`
- Create: `src/app/(dashboard)/materials/[id]/page.tsx`

---

- [ ] **Step 1: useMaterials 훅**

`src/hooks/materials/useMaterials.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Material, MaterialInput } from '@/types/material'

const QUERY_KEY = ['materials'] as const
const detailKey = (id: string) => ['materials', id] as const

async function fetchMaterials(): Promise<Material[]> {
  const res = await fetch('/api/materials')
  if (!res.ok) throw new Error('소재 목록 조회 실패')
  return res.json()
}

async function fetchMaterialDetail(id: string): Promise<Material> {
  const res = await fetch(`/api/materials/${id}`)
  if (!res.ok) throw new Error('소재 조회 실패')
  return res.json()
}

async function createMaterial(input: MaterialInput): Promise<Material> {
  const res = await fetch('/api/materials', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('소재 등록 실패')
  return res.json()
}

export function useMaterials() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchMaterials })
}

export function useMaterialDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchMaterialDetail(id) })
}

export function useCreateMaterial() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createMaterial,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

- [ ] **Step 2: MaterialReviewBadge**

`src/components/domain/materials/MaterialReviewBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Material } from '@/types/material'

const labelMap: Record<Material['reviewStatus'], string> = {
  approved: '승인', pending: '검수중', rejected: '반려',
}
const variantMap: Record<Material['reviewStatus'], 'success' | 'warning' | 'error'> = {
  approved: 'success', pending: 'warning', rejected: 'error',
}

export function MaterialReviewBadge({ status }: { status: Material['reviewStatus'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
```

- [ ] **Step 3: MaterialTable**

`src/components/domain/materials/MaterialTable.tsx`:
```tsx
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { MaterialReviewBadge } from './MaterialReviewBadge'
import type { Material } from '@/types/material'

const columns: Column<Material>[] = [
  { key: 'name', header: '소재명', render: (r) => r.name },
  { key: 'advertiser', header: '광고주', render: (r) => r.advertiser },
  { key: 'mediaName', header: '매체', render: (r) => r.mediaName },
  { key: 'resolution', header: '해상도', render: (r) => r.resolution },
  { key: 'duration', header: '재생시간', render: (r) => `${r.duration}초` },
  { key: 'reviewStatus', header: '검수 상태', render: (r) => <MaterialReviewBadge status={r.reviewStatus} />, width: '90px' },
  { key: 'scheduleLinked', header: '편성 연결', render: (r) => r.scheduleLinked ? '연결됨' : '-', width: '80px' },
]

export function MaterialTable({ materials }: { materials: Material[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={materials}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/materials/${r.id}`)}
    />
  )
}
```

- [ ] **Step 4: 소재 목록 페이지**

`src/app/(dashboard)/materials/materials.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/materials/page.tsx`:
```tsx
'use client'
import { useMaterials } from '@/hooks/materials/useMaterials'
import { MaterialTable } from '@/components/domain/materials/MaterialTable'
import { Button } from '@/components/ui/Button'
import styles from './materials.module.css'

export default function MaterialsPage() {
  const { data: materials, isLoading } = useMaterials()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>소재 관리</h1>
        <Button>+ 소재 등록</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <MaterialTable materials={materials ?? []} />}
    </div>
  )
}
```

- [ ] **Step 5: 소재 상세 페이지**

`src/app/(dashboard)/materials/[id]/page.tsx`:
```tsx
'use client'
import { useParams } from 'next/navigation'
import { useMaterialDetail } from '@/hooks/materials/useMaterials'
import { MaterialReviewBadge } from '@/components/domain/materials/MaterialReviewBadge'
import { Badge } from '@/components/ui/Badge'
import styles from '../materials.module.css'

export default function MaterialDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { data: material, isLoading } = useMaterialDetail(id)

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (!material) return <p style={{ padding: '24px' }}>소재를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <h1 className={styles.title}>{material.name}</h1>
          <MaterialReviewBadge status={material.reviewStatus} />
          <Badge variant={material.status === 'active' ? 'success' : 'neutral'}>
            {material.status === 'active' ? '운영중' : '비활성'}
          </Badge>
        </div>
      </div>
      <dl style={{ display: 'grid', gridTemplateColumns: '120px 1fr', gap: '12px 0', fontSize: 'var(--text-sm)' }}>
        <dt style={{ color: 'var(--color-neutral-500)' }}>광고주</dt><dd>{material.advertiser}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>매체</dt><dd>{material.mediaName}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>해상도</dt><dd>{material.resolution}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>재생시간</dt><dd>{material.duration}초</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>편성 연결</dt>
        <dd>{material.scheduleLinked ? '연결됨' : '미연결'}</dd>
        <dt style={{ color: 'var(--color-neutral-500)' }}>등록일</dt>
        <dd>{new Date(material.createdAt).toLocaleDateString('ko-KR')}</dd>
      </dl>
    </div>
  )
}
```

- [ ] **Step 6: 소재 규격 안내 페이지 (spec-guide.html)**

`src/app/(dashboard)/materials/spec-guide/page.tsx`:
```tsx
import styles from '../materials.module.css'

const specs = [
  { label: '빌보드', resolution: '1920×1080', format: 'MP4, H.264', maxSize: '100MB', duration: '10~30초' },
  { label: '사이니지', resolution: '1080×1920', format: 'MP4, H.264', maxSize: '50MB', duration: '10~30초' },
  { label: '디스플레이', resolution: '1280×720', format: 'MP4, H.264', maxSize: '50MB', duration: '10~15초' },
  { label: '스크린', resolution: '1920×1080', format: 'MP4, H.264', maxSize: '100MB', duration: '10~30초' },
]

export default function MaterialSpecGuidePage() {
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>소재 규격 안내</h1>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', margin: 0 }}>
        매체 유형별 소재 규격을 확인하세요. 규격 미충족 시 검수에서 반려될 수 있습니다.
      </p>
      <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
        <thead>
          <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
            {['매체 유형', '해상도', '파일 형식', '최대 용량', '재생시간'].map((h) => (
              <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {specs.map((s) => (
            <tr key={s.label} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
              <td style={{ padding: '10px 12px', fontWeight: 500 }}>{s.label}</td>
              <td style={{ padding: '10px 12px' }}>{s.resolution}</td>
              <td style={{ padding: '10px 12px' }}>{s.format}</td>
              <td style={{ padding: '10px 12px' }}>{s.maxSize}</td>
              <td style={{ padding: '10px 12px' }}>{s.duration}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
```

- [ ] **Step 7: 브라우저 확인**

```
/materials              → 목록 테이블 (7컬럼)
/materials/mat-001      → 상세 (검수 상태 배지 포함)
/materials/spec-guide   → 규격 안내 테이블
```

- [ ] **Step 8: 커밋**

```bash
git add src/hooks/materials/ src/components/domain/materials/ src/app/(dashboard)/materials/
git commit -m "feat(material): 목록·상세·규격안내 페이지 구현"
```
