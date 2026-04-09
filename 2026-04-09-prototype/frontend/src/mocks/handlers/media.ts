import { http, HttpResponse } from 'msw'
import media from '../fixtures/media.json'

export const mediaHandlers = [
  http.get('/api/media', () => HttpResponse.json(media)),
  http.get('/api/media/:id', ({ params }) => {
    const item = media.find((m) => m.id === params.id)
    return item ? HttpResponse.json(item) : new HttpResponse(null, { status: 404 })
  }),
]
