import { http, HttpResponse } from 'msw'
import reportsData from '../fixtures/reports.json'
import footTrafficData from '../fixtures/foot-traffic.json'
import sspData from '../fixtures/ssp.json'

let reports = [...reportsData]

export const reportHandlers = [
  http.get('/api/reports', ({ request }) => {
    const url = new URL(request.url)
    const type = url.searchParams.get('type')
    const status = url.searchParams.get('status')
    let result = [...reports]
    if (type) result = result.filter(r => r.type === type)
    if (status) result = result.filter(r => r.status === status)
    return HttpResponse.json(result)
  }),
  http.post('/api/reports', async ({ request }) => {
    const body = await request.json() as typeof reports[0]
    const newItem = { ...body, id: `r-${Date.now()}`, status: 'generating' as const, createdAt: new Date().toISOString() }
    reports = [...reports, newItem]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.get('/api/foot-traffic', () => HttpResponse.json(footTrafficData)),
  http.put('/api/foot-traffic', async () => HttpResponse.json({ ok: true })),
  http.get('/api/ssp', () => HttpResponse.json(sspData)),
  http.put('/api/ssp', async () => HttpResponse.json({ ok: true })),
]
