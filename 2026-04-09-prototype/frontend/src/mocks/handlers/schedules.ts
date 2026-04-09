import { http, HttpResponse } from 'msw'
import schedules from '../fixtures/schedules.json'

export const scheduleHandlers = [
  http.get('/api/schedules', () => HttpResponse.json(schedules)),
  http.get('/api/schedules/:id', ({ params }) => {
    const item = schedules.find((s) => s.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
