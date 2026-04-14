import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

let data = [...schedules]

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(data)),
  http.get('/api/schedules/slot-remaining', () =>
    HttpResponse.json([
      { mediaId: 'med-001', mediaName: '강남대로 전광판', totalSlots: 48, usedSlots: 36, remainingSlots: 12 },
      { mediaId: 'med-002', mediaName: '홍대입구 사이니지', totalSlots: 48, usedSlots: 20, remainingSlots: 28 },
      { mediaId: 'med-004', mediaName: '여의도 IFC 전광판', totalSlots: 48, usedSlots: 45, remainingSlots: 3 },
    ])
  ),
  http.get('/api/schedules/:id', ({ params }) => {
    const item = data.find((s) => s.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/schedules', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `sch-${Date.now()}`, ...body, syncStatus: 'none', syncLagMinutes: null, editingUsers: [] } as unknown as typeof data[0]
    data = [...data, newItem]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/schedules/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((s) => s.id === params.id ? { ...s, ...body } as typeof data[0] : s)
    return HttpResponse.json(data.find((s) => s.id === params.id))
  }),
  http.delete('/api/schedules/:id', ({ params }) => {
    data = data.filter((s) => s.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
  http.post('/api/schedules/:id/sync', ({ params }) => {
    data = data.map((s) => s.id === params.id ? { ...s, syncStatus: 'ok', syncLagMinutes: null } as typeof data[0] : s)
    return HttpResponse.json({ success: true })
  }),
]
