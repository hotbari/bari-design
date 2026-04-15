import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(media)),
  http.get('/api/media/:id', ({ params }) =>
    HttpResponse.json(media.find((m: any) => m.id === params.id) ?? null)
  ),
  http.post('/api/media', async ({ request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: 'new-media', ...body as object }, { status: 201 })
  }),
  http.put('/api/media/:id', async ({ params, request }) => {
    const body = await request.json()
    return HttpResponse.json({ id: params.id, ...body as object })
  }),
]
