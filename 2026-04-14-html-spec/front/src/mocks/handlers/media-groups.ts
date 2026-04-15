import { http, HttpResponse } from 'msw'
import groupsFixtures from '../fixtures/media-groups.json'
import mediaFixtures from '../fixtures/media.json'
import type { MediaGroup, Media } from '@/types/media'

let groups: MediaGroup[] = [...groupsFixtures]

export const mediaGroupHandlers = [
  http.get('/api/media-groups', () => {
    const allMedia = mediaFixtures as Media[]
    const assignedIds = groups.flatMap(g => g.assignedMediaIds)
    const unassigned = allMedia.filter(m => !assignedIds.includes(m.id))
    return HttpResponse.json({ groups, unassigned })
  }),

  http.post('/api/media-groups', async ({ request }) => {
    const body = await request.json() as { name: string }
    const newGroup: MediaGroup = {
      id: `g-${Date.now()}`,
      name: body.name,
      assignedMediaIds: [],
    }
    groups.push(newGroup)
    return HttpResponse.json(newGroup, { status: 201 })
  }),

  http.put('/api/media-groups/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<MediaGroup>
    const idx = groups.findIndex(g => g.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    groups[idx] = { ...groups[idx], ...body }
    return HttpResponse.json(groups[idx])
  }),

  http.delete('/api/media-groups/:id', ({ params }) => {
    const idx = groups.findIndex(g => g.id === params.id)
    if (idx === -1) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    groups.splice(idx, 1)
    return HttpResponse.json({ ok: true })
  }),
]
