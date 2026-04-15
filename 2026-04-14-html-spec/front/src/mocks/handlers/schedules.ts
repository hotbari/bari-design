import { http, HttpResponse } from 'msw'
import type { Schedule } from '@/types/schedule'
import fixture from '../fixtures/schedules.json'

let schedules = fixture.schedules as Schedule[]
const slotRemaining = [...fixture.slotRemaining]

export const scheduleHandlers = [
  http.get('/api/schedules', ({ request }) => {
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const mediaId = url.searchParams.get('mediaId')
    const search = url.searchParams.get('search')?.toLowerCase()
    let result = [...schedules]
    if (status) result = result.filter(s => s.status === status)
    if (mediaId) result = result.filter(s => s.mediaId === mediaId)
    if (search) result = result.filter(s => s.name.toLowerCase().includes(search))
    return HttpResponse.json(result)
  }),
  http.get('/api/schedules/slot-remaining', () => HttpResponse.json(slotRemaining)),
  http.get('/api/schedules/:id', ({ params }) => {
    const item = schedules.find(s => s.id === params.id)
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.post('/api/schedules', async ({ request }) => {
    const body = await request.json() as typeof schedules[0]
    const newItem = { ...body, id: `sch-${Date.now()}`, createdAt: new Date().toISOString() }
    schedules = [...schedules, newItem]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/schedules/:id', async ({ params, request }) => {
    const body = await request.json() as Partial<typeof schedules[0]>
    schedules = schedules.map(s => s.id === params.id ? { ...s, ...body } : s)
    return HttpResponse.json(schedules.find(s => s.id === params.id))
  }),
  http.post('/api/emergency', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ ok: true, message: '긴급 편성이 등록되었습니다.', body })
  }),
  http.get('/api/sync', () => HttpResponse.json(schedules.map(s => ({ id: s.id, name: s.name, syncStatus: s.syncStatus })))),
  http.post('/api/sync', async () => {
    schedules = schedules.map(s => ({ ...s, syncStatus: 'sync-ok' as const }))
    return HttpResponse.json({ ok: true, message: '동기화가 완료되었습니다.' })
  }),
]
