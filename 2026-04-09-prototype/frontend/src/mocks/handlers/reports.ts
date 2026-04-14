import { http, HttpResponse } from 'msw'
import reports from '../fixtures/reports.json'
import footTraffic from '../fixtures/foot-traffic.json'
import ssp from '../fixtures/ssp.json'

export const reportHandlers = [
  http.get('/api/reports', () => HttpResponse.json(reports)),
  http.get('/api/reports/:id', ({ params }) => {
    const item = reports.find((r) => r.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/reports', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `rep-${Date.now()}`, ...body, status: 'generating', createdAt: new Date().toISOString() }
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.get('/api/foot-traffic', () => HttpResponse.json(footTraffic)),
  http.get('/api/ssp', () => HttpResponse.json(ssp)),
]
