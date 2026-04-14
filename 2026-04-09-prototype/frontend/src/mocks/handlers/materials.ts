import { http, HttpResponse } from 'msw'
import materials from '../fixtures/materials.json'

export const materialHandlers = [
  http.get('/api/materials', () => HttpResponse.json(materials)),
  http.get('/api/materials/:id', ({ params }) => {
    const item = materials.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
  http.post('/api/materials', async ({ request }) => {
    const body = await request.json() as Record<string, unknown>
    const newItem = { id: `mat-${Date.now()}`, ...body, createdAt: new Date().toISOString() }
    return HttpResponse.json(newItem, { status: 201 })
  }),
]
