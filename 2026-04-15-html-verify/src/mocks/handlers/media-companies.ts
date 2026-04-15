import { http, HttpResponse } from 'msw'
import companies from '../fixtures/media-companies.json'

export const mediaCompanyHandlers = [
  http.get('/api/media-companies', () => HttpResponse.json(companies)),
  http.post('/api/media-companies', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-company', ...body as object }, { status: 201 })
  }),
  http.put('/api/media-companies/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body as object })
  }),
]
