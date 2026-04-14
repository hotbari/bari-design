import { http, HttpResponse } from 'msw'
import campaigns from '../fixtures/campaigns.json'

let data = [...campaigns]

export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(data)),
  http.get('/api/campaigns/:id', ({ params }) => {
    const item = data.find((c) => c.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/campaigns', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `camp-${Date.now()}`, ...body }
    data = [...data, newItem as typeof data[0]]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/campaigns/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((c) => c.id === params.id ? { ...c, ...body } : c)
    return HttpResponse.json(data.find((c) => c.id === params.id))
  }),
  http.delete('/api/campaigns/:id', ({ params }) => {
    data = data.filter((c) => c.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
