# Task 7: 리포트 도메인 (4 routes)

`billboard.js`는 이미 설치됨 (^3.18.0). 추가 설치 불필요.
`foot-traffic.html`은 유동인구 데이터 연동 설정 페이지 (차트 없음, 연동 설정 테이블).

**Files:**
- Create: `src/hooks/reports/useReports.ts`
- Create: `src/components/domain/reports/ReportStatusBadge.tsx`
- Create: `src/components/domain/reports/ReportTable.tsx`
- Create: `src/components/domain/reports/ReportForm.tsx`
- Create: `src/components/domain/reports/ReportForm.module.css`
- Create: `src/app/(dashboard)/reports/reports.module.css`
- Create: `src/app/(dashboard)/reports/page.tsx`
- Create: `src/app/(dashboard)/reports/new/page.tsx`
- Create: `src/app/(dashboard)/reports/foot-traffic/page.tsx`
- Create: `src/app/(dashboard)/reports/ssp-integration/page.tsx`

---

- [ ] **Step 1: useReports 훅**

`src/hooks/reports/useReports.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Report, ReportInput, FootTraffic, Ssp } from '@/types/report'

const QUERY_KEY = ['reports'] as const

async function fetchReports(): Promise<Report[]> {
  const res = await fetch('/api/reports')
  if (!res.ok) throw new Error('리포트 목록 조회 실패')
  return res.json()
}

async function createReport(input: ReportInput): Promise<Report> {
  const res = await fetch('/api/reports', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(input),
  })
  if (!res.ok) throw new Error('리포트 생성 실패')
  return res.json()
}

async function fetchFootTraffic(): Promise<FootTraffic[]> {
  const res = await fetch('/api/foot-traffic')
  if (!res.ok) throw new Error('유동인구 데이터 조회 실패')
  return res.json()
}

async function fetchSsp(): Promise<Ssp[]> {
  const res = await fetch('/api/ssp')
  if (!res.ok) throw new Error('SSP 조회 실패')
  return res.json()
}

export function useReports() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchReports })
}

export function useCreateReport() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: createReport,
    onSuccess: () => qc.invalidateQueries({ queryKey: QUERY_KEY }),
  })
}

export function useFootTraffic() {
  return useQuery({ queryKey: ['foot-traffic'], queryFn: fetchFootTraffic })
}

export function useSsp() {
  return useQuery({ queryKey: ['ssp'], queryFn: fetchSsp })
}
```

- [ ] **Step 2: ReportStatusBadge**

`src/components/domain/reports/ReportStatusBadge.tsx`:
```tsx
import { Badge } from '@/components/ui/Badge'
import type { Report } from '@/types/report'

const labelMap: Record<Report['status'], string> = {
  ready: '다운로드 가능', generating: '생성중', error: '오류',
}
const variantMap: Record<Report['status'], 'success' | 'warning' | 'error'> = {
  ready: 'success', generating: 'warning', error: 'error',
}

export function ReportStatusBadge({ status }: { status: Report['status'] }) {
  return <Badge variant={variantMap[status]}>{labelMap[status]}</Badge>
}
```

- [ ] **Step 3: ReportTable**

`src/components/domain/reports/ReportTable.tsx`:
```tsx
import { Table, type Column } from '@/components/ui/Table'
import { ReportStatusBadge } from './ReportStatusBadge'
import type { Report } from '@/types/report'

const typeLabel: Record<Report['type'], string> = {
  performance: '성과', campaign: '캠페인', operations: '운영',
}

const columns: Column<Report>[] = [
  { key: 'name', header: '리포트명', render: (r) => r.name },
  { key: 'type', header: '유형', render: (r) => typeLabel[r.type], width: '80px' },
  { key: 'period', header: '기간', render: (r) => r.period },
  { key: 'createdAt', header: '생성일', render: (r) => new Date(r.createdAt).toLocaleDateString('ko-KR'), width: '100px' },
  { key: 'status', header: '상태', render: (r) => <ReportStatusBadge status={r.status} />, width: '120px' },
]

export function ReportTable({ reports }: { reports: Report[] }) {
  return <Table columns={columns} rows={reports} keyExtractor={(r) => r.id} />
}
```

- [ ] **Step 4: ReportForm**

`src/components/domain/reports/ReportForm.tsx`:
```tsx
'use client'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { reportInputSchema, type ReportInput } from '@/types/report'
import { Button } from '@/components/ui/Button'
import styles from './ReportForm.module.css'

interface ReportFormProps {
  onSubmit: (data: ReportInput) => void
  isPending: boolean
}

export function ReportForm({ onSubmit, isPending }: ReportFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm<ReportInput>({
    resolver: zodResolver(reportInputSchema),
    defaultValues: { type: 'performance' },
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>리포트명 *</label>
        <input className={styles.input} {...register('name')} placeholder="리포트명 입력" />
        {errors.name && <span className={styles.error}>{errors.name.message}</span>}
      </div>
      <div className={styles.field}>
        <label className={styles.label}>유형</label>
        <select className={styles.input} {...register('type')}>
          <option value="performance">성과</option>
          <option value="campaign">캠페인</option>
          <option value="operations">운영</option>
        </select>
      </div>
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>시작일 *</label>
          <input className={styles.input} type="date" {...register('startDate')} />
          {errors.startDate && <span className={styles.error}>{errors.startDate.message}</span>}
        </div>
        <div className={styles.field}>
          <label className={styles.label}>종료일 *</label>
          <input className={styles.input} type="date" {...register('endDate')} />
          {errors.endDate && <span className={styles.error}>{errors.endDate.message}</span>}
        </div>
      </div>
      <div className={styles.actions}>
        <Button type="submit" loading={isPending}>리포트 생성</Button>
      </div>
    </form>
  )
}
```

`src/components/domain/reports/ReportForm.module.css`:
```css
.form { display: flex; flex-direction: column; gap: 20px; max-width: 480px; }
.row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field { display: flex; flex-direction: column; gap: 6px; }
.label { font-size: var(--text-sm); font-weight: 500; color: var(--color-neutral-700); }
.input { padding: 8px 12px; border: 1px solid var(--color-neutral-300); border-radius: var(--radius-md); font-size: var(--text-sm); font-family: var(--font-sans); background: white; outline: none; }
.input:focus { border-color: var(--color-primary-500); }
.error { font-size: var(--text-xs); color: var(--color-error-500); }
.actions { display: flex; justify-content: flex-end; padding-top: 8px; }
```

- [ ] **Step 5: 리포트 목록 + 생성 페이지**

`src/app/(dashboard)/reports/reports.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/reports/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useReports } from '@/hooks/reports/useReports'
import { ReportTable } from '@/components/domain/reports/ReportTable'
import { Button } from '@/components/ui/Button'
import styles from './reports.module.css'

export default function ReportsPage() {
  const router = useRouter()
  const { data: reports, isLoading } = useReports()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>리포트</h1>
        <Button onClick={() => router.push('/reports/new')}>+ 리포트 생성</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : <ReportTable reports={reports ?? []} />}
    </div>
  )
}
```

`src/app/(dashboard)/reports/new/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { useCreateReport } from '@/hooks/reports/useReports'
import { ReportForm } from '@/components/domain/reports/ReportForm'
import { useToast } from '@/stores/toast'
import styles from '../reports.module.css'

export default function ReportNewPage() {
  const router = useRouter()
  const mutation = useCreateReport()
  const { add } = useToast()
  return (
    <div className={styles.page}>
      <h1 className={styles.title}>리포트 생성</h1>
      <ReportForm
        isPending={mutation.isPending}
        onSubmit={(data) => mutation.mutate(data, {
          onSuccess: () => { add('리포트 생성이 요청되었습니다', 'success'); router.push('/reports') },
          onError: () => add('생성 실패', 'error'),
        })}
      />
    </div>
  )
}
```

- [ ] **Step 6: 유동인구 데이터 연동 페이지 (foot-traffic.html)**

`src/app/(dashboard)/reports/foot-traffic/page.tsx`:
```tsx
'use client'
import { useFootTraffic } from '@/hooks/reports/useReports'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import styles from '../reports.module.css'

export default function FootTrafficPage() {
  const { data: items, isLoading } = useFootTraffic()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>유동인구 데이터 연동</h1>
        <Button size="sm">+ 연동 추가</Button>
      </div>
      <p style={{ fontSize: 'var(--text-sm)', color: 'var(--color-neutral-500)', margin: 0 }}>
        매체별 유동인구 데이터 포인트 연결 현황을 관리합니다.
      </p>
      {isLoading ? <p>불러오는 중...</p> : (
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 'var(--text-sm)' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid var(--color-neutral-200)' }}>
              {['매체명', '데이터포인트 ID', '최근 수신', '상태', ''].map((h) => (
                <th key={h} style={{ padding: '10px 12px', textAlign: 'left', color: 'var(--color-neutral-500)', fontWeight: 500 }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {items?.map((item) => (
              <tr key={item.id} style={{ borderBottom: '1px solid var(--color-neutral-100)' }}>
                <td style={{ padding: '10px 12px' }}>{item.mediaName}</td>
                <td style={{ padding: '10px 12px', fontFamily: 'monospace' }}>{item.dataPointId}</td>
                <td style={{ padding: '10px 12px', color: 'var(--color-neutral-500)' }}>
                  {item.lastReceived ? new Date(item.lastReceived).toLocaleString('ko-KR') : '-'}
                </td>
                <td style={{ padding: '10px 12px' }}>
                  <Badge variant={item.status === 'connected' ? 'success' : 'error'}>
                    {item.status === 'connected' ? '연결됨' : '오류'}
                  </Badge>
                </td>
                <td style={{ padding: '10px 12px', textAlign: 'right' }}>
                  <Button size="sm" variant="ghost">설정</Button>
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

- [ ] **Step 7: SSP 연동 페이지 (ssp-integration.html)**

`src/app/(dashboard)/reports/ssp-integration/page.tsx`:
```tsx
'use client'
import { useSsp } from '@/hooks/reports/useReports'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import styles from '../reports.module.css'

export default function SspIntegrationPage() {
  const { data: ssps, isLoading } = useSsp()

  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>SSP 연동</h1>
        <Button size="sm">+ SSP 추가</Button>
      </div>
      {isLoading ? <p>불러오는 중...</p> : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {ssps?.map((ssp) => (
            <div key={ssp.id} style={{ padding: '16px 20px', background: 'white', border: '1px solid var(--color-neutral-200)', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <p style={{ fontWeight: 600, fontSize: 'var(--text-sm)', margin: 0 }}>{ssp.name}</p>
                <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', margin: '4px 0 0', fontFamily: 'monospace' }}>{ssp.endpoint}</p>
                {ssp.lastSync && (
                  <p style={{ fontSize: 'var(--text-xs)', color: 'var(--color-neutral-400)', margin: '2px 0 0' }}>
                    최근 동기화: {new Date(ssp.lastSync).toLocaleString('ko-KR')}
                  </p>
                )}
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Badge variant={ssp.status === 'connected' ? 'success' : 'neutral'}>
                  {ssp.status === 'connected' ? '연결됨' : '미연결'}
                </Badge>
                <Button size="sm" variant="secondary">설정</Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
```

- [ ] **Step 8: 브라우저 확인**

```
/reports                  → 목록 (상태 배지 포함)
/reports/new              → 리포트 생성 폼
/reports/foot-traffic     → 유동인구 연동 테이블
/reports/ssp-integration  → SSP 카드 목록
```

- [ ] **Step 9: 커밋**

```bash
git add src/hooks/reports/ src/components/domain/reports/ src/app/(dashboard)/reports/
git commit -m "feat(report): 목록·생성·유동인구연동·SSP연동 페이지 구현"
```
