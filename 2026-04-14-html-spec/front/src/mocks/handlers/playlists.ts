import { http, HttpResponse } from 'msw'
import playlists from '../fixtures/playlists.json'

let data = [...playlists]

export const playlistHandlers = [
  http.get('/api/playlists', () => HttpResponse.json(data)),
  http.get('/api/playlists/:id', ({ params }) => {
    const item = data.find(p => p.id === params.id)
    if (!item) return HttpResponse.json({ message: 'Not found' }, { status: 404 })
    return HttpResponse.json(item)
  }),
  http.put('/api/playlists/:id', async ({ params, request }) => {
    const body = await request.json() as { items: typeof data[0]['items'] }
    data = data.map(p => {
      if (p.id !== params.id) return p
      const totalDuration = body.items.reduce((s, i) => s + i.duration, 0)
      return { ...p, items: body.items, totalDuration, itemCount: body.items.length, updatedAt: new Date().toISOString() }
    })
    return HttpResponse.json(data.find(p => p.id === params.id))
  }),
]
