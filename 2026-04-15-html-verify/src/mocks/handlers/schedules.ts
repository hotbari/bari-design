import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(schedules)),
  http.get('/api/schedules/slot-remaining', () =>
    HttpResponse.json({ slots: [] })
  ),
  http.get('/api/schedules/:id', ({ params }) =>
    HttpResponse.json(schedules.find((s: any) => s.id === params.id) ?? null)
  ),
  http.post('/api/schedules', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-sch', ...body as object }, { status: 201 })
  }),
  http.put('/api/schedules/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body as object })
  }),
]
