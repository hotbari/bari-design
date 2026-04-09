import { http, HttpResponse } from 'msw'
import campaigns from '../fixtures/campaigns.json'

export const campaignHandlers = [
  http.get('/api/campaigns', () => HttpResponse.json(campaigns)),
  http.get('/api/campaigns/:id', ({ params }) => {
    const item = campaigns.find((c) => c.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
