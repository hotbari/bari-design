import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

let data = [...media]

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(data)),
  http.get('/api/media/:id', ({ params }) => {
    const item = data.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/media', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `med-${Date.now()}`, ...body }
    data = [...data, newItem as typeof data[0]]
    return HttpResponse.json(newItem, { status: 201 })
  }),
  http.put('/api/media/:id', async ({ params, request }) => {
    const body = await request.json() as Record<string, unknown>
    data = data.map((m) => m.id === params.id ? { ...m, ...body } : m)
    return HttpResponse.json(data.find((m) => m.id === params.id))
  }),
  http.delete('/api/media/:id', ({ params }) => {
    data = data.filter((m) => m.id !== params.id)
    return new HttpResponse(null, { status: 204 })
  }),
]
