import { http, HttpResponse } from 'msw'
import campaigns from '../fixtures/campaigns.json'

export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(campaigns)),
  http.get('/api/campaigns/:id', ({ params }) =>
    HttpResponse.json(campaigns.find((c: any) => c.id === params.id) ?? null)
  ),
  http.post('/api/campaigns', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-1', ...body as object }, { status: 201 })
  }),
  http.put('/api/campaigns/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body as object })
  }),
]
