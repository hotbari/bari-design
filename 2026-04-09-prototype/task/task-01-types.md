# Task 1: 타입 정의 (7개 도메인)

**Files:**
- Create: `src/types/campaign.ts`
- Create: `src/types/media.ts`
- Create: `src/types/material.ts`
- Create: `src/types/schedule.ts`
- Create: `src/types/playlist.ts`
- Create: `src/types/report.ts`
- Create: `src/types/user.ts`

각 파일: zod 스키마 → `z.infer<>` 타입. 폼 입력(Input)과 API 응답(전체 타입) 분리.

---

- [ ] **Step 1: campaign 타입 생성**

`src/types/campaign.ts`:
```ts
import { z } from 'zod'

export const campaignSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'done', 'pending', 'paused']),
  advertiser: z.string(),
})

export const campaignInputSchema = z.object({
  name: z.string().min(1, '캠페인명을 입력하세요'),
  advertiser: z.string().min(1, '광고주를 입력하세요'),
  status: z.enum(['active', 'pending', 'paused']),
})

export type Campaign = z.infer<typeof campaignSchema>
export type CampaignInput = z.infer<typeof campaignInputSchema>
```

- [ ] **Step 2: media 타입 생성**

`src/types/media.ts`:
```ts
import { z } from 'zod'

export const mediaSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'maintenance', 'inactive']),
  type: z.enum(['billboard', 'signage', 'display', 'screen']),
  location: z.string(),
})

export const mediaInputSchema = z.object({
  name: z.string().min(1, '매체명을 입력하세요'),
  type: z.enum(['billboard', 'signage', 'display', 'screen']),
  location: z.string().min(1, '위치를 입력하세요'),
  status: z.enum(['active', 'maintenance', 'inactive']),
})

export type Media = z.infer<typeof mediaSchema>
export type MediaInput = z.infer<typeof mediaInputSchema>
```

- [ ] **Step 3: material 타입 생성**

`src/types/material.ts`:
```ts
import { z } from 'zod'

export const materialSchema = z.object({
  id: z.string(),
  name: z.string(),
  advertiser: z.string(),
  mediaId: z.string(),
  mediaName: z.string(),
  resolution: z.string(),
  duration: z.number(),
  reviewStatus: z.enum(['approved', 'pending', 'rejected']),
  scheduleLinked: z.boolean(),
  status: z.enum(['active', 'inactive']),
  createdAt: z.string(),
})

export const materialInputSchema = z.object({
  name: z.string().min(1, '소재명을 입력하세요'),
  advertiser: z.string().min(1, '광고주를 입력하세요'),
  mediaId: z.string().min(1, '매체를 선택하세요'),
  resolution: z.string().min(1, '해상도를 입력하세요'),
  duration: z.number().min(1, '재생시간을 입력하세요'),
})

export type Material = z.infer<typeof materialSchema>
export type MaterialInput = z.infer<typeof materialInputSchema>
```

- [ ] **Step 4: schedule 타입 생성**

`src/types/schedule.ts`:
```ts
import { z } from 'zod'

export const scheduleSchema = z.object({
  id: z.string(),
  name: z.string(),
  status: z.enum(['active', 'pending', 'done', 'paused']),
  priority: z.number(),
  mediaNames: z.array(z.string()),
  startAt: z.string(),
  endAt: z.string(),
  playlistName: z.string(),
  campaignName: z.string().nullable(),
  syncStatus: z.enum(['ok', 'lag', 'none']),
  syncLagMinutes: z.number().nullable(),
  editingUsers: z.array(z.string()),
})

export const scheduleInputSchema = z.object({
  name: z.string().min(1, '편성명을 입력하세요'),
  priority: z.number().min(1).max(5),
  mediaIds: z.array(z.string()).min(1, '매체를 선택하세요'),
  startAt: z.string().min(1, '시작일을 입력하세요'),
  endAt: z.string().min(1, '종료일을 입력하세요'),
  playlistId: z.string().min(1, '플레이리스트를 선택하세요'),
  campaignId: z.string().optional(),
})

export type Schedule = z.infer<typeof scheduleSchema>
export type ScheduleInput = z.infer<typeof scheduleInputSchema>
```

- [ ] **Step 5: playlist 타입 생성**

`src/types/playlist.ts`:
```ts
import { z } from 'zod'

export const playlistSlotSchema = z.object({
  id: z.string(),
  materialId: z.string(),
  materialName: z.string(),
  duration: z.number(),
  order: z.number(),
})

export const playlistSchema = z.object({
  id: z.string(),
  name: z.string(),
  slotCount: z.number(),
  duration: z.number(),
  slots: z.array(playlistSlotSchema).optional(),
})

export const playlistInputSchema = z.object({
  name: z.string().min(1, '플레이리스트명을 입력하세요'),
})

export type PlaylistSlot = z.infer<typeof playlistSlotSchema>
export type Playlist = z.infer<typeof playlistSchema>
export type PlaylistInput = z.infer<typeof playlistInputSchema>
```

- [ ] **Step 6: report 타입 생성**

`src/types/report.ts`:
```ts
import { z } from 'zod'

export const reportSchema = z.object({
  id: z.string(),
  name: z.string(),
  type: z.enum(['performance', 'campaign', 'operations']),
  period: z.string(),
  createdAt: z.string(),
  status: z.enum(['ready', 'generating', 'error']),
})

export const reportInputSchema = z.object({
  name: z.string().min(1, '리포트명을 입력하세요'),
  type: z.enum(['performance', 'campaign', 'operations']),
  startDate: z.string().min(1, '시작일을 입력하세요'),
  endDate: z.string().min(1, '종료일을 입력하세요'),
})

export const footTrafficSchema = z.object({
  id: z.string(),
  mediaId: z.string(),
  mediaName: z.string(),
  dataPointId: z.string(),
  lastReceived: z.string().nullable(),
  status: z.enum(['connected', 'error', 'disconnected']),
})

export const sspSchema = z.object({
  id: z.string(),
  name: z.string(),
  endpoint: z.string(),
  status: z.enum(['connected', 'disconnected', 'error']),
  lastSync: z.string().nullable(),
})

export type Report = z.infer<typeof reportSchema>
export type ReportInput = z.infer<typeof reportInputSchema>
export type FootTraffic = z.infer<typeof footTrafficSchema>
export type Ssp = z.infer<typeof sspSchema>
```

- [ ] **Step 7: user 타입 생성**

`src/types/user.ts`:
```ts
import { z } from 'zod'

export const userSchema = z.object({
  id: z.string(),
  name: z.string(),
  role: z.enum(['admin', 'operator', 'agency']),
  email: z.string().email(),
})

export const userInviteSchema = z.object({
  email: z.string().email('유효한 이메일을 입력하세요'),
  name: z.string().min(1, '이름을 입력하세요'),
  role: z.enum(['admin', 'operator', 'agency']),
})

export type User = z.infer<typeof userSchema>
export type UserInvite = z.infer<typeof userInviteSchema>
```

- [ ] **Step 8: TypeScript 컴파일 확인**

```bash
npx tsc --noEmit
```

Expected: 오류 없음

- [ ] **Step 9: 커밋**

```bash
git add src/types/
git commit -m "feat: 7개 도메인 Zod 스키마 + 타입 정의"
```
