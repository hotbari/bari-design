# Task 6: 플레이리스트 도메인 (2 routes)

`@dnd-kit` 드래그 앤 드롭 사용. Task 0에서 설치 완료 전제.

**Files:**
- Modify: `src/mocks/handlers/playlists.ts` (상세 + slots 추가)
- Create: `src/hooks/playlists/usePlaylists.ts`
- Create: `src/components/domain/playlists/PlaylistEditor.tsx`
- Create: `src/components/domain/playlists/PlaylistEditor.module.css`
- Create: `src/app/(dashboard)/playlists/playlists.module.css`
- Create: `src/app/(dashboard)/playlists/page.tsx`
- Create: `src/app/(dashboard)/playlists/[id]/edit/page.tsx`

---

- [ ] **Step 1: playlists 핸들러 업데이트**

`src/mocks/handlers/playlists.ts`:
```ts
import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

const detailData: Record<string, { id: string; name: string; slotCount: number; duration: number; slots: Array<{ id: string; materialId: string; materialName: string; duration: number; order: number }> }> = {
  'pl-001': {
    id: 'pl-001', name: '강남권 4월 운영 재생목록', slotCount: 3, duration: 65,
    slots: [
      { id: 'slot-001', materialId: 'mat-001', materialName: '갤럭시 S26 15초', duration: 15, order: 0 },
      { id: 'slot-002', materialId: 'mat-002', materialName: '오휘 봄 30초', duration: 30, order: 1 },
      { id: 'slot-003', materialId: 'mat-003', materialName: '배민 봄맞이 20초', duration: 20, order: 2 },
    ],
  },
  'pl-002': {
    id: 'pl-002', name: '신촌 스프링 캠페인 재생목록', slotCount: 2, duration: 45,
    slots: [
      { id: 'slot-004', materialId: 'mat-001', materialName: '갤럭시 S26 15초', duration: 15, order: 0 },
      { id: 'slot-005', materialId: 'mat-003', materialName: '배민 봄맞이 20초', duration: 30, order: 1 },
    ],
  },
}

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(playlists)),
  http.get('/api/playlists/:id', ({ params }) => {
    const item = detailData[params.id as string]
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.put('/api/playlists/:id/slots', async ({ params, request }) => {
    const body = await request.json() as { slots: typeof detailData['pl-001']['slots'] }
    if (detailData[params.id as string]) {
      detailData[params.id as string].slots = body.slots
    }
    return HttpResponse.json({ success: true })
  }),
]
```

- [ ] **Step 2: usePlaylists 훅**

`src/hooks/playlists/usePlaylists.ts`:
```ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Playlist, PlaylistSlot } from '@/types/playlist'

const QUERY_KEY = ['playlists'] as const
const detailKey = (id: string) => ['playlists', id] as const

async function fetchPlaylists(): Promise<Playlist[]> {
  const res = await fetch('/api/playlists')
  if (!res.ok) throw new Error('플레이리스트 목록 조회 실패')
  return res.json()
}

async function fetchPlaylistDetail(id: string): Promise<Playlist> {
  const res = await fetch(`/api/playlists/${id}`)
  if (!res.ok) throw new Error('플레이리스트 조회 실패')
  return res.json()
}

async function updatePlaylistSlots(id: string, slots: PlaylistSlot[]): Promise<void> {
  const res = await fetch(`/api/playlists/${id}/slots`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ slots }),
  })
  if (!res.ok) throw new Error('슬롯 저장 실패')
}

export function usePlaylists() {
  return useQuery({ queryKey: QUERY_KEY, queryFn: fetchPlaylists })
}

export function usePlaylistDetail(id: string) {
  return useQuery({ queryKey: detailKey(id), queryFn: () => fetchPlaylistDetail(id) })
}

export function useUpdatePlaylistSlots(id: string) {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (slots: PlaylistSlot[]) => updatePlaylistSlots(id, slots),
    onSuccess: () => qc.invalidateQueries({ queryKey: detailKey(id) }),
  })
}
```

- [ ] **Step 3: PlaylistEditor 컴포넌트**

`src/components/domain/playlists/PlaylistEditor.tsx`:
```tsx
'use client'
import { useState } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import type { PlaylistSlot } from '@/types/playlist'
import { Button } from '@/components/ui/Button'
import styles from './PlaylistEditor.module.css'

function SortableSlot({ slot }: { slot: PlaylistSlot }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id: slot.id })
  return (
    <div
      ref={setNodeRef}
      style={{ transform: CSS.Transform.toString(transform), transition, opacity: isDragging ? 0.5 : 1 }}
      className={styles.slot}
      {...attributes}
    >
      <span className={styles.handle} {...listeners}>⠿</span>
      <span className={styles.slotName}>{slot.materialName}</span>
      <span className={styles.duration}>{slot.duration}초</span>
    </div>
  )
}

interface PlaylistEditorProps {
  initialSlots: PlaylistSlot[]
  onSave: (slots: PlaylistSlot[]) => void
  isPending: boolean
}

export function PlaylistEditor({ initialSlots, onSave, isPending }: PlaylistEditorProps) {
  const [slots, setSlots] = useState<PlaylistSlot[]>(initialSlots)
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  )

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (over && active.id !== over.id) {
      setSlots((prev) => {
        const oldIndex = prev.findIndex((s) => s.id === active.id)
        const newIndex = prev.findIndex((s) => s.id === over.id)
        return arrayMove(prev, oldIndex, newIndex).map((s, i) => ({ ...s, order: i }))
      })
    }
  }

  const totalDuration = slots.reduce((sum, s) => sum + s.duration, 0)

  return (
    <div className={styles.editor}>
      <div className={styles.editorHeader}>
        <span className={styles.slotCount}>{slots.length}개 소재 · 총 {totalDuration}초</span>
        <Button size="sm" loading={isPending} onClick={() => onSave(slots)}>순서 저장</Button>
      </div>
      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={slots.map((s) => s.id)} strategy={verticalListSortingStrategy}>
          {slots.map((slot) => <SortableSlot key={slot.id} slot={slot} />)}
        </SortableContext>
      </DndContext>
    </div>
  )
}
```

`src/components/domain/playlists/PlaylistEditor.module.css`:
```css
.editor { display: flex; flex-direction: column; gap: 12px; }
.editorHeader { display: flex; align-items: center; justify-content: space-between; padding-bottom: 8px; border-bottom: 1px solid var(--color-neutral-200); }
.slotCount { font-size: var(--text-sm); color: var(--color-neutral-500); }
.slot {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  background: white;
  border: 1px solid var(--color-neutral-200);
  border-radius: var(--radius-md);
  user-select: none;
}
.handle { cursor: grab; color: var(--color-neutral-400); font-size: 18px; line-height: 1; }
.handle:active { cursor: grabbing; }
.slotName { flex: 1; font-size: var(--text-sm); }
.duration { font-size: var(--text-xs); color: var(--color-neutral-500); }
```

- [ ] **Step 4: 플레이리스트 목록 페이지**

`src/app/(dashboard)/playlists/playlists.module.css`:
```css
.page { padding: 24px; display: flex; flex-direction: column; gap: 16px; }
.header { display: flex; align-items: center; justify-content: space-between; }
.title { font-size: 20px; font-weight: 600; color: var(--color-neutral-900); margin: 0; }
```

`src/app/(dashboard)/playlists/page.tsx`:
```tsx
'use client'
import { useRouter } from 'next/navigation'
import { usePlaylists } from '@/hooks/playlists/usePlaylists'
import { Table, type Column } from '@/components/ui/Table'
import type { Playlist } from '@/types/playlist'
import styles from './playlists.module.css'

const columns: Column<Playlist>[] = [
  { key: 'name', header: '플레이리스트명', render: (r) => r.name },
  { key: 'slotCount', header: '슬롯 수', render: (r) => `${r.slotCount}개`, width: '80px' },
  { key: 'duration', header: '총 재생시간', render: (r) => `${r.duration}초`, width: '100px' },
]

export default function PlaylistsPage() {
  const router = useRouter()
  const { data: playlists, isLoading } = usePlaylists()
  return (
    <div className={styles.page}>
      <div className={styles.header}>
        <h1 className={styles.title}>플레이리스트</h1>
      </div>
      {isLoading ? <p>불러오는 중...</p> : (
        <Table
          columns={columns}
          rows={playlists ?? []}
          keyExtractor={(r) => r.id}
          onRowClick={(r) => router.push(`/playlists/${r.id}/edit`)}
        />
      )}
    </div>
  )
}
```

- [ ] **Step 5: 플레이리스트 편집 페이지**

`src/app/(dashboard)/playlists/[id]/edit/page.tsx`:
```tsx
'use client'
import { useParams } from 'next/navigation'
import { usePlaylistDetail, useUpdatePlaylistSlots } from '@/hooks/playlists/usePlaylists'
import { PlaylistEditor } from '@/components/domain/playlists/PlaylistEditor'
import { useToast } from '@/stores/toast'
import styles from '../../playlists.module.css'

export default function PlaylistEditPage() {
  const { id } = useParams<{ id: string }>()
  const { data: playlist, isLoading } = usePlaylistDetail(id)
  const mutation = useUpdatePlaylistSlots(id)
  const { add } = useToast()

  if (isLoading) return <p style={{ padding: '24px' }}>불러오는 중...</p>
  if (!playlist) return <p style={{ padding: '24px' }}>플레이리스트를 찾을 수 없습니다</p>

  return (
    <div className={styles.page}>
      <h1 className={styles.title}>{playlist.name}</h1>
      <PlaylistEditor
        initialSlots={playlist.slots ?? []}
        isPending={mutation.isPending}
        onSave={(slots) => mutation.mutate(slots, {
          onSuccess: () => add('순서가 저장되었습니다', 'success'),
          onError: () => add('저장 실패', 'error'),
        })}
      />
    </div>
  )
}
```

- [ ] **Step 6: 드래그 동작 확인**

```
/playlists            → 목록, 행 클릭 시 편집 이동
/playlists/pl-001/edit → 슬롯 목록, 드래그로 순서 변경, 저장 버튼 클릭 후 토스트 확인
```

- [ ] **Step 7: 커밋**

```bash
git add src/hooks/playlists/ src/components/domain/playlists/ src/app/(dashboard)/playlists/ src/mocks/handlers/playlists.ts
git commit -m "feat(playlist): 목록·편집(dnd-kit 드래그) 페이지 구현"
```
