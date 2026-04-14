# Task 5: 스케줄링 도메인 (5 routes)

**Files:**
- Modify: `src/mocks/handlers/schedules.ts` (POST/PUT/DELETE 추가)
- Create: `src/hooks/schedules/useSchedules.ts`
- Create: `src/hooks/schedules/useSlotRemaining.ts`
- Create: `src/components/domain/schedules/ScheduleStatusBadge.tsx`
- Create: `src/components/domain/schedules/SyncStatusBadge.tsx`
- Create: `src/components/domain/schedules/ScheduleTable.tsx`
- Create: `src/components/domain/schedules/ScheduleForm.tsx`
- Create: `src/components/domain/schedules/ScheduleForm.module.css`
- Create: `src/app/(dashboard)/schedules/schedules.module.css`
- Create: `src/app/(dashboard)/schedules/page.tsx`
- Create: `src/app/(dashboard)/schedules/new/page.tsx`
- Create: `src/app/(dashboard)/schedules/sync/page.tsx`
- Create: `src/app/(dashboard)/schedules/emergency/page.tsx`
- Create: `src/app/(dashboard)/schedules/slot-remaining/page.tsx`

---

- [ ] **Step 1: schedules 핸들러 업데이트**

`src/mocks/handlers/schedules.ts`:
```ts
import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

let data = [...schedules]

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(data)),
  http.get('/api/schedules/:id', ({ params }) => {
    const item = data.find((s) => s.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/schedules', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `sch-${Date.now()}`, ...body, syncStatus: 'none', syncLagMinutes: null, editingUsers: [] }
    data = [...data, newItem as typeof data[0]]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/schedules/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((s) => s.id === params.id ? { ...s, ...body } : s)
    return HttpResponse.json(data.find((s) => s.id === params.id))
  }),
  http.delete('/api/schedules/:id', ({ params }) => {
    data = data.filter((s) => s.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
  // 동기화 트리거
  http.post('/api/schedules/:id/sync', ({ params }) => {
    data = data.map((s) => s.id === params.id ? { ...s, syncStatus: 'ok', syncLagMinutes: null } : s)
    return HttpResponse.json({ success: true })
  }),
  // 잔여 슬롯 조회
  http.get('/api/schedules/slot-remaining', () =>
    HttpResponse.json([
      { mediaId: 'med-001', mediaName: '강남대로 전광판', totalSlots: 48, usedSlots: 36, remainingSlots: 12 },
      { mediaId: 'med-002', mediaName: '홍대입구 사이니지', totalSlots: 48, usedSlots: 20, remainingSlots: 28 },
      { mediaId: 'med-004', mediaName: '여의도 IFC 전광판', totalSlots: 48, usedSlots: 45, remainingSlots: 3 },
    ])
  ),
]
```

- [ ] **Step 2: useSchedules 훅**

`src/hooks/schedules/useSchedules.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Schedule, ScheduleInput } from '@/types/schedule'

const QUERY_KEY = ['schedules'] as const
const detailKey = (id: string) => ['schedules', id] as const

async function fetchSchedules(): Promise<Schedule[]> {
  const res = await fetch('/api/schedules')
  if (!res.ok) throw new Error('편성 목록 조회 실패')
  return res.json()
}

async function fetchScheduleDetail(id: string): Promise<Schedule> {
  const res = await fetch(`/api/schedules/${id}`)
  if (!res.ok) throw new Error('편성 조회 실패')
  return res.json()
}

async function createSchedule(input: ScheduleInput): Promise<Schedule> {
  const res = await fetch('/api/schedules', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('편성 생성 실패')
  return res.json()
}

async function syncSchedule(id: string): Promise<void> {
  const res = await fetch(`/api/schedules/${id}/sync`, { method: 'POST' })
  if (!res.ok) throw new Error('동기화 실패')
}

export function useSchedules() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchSchedules })
}

export function useScheduleDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchScheduleDetail(id) })
}

export function useCreateSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createSchedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useSyncSchedule() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: syncSchedule,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}
```

- [ ] **Step 3: useSlotRemaining 훅**

`src/hooks/schedules/useSlotRemaining.ts`:
```ts
import { useQuery } from '@tanstack/react-query'

interface SlotInfo {
  mediaId: string
  mediaName: string
  totalSlots: number
  usedSlots: number
  remainingSlots: number
}

async function fetchSlotRemaining(): Promise<SlotInfo[]> {
  const res = await fetch('/api/schedules/slot-remaining')
  if (!res.ok) throw new Error('잔여 슬롯 조회 실패')
  return res.json()
}

export function useSlotRemaining() {
  return useQuery({ queryKey: ['schedules', 'slot-remaining'], queryFn: fetchSlotRemaining })
}
```

- [ ] **Step 4: ScheduleStatusBadge + SyncStatusBadge**

`src/components/domain/schedules/ScheduleStatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Schedule } from '@/types/schedule'

const labelMap: Record<Schedule['status'], string> = {
  active: '운영중', pending: '대기', done: '완료', paused: '일시정지',
}
const variantMap: Record<Schedule['status'], 'success' | 'warning' | 'neutral' | 'error'> = {
  active: 'success', pending: 'warning', done: 'neutral', paused: 'error',
}

export function ScheduleStatusBadge({ status }: { status: Schedule['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
```

`src/components/domain/schedules/SyncStatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Schedule } from '@/types/schedule'

export function SyncStatusBadge({ syncStatus, syncLagMinutes }: { syncStatus: Schedule['syncStatus']; syncLagMinutes: number | null }) {
  if (syncStatus === 'ok') return <Badge variant="success">동기화됨</Badge>
  if (syncStatus === 'lag') return <Badge variant="warning">{syncLagMinutes}분 지연</Badge>
  return <Badge variant="neutral">미동기화</Badge>
}
```

- [ ] **Step 5: ScheduleTable**

`src/components/domain/schedules/ScheduleTable.tsx`:
```tsx
import { useRouter } from 'next/navigation'
import { Table, type Column } from '@/components/ui/Table'
import { ScheduleStatusBadge } from './ScheduleStatusBadge'
import { SyncStatusBadge } from './SyncStatusBadge'
import type { Schedule } from '@/types/schedule'

const columns: Column<Schedule>[] = [
  { key: 'name', header: '편성명', render: (r) => r.name },
  { key: 'media', header: '매체', render: (r) => r.mediaNames.join(', ') },
  { key: 'period', header: '기간', render: (r) => `${r.startAt.slice(0, 10)} ~ ${r.endAt.slice(0, 10)}` },
  { key: 'status', header: '상태', render: (r) => <ScheduleStatusBadge status={r.status} />, width: '90px' },
  { key: 'sync', header: '동기화', render: (r) => <SyncStatusBadge syncStatus={r.syncStatus} syncLagMinutes={r.syncLagMinutes} />, width: '100px' },
]

export function ScheduleTable({ schedules }: { schedules: Schedule[] }) {
  const router = useRouter()
  return (
    <Table
      columns={columns}
      rows={schedules}
      keyExtractor={(r) => r.id}
      onRowClick={(r) => router.push(`/schedules/${r.id}`)}
    />
  )
}
```

- [ ] **Step 6: ScheduleForm**

`src/components/domain/schedules/ScheduleForm.tsx`:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { scheduleInputSchema, type ScheduleInput } from '@/types/schedule'
import { Button } from '@/components/ui/Button'
import styles from './ScheduleForm.module.css'

interface ScheduleFormProps {
  defaultValues?: Partial<ScheduleInput>
  onSubmit: (data: ScheduleInput) => void
  isPending: boolean
}

export function ScheduleForm({ defaultValues, onSubmit, isPending }: ScheduleFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ScheduleInput>({
    resolver: zodResolver(scheduleInputSchema),
    defaultValues: defaultValues ?? { priority: 3, mediaIds: [] },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>편성명 *</label>
        <input className={styles.input} {...register('name')} placeholder="편성명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>시작일 *</label>
          <input className={styles.input} type="datetime-local" {...register('startAt')} />
          {errors.startAt && <span className={styles.error}>{errors.startAt.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>종료일 *</label>
          <input className={styles.input} type="datetime-local" {...register('endAt')} />
          {errors.endAt && <span className={styles.error}>{errors.endAt.message}</span>}
        </div>
      </div>
      <div className={styles.field}>
        <label className={styles.label}>우선순위</label>
        <input className={styles.input} type="number" min={1} max={5} {...register('priority', { valueAsNumber: true })} />
      </div>
      <div className={styles.field}>
        <label className={styles.label}>플레이리스트 ID *</label>
        <input className={styles.input} {...register('playlistId')} placeholder="pl-001" />
        {errors.playlistId && <span className={styles.error}>{errors.playlistId.message}</span>}
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>저장</Button>
      </div>
    </form>
  )
}
```

`src/components/domain/schedules/ScheduleForm.module.css`:
```css
.form { display: flex; flex-direction: column; gap: 20px; max-width: 600px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input { padding: 8px 12px; border: 1px solid var(--color-neutral-300); border-radius: var(--radius-md); font-size: var(--text-sm); font-family: var(--font-sans); background: white; outline: none; }
.input:focus { border-color: var(--color-primary-500); }
.error { font-size: var(--text-xs); color: var(--color-error-500); }
.actions { display: flex; justify-content: flex-end; padding-top: 8px; }
```

- [ ] **Step 7: 편성 목록 + 등록 페이지**

`src/app/(dashboard)/schedules/schedules.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/schedules/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useSchedules } from '@/hooks/schedules/useSchedules'
import { ScheduleTable } from '@/components/domain/schedules/ScheduleTable'
import { Button } from '@/components/ui/Button'
import styles from './schedules.module.css'

export default function SchedulesPage() {
  const router = useRouter()
  const { data: schedules, isLoading } = useSchedules()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>편성 관리</h1>
        <div style={{ display: 'flex', gap: '8px' }}>
          <Button variant="secondary" onClick={() => router.push('/schedules/sync')}>동기화 관리</Button>
          <Button variant="secondary" onClick={() => router.push('/schedules/emergency')}>긴급 편성</Button>
          <Button onClick={() => router.push('/schedules/new')}>+ 편성 등록</Button>
        </div>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <ScheduleTable schedules={schedules ?? []} />}
    </div>
  )
}
```

`src/app/(dashboard)/schedules/new/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useCreateSchedule } from '@/hooks/schedules/useSchedules'
import { ScheduleForm } from '@/components/domain/schedules/ScheduleForm'
import { useToast } from '@/stores/toast'
import styles from '../schedules.module.css'

export default function ScheduleNewPage() {
  const router = useRouter()
  const mutation = useCreateSchedule()
  const { add } = useToast()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>편성 등록</h1>
      <ScheduleForm
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data, {
          onSuccess: () => { add('편성이 등록되었습니다', 'success'); router.push('/schedules') },
          onError: () => add('등록 실패', 'error'),
        })}
      />
    </div>
  )
}
```

- [ ] **Step 8: 동기화 관리 페이지 (sync-schedule.html)**

`src/app/(dashboard)/schedules/sync/page.tsx`:
```tsx
'use client'
import { useSchedules, useSyncSchedule } from '@/hooks/schedules/useSchedules'
import { SyncStatusBadge } from '@/components/domain/schedules/SyncStatusBadge'
import { Button } from '@/components/ui/Button'
import { useToast } from '@/stores/toast'
import styles from '../schedules.module.css'

export default function SyncSchedulePage() {
  const { data: schedules, isLoading } = useSchedules()
  const syncMutation = useSyncSchedule()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>동기화 관리</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
              {['편성명', '동기화 상태', ''].map((h) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {schedules?.map((s) => (
              <tr key={s.id} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
                <td style={{ padding: '10px 12px' }}>{s.name}</td>
                <td style={{ padding: '10px 12px' }}>
                  <SyncStatusBadge syncStatus={s.syncStatus} syncLagMinutes={s.syncLagMinutes} />
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <Button
                    size="sm"
                    variant="secondary"
                    loading={syncMutation.isPending && syncMutation.variables === s.id}
                    onClick={() => syncMutation.mutate(s.id, {
                      onSuccess: () => add(`${s.name} 동기화 완료`, 'success'),
                      onError: () => add('동기화 실패', 'error'),
                    })}
                  >
                    동기화
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  )
}
```

- [ ] **Step 9: 긴급 편성 페이지 (emergency-schedule.html)**

`src/app/(dashboard)/schedules/emergency/page.tsx`:
```tsx
'use client'
import { useCreateSchedule } from '@/hooks/schedules/useSchedules'
import { ScheduleForm } from '@/components/domain/schedules/ScheduleForm'
import { useToast } from '@/stores/toast'
import { useRouter } from 'next/navigation'
import styles from '../schedules.module.css'

export default function EmergencySchedulePage() {
  const router = useRouter()
  const mutation = useCreateSchedule()
  const { add } = useToast()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>긴급 편성</h1>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-600)', margin: 0 }}>
        기존 편성을 즉시 교체합니다. 우선순위 1로 자동 설정됩니다.
      </p>
      <ScheduleForm
        defaultValues={{ priority: 1 }}
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate({ ...data, priority: 1 }, {
          onSuccess: () => { add('긴급 편성이 등록되었습니다', 'success'); router.push('/schedules') },
          onError: () => add('긴급 편성 등록 실패', 'error'),
        })}
      />
    </div>
  )
}
```

- [ ] **Step 10: 잔여 슬롯 페이지 (slot-remaining.html)**

`src/app/(dashboard)/schedules/slot-remaining/page.tsx`:
```tsx
'use client'
import { useSlotRemaining } from '@/hooks/schedules/useSlotRemaining'
import styles from '../schedules.module.css'

export default function SlotRemainingPage() {
  const { data: slots, isLoading } = useSlotRemaining()

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>잔여 슬롯 현황</h1>
      {isLoading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {slots?.map((s) => {
            const pct = Math.round((s.usedSlots / s.totalSlots) * 100)
            const barColor = pct >= 90 ? 'var(--color-error-500)' : pct >= 70 ? 'var(--color-warning-500)' : 'var(--color-primary-500)'
            return (
              <div key={s.mediaId} style={{ padding: '16px', background: 'white', borderRadius: 'var(--radius-lg)', border: '1px solid var(--color-neutral-200)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>{s.mediaName}</span>
                  <span style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)' }}>
                    잔여 {s.remainingSlots} / {s.totalSlots}
                  </span>
                </div>
                <div style={{ height: '8px', background: 'var(--color-neutral-100)', borderRadius: '4px', overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${pct}%`, background: barColor, borderRadius: '4px', transition: 'width 0.3s' }} />
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 11: 브라우저 확인**

```
/schedules                → 목록 (동기화 상태 배지 포함)
/schedules/new            → 편성 등록 폼
/schedules/sync           → 동기화 관리, 동기화 버튼 클릭 후 상태 변경
/schedules/emergency      → 긴급 편성 폼 (priority 1 고정)
/schedules/slot-remaining → 매체별 슬롯 진행바
```

- [ ] **Step 12: 커밋**

```bash
git add src/hooks/schedules/ src/components/domain/schedules/ src/app/(dashboard)/schedules/ src/mocks/handlers/schedules.ts
git commit -m "feat(schedule): 목록·등록·동기화·긴급편성·잔여슬롯 페이지 구현"
```
