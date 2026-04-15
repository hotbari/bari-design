import { http, HttpResponse } from 'msw'
import reports from '../fixtures/reports.json'

export const reportHandlers = [
  http.get('/api/reports', () => HttpResponse.json(reports)),
  http.post('/api/reports', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-report', status: 'generating', ...body as object }, { status: 201 })
  }),
]
